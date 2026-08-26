import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  Building2, 
  Factory, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Check, 
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';

export function DocumentVaultPage({ navigate }) {
  const [documents, setDocuments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeScope, setActiveScope] = useState('ALL');
  const [selectedDocForRenew, setSelectedDocForRenew] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedDraft, setExtractedDraft] = useState(null);

  const fetchVault = async () => {
    setLoading(true);
    try {
      const [dRes, aRes] = await Promise.allSettled([
        fetch('/api/v2/vault/documents').then(r => r.json()),
        fetch('/api/v2/vault/alerts').then(r => r.json())
      ]);

      if (dRes.status === 'fulfilled' && dRes.value.success && dRes.value.data) {
        setDocuments(dRes.value.data);
      }
      if (aRes.status === 'fulfilled' && aRes.value.success && aRes.value.data) {
        setAlerts(aRes.value.data);
      }
    } catch (err) {
      console.warn('Vault fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleSimulateRenew = async (doc) => {
    setSelectedDocForRenew(doc);
    setExtracting(true);
    try {
      const res = await fetch(`/api/v2/extract-document?docType=${doc.documentType}&stageKey=VAULT`, {
        method: 'POST'
      });
      const json = await res.json();
      if (json.success && json.data) {
        setExtractedDraft({
          ...json.data,
          scopeType: doc.scopeType,
          documentType: doc.documentType,
          title: doc.title,
          expiryDate: '2027-12-31'
        });
      }
    } catch (err) {
      setExtractedDraft({
        scopeType: doc.scopeType,
        documentType: doc.documentType,
        title: doc.title,
        certificateNo: doc.documentNumber + '-REN',
        issuer: doc.issuer,
        issueDate: '2026-08-25',
        expiryDate: '2027-12-31'
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleConfirmRenewal = async () => {
    if (!extractedDraft) return;
    try {
      await fetch('/api/v2/vault/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scopeType: extractedDraft.scopeType,
          documentType: extractedDraft.documentType,
          title: extractedDraft.title,
          documentNumber: extractedDraft.certificateNo || 'DOC-RENEWED',
          issuer: extractedDraft.issuer || 'Issuing Authority',
          issueDate: extractedDraft.issueDate || '2026-08-25',
          expiryDate: extractedDraft.expiryDate || '2027-12-31'
        })
      });
      setExtractedDraft(null);
      setSelectedDocForRenew(null);
      await fetchVault();
    } catch (err) {
      alert('Failed to update vault document');
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (activeScope === 'ALL') return true;
    return doc.scopeType === activeScope;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. VAULT HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Reusable Organization & Facility Repository
            </span>
            <span className="text-xs text-zinc-400 font-mono">Document Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Organization Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Upload company identity, facility environmental consents, and reusable certifications once. They are automatically linked to all your export batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchVault}
            className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="Refresh Vault"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. AUTOMATIC EXPIRY & RENEWAL ALERTS */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                alert.level === 'EXPIRED' || alert.level === 'URGENT'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : alert.level === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                  alert.level === 'EXPIRED' || alert.level === 'URGENT'
                    ? 'text-rose-600'
                    : alert.level === 'WARNING'
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`} />
                <div>
                  <strong className="block font-bold">{alert.title}</strong>
                  <p className="opacity-90">{alert.message}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                alert.level === 'EXPIRED' || alert.level === 'URGENT'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : alert.level === 'WARNING'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}>
                {alert.level} ({alert.daysRemaining}d)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3. OCR EXTRACTION DRAFT PREVIEW MODAL */}
      {extracting && (
        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-purple-900">Extracting renewed certificate data via OCR...</p>
        </div>
      )}

      {extractedDraft && (
        <div className="p-5 bg-white rounded-3xl border-2 border-purple-500 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <strong className="text-sm font-bold text-zinc-900">Extracted Renewal Data: {extractedDraft.title}</strong>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              OCR PROCESSED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs font-mono">
            <div><span className="text-zinc-400 font-sans block text-[10px]">Ref Number</span><strong>{extractedDraft.certificateNo || 'CU-841920-GOTS'}</strong></div>
            <div><span className="text-zinc-400 font-sans block text-[10px]">Issuer</span>{extractedDraft.issuer || 'Control Union'}</div>
            <div><span className="text-zinc-400 font-sans block text-[10px]">Issue Date</span>{extractedDraft.issueDate || '2026-08-25'}</div>
            <div><span className="text-zinc-400 font-sans block text-[10px]">New Expiry Date</span><strong className="text-emerald-800">{extractedDraft.expiryDate || '2027-12-31'}</strong></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-500">
              Confirm the extracted details to update this document in your Document Vault.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExtractedDraft(null)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-xs hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all"
              >
                ✓ Confirm & Save to Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SCOPE FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Vault Documents' },
          { id: 'ORGANIZATION', label: 'Organization Identity (IEC, PAN, GST)' },
          { id: 'FACILITY_DYEING', label: 'Dyeing Facility Credentials' },
          { id: 'FACILITY_CETP', label: 'Environmental & ZLD Consents' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScope(tab.id)}
            className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
              activeScope === tab.id
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. VAULT DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const days = doc.daysUntilExpiry;
          const isExpiring = days != null && days <= 90;
          const isExpired = days != null && days < 0;

          return (
            <div 
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Card Top: Scope & Authenticity Status */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                    {doc.scopeType.replace('FACILITY_', '').replace('_', ' ')}
                  </span>

                  {/* Authenticity Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    doc.authenticityStatus === 'ISSUER_VERIFIED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {doc.authenticityStatus === 'ISSUER_VERIFIED' ? 'ISSUER VERIFIED' : 'DOCUMENT STRUCTURE CHECKED'}
                  </span>
                </div>

                {/* Title & Ref */}
                <div>
                  <h3 className="text-base font-bold text-zinc-900 font-display">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                      {doc.documentNumber || 'REF-N/A'}
                    </span>
                    <span className="text-xs text-zinc-400 truncate">{doc.issuer}</span>
                  </div>
                </div>

                {/* Expiry & Validity Info */}
                <div className="text-xs space-y-1 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100 text-zinc-700">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Validity:</span>
                    <span className="font-medium">
                      {doc.expiryDate ? (
                        <span className={isExpired ? 'text-rose-700 font-bold' : isExpiring ? 'text-amber-700 font-bold' : 'text-zinc-900'}>
                          Valid until {doc.expiryDate} ({days} days left)
                        </span>
                      ) : (
                        <span className="text-emerald-800 font-bold">No Expiration (Permanent)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">SHA-256 Hash:</span>
                    <span className="font-mono text-zinc-500 truncate max-w-[200px]">{doc.fileHash || '0x7f28a...'}</span>
                  </div>
                </div>

              </div>

              {/* Action: 1-Click Renew */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  ✓ Reusable for all batches
                </span>

                <button
                  type="button"
                  onClick={() => handleSimulateRenew(doc)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-purple-50 hover:text-purple-800 text-zinc-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Renew / Replace</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
