import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Award, 
  Search, 
  Download, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  Droplets
} from 'lucide-react';

export function AuditorPortalPage({ navigate }) {
  const [activeTab, setActiveTab] = useState('LEADERBOARD');

  const rankingList = [
    { rank: 1, name: 'Sri Jayavarma Knits & Exports Pvt Ltd', gstin: '33AAACJ1928A1Z5', score: 96.8, cetp: 'ZLD Tier 1', status: 'Compliant' },
    { rank: 2, name: 'Coimbatore Processing Mills Ltd', gstin: '33AABCC4412B1Z9', score: 92.4, cetp: 'ZLD Tier 1', status: 'Compliant' },
    { rank: 3, name: 'Kaveri Eco Dyers & Processors', gstin: '33AABCK1029C1Z1', score: 87.1, cetp: 'ZLD Tier 2', status: 'Compliant' },
  ];

  const fraudAlerts = [
    { id: 'ALT-9912', msme: 'Apex Fabric Dyers', type: 'Unverified ZDHC Test Certificate', severity: 'HIGH', date: '2026-08-20' },
    { id: 'ALT-8841', msme: 'Kongu Textile Processing', type: 'GSTIN Cross-Check Discrepancy', severity: 'MEDIUM', date: '2026-08-18' }
  ];

  return (
    <div className="space-y-6">
      
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Role 4: Government & Auditor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Pollution Board & Ministry Compliance Audit
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Real-time Zero Liquid Discharge (ZLD) monitoring, MSME Green Rankings, and automated cryptographic fraud prevention for CPCB & TNPCB auditors.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Audit Coverage</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">100% MSMEs</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            Cryptographically Verified
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Avg Region ZLD Index</span>
            <Droplets className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700 font-display">94.2%</p>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
            Zero Liquid Discharge
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Active Fraud Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700 font-display">2 Cases</p>
          <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
            Under Inspection
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Audit Trail Export</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <button
            type="button"
            onClick={() => alert("Downloading Government Compliance Audit Trail CSV...")}
            className="w-full mt-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* MAIN TABBED CONTROLS */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
        
        <div className="flex border-b border-zinc-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`pb-3 transition-all ${activeTab === 'LEADERBOARD' ? 'border-b-2 border-emerald-700 text-emerald-800 font-extrabold' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Regional Green Ranking Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`pb-3 transition-all ${activeTab === 'ALERTS' ? 'border-b-2 border-rose-700 text-rose-800 font-extrabold' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Fraud Alerts & Discrepancy Queue ({fraudAlerts.length})
          </button>
        </div>

        {activeTab === 'LEADERBOARD' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">MSME Name</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Sustainability Score</th>
                  <th className="py-3 px-4">CETP ZLD Rating</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {rankingList.map((row) => (
                  <tr key={row.rank} className="hover:bg-zinc-50/80 transition-all">
                    <td className="py-4 px-4 font-extrabold text-zinc-900">#{row.rank}</td>
                    <td className="py-4 px-4 font-bold text-zinc-900">{row.name}</td>
                    <td className="py-4 px-4 font-mono text-zinc-500">{row.gstin}</td>
                    <td className="py-4 px-4 font-extrabold text-emerald-700">{row.score} / 100</td>
                    <td className="py-4 px-4 font-semibold text-zinc-700">{row.cetp}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {fraudAlerts.map(alertItem => (
              <div key={alertItem.id} className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-900 text-xs">{alertItem.msme}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                      {alertItem.severity} RISK
                    </span>
                  </div>
                  <p className="text-xs text-rose-800">{alertItem.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Initiated formal audit inquiry for ${alertItem.id}`)}
                  className="px-3 py-1.5 bg-rose-700 text-white font-bold text-xs rounded-xl hover:bg-rose-800"
                >
                  Initiate Audit
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
