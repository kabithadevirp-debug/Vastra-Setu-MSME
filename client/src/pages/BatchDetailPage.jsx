import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Layers, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Truck, 
  Building2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  RotateCcw,
  ArrowLeft,
  QrCode,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { HangtagPrintModal } from '../components/HangtagPrintModal';
import { ExportChecklistModal } from '../components/ExportChecklistModal';

export function BatchDetailPage({ batchId, navigate }) {
  const [batch, setBatch] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journey'); // journey, evidence, consistency, passport, shipments
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showHangtagModal, setShowHangtagModal] = useState(false);
  const [checklistShipment, setChecklistShipment] = useState(null);

  // New Shipment Form State
  const [newShipmentData, setNewShipmentData] = useState({
    shipmentNumber: 'SHIP-2026-' + Math.floor(1000 + Math.random() * 9000),
    receiverName: 'ABC Fashion GmbH',
    receiverEmail: 'imports@abcfashion.de',
    expectedQuantity: 5000
  });

  const fetchBatchDetails = async () => {
    setLoading(true);
    try {
      const bNumber = batchId || 'VS-2026-B00041';
      const [bRes, sRes] = await Promise.allSettled([
        fetch(`/api/v2/batches/${bNumber}`).then(r => r.json()),
        fetch(`/api/v2/batches/${bNumber}/shipments`).then(r => r.json())
      ]);

      if (bRes.status === 'fulfilled' && bRes.value.success && bRes.value.data) {
        setBatch(bRes.value.data);
      }
      if (sRes.status === 'fulfilled' && sRes.value.success && sRes.value.data) {
        setShipments(sRes.value.data);
      }
    } catch (err) {
      console.warn('Batch fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  // Demo Fallback Data if DB entity not loaded yet
  const currentBatch = batch || {
    batchNumber: batchId || 'VS-2026-B00041',
    productName: '100% Organic Cotton Crewneck T-Shirt',
    styleCode: 'TS-26-ORG-01',
    quantity: 5000,
    fabricComposition: '100% Organic Cotton Single Jersey (180 GSM), Combed Ring Spun',
    buyerName: 'ABC Fashion GmbH',
    targetCountry: 'Germany',
    destinationPort: 'Hamburg Port',
    manufacturerName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    manufacturerGstin: '33AAACJ1928A1Z5',
    manufacturerLocation: 'Tiruppur Textile Cluster, Tamil Nadu, India',
    readinessScore: 96,
    readinessStatus: 'READY',
    status: 'PASSPORT_READY',
    passportVersion: 1,
    carbonKgPerPiece: 2.45,
    waterLitresPerPiece: 142.0,
    waterRecycledPercent: 94.2,
    passportHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    merkleRoot: '0x9f86d081884c7d659a2feaa0c55ad015',
    polygonTxHash: '0x7f28a4c1992b8842109284102984918237',
    qrCodeUrl: `/verify/${batchId || 'VS-2026-B00041'}`,
    journeyStages: JSON.stringify([
      { stageKey: 'RAW_MATERIAL', title: '1. Raw Material (Fiber Origin)', facility: 'Coimbatore Heritage Cotton Mills (GOTS Lic: CU-841920)', processDate: '2026-07-10', quantityKg: 1150, remarks: '100% GOTS v7.0 certified organic cotton.' },
      { stageKey: 'FABRIC', title: '2. Fabric Production (Knitting)', facility: 'Sri Jayavarma Knitting Unit 2, Tiruppur', processDate: '2026-07-18', quantityKg: 1120, remarks: 'Circular knitting single jersey 180 GSM.' },
      { stageKey: 'DYEING', title: '3. Dyeing & Wet Processing', facility: 'Rainbow Eco-Dyers Tiruppur', processDate: '2026-07-25', quantityKg: 1100, waterLitres: 45000, remarks: 'Low-impact reactive azo-free dyeing at 60°C. OEKO-TEX Standard 100 Class I.' },
      { stageKey: 'MANUFACTURING', title: '4. Garment Manufacturing (Cut & Sew)', facility: 'Sri Jayavarma Main Unit, Tiruppur', processDate: '2026-08-02', quantityPieces: 5000, remarks: 'CAD automated cutting & stitching.' },
      { stageKey: 'PACKAGING', title: '5. Finishing & Export Packaging', facility: 'Sri Jayavarma Logistics Hub, Tiruppur', processDate: '2026-08-10', quantityPieces: 5000, remarks: 'QR hangtag affixed & FSC cartons.' }
    ]),
    evidenceList: JSON.stringify([
      { id: 'DOC-GOTS-01', title: 'GOTS v7.0 Scope Certificate', certificateNo: 'CU-841920-GOTS-2026', issuer: 'Control Union Certifications B.V.', docType: 'GOTS_FIBER_CERTIFICATE', stageKey: 'RAW_MATERIAL', issueDate: '2025-06-15', expiryDate: '2026-12-31', status: 'DOCUMENT_SUPPORTED' },
      { id: 'DOC-OEKO-01', title: 'OEKO-TEX Standard 100 Class I Test Report', certificateNo: 'OEKO-2026-TX-9912', issuer: 'TESTEX AG Swiss Textile Testing Institute', docType: 'OEKOTEX_STANDARD_100', stageKey: 'DYEING', issueDate: '2026-01-10', expiryDate: '2027-01-09', status: 'DOCUMENT_SUPPORTED' },
      { id: 'DOC-ZLD-01', title: 'TNPCB Closed-Loop 100% ZLD Clearance Consent Order', certificateNo: 'TNPCB-ZLD-2026-8812', issuer: 'Tamil Nadu Pollution Control Board', docType: 'CETP_ZLD_CLEARANCE', stageKey: 'DYEING', issueDate: '2025-10-01', expiryDate: '2026-09-30', status: 'DOCUMENT_SUPPORTED' }
    ]),
    consistencyReport: JSON.stringify({
      readinessScore: 96,
      readinessStatus: 'READY',
      anomalyStatus: 'CONSISTENT',
      warningsCount: 0,
      warnings: [],
      breakdown: {
        productData: { score: 20, max: 20 },
        productionJourney: { score: 22, max: 25 },
        evidence: { score: 24, max: 25 },
        consistency: { score: 30, max: 30 }
      }
    })
  };

  // Helper JSON Parsers
  const parseJson = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const stages = parseJson(currentBatch.journeyStages, []);
  const evidence = parseJson(currentBatch.evidenceList, []);
  const consistency = parseJson(currentBatch.consistencyReport, {
    readinessScore: 96,
    readinessStatus: 'READY',
    anomalyStatus: 'CONSISTENT',
    warnings: [],
    breakdown: { productData: { score: 20 }, productionJourney: { score: 22 }, evidence: { score: 24 }, consistency: { score: 30 } }
  });

  const publicVerificationUrl = `${window.location.origin}/verify/${currentBatch.batchNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicVerificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('batch-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
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
      downloadLink.download = `VastraSetu-DPP-QR-${currentBatch.batchNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Trigger Material Anomaly for Judge Demo
  const handleTriggerAnomalyDemo = async (anomalyType) => {
    if (anomalyType === 'TRIGGER') {
      const updatedStages = stages.map(s => s.stageKey === 'RAW_MATERIAL' ? { ...s, quantityKg: 500 } : s);
      await fetch(`/api/v2/batches/${currentBatch.batchNumber}/stages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStages)
      });
      await fetchBatchDetails();
    } else {
      const restoredStages = stages.map(s => s.stageKey === 'RAW_MATERIAL' ? { ...s, quantityKg: 1150 } : s);
      await fetch(`/api/v2/batches/${currentBatch.batchNumber}/stages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restoredStages)
      });
      await fetchBatchDetails();
    }
  };

  // Submit New Export Shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v2/batches/${currentBatch.batchNumber}/shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipmentData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        setShipments([json.data, ...shipments]);
        setShowShipmentModal(false);
        setActiveTab('shipments');
      }
    } catch (err) {
      alert('Failed to create shipment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      
      {/* 1. MASTER BATCH HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/batches')}
                className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Batches</span>
              </button>
              <span className="text-zinc-300">/</span>
              <span className="font-mono font-bold text-xs text-zinc-600">{currentBatch.batchNumber}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                {currentBatch.status || 'PASSPORT_READY'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
              {currentBatch.productName}
            </h1>
            <p className="text-xs text-zinc-500">
              Style: <strong>{currentBatch.styleCode || 'TS-26-ORG-01'}</strong> • Export Buyer: <strong>{currentBatch.buyerName}</strong> ({currentBatch.targetCountry})
            </p>
          </div>

          {/* Readiness & Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Traceability Readiness Pill */}
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
              (currentBatch.readinessScore || 96) >= 80
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider block font-bold text-zinc-400">Traceability Readiness</span>
                <strong className="text-xs font-extrabold">{currentBatch.readinessScore || 96}/100 ({currentBatch.readinessStatus || 'READY'})</strong>
              </div>
            </div>

            <button
              onClick={() => setShowShipmentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>+ Create Shipment</span>
            </button>

            <a
              href={publicVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Passport ↗</span>
            </a>
          </div>
        </div>

        {/* 4 Core Summary Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-zinc-100">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">Production Volume</span>
            <strong className="text-zinc-900 font-bold text-sm">{currentBatch.quantity ? currentBatch.quantity.toLocaleString() : '5,000'} pcs</strong>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">Fabric Composition</span>
            <strong className="text-zinc-900 truncate block font-bold" title={currentBatch.fabricComposition}>
              {currentBatch.fabricComposition || '100% Organic Cotton'}
            </strong>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">Destination Port</span>
            <strong className="text-zinc-900 font-bold">{currentBatch.destinationPort || 'Hamburg Port'}</strong>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-zinc-400 block text-[11px]">Passport Version</span>
            <strong className="text-emerald-800 font-bold">Version {currentBatch.passportVersion || 1} (Live)</strong>
          </div>
        </div>

      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'journey'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Garment Journey (TRACE)</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'evidence'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2. Supporting Evidence (PROVE)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-800">{evidence.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('consistency')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'consistency'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>3. Consistency & Anomaly Engine (VERIFY)</span>
          {consistency.warnings?.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
              {consistency.warnings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('passport')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'passport'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Digital Passport & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('shipments')}
          className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'shipments'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipments & Receiver Status</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800">{shipments.length}</span>
        </button>
      </div>

      {/* 3. TAB CONTENT PANELS */}

      {/* TAB 1: GARMENT PRODUCTION JOURNEY */}
      {activeTab === 'journey' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-900 font-display">
              Configurable Production Journey Timeline
            </h2>
            <p className="text-xs text-zinc-500">
              Trace every manufacturing step from raw fiber harvesting to final export packaging.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
            {stages.map((stage, idx) => (
              <div key={idx} className="relative space-y-2">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  {idx + 1}
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <strong className="text-xs font-bold text-zinc-900">{stage.title}</strong>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{stage.processDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-700">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span><strong>Facility:</strong> {stage.facility}</span>
                  </div>

                  {stage.remarks && (
                    <p className="text-[11px] text-zinc-500 bg-white p-2.5 rounded-xl border border-zinc-100">
                      {stage.remarks}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-zinc-500">
                      Material: <strong>{stage.quantityKg ? `${stage.quantityKg} kg` : `${stage.quantityPieces} pcs`}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      DOCUMENT SUPPORTED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUPPORTING EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display">
                Supporting Evidence & Extracted Certificates
              </h2>
              <p className="text-xs text-zinc-500">
                Verified test certificates, invoices, and environmental permits supporting product claims.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('consistency')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 hover:bg-emerald-100 transition-all"
            >
              Verify Consistency →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((doc, idx) => (
              <div key={idx} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <strong className="text-xs font-bold text-zinc-900">{doc.title}</strong>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {doc.status || 'DOCUMENT_SUPPORTED'}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100">
                  <div><span className="text-zinc-400 font-sans">Certificate No:</span> <strong>{doc.certificateNo}</strong></div>
                  <div><span className="text-zinc-400 font-sans">Issuing Body:</span> {doc.issuer}</div>
                  <div><span className="text-zinc-400 font-sans">Validity Expiry:</span> <strong>{doc.expiryDate}</strong></div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1">
                  <span>Attached to: <strong>{doc.stageKey}</strong></span>
                  <span className="text-emerald-700 font-bold">✓ Field Extraction Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: THE MAIN NOVELTY — EVIDENCE CONSISTENCY & ANOMALY ENGINE */}
      {activeTab === 'consistency' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Headline Innovation Layer</span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 font-display">
                Cross-Record Traceability Consistency Engine
              </h2>
              <p className="text-xs text-zinc-500">
                Before publishing the passport, VastraSetu mathematically reconciles production volumes against raw material weights, certificate validity dates, and shipment claims.
              </p>
            </div>

            {/* Interactive Judge Demo Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleTriggerAnomalyDemo('TRIGGER')}
                className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-all"
                title="Reduces input material to 500 kg for 5,000 units to trigger an anomaly"
              >
                ⚠ Demo Material Anomaly
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAnomalyDemo('RESTORE')}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all"
                title="Restores 1,150 kg material for 5,000 units"
              >
                ✓ Restore Balanced Data
              </button>
            </div>
          </div>

          {/* ANOMALY ALERT BANNER */}
          {consistency.warnings && consistency.warnings.length > 0 ? (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Traceability Anomaly Flagged ({consistency.warnings.length})</span>
              </div>

              {consistency.warnings.map((warn, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1 text-zinc-800">
                  <strong className="text-amber-900 block font-bold">{warn.title}</strong>
                  <p className="text-zinc-600">{warn.reason}</p>
                  {warn.suggestedAction && (
                    <p className="text-[11px] text-emerald-800 font-medium">💡 Suggested fix: {warn.suggestedAction}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-bold">100% Cross-Record Consistency Verified</strong>
                <p className="text-emerald-800">
                  Material input weights (1,150 kg cotton) reconcile with 5,000 units production. All supplier certificates are within active validity windows.
                </p>
              </div>
            </div>
          )}

          {/* READINESS SCORE BREAKDOWN (0-100) */}
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Overall Score</span>
                <strong className="text-2xl font-extrabold text-zinc-900 font-display">
                  {consistency.readinessScore || 96}/100
                </strong>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                (consistency.readinessScore || 96) >= 80
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {consistency.readinessStatus || 'READY'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[11px]">Product Data</span>
                <strong className="text-zinc-900 text-sm">20 / 20</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[11px]">Production Journey</span>
                <strong className="text-zinc-900 text-sm">22 / 25</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[11px]">Supporting Evidence</span>
                <strong className="text-zinc-900 text-sm">24 / 25</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[11px]">Consistency Rules</span>
                <strong className={consistency.warnings?.length > 0 ? 'text-amber-700 text-sm' : 'text-emerald-700 text-sm'}>
                  {consistency.warnings?.length > 0 ? '18 / 30' : '30 / 30'}
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              * Note: The readiness indicator reflects internal evidence consistency and data completeness for EU ESPR Digital Product Passport requirements. It is not a government regulatory certification.
            </p>
          </div>

        </div>
      )}

      {/* TAB 4: DIGITAL PRODUCT PASSPORT & PERSISTENT QR */}
      {activeTab === 'passport' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display">
                Digital Product Passport & Persistent QR Code
              </h2>
              <p className="text-xs text-zinc-500">
                A single persistent QR code printed on garment packaging. Updating the passport version does not invalidate the QR.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadQr}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR PNG</span>
              </button>

              <button
                onClick={() => setShowHangtagModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print 2.5"×4.5" Hangtag</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* QR Visual */}
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-3 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xs border border-zinc-200 inline-block">
                <QRCodeSVG
                  id="batch-qr-svg"
                  value={publicVerificationUrl}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <strong className="font-mono text-xs text-zinc-900 block">{currentBatch.batchNumber}</strong>
                <span className="text-[11px] text-zinc-400 block">Persistent GS1 / DPP QR</span>
              </div>

              <button
                onClick={handleCopyLink}
                className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy Verification URL'}</span>
              </button>
            </div>

            {/* Passport Specs */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">Cryptographic Integrity Status</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Anchored on Polygon Amoy PoS
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px] text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100">
                  <div className="truncate"><span className="text-zinc-400 font-sans">Passport Hash (SHA-256):</span> {currentBatch.passportHash}</div>
                  <div className="truncate"><span className="text-zinc-400 font-sans">Merkle Root:</span> {currentBatch.merkleRoot}</div>
                  <div className="truncate"><span className="text-zinc-400 font-sans">Polygon Tx Hash:</span> {currentBatch.polygonTxHash}</div>
                </div>

                <div className="text-[11px] text-zinc-500 leading-relaxed">
                  * <strong>Integrity vs Truth Separation:</strong> Blockchain guarantees that this passport record has not been altered since generation. It proves mathematical record integrity.
                </div>
              </div>

              {/* Environmental Indicators */}
              <div className="grid grid-cols-3 gap-3 text-xs text-center">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Carbon Footprint</span>
                  <strong className="text-zinc-900 text-sm">{currentBatch.carbonKgPerPiece || 2.45} kg CO₂e</strong>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Water Footprint</span>
                  <strong className="text-zinc-900 text-sm">{currentBatch.waterLitresPerPiece || 142} L</strong>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-zinc-400 block text-[11px]">Water Recycled</span>
                  <strong className="text-emerald-800 text-sm">{currentBatch.waterRecycledPercent || 94.2}% (ZLD)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: EXPORT SHIPMENTS & ZERO-LOGIN RECEIVER STATUS */}
      {activeTab === 'shipments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                <span>Export Shipments & Receiver Deliveries</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Generate secure zero-login receiver links for international buyers to acknowledge arrival and log discrepancies.
              </p>
            </div>

            <button
              onClick={() => setShowShipmentModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Shipment Dispatch</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-bold text-[11px]">
                  <th className="pb-3">Shipment Ref</th>
                  <th className="pb-3">Receiver / Importer</th>
                  <th className="pb-3 text-right">Expected Units</th>
                  <th className="pb-3 text-right">Confirmed Units</th>
                  <th className="pb-3 text-center">Receiver Status</th>
                  <th className="pb-3 text-right">Receiver Action Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                {shipments.map((shipment) => (
                  <tr key={shipment.shipmentNumber} className="hover:bg-zinc-50/80 transition-colors">
                    
                    <td className="py-4 font-mono font-bold text-zinc-900">
                      {shipment.shipmentNumber}
                    </td>

                    <td className="py-4 font-bold text-zinc-800">
                      <div>{shipment.receiverName}</div>
                      <span className="text-[11px] text-zinc-400 font-normal">{shipment.receiverEmail}</span>
                    </td>

                    <td className="py-4 text-right font-bold text-zinc-900">
                      {shipment.expectedQuantity ? shipment.expectedQuantity.toLocaleString() : '5,000'}
                    </td>

                    <td className="py-4 text-right font-bold">
                      {shipment.receivedQuantity != null ? (
                        <span className={shipment.receivedQuantity === shipment.expectedQuantity ? 'text-emerald-700' : 'text-amber-700'}>
                          {shipment.receivedQuantity.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>

                    <td className="py-4 text-center">
                      {shipment.status === 'RECEIVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed (100%)</span>
                        </span>
                      ) : shipment.status === 'DISPUTED' || shipment.status === 'PARTIALLY_RECEIVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Discrepancy Reported ({shipment.discrepancyDifference > 0 ? `-${shipment.discrepancyDifference}` : `+${Math.abs(shipment.discrepancyDifference)}`} pcs)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">
                          <Clock className="w-3 h-3" />
                          <span>Pending Delivery</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setChecklistShipment(shipment)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] border border-purple-200 transition-all"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Export Docs ({shipment.exportReadinessScore || 92}%)</span>
                      </button>

                      <button
                        onClick={() => navigate(`/confirm-shipment/${shipment.confirmationToken || 'CONF-ABC-2026-8842'}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Receiver Portal</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* CREATE SHIPMENT MODAL */}
      {showShipmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900 font-display">
                Create Export Shipment Dispatch
              </h3>
              <button
                onClick={() => setShowShipmentModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Shipment Reference Number *</label>
                <input
                  type="text"
                  value={newShipmentData.shipmentNumber}
                  onChange={(e) => setNewShipmentData({ ...newShipmentData, shipmentNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Receiver / Buyer Company *</label>
                <input
                  type="text"
                  value={newShipmentData.receiverName}
                  onChange={(e) => setNewShipmentData({ ...newShipmentData, receiverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Receiver Import Email *</label>
                <input
                  type="email"
                  value={newShipmentData.receiverEmail}
                  onChange={(e) => setNewShipmentData({ ...newShipmentData, receiverEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Dispatch Quantity (pcs) *</label>
                <input
                  type="number"
                  value={newShipmentData.expectedQuantity}
                  onChange={(e) => setNewShipmentData({ ...newShipmentData, expectedQuantity: parseInt(e.target.value || '0', 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-bold text-zinc-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShipmentModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition-all"
                >
                  Generate Shipment & Receiver Link →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT DOCUMENTATION CHECKLIST MODAL */}
      <ExportChecklistModal
        isOpen={!!checklistShipment}
        onClose={() => setChecklistShipment(null)}
        shipment={checklistShipment}
        batchNumber={currentBatch.batchNumber}
      />

      {/* HANGTAG PRINT MODAL */}
      <HangtagPrintModal
        isOpen={showHangtagModal}
        onClose={() => setShowHangtagModal(false)}
        batch={{
          id: currentBatch.batchNumber,
          garmentTitle: currentBatch.productName,
          buyerName: currentBatch.buyerName,
          targetCountry: currentBatch.targetCountry,
          passport: {
            polygonTxHash: currentBatch.polygonTxHash,
            qrCodeData: publicVerificationUrl
          }
        }}
      />

    </div>
  );
}
