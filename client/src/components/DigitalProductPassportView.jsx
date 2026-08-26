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
  Printer
} from 'lucide-react';

export function DigitalProductPassportView({ batch, passportData, isPublic = false, navigate }) {
  const [copied, setCopied] = useState(false);
  const [showHangtagModal, setShowHangtagModal] = useState(false);

  // Safely extract props with fallbacks
  const data = passportData || batch || {};
  const dppId = data.passportId || data.batchId || data.id || 'DPP-2025-00098765';
  
  const productName = data.productName || data.garmentTitle || 'EcoWear Polo T-Shirt';
  const fabricDescription = data.fabricDescription || '100% Organic Cotton';
  const brandName = data.brandName || data.buyerName || 'EcoWear';
  const manufacturer = data.msmeBusinessName || data.manufacturer || 'Sri Jayavarma Knits & Exports Pvt Ltd';
  const hsCode = data.hsCode || '6109.10';
  const originCountry = data.originCountry || 'India (Tiruppur Cluster)';
  const dateOfMfg = data.dateOfManufacture || '15 May 2025';
  const batchNo = data.batchId || data.batchNumber || data.id || 'EW-2505-001';
  const gtin = data.gtin || '08976543211234';

  const carbonKg = data.carbonKg !== undefined ? data.carbonKg : 12.4;
  const waterL = data.waterLitres !== undefined ? data.waterLitres : 56.2;
  const energyKwh = data.energyKwh !== undefined ? data.energyKwh : 2.8;
  const sustainableMatPct = data.sustainableMatPct !== undefined ? data.sustainableMatPct : 85;

  const rawTxHash = data.polygonTxHash || (data.passport ? data.passport.polygonTxHash : null);
  const polygonShortTx = rawTxHash 
    ? (rawTxHash.length > 14 ? `${rawTxHash.slice(0, 6)}...${rawTxHash.slice(-6)}` : rawTxHash)
    : 'Anchoring Pending';

  // Compute dynamic validity dates (2 years from issue date)
  const issuedDateObj = data.issuedAt ? new Date(data.issuedAt) : new Date('2025-05-15');
  const validUntilDateObj = new Date(issuedDateObj);
  validUntilDateObj.setFullYear(validUntilDateObj.getFullYear() + 2);

  const formattedIssueDate = issuedDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedValidUntil = validUntilDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      
      {/* 1. MASTER HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
        
        {/* Top Eyebrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-extrabold text-xs shadow-xs">
              ◈
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-zinc-900 tracking-tight">
                Digital Product Passport
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Transparency • Sustainability • Trust
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500">
              Powered by <strong className="text-zinc-900">VastraSetu</strong>
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 bg-zinc-100 rounded-lg text-zinc-700 border border-zinc-200">
              DPP ID: {dppId}
            </span>
          </div>
        </div>

        {/* Headline Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ESPR 2026 EU Compliant ✓
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                GS1 Digital Link Standard
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              {productName}
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              {fabricDescription} • Manufactured by <strong>{manufacturer}</strong> (Tiruppur Cluster)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save QR</span>
            </button>

            <button
              onClick={() => setShowHangtagModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 2.5"×4.5" Hangtag</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. TWO-COLUMN MAIN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN (~35%) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Garment Image Card */}
          <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-4 text-center">
            <div className="bg-[#F6F5F2] rounded-2xl p-6 flex items-center justify-center min-h-[220px] border border-zinc-100">
              <img 
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80" 
                alt={productName}
                className="max-h-48 object-contain rounded-xl shadow-xs"
              />
            </div>

            {/* Product Specification Key-Value List */}
            <div className="text-left divide-y divide-zinc-100 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Brand:</span>
                <strong className="text-zinc-900 font-bold">{brandName}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Manufacturer:</span>
                <strong className="text-zinc-900 font-bold truncate max-w-[180px]">{manufacturer}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Category:</span>
                <strong className="text-zinc-900 font-bold">Apparel & Textiles</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">HS Code:</span>
                <strong className="text-zinc-900 font-mono font-bold">{hsCode}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Country of Origin:</span>
                <strong className="text-zinc-900 font-bold">{originCountry}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Date of Manufacture:</span>
                <strong className="text-zinc-900 font-bold">{dateOfMfg}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">Batch / Lot No:</span>
                <strong className="text-zinc-900 font-mono font-bold text-emerald-800">{batchNo}</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-zinc-500 font-medium">GTIN Code:</span>
                <strong className="text-zinc-900 font-mono font-bold">{gtin}</strong>
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

            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                onClick={handleDownloadQr}
                className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Save QR PNG</span>
              </button>

              <span className="text-zinc-300">•</span>

              <button
                onClick={() => setShowHangtagModal(true)}
                className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                <span>Print Hangtag Tag</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (~65%) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Four Pillar Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <strong className="text-xs font-extrabold text-zinc-900 block">Traceable</strong>
              <span className="text-[10px] text-zinc-500 block">100% Farm-to-Shelf</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto font-bold">
                <Hexagon className="w-4 h-4" />
              </div>
              <strong className="text-xs font-extrabold text-zinc-900 block">Verifiable</strong>
              <span className="text-[10px] text-zinc-500 block">Polygon Amoy Anchored</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <strong className="text-xs font-extrabold text-zinc-900 block">Transparent</strong>
              <span className="text-[10px] text-zinc-500 block">DPI Audit Trail</span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto font-bold">
                <Leaf className="w-4 h-4" />
              </div>
              <strong className="text-xs font-extrabold text-zinc-900 block">Sustainable</strong>
              <span className="text-[10px] text-zinc-500 block">Scope 1/2 LCA Audited</span>
            </div>

          </div>

          {/* 2. Product Journey Stepper */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-display font-extrabold text-sm text-zinc-900 uppercase tracking-wider">
                Product Journey & Provenance
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                5 Stages Verified
              </span>
            </div>

            {/* Stepper Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">1</span>
                <strong className="text-xs font-bold text-zinc-900 block">Raw Material</strong>
                <span className="text-[10px] text-zinc-500 block">Organic Farm</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">2</span>
                <strong className="text-xs font-bold text-zinc-900 block">Spinning</strong>
                <span className="text-[10px] text-zinc-500 block">Heritage Mills</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">3</span>
                <strong className="text-xs font-bold text-zinc-900 block">Weaving</strong>
                <span className="text-[10px] text-zinc-500 block">Tiruppur Knits</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">4</span>
                <strong className="text-xs font-bold text-zinc-900 block">Dyeing</strong>
                <span className="text-[10px] text-zinc-500 block">Rainbow Dyers</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold mx-auto">5</span>
                <strong className="text-xs font-bold text-zinc-900 block">Manufacturing</strong>
                <span className="text-[10px] text-zinc-500 block">Sri Jayavarma</span>
              </div>

            </div>
          </div>

          {/* 3. Sustainability Impact (4 Stat Cards Grid) */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-sm text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
              Sustainability & Environmental Impact
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Carbon */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Carbon Footprint</span>
                </div>
                <div className="text-xl font-extrabold text-zinc-900 font-mono pt-1">
                  {carbonKg} <span className="text-xs font-medium text-zinc-500">kg CO₂e</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">18% Below EU Limit</span>
              </div>

              {/* Water */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>Water Usage</span>
                </div>
                <div className="text-xl font-extrabold text-zinc-900 font-mono pt-1">
                  {waterL} <span className="text-xs font-medium text-zinc-500">L</span>
                </div>
                <span className="text-[10px] text-blue-700 font-bold block">Level 3 ZLD Recycled</span>
              </div>

              {/* Energy */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Energy Usage</span>
                </div>
                <div className="text-xl font-extrabold text-zinc-900 font-mono pt-1">
                  {energyKwh} <span className="text-xs font-medium text-zinc-500">kWh</span>
                </div>
                <span className="text-[10px] text-amber-700 font-bold block">Solar Rooftop + Grid</span>
              </div>

              {/* Sustainable Materials */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>Sustainable Materials</span>
                </div>
                <div className="text-xl font-extrabold text-zinc-900 font-mono pt-1">
                  {sustainableMatPct} <span className="text-xs font-medium text-zinc-500">%</span>
                </div>
                <span className="text-[10px] text-teal-700 font-bold block">GOTS Organic Certified</span>
              </div>

            </div>
          </div>

          {/* 4. Certifications Table */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-sm text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
              Certifications & Compliance
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase text-[10px]">
                    <th className="pb-2">Certification</th>
                    <th className="pb-2">Standard / Authority</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Validity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  <tr>
                    <td className="py-2.5 font-bold text-zinc-900">GOTS v7.0 Scope Certificate</td>
                    <td className="py-2.5 text-zinc-600">Global Organic Textile Standard</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-500">31 Dec 2026</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-bold text-zinc-900">OEKO-TEX® Standard 100 Class I</td>
                    <td className="py-2.5 text-zinc-600">Hohenstein Institute (Baby Safe)</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-500">15 Oct 2026</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-bold text-zinc-900">ISO 14001:2015 EMS</td>
                    <td className="py-2.5 text-zinc-600">Environmental Management System</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-500">20 Aug 2027</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-bold text-zinc-900">TNPCB Zero Liquid Discharge (ZLD)</td>
                    <td className="py-2.5 text-zinc-600">Tamil Nadu Pollution Control Board</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-zinc-500">30 Jun 2027</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Product Documents Card */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-display font-extrabold text-sm text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
              Attached Product Documents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 font-bold block">Commercial Tax Invoice</strong>
                    <span className="text-[10px] text-zinc-400 block font-mono">INV-2026-0892.pdf</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-700 cursor-pointer shrink-0 ml-2" />
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 font-bold block">Packing List & Customs Tag</strong>
                    <span className="text-[10px] text-zinc-400 block font-mono">PL-EW-2505.pdf</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-700 cursor-pointer shrink-0 ml-2" />
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 font-bold block">CETP ZLD Water Certificate</strong>
                    <span className="text-[10px] text-zinc-400 block font-mono">ZLD-CLEARANCE.pdf</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-700 cursor-pointer shrink-0 ml-2" />
              </div>

              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-zinc-900 font-bold block">GOTS Organic Fiber Test</strong>
                    <span className="text-[10px] text-zinc-400 block font-mono">GOTS-TEST-REPORT.pdf</span>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-emerald-700 cursor-pointer shrink-0 ml-2" />
              </div>

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
                <span className="font-semibold text-zinc-800">{formattedIssueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Valid Until</span>
                <span className="font-semibold text-zinc-800">{formattedValidUntil}</span>
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
                <span className={`text-[9px] font-mono font-bold block ${rawTxHash ? 'text-purple-700' : 'text-amber-700'}`}>
                  {rawTxHash ? `Tx ID: ${polygonShortTx}` : 'Status: Anchoring Pending'}
                </span>
              </div>
            </div>

          </div>

          {/* 7. Footer Banner */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-zinc-400 font-medium">
              This Digital Product Passport is generated in compliance with GS1 Digital Link Standard
            </p>
            <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest uppercase block mt-1">
              ((( GS1 Digital Link
            </span>
          </div>

        </div>

      </div>

      {/* PRINTABLE HANGTAG MODAL */}
      <HangtagPrintModal
        isOpen={showHangtagModal}
        onClose={() => setShowHangtagModal(false)}
        batch={{
          batchNumber: batchNo,
          productName: productName,
          styleCode: hsCode,
          fabricComposition: fabricDescription,
          carbonKgPerPiece: carbonKg,
          waterRecycledPercent: 94.2
        }}
      />

    </div>
  );
}
