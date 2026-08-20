import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ESGReportModal } from '../components/ESGReportModal';
import { 
  BarChart3, 
  Leaf, 
  Droplets, 
  ShieldCheck, 
  Download, 
  Building2, 
  Globe2, 
  CheckCircle2,
  Calendar,
  Layers,
  FlaskConical,
  Award
} from 'lucide-react';

export function AnalyticsPage({ navigate }) {
  const { analytics, batches } = useApp();
  const [showEsgModal, setShowEsgModal] = useState(false);

  const totalBatches = batches.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sustainability Impact</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
            Sustainability Impact
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Your verified environmental record across all export batches.
          </p>
        </div>

        <button
          onClick={() => setShowEsgModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download ESG Report</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">CO₂e Tracked</span>
          <span className="text-3xl font-extrabold text-brand-900 font-display block">
            4.8 <span className="text-sm font-normal text-zinc-500">tonnes</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">↓ 18% vs conventional</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 block">Water Recycled</span>
          <span className="text-3xl font-extrabold text-cyan-900 font-display block">
            2.4M <span className="text-sm font-normal text-zinc-500">L</span>
          </span>
          <span className="text-[11px] text-cyan-700 font-semibold block">92% ZLD recovery</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Verified Batches</span>
          <span className="text-3xl font-extrabold text-zinc-900 font-display block">
            32
          </span>
          <span className="text-[11px] text-zinc-500 block">Passports issued</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">DPP Readiness</span>
          <span className="text-3xl font-extrabold text-brand-700 font-display block">
            87%
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">ESPR 2026 Ready</span>
        </div>

      </div>

      {/* Supply Chain Performance & Export Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Supply Chain Performance */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-zinc-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-700" />
            <span>Supply Chain Performance</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-500 text-xs block">Dyeing Partners</span>
              <strong className="text-2xl font-extrabold text-zinc-900 font-display block">8</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">OEKO-TEX Certified</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-500 text-xs block">CETP Facilities</span>
              <strong className="text-2xl font-extrabold text-zinc-900 font-display block">3</strong>
              <span className="text-[10px] text-cyan-700 font-semibold">100% ZLD Cleared</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-500 text-xs block">Verified Batches</span>
              <strong className="text-2xl font-extrabold text-zinc-900 font-display block">32</strong>
              <span className="text-[10px] text-brand-700 font-semibold">Polygon Anchored</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <span className="text-zinc-500 text-xs block">Certificates</span>
              <strong className="text-2xl font-extrabold text-zinc-900 font-display block">94</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">Audited on-chain</span>
            </div>
          </div>
        </div>

        {/* Right: Export Destinations */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-zinc-900 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-brand-700" />
            <span>Export Destination Markets (EU/UK)</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { country: 'Germany', percentage: 45, batches: 14 },
              { country: 'Netherlands', percentage: 25, batches: 8 },
              { country: 'United Kingdom', percentage: 20, batches: 6 },
              { country: 'Sweden', percentage: 10, batches: 4 },
            ].map((dest) => (
              <div key={dest.country} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-zinc-700">
                  <span>{dest.country}</span>
                  <span className="font-bold text-brand-900">{dest.percentage}% ({dest.batches} batches)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-700 h-full rounded-full" 
                    style={{ width: `${dest.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ESG Report Modal */}
      {showEsgModal && (
        <ESGReportModal
          isOpen={showEsgModal}
          onClose={() => setShowEsgModal(false)}
          analytics={analytics}
          batches={batches}
        />
      )}

    </div>
  );
}
