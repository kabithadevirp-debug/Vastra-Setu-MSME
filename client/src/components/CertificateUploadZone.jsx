import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  Eye, 
  RotateCw, 
  ShieldCheck, 
  Award, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function CertificateUploadZone({
  certificateType = 'gots', // 'gots' | 'oeko_tex' | 'tnpcb_zld'
  title = 'Upload Certificate (PDF or Image)',
  description = 'Supports GOTS, OEKO-TEX, and TNPCB certificates (.pdf, .png, .jpg)',
  onVerified,
  currentVerification,
  expectedEntity = '',
  batchId = '',
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [verificationResult, setVerificationResult] = useState(currentVerification || null);
  const [showRawText, setShowRawText] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setErrorMsg(null);
    setSelectedFile(file);

    // Create local preview if image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Trigger OCR verification
    await runOcrVerification(file);
  };

  const runOcrVerification = async (file) => {
    setScanning(true);
    setScanStep('Uploading certificate to OCR processing pipeline...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('certificateType', certificateType);
      formData.append('expectedEntity', expectedEntity);
      formData.append('batchId', batchId);

      setScanStep('Invoking local Tesseract OCR & PDF text extraction engine...');

      const res = await fetch('/api/certificates/verify-ocr', {
        method: 'POST',
        body: formData,
      });

      setScanStep('Analyzing compliance markers against EU Ecodesign standards...');

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'OCR processing failed');
      }

      setVerificationResult(data.data);
      if (onVerified) {
        onVerified(data.data);
      }
    } catch (err) {
      console.error('OCR verification failed:', err);
      setErrorMsg(err.message || 'Failed to verify certificate via OCR.');
    } finally {
      setScanning(false);
      setScanStep('');
    }
  };

  // One-click load sample certificate
  const handleLoadSample = async () => {
    setErrorMsg(null);
    setScanning(true);
    setScanStep('Loading official test certificate into OCR engine...');

    try {
      const sampleEndpoints = {
        gots: 'sample-gots',
        oeko_tex: 'sample-oeko-tex',
        'oeko-tex': 'sample-oeko-tex',
        tnpcb_zld: 'sample-tnpcb-zld',
        cetp: 'sample-tnpcb-zld',
      };

      const sampleId = sampleEndpoints[certificateType] || 'sample-gots';
      const res = await fetch('/api/certificates/samples');
      const data = await res.json();

      if (data.success) {
        const sample = data.data.find(s => s.id === sampleId) || data.data[0];

        // Create a blob file from the sample text
        const blob = new Blob([sample.rawText], { type: 'text/plain' });
        const file = new File([blob], `${sample.id}-certificate.pdf`, { type: 'application/pdf' });

        setSelectedFile(file);
        setPreviewUrl(null);

        // Send to OCR verification
        const formData = new FormData();
        formData.append('file', file);
        formData.append('certificateType', certificateType);
        formData.append('expectedEntity', expectedEntity);
        formData.append('batchId', batchId);

        const verifyRes = await fetch('/api/certificates/verify-ocr', {
          method: 'POST',
          body: formData,
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setVerificationResult(verifyData.data);
          if (onVerified) {
            onVerified(verifyData.data);
          }
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load sample certificate.');
    } finally {
      setScanning(false);
      setScanStep('');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center ${
          dragActive
            ? 'border-brand-600 bg-brand-50/70 scale-[1.01]'
            : verificationResult?.verification?.isValid
            ? 'border-emerald-300 bg-emerald-50/20'
            : 'border-zinc-300 bg-zinc-50/60 hover:bg-zinc-100/50 hover:border-zinc-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Scanning Animation Overlay */}
        {scanning && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 z-10 animate-in fade-in space-y-3">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
              <Sparkles className="w-6 h-6 text-brand-700 animate-pulse" />
            </div>
            <div className="space-y-1 text-center max-w-sm">
              <strong className="text-xs font-bold text-zinc-900 block">Tesseract OCR Verification in Progress</strong>
              <p className="text-[11px] text-zinc-500 font-mono animate-pulse">{scanStep}</p>
            </div>
          </div>
        )}

        {/* Default / Unloaded State */}
        {!selectedFile && !verificationResult && (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-zinc-900">{title}</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">{description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-105"
              >
                Browse PDF / Image
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3 py-2 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs rounded-xl border border-zinc-300 shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Test with Sample Cert</span>
              </button>
            </div>

            <span className="text-[10px] text-zinc-400 block pt-1">
              Local OCR Engine • Tesseract v5.5.3 (C:\Program Files\Tesseract-OCR) & pdf-parse
            </span>
          </div>
        )}

        {/* Selected / Verified File Display */}
        {(selectedFile || verificationResult) && !scanning && (
          <div className="space-y-4 text-left">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
                  {selectedFile?.type?.includes('pdf') || verificationResult?.fileName?.endsWith('.pdf') ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <strong className="text-xs text-zinc-900 block truncate max-w-xs sm:max-w-md">
                    {selectedFile?.name || verificationResult?.fileName || 'Uploaded Certificate'}
                  </strong>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Verified via Local Tesseract'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
                >
                  Load Sample
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* OCR Verification Card */}
            {verificationResult?.verification && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 shadow-xs">
                
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                      verificationResult.verification.isValid
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {verificationResult.verification.isValid ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{verificationResult.verification.trustBadge}</span>
                    </span>

                    <span className="text-[11px] font-bold text-zinc-800">
                      {verificationResult.verification.standardName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <span>Score: {verificationResult.verification.authenticityScore}%</span>
                  </div>
                </div>

                {/* Extracted Key Markers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {verificationResult.verification.markers?.map((marker, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block">{marker.label}</span>
                        <strong className="text-zinc-800 font-mono text-[11px]">{marker.value}</strong>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        marker.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : marker.status === 'WARN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {marker.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* OCR Engine Info & Collapsible Raw Text */}
                <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-500">
                  <span>
                    OCR Engine: <strong className="text-zinc-700">{verificationResult.ocr?.engine || 'Tesseract OCR'}</strong> ({verificationResult.ocr?.durationMs || 150}ms)
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowRawText(!showRawText)}
                    className="text-brand-700 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>{showRawText ? 'Hide Extracted Text' : 'View Extracted Text'}</span>
                    {showRawText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {showRawText && (
                  <div className="p-3 bg-zinc-950 text-zinc-200 rounded-xl font-mono text-[11px] max-h-40 overflow-y-auto leading-relaxed border border-zinc-800 animate-in fade-in">
                    <pre className="whitespace-pre-wrap">{verificationResult.ocr?.extractedText || 'No raw text stream captured.'}</pre>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
