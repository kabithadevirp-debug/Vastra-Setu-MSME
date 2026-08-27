import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Download, 
  ExternalLink,
  Award,
  TrendingUp,
  Activity,
  Layers,
  Filter,
  Eye,
  XCircle,
  Flag,
  Radio,
  FileSpreadsheet,
  Check,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function AuditorPortalPage({ navigate }) {
  const { showToast } = useApp() || {};

  // Tab State: 'LEADERBOARD', 'FRAUD', 'REGISTRY', 'HEATMAP'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'fraud') return 'FRAUD';
    if (tabParam === 'registry') return 'REGISTRY';
    if (tabParam === 'heatmap') return 'HEATMAP';
    return 'LEADERBOARD';
  });

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const tabParam = newTab.toLowerCase();
    const newUrl = `${window.location.pathname}?tab=${tabParam}`;
    window.history.pushState(null, '', newUrl);
  };

  // Data states
  const [summary, setSummary] = useState({
    auditCoverage: '100%',
    avgRegionZldIndex: '94.2%',
    activeFraudAlerts: 2,
    inspectionOrdersIssued: 0,
    cpcbReportingStatus: 'COMPLIANT'
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [fraudFlags, setFraudFlags] = useState([]);
  const [inspectionOrders, setInspectionOrders] = useState([]);
  const [statutoryRegistry, setStatutoryRegistry] = useState([]);
  const [clusterHeatmap, setClusterHeatmap] = useState([]);
  const [registrySearch, setRegistrySearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('Tiruppur');
  const [loading, setLoading] = useState(true);

  // Escalate Modal State
  const [escalatingFlag, setEscalatingFlag] = useState(null);
  const [inspectionReason, setInspectionReason] = useState('');

  // Fetch all Auditor Data
  const fetchAuditorData = async () => {
    setLoading(true);
    try {
      // 1. Summary
      const sRes = await fetch('/api/auditor/summary');
      const sJson = await sRes.json();
      if (sJson.success && sJson.data) {
        setSummary(sJson.data);
      }

      // 2. Leaderboard
      const lRes = await fetch(`/api/auditor/leaderboard?cluster=${encodeURIComponent(selectedCluster)}`);
      const lJson = await lRes.json();
      if (lJson.success && lJson.data) {
        setLeaderboard(lJson.data);
      }

      // 3. Fraud Flags
      const fRes = await fetch('/api/auditor/fraud-flags');
      const fJson = await fRes.json();
      if (fJson.success && fJson.data) {
        setFraudFlags(fJson.data);
      }

      // 4. Inspection Orders
      const oRes = await fetch('/api/auditor/inspection-orders');
      const oJson = await oRes.json();
      if (oJson.success && oJson.data) {
        setInspectionOrders(oJson.data);
      }

      // 5. Statutory Registry
      const rRes = await fetch(`/api/auditor/statutory-registry?search=${encodeURIComponent(registrySearch)}`);
      const rJson = await rRes.json();
      if (rJson.success && rJson.data) {
        setStatutoryRegistry(rJson.data);
      }

      // 6. Cluster Heatmap
      const hRes = await fetch('/api/auditor/cluster-heatmap');
      const hJson = await hRes.json();
      if (hJson.success && hJson.data) {
        setClusterHeatmap(hJson.data);
      }

    } catch (err) {
      console.warn('Error loading auditor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditorData();
  }, [selectedCluster, registrySearch]);

  // Handle Escalate Flag to Inspection Order
  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    if (!escalatingFlag) return;

    try {
      const res = await fetch(`/api/auditor/fraud-flags/${escalatingFlag.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditorId: 'Dr. V. Rajeshwaran (Chief Environmental Auditor)',
          reason: inspectionReason || escalatingFlag.description
        })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        if (showToast) showToast(`Statutory Inspection Notice #${json.data.orderNumber} Issued!`, 'success');
        setEscalatingFlag(null);
        setInspectionReason('');
        fetchAuditorData();
      }
    } catch (err) {
      alert('Error escalating flag: ' + err.message);
    }
  };

  // Handle Dismiss Flag
  const handleDismissFlag = async (flagId) => {
    try {
      const res = await fetch(`/api/auditor/fraud-flags/${flagId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISMISSED' })
      });
      const json = await res.json();
      if (json.success) {
        if (showToast) showToast('Fraud alert marked as dismissed.', 'info');
        fetchAuditorData();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Export Combined Audit CSV
  const handleExportAuditCsv = () => {
    const headers = ['Record Type', 'Entity Name', 'GSTIN / ID', 'Status / Metric', 'Details / Description', 'Timestamp'];
    const rows = [];

    fraudFlags.forEach(f => {
      rows.push(['FRAUD_FLAG', `"${f.msmeName}"`, f.gstin, f.severity, `"${f.description}"`, f.detectedAt || '']);
    });

    inspectionOrders.forEach(o => {
      rows.push(['INSPECTION_ORDER', `"${o.msmeName}"`, o.orderNumber, o.status, `"${o.reason}"`, o.issuedAt || '']);
    });

    leaderboard.forEach(l => {
      rows.push(['LEADERBOARD', `"${l.name}"`, l.gstin, `Trust Score ${l.trustScore}`, `ZLD ${l.waterRecycled} • Carbon ${l.carbonPerPiece}`, 'Current']);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TNPCB_Regulatory_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. TOP AUDITOR BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Government & Regulatory Compliance Audit Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Pollution Board & Ministry Compliance Audit
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Tamil Nadu Pollution Control Board (TNPCB) & Central Pollution Control Board (CPCB) Regional Textile Cluster Enforcement System
          </p>
        </div>
      </div>

      {/* 2. REAL DB-BACKED 4 STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => handleTabChange('LEADERBOARD')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Audit Coverage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">{summary.auditCoverage}</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            DPI Merkle Provenance
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('HEATMAP')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-cyan-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Avg Region ZLD Index</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-800 font-display">
            {summary.avgRegionZldIndex}
          </p>
          <span className="text-[11px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 inline-block">
            MBR + 3-Stage RO
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('FRAUD')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Active Fraud Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700 font-display">
            {summary.activeFraudAlerts} Cases
          </p>
          <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
            Physics Ratio Anomalies
          </span>
        </div>

        <div 
          onClick={handleExportAuditCsv}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-zinc-400 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Audit Trail Export</span>
            <Download className="w-4 h-4 text-zinc-700" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">Download</p>
          <span className="text-[11px] text-zinc-700 font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 inline-block">
            Click to Export CSV
          </span>
        </div>
      </div>

      {/* 3. TABS ROW */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => handleTabChange('LEADERBOARD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LEADERBOARD'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Regional Green Leaderboard ({leaderboard.length})
        </button>
        <button
          onClick={() => handleTabChange('FRAUD')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'FRAUD'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Fraud & Anomaly Queue ({summary.activeFraudAlerts})
        </button>
        <button
          onClick={() => handleTabChange('REGISTRY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REGISTRY'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Statutory Registry (IEC / PCB)
        </button>
        <button
          onClick={() => handleTabChange('HEATMAP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'HEATMAP'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Cluster ZLD Heatmap
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: REGIONAL GREEN LEADERBOARD */}
      {/* ======================================================== */}
      {activeTab === 'LEADERBOARD' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">Tiruppur Cluster Environmental Leaderboard</h2>
              <p className="text-xs text-zinc-500">Statutory ESG ranking of textile processing units based on Merkle-verified operational data.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700"
              >
                <option value="Tiruppur">Tiruppur Cluster (Tamil Nadu)</option>
                <option value="Coimbatore">Coimbatore Processing Hub</option>
                <option value="Surat">Surat Synthetic Cluster</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Enterprise Name & GSTIN</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">ZLD Water Recovery</th>
                  <th className="py-3 px-4">Carbon / Piece</th>
                  <th className="py-3 px-4">Statutory Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leaderboard.map((m, idx) => (
                  <tr key={m.id || idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-zinc-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block font-sans">{m.name}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{m.gstin} • {m.location}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {m.trustScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-800">{m.waterRecycled}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">{m.carbonPerPiece}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Class 1 Zero Discharge
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FRAUD & ANOMALY QUEUE (Connected to Inspection Orders) */}
      {/* ======================================================== */}
      {activeTab === 'FRAUD' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                  Physics-Based Fraud & Anomaly Queue
                </h2>
                <p className="text-xs text-zinc-500">
                  Cross-checks declared fabric volume against TANGEDCO power consumption and CETP effluent intake meters.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {fraudFlags.map((flag) => {
                const isEscalated = flag.status === 'ESCALATED';
                const isDismissed = flag.status === 'DISMISSED';

                return (
                  <div
                    key={flag.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isEscalated
                        ? 'border-indigo-300 bg-indigo-50/40'
                        : isDismissed
                        ? 'border-zinc-200 bg-zinc-50 opacity-60'
                        : 'border-rose-300 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          {flag.severity} SEVERITY
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-900">{flag.flagType}</span>
                      </div>

                      <span className="text-[11px] text-zinc-400 font-mono">
                        Detected: {flag.detectedAt ? new Date(flag.detectedAt).toLocaleString() : 'Recent'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-zinc-900">{flag.msmeName}</h3>
                      <p className="text-xs text-zinc-400 font-mono">GSTIN: {flag.gstin}</p>
                    </div>

                    <p className="text-xs text-zinc-700 bg-white/80 p-3 rounded-xl border border-zinc-200/80 leading-relaxed">
                      {flag.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-[11px] font-mono text-zinc-600">
                        Trigger: <strong className="text-rose-700">{flag.triggerData}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isEscalated && !isDismissed && (
                          <>
                            <button
                              onClick={() => {
                                setEscalatingFlag(flag);
                                setInspectionReason(flag.description);
                              }}
                              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>Escalate to Statutory Inspection</span>
                            </button>

                            <button
                              onClick={() => handleDismissFlag(flag.id)}
                              className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all"
                            >
                              Dismiss Alert
                            </button>
                          </>
                        )}

                        {isEscalated && (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Inspection Order Issued</span>
                          </span>
                        )}

                        {isDismissed && (
                          <span className="px-3 py-1 bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl">
                            Dismissed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE STATUTORY INSPECTION ORDERS SECTION */}
          {inspectionOrders.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-zinc-900 font-display">
                  Active TNPCB Statutory Inspection Orders ({inspectionOrders.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Order Number</th>
                      <th className="py-3 px-4">Enterprise</th>
                      <th className="py-3 px-4">Reason for Inspection</th>
                      <th className="py-3 px-4">Auditor</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {inspectionOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{o.orderNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-zinc-900">{o.msmeName}</td>
                        <td className="py-3.5 px-4 text-zinc-600 max-w-xs truncate">{o.reason}</td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">{o.auditorId}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STATUTORY REGISTRY (IEC / PCB / Udyam) */}
      {/* ======================================================== */}
      {activeTab === 'REGISTRY' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">Statutory Registration Directory (IEC / PCB)</h2>
              <p className="text-xs text-zinc-500">Official Directorate General of Foreign Trade (DGFT) & Pollution Board registry cross-checks.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search IEC, GSTIN, MSME..."
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">MSME Name & GSTIN</th>
                  <th className="py-3 px-4">Import Export Code (IEC)</th>
                  <th className="py-3 px-4">PCB Consent (CTO)</th>
                  <th className="py-3 px-4">Udyam Registration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {statutoryRegistry.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block font-sans">{item.msmeName}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{item.gstin}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {item.iecNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">
                      {item.pcbConsentNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">
                      {item.udyamNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CLUSTER ZLD HEATMAP */}
      {/* ======================================================== */}
      {activeTab === 'HEATMAP' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-extrabold text-zinc-900 font-display">Textile Cluster ZLD Compliance Heatmap</h2>
            <p className="text-xs text-zinc-500">Cross-regional environmental compliance matrix comparing water recovery, Trust Scores, and active CETPs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clusterHeatmap.map((c, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      {c.region}
                    </span>
                    <h3 className="text-base font-extrabold text-zinc-900 font-display">{c.clusterName}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {c.complianceRating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">ZLD Recovery</span>
                    <strong className="text-base font-extrabold text-cyan-800 font-mono">{c.zldRecoveryPercent}%</strong>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Avg Trust Score</span>
                    <strong className="text-base font-extrabold text-emerald-700 font-mono">{c.avgTrustScore}/100</strong>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Operating Units</span>
                    <strong className="text-base font-extrabold text-zinc-900 font-mono">{c.operatingUnits} Units</strong>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Active CETPs</span>
                    <strong className="text-base font-extrabold text-zinc-900 font-mono">{c.cetpCount} Plants</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ESCALATE TO STATUTORY INSPECTION NOTICE */}
      {/* ======================================================== */}
      {escalatingFlag && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">
                Issue Statutory Inspection Notice
              </h3>
              <button onClick={() => setEscalatingFlag(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalateSubmit} className="space-y-4">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-1">
                <strong className="text-rose-900 block font-bold">Target Enterprise: {escalatingFlag.msmeName}</strong>
                <span className="text-zinc-600 font-mono">GSTIN: {escalatingFlag.gstin}</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Statutory Reason & Physical Audit Scope</label>
                <textarea
                  required
                  rows={4}
                  value={inspectionReason}
                  onChange={(e) => setInspectionReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Flag className="w-4 h-4" />
                <span>Issue Formal Statutory Notice</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
