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
  Globe2, 
  Share2,
  Lock,
  Hexagon,
  ArrowRight
} from 'lucide-react';

export function DigitalProductPassportView({ batch, passportData, isPublic = false, navigate }) {
  const [activeCert, setActiveCert] = useState(null);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract live dynamic data from passportData or batch
  const liveData = passportData || batch || {};
  const passport = liveData.passport || liveData;

  const dppId = liveData.batchId || liveData.id || passport?.id || `DPP-2026-00098765`;
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${dppId}`
    : `http://localhost:5173/verify/${dppId}`;

  // Dynamic values with elegant defaults
  const title = liveData.productName || liveData.garmentTitle || 'EcoWear Polo T-Shirt';
  const composition = liveData.fabricDescription || '100% Organic Cotton';
  const brand = liveData.brandName || liveData.buyerName || 'EcoWear';
  const manufacturer = liveData.msmeBusinessName || liveData.manufacturer || 'Sri Jayavarma Knits Pvt. Ltd.';
  const hsCode = liveData.hsCode || '6109.10';
  const origin = liveData.originCountry || 'India (Tiruppur Cluster)';
  const dateOfMfg = liveData.dateOfManufacture || '15 May 2025';
  const lotNo = liveData.batchId || liveData.id || 'EW-2505-001';
  const gtin = liveData.gtin || '08976543211234';

  const carbonKg = liveData.carbonKg || liveData.carbon_kg || 12.4;
  const waterL = liveData.waterLitres || liveData.water_litres || 56.2;
  const energyKwh = liveData.energyKwh || 2.8;
  const sustainableMatPct = liveData.sustainableMatPct || 85;

  const polygonTx = liveData.polygonTxHash || passport?.polygonTxHash || '0x7f3a9c218842109284102984';
  const polygonShortTx = polygonTx ? `${polygonTx.substring(0, 8)}...${polygonTx.substring(polygonTx.length - 4)}` : '0x7f3a...9c21';

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* Optional Admin Action Bar */}
      {!isPublic && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              🌿
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                GS1 Digital Link Verified
              </span>
              <h2 className="text-xs font-bold text-zinc-900">
                Official Digital Product Passport (DPP)
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate ? navigate(`/verify/${dppId}`) : window.open(`/verify/${dppId}`, '_blank')}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public View</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
            <button
              onClick={() => setShowHangtagModal(true)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hangtag</span>
            </button>
          </div>
        </div>
      )}

      {/* MASTER PASSPORT CONTAINER */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6 sm:p-10 space-y-8 print:border-none print:shadow-none">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 pb-6">
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              Digital Product Passport
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">
              Transparency • Sustainability • Trust
            </p>
          </div>

          <div className="flex flex-col sm:items-end space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>Powered by</span>
              <span className="font-display font-extrabold text-emerald-800 flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-emerald-700 text-white flex items-center justify-center text-[10px]">◈</span>
                VastraSetu
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
              DPP ID: <span className="text-emerald-700">{dppId}</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT COLUMN (~35%) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Product Image Card */}
            <div className="bg-[#F6F5F2] rounded-2xl p-4 border border-zinc-200 flex items-center justify-center aspect-[4/3] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800" 
                alt="Green Organic Polo Shirt"
                className="h-full object-contain mix-blend-multiply drop-shadow-sm hover:scale-105 transition-transform"
              />
            </div>

            {/* Product Specs List */}
            <div className="space-y-3 text-xs">
              <div>
                <h2 className="font-display font-extrabold text-xl text-zinc-900">{title}</h2>
                <p className="text-xs text-zinc-500 font-medium">{composition}</p>
              </div>

              <div className="space-y-2 border-t border-zinc-100 pt-3">
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Brand</span>
                  <strong className="text-zinc-900">{brand}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Manufacturer</span>
                  <strong className="text-zinc-900 truncate max-w-[170px]">{manufacturer}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Product Category</span>
                  <strong className="text-zinc-900">Apparel & Textiles</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">HS Code</span>
                  <strong className="font-mono text-zinc-900">{hsCode}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Country of Origin</span>
                  <strong className="text-zinc-900">{origin}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Date of Manufacture</span>
                  <strong className="text-zinc-900">{dateOfMfg}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Batch / Lot No.</span>
                  <strong className="font-mono text-zinc-900">{lotNo}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Global Trade Item Number</span>
                  <strong className="font-mono text-zinc-900 text-[11px]">{gtin}</strong>
                </div>
              </div>
            </div>

            {/* Mint Green QR Code Box */}
            <div className="bg-[#EFF8F3] border border-emerald-100 rounded-2xl p-5 text-center space-y-3">
              <p className="text-[11px] font-bold text-emerald-900 leading-snug max-w-[200px] mx-auto">
                Scan QR to verify authenticity & view full product journey
              </p>
              
              <div className="bg-white p-3 rounded-xl inline-block shadow-xs mx-auto border border-emerald-100">
                <QRCodeSVG
                  id={`dpp-qr-${dppId}`}
                  value={verificationUrl}
                  size={140}
                  level="H"
                  fgColor="#064E3B"
                />
              </div>

              <div className="pt-1 flex items-center justify-center gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (~65%) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Four Pillar Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { title: 'Traceable', icon: Globe2 },
                { title: 'Verifiable', icon: ShieldCheck },
                { title: 'Transparent', icon: FileText },
                { title: 'Sustainable', icon: Leaf },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <strong className="text-xs font-bold text-zinc-900">{item.title}</strong>
                  </div>
                );
              })}
            </div>

            {/* 2. Product Journey Timeline */}
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-zinc-900">Product Journey</h3>

              <div className="relative flex items-start justify-between text-center overflow-x-auto pb-2">
                {/* Connecting Bar */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-emerald-200 z-0" />

                {[
                  { title: 'Raw Material', entity: 'Organic Cotton', loc: 'India' },
                  { title: 'Spinning', entity: 'ABC Yarns', loc: 'Coimbatore, India' },
                  { title: 'Weaving', entity: 'ABC Weaves', loc: 'Tiruppur, India' },
                  { title: 'Dyeing', entity: 'Eco Dyers', loc: 'Tiruppur, India' },
                  { title: 'Manufacturing', entity: 'ABC Textiles Pvt. Ltd.', loc: 'Tiruppur, India' },
                ].map((st, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center flex-1 min-w-[100px]">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <strong className="text-[11px] font-bold text-zinc-900 mt-2 block">{st.title}</strong>
                    <span className="text-[10px] text-zinc-600 block">{st.entity}</span>
                    <span className="text-[9px] text-zinc-400 block">{st.loc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Sustainability Impact (4 Stat Cards) */}
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-zinc-900">Sustainability Impact</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                
                <div className="bg-[#FAFBF9] border border-zinc-200 rounded-2xl p-4 space-y-1">
                  <Leaf className="w-5 h-5 text-emerald-600 mx-auto" />
                  <div className="font-display font-black text-xl text-zinc-900 pt-1">{carbonKg} kg CO₂e</div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Carbon Footprint</span>
                  <span className="text-[9px] text-zinc-400 block">(per unit)</span>
                </div>

                <div className="bg-[#FAFBF9] border border-zinc-200 rounded-2xl p-4 space-y-1">
                  <Droplets className="w-5 h-5 text-cyan-600 mx-auto" />
                  <div className="font-display font-black text-xl text-zinc-900 pt-1">{waterL} L</div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Water Usage</span>
                  <span className="text-[9px] text-zinc-400 block">(per unit)</span>
                </div>

                <div className="bg-[#FAFBF9] border border-zinc-200 rounded-2xl p-4 space-y-1">
                  <Zap className="w-5 h-5 text-amber-500 mx-auto" />
                  <div className="font-display font-black text-xl text-zinc-900 pt-1">{energyKwh} kWh</div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Energy Usage</span>
                  <span className="text-[9px] text-zinc-400 block">(per unit)</span>
                </div>

                <div className="bg-[#FAFBF9] border border-zinc-200 rounded-2xl p-4 space-y-1">
                  <Recycle className="w-5 h-5 text-emerald-600 mx-auto" />
                  <div className="font-display font-black text-xl text-zinc-900 pt-1">{sustainableMatPct} %</div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Sustainable</span>
                  <span className="text-[9px] text-zinc-400 block">Materials</span>
                </div>

              </div>
            </div>

            {/* 4. Certifications & Compliance Table */}
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-extrabold text-sm text-zinc-900">Certifications & Compliance</h3>

              <div className="divide-y divide-zinc-100 text-xs">
                {[
                  { name: 'Global Organic Textile Standard (GOTS)', issuer: 'Control Union', date: '12 May 2025' },
                  { name: 'OEKO-TEX® Standard 100', issuer: 'Hohenstein', date: '10 May 2025' },
                  { name: 'ISO 14001:2015 (Environmental Management)', issuer: 'TUV India', date: '08 May 2025' },
                  { name: 'SA 8000 (Social Accountability)', issuer: 'TUV India', date: '08 May 2025' },
                  { name: 'CETP Compliance Certificate', issuer: 'TNPCB', date: '05 May 2025' },
                ].map((c, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-zinc-800">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-[11px]">
                      <span className="text-zinc-500">{c.issuer}</span>
                      <span className="text-zinc-400 font-mono">{c.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Product Documents */}
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-extrabold text-sm text-zinc-900">Product Documents</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { title: 'Commercial Invoice', filename: `INV-${lotNo}.pdf` },
                  { title: 'Packing List', filename: `PKL-${lotNo}.pdf` },
                  { title: 'CETP Certificate', filename: `CETP-2025-12345.pdf` },
                  { title: 'Test Report (AZO Free)', filename: `TR-AZF-2025-54321.pdf` },
                ].map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-zinc-200 bg-[#FAFBF9] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
                      <div className="min-w-0">
                        <strong className="text-zinc-800 block text-[11px] truncate">{doc.title}</strong>
                        <span className="text-[10px] text-zinc-400 block font-mono truncate">{doc.filename}</span>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-700 cursor-pointer shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Bottom Issuance & Blockchain Box */}
            <div className="border border-zinc-200 bg-[#FAFAFC] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Passport Issued By</span>
                <strong className="text-zinc-900 font-bold block flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px]">✓</span>
                  VastraSetu
                </strong>
                <span className="text-[10px] text-zinc-500 block">Tiruppur, India</span>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Issue Date</span>
                  <span className="font-semibold text-zinc-800">{dateOfMfg}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Valid Until</span>
                  <span className="font-semibold text-zinc-800">20 May 2027</span>
                </div>
              </div>

              {/* Polygon Network Hexagon Emblem */}
              <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                  <Hexagon className="w-4 h-4 fill-purple-100 text-purple-700" />
                </div>
                <div className="space-y-0.5">
                  <strong className="text-[11px] text-zinc-900 block font-bold">Blockchain Verified</strong>
                  <span className="text-[10px] text-zinc-500 block">Polygon Network</span>
                  <span className="text-[9px] font-mono text-purple-700 font-bold block">Tx ID: {polygonShortTx}</span>
                </div>
              </div>

            </div>

            {/* 7. Bottom GS1 Compliance Footer */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-100">
              <span>This Digital Product Passport is generated in compliance with GS1 Digital Link Standard</span>
              <span className="font-bold text-zinc-600 flex items-center gap-1">
                <span className="text-emerald-700 text-xs">(((</span> GS1 Digital Link
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Modals */}
      {activeCert && (
        <CertificateModal
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          type={activeCert}
        />
      )}

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
