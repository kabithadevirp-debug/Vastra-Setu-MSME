import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Shield, 
  Edit3, 
  Trash2,
  Scan,
  Sparkles,
  Binary
} from 'lucide-react';

export function DocumentUploadPage({ navigate }) {
  const { msme } = useAuth();
  const [docStatus, setDocStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editedFields, setEditedFields] = useState({});

  const slotsMeta = [
    {
      key: 'GST_INVOICE',
      title: 'GST Sales & Raw Material Invoice',
      subtitle: 'Validates Modulus 36 GSTIN checksum, HSN codes & transaction authenticity',
      icon: FileText,
      accept: '.pdf,.png,.jpg'
    },
    {
      key: 'TNEB_BILL',
      title: 'TNEB Electricity Utility Bill',
      subtitle: 'Extracts kWh consumption, connection category & monthly variance plausibility',
      icon: Zap,
      accept: '.pdf,.png,.jpg'
    },
    {
      key: 'CETP_REPORT',
      title: 'CETP Effluent Discharge Test Report',
      subtitle: 'Extracts ZLD water volume, BOD/COD levels & zero discharge treatment efficiency %',
      icon: Droplets,
      accept: '.pdf,.png,.jpg'
    },
    {
      key: 'PCB_CERTIFICATE',
      title: 'TNPCB Pollution Control Board Consent',
      subtitle: 'Verifies active Orange/Red category consent to operate & expiry date validity',
      icon: Shield,
      accept: '.pdf,.png,.jpg'
    }
  ];

  const fetchStatus = async () => {
    try {
      const targetId = msme?.id;
      if (!targetId) return;
      const res = await fetch(`/api/documents/status?msmeId=${targetId}`);
      const data = await res.json();
      if (data.success) {
        setDocStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch document status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [msme]);

  const handleFileUpload = async (slotKey, file) => {
    if (!msme?.id) return;
    setUploadingSlot(slotKey);
    try {
      const formData = new FormData();
      formData.append('msmeId', msme.id);
      formData.append('docType', slotKey);
      if (file) formData.append('file', file);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
      } else {
        alert(data.message || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleConfirmFields = async (slotKey, slotData) => {
    if (!slotData?.id) return;
    try {
      const res = await fetch(`/api/documents/${slotData.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedFields[slotKey] || slotData.extractedFields || {})
      });
      const data = await res.json();
      if (data.success) {
        setEditingSlot(null);
        await fetchStatus();
      }
    } catch (err) {
      console.error('Confirm error:', err);
    }
  };

  const verifiedCount = docStatus?.verifiedCount || 0;
  const totalRequired = 4;
  const progressPercent = Math.round((verifiedCount / totalRequired) * 100);
  const allVerified = verifiedCount === 4;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER CARD & PROGRESS BAR */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
              Phase 2 Passport Operational Document Upload
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
              Operational Document Verification Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mt-1">
              Upload the 4 required operational documents to enable Digital Product Passport (DPP) generation. All files undergo 4-signal deterministic validation & OpenRouter AI field extraction.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-2xl font-extrabold text-zinc-900 font-display">
              {verifiedCount} <span className="text-sm font-medium text-zinc-400">/ 4 Verified</span>
            </div>
            <div className="text-xs font-bold text-emerald-700">{progressPercent}% Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden border border-zinc-200">
          <div 
            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* CTA GATED PASSPORT GENERATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-zinc-100">
          <div className="text-xs text-zinc-500">
            {allVerified ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 4 operational documents verified! You are eligible to generate Digital Product Passports.
              </span>
            ) : (
              <span>Upload and verify all 4 slots to unlock passport batch creation.</span>
            )}
          </div>

          <button
            type="button"
            disabled={!allVerified}
            onClick={() => navigate('/create-batch')}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              allVerified 
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20' 
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <span>Generate Digital Passport</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 SLOT CARDS GRID */}
      <div className="grid grid-cols-1 gap-5">
        {slotsMeta.map(meta => {
          const Icon = meta.icon;
          const slotData = docStatus?.slots?.[meta.key] || { status: 'NOT_UPLOADED' };
          const status = slotData.status;
          const isUploading = uploadingSlot === meta.key;

          return (
            <div key={meta.key} className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
              
              {/* SLOT HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-zinc-100 text-zinc-800 font-bold border border-zinc-200 mt-0.5">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base font-display">{meta.title}</h3>
                    <p className="text-xs text-zinc-500">{meta.subtitle}</p>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div>
                  {status === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED ✓
                    </span>
                  )}
                  {status === 'NEEDS_REVIEW' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      NEEDS REVIEW
                    </span>
                  )}
                  {status === 'REJECTED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      REJECTED
                    </span>
                  )}
                  {status === 'NOT_UPLOADED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 border border-zinc-300">
                      <Clock className="w-3.5 h-3.5" />
                      NOT UPLOADED
                    </span>
                  )}
                </div>
              </div>

              {/* UPLOADING PIPELINE STATE */}
              {isUploading && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Preprocessing (Deskew/Binarize) ➔ Running Tesseract OCR v5.5 ➔ OpenRouter AI Extraction...</span>
                  </div>
                </div>
              )}

              {/* SLOT STATE 1: VERIFIED READ-ONLY SUMMARY */}
              {status === 'VERIFIED' && !isUploading && slotData.extractedFields && (
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-zinc-500 font-bold text-[11px] uppercase tracking-wider">
                    <span>Extracted Verified Fields</span>
                    <span className="text-emerald-700 font-bold">OCR Score: {slotData.ocrConfidence || 94.5}%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(slotData.extractedFields).map(([k, v]) => (
                      <div key={k} className="bg-white p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase block">{k.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-zinc-900 text-xs truncate block">{String(v || 'N/A')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLOT STATE 2: NEEDS REVIEW INLINE CONFIRMATION */}
              {status === 'NEEDS_REVIEW' && !isUploading && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Human Confirmation Needed: {slotData.rejectionReason || 'Plasuibility flag detected.'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(slotData.extractedFields || {}).map(([k, v]) => (
                      <div key={k} className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-900 uppercase block">{k.replace(/_/g, ' ')}</label>
                        <input
                          type="text"
                          defaultValue={String(v || '')}
                          onChange={(e) => {
                            setEditedFields(prev => ({
                              ...prev,
                              [meta.key]: {
                                ...(prev[meta.key] || slotData.extractedFields),
                                [k]: e.target.value
                              }
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-zinc-900"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConfirmFields(meta.key, slotData)}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Confirm Corrected Fields & Verify Slot
                  </button>
                </div>
              )}

              {/* SLOT STATE 3: REJECTED */}
              {status === 'REJECTED' && !isUploading && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3 text-xs text-rose-900">
                  <div className="font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Rejection Reason: {slotData.rejectionReason}</span>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all">
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-upload Document File</span>
                    <input 
                      type="file" 
                      accept={meta.accept} 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(meta.key, e.target.files[0])}
                    />
                  </label>
                </div>
              )}

              {/* UPLOAD / SIMULATE CTA FOR NOT UPLOADED SLOT */}
              {(status === 'NOT_UPLOADED' || status === 'VERIFIED') && !isUploading && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm flex items-center gap-2 transition-all">
                    <FileUp className="w-4 h-4" />
                    <span>{status === 'VERIFIED' ? 'Replace File' : 'Upload Document File'}</span>
                    <input 
                      type="file" 
                      accept={meta.accept} 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(meta.key, e.target.files[0])}
                    />
                  </label>

                  {status === 'NOT_UPLOADED' && (
                    <button
                      type="button"
                      onClick={() => handleFileUpload(meta.key, null)}
                      className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Simulate AI Scan & OCR Extraction</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
