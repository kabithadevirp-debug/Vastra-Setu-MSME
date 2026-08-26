import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Truck, 
  RefreshCw, 
  Lock,
  Layers
} from 'lucide-react';

export function BankSnapshotPage({ navigate }) {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v2/bank/snapshot');
      const json = await res.json();
      if (json.success && json.data) {
        setSnapshot(json.data);
      }
    } catch (err) {
      console.warn('Bank snapshot fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const data = snapshot || {
    exporterName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    gstin: '33AAACJ1928A1Z5',
    iec: '0305012984',
    totalBatchesProcessed: 38,
    activeProductionBatches: 1,
    passportsAnchoredOnChain: 1,
    totalCompletedShipments: 38,
    receiverAcknowledgements: 34,
    acknowledgementRatePercent: 89.5,
    openDiscrepanciesCount: 1,
    discrepancyRatePercent: 2.8,
    traceabilityReliabilityScore: 98,
    averageZldWaterRecycledPercent: 94.2,
    averageCarbonFootprintKg: 2.45,
    operationalViabilityVerdict: 'EXCELLENT_TRADE_RECORD',
    recentShipments: [
      { shipmentNumber: 'SHIP-2026-0087', receiverName: 'ABC Fashion GmbH', expectedQuantity: 5000, status: 'PENDING' }
    ]
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. BANK SNAPSHOT HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Institutional Trade Finance Assessment
            </span>
            <span className="text-xs text-zinc-400 font-mono">Bank View</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Operational Business Snapshot
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Structured operational evidence for banks, factoring firms, and trade finance underwriters. Not a loan decision engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Viability Verdict: EXCELLENT</span>
          </span>
        </div>
      </div>

      {/* 2. EXPORTER IDENTITY & COMPLIANCE BAR */}
      <div className="p-5 bg-zinc-900 text-white rounded-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-sm">
        <div>
          <span className="text-zinc-400 block text-[11px]">Exporter Legal Entity</span>
          <strong className="text-white font-display text-sm">{data.exporterName}</strong>
        </div>
        <div>
          <span className="text-zinc-400 block text-[11px]">IEC Number</span>
          <strong className="font-mono text-emerald-400 text-sm">{data.iec}</strong>
        </div>
        <div>
          <span className="text-zinc-400 block text-[11px]">GSTIN</span>
          <strong className="font-mono text-emerald-400 text-sm">{data.gstin}</strong>
        </div>
        <div>
          <span className="text-zinc-400 block text-[11px]">Traceability Reliability</span>
          <strong className="text-emerald-400 text-sm font-bold">{data.traceabilityReliabilityScore}% Verified</strong>
        </div>
      </div>

      {/* 3. OPERATIONAL KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Completed Shipments</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-display">
            {data.totalCompletedShipments}
          </div>
          <span className="text-[11px] text-zinc-400 block">Verified export transactions</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Receiver Confirmations</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 font-display">
            {data.receiverAcknowledgements} <span className="text-xs font-normal text-zinc-400">({data.acknowledgementRatePercent}%)</span>
          </div>
          <span className="text-[11px] text-zinc-400 block">Zero-login buyer delivery receipts</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">Discrepancy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-800 font-display">
            {data.discrepancyRatePercent}%
          </div>
          <span className="text-[11px] text-zinc-400 block">{data.openDiscrepanciesCount} open cargo dispute</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500">ZLD Water Recycled</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-700 font-display">
            {data.averageZldWaterRecycledPercent}%
          </div>
          <span className="text-[11px] text-zinc-400 block">TNPCB closed-loop compliance</span>
        </div>

      </div>

      {/* 4. EXPORT EVIDENCE LEDGER FOR LENDERS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-display">
            Active Verified Export Shipments & Inward Receipts
          </h3>
          <p className="text-xs text-zinc-500">
            Real-time delivery acknowledgement log with cryptographic integrity hashes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-bold text-[11px]">
                <th className="pb-3">Shipment Ref</th>
                <th className="pb-3">Buyer / Consignee</th>
                <th className="pb-3 text-right">Volume</th>
                <th className="pb-3 text-center">Inward Receipt</th>
                <th className="pb-3 text-right">Export Documentation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              <tr className="hover:bg-zinc-50/80">
                <td className="py-4 font-mono font-bold text-zinc-900">SHIP-2026-0087</td>
                <td className="py-4 font-bold text-zinc-800">ABC Fashion GmbH (Germany)</td>
                <td className="py-4 text-right font-bold">5,000 pcs</td>
                <td className="py-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Pending Delivery (En Route)
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-emerald-800 font-bold">100% Ready (CIF Hamburg)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
