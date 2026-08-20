import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { BatchPipelineStepper } from '../components/BatchPipelineStepper';
import { 
  Plus, 
  Search, 
  Filter, 
  QrCode, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Leaf, 
  Droplets,
  ChevronRight
} from 'lucide-react';

export function BatchesPage({ navigate }) {
  const { batches, loading, setCurrentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.garmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.targetCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.orderRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Central Data Management</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
            Garment Batches
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Track every export batch from creation to passport issuance.
          </p>
        </div>

        <button
          onClick={() => navigate('/create-batch')}
          className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Batch</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Batch ID, garment, buyer, destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-zinc-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PENDING_DYER', label: 'Pending Dyer' },
            { id: 'PENDING_CETP', label: 'Pending CETP' },
            { id: 'PASSPORT_GENERATED', label: 'Passport Generated' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === item.id
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* Batch Cards Grid / List */}
      <div className="space-y-4">
        {filteredBatches.map((batch) => {
          return (
            <div
              key={batch.id}
              className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-card-hover transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs text-brand-900 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                    {batch.id}
                  </span>
                  <h3 className="font-display font-bold text-base text-zinc-900">{batch.garmentTitle}</h3>
                  <span className="text-zinc-300 text-xs">•</span>
                  <span className="text-xs text-zinc-500">
                    Buyer: <strong className="text-zinc-800">{batch.buyerName}</strong> ({batch.targetCountry})
                  </span>
                </div>

                <StatusBadge status={batch.status} size="sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 space-y-1 text-xs">
                  <div className="text-zinc-600">
                    Quantity: <strong className="text-zinc-900">{batch.quantity.toLocaleString()} pcs</strong> ({batch.weightGsm} GSM)
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    Created: {new Date(batch.createdAt).toLocaleDateString()} • Order: {batch.orderRef}
                  </div>
                </div>

                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-50/60 border border-brand-100 text-xs flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-brand-700" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Carbon</span>
                      <strong className="text-brand-900">2.84 t CO₂e</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-100 text-xs flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-cyan-700" />
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Water Recycled</span>
                      <strong className="text-cyan-900">186,400 L</strong>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={() => navigate(`/batches/${batch.id}`)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Batch Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
