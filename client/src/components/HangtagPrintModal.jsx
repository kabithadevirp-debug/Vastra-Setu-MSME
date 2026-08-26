import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, ShieldCheck, Leaf, Sparkles, Droplets, Download, Check, Copy } from 'lucide-react';

export function HangtagPrintModal({ isOpen, onClose, batch }) {
  if (!isOpen || !batch) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQrPng = () => {
    const svg = document.getElementById('hangtag-qr-svg');
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
      downloadLink.download = `${batch.batchNumber || batch.id || 'vastrasetu'}_DPP_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const batchNumber = batch.batchNumber || batch.id || 'VS-2026-B00041';
  const productName = batch.productName || batch.garmentTitle || '100% Organic Cotton Crewneck T-Shirt';
  const styleCode = batch.styleCode || 'TS-26-ORG-01';
  const buyerName = batch.buyerName || batch.buyer || 'XYZ Fashion GmbH';
  const fabricComposition = batch.fabricComposition || '100% Organic Cotton (180 GSM)';
  const carbonFootprint = batch.carbonKgPerPiece || batch.passport?.footprint?.carbon?.perPieceKg || '2.45';
  const waterRecycled = batch.waterRecycledPercent || batch.passport?.footprint?.water?.recycledPercentage || '94.2';

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${batchNumber}`
    : `https://vastrasetu.vercel.app/verify/${batchNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 font-sans">
        
        {/* Header */}
        <div className="bg-zinc-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display text-white">Printable Export Hangtag Preview</h3>
              <p className="text-[10px] text-zinc-400">EU ESPR / DPP Standard 2.5" × 4.5" Physical Hangtag</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hangtag Preview Container */}
        <div className="p-6 bg-zinc-100 flex flex-col items-center justify-center">
          
          {/* Physical Hangtag Card */}
          <div 
            id="printable-hangtag"
            className="w-72 bg-white rounded-3xl shadow-xl border-2 border-zinc-900 p-5 text-center relative overflow-hidden font-sans"
          >
            {/* Punch Hole */}
            <div className="w-4 h-4 rounded-full border-2 border-zinc-900 mx-auto mb-3 bg-zinc-100 shadow-inner"></div>

            {/* Brand Header */}
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Leaf className="w-4 h-4 text-emerald-700" />
              <span className="font-display font-extrabold text-sm tracking-wider text-zinc-900 uppercase">
                Vastra<span className="text-emerald-700">Setu</span>
              </span>
            </div>
            <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 py-0.5 px-2 rounded-full inline-block mb-3 border border-emerald-200">
              Digital Product Passport
            </p>

            {/* Garment Title */}
            <h4 className="font-bold text-xs text-zinc-900 mb-0.5 line-clamp-1">{productName}</h4>
            <p className="text-[10px] text-zinc-500 mb-3 font-mono">{styleCode} • {batchNumber}</p>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-2xl border border-zinc-300 inline-block shadow-xs mb-3">
              <QRCodeSVG
                id="hangtag-qr-svg"
                value={verificationUrl}
                size={140}
                level="H"
                includeMargin={false}
                fgColor="#092f23"
              />
            </div>

            {/* Composition */}
            <div className="text-[10px] text-zinc-600 bg-zinc-50 py-1.5 px-2 rounded-xl border border-zinc-200 mb-2 font-medium">
              {fabricComposition}
            </div>

            {/* Impact Highlights */}
            <div className="grid grid-cols-2 gap-1.5 text-left mb-3 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <div className="p-1">
                <span className="text-[8px] uppercase tracking-wider text-zinc-400 block font-bold">Carbon Footprint</span>
                <span className="text-[11px] font-bold text-emerald-900">
                  {carbonFootprint} kg CO₂e
                </span>
                <span className="text-[8px] text-emerald-600 block font-semibold">
                  ↓ 38% vs Industry Avg
                </span>
              </div>
              <div className="p-1 border-l border-zinc-200 pl-2">
                <span className="text-[8px] uppercase tracking-wider text-zinc-400 block font-bold">ZLD Water Saved</span>
                <span className="text-[11px] font-bold text-teal-900">
                  {waterRecycled}% Recycled
                </span>
                <span className="text-[8px] text-teal-700 block font-semibold">Closed-Loop</span>
              </div>
            </div>

            {/* EU DPP & Origin */}
            <div className="text-[9px] text-zinc-500 border-t border-dashed border-zinc-300 pt-2 flex items-center justify-between">
              <span>Origin: Tiruppur, India</span>
              <span className="font-semibold text-emerald-700">EU DPP Ready ✓</span>
            </div>

            <p className="text-[8px] text-zinc-400 mt-2 font-mono">
              Scan QR to view raw supply chain certificates & LCA
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 font-medium">Standard 2.5" × 4.5" Garment Hangtag</p>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadQrPng}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save QR PNG</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Hangtag Tag</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
