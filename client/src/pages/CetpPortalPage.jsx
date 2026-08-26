import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { BatchPipelineStepper } from '../components/BatchPipelineStepper';
import { CertificateUploadZone } from '../components/CertificateUploadZone';
import { 
  Droplets, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  QrCode, 
  ExternalLink,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CetpPortalPage({ navigate }) {
  const { batches, submitCetpData, setCurrentRole } = useApp();

  const pendingBatches = batches.filter(b => b.status === 'PENDING_CETP');
  const [selectedBatchId, setSelectedBatchId] = useState(
    pendingBatches.length > 0 ? pendingBatches[0].id : (batches[0]?.id || '')
  );

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const [form, setForm] = useState({
    treatmentMethod: 'Membrane Bio-Reactor (MBR) + Reverse Osmosis (RO) + Multi-Effect Evaporator (MEE)',
    zldStatus: 'Verified 100% Zero Liquid Discharge',
    waterRecycledPercent: 92,
    bodCodReductionPercent: 98.5,
    brineRecoveryPercent: 96.0,
    certificateNo: `TNPCB-CETP-ZLD-BATCH-8842`,
    certificateUrl: '/sample-certs/tnpcb-zld-certificate.pdf',
    ocrData: null,
    verifiedBy: 'M. Anandhan (Chief Environmental Engineer, Arulpuram CETP)',
    notes: 'All reject salt crystallized into industrial grade sodium sulfate for reuse.',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    try {
      setSubmitting(true);
      await submitCetpData(selectedBatch.id, form);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
            <Droplets className="w-3.5 h-3.5" />
            <span>CETP Zero Liquid Discharge Verification</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-zinc-900">
            Arulpuram CETP Unit 3
          </h1>
          <p className="text-xs text-zinc-500">
            Arulpuram Industrial Cluster, Tiruppur • 100% ZLD Water Recovery & Closed-Loop Salt Crystallization
          </p>
        </div>

        <div className="text-right font-mono text-xs text-zinc-400">
          ZLD Lic: <strong className="text-zinc-800">TNPCB-CETP-ZLD-2024-88</strong>
        </div>
      </div>

      {/* Main Grid: Batches on Left, Clearance Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Batches */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Batches to Clear</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800">
              {pendingBatches.length} Pending
            </span>
          </div>

          <div className="space-y-2">
            {batches.map((b) => {
              const isSelected = b.id === selectedBatchId;
              const isDone = !!b.cetpRecord;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-700 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-700'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-zinc-900">{b.id}</span>
                    {isDone ? (
                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> ZLD Cleared
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[10px] animate-pulse">Awaiting Clearance</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">{b.garmentTitle}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{b.quantity.toLocaleString()} pcs • {b.buyerName}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Clearance Form */}
        <div className="lg:col-span-8">
          {selectedBatch ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
              
              {/* Batch Header */}
              <div className="border-b border-zinc-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    CETP Effluent Clearance
                  </span>
                  <StatusBadge status={selectedBatch.status} size="sm" />
                </div>
                
                <h3 className="font-display font-extrabold text-xl text-zinc-900">
                  Batch {selectedBatch.id}
                </h3>
                <p className="text-xs text-zinc-600">
                  {selectedBatch.garmentTitle} • <strong>{selectedBatch.quantity.toLocaleString()} pieces</strong>
                </p>

                <div className="pt-2">
                  <BatchPipelineStepper batch={selectedBatch} compact={true} />
                </div>
              </div>

              {selectedBatch.cetpRecord ? (
                // Cleared & Minted State
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Environmental Data Verified & Passport Generated!</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Passport ID: <strong className="font-mono">{selectedBatch.passport?.id}</strong> is now live with verified QR code and Polygon anchor.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <div><span className="text-zinc-400">Water Recycled:</span> <strong className="text-cyan-800">92% Closed-Loop</strong></div>
                    <div><span className="text-zinc-400">COD/BOD Reduction:</span> <strong>98.5%</strong></div>
                    <div><span className="text-zinc-400">ZLD Status:</span> <strong className="text-emerald-700">✓ 100% Certified</strong></div>
                    <div><span className="text-zinc-400">ZDHC MRSL:</span> <strong>Level 3 ✓</strong></div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/passport/${selectedBatch.id}`)}
                      className="flex-1 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>View Digital Product Passport →</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentRole('buyer');
                        navigate(`/verify/${selectedBatch.passport?.id || selectedBatch.id}`);
                      }}
                      className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Public Buyer Scan</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Active Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Water Recycled (%)
                      </label>
                      <input
                        type="number"
                        name="waterRecycledPercent"
                        value={form.waterRecycledPercent}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-cyan-800 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        COD / BOD Reduction (%)
                      </label>
                      <input
                        type="number"
                        name="bodCodReductionPercent"
                        value={form.bodCodReductionPercent}
                        onChange={handleChange}
                        step="0.1"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      ZLD Compliance & Effluent Method
                    </label>
                    <input
                      type="text"
                      name="treatmentMethod"
                      value={form.treatmentMethod}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      TNPCB Zero Liquid Discharge Consent Order (OCR Verified)
                    </label>
                    <CertificateUploadZone
                      certificateType="tnpcb_zld"
                      title="Upload TNPCB ZLD Environmental Clearance (PDF or Image)"
                      description="Upload official TNPCB consent order or CETP audit report. Tesseract OCR will extract and verify 100% ZLD compliance, RO/MEE recovery %, and consent order #."
                      expectedEntity="Arulpuram Common Effluent Treatment Plant"
                      batchId={selectedBatch.id}
                      onVerified={(ocrResult) => {
                        setForm(prev => ({
                          ...prev,
                          certificateUrl: ocrResult.fileUrl,
                          certificateNo: ocrResult.verification?.certificateNumber || prev.certificateNo,
                          waterRecycledPercent: ocrResult.verification?.waterRecycledPercent || prev.waterRecycledPercent,
                          zldStatus: ocrResult.verification?.zldStatus || prev.zldStatus,
                          ocrData: ocrResult,
                        }));
                      }}
                    />
                  </div>

                  <div className="pt-2 border-t border-zinc-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Generating Passport...' : 'Approve Effluent Data & Generate Passport →'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 text-zinc-400">
              Select a batch on the left to clear.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
