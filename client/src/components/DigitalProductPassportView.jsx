import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateModal } from './CertificateModal';
import { HangtagPrintModal } from './HangtagPrintModal';
import { 
  ShieldCheck, 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle, 
  CheckCircle2, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Layers, 
  Factory, 
  Ship, 
  Flag, 
  FileText, 
  FileCheck2, 
  Award, 
  Sparkles, 
  Info, 
  ArrowRight,
  Eye,
  Lock,
  Globe2,
  Calendar,
  Tag,
  Hash,
  Share2
} from 'lucide-react';

export function DigitalProductPassportView({ batch, isPublic = false, navigate }) {
  const [activeCert, setActiveCert] = useState(null);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);

  if (!batch || !batch.passport) return null;

  const passport = batch.passport;
  const dppId = passport.id || `DPP-2026-00098765`;
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${dppId}`
    : `https://vastrasetu.vercel.app/verify/${dppId}`;

  const footprint = passport.footprint || {
    carbon: { perPieceKg: 2.84, conventionalBenchmarkKg: 6.8, savingsPercent: 38 },
    water: { perPieceLiters: 46.6, recycledPercentage: 94, savingsPercent: 88 }
  };

  const metrics = passport.sustainabilityMetrics || {
    carbon_footprint_kg: 2.84,
    is_carbon_estimated: true,
    water_usage_l: 46.6,
    is_water_estimated: true,
    water_recycled_pct: 94,
    energy_usage_kwh: 1.8,
    is_energy_estimated: true,
    sustainable_material_pct: 95,
    is_material_estimated: false,
  };

  const stages = passport.productionStages || [
    { stage_name: 'Raw Material', sequence_order: 1, entity_name: 'Vidarbha Organic Cotton Ginning Cluster', location: 'Maharashtra / Tamil Nadu, India', completed_at: '10 Aug 2026', status: 'Completed', icon: Leaf },
    { stage_name: 'Spinning & Knitting', sequence_order: 2, entity_name: batch.yarnSpinningMill || 'Coimbatore Heritage Cotton Mills', location: 'Coimbatore, Tamil Nadu, India', completed_at: '14 Aug 2026', status: 'Completed', icon: Layers },
    { stage_name: 'Wet Processing', sequence_order: 3, entity_name: batch.dyerName || 'Rainbow Eco-Dyers Tiruppur', location: 'Veerapandi Industrial Estate, Tiruppur', completed_at: '16 Aug 2026', status: 'Completed', icon: Droplets },
    { stage_name: 'CETP (ZLD)', sequence_order: 4, entity_name: batch.cetpName || 'Arulpuram CETP Unit 3', location: 'Arulpuram, Tiruppur, India', completed_at: '18 Aug 2026', status: 'Completed', icon: Factory },
    { stage_name: 'Manufacturing', sequence_order: 5, entity_name: 'Sri Jayavarma Knits Unit 2', location: 'Tiruppur, Tamil Nadu, India', completed_at: '19 Aug 2026', status: 'Completed', icon: Building2 },
    { stage_name: 'Freight & Port', sequence_order: 6, entity_name: `Tuticorin Port → Port of ${(batch.destinationPort || 'hamburg').toUpperCase()}`, location: 'Maritime Sea Freight', completed_at: '20 Aug 2026', status: 'In Transit', icon: Ship },
    { stage_name: 'Retail Destination', sequence_order: 7, entity_name: `${batch.buyerName || 'European Buyer'} Distribution Hub`, location: `${batch.targetCountry || 'Germany'}`, completed_at: null, status: 'Scheduled', icon: Flag },
  ];

  const certificates = passport.complianceCertificates || [
    { type: 'gots', name: 'Global Organic Textile Standard (GOTS v7.0)', issuer: 'Control Union Certifications B.V.', certNumber: batch.fiberCertificate?.certificateNo || 'CU-841920-GOTS-2026', validUntil: '31 Dec 2026', status: 'Verified ✓', fileUrl: '/sample-certs/gots-certificate.pdf' },
    { type: 'oeko', name: 'OEKO-TEX® Standard 100 Class I (Baby-Safe)', issuer: 'Hohenstein Textile Testing Institute', certNumber: batch.dyeingRecord?.certificateNo || 'OEKO-2026-TX-98442', validUntil: '31 Dec 2026', status: 'Verified ✓', fileUrl: '/sample-certs/oeko-tex-certificate.pdf' },
    { type: 'zdhc', name: 'ZDHC MRSL Level 3 Chemical Conformity', issuer: 'ZDHC Roadmap to Zero Foundation', certNumber: 'ZDHC-IN-2026-MRSL-441', validUntil: '28 Oct 2026', status: 'Verified ✓', fileUrl: '/sample-certs/oeko-tex-certificate.pdf' },
    { type: 'zld', name: 'TNPCB Zero Liquid Discharge (ZLD) Clearance', issuer: 'Tamil Nadu Pollution Control Board', certNumber: batch.cetpRecord?.certificateNo || 'TNPCB-CETP-ZLD-BATCH-8842', validUntil: 'Continuous IoT Active', status: 'Verified ✓', fileUrl: '/sample-certs/tnpcb-zld-certificate.pdf' },
    { type: 'iso', name: 'ISO 9001:2015 Quality Management System', issuer: 'TUV SUD South Asia', certNumber: '99-100-2024-QM', validUntil: '15 Sep 2027', status: 'Verified ✓', fileUrl: '/sample-certs/gots-certificate.pdf' },
  ];

  const documents = passport.documents || [
    { id: 'doc-1', name: 'Commercial Export Invoice', filename: `INV-EXP-2026-${batch.id}.pdf`, size: '245 KB', type: 'PDF', fileUrl: '/sample-certs/invoice-8842.pdf' },
    { id: 'doc-2', name: 'Customs Packing & Weight List', filename: `PL-EXP-2026-${batch.id}.pdf`, size: '180 KB', type: 'PDF', fileUrl: '/sample-certs/packing-list.pdf' },
    { id: 'doc-3', name: 'GOTS Scope Certificate (CU-841920)', filename: 'GOTS-CU-841920-ScopeCert.pdf', size: '420 KB', type: 'PDF', fileUrl: '/sample-certs/gots-certificate.pdf' },
    { id: 'doc-4', name: 'OEKO-TEX Standard 100 Lab Test Report', filename: 'OEKO-TX-98442-Report.pdf', size: '510 KB', type: 'PDF', fileUrl: '/sample-certs/oeko-tex-certificate.pdf' },
    { id: 'doc-5', name: 'TNPCB ZLD Consent to Operate Clearance', filename: 'TNPCB-ZLD-8842-Order.pdf', size: '360 KB', type: 'PDF', fileUrl: '/sample-certs/tnpcb-zld-certificate.pdf' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById(`dpp-qr-${dppId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `VastraSetu-DPP-${dppId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAFAFC] min-h-screen">
      
      {/* Top Action Bar (For MSME & Exporter views) */}
      {!isPublic && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  EU ESPR 2026 Verified
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Batch: <strong className="text-zinc-800">{batch.id}</strong>
                </span>
              </div>
              <h2 className="text-sm font-bold text-zinc-900">
                Official Digital Product Passport (DPP) Document
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate ? navigate(`/verify/${dppId}`) : window.open(`/verify/${dppId}`, '_blank')}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Verification View</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download QR</span>
            </button>

            <button
              onClick={() => setShowHangtagModal(true)}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Print Hangtag</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Document Master Container */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        
        {/* 1. Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#1F5C3F] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>EU ESPR 2026 Compliant Document</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
              Digital Product Passport
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium tracking-wide">
              Transparency · Sustainability · Trust
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2 bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                POWERED BY
              </span>
              <span className="font-display font-extrabold text-sm text-white tracking-tight">
                🌿 VastraSetu
              </span>
            </div>
            <div className="space-y-0.5 text-left md:text-right">
              <span className="text-[10px] text-emerald-200/80 block uppercase font-mono">
                UNIQUE DPP IDENTIFIER
              </span>
              <strong className="font-mono text-sm sm:text-base font-bold text-emerald-100 tracking-wider block">
                {dppId}
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Main Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* LEFT COLUMN: Product Identity Card & Scannable QR Code */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Product Identity Card */}
            <div className="bg-[#FAFAFC] rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-5">
              
              {/* Product Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
                <img 
                  src={batch.productImage || 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'} 
                  alt={batch.garmentTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-emerald-600/40">
                  {batch.fabricType === 'organic_cotton' || batch.fabricType === 'organic_cotton_blend' ? 'GOTS Organic Cotton' : 'Eco-Certified'}
                </div>
              </div>

              {/* Title & Material Line */}
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-zinc-900 leading-tight">
                  {batch.garmentTitle}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold">
                  {batch.fabricDescription || '95% Organic Cotton / 5% Elastane Pique Knit'}
                </p>
              </div>

              {/* Structured Key-Value Attribute List */}
              <div className="space-y-2 text-xs border-t border-zinc-200 pt-4">
                {[
                  { label: 'Brand', value: batch.brand || 'EcoWear / Zara Europe' },
                  { label: 'Manufacturer', value: batch.manufacturer || 'Sri Jayavarma Knits & Exports' },
                  { label: 'Product Category', value: batch.productCategory || "Men's Knitted Apparel" },
                  { label: 'HS Code', value: batch.hsCode || '6105.10.00', isMono: true },
                  { label: 'Country of Origin', value: batch.countryOfOrigin || 'India (Tiruppur Cluster)' },
                  { label: 'Date of Manufacture', value: batch.dateOfManufacture || '14 Aug 2026' },
                  { label: 'Batch / Lot No.', value: batch.id, isMono: true },
                  { label: 'GTIN (Bar Code)', value: batch.gtin || '08901234567890', isMono: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-zinc-100 last:border-none">
                    <span className="text-zinc-500 font-medium">{item.label}</span>
                    <span className={`text-zinc-900 font-bold text-right ml-2 ${item.isMono ? 'font-mono text-[11px]' : ''}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Scannable Unique QR Code Box */}
            <div className="bg-emerald-900 text-white rounded-2xl p-6 text-center space-y-4 shadow-md">
              <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mx-auto">
                <QRCodeSVG
                  id={`dpp-qr-${dppId}`}
                  value={verificationUrl}
                  size={160}
                  level="H"
                  fgColor="#1F5C3F"
                />
              </div>

              <div className="space-y-1">
                <strong className="text-xs uppercase font-extrabold tracking-wider block text-emerald-200">
                  SCAN TO VERIFY AUTHENTICITY
                </strong>
                <p className="text-[11px] text-emerald-100/80 leading-snug">
                  Scan QR with any mobile camera to view full live product journey & audit records.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border border-white/20"
                >
                  <Download className="w-3 h-3" />
                  <span>Download QR</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border border-white/20"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Trust Strip, Journey, LCA, Certs, Docs, Issuance */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3. Four-Icon Trust Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'Traceable', desc: 'Raw fiber to garment', icon: Globe2 },
                { title: 'Verifiable', desc: 'Polygon blockchain anchor', icon: ShieldCheck },
                { title: 'Transparent', desc: 'Open LCA carbon & water', icon: Eye },
                { title: 'Sustainable', desc: '94% ZLD water recycling', icon: Leaf },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-[#E8F3EC]/70 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-1.5 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white text-emerald-800 border border-emerald-200 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <strong className="text-xs font-extrabold text-emerald-950 block">
                      {item.title}
                    </strong>
                    <span className="text-[10px] text-emerald-800/80 font-medium block">
                      {item.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 4. Product Journey (Connected-Node Production Route) */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Traceability Route
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Product Journey Timeline
                  </span>
                </div>
                <span className="text-xs font-semibold text-zinc-500">
                  {stages.filter(s => s.status === 'Completed' || s.status === 'In Transit').length} of {stages.length} Stages Active
                </span>
              </div>

              {/* Horizontal Connected Timeline */}
              <div className="overflow-x-auto scrollbar-none py-2">
                <div className="flex items-start justify-between min-w-[620px] gap-2 relative">
                  
                  {/* Connecting Line */}
                  <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-emerald-100 z-0" />

                  {stages.map((st, idx) => {
                    const isSelected = selectedStageIdx === idx;
                    const isDone = st.status === 'Completed';
                    const isInTransit = st.status === 'In Transit';

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedStageIdx(idx)}
                        className="group flex flex-col items-center text-center flex-1 relative z-10 focus:outline-none"
                      >
                        {/* Circular Node */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-sm ${
                          isSelected 
                            ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 scale-110 shadow-md'
                            : isDone
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : isInTransit
                            ? 'bg-amber-500 text-white ring-2 ring-amber-100'
                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Stage Name */}
                        <strong className={`text-[11px] mt-2 whitespace-nowrap block ${
                          isSelected ? 'text-emerald-950 font-black' : 'text-zinc-800'
                        }`}>
                          {st.stage_name}
                        </strong>

                        {/* Entity Name */}
                        <span className="text-[10px] text-zinc-500 truncate max-w-[90px] block mt-0.5 font-medium">
                          {st.entity_name}
                        </span>

                        {/* Location */}
                        <span className="text-[9px] text-zinc-400 truncate max-w-[85px] block">
                          {st.location?.split(',')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Stage Focus Banner */}
              {stages[selectedStageIdx] && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Stage {selectedStageIdx + 1}: {stages[selectedStageIdx].stage_name}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        ✓ {stages[selectedStageIdx].status}
                      </span>
                    </div>
                    <strong className="text-zinc-900 block pt-1 text-sm">
                      {stages[selectedStageIdx].entity_name}
                    </strong>
                    <p className="text-zinc-500 text-[11px]">
                      Location: {stages[selectedStageIdx].location}
                    </p>
                  </div>
                  {stages[selectedStageIdx].completed_at && (
                    <div className="text-left sm:text-right text-[11px] text-zinc-400 font-mono shrink-0">
                      <span>Completed: {stages[selectedStageIdx].completed_at}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* 5. Sustainability Impact (4-Stat Grid) */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Environmental Metrics
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ISO 14067 LCA Model
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Per Unit Finished Garment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Stat 1: Carbon Footprint */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">
                      Carbon Footprint
                    </span>
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-display">
                      {metrics.carbon_footprint_kg || footprint.carbon.perPieceKg}
                    </span>
                    <span className="text-xs text-emerald-800 font-medium">kg CO₂e</span>
                    {metrics.is_carbon_estimated && (
                      <span className="text-[10px] text-emerald-700 italic ml-1">(estimated)</span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    ↓ 38% below conventional industry baseline
                  </span>
                </div>

                {/* Stat 2: Water Usage */}
                <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-cyan-800">
                      Water Usage
                    </span>
                    <Droplets className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-cyan-950 font-display">
                      {metrics.water_usage_l || footprint.water.perPieceLiters}
                    </span>
                    <span className="text-xs text-cyan-800 font-medium">L / piece</span>
                    {metrics.is_water_estimated && (
                      <span className="text-[10px] text-cyan-700 italic ml-1">(estimated)</span>
                    )}
                  </div>
                  <span className="text-[10px] text-cyan-700 font-semibold block">
                    {metrics.water_recycled_pct || 94}% closed-loop ZLD water recovery
                  </span>
                </div>

                {/* Stat 3: Energy Usage */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-800">
                      Energy Usage
                    </span>
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-display">
                      {metrics.energy_usage_kwh || 1.8}
                    </span>
                    <span className="text-xs text-amber-800 font-medium">kWh / piece</span>
                    {metrics.is_energy_estimated && (
                      <span className="text-[10px] text-amber-700 italic ml-1">(estimated)</span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold block">
                    100% Biomass boiler steam + 450 kW solar PV
                  </span>
                </div>

                {/* Stat 4: Sustainable Materials */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">
                      Sustainable Materials
                    </span>
                    <Recycle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-display">
                      {metrics.sustainable_material_pct || 95}%
                    </span>
                    <span className="text-xs text-emerald-800 font-medium">Certified Organic</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Verified via GOTS Scope Certificate CU-841920
                  </span>
                </div>

              </div>

              <div className="pt-2 text-[11px] text-zinc-400 border-t border-zinc-100 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Values calculated according to ISO 14067 & European Commission PEF apparel guidelines.</span>
              </div>
            </div>

            {/* 6. Certifications & Compliance Table */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Compliance & Audits
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {certificates.length} Verified Standards
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Click to View Audit Proof
                </span>
              </div>

              <div className="divide-y divide-zinc-100">
                {certificates.map((cert, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveCert(cert.type || 'gots')}
                    className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-zinc-50/80 px-2 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-zinc-900 group-hover:text-emerald-800 transition-colors block">
                          {cert.name}
                        </strong>
                        <p className="text-[11px] text-zinc-500">
                          {cert.issuer} • <span className="font-mono text-[10px]">{cert.certNumber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block">
                          {cert.status}
                        </span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          Exp: {cert.validUntil}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Product Documents */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Attached Product Documents
                </span>
                <span className="text-[11px] text-zinc-400">
                  {documents.length} PDF Records
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                        <FileText className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-zinc-900 block truncate text-[11px] group-hover:text-emerald-800">
                          {doc.name}
                        </strong>
                        <span className="text-[10px] text-zinc-400 block">
                          {doc.filename} ({doc.size})
                        </span>
                      </div>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-emerald-800 hover:bg-emerald-50 shrink-0 ml-2"
                      title="Download Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Footer / Issuance & Blockchain Ledger Block */}
            <div className="bg-[#FAFAFC] rounded-2xl p-6 border border-zinc-200 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Passport Issued By
                  </span>
                  <strong className="text-zinc-900 block">
                    VastraSetu Environmental Trust Authority
                  </strong>
                  <p className="text-zinc-500 text-[11px]">
                    Tiruppur Textile Export Cluster, Tamil Nadu, India
                  </p>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Validity Period
                  </span>
                  <div className="text-zinc-700 text-[11px]">
                    Issued: <strong>{passport.issuedAt ? new Date(passport.issuedAt).toLocaleDateString() : '19 Aug 2026'}</strong>
                  </div>
                  <div className="text-zinc-700 text-[11px]">
                    Valid Until: <strong>{passport.validUntil || '31 December 2028'}</strong>
                  </div>
                </div>
              </div>

              {/* Blockchain Environmental Ledger Anchor */}
              <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300">
                      Blockchain Environmental Ledger
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                    {passport.blockchainNetwork || 'Polygon PoS'}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[10px] text-emerald-200/90 pt-1">
                  <div className="flex justify-between items-center break-all">
                    <span className="text-emerald-400/80">Merkle Root:</span>
                    <span>{passport.merkleRoot || '0x17c9384918e90a816c21e091b637d730'}</span>
                  </div>
                  <div className="flex justify-between items-center break-all">
                    <span className="text-emerald-400/80">Tx Hash:</span>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${passport.blockchainTxHash || '0x7f8a9c3d4e0821b209e51c89f53e6b12d98c24a91901df4819e68b31a0e7'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-300 underline hover:text-white"
                    >
                      {passport.blockchainTxHash ? `${passport.blockchainTxHash.substring(0, 16)}...${passport.blockchainTxHash.substring(58)}` : '0x7f8a9c3d...31a0e7'}
                    </a>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-emerald-300/70 border-t border-emerald-900 flex items-center justify-between">
                  <span>Standard: GS1 Digital Link & EU ESPR 2026</span>
                  <span className="text-emerald-400 font-bold">✓ Cryptographically Signed</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          type={activeCert}
        />
      )}

      {/* Hangtag Print Modal */}
      {showHangtagModal && (
        <HangtagPrintModal
          isOpen={showHangtagModal}
          onClose={() => setShowHangtagModal(false)}
          batch={batch}
        />
      )}

    </div>
  );
}
