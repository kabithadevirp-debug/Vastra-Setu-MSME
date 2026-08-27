import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Droplets, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  QrCode, 
  ExternalLink,
  Check,
  Activity,
  Layers,
  FileText,
  Percent,
  Gauge,
  Plus,
  Download,
  AlertTriangle,
  X,
  Calendar,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CetpPortalPage({ navigate }) {
  const { showToast } = useApp() || {};

  // Tab State: 'QUEUE', 'MONITOR', 'CONSENT', 'RECORDS'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'monitor') return 'MONITOR';
    if (tabParam === 'consent') return 'CONSENT';
    if (tabParam === 'records') return 'RECORDS';
    return 'QUEUE';
  });

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const tabParam = newTab.toLowerCase();
    const newUrl = `${window.location.pathname}?tab=${tabParam}`;
    window.history.pushState(null, '', newUrl);
  };

  // Data states
  const [batches, setBatches] = useState([]);
  const [operationalLogs, setOperationalLogs] = useState([]);
  const [consentOrders, setConsentOrders] = useState([]);
  const [waterLedger, setWaterLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected batch for clearance
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const selectedBatch = batches.find(b => b.id === selectedBatchId || b.batchNumber === selectedBatchId) || batches[0];

  // Shift Logging Modal State
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLog, setNewLog] = useState({
    shift: 'MORNING',
    roPermeateFlowKld: 1180.0,
    roRecoveryPercent: 94.4,
    bodCodReductionPercent: 98.6,
    meeCrystallizationRate: 8.5,
    saltRecoveredKg: 8500.0,
    inletTdsPpm: 6850.0,
    permeateTdsPpm: 125.0,
    loggedBy: 'M. Anandhan (Chief Environmental Engineer)'
  });

  // Consent Order Modal State
  const [showAddConsentModal, setShowAddConsentModal] = useState(false);
  const [newConsent, setNewConsent] = useState({
    orderNumber: 'TNPCB-CETP-ZLD-2024-88',
    title: 'TNPCB Zero Liquid Discharge Consent Order',
    issuingAuthority: 'Tamil Nadu Pollution Control Board',
    plantCapacityKld: 2500.0,
    zldComplianceStatus: '100% ZLD Verified (MBR + RO + MEE)',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365*3*24*60*60*1000).toISOString().split('T')[0],
    documentUrl: '/sample-certs/tnpcb-zld-certificate.pdf'
  });

  // Clearance Form State
  const [clearanceForm, setClearanceForm] = useState({
    treatmentMethod: 'Membrane Bio-Reactor (MBR) + Reverse Osmosis (RO) + Multi-Effect Evaporator (MEE)',
    zldStatus: 'Verified 100% Zero Liquid Discharge',
    waterRecycledPercent: 94.2,
    bodCodReductionPercent: 98.5,
    brineRecoveryPercent: 96.0,
    certificateNo: 'TNPCB-CETP-ZLD-BATCH-8842',
    verifiedBy: 'M. Anandhan (Chief Environmental Engineer, Arulpuram CETP)',
    notes: 'All reject brine salt crystallized into industrial grade sodium sulfate for reuse.'
  });

  const [submittingClearance, setSubmittingClearance] = useState(false);

  // Fetch CETP data from REST endpoints
  const fetchCetpData = async () => {
    setLoading(true);
    try {
      // 1. Batches
      const bRes = await fetch('/api/cetp/batches?cetpId=Arulpuram%20CETP%20Unit%203');
      const bJson = await bRes.json();
      if (bJson.success && bJson.data) {
        setBatches(bJson.data);
        if (!selectedBatchId && bJson.data.length > 0) {
          setSelectedBatchId(bJson.data[0].batchNumber || bJson.data[0].id);
        }
      }

      // 2. Operational Logs
      const lRes = await fetch('/api/cetp/operational-logs?cetpId=Arulpuram%20CETP%20Unit%203');
      const lJson = await lRes.json();
      if (lJson.success && lJson.data) {
        setOperationalLogs(lJson.data);
      }

      // 3. Consent Orders
      const cRes = await fetch('/api/cetp/consent-order?cetpId=Arulpuram%20CETP%20Unit%203');
      const cJson = await cRes.json();
      if (cJson.success && cJson.data) {
        setConsentOrders(cJson.data);
      }

      // 4. Water Recovery Ledger
      const wRes = await fetch('/api/cetp/water-recovery-ledger?cetpId=Arulpuram%20CETP%20Unit%203');
      const wJson = await wRes.json();
      if (wJson.success && wJson.data) {
        setWaterLedger(wJson.data);
      }

    } catch (err) {
      console.warn('Error loading CETP data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCetpData();
  }, []);

  // Submit Clearance
  const handleClearanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setSubmittingClearance(true);
    try {
      const batchNum = selectedBatch.batchNumber || selectedBatch.id;
      const res = await fetch(`/api/cetp/batches/${batchNum}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentMethod: clearanceForm.treatmentMethod,
          waterRecycledPercent: clearanceForm.waterRecycledPercent,
          bodCodReductionPercent: clearanceForm.bodCodReductionPercent,
          brineRecoveryPercent: clearanceForm.brineRecoveryPercent,
          certificateNo: clearanceForm.certificateNo,
          verifiedBy: clearanceForm.verifiedBy,
          notes: clearanceForm.notes
        })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        if (showToast) showToast('100% ZLD clearance issued! Digital Product Passport anchored on ledger.', 'success');
        fetchCetpData();
      } else {
        alert(json.message || 'Clearance failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmittingClearance(false);
    }
  };

  // Add Operational Log
  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cetp/operational-logs?cetpId=Arulpuram%20CETP%20Unit%203', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      const json = await res.json();
      if (json.success) {
        setShowAddLogModal(false);
        fetchCetpData();
      }
    } catch (err) {
      alert('Failed to log telemetry: ' + err.message);
    }
  };

  // Export Water Recovery Ledger CSV
  const handleExportCsv = () => {
    if (!waterLedger || waterLedger.length === 0) return;
    const headers = ['Batch ID', 'Product', 'Quantity (pcs)', 'Water Recycled %', 'BOD Reduction %', 'Salt Recovery %', 'Certificate No', 'Clearance Date', 'Status'];
    const rows = waterLedger.map(item => [
      item.batchNumber || item.id,
      `"${item.productName}"`,
      item.quantity,
      `${item.waterRecycledPercent}%`,
      `${item.bodCodReductionPercent}%`,
      `${item.saltRecoveryPercent}%`,
      item.certificateNo,
      item.clearanceDate,
      item.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TNPCB_ZLD_Water_Recovery_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active metrics from latest log
  const latestLog = operationalLogs[0] || {
    roPermeateFlowKld: 1178.0,
    roRecoveryPercent: 94.2,
    bodCodReductionPercent: 98.5,
    saltRecoveredKg: 8400.0,
    loggedAt: new Date().toISOString()
  };

  const primaryConsent = consentOrders[0];

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. TOP CETP HEADER */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Droplets className="w-4 h-4" />
            <span>Common Effluent Treatment Plant (CETP) ZLD Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Arulpuram CETP Unit 3
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80 leading-relaxed">
            Arulpuram Industrial Cluster, Tiruppur • 100% Zero Liquid Discharge (ZLD) Water Recovery & Closed-Loop Salt Crystallization
          </p>
        </div>
        <div className="absolute right-6 top-6 hidden md:block text-right text-xs font-mono text-cyan-300/60">
          ZLD Lic: <strong className="text-white">{primaryConsent?.orderNumber || 'TNPCB-CETP-ZLD-2024-88'}</strong>
        </div>
      </div>

      {/* 2. DYNAMIC 4 STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => handleTabChange('QUEUE')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-cyan-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Pending Clearance</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">{batches.length}</p>
          <span className="text-[11px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 inline-block">
            Awaiting ZLD Sign-off
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('MONITOR')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Water Recovery Rate</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 font-display">
            {latestLog.roRecoveryPercent}%
          </p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            Closed-Loop RO
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('MONITOR')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-teal-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>BOD / COD Reduction</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">
            {latestLog.bodCodReductionPercent}%
          </p>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
            Biological MBR
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('MONITOR')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Salt Recovery Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 font-display">
            {(latestLog.saltRecoveredKg / 1000).toFixed(1)} T/day
          </p>
          <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
            MEE Crystallization
          </span>
        </div>
      </div>

      {/* 3. WORKSPACE TAB ROW */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => handleTabChange('QUEUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'QUEUE'
              ? 'bg-cyan-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Effluent Clearance Queue ({batches.length})
        </button>
        <button
          onClick={() => handleTabChange('MONITOR')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'MONITOR'
              ? 'bg-cyan-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Live RO & MEE Monitor ({operationalLogs.length} Shifts)
        </button>
        <button
          onClick={() => handleTabChange('CONSENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CONSENT'
              ? 'bg-cyan-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          TNPCB ZLD Consent Order
        </button>
        <button
          onClick={() => handleTabChange('RECORDS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'RECORDS'
              ? 'bg-cyan-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Water Recovery Ledger ({waterLedger.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EFFLUENT CLEARANCE QUEUE */}
      {/* ======================================================== */}
      {activeTab === 'QUEUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Batches to Clear */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Batches in Pipeline</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                {batches.length} Ready
              </span>
            </div>

            <div className="space-y-2">
              {batches.map((b) => {
                const bId = b.batchNumber || b.id;
                const isSelected = bId === selectedBatchId;

                return (
                  <div
                    key={b.id || b.batchNumber}
                    onClick={() => setSelectedBatchId(bId)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-600'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-zinc-900">{b.batchNumber || b.id}</span>
                      <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        {b.status || 'READY'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-800 line-clamp-1">{b.productName}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                      <span>Dyer: Rainbow Eco-Dyers</span>
                      <strong className="text-cyan-800">{b.quantity || 5000} pcs</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Environmental Clearance Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <h3 className="text-lg font-extrabold text-zinc-900 font-display">
                  100% Zero Liquid Discharge Environmental Clearance
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Certify 92%+ RO permeate closed-loop recovery and MEE salt crystallization for batch <strong className="text-zinc-900">{selectedBatch?.batchNumber || selectedBatch?.id}</strong> to finalize Digital Product Passport anchoring.
              </p>
            </div>

            <form onSubmit={handleClearanceSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Water Recycled (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={clearanceForm.waterRecycledPercent}
                    onChange={(e) => setClearanceForm({ ...clearanceForm, waterRecycledPercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">BOD/COD Reduction (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={clearanceForm.bodCodReductionPercent}
                    onChange={(e) => setClearanceForm({ ...clearanceForm, bodCodReductionPercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Brine Salt Recovery (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={clearanceForm.brineRecoveryPercent}
                    onChange={(e) => setClearanceForm({ ...clearanceForm, brineRecoveryPercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Treatment Technology Pipeline</label>
                <input
                  type="text"
                  value={clearanceForm.treatmentMethod}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, treatmentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-cyan-500"
                />
              </div>

              {/* Certificate Verification Badge */}
              <div className="p-4 border-2 border-dashed border-cyan-200 bg-cyan-50/30 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-7 h-7 text-cyan-600" />
                  <div>
                    <strong className="text-xs font-bold text-zinc-900 block">TNPCB ZLD Order # TNPCB-CETP-ZLD-BATCH-8842</strong>
                    <span className="text-[10px] text-zinc-500 font-mono">Zero Liquid Discharge • 100% Recirculated to Tiruppur Dyers</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  ✓ ZLD Cleared
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Certified By (Chief Environmental Engineer)</label>
                <input
                  type="text"
                  value={clearanceForm.verifiedBy}
                  onChange={(e) => setClearanceForm({ ...clearanceForm, verifiedBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingClearance}
                className="w-full py-3.5 bg-cyan-800 hover:bg-cyan-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submittingClearance ? 'Issuing Environmental Clearance...' : 'Issue ZLD Clearance & Anchor DPP'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE RO & MEE MONITOR (Option A Shift Telemetry) */}
      {/* ======================================================== */}
      {activeTab === 'MONITOR' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                  Treatment Plant Shift Telemetry & Monitoring
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Real Operator Shift Logs
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Recorded data from 3-Stage Reverse Osmosis (RO) membranes and Multi-Effect Evaporators (MEE).
              </p>
            </div>

            <button
              onClick={() => setShowAddLogModal(true)}
              className="px-4 py-2 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Shift Readings</span>
            </button>
          </div>

          {/* LATEST SHIFT RECORD SPOTLIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-cyan-800 uppercase">
                <span>RO Permeate Recovery</span>
                <span>As of {latestLog.logDate}</span>
              </div>
              <p className="text-2xl font-extrabold text-cyan-950 font-mono">
                {latestLog.roPermeateFlowKld} m³ / day
              </p>
              <span className="text-[11px] text-emerald-700 font-bold block">
                {latestLog.roRecoveryPercent}% Total Closed-Loop Recovery
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-teal-800 uppercase">
                <span>Biological MBR Treatment</span>
                <span>Shift: {latestLog.shift}</span>
              </div>
              <p className="text-2xl font-extrabold text-teal-950 font-mono">
                {latestLog.bodCodReductionPercent}%
              </p>
              <span className="text-[11px] text-teal-700 font-bold block">
                BOD: &lt; 10 mg/L • COD: &lt; 50 mg/L
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-purple-800 uppercase">
                <span>MEE Brine Salt Crystallization</span>
                <span>Industrial Grade</span>
              </div>
              <p className="text-2xl font-extrabold text-purple-950 font-mono">
                {(latestLog.saltRecoveredKg / 1000).toFixed(1)} Tons / day
              </p>
              <span className="text-[11px] text-purple-700 font-bold block">
                Sodium Sulfate 98.4% Pure
              </span>
            </div>
          </div>

          {/* HISTORICAL SHIFT TELEMETRY LOGS TABLE */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-zinc-900">Historical Shift Telemetry Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Date & Shift</th>
                    <th className="py-3 px-4">RO Flow</th>
                    <th className="py-3 px-4">Recovery %</th>
                    <th className="py-3 px-4">BOD/COD Red.</th>
                    <th className="py-3 px-4">Salt Recovered</th>
                    <th className="py-3 px-4">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {operationalLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                        {l.logDate} <span className="text-[10px] text-zinc-400 font-normal">({l.shift})</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-800">{l.roPermeateFlowKld} KLD</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{l.roRecoveryPercent}%</td>
                      <td className="py-3.5 px-4 font-mono text-teal-700">{l.bodCodReductionPercent}%</td>
                      <td className="py-3.5 px-4 font-mono text-purple-700">{l.saltRecoveredKg} kg</td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">{l.loggedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TNPCB ZLD CONSENT ORDER */}
      {/* ======================================================== */}
      {activeTab === 'CONSENT' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                TNPCB Statutory ZLD Consent Order & Licenses
              </h2>
              <p className="text-xs text-zinc-500">
                Official environmental clearances granted under the Water (Prevention & Control of Pollution) Act.
              </p>
            </div>

            <button
              onClick={() => setShowAddConsentModal(true)}
              className="px-4 py-2 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload / Renew Consent Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consentOrders.map((order) => (
              <div key={order.id} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                    Consent to Operate (CTO)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active & Compliant
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-zinc-900">{order.title}</h3>
                
                <div className="space-y-1 text-xs text-zinc-600 border-t border-zinc-200/60 pt-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Order Number:</span>
                    <strong className="font-mono text-zinc-800">{order.orderNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Issuing Authority:</span>
                    <span>{order.issuingAuthority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Plant Capacity:</span>
                    <span className="font-mono font-bold text-cyan-800">{order.plantCapacityKld} KLD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">ZLD Status:</span>
                    <span className="font-bold text-emerald-700">{order.zldComplianceStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Valid Until:</span>
                    <strong className="font-mono text-zinc-800">{order.expiryDate}</strong>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Opening TNPCB ZLD Consent Order PDF for ${order.orderNumber}`)}
                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Signed Order PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: WATER RECOVERY LEDGER (With CSV Export) */}
      {/* ======================================================== */}
      {activeTab === 'RECORDS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                Historical Water Recovery Clearance Ledger
              </h2>
              <p className="text-xs text-zinc-500">
                Audited ledger of all cleared garment batches with recorded RO closed-loop recovery.
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Ledger CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Batch Number & Product</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">RO Recovery %</th>
                  <th className="py-3 px-4">BOD Red. %</th>
                  <th className="py-3 px-4">Salt Recovery</th>
                  <th className="py-3 px-4">Certificate Number</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {waterLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="font-mono text-zinc-900 block">{item.batchNumber}</strong>
                      <span className="text-[10px] text-zinc-400">{item.productName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{item.quantity} pcs</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{item.waterRecycledPercent}%</td>
                    <td className="py-3.5 px-4 font-mono text-teal-700">{item.bodCodReductionPercent}%</td>
                    <td className="py-3.5 px-4 font-mono text-purple-700">{item.saltRecoveryPercent}%</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">{item.certificateNo}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
      {/* MODAL: LOG SHIFT READINGS */}
      {/* ======================================================== */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">Log CETP Shift Telemetry</h3>
              <button onClick={() => setShowAddLogModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Shift</label>
                  <select
                    value={newLog.shift}
                    onChange={(e) => setNewLog({ ...newLog, shift: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="MORNING">Morning (06:00 - 14:00)</option>
                    <option value="EVENING">Evening (14:00 - 22:00)</option>
                    <option value="NIGHT">Night (22:00 - 06:00)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">RO Permeate Flow (KLD)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={newLog.roPermeateFlowKld}
                    onChange={(e) => setNewLog({ ...newLog, roPermeateFlowKld: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">RO Recovery Rate (%)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={newLog.roRecoveryPercent}
                    onChange={(e) => setNewLog({ ...newLog, roRecoveryPercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">BOD/COD Reduction (%)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={newLog.bodCodReductionPercent}
                    onChange={(e) => setNewLog({ ...newLog, bodCodReductionPercent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Salt Recovered (kg)</label>
                  <input
                    type="number"
                    required
                    value={newLog.saltRecoveredKg}
                    onChange={(e) => setNewLog({ ...newLog, saltRecoveredKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Inlet TDS (ppm)</label>
                  <input
                    type="number"
                    value={newLog.inletTdsPpm}
                    onChange={(e) => setNewLog({ ...newLog, inletTdsPpm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Log Shift Telemetry to Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: UPLOAD / RENEW CONSENT ORDER */}
      {/* ======================================================== */}
      {showAddConsentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">Upload / Renew TNPCB Consent Order</h3>
              <button onClick={() => setShowAddConsentModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/cetp/consent-order?cetpId=Arulpuram%20CETP%20Unit%203', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newConsent)
                });
                const json = await res.json();
                if (json.success) {
                  setShowAddConsentModal(false);
                  fetchCetpData();
                }
              } catch (err) {
                alert('Failed to save consent order: ' + err.message);
              }
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Order Number</label>
                <input
                  type="text"
                  required
                  value={newConsent.orderNumber}
                  onChange={(e) => setNewConsent({ ...newConsent, orderNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Issuing Authority</label>
                  <input
                    type="text"
                    value={newConsent.issuingAuthority}
                    onChange={(e) => setNewConsent({ ...newConsent, issuingAuthority: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Plant Capacity (KLD)</label>
                  <input
                    type="number"
                    value={newConsent.plantCapacityKld}
                    onChange={(e) => setNewConsent({ ...newConsent, plantCapacityKld: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={newConsent.expiryDate}
                  onChange={(e) => setNewConsent({ ...newConsent, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save Consent Order
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
