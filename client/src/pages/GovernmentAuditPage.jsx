import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Factory, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Lock
} from 'lucide-react';

export function GovernmentAuditPage({ navigate }) {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v2/government/audit-view');
      const json = await res.json();
      if (json.success && json.data) {
        setAuditData(json.data);
      }
    } catch (err) {
      console.warn('Audit fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const data = auditData || {
    exporterLegalEntity: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    pan: 'AAACJ1928A',
    iec: '0305012984',
    gstin: '33AAACJ1928A1Z5',
    udyamNumber: 'UDYAM-TN-32-0019284',
    industrialCluster: 'Tiruppur Textile Cluster, Tamil Nadu',
    pollutionControlBoardStatus: 'TNPCB 100% ZLD Consent Order ACTIVE',
    zeroLiquidDischargeCompliance: '100% Closed Loop Water Recovery',
    blockchainAnchorStatus: 'Polygon Amoy PoS Public Testnet Verified'
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. GOVT AUDIT HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Regulatory Compliance & Traceability Inspection
            </span>
            <span className="text-xs text-zinc-400 font-mono">Authorized Inspector View</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Government Compliance & Environmental Audit
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Cryptographically integrity-protected ledger of exporter registrations, environmental consents, and production evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>Polygon PoS Anchored</span>
          </span>
        </div>
      </div>

      {/* 2. REGISTRATION & ENVIRONMENTAL CLEARANCE OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Registration Card */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-zinc-900 font-display">Exporter Statutory Registrations</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between bg-zinc-50 p-2.5 rounded-xl">
              <span className="text-zinc-400 font-sans">Legal Entity:</span>
              <strong className="text-zinc-900 font-sans">{data.exporterLegalEntity}</strong>
            </div>
            <div className="flex justify-between bg-zinc-50 p-2.5 rounded-xl">
              <span className="text-zinc-400 font-sans">IEC Number:</span>
              <strong className="text-emerald-800">{data.iec}</strong>
            </div>
            <div className="flex justify-between bg-zinc-50 p-2.5 rounded-xl">
              <span className="text-zinc-400 font-sans">GSTIN:</span>
              <strong className="text-emerald-800">{data.gstin}</strong>
            </div>
            <div className="flex justify-between bg-zinc-50 p-2.5 rounded-xl">
              <span className="text-zinc-400 font-sans">Udyam Registration:</span>
              <strong className="text-zinc-900">{data.udyamNumber}</strong>
            </div>
          </div>
        </div>

        {/* Environmental & ZLD Card */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Factory className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-zinc-900 font-display">Environmental Consent & ZLD Clearance</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-950 font-bold">TNPCB Consent Order</strong>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">ACTIVE</span>
              </div>
              <p className="text-[11px] text-emerald-900 font-mono">Consent Ref: TNPCB-ZLD-2026-8812 (Valid until 2026-09-30)</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-zinc-400 block text-[11px]">Water Recovery</span>
                <strong className="text-emerald-800 text-sm">94.2% Closed Loop</strong>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-zinc-400 block text-[11px]">Treatment Standard</span>
                <strong className="text-zinc-900 text-sm">100% ZLD Mandate</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. BATCH TRACEABILITY AUDIT LEDGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-display">
            Active Batch Production & Export Traceability Log
          </h3>
          <p className="text-xs text-zinc-500">
            Production volumes, material weights, and supporting certificate hashes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-bold font-sans text-[11px]">
                <th className="pb-3">Batch Reference</th>
                <th className="pb-3">Product Description</th>
                <th className="pb-3 text-right">Volume</th>
                <th className="pb-3 text-center">Material Origin</th>
                <th className="pb-3 text-right">Passport Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              <tr className="hover:bg-zinc-50/80">
                <td className="py-4 font-bold text-zinc-900">VS-2026-B00041</td>
                <td className="py-4 font-sans font-bold text-zinc-800">100% Organic Cotton Crewneck T-Shirt</td>
                <td className="py-4 text-right font-bold">5,000 pcs</td>
                <td className="py-4 text-center font-sans">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    GOTS Organic Fiber (1,150 kg)
                  </span>
                </td>
                <td className="py-4 text-right text-zinc-500 truncate max-w-[150px]">
                  1b9a48ce61022f79...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
