import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Leaf, 
  TrendingUp, 
  CheckCircle2, 
  Percent, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Award,
  DollarSign,
  Landmark,
  Plus,
  Download,
  X,
  Sparkles,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function BankPortalPage({ navigate }) {
  const { showToast } = useApp() || {};

  // Tab State: 'DIRECTORY', 'RISK', 'SANCTIONS', 'REPORTS'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'risk') return 'RISK';
    if (tabParam === 'sanctions') return 'SANCTIONS';
    if (tabParam === 'reports') return 'REPORTS';
    return 'DIRECTORY';
  });

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const tabParam = newTab.toLowerCase();
    const newUrl = `${window.location.pathname}?tab=${tabParam}`;
    window.history.pushState(null, '', newUrl);
  };

  // Data states
  const [summary, setSummary] = useState({
    verifiedMsmes: 3,
    avgTrustScore: 91.4,
    totalSanctionedCr: 4.3,
    maxInterestConcession: '1.25% p.a.'
  });
  const [msmes, setMsmes] = useState([]);
  const [sanctionedFacilities, setSanctionedFacilities] = useState([]);
  const [rbiAuditLogs, setRbiAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Profile Underwriting Modal State
  const [selectedMsmeProfile, setSelectedMsmeProfile] = useState(null);

  // New Sanction Modal State
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [newFacility, setNewFacility] = useState({
    msmeName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    gstin: '33AAACJ1928A1Z5',
    facilityType: 'WORKING_CAPITAL_EXPORT_CREDIT',
    sanctionedAmount: 25000000.0, // Rs 2.50 Cr
    baseInterestRate: 9.50,
    greenDiscountApplied: 1.25,
    tenureMonths: 36,
    trustScoreAtSanction: 94
  });

  // Fetch Bank Data from REST API
  const fetchBankData = async () => {
    setLoading(true);
    try {
      // 1. KPI Summary
      const sRes = await fetch('/api/bank/summary');
      const sJson = await sRes.json();
      if (sJson.success && sJson.data) {
        setSummary(sJson.data);
      }

      // 2. MSME Directory
      const mRes = await fetch(`/api/bank/msmes?search=${encodeURIComponent(searchQuery)}`);
      const mJson = await mRes.json();
      if (mJson.success && mJson.data) {
        setMsmes(mJson.data);
      }

      // 3. Sanctioned Facilities
      const fRes = await fetch('/api/bank/sanctioned-facilities');
      const fJson = await fRes.json();
      if (fJson.success && fJson.data) {
        setSanctionedFacilities(fJson.data);
      }

      // 4. RBI Audit Log
      const aRes = await fetch('/api/bank/rbi-audit-log');
      const aJson = await aRes.json();
      if (aJson.success && aJson.data) {
        setRbiAuditLogs(aJson.data);
      }

    } catch (err) {
      console.warn('Error loading bank portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, [searchQuery]);

  // Handle Sanction Submission
  const handleSanctionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bank/sanctioned-facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility)
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        if (showToast) showToast('Green credit facility sanctioned successfully!', 'success');
        setShowSanctionModal(false);
        fetchBankData();
      } else {
        alert(json.message || 'Sanction failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Export RBI Audit CSV
  const handleExportRbiCsv = () => {
    if (!rbiAuditLogs || rbiAuditLogs.length === 0) return;
    const headers = ['Action Type', 'Description', 'Auditor / Officer', 'IP Address', 'Timestamp'];
    const rows = rbiAuditLogs.map(l => [
      l.actionType,
      `"${l.description}"`,
      `"${l.auditor || 'Chief ESG Officer'}"`,
      l.ipAddress || '103.24.12.80',
      l.timestamp
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RBI_Green_Finance_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. TOP BANNER HEADER */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>Bank / NBFC Financial Underwriting Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Green Credit & ESG Loan Underwriting
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Verify MSME Digital Product Passports, inspect cryptographic ZDHC effluent compliance, and calculate interest rate concessions for green textile financing.
          </p>
        </div>
      </div>

      {/* 2. REAL DB-BACKED METRICS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => handleTabChange('DIRECTORY')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Verified Green MSMEs</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">{summary.verifiedMsmes}</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            In Active Directory
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('RISK')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Avg MSME Trust Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 font-display">
            {summary.avgTrustScore} / 100
          </p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            DPI Verified
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('SANCTIONS')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Green Credit Sanctioned</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">
            ₹{summary.totalSanctionedCr} Cr
          </p>
          <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
            SIDBI Scheme Active
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Max Rate Concession</span>
            <Percent className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700 font-display">1.25% p.a.</p>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
            Based on Merkle Proofs
          </span>
        </div>
      </div>

      {/* 3. TABS ROW */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => handleTabChange('DIRECTORY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'DIRECTORY'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Green Credit Directory ({msmes.length})
        </button>
        <button
          onClick={() => handleTabChange('RISK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'RISK'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          ESG Risk Scorecards
        </button>
        <button
          onClick={() => handleTabChange('SANCTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'SANCTIONS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Sanctioned Facilities ({sanctionedFacilities.length})
        </button>
        <button
          onClick={() => handleTabChange('REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REPORTS'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          RBI Green Finance Audit
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GREEN CREDIT DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'DIRECTORY' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">MSME Green Credit Directory</h2>
              <p className="text-xs text-zinc-500">Underwriting dashboard for SIDBI, SBI, HDFC, and NBFC ESG loan originators.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by MSME or GSTIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">MSME Name & GSTIN</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">ESG Risk Rating</th>
                  <th className="py-3 px-4">Recycled Water</th>
                  <th className="py-3 px-4">Pre-Approved Credit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {msmes.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block font-sans">{m.name}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{m.gstin} • {m.location}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {m.trustScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {m.esgTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-700">{m.waterRecycled}</td>
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block font-mono">{m.loanEligibility}</strong>
                      <span className="text-[10px] text-emerald-700 font-bold">-{m.interestRateConcession} Concession</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedMsmeProfile(m)}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 ml-auto"
                      >
                        <span>Inspect & Underwrite</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ESG RISK SCORECARDS */}
      {/* ======================================================== */}
      {activeTab === 'RISK' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">ESG Credit Risk Scorecards</h2>
              <p className="text-xs text-zinc-500">Underwriting weighting factors compliant with RBI Green Lending guidelines.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {msmes.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {m.esgTier}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                    Score: {m.trustScore}/100
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-zinc-900">{m.name}</h3>
                <p className="text-[11px] text-zinc-400 font-mono">{m.gstin}</p>

                <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-200/60 pt-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Document Integrity (35%)</span>
                      <strong className="text-zinc-800 font-mono">96/100</strong>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>ZLD Water Recycling (35%)</span>
                      <strong className="text-zinc-800 font-mono">94/100</strong>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-600 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Carbon Efficiency (30%)</span>
                      <strong className="text-zinc-800 font-mono">92/100</strong>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading RBI ESG Risk Dossier PDF for ${m.name}`)}
                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ESG Dossier PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SANCTIONED FACILITIES */}
      {/* ======================================================== */}
      {activeTab === 'SANCTIONS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">Active Sanctioned Green Facilities</h2>
              <p className="text-xs text-zinc-500">Portfolio of green credit lines issued under SIDBI and Priority Sector Lending programs.</p>
            </div>

            <button
              onClick={() => setShowSanctionModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Sanction New Facility</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Borrower MSME</th>
                  <th className="py-3 px-4">Facility Type</th>
                  <th className="py-3 px-4">Sanction Amount</th>
                  <th className="py-3 px-4">Rate (Discount)</th>
                  <th className="py-3 px-4">Score at Sanction</th>
                  <th className="py-3 px-4">Sanction Ref</th>
                  <th className="py-3 px-4 text-right">Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sanctionedFacilities.map((f) => (
                  <tr key={f.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block">{f.msmeName}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{f.gstin}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {f.facilityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-zinc-900">
                      ₹{(f.sanctionedAmount / 10000000.0).toFixed(2)} Cr
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-700">{f.effectiveInterestRate}% p.a.</span>
                      <span className="text-[10px] text-zinc-400 block">(-{f.greenDiscountApplied}%)</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-zinc-700">
                      {f.trustScoreAtSanction} / 100
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {f.sanctionLetterRef}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloading official Sanction Letter PDF for ${f.sanctionLetterRef}`)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Download Sanction Letter"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: RBI GREEN FINANCE AUDIT */}
      {/* ======================================================== */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">RBI Green Lending Regulatory Audit</h2>
              <p className="text-xs text-zinc-500">Audited trail of interest rate concessions granted against verified Digital Product Passports.</p>
            </div>

            <button
              onClick={handleExportRbiCsv}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export RBI Audit CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Audit Description</th>
                  <th className="py-3 px-4">Underwriting Officer</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rbiAuditLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-800">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                      {log.auditor || 'R. Venkatraman (Chief Risk Officer)'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: MSME GREEN PROFILE & UNDERWRITING DOSSIER */}
      {/* ======================================================== */}
      {selectedMsmeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  ESG Underwriting Dossier
                </span>
                <h3 className="text-xl font-extrabold text-zinc-900 font-display mt-1">
                  {selectedMsmeProfile.name}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">GSTIN: {selectedMsmeProfile.gstin}</p>
              </div>
              <button onClick={() => setSelectedMsmeProfile(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Tier Banner */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">DPI Trust Score & Risk Tier</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-800 font-mono">{selectedMsmeProfile.trustScore} / 100</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                    {selectedMsmeProfile.esgTier}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-900 block">Pre-Approved Credit</span>
                <strong className="text-xl font-mono text-emerald-800 block mt-1">{selectedMsmeProfile.loanEligibility}</strong>
                <span className="text-[10px] text-emerald-700 font-bold">-{selectedMsmeProfile.interestRateConcession} Interest Concession</span>
              </div>
            </div>

            {/* Underwriting Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[10px]">Zero Liquid Discharge</span>
                <strong className="text-cyan-800 font-mono text-sm block mt-0.5">{selectedMsmeProfile.waterRecycled} Closed-Loop</strong>
                <span className="text-[10px] text-zinc-500">Arulpuram CETP Unit 3</span>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[10px]">Carbon LCA Benchmark</span>
                <strong className="text-emerald-800 font-mono text-sm block mt-0.5">{selectedMsmeProfile.carbonPerPiece}</strong>
                <span className="text-[10px] text-zinc-500">↓ 18% below EU standard</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setNewFacility(prev => ({
                    ...prev,
                    msmeName: selectedMsmeProfile.name,
                    gstin: selectedMsmeProfile.gstin,
                    trustScoreAtSanction: selectedMsmeProfile.trustScore,
                    greenDiscountApplied: parseFloat(selectedMsmeProfile.interestRateConcession) || 1.25
                  }));
                  setSelectedMsmeProfile(null);
                  setShowSanctionModal(true);
                }}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Sanction Loan for this MSME</span>
              </button>

              <button
                onClick={() => alert(`Opening full Digital Product Passport history for ${selectedMsmeProfile.name}`)}
                className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all"
              >
                View Passports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SANCTION NEW FACILITY */}
      {/* ======================================================== */}
      {showSanctionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">Sanction Green Loan Facility</h3>
              <button onClick={() => setShowSanctionModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSanctionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Borrower MSME</label>
                <input
                  type="text"
                  required
                  value={newFacility.msmeName}
                  onChange={(e) => setNewFacility({ ...newFacility, msmeName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">GSTIN</label>
                  <input
                    type="text"
                    required
                    value={newFacility.gstin}
                    onChange={(e) => setNewFacility({ ...newFacility, gstin: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Facility Type</label>
                  <select
                    value={newFacility.facilityType}
                    onChange={(e) => setNewFacility({ ...newFacility, facilityType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="WORKING_CAPITAL_EXPORT_CREDIT">Working Capital Export Credit</option>
                    <option value="TERM_LOAN">Green Term Loan</option>
                    <option value="SOLAR_ROOFTOP_EQUIPMENT_FINANCING">Solar / Equipment Financing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Sanction Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={newFacility.sanctionedAmount}
                    onChange={(e) => setNewFacility({ ...newFacility, sanctionedAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    value={newFacility.tenureMonths}
                    onChange={(e) => setNewFacility({ ...newFacility, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Base Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newFacility.baseInterestRate}
                    onChange={(e) => setNewFacility({ ...newFacility, baseInterestRate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Green Discount (% p.a.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newFacility.greenDiscountApplied}
                    onChange={(e) => setNewFacility({ ...newFacility, greenDiscountApplied: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                <span className="font-bold text-emerald-900">Effective Interest Rate:</span>
                <strong className="font-mono text-emerald-800 text-sm">
                  {(newFacility.baseInterestRate - newFacility.greenDiscountApplied).toFixed(2)}% p.a.
                </strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Issue Green Loan Sanction
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
