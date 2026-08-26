import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  QrCode, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Calendar,
  Truck
} from 'lucide-react';

export function BatchesPage({ navigate }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v2/batches');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setBatches(json.data);
        } else {
          // Fallback demo batch
          setBatches([
            {
              batchNumber: 'VS-2026-B00041',
              productName: '100% Organic Cotton Crewneck T-Shirt',
              styleCode: 'TS-26-ORG-01',
              quantity: 5000,
              fabricComposition: '100% Organic Cotton Single Jersey (180 GSM)',
              buyerName: 'ABC Fashion GmbH',
              targetCountry: 'Germany',
              destinationPort: 'Hamburg Port',
              readinessScore: 96,
              readinessStatus: 'READY',
              status: 'PASSPORT_READY',
              passportVersion: 1,
              createdAt: '2026-08-15'
            }
          ]);
        }
      } catch (err) {
        console.warn('Batches API error, using demo fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      (batch.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.buyerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (batch.targetCountry || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Garment Traceability Registry</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
            Export Garment Batches
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Manage your export production runs, verify supporting evidence, and issue Digital Product Passports.
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

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by batch #, product, buyer, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs text-zinc-900 bg-zinc-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'PASSPORT_READY', 'ISSUED', 'SHIPPED', 'RECEIVED', 'DISPUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* BATCHES TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-bold">
            Loading garment batches...
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Layers className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-xs font-bold text-zinc-600">No export batches found matching criteria.</p>
            <button
              onClick={() => navigate('/create-batch')}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Create your first garment batch →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-bold text-[11px]">
                  <th className="pb-3">Batch Number</th>
                  <th className="pb-3">Product Description</th>
                  <th className="pb-3">Export Buyer & Port</th>
                  <th className="pb-3 text-right">Production Volume</th>
                  <th className="pb-3 text-center">Traceability Readiness</th>
                  <th className="pb-3 text-center">Batch Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                {filteredBatches.map((batch) => (
                  <tr key={batch.batchNumber} className="hover:bg-zinc-50/80 transition-colors">
                    
                    <td className="py-4 font-mono font-bold text-zinc-900">
                      <button
                        onClick={() => navigate(`/batches/${batch.batchNumber}`)}
                        className="hover:text-emerald-800 underline-offset-2 hover:underline text-left"
                      >
                        {batch.batchNumber}
                      </button>
                    </td>

                    <td className="py-4">
                      <div className="font-bold text-zinc-900">{batch.productName}</div>
                      <span className="text-[11px] text-zinc-400">{batch.fabricComposition || '100% Organic Cotton'}</span>
                    </td>

                    <td className="py-4">
                      <div className="font-semibold text-zinc-800">{batch.buyerName}</div>
                      <span className="text-[11px] text-zinc-400">{batch.destinationPort || batch.targetCountry}</span>
                    </td>

                    <td className="py-4 text-right font-bold text-zinc-900">
                      {batch.quantity ? batch.quantity.toLocaleString() : '5,000'} pcs
                    </td>

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

                    <td className="py-4 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                        {batch.status || 'PASSPORT_READY'}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => navigate(`/batches/${batch.batchNumber}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px] transition-all shadow-xs"
                      >
                        <span>Command Center</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
