import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { BatchPipelineStepper } from '../components/BatchPipelineStepper';
import { SupplyChainStepper } from '../components/SupplyChainStepper';
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
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export function BatchDetailPage({ batchId, navigate }) {
  const { batches = [], showToast = () => {} } = useApp() || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCert, setActiveCert] = useState(null);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const foundBatch = batches.find(b => b.id === batchId || b.batchNumber === batchId || (b.passport && b.passport.id === batchId));

  const batch = foundBatch || {
    id: batchId || 'BATCH-01',
    batchNumber: batchId || 'BATCH-2026-0892',
    garmentTitle: '100% Organic Cotton Polo Shirt',
    quantity: 4000,
    buyerName: 'Inditex / Zara Germany',
    targetCountry: 'Germany',
    destinationPort: 'Hamburg',
    freightMode: 'sea',
    styleCode: 'POLO-2026-ORG',
    orderRef: 'PO-ZARA-EU-8842',
    fabricDescription: '100% Organic Cotton (220 GSM)',
    weightGsm: 220,
    yarnSpinningMill: 'Lakshmi Spinners Tiruppur',
    status: 'ISSUED',
    passport: {
      id: batchId || 'DPP-VS-2026-00892',
      polygonTxHash: '0x7f28a4c1992b8842109284102984',
      qrCodeData: `${window.location.origin}/verify/${batchId || 'BATCH-01'}`
    }
  };

  const passport = batch.passport || {
    id: batch.id,
    polygonTxHash: '0x7f28a4c1992b8842109284102984',
    qrCodeData: `${window.location.origin}/verify/${batch.id}`
  };

  const publicUrl = passport?.qrCodeData || `${window.location.origin}/verify/${passport?.id || batch.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Public verification link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('batch-detail-qr-svg');
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
      downloadLink.download = `VastraSetu-DPP-QR-${batch.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      showToast('QR Code saved as PNG');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const formattedQuantity = batch.quantity ? batch.quantity.toLocaleString() : '4,000';
  const txHash = passport?.polygonTxHash || passport?.blockchainTxHash || '0x7f28a4c1992b8842109284102984';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/passports')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Batches & Passports</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-xs text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                {batch.id || 'BATCH-01'}
              </span>
              <StatusBadge status={batch.status || 'ISSUED'} size="sm" />
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
              {batch.garmentTitle || batch.productName || '100% Organic Cotton Polo Shirt'}
            </h1>
            <p className="text-xs text-zinc-500">
              {formattedQuantity} pieces • Buyer: <strong className="text-zinc-800">{batch.buyerName || 'Inditex / Zara Germany'}</strong> ({batch.targetCountry || 'Germany'})
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/verify/${passport?.id || batch.id}`)}
              className="px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
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
              onClick={() => setShowHangtagModal(true)}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Hangtag</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Tracker */}
        <div className="py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Passport Generation Pipeline
          </span>
          <BatchPipelineStepper batch={batch} />
        </div>

      </div>

      {/* 5 Structured Tabs */}
      <div className="flex border-b border-zinc-200 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'supply_chain', label: 'Supply Chain' },
          { id: 'environmental', label: 'Environmental' },
          { id: 'compliance', label: 'Compliance' },
          { id: 'passport', label: 'Digital Passport' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white shadow-sm font-bold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          <h3 className="font-display font-bold text-lg text-zinc-900">
            Garment Batch Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Product Details</span>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Style / SKU:</span>
                <strong className="font-mono text-zinc-900">{batch.styleCode || 'POLO-2026-ORG'}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Order Reference:</span>
                <strong className="font-mono text-zinc-900">{batch.orderRef || 'PO-ZARA-EU-8842'}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Fiber Composition:</span>
                <strong className="text-zinc-900">{batch.fabricDescription || '100% Organic Cotton'}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Weight GSM:</span>
                <strong className="text-zinc-900">{batch.weightGsm || 220} GSM</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Quantity:</span>
                <strong className="text-zinc-900">{formattedQuantity} pieces</strong>
              </div>
            </div>

            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Commercial & Destination</span>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Buyer:</span>
                <strong className="text-zinc-900">{batch.buyerName || 'Inditex / Zara Germany'}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Target Country:</span>
                <strong className="text-zinc-900">{batch.targetCountry || 'Germany'}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Destination Port:</span>
                <strong className="text-zinc-900">Port of {(batch.destinationPort || 'Hamburg').toUpperCase()}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-500">Freight Mode:</span>
                <strong className="text-zinc-900">{batch.freightMode === 'air' ? 'Air Freight' : 'Container Vessel (Sea)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Yarn Spinning Mill:</span>
                <strong className="text-zinc-900">{batch.yarnSpinningMill || 'Lakshmi Spinners Tiruppur'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Supply Chain */}
      {activeTab === 'supply_chain' && (
        <div className="space-y-6 animate-in fade-in">
          <SupplyChainStepper batch={batch} navigate={navigate} />
        </div>
      )}

      {/* TAB 3: Environmental */}
      {activeTab === 'environmental' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          <h3 className="font-display font-bold text-lg text-zinc-900">
            Environmental Impact & Footprint Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-3">
              <span className="text-[10px] uppercase font-bold text-brand-800 block">Carbon Footprint</span>
              <span className="text-3xl font-extrabold text-brand-900 font-display block">2.84 t CO₂e</span>
              <span className="text-emerald-700 font-semibold block">18% lower than estimated conventional baseline</span>

              <div className="space-y-2 pt-2 border-t border-brand-100 text-zinc-700">
                <div className="flex justify-between">
                  <span>Raw Material:</span>
                  <strong>48% (1.36 t)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dyeing & Wet Finishing:</span>
                  <strong>27% (0.77 t)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Transport Freight:</span>
                  <strong>25% (0.71 t)</strong>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-3">
              <span className="text-[10px] uppercase font-bold text-cyan-800 block">Water Footprint</span>
              <span className="text-3xl font-extrabold text-cyan-900 font-display block">186,400 L</span>
              <span className="text-cyan-700 font-semibold block">92% water recycled through Tiruppur ZLD</span>

              <div className="space-y-2 pt-2 border-t border-cyan-100 text-zinc-700">
                <div className="flex justify-between">
                  <span>Freshwater Intake:</span>
                  <strong>14,900 L</strong>
                </div>
                <div className="flex justify-between">
                  <span>Water Recycled (RO + MEE):</span>
                  <strong>171,500 L</strong>
                </div>
                <div className="flex justify-between">
                  <span>River Basin Discharge:</span>
                  <strong className="text-emerald-700">0 L (100% ZLD)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Compliance */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              EU DPP Compliance Readiness: 87%
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
              ESPR 2026 Mandate Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'gots', title: 'GOTS Organic v7.0', certNo: 'CU-841920-GOTS-2026', issuer: 'Control Union', status: 'Verified ✓' },
              { type: 'oeko', title: 'OEKO-TEX® Standard 100', certNo: 'OEKO-2026-TX-98442', issuer: 'TESTEX AG', status: 'Verified ✓' },
              { type: 'zdhc', title: 'ZDHC MRSL Level 3', certNo: 'ZDHC-IN-2026-MRSL-441', issuer: 'ZDHC Foundation', status: 'Verified ✓' },
              { type: 'zld', title: 'TNPCB Zero Liquid Discharge', certNo: 'TNPCB-CETP-ZLD-8842', issuer: 'TNPCB & Tiruppur CETP', status: 'Verified ✓' },
            ].map((c) => (
              <div key={c.type} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-zinc-900">{c.title}</strong>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{c.status}</span>
                </div>
                <div className="text-[11px] text-zinc-500 space-y-0.5 font-mono">
                  <div>ID: <span className="text-zinc-800">{c.certNo}</span></div>
                  <div>Issuer: <span className="text-zinc-800">{c.issuer}</span></div>
                </div>
                <button
                  onClick={() => setActiveCert(c.type)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Inspect Audit Document</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Digital Passport */}
      {activeTab === 'passport' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Digital Product Passport</span>
                <h3 className="font-display font-bold text-xl text-zinc-900">Passport #{passport?.id || batch.id}</h3>
              </div>
              <button
                onClick={() => navigate(`/verify/${passport?.id || batch.id}`)}
                className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Buyer View</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
              <div className="p-3 bg-white rounded-2xl border border-zinc-200 shadow-sm shrink-0">
                <QRCodeSVG
                  id="batch-detail-qr-svg"
                  value={publicUrl}
                  size={140}
                  fgColor="#4C1D95"
                />
              </div>
              <div className="space-y-2 text-xs">
                <strong className="text-sm font-display text-zinc-900 block">{batch.garmentTitle || 'Organic Cotton Polo Shirt'}</strong>
                <p className="text-zinc-600">{batch.fabricDescription || '100% Organic Cotton'}</p>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Polygon Anchor: <strong>{txHash ? txHash.slice(0, 16) : '0x7f28a4c1992b'}...</strong>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-medium text-xs hover:bg-zinc-50"
                  >
                    {copied ? 'Copied ✓' : 'Copy Public Link'}
                  </button>
                  <button
                    onClick={handleDownloadQr}
                    className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-medium text-xs hover:bg-zinc-50"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
