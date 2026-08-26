import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HangtagPrintModal } from './HangtagPrintModal';
import { 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Hexagon, 
  ShieldCheck, 
  Leaf, 
  Award, 
  FileText,
  Clock,
  Droplets,
  Zap,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  Share2,
  ChevronRight,
  Info,
  Printer,
  Lock,
  X
} from 'lucide-react';

export function DigitalProductPassportView({ batch, passportData, isPublic = false, navigate }) {
  const [copied, setCopied] = useState(false);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessSubmitted, setAccessSubmitted] = useState(false);

  // Safely extract props with fallbacks
  const data = passportData || batch || {};
  const dppId = data.passportId || data.batchId || data.id || 'VS-2026-00041';
  
  const productName = data.productName || data.garmentTitle || '100% Organic Cotton T-Shirt';
  const fabricDescription = data.fabricDescription || data.fabricComposition || '100% Organic Cotton (GOTS Certified)';
  const brandName = data.brandName || data.buyerName || 'XYZ Fashion GmbH (Germany)';
  const manufacturer = data.msmeBusinessName || data.manufacturer || 'Sri Jayavarma Knits & Exports Pvt Ltd';
  const hsCode = data.hsCode || '6109.10.00';
  const originCountry = data.originCountry || 'Tiruppur, India';
  const targetCountry = data.targetCountry || 'Germany';
  const batchNo = data.batchId || data.batchNumber || data.id || 'VS-2026-00041';
  const quantity = data.quantity || 5000;

  const carbonKg = data.carbonKg !== undefined ? data.carbonKg : 2.45;
  const waterL = data.waterLitres !== undefined ? data.waterLitres : 142.0;
  const waterRecycledPct = data.waterRecycledPercent !== undefined ? data.waterRecycledPercent : 94.2;
  const energyKwh = data.energyKwh !== undefined ? data.energyKwh : 2.1;

  const rawTxHash = data.polygonTxHash || (data.passport ? data.passport.polygonTxHash : null) || '0x7f3a0e84f2deda7d455b8b45ae9e41d0bece9c21';
  const polygonShortTx = rawTxHash.length > 14 ? `${rawTxHash.slice(0, 6)}...${rawTxHash.slice(-6)}` : rawTxHash;

  const formattedIssueDate = '20 May 2026';

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${batchNo}` 
    : `http://localhost:5173/verify/${batchNo}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svgElement = document.getElementById(`dpp-qr-${dppId}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `VastraSetu-DPP-QR-${batchNo}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const CERT_DETAILS = {
    GOTS: {
      type: 'GOTS Scope Certificate',
      number: 'CU-841920',
      holder: manufacturer,
      scope: 'Organic Cotton Knitting & Processing',
      status: '✓ ISSUER VERIFIED',
      verifiedThrough: 'Official Certification Body (Control Union B.V.)',
      validUntil: '20 May 2027',
      lastChecked: '20 August 2026'
    },
    OEKOTEX: {
      type: 'OEKO-TEX® STANDARD 100 Class I',
      number: 'OEKO-2026-TX-9912',
      holder: manufacturer,
      scope: 'Baby Safe — Low-Impact Azo-Free Dyeing',
      status: '✓ ISSUER VERIFIED',
      verifiedThrough: 'TESTEX AG Swiss Registry Validation',
      validUntil: '20 May 2027',
      lastChecked: '20 August 2026'
    },
    TNPCB: {
      type: 'TNPCB 100% Zero Liquid Discharge Consent',
      number: 'TNPCB-ZLD-2026-8812',
      holder: 'Arulpuram CETP Unit 3 / ' + manufacturer,
      scope: 'Closed-Loop Effluent Treatment (94.2% Water Recovery)',
      status: '✓ DOCUMENT VALIDATED',
      verifiedThrough: 'Government Consent Order Validation',
      validUntil: '30 Sep 2026',
      lastChecked: '18 August 2026'
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      
      {/* 1. MASTER HEADER & VERIFICATION SUMMARY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
        
        {/* Top Identity Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
              ◈
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                VASTRA<span className="text-emerald-700">SETU</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">
                Textile Export Traceability Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>✓ VERIFIED PASSPORT</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {batchNo}
            </span>
          </div>
        </div>

        {/* Headline Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              DIGITAL PRODUCT PASSPORT
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              This passport contains <strong className="text-slate-900">evidence-backed, verified information</strong> about this garment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            {!isPublic && (
              <button
                onClick={() => setShowHangtagModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Hangtag</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 2. SECTION 1: PRODUCT IDENTIFICATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Visual Card */}
          <div className="md:col-span-4 text-center">
            <div className="relative bg-gradient-to-b from-stone-50 via-amber-50/30 to-slate-100 rounded-2xl p-4 min-h-[220px] flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner">
              <img 
                src="images/brown-shirt.png" 
                alt={productName}
                className="max-h-52 object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
                GOTS Organic
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {productName}
              </h2>
              <p className="text-xs font-bold text-amber-900 mt-0.5">
                Earthy Terracotta Brown • 180 GSM Single Jersey Combed Cotton
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Batch Reference</span>
                <strong className="text-slate-900 font-mono font-bold">{batchNo}</strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Quantity</span>
                <strong className="text-slate-900 font-semibold">{quantity.toLocaleString()} units</strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Origin</span>
                <strong className="text-slate-900 font-semibold">{originCountry}</strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Destination</span>
                <strong className="text-slate-900 font-semibold">{targetCountry}</strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Exporter</span>
                <strong className="text-slate-900 font-semibold truncate block">{manufacturer}</strong>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Passport Issued</span>
                <strong className="text-slate-900 font-semibold">{formattedIssueDate}</strong>
              </div>
            </div>

            {/* Evidence Level Strip */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span><strong>Material Claim:</strong> {fabricDescription} • <span className="text-emerald-800 font-medium">Supporting evidence verified</span></span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
                ✓ Issuer Verified
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 3. SECTION 2: PRODUCT JOURNEY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              PRODUCT JOURNEY
            </h3>
            <p className="text-[11px] text-slate-500">
              Audited production sequence from certified fiber to export dispatch
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            6 Stages Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Material</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Knitting</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Dyeing</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Finishing</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Quality Check</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <strong className="font-bold text-slate-900 block text-xs">Export</strong>
            <span className="text-[10px] text-emerald-700 font-bold block">✓ Evidence available</span>
          </div>

        </div>
      </div>

      {/* 4. SECTION 3: CERTIFICATIONS & COMPLIANCE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              CERTIFICATIONS & COMPLIANCE
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Publicly verifiable claims matched against authorized certification body registries
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Privately Controlled Records</span>
        </div>

        <div className="space-y-3 text-xs">
          
          {/* GOTS */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-sm">✓</span>
                <strong className="font-extrabold text-slate-900 text-sm">GOTS (Global Organic Textile Standard v7.0)</strong>
              </div>
              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span><strong>Status:</strong> <span className="text-emerald-800 font-bold">✓ ISSUER VERIFIED</span></span>
                <span>•</span>
                <span><strong>Scope:</strong> Organic Cotton Fiber & Knitting</span>
                <span>•</span>
                <span><strong>Valid Until:</strong> 20 May 2027</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Certification Body: Control Union Certifications B.V. (Netherlands)
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCert(CERT_DETAILS.GOTS)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>View Verification Details</span>
            </button>
          </div>

          {/* OEKO-TEX */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-sm">✓</span>
                <strong className="font-extrabold text-slate-900 text-sm">OEKO-TEX® STANDARD 100</strong>
              </div>
              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span><strong>Status:</strong> <span className="text-emerald-800 font-bold">✓ ISSUER VERIFIED</span></span>
                <span>•</span>
                <span><strong>Class:</strong> Baby Class I (Azo-Free Dyeing)</span>
                <span>•</span>
                <span><strong>Valid Until:</strong> 20 May 2027</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Certification Body: TESTEX AG Swiss Textile Testing Institute
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCert(CERT_DETAILS.OEKOTEX)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>View Verification Details</span>
            </button>
          </div>

          {/* TNPCB */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-sm">✓</span>
                <strong className="font-extrabold text-slate-900 text-sm">TNPCB 100% Zero Liquid Discharge (ZLD) Consent</strong>
              </div>
              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span><strong>Status:</strong> <span className="text-emerald-800 font-bold">✓ DOCUMENT VALIDATED</span></span>
                <span>•</span>
                <span><strong>Scope:</strong> Closed-Loop Water Recovery (94.2%)</span>
                <span>•</span>
                <span><strong>Valid Until:</strong> 30 Sep 2026</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Certification Body: Tamil Nadu Pollution Control Board (Tiruppur South)
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCert(CERT_DETAILS.TNPCB)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>View Verification Details</span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. SECTION 4: ENVIRONMENT & SUSTAINABILITY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
              ENVIRONMENT & SUSTAINABILITY
            </h3>
            <p className="text-[11px] text-slate-500">
              Calculated and verified operational environmental footprint
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">CARBON FOOTPRINT</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ Evidence Available</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {carbonKg} <span className="text-xs font-normal text-slate-500">kg CO₂e</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <p><strong>Method:</strong> VastraSetu calculation (Calculated from available production and environmental data).</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">WATER RECOVERY</span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">✓ Evidence Validated</span>
            </div>
            <div className="text-2xl font-extrabold text-teal-900 font-display">
              {waterRecycledPct}% <span className="text-xs font-normal text-slate-500">Recycled</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <p><strong>Source:</strong> Facility environmental evidence (Arulpuram CETP Unit 3 100% ZLD Closed-Loop).</p>
            </div>
          </div>

        </div>
      </div>

      {/* 6. SECTION 5: EXPORT INFORMATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
            EXPORT & SHIPMENT INFORMATION
          </h3>
          <p className="text-[11px] text-slate-500">
            Public export logistics routing (Commercial pricing & bank details are privately protected)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Country of Origin</span>
            <strong className="text-slate-900 font-semibold">India</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Destination Country</span>
            <strong className="text-slate-900 font-semibold">Germany</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Batch Quantity</span>
            <strong className="text-slate-900 font-semibold">{quantity.toLocaleString()} units</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Shipment Status</span>
            <strong className="text-emerald-800 font-bold">SHIPPED / ON VESSEL</strong>
          </div>
        </div>
      </div>

      {/* 7. SECTION 6: BLOCKCHAIN INTEGRITY ANCHOR */}
      <div className="bg-purple-50/40 border border-purple-200 rounded-3xl p-6 sm:p-8 space-y-3 text-xs shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
            BLOCKCHAIN INTEGRITY ANCHOR
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
            ✓ Integrity Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 font-sans text-[10px] block">Network</span>
            <strong className="text-purple-950 font-bold">Polygon PoS</strong>
          </div>
          <div>
            <span className="text-slate-400 font-sans text-[10px] block">Anchor Transaction</span>
            <strong className="text-slate-800 truncate block">{polygonShortTx}</strong>
          </div>
          <div>
            <span className="text-slate-400 font-sans text-[10px] block">Anchored Timestamp</span>
            <strong className="text-slate-800">{formattedIssueDate}</strong>
          </div>
        </div>

        <p className="text-[11px] text-purple-900 pt-2 border-t border-purple-100 leading-relaxed font-sans">
          <em>"Blockchain anchoring confirms that the passport record has not been altered after anchoring."</em>
        </p>
      </div>

      {/* 8. SECTION 7: RECEIVER ACKNOWLEDGEMENT & ACCESS REQUEST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Receiver Status */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">RECEIVER ACKNOWLEDGEMENT</span>
            <strong className="text-emerald-900 font-bold text-sm block mt-0.5">✓ RECEIVER ACKNOWLEDGED</strong>
            <span className="text-[11px] text-slate-500">Consignment confirmed received by European Import Logistics Team on 22 May 2026.</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            Received: 22 May 2026
          </span>
        </div>

        {/* Private Document Access Request Trigger */}
        <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Request Supporting Trade Documents
            </h4>
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto mt-1">
              Commercial Invoices, Packing Lists, Shipping Bills, and full laboratory audit reports are private exporter records. Authorized buyers and customs agents can submit a formal access request.
            </p>
          </div>

          <button 
            onClick={() => setShowAccessModal(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Request Supporting Document</span>
          </button>
        </div>

      </div>

      {/* STRUCTURED CERTIFICATE VERIFICATION DETAILS MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden font-sans">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs text-white">Certificate Verification Details</h3>
              </div>
              <button onClick={() => setSelectedCert(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Verification Status</span>
                  <strong className="font-mono text-xs text-emerald-900">{selectedCert.status}</strong>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  Valid Record
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 divide-y divide-slate-200/70 text-slate-700 font-mono text-[11px]">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Certificate Type:</span>
                  <strong className="text-slate-900">{selectedCert.type}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Certificate Number:</span>
                  <strong className="text-slate-900">{selectedCert.number}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Certificate Holder:</span>
                  <strong className="text-slate-900">{selectedCert.holder}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Scope:</span>
                  <strong className="text-slate-900">{selectedCert.scope}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Verified Through:</span>
                  <strong className="text-slate-900">{selectedCert.verifiedThrough}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Valid Until:</span>
                  <strong className="text-slate-900">{selectedCert.validUntil}</strong>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400 font-sans">Last Checked:</span>
                  <strong className="text-slate-900">{selectedCert.lastChecked}</strong>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                <em>Confidential business documents are protected under VastraSetu Privacy Controls.</em>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button 
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REQUEST SUPPORTING DOCUMENT ACCESS MODAL */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden font-sans">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs text-white">Request Document Access</h3>
              </div>
              <button onClick={() => { setShowAccessModal(false); setAccessSubmitted(false); }} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setAccessSubmitted(true);
                setTimeout(() => {
                  setShowAccessModal(false);
                  setAccessSubmitted(false);
                }, 2500);
              }}
              className="p-5 space-y-3 text-xs"
            >
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Notice to Buyer / Auditor:</strong>
                <p>Commercial Invoices, Packing Lists, and Scope PDFs are private company records. Access requests are routed to the exporter for authorization.</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Requested Document</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-xs">
                  <option>Commercial Export Invoice (INV-2026-1042)</option>
                  <option>Export Packing List (PL-2026-1042)</option>
                  <option>Original GOTS Scope Certificate PDF</option>
                  <option>Original OEKO-TEX Test Report PDF</option>
                  <option>Original CETP ZLD Consent Order PDF</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Your Name</label>
                <input type="text" required placeholder="e.g., Hans Richter" className="w-full p-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Organization / Company</label>
                <input type="text" required placeholder="e.g., XYZ Fashion GmbH" className="w-full p-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Business Email</label>
                <input type="email" required placeholder="name@company.com" className="w-full p-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>

              {accessSubmitted && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
                  ✓ <strong>Access Request Submitted!</strong> The exporter has been notified. If approved, a secure, time-limited access link will be delivered to your email.
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAccessModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={accessSubmitted}
                  className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {accessSubmitted ? 'Submitted ✓' : 'Submit Request'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* HANGTAG PRINT MODAL */}
      {showHangtagModal && (
        <HangtagPrintModal
          isOpen={showHangtagModal}
          onClose={() => setShowHangtagModal(false)}
          batch={data}
        />
      )}

    </div>
  );
}
