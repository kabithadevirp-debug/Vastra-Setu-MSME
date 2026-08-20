import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { BatchPipelineStepper } from '../components/BatchPipelineStepper';
import { HangtagPrintModal } from '../components/HangtagPrintModal';
import { 
  Plus, 
  Search, 
  QrCode, 
  ExternalLink, 
  ArrowRight, 
  Printer, 
  ShieldCheck, 
  Leaf, 
  Droplets,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export function DashboardPage({ navigate }) {
  const { batches, loading, analytics, setCurrentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPrintBatch, setSelectedPrintBatch] = useState(null);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.garmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.orderRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'IN_PROGRESS' && batch.status !== 'PASSPORT_GENERATED') ||
      (statusFilter === 'PASSPORT_READY' && batch.status === 'PASSPORT_GENERATED');

    return matchesSearch && matchesStatus;
  });

  const totalBatches = batches.length;
  const issuedPassports = batches.filter(b => b.passport).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
            <span>Sustainability Command Center</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
            Good morning, Exporter
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Track your garment batches, compliance and sustainability data.
          </p>
        </div>

        <button
          onClick={() => navigate('/create-batch')}
          className="px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Batch</span>
        </button>
      </div>

      {/* 5 Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Active Batches</span>
          <span className="text-3xl font-extrabold text-zinc-900 font-display block">
            12
          </span>
          <span className="text-[10px] text-zinc-400">Tiruppur Cluster</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 block">Passports Issued</span>
          <span className="text-3xl font-extrabold text-brand-700 font-display block">
            08
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Export</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">CO₂e Tracked</span>
          <span className="text-3xl font-extrabold text-zinc-900 font-display block">
            4.8 <span className="text-sm font-normal text-zinc-500">t</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">↓ 18% vs baseline</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Water Recycled</span>
          <span className="text-3xl font-extrabold text-cyan-900 font-display block">
            2.4M <span className="text-sm font-normal text-zinc-500">L</span>
          </span>
          <span className="text-[10px] text-cyan-700 font-semibold">92% ZLD Recovery</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">EU DPP Readiness</span>
          <span className="text-3xl font-extrabold text-emerald-800 font-display block">
            87%
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">ESPR 2026 Ready</span>
        </div>

      </div>

      {/* 2-Column Section: Batch Pipeline (8 cols) + Compliance & Recent Activity (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (8 Cols): Batch Pipeline */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-lg text-zinc-900">Batch Pipeline</h2>
              <p className="text-xs text-zinc-500">Track active batches progressing through supplier verifications.</p>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'PASSPORT_READY', label: 'Passport Ready' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Batches Cards */}
          <div className="space-y-3">
            {filteredBatches.map((batch) => {
              const hasPassport = !!batch.passport;

              return (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-card-hover transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                        {batch.id}
                      </span>
                      <h3 className="font-display font-bold text-sm text-zinc-900">{batch.garmentTitle}</h3>
                      <span className="text-zinc-300 text-xs">•</span>
                      <span className="text-xs text-zinc-500">
                        {batch.quantity.toLocaleString()} pcs • {batch.targetCountry}
                      </span>
                    </div>

                    <StatusBadge status={batch.status} size="sm" />
                  </div>

                  {/* 5-Stage Stepper */}
                  <div className="px-2">
                    <BatchPipelineStepper batch={batch} />
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 text-xs border-t border-zinc-100">
                    <span className="text-zinc-500 text-[11px]">
                      Buyer: <strong>{batch.buyerName}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/batches/${batch.id}`)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs flex items-center gap-1"
                      >
                        <span>View Batch Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>

                      {hasPassport && (
                        <button
                          onClick={() => navigate(`/verify/${batch.passport.id}`)}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>View Passport</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right (4 Cols): EU Compliance Readiness + Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* EU Compliance Readiness Card */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-display font-bold text-sm text-zinc-900">EU DPP Readiness</h3>
              <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                87%
              </span>
            </div>

            <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87%' }}></div>
            </div>

            <div className="space-y-2 text-xs text-zinc-700">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Product Identity & Style Specs</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Material & Fiber Composition</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supply Chain Partner Traceability</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Environmental & LCA Footprint</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Audited Compliance Certificates</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Circularity & End-of-Life Guidance</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-zinc-900">Recent Activity</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CETP data verified</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">2 min ago</span>
                </div>
                <p className="text-zinc-500 text-[11px]">Batch VS-2026-0042 • 92% Water Recycled</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>OEKO-TEX cert uploaded</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">15 min ago</span>
                </div>
                <p className="text-zinc-500 text-[11px]">Batch VS-2026-0041 • Rainbow Eco-Dyers</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
