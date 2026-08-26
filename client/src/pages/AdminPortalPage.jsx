import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  Database,
  ArrowRight
} from 'lucide-react';

export function AdminPortalPage({ navigate }) {
  const [pendingReviews, setPendingReviews] = useState([
    { id: 'PROOF-901', msme: 'Apex Fabric Dyers', docType: 'GST Certificate', status: 'NEEDS_REVIEW', ocrScore: 58.2, reason: 'Low OCR contrast - requires human confirmation' },
    { id: 'PROOF-902', msme: 'Kongu Processing Mills', docType: 'Udyam Certificate', status: 'NEEDS_REVIEW', ocrScore: 61.5, reason: 'Faint watermark on registration date field' }
  ]);

  const handleApprove = (id) => {
    setPendingReviews(prev => prev.filter(p => p.id !== id));
    alert(`Document ${id} approved by System Administrator!`);
  };

  return (
    <div className="space-y-6">
      
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Role 5: System Admin Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            VastraSetu Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Monitor API microservices, approve pending identity verification requests, and manage cryptographic Merkle root anchors.
          </p>
        </div>
      </div>

      {/* SYSTEM HEALTH */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Registered MSMEs</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">1,420</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            Active Accounts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Passports Anchored</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">18,940</p>
          <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
            SHA-256 Merkle Root
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>OpenRouter AI Model</span>
            <Server className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xs font-bold text-teal-700 mt-2">gemini-2.5-flash</p>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
            100% Operational
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Tesseract OCR v5.5</span>
            <Cpu className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-emerald-700 mt-2">Local Binary Engine</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            Preprocessed 94.5%
          </span>
        </div>
      </div>

      {/* APPROVAL QUEUE */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 font-display">
            Human-in-the-Loop Review Queue
          </h2>
          <p className="text-xs text-zinc-500">
            Documents flagged as <code className="font-bold text-amber-700">NEEDS_REVIEW</code> by the 4-signal verification engine.
          </p>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-500">
            No pending document reviews in queue. All identity proofs verified!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map(item => (
              <div key={item.id} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 text-xs">{item.msme}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {item.docType}
                    </span>
                  </div>
                  <p className="text-xs text-amber-900">{item.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Approve Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
