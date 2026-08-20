import React from 'react';
import { useApp } from '../context/AppContext';
import { DigitalProductPassportView } from '../components/DigitalProductPassportView';
import { QrCode, ArrowLeft } from 'lucide-react';

export function PassportViewPage({ batchId, navigate }) {
  const { batches, loading } = useApp();

  const batch = batches.find(b => b.id === batchId || (b.passport && b.passport.id === batchId)) || 
                batches.find(b => b.passport) || 
                batches[0];

  const passport = batch?.passport;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Loading Digital Product Passport...</p>
      </div>
    );
  }

  if (!batch || !passport) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-zinc-900">Passport Not Yet Issued</h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Batch <strong>{batch?.id || batchId}</strong> is still undergoing supplier verifications. Both Dyeing and CETP effluent clearances must be completed to issue the DPP.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-900 transition-all inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  }

  return <DigitalProductPassportView batch={batch} isPublic={false} navigate={navigate} />;
}
