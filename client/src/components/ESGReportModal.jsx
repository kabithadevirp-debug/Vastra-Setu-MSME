import React from 'react';
import { X, Download, ShieldCheck, Leaf, Droplets, Building2, Award, FileText, CheckCircle2 } from 'lucide-react';

export function ESGReportModal({ isOpen, onClose, analytics, batches }) {
  if (!isOpen) return null;

  const exporter = analytics?.exporter || {
    name: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    udyamNumber: 'UDYAM-TN-28-0019284',
    location: 'Avinashi Road, Tiruppur, Tamil Nadu, India',
    established: 2008,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-200 border border-brand-400/30">
                Official ESG Sustainability Report
              </span>
              <span className="text-xs text-brand-200/80 font-mono">2026 Audit Period</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white">
              {exporter.name}
            </h2>
            <p className="text-xs text-brand-200/90">
              {exporter.location} • Udyam: <strong className="text-white font-mono">{exporter.udyamNumber}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-zinc-700">
          
          {/* Executive Summary */}
          <div className="p-4 bg-brand-50/50 rounded-2xl border border-brand-100 space-y-2">
            <h3 className="font-bold text-sm text-brand-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>Executive ESG & EU DPP Compliance Summary</span>
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              This document serves as the audited Environmental, Social, and Governance (ESG) statement for textile export shipments to European Union and United Kingdom buyers, generated in compliance with the EU Ecodesign for Sustainable Products Regulation (ESPR 2026) and Digital Product Passport mandates.
            </p>
          </div>

          {/* Key Environmental Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total CO₂e Tracked</span>
              <strong className="text-xl font-extrabold text-brand-900 font-display block">4.8 tonnes</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block">↓ 18% vs Baseline</span>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Water Recycled</span>
              <strong className="text-xl font-extrabold text-cyan-900 font-display block">2.4M Litres</strong>
              <span className="text-[10px] text-cyan-700 font-semibold block">92% ZLD Recovery</span>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">DPP Readiness</span>
              <strong className="text-xl font-extrabold text-brand-700 font-display block">87%</strong>
              <span className="text-[10px] text-emerald-600 font-semibold block">ESPR Compliant</span>
            </div>

            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Verified Batches</span>
              <strong className="text-xl font-extrabold text-zinc-900 font-display block">32</strong>
              <span className="text-[10px] text-zinc-500 block">Passports Active</span>
            </div>
          </div>

          {/* Supply Chain & Certifications */}
          <div className="space-y-3">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Audited Supply Chain Partners & Facilities
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 block">Rainbow Eco-Dyers Tiruppur</strong>
                  <span className="text-[11px] text-zinc-500">Wet Processing • OEKO-TEX Standard 100 Class I & ZDHC MRSL Level 3</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Verified Partner
                </span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 block">Arulpuram Common Effluent Treatment Plant (Unit 3)</strong>
                  <span className="text-[11px] text-zinc-500">Closed-Loop ZLD • 92% Process Water Recycled • Multi-Effect Evaporator</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                  ✓ ZLD Cleared
                </span>
              </div>
            </div>
          </div>

          {/* Export Markets */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Export Destination Coverage
            </h4>
            <p className="text-zinc-500 text-[11px]">
              Germany (45%), Netherlands (25%), United Kingdom (20%), Sweden (10%). All garments shipped with attached QR hangtags linked to the VastraSetu Digital Product Passport ledger.
            </p>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-zinc-400 font-mono text-[10px]">
            <span>Report ID: ESG-VS-2026-TPR-084</span>
            <span>Cryptographically Verified on Polygon Environmental Ledger</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">Generated by VastraSetu DPP Platform</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
