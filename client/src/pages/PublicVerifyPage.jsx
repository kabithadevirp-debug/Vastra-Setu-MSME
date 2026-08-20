import React from 'react';
import { useApp } from '../context/AppContext';
import { DigitalProductPassportView } from '../components/DigitalProductPassportView';
import { ShieldAlert, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export function PublicVerifyPage({ passportId, navigate }) {
  const { batches, loading } = useApp();

  const batch = batches.find(b => (b.passport && b.passport.id === passportId) || b.id === passportId) || 
                batches.find(b => b.passport && b.passport.id.toLowerCase() === (passportId || '').toLowerCase()) ||
                (passportId ? null : batches.find(b => b.passport)) || 
                null;

  const passport = batch?.passport;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Verifying Product Passport on Environmental Ledger...</p>
      </div>
    );
  }

  if (!batch || !passport) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
          
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Verification Failed
            </span>
            <h2 className="text-xl font-bold font-display text-zinc-900">
              This Passport Could Not Be Verified
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed pt-1">
              The requested QR passport ID <strong className="font-mono text-zinc-800">{passportId || 'N/A'}</strong> could not be authenticated against the VastraSetu Environmental Ledger. It may be revoked, undergoing re-certification, or the URL is malformed.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-zinc-700 font-semibold">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>What to check:</span>
            </div>
            <ul className="text-[11px] text-zinc-500 space-y-1 list-disc pl-4">
              <li>Ensure the physical garment hangtag QR code was scanned clearly</li>
              <li>Check with the MSME exporter for batch re-issuance status</li>
              <li>Verify that both Dyer and CETP clearances have been approved</li>
            </ul>
          </div>

          <button
            onClick={() => navigate ? navigate('/dashboard') : (window.location.href = '/')}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to VastraSetu Overview</span>
          </button>
        </div>
      </div>
    );
  }

  return <DigitalProductPassportView batch={batch} isPublic={true} navigate={navigate} />;
}
