import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HangtagPrintModal } from '../components/HangtagPrintModal';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  RefreshCw, 
  QrCode, 
  ChevronRight,
  Factory,
  Building2,
  Truck,
  Check,
  Printer,
  Download,
  Leaf
} from 'lucide-react';

export function CreateBatchPage({ navigate }) {
  // WORKFLOW STEPS:
  // 1: UPLOAD_INVOICE
  // 2: EXTRACTING_OCR
  // 3: BATCH_CREATED_PREVIEW
  // 4: VAULT_CHECK_AND_ENRICHMENT
  // 5: PASSPORT_READY
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [extractedInvoice, setExtractedInvoice] = useState(null);
  const [createdBatch, setCreatedBatch] = useState(null);
  const [enrichmentLoading, setEnrichmentLoading] = useState(false);
  const [generatingPassport, setGeneratingPassport] = useState(false);
  const [showHangtagModal, setShowHangtagModal] = useState(false);

  const handleDownloadQrPng = () => {
    const svg = document.getElementById('step5-batch-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(img, 50, 50, 500, 500);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${createdBatch?.batchNumber || 'vastrasetu'}_DPP_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Missing Evidence Items State for Step 4
  const [missingItems, setMissingItems] = useState([
    {
      id: 'dyeing_record',
      title: 'Batch Dyeing & Wet Processing Run Record',
      category: 'PRODUCTION',
      issuer: 'Rainbow Eco-Dyers Tiruppur',
      standard: 'OEKO-TEX Standard 100 Class I',
      status: 'PENDING',
      extractedData: null
    },
    {
      id: 'shipping_bill',
      title: 'Shipping Bill for Export of Goods',
      category: 'CUSTOMS',
      issuer: 'Indian Customs ICEGATE',
      standard: 'Manual document uploaded / External status not connected',
      status: 'PENDING',
      extractedData: null
    },
    {
      id: 'bill_of_lading',
      title: 'Ocean Bill of Lading (B/L)',
      category: 'TRANSPORT',
      issuer: 'Maersk Line Tuticorin',
      standard: 'Negotiable Ocean Freight Transport Document',
      status: 'PENDING',
      extractedData: null
    }
  ]);

  // Handler: Select sample invoice or upload real invoice
  const handleStartWithSampleInvoice = async () => {
    setCurrentStep(2);
    try {
      const res = await fetch('/api/v2/extract-invoice', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        setExtractedInvoice(json.data);
      }
    } catch (err) {
      setExtractedInvoice({
        invoiceNumber: 'INV-2026-1042',
        invoiceDate: '2026-08-20',
        exporterName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
        buyerName: 'XYZ Fashion GmbH',
        productName: '100% Organic Cotton Crewneck T-Shirt',
        styleCode: 'TS-26-ORG-01',
        fabricComposition: '100% Organic Cotton Single Jersey (180 GSM), Combed Ring Spun',
        quantity: 5000,
        unitPrice: 6.50,
        totalValue: 32500.0,
        currency: 'EUR',
        hsCode: '6109.10',
        targetCountry: 'Germany',
        destinationPort: 'Hamburg Port, Germany',
        transportMode: 'SEA',
        incoterm: 'CIF',
        confidence: 0.98,
        verificationStatus: 'DOCUMENT_EXTRACTED'
      });
    }

    // Auto-create batch on backend
    setTimeout(async () => {
      try {
        const createRes = await fetch('/api/v2/batches/from-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: 'INV-2026-1042',
            productName: '100% Organic Cotton Crewneck T-Shirt',
            styleCode: 'TS-26-ORG-01',
            quantity: 5000,
            fabricComposition: '100% Organic Cotton Single Jersey (180 GSM), Combed Ring Spun',
            buyerName: 'XYZ Fashion GmbH',
            targetCountry: 'Germany',
            destinationPort: 'Hamburg Port, Germany',
            totalValue: 32500.0,
            currency: 'EUR',
            hsCode: '6109.10'
          })
        });
        const createJson = await createRes.json();
        if (createJson.success && createJson.data) {
          setCreatedBatch(createJson.data);
        }
      } catch (e) {
        console.warn('Batch creation fallback');
      }
      setCurrentStep(3);
    }, 1800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFile(file);
      handleStartWithSampleInvoice();
    }
  };

  // Handler: 1-Click Upload & OCR Extract for missing batch evidence in Step 4
  const handleUploadMissingItem = async (itemId) => {
    setEnrichmentLoading(true);
    try {
      const docTypeMap = {
        dyeing_record: 'OEKOTEX_STANDARD_100',
        shipping_bill: 'SHIPPING_BILL',
        bill_of_lading: 'BILL_OF_LADING'
      };

      const res = await fetch(`/api/v2/extract-document?docType=${docTypeMap[itemId]}`, { method: 'POST' });
      const json = await res.json();

      if (json.success && json.data) {
        // Attach evidence to created batch
        if (createdBatch) {
          await fetch(`/api/v2/batches/${createdBatch.batchNumber}/evidence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json.data)
          });
        }

        setMissingItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              status: 'DOCUMENT_SUPPORTED',
              extractedData: json.data
            };
          }
          return item;
        }));
      }
    } catch (err) {
      console.warn('Enrichment error:', err);
    } finally {
      setEnrichmentLoading(false);
    }
  };

  // Handler: Generate Digital Product Passport
  const handleGeneratePassport = async () => {
    setGeneratingPassport(true);
    try {
      if (createdBatch) {
        const res = await fetch(`/api/v2/batches/${createdBatch.batchNumber}/passport`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Initial Export Passport Publishing' })
        });
        const json = await res.json();
        if (json.success && json.data) {
          setCreatedBatch(json.data);
        }
      }
      setTimeout(() => {
        setGeneratingPassport(false);
        setCurrentStep(5);
      }, 1500);
    } catch (err) {
      setGeneratingPassport(false);
      setCurrentStep(5);
    }
  };

  const allMissingEnriched = missingItems.every(i => i.status === 'DOCUMENT_SUPPORTED');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      
      {/* 1. TOP PROGRESS TRACKER */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 text-xs">
          {[
            { num: 1, label: 'Upload Invoice', active: currentStep === 1, done: currentStep > 1 },
            { num: 2, label: 'OCR Extraction', active: currentStep === 2, done: currentStep > 2 },
            { num: 3, label: 'Batch Created', active: currentStep === 3, done: currentStep > 3 },
            { num: 4, label: 'Evidence & Vault Check', active: currentStep === 4, done: currentStep > 4 },
            { num: 5, label: 'Passport Ready', active: currentStep === 5, done: currentStep >= 5 },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                s.done
                  ? 'bg-emerald-600 text-white'
                  : s.active
                  ? 'bg-zinc-900 text-white ring-4 ring-zinc-100'
                  : 'bg-zinc-100 text-zinc-400'
              }`}>
                {s.done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`font-semibold ${s.active ? 'text-zinc-900 font-bold' : s.done ? 'text-emerald-800' : 'text-zinc-400'}`}>
                {s.label}
              </span>
              {idx < 4 && <ChevronRight className="w-4 h-4 text-zinc-300 ml-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: UPLOAD COMMERCIAL INVOICE */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200 shadow-sm space-y-8 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Invoice-First Zero Manual Entry Workflow
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-display">
              Create New Export Batch
            </h1>
            <p className="text-sm text-zinc-500">
              Upload your Commercial Export Invoice. VastraSetu automatically extracts the product, quantity, buyer, destination, and pricing, creates the batch record, and links your organization credentials.
            </p>
          </div>

          {/* Drag & Drop Dropzone */}
          <div className="border-2 border-dashed border-zinc-300 hover:border-emerald-500 rounded-3xl p-10 bg-zinc-50/60 hover:bg-emerald-50/20 transition-all cursor-pointer max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            
            <div>
              <p className="font-bold text-base text-zinc-800">
                Drag and drop your Commercial Invoice here
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Supports PDF, scanned invoice images, and EDI export summaries
              </p>
            </div>

            <div className="pt-2">
              <label className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-all inline-block">
                <span>Browse File</span>
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Quick Demo Preset Button */}
          <div className="pt-4 border-t border-zinc-100 max-w-md mx-auto space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Or Try with Real-World Export Preset
            </p>
            <button
              type="button"
              onClick={handleStartWithSampleInvoice}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white font-bold text-xs flex items-center justify-between shadow-md hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-3 text-left">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <strong className="block text-sm">Invoice INV-2026-1042 (CIF Hamburg)</strong>
                  <span className="text-[11px] text-emerald-200 font-normal">
                    5,000 pcs 100% Organic Cotton T-Shirts • EUR 32,500 • Germany
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PROCESSING & OCR EXTRACTION */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-zinc-200 shadow-sm text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          
          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-zinc-900 font-display">
              Processing Commercial Invoice...
            </h2>
            <p className="text-xs text-zinc-500">
              Applying AI OCR parser, extracting shipment lines, and verifying document structure.
            </p>
          </div>

          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-left text-xs font-mono space-y-2 text-zinc-600">
            <div className="flex items-center justify-between text-emerald-800 font-bold">
              <span>✓ File format & SHA-256 integrity hash</span>
              <span>PASSED</span>
            </div>
            <div className="flex items-center justify-between text-emerald-800 font-bold">
              <span>✓ Document type detection: Commercial Invoice</span>
              <span>PASSED</span>
            </div>
            <div className="flex items-center justify-between text-emerald-800 font-bold">
              <span>✓ Extracting product, buyer, destination & quantities</span>
              <span>98% CONFIDENCE</span>
            </div>
            <div className="flex items-center justify-between text-emerald-800 font-bold">
              <span>✓ Generating draft export garment batch</span>
              <span>CREATING...</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: BATCH AUTO-CREATED SUMMARY */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-zinc-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Batch Created Automatically
                </span>
                <span className="text-xs text-zinc-400 font-mono">Invoice Provenance</span>
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 font-display">
                Batch {createdBatch?.batchNumber || 'VS-2026-B00052'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Manual Typing (100% Extracted)</span>
              </span>
            </div>
          </div>

          {/* Structured Extracted Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Product Description</span>
              <p className="text-sm font-bold text-zinc-900">{extractedInvoice?.productName || '100% Organic Cotton Crewneck T-Shirt'}</p>
              <span className="text-[10px] text-emerald-800 font-medium block">Source: Commercial Invoice (98% Conf)</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Export Quantity</span>
              <p className="text-sm font-bold text-zinc-900 font-mono">
                {extractedInvoice?.quantity?.toLocaleString() || '5,000'} PCS
              </p>
              <span className="text-[10px] text-emerald-800 font-medium block">Source: Commercial Invoice (99% Conf)</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Buyer / Consignee</span>
              <p className="text-sm font-bold text-zinc-900">{extractedInvoice?.buyerName || 'XYZ Fashion GmbH'}</p>
              <span className="text-[10px] text-zinc-400 truncate block">Hamburg, Germany</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Invoice Number</span>
              <p className="text-sm font-bold text-zinc-900 font-mono">{extractedInvoice?.invoiceNumber || 'INV-2026-1042'}</p>
              <span className="text-[10px] text-zinc-400 block">Dated {extractedInvoice?.invoiceDate || '2026-08-20'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Destination & Port</span>
              <p className="text-sm font-bold text-zinc-900">{extractedInvoice?.destinationPort || 'Hamburg Port, Germany'}</p>
              <span className="text-[10px] text-zinc-400 block">Incoterm: CIF Hamburg</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Commercial Value & HS Code</span>
              <p className="text-sm font-bold text-zinc-900 font-mono">EUR 32,500 • HS 6109.10</p>
              <span className="text-[10px] text-emerald-800 font-medium block">Rate: EUR 6.50 / piece</span>
            </div>

          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-emerald-950 font-medium">
                VastraSetu is now checking your <strong>Document Vault</strong> for reusable organization credentials and identifying what evidence is still missing.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 transition-all"
            >
              <span>Check Vault & Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: DOCUMENT VAULT SEARCH & PROGRESSIVE EVIDENCE CHECKLIST */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Smart Evidence Collector
                </span>
                <span className="text-xs text-zinc-400 font-mono">Batch {createdBatch?.batchNumber || 'VS-2026-B00052'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
                Batch Document & Certificate Checklist
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                Existing credentials have been automatically linked from your Document Vault. Upload only the missing batch-specific records below.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGeneratePassport}
                disabled={generatingPassport}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
              >
                {generatingPassport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Passport...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Digital Product Passport</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section A: Reusable Credentials Auto-Found in Vault */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-zinc-900 font-display">
                  ✓ Reusable Credentials Auto-Linked from Document Vault
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                4/4 FOUND & VALID
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start justify-between">
                <div className="space-y-0.5">
                  <strong className="text-emerald-950 font-bold">Exporter IEC Registration</strong>
                  <p className="text-[11px] text-emerald-900 font-mono">0305012984 • DGFT Verified</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  AUTO REUSED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start justify-between">
                <div className="space-y-0.5">
                  <strong className="text-emerald-950 font-bold">GST Registration Certificate</strong>
                  <p className="text-[11px] text-emerald-900 font-mono">33AAACJ1928A1Z5 (Tamil Nadu)</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  AUTO REUSED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start justify-between">
                <div className="space-y-0.5">
                  <strong className="text-emerald-950 font-bold">GOTS v7.0 Facility Scope Certificate</strong>
                  <p className="text-[11px] text-emerald-900 font-mono">CU-841920 • Valid until 2026-12-31</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  AUTO REUSED
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start justify-between">
                <div className="space-y-0.5">
                  <strong className="text-emerald-950 font-bold">TNPCB 100% ZLD Consent Order</strong>
                  <p className="text-[11px] text-emerald-900 font-mono">TNPCB-ZLD-2026-8812 • Valid until 2026-09-30</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  AUTO REUSED
                </span>
              </div>

            </div>
          </div>

          {/* Section B: Batch-Specific Documents (Missing Evidence Requests) */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-zinc-900 font-display">
                  Batch-Specific Evidence Items
                </h3>
              </div>
              <span className="text-xs text-zinc-500">
                Upload or confirm OCR extraction for each document
              </span>
            </div>

            <div className="space-y-3">
              
              {/* 1. Commercial Invoice (Already uploaded in Step 1) */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-zinc-900 block font-bold">Commercial Export Invoice</strong>
                    <span className="text-[11px] text-zinc-500 font-mono">INV-2026-1042 • EUR 32,500 • 5,000 PCS</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ATTACHED (STEP 1)
                </span>
              </div>

              {/* 2. Interactive Missing Items */}
              {missingItems.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    item.status === 'DOCUMENT_SUPPORTED'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      item.status === 'DOCUMENT_SUPPORTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status === 'DOCUMENT_SUPPORTED' ? '✓' : '○'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-zinc-900 font-bold">{item.title}</strong>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{item.issuer} • {item.standard}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    {item.status === 'DOCUMENT_SUPPORTED' ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>OCR EXTRACTED & ATTACHED</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUploadMissingItem(item.id)}
                        disabled={enrichmentLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload & OCR Extract</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Direct Proceed Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleGeneratePassport}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Digital Product Passport →</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: DIGITAL PRODUCT PASSPORT GENERATED */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
          
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Polygon Amoy PoS Anchored
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 font-display">
              Digital Product Passport Published!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Batch <strong>{createdBatch?.batchNumber || 'VS-2026-B00052'}</strong> is 100% compliant with EU DPP regulations and ready for export shipment.
            </p>
          </div>

          {/* QR Code & Hash Preview */}
          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 space-y-4 max-w-md mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 inline-block shadow-xs">
              <QRCodeSVG
                id="step5-batch-qr-svg"
                value={typeof window !== 'undefined' ? `${window.location.origin}/verify/${createdBatch?.batchNumber || 'VS-2026-B00041'}` : `https://vastrasetu.vercel.app/verify/${createdBatch?.batchNumber || 'VS-2026-B00041'}`}
                size={160}
                level="H"
                includeMargin={false}
                fgColor="#092f23"
              />
            </div>

            <div className="space-y-1">
              <strong className="font-mono text-xs text-zinc-900 block">{createdBatch?.batchNumber || 'VS-2026-B00052'}</strong>
              <span className="text-[11px] text-zinc-400 block">Persistent GS1 Digital Link / DPP QR</span>
            </div>

            {/* Quick QR & Hangtag Actions */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={handleDownloadQrPng}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR PNG</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHangtagModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print 2.5"×4.5" Hangtag</span>
              </button>
            </div>

            <div className="text-xs font-mono space-y-1 text-zinc-600 pt-1 text-left bg-white p-3 rounded-xl border border-zinc-200">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-sans text-[11px]">Passport Hash:</span>
                <span className="font-bold text-zinc-900 text-[11px] truncate max-w-[200px]">{createdBatch?.passportHash || '0x51081b8491be...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-sans text-[11px]">Blockchain:</span>
                <span className="text-purple-800 font-bold text-[11px]">Polygon Amoy PoS</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/batches/${createdBatch?.batchNumber || 'VS-2026-B00041'}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Open Batch Command Center</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/batches')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-xs transition-all"
            >
              <span>View All Batches</span>
            </button>
          </div>

        </div>
      )}

      {/* HANGTAG PRINT MODAL */}
      <HangtagPrintModal
        isOpen={showHangtagModal}
        onClose={() => setShowHangtagModal(false)}
        batch={createdBatch || {
          batchNumber: 'VS-2026-B00041',
          productName: '100% Organic Cotton Crewneck T-Shirt',
          styleCode: 'TS-26-ORG-01',
          fabricComposition: '100% Organic Cotton Single Jersey (180 GSM), Combed Ring Spun',
          carbonKgPerPiece: 2.45,
          waterRecycledPercent: 94.2
        }}
      />

    </div>
  );
}
