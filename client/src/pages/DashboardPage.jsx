import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Truck, 
  Plus, 
  ArrowRight, 
  QrCode, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Building2, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  PackageCheck 
} from 'lucide-react';
import { ExportChecklistModal } from '../components/ExportChecklistModal';

export function DashboardPage({ navigate }) {
  const { msme } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checklistShipment, setChecklistShipment] = useState(null);
  const [summary, setSummary] = useState({
    activeBatches: 1,
    passportsReady: 1,
    documentsPending: 2,
    traceabilityWarnings: 0,
    pendingAcknowledgements: 1,
    recentBatches: [],
    recentShipments: []
  });

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v2/dashboard/summary');
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data);
      }
    } catch (err) {
      console.warn('Using local fallback for dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const batches = summary.recentBatches && summary.recentBatches.length > 0 
    ? summary.recentBatches 
    : [
        {
          batchNumber: 'VS-2026-B00041',
          productName: '100% Organic Cotton Crewneck T-Shirt',
          styleCode: 'TS-26-ORG-01',
          quantity: 5000,
          buyerName: 'ABC Fashion GmbH (Germany)',
          readinessScore: 96,
          readinessStatus: 'READY',
          status: 'PASSPORT_READY',
          passportVersion: 1
        }
      ];

  const shipments = summary.recentShipments && summary.recentShipments.length > 0
    ? summary.recentShipments
    : [
        {
          shipmentNumber: 'SHIP-2026-0087',
          batchNumber: 'VS-2026-B00041',
          receiverName: 'ABC Fashion GmbH',
          expectedQuantity: 5000,
          receivedQuantity: null,
          confirmationToken: 'CONF-ABC-2026-8842',
          status: 'PENDING'
        }
      ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. EXPORTER WELCOME HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Verified Textile Exporter
            </span>
            <span className="text-xs text-zinc-400 font-mono">GSTIN: {msme?.gstin || '33AAACJ1928A1Z5'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            {msme?.businessName || 'Sri Jayavarma Knits & Exports Pvt Ltd'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Tiruppur Textile Cluster • Export Traceability & Digital Product Passport Command Center
          </p>
        </div>

        <button
          onClick={() => navigate('/create-batch')}
          className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Garment Batch</span>
        </button>
      </div>

      {/* 2. THE 5 CORE QUESTIONS KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Active Batches */}
        <div 
          onClick={() => navigate('/batches')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Active Batches</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            {summary.activeBatches || batches.length}
          </div>
          <span className="text-[11px] text-zinc-400 block font-medium">In production & export</span>
        </div>

        {/* Metric 2: Passports Ready */}
        <div 
          onClick={() => navigate('/batches')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Passports Ready</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display text-emerald-800">
            {summary.passportsReady || 1}
          </div>
          <span className="text-[11px] text-zinc-400 block font-medium">Ready for QR hangtag</span>
        </div>

        {/* Metric 3: Documents Pending */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Documents Pending</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            {summary.documentsPending || 2}
          </div>
          <span className="text-[11px] text-zinc-400 block font-medium">Stage certificates awaiting</span>
        </div>

        {/* Metric 4: Traceability Warnings */}
        <div className={`p-5 rounded-2xl border shadow-xs space-y-2 transition-all ${
          (summary.traceabilityWarnings || 0) > 0 
            ? 'bg-amber-50/70 border-amber-300' 
            : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Traceability Warnings</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              (summary.traceabilityWarnings || 0) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-display ${
            (summary.traceabilityWarnings || 0) > 0 ? 'text-amber-700' : 'text-zinc-900'
          }`}>
            {summary.traceabilityWarnings || 0}
          </div>
          <span className="text-[11px] text-zinc-400 block font-medium">
            {(summary.traceabilityWarnings || 0) > 0 ? 'Material balance alert' : '0 Anomalies detected'}
          </span>
        </div>

        {/* Metric 5: Receiver Confirmations */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Receiver Status</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display text-purple-800">
            {summary.pendingAcknowledgements || 1} <span className="text-sm font-bold text-zinc-400">Pending</span>
          </div>
          <span className="text-[11px] text-zinc-400 block font-medium">Buyer receipt acknowledgement</span>
        </div>

      </div>

      {/* 3. TRACE ➔ PROVE ➔ VERIFY CONCEPTUAL ARCHITECTURE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-[10px] font-bold border border-emerald-700">
            <span>◈</span>
            <span>VastraSetu Framework</span>
          </div>
          <h2 className="text-lg font-bold font-display text-white">
            TRACE ➔ PROVE ➔ VERIFY
          </h2>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Every garment batch links configurable production stages (TRACE) with OCR-extracted certificates (PROVE) and transparent cross-record consistency checks with zero-login buyer receipt confirmations (VERIFY).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-center p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 block font-bold">1. TRACE</span>
            <strong className="text-xs text-white">Garment Journey</strong>
          </div>
          <span className="text-emerald-500 font-bold">➔</span>
          <div className="text-center p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 block font-bold">2. PROVE</span>
            <strong className="text-xs text-white">Evidence Extraction</strong>
          </div>
          <span className="text-emerald-500 font-bold">➔</span>
          <div className="text-center p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 block font-bold">3. VERIFY</span>
            <strong className="text-xs text-white">QR & Buyer Receipt</strong>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE GARMENT BATCHES TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 font-display">
              Export Garment Batches
            </h2>
            <p className="text-xs text-zinc-500">
              Open a batch to view its production journey, attached evidence, and Digital Product Passport.
            </p>
          </div>

          <button
            onClick={() => navigate('/batches')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-bold text-[11px]">
                <th className="pb-3">Batch Ref</th>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Buyer / Market</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-center">Traceability Readiness</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {batches.map((batch) => (
                <tr key={batch.batchNumber} className="hover:bg-zinc-50/80 transition-colors">
                  
                  {/* Batch Number */}
                  <td className="py-4 font-mono font-bold text-zinc-900">
                    <button
                      onClick={() => navigate(`/batches/${batch.batchNumber}`)}
                      className="hover:text-emerald-800 underline-offset-2 hover:underline text-left"
                    >
                      {batch.batchNumber}
                    </button>
                  </td>

                  {/* Product */}
                  <td className="py-4 font-bold text-zinc-900">
                    <div>{batch.productName}</div>
                    <span className="text-[11px] text-zinc-400 font-normal">{batch.styleCode || 'TS-26-ORG-01'}</span>
                  </td>

                  {/* Buyer */}
                  <td className="py-4">
                    <div className="font-semibold text-zinc-800">{batch.buyerName || 'ABC Fashion GmbH'}</div>
                    <span className="text-[11px] text-zinc-400">{batch.targetCountry || 'Germany'}</span>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 text-right font-bold text-zinc-900">
                    {batch.quantity ? batch.quantity.toLocaleString() : '5,000'} pcs
                  </td>

                  {/* Readiness Indicator */}
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      (batch.readinessScore || 86) >= 80 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{batch.readinessScore || 86}/100 ({batch.readinessStatus || 'READY'})</span>
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 text-center">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                      {batch.status || 'PASSPORT_READY'}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 text-right">
                    <button
                      onClick={() => navigate(`/batches/${batch.batchNumber}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px] transition-all shadow-xs"
                    >
                      <span>Open Batch</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. EXPORT SHIPMENTS & RECEIVER CONFIRMATIONS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 font-display flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span>Export Shipments & Receiver Deliveries</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Track receiver inward delivery confirmations. Discrepancies are logged in an immutable audit trail.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-bold text-[11px]">
                <th className="pb-3">Shipment Ref</th>
                <th className="pb-3">Batch Number</th>
                <th className="pb-3">Receiver / Importer</th>
                <th className="pb-3 text-right">Expected Units</th>
                <th className="pb-3 text-right">Confirmed Units</th>
                <th className="pb-3 text-center">Receiver Status</th>
                <th className="pb-3 text-right">Receiver Confirmation Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {shipments.map((shipment) => (
                <tr key={shipment.shipmentNumber} className="hover:bg-zinc-50/80 transition-colors">
                  
                  <td className="py-4 font-mono font-bold text-zinc-900">
                    {shipment.shipmentNumber}
                  </td>

                  <td className="py-4 font-mono text-zinc-600">
                    {shipment.batchNumber}
                  </td>

                  <td className="py-4 font-bold text-zinc-800">
                    {shipment.receiverName}
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
                        <span>Discrepancy Reported</span>
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
                      <span>Receiver Link</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPORT DOCUMENTATION MODAL */}
      <ExportChecklistModal
        isOpen={!!checklistShipment}
        onClose={() => setChecklistShipment(null)}
        shipment={checklistShipment}
        batchNumber={checklistShipment?.batchNumber || 'VS-2026-B00041'}
      />

    </div>
  );
}
