import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';
import { HangtagPrintModal } from '../components/HangtagPrintModal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Leaf, 
  Droplets, 
  QrCode, 
  Award, 
  ExternalLink, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  Building2, 
  FlaskConical, 
  Ship, 
  Sparkles, 
  Info,
  ChevronRight
} from 'lucide-react';

export function PassportViewPage({ batchId, navigate }) {
  const { batches, showToast } = useApp();

  const batch = batches.find(b => b.id === batchId || (b.passport && b.passport.id === batchId)) || 
                batches.find(b => b.passport) || 
                batches[0];

  const passport = batch?.passport;
  const [activeCert, setActiveCert] = useState(null);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!batch || !passport) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-zinc-900">Passport Not Yet Issued</h2>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Batch <strong>{batch?.id || batchId}</strong> is awaiting supplier verifications.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const publicUrl = `https://vastrasetu.vercel.app/verify/${passport.id}`;
  const footprint = passport.footprint || {
    carbon: { perPieceKg: 4.2, conventionalBenchmarkKg: 6.8, savingsPercent: 38 },
    water: { perPieceLiters: 320, recycledPercentage: 92, savingsPercent: 88 }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Public DPP link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('passport-qr-svg');
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
      downloadLink.download = `VastraSetu-DPP-${passport.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      showToast('QR Code saved as PNG');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Verified Digital Identity
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Batch: <strong className="text-zinc-800">{batch.id}</strong>
            </span>
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-zinc-900">
            {batch.garmentTitle}
          </h1>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(`/verify/${passport.id}`)}
            className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Passport</span>
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

      {/* THE CENTERPIECE PASSPORT CARD */}
      <div className="bg-white rounded-3xl shadow-passport border border-brand-900/10 overflow-hidden passport-border">
        
        {/* Header Strip with Royal Purple Gradient */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm tracking-wider uppercase">
                  Vastra<span className="text-brand-300">Setu</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-200 border border-brand-400/30">
                  Export Passport
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white mt-1">
                {batch.garmentTitle}
              </h2>
              <p className="text-xs text-brand-200/80">
                Origin: <strong>Tiruppur, India</strong> • Destination: <strong>{batch.targetCountry}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-brand-200 space-y-0.5 shrink-0">
              <div>Passport: <strong className="text-white">{passport.id}</strong></div>
              <div className="text-[10px] text-emerald-300 font-bold">✓ EU DPP Ready (ESPR 2026)</div>
            </div>

          </div>
        </div>

        {/* Body Section */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Upper Section: Garment Visual & QR Presentation Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Garment Specs Card */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Garment Image Placeholder Card */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200 flex flex-col items-center justify-center text-brand-800 shrink-0">
                  <span className="text-2xl">👕</span>
                  <span className="text-[9px] font-bold mt-0.5">180 GSM</span>
                </div>
                <div className="space-y-1 text-xs">
                  <strong className="text-zinc-900 text-sm font-display block">{batch.garmentTitle}</strong>
                  <p className="text-zinc-600">{batch.fabricDescription}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                    <span>Order: <strong>{batch.orderRef}</strong></span>
                    <span>•</span>
                    <span>Qty: <strong>{batch.quantity.toLocaleString()} pcs</strong></span>
                  </div>
                </div>
              </div>

              {/* Environmental Metrics Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-800 block">Carbon Footprint</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-brand-900 font-display">2.84</span>
                    <span className="text-xs text-brand-700 font-medium">t CO₂e</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    ↓ 18% below conventional baseline
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-800 block">Water Footprint</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-cyan-900 font-display">186,400</span>
                    <span className="text-xs text-cyan-700 font-medium">L</span>
                  </div>
                  <span className="text-[10px] text-cyan-700 font-semibold block">
                    92% recycled through CETP
                  </span>
                </div>
              </div>

            </div>

            {/* Right: QR Code Box */}
            <div className="md:col-span-5 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <QRCodeSVG
                  id="passport-qr-svg"
                  value={publicUrl}
                  size={140}
                  level="H"
                  fgColor="#4C1D95"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 block">SCAN TO VERIFY</span>
                <span className="text-[11px] text-zinc-500 block">Verified by VastraSetu</span>
              </div>
            </div>

          </div>

          {/* Traceability Timeline */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Traceability Timeline
            </span>

            <div className="space-y-2">
              {[
                { date: '20 Aug 2026', title: 'Garment Registered', desc: 'Fabric origin & order specs logged by Sri Jayavarma Knits', source: 'MSME Exporter' },
                { date: '20 Aug 2026', title: 'Dyeing Verified', desc: 'Low-impact reactive dyeing & OEKO-TEX Standard 100 logged', source: 'Rainbow Eco-Dyers' },
                { date: '20 Aug 2026', title: 'CETP Clearance Verified', desc: '92% water recycling & Zero Liquid Discharge certified', source: 'Arulpuram CETP' },
                { date: '20 Aug 2026', title: 'Carbon & Water Calculated', desc: 'ISO 14067 LCA model verified emissions reduction', source: 'VastraSetu LCA Engine' },
                { date: '20 Aug 2026', title: 'Digital Passport Issued', desc: 'Anchored with Polygon cryptographic proof', source: 'Polygon Environmental Ledger' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="text-zinc-900 block">{item.title}</strong>
                      <p className="text-zinc-500 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-zinc-400 shrink-0 ml-2">
                    <span className="font-semibold text-zinc-700 block">{item.source}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audited Compliance Certificates (Click to view) */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Compliance Certificates
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { type: 'gots', label: 'GOTS Organic', code: 'CU-841920' },
                { type: 'oeko', label: 'OEKO-TEX Class I', code: 'OEKO-98442' },
                { type: 'zdhc', label: 'ZDHC MRSL Level 3', code: 'Verified ✓' },
                { type: 'zld', label: 'TNPCB 100% ZLD', code: '92% Recycled' },
              ].map((c) => (
                <button
                  key={c.type}
                  onClick={() => setActiveCert(c.type)}
                  className="p-3 rounded-xl bg-white hover:bg-brand-50 border border-zinc-200 hover:border-brand-200 text-left transition-all"
                >
                  <span className="text-[10px] font-bold text-emerald-700 block">✓ Verified</span>
                  <strong className="text-xs text-zinc-900 block mt-0.5">{c.label}</strong>
                  <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subtle Verification Anchor */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>Verification Anchor: <strong>Polygon</strong></span>
              <strong className="text-zinc-900">{passport.blockchainTxHash.slice(0, 10)}...{passport.blockchainTxHash.slice(-6)}</strong>
            </div>
            <span className="text-emerald-700 font-bold">✓ Integrity anchored</span>
          </div>

        </div>

      </div>

      {/* Certificate Viewer Modal */}
      {activeCert && (
        <CertificateModal
          certType={activeCert}
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          batch={batch}
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
