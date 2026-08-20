import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, ShieldCheck, Leaf, Sparkles, Droplets } from 'lucide-react';

export function HangtagPrintModal({ isOpen, onClose, batch }) {
  if (!isOpen || !batch) return null;

  const handlePrint = () => {
    window.print();
  };

  const passport = batch.passport;
  const qrUrl = passport?.qrCodeData || `https://vastrasetu.vercel.app/verify/${passport?.id || batch.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm font-display">Printable Export Hangtag Preview</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hangtag Preview Container */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center">
          
          {/* Physical Hangtag Card */}
          <div 
            id="printable-hangtag"
            className="w-72 bg-white rounded-2xl shadow-xl border-2 border-slate-800 p-5 text-center relative overflow-hidden font-sans"
          >
            {/* Punch Hole */}
            <div className="w-4 h-4 rounded-full border-2 border-slate-800 mx-auto mb-3 bg-slate-100 shadow-inner"></div>

            {/* Brand Header */}
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Leaf className="w-4 h-4 text-teal-700" />
              <span className="font-display font-extrabold text-sm tracking-wider text-slate-900 uppercase">
                Vastra<span className="text-teal-700">Setu</span>
              </span>
            </div>
            <p className="text-[9px] font-bold text-teal-800 uppercase tracking-widest bg-teal-50 py-0.5 px-2 rounded-full inline-block mb-3 border border-teal-200">
              Digital Product Passport
            </p>

            {/* Garment Title */}
            <h4 className="font-bold text-xs text-slate-800 mb-0.5 line-clamp-1">{batch.garmentTitle}</h4>
            <p className="text-[10px] text-slate-500 mb-3 font-mono">{batch.styleCode} • {batch.orderRef}</p>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl border border-slate-300 inline-block shadow-sm mb-3">
              <QRCodeSVG
                value={qrUrl}
                size={140}
                level="H"
                includeMargin={false}
                fgColor="#072e2b"
              />
            </div>

            {/* Impact Highlights */}
            <div className="grid grid-cols-2 gap-1.5 text-left mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="p-1">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Carbon Footprint</span>
                <span className="text-[11px] font-bold text-teal-900">
                  {passport?.footprint?.carbon?.perPieceKg || '4.2'} kg CO₂e
                </span>
                <span className="text-[8px] text-emerald-600 block font-semibold">
                  ↓ {passport?.footprint?.carbon?.savingsPercent || '38'}% vs avg
                </span>
              </div>
              <div className="p-1 border-l border-slate-200 pl-2">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Water Saved</span>
                <span className="text-[11px] font-bold text-cyan-900">
                  {passport?.footprint?.water?.recycledPercentage || '94'}% Recycled
                </span>
                <span className="text-[8px] text-cyan-700 block font-semibold">ZLD Closed-Loop</span>
              </div>
            </div>

            {/* EU DPP & Origin */}
            <div className="text-[9px] text-slate-500 border-t border-dashed border-slate-300 pt-2 flex items-center justify-between">
              <span>Origin: Tiruppur, India</span>
              <span className="font-semibold text-emerald-700">EU DPP Ready ✓</span>
            </div>

            <p className="text-[8px] text-slate-400 mt-2 font-mono">
              Scan QR to view raw supply chain certificates & LCA
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Standard 2.5" x 4.5" Garment Hangtag</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-sm"
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
