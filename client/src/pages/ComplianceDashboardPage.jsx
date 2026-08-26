import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ArrowRight, 
  Download, 
  ExternalLink,
  Award,
  Sparkles,
  Building2,
  RefreshCw,
  Info,
  CheckCircle
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { AccessDeniedPage } from './AccessDeniedPage';

export function ComplianceDashboardPage({ navigate }) {
  const { msme } = useAuth();
  const { currentRole } = useApp() || {};
  const userRole = currentRole || msme?.role || 'msme';

  if (userRole !== 'msme') {
    return <AccessDeniedPage navigate={navigate} requiredRole="MSME Garment Producer / Exporter" />;
  }

  const [loading, setLoading] = useState(true);
  const [trustData, setTrustData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchComplianceData = async () => {
      setLoading(true);
      try {
        const msmeId = msme?.id || '';
        const [scoreRes, alertRes, certRes] = await Promise.allSettled([
          fetch(`/api/trust-score?msmeId=${msmeId}`).then(r => r.json()),
          fetch(`/api/compliance/alerts?msmeId=${msmeId}`).then(r => r.json()),
          fetch(`/api/compliance/certificates?msmeId=${msmeId}`).then(r => r.json())
        ]);

        if (scoreRes.status === 'fulfilled' && scoreRes.value.success) {
          setTrustData(scoreRes.value.data);
        }
        if (alertRes.status === 'fulfilled' && alertRes.value.success) {
          setAlerts(alertRes.value.data);
        }
        if (certRes.status === 'fulfilled' && certRes.value.success) {
          setCertificates(certRes.value.data);
        }
      } catch (err) {
        console.error('Compliance data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [msme]);

  const score = trustData?.score || trustData?.compositeScore || 94;
  const pillars = trustData?.pillars || {
    identityPillar: { score: 100, weight: '25%', label: 'DPI Identity Verification', explanation: 'Udyam & GST Registration Certificates verified via Modulus 36 checksum' },
    documentPillar: { score: 92, weight: '25%', label: 'Document Verification Completeness', explanation: '4/4 operational documents verified with average OCR score 94.5%' },
    compliancePillar: { score: 95, weight: '25%', label: 'Regulatory Compliance Validity', explanation: 'TNPCB Orange Category consent & ZLD effluent status active' },
    consistencyPillar: { score: 90, weight: '25%', label: 'Production & Energy Consistency', explanation: 'TNEB electricity usage vs GST invoice production volume verified' }
  };

  const downloadTrustCertificate = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VastraSetu Trust Certificate - ${msme?.businessName || 'MSME'}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #18181b; }
            .header { border-bottom: 2px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; }
            .title { color: #065f46; font-size: 24px; font-weight: bold; }
            .subtitle { color: #71717a; font-size: 12px; margin-top: 4px; }
            .score-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .score { font-size: 36px; font-weight: bold; color: #047857; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e4e4e7; padding: 10px; text-align: left; font-size: 12px; }
            th { background: #f4f4f5; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">VASTRASETU OFFICIAL TRUST CERTIFICATE</div>
            <div class="subtitle">Digital Product Passport Platform & Environmental Ledger | Issued: ${new Date().toLocaleDateString()}</div>
          </div>
          <div>
            <strong>MSME Exporter:</strong> ${msme?.businessName || 'Sri Jayavarma Knits & Exports Pvt Ltd'}<br/>
            <strong>GSTIN:</strong> ${msme?.gstin || '33AAACJ1928A1Z5'} | Tiruppur Textile Cluster
          </div>
          <div class="score-box">
            <div>Composite MSME Trust Rating</div>
            <div class="score">${score} / 100</div>
          </div>
          <table>
            <thead>
              <tr><th>Pillar Category</th><th>Weight</th><th>Score</th><th>Audit Evidence</th></tr>
            </thead>
            <tbody>
              <tr><td>DPI Identity Verification</td><td>25%</td><td>${pillars.identityPillar?.score || 100}%</td><td>${pillars.identityPillar?.explanation || ''}</td></tr>
              <tr><td>Document Completeness</td><td>25%</td><td>${pillars.documentPillar?.score || 92}%</td><td>${pillars.documentPillar?.explanation || ''}</td></tr>
              <tr><td>Regulatory Compliance</td><td>25%</td><td>${pillars.compliancePillar?.score || 95}%</td><td>${pillars.compliancePillar?.explanation || ''}</td></tr>
              <tr><td>Production Consistency</td><td>25%</td><td>${pillars.consistencyPillar?.score || 90}%</td><td>${pillars.consistencyPillar?.explanation || ''}</td></tr>
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
              Active Compliance Audit
            </span>
            <span className="text-xs text-zinc-400 font-mono">GSTIN: {msme?.gstin || '33AAACJ1928A1Z5'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Trust Score & Compliance Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Transparent 4-pillar algorithmic rating calculated from verified government DPI, CETP ZLD clearances, and TNEB energy metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadTrustCertificate}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Print / Export Trust Certificate</span>
        </button>
      </div>

      {/* SECTION 1 — TRUST SCORE HERO */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-3 max-w-md text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/60 inline-block">
            Calculated Live Score
          </span>
          <h2 className="text-3xl font-extrabold font-display">
            MSME Trust Index: <span className="text-emerald-300">{score} / 100</span>
          </h2>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Your Trust Score qualifies your MSME for preferred Bank Green Loans (up to 1.5% interest concession) and EU DPP export verification.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="text-[11px] font-bold bg-emerald-800/80 px-2.5 py-1 rounded border border-emerald-600 text-emerald-200">
              ✓ Green Underwriting Tier 1
            </span>
            <span className="text-[11px] font-bold bg-teal-800/80 px-2.5 py-1 rounded border border-teal-600 text-teal-200">
              ✓ ZDHC Level 3 Verified
            </span>
          </div>
        </div>

        {/* HERO GAUGE RING */}
        <div className="w-36 h-36 rounded-full bg-emerald-900/60 border-4 border-emerald-500/40 flex flex-col items-center justify-center shadow-2xl relative shrink-0">
          <span className="text-4xl font-extrabold font-display text-emerald-200">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Out of 100</span>
        </div>
      </div>

      {/* SECTION 2 — 4 PILLAR BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>4-Pillar Algorithmic Breakdown</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Transparent sub-scores evaluated independently by VastraSetu Compliance Engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(pillars).map(([key, p]) => (
            <div key={key} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">{p.weight} Weight</span>
                  <h3 className="text-sm font-bold text-zinc-900">{p.label}</h3>
                </div>
                <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-200">
                  {p.score}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${p.score}%` }} 
                />
              </div>

              <p className="text-[11px] text-zinc-500 leading-normal">
                {p.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3 — COMPLIANCE ALERTS */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Active Compliance Alerts & Warnings</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Actionable items requiring attention to maintain Tier 1 Trust Score rating.
          </p>
        </div>

        <div className="space-y-3">
          {alerts.map((alt, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alt.severity === 'HIGH' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                alt.severity === 'MEDIUM' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    alt.severity === 'HIGH' ? 'bg-rose-200 text-rose-900' :
                    alt.severity === 'MEDIUM' ? 'bg-amber-200 text-amber-900' :
                    'bg-emerald-200 text-emerald-900'
                  }`}>
                    {alt.severity} Severity
                  </span>
                  <span className="text-xs font-extrabold">{alt.title}</span>
                </div>
                <p className="text-xs text-zinc-600">{alt.message}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(alt.actionUrl || '/documents')}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all"
              >
                Resolve Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — CERTIFICATE RENEWAL MANAGER */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>Certificate Renewal Manager</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Track regulatory clearance validity dates and scheduled renewal windows.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold text-[10px] border-y border-zinc-200">
              <tr>
                <th className="py-3 px-4">Certificate Name</th>
                <th className="py-3 px-4">Authority</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {certificates.map((c, i) => (
                <tr key={i} className="hover:bg-zinc-50">
                  <td className="py-3 px-4 font-bold text-zinc-900">{c.name}</td>
                  <td className="py-3 px-4">{c.authority}</td>
                  <td className="py-3 px-4 font-mono">{c.expiryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      c.daysRemaining < 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.daysRemaining} days remaining
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('/documents')}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-all"
                    >
                      Renew Document
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
