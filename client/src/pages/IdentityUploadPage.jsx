import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, FileCheck, Upload, AlertCircle, CheckCircle2, ArrowRight, XCircle, RefreshCw } from 'lucide-react';

export function IdentityUploadPage({ navigate }) {
  const { msme, submitIdentityProof, loading } = useAuth();

  const [udyamFile, setUdyamFile] = useState(null);
  const [gstFile, setGstFile] = useState(null);
  const [udyamNoInput, setUdyamNoInput] = useState(msme?.udyamNumber || 'UDYAM-TN-28-0019284');
  const [gstinInput, setGstinInput] = useState(msme?.gstin || '33AAACJ1928A1Z5');

  const [udyamStatus, setUdyamStatus] = useState(msme?.status === 'ACTIVE' ? 'verified' : 'pending');
  const [gstStatus, setGstStatus] = useState(msme?.status === 'ACTIVE' ? 'verified' : 'pending');
  const [gstinMatchState, setGstinMatchState] = useState(null); // 'matched' | 'mismatched'
  const [errorMessage, setErrorMessage] = useState('');

  const registeredGstin = (msme?.gstin || '33AAACJ1928A1Z5').toUpperCase().trim();

  const handleUdyamUpload = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setUdyamStatus('verifying');
      const result = await submitIdentityProof(msme.id, 'udyam_certificate', udyamFile, {
        udyamNumber: udyamNoInput,
        businessName: msme.businessName,
      });
      setUdyamStatus(result.proof?.verificationStatus || 'verified');
    } catch (err) {
      setUdyamStatus('rejected');
      setErrorMessage(err.message);
    }
  };

  const handleGstUpload = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setGstStatus('verifying');
      const result = await submitIdentityProof(msme.id, 'gst_certificate', gstFile, {
        gstin: gstinInput,
        businessName: msme.businessName,
      });

      const currentStatus = result.proof?.verificationStatus || 'verified';
      setGstStatus(currentStatus);

      if (gstinInput.toUpperCase().trim() === registeredGstin) {
        setGstinMatchState('matched');
      } else {
        setGstinMatchState('mismatched');
      }

      if (result.accountStatus === 'ACTIVE') {
        setTimeout(() => {
          navigate('/verification-status');
        }, 1200);
      }
    } catch (err) {
      setGstStatus('rejected');
      setGstinMatchState('mismatched');
      setErrorMessage(err.message);
    }
  };

  const canComplete = udyamStatus === 'verified' && gstStatus === 'verified';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-slate-900 to-emerald-950 text-white p-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
              Step 1c — Identity & Trust Proof Submission
            </span>
            <span className="text-xs text-zinc-300 font-mono">
              Registered GSTIN: <strong className="text-white">{registeredGstin}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Government Identity Proof Verification</h1>
          <p className="text-sm text-zinc-300 max-w-2xl">
            Upload your official Udyam MSME Registration and GST Certificates. Our mock Government DPI API cross-checks document authenticity and verifies GSTIN alignment before activating your passport generator.
          </p>
        </div>

        {errorMessage && (
          <div className="m-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* GSTIN Match Status Banner */}
        {gstinMatchState && (
          <div className={`mx-6 mt-6 p-4 rounded-xl border flex items-start gap-3 text-sm ${
            gstinMatchState === 'matched'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {gstinMatchState === 'matched' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-900">✅ GSTIN Cross-Check Verified</div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    GST Certificate GSTIN (<code className="font-bold">{gstinInput}</code>) matches registration GSTIN (<code className="font-bold">{registeredGstin}</code>). Government API trust reference issued!
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-900">❌ GSTIN Cross-Check Failure</div>
                  <p className="text-xs text-rose-700 mt-0.5">
                    GST Certificate GSTIN (<code className="font-bold">{gstinInput}</code>) DOES NOT match registration GSTIN (<code className="font-bold">{registeredGstin}</code>). Account verification failed.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document 1: Udyam Certificate */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">1. Udyam MSME Certificate</h3>
                    <p className="text-[11px] text-zinc-500">Ministry of MSME Registration</p>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  udyamStatus === 'verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  udyamStatus === 'verifying' ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' :
                  udyamStatus === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}>
                  {udyamStatus === 'verified' ? 'Verified ✓' :
                   udyamStatus === 'verifying' ? 'Verifying DPI...' :
                   udyamStatus === 'rejected' ? 'Rejected' : 'Not Uploaded'}
                </span>
              </div>

              <div className="space-y-3 mb-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Extracted Udyam Number</label>
                  <input
                    type="text"
                    value={udyamNoInput}
                    onChange={(e) => setUdyamNoInput(e.target.value.toUpperCase())}
                    placeholder="UDYAM-TN-28-0019284"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono uppercase text-xs"
                  />
                </div>

                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-all bg-white cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUdyamFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-zinc-700">
                    {udyamFile ? udyamFile.name : 'Drop Udyam Certificate (PDF/PNG)'}
                  </p>
                  <p className="text-[10px] text-zinc-400">Max 5MB</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUdyamUpload}
              disabled={loading || udyamStatus === 'verifying'}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {udyamStatus === 'verifying' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
              {udyamStatus === 'verified' ? 'Re-Verify Udyam Certificate' : 'Verify Udyam via DPI'}
            </button>
          </div>

          {/* Document 2: GST Certificate */}
          <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">2. GST Registration Certificate</h3>
                    <p className="text-[11px] text-zinc-500">Form GST REG-06 Clearance</p>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  gstStatus === 'verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  gstStatus === 'verifying' ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' :
                  gstStatus === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}>
                  {gstStatus === 'verified' ? 'Verified ✓' :
                   gstStatus === 'verifying' ? 'Verifying GSTN...' :
                   gstStatus === 'rejected' ? 'Failed' : 'Not Uploaded'}
                </span>
              </div>

              <div className="space-y-3 mb-4 text-xs">
                <div>
                  <label className="block text-zinc-700 font-medium mb-1">Extracted GSTIN on Certificate</label>
                  <input
                    type="text"
                    value={gstinInput}
                    onChange={(e) => setGstinInput(e.target.value.toUpperCase().trim())}
                    placeholder="33AAACJ1928A1Z5"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono uppercase text-xs"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Must match registered GSTIN (<code className="font-semibold">{registeredGstin}</code>)</p>
                </div>

                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center hover:border-teal-500 transition-all bg-white cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setGstFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-zinc-700">
                    {gstFile ? gstFile.name : 'Drop GST Certificate (PDF/PNG)'}
                  </p>
                  <p className="text-[10px] text-zinc-400">Max 5MB</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGstUpload}
              disabled={loading || gstStatus === 'verifying'}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {gstStatus === 'verifying' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
              {gstStatus === 'verified' ? 'Re-Verify GST Certificate' : 'Verify GSTN & Cross-Check'}
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            Both Udyam + GST Certificates must pass DPI verification to activate account.
          </div>

          <button
            type="button"
            onClick={() => navigate('/verification-status')}
            className={`px-6 py-3 rounded-xl font-medium text-xs flex items-center gap-2 transition-all ${
              canComplete
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-700/20'
                : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
            }`}
          >
            Check Final Verification Status
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
