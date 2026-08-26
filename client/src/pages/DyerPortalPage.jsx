import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { BatchPipelineStepper } from '../components/BatchPipelineStepper';
import { CertificateUploadZone } from '../components/CertificateUploadZone';
import { 
  FlaskConical, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Droplets,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DyerPortalPage({ navigate }) {
  const { batches, submitDyerData, setCurrentRole } = useApp();
  
  const pendingBatches = batches.filter(b => b.status === 'PENDING_DYER');
  const [selectedBatchId, setSelectedBatchId] = useState(
    pendingBatches.length > 0 ? pendingBatches[0].id : (batches[0]?.id || '')
  );

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const [form, setForm] = useState({
    dyeType: 'low_impact_reactive',
    dyeProcessName: 'Energy-Efficient Cold Pad Batch (CPB) Eco-Dyeing',
    temperatureC: 60,
    chemicalCompliance: 'Azo-free ✓ • OEKO-TEX Standard 100 Class I & ZDHC MRSL Level 3',
    certificateNo: 'OEKO-2026-TX-98442',
    certificateUrl: '/sample-certs/oeko-tex-certificate.pdf',
    ocrData: null,
    verifiedBy: 'Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)',
    notes: 'Zero Azo dyes, zero heavy metal mordants. 100% biomass steam boiler operated.',
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
      await submitDyerData(selectedBatch.id, form);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Context Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Dyeing Partner Verification</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-zinc-900">
            Rainbow Eco-Dyers Tiruppur
          </h1>
          <p className="text-xs text-zinc-500">
            Veerapandi Industrial Estate, Tiruppur • OEKO-TEX Eco Passport & ZDHC MRSL Level 3
          </p>
        </div>

        <div className="text-right font-mono text-xs text-zinc-400">
          Facility Lic: <strong className="text-zinc-800">TNPCB/DYE/2024/091</strong>
        </div>
      </div>

      {/* Main Grid: Batches on Left, Clean Verification Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Assigned Batches */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Batches to Verify</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
              {pendingBatches.length} Pending
            </span>
          </div>

          <div className="space-y-2">
            {batches.map((b) => {
              const isSelected = b.id === selectedBatchId;
              const isDone = !!b.dyeingRecord;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-700 bg-brand-50/50 shadow-sm ring-1 ring-brand-700'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-zinc-900">{b.id}</span>
                    {isDone ? (
                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="text-brand-700 font-bold text-[10px] animate-pulse">Awaiting Input</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">{b.garmentTitle}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{b.quantity.toLocaleString()} pcs • {b.buyerName}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verification Form */}
        <div className="lg:col-span-8">
          {selectedBatch ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
              
              {/* Batch Context Header */}
              <div className="border-b border-zinc-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Dyeing Verification
                  </span>
                  <StatusBadge status={selectedBatch.status} size="sm" />
                </div>
                
                <h3 className="font-display font-extrabold text-xl text-zinc-900">
                  Batch {selectedBatch.id}
                </h3>
                <p className="text-xs text-zinc-600">
                  {selectedBatch.garmentTitle} • <strong>{selectedBatch.quantity.toLocaleString()} pieces</strong>
                </p>

                {/* Progress Stepper */}
                <div className="pt-2">
                  <BatchPipelineStepper batch={selectedBatch} compact={true} />
                </div>
              </div>

              {selectedBatch.dyeingRecord ? (
                // Already Verified State with Clean Transition Notice
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dyeing Data Verified</span>
                    </div>
                    <p className="text-emerald-800">
                      Batch advanced to: <strong>CETP VERIFICATION</strong>
                    </p>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs space-y-1.5 text-zinc-700">
                    <div><span className="text-zinc-400">Process:</span> <strong>{selectedBatch.dyeingRecord.dyeProcessName}</strong></div>
                    <div><span className="text-zinc-400">Chemical Safety:</span> <strong>{selectedBatch.dyeingRecord.chemicalCompliance}</strong></div>
                    <div><span className="text-zinc-400">Certificate No:</span> <strong className="font-mono">{selectedBatch.dyeingRecord.certificateNo}</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentRole('cetp');
                      navigate('/portal/cetp');
                    }}
                    className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Switch to CETP Role to Advance Pipeline →</span>
                  </button>
                </div>
              ) : (
                // Active Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Dye Type
                    </label>
                    <select
                      name="dyeType"
                      value={form.dyeType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                    >
                      <option value="low_impact_reactive">Low-Impact Azo-Free Reactive Dyes</option>
                      <option value="natural_plant">Natural Plant Bio-Dyes (Baby Safe)</option>
                      <option value="solution_dyed">Solution / Dope Dyed Fiber</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Operating Temperature
                      </label>
                      <input
                        type="number"
                        name="temperatureC"
                        value={form.temperatureC}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Chemical Compliance
                      </label>
                      <input
                        type="text"
                        name="chemicalCompliance"
                        value={form.chemicalCompliance}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      OEKO-TEX Standard 100 / ZDHC Chemical Certificate (OCR Verified)
                    </label>
                    <CertificateUploadZone
                      certificateType="oeko_tex"
                      title="Upload OEKO-TEX / ZDHC Certificate (PDF or Image)"
                      description="Upload wet processing lab test report or Eco Passport. Tesseract OCR will extract and verify certificate #, product class, and ZDHC Level 3 status."
                      expectedEntity="Rainbow Eco-Dyers"
                      batchId={selectedBatch.id}
                      onVerified={(ocrResult) => {
                        setForm(prev => ({
                          ...prev,
                          certificateUrl: ocrResult.fileUrl,
                          certificateNo: ocrResult.verification?.certificateNumber || prev.certificateNo,
                          chemicalCompliance: ocrResult.verification?.chemicalSafety 
                            ? `Azo-Free ✓ • ${ocrResult.verification.standardName}` 
                            : prev.chemicalCompliance,
                          ocrData: ocrResult,
                        }));
                      }}
                    />
                  </div>

                  <div className="pt-2 border-t border-zinc-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Verifying...' : 'Verify & Submit Dyeing Data →'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 text-zinc-400">
              Select a batch on the left to verify.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
