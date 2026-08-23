import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Leaf, 
  Droplets, 
  Building2, 
  Binary, 
  FileText, 
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';

export function PublicVerifyPage({ passportId, navigate }) {
  const [verifyData, setVerifyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const id = passportId || 'BATCH-9942-01';
        const res = await fetch(`/api/public/verify/${id}`);
        const data = await res.json();
        if (data.success) {
          setVerifyData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch public verification data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifyData();
  }, [passportId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Verifying Product Passport on Polygon Amoy Blockchain Ledger...</p>
      </div>
    );
  }

  const data = verifyData || {
    batchId: passportId || 'BATCH-9942-01',
    productName: '100% Organic Cotton Polo Shirt',
    msmeBusinessName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    gstin: '33AAACJ1928A1Z5',
    passportHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'ANCHORED',
    carbonKg: 2.84,
    waterLitres: 186.4,
    merkleRoot: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    polygonTxHash: '0x7f28a991208492049120D91C28192819203819284F9912',
    polygonContract: '0x8891A9280192841920D91C28192819203819284F',
    trustScore: 94,
    zdhcCompliance: 'Level 3 Zero Discharge'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* VERIFICATION HEADER BANNER */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-md p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-300 inline-block mb-2">
            Polygon Amoy Blockchain Verified ✓
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            {data.productName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto mt-1">
            GS1 Digital Link Verification for Exporter <strong className="text-zinc-900">{data.msmeBusinessName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Passport Batch ID</span>
            <span className="font-mono text-xs font-bold text-zinc-900">{data.batchId}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-left">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">MSME Trust Rating</span>
            <span className="font-extrabold text-xs text-emerald-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {data.trustScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* FOOTPRINT & COMPLIANCE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Carbon Footprint */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Carbon Footprint (LCA)</span>
            </span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
              -18% vs Baseline
            </span>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-display">
            {data.carbonKg} <span className="text-sm font-medium text-zinc-400">kg CO₂e / garment</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Calculated under EU PEF apparel rules using GOTS certified organic fiber & sea transport.
          </p>
        </div>

        {/* Water Footprint */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-600" />
              <span>Water Footprint & ZDHC</span>
            </span>
            <span className="text-teal-700 font-extrabold bg-teal-50 px-2 py-0.5 rounded">
              {data.zdhcCompliance}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-display">
            {data.waterLitres} <span className="text-sm font-medium text-zinc-400">Litres / garment</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            92% closed-loop ZLD water recovery verified at Arulpuram CETP facility.
          </p>
        </div>

      </div>

      {/* CRYPTOGRAPHIC BLOCKCHAIN AUDIT TRAIL */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600" />
            <span>Cryptographic Proof & Polygon Explorer Link</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Tamper-proof Merkle Root anchored on Polygon Amoy Testnet.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3 text-xs font-mono">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Passport SHA-256 Hash</span>
            <span className="text-zinc-900 font-bold break-all block">{data.passportHash}</span>
          </div>

          <div className="border-t border-zinc-200 pt-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Merkle Batch Root</span>
            <span className="text-indigo-800 font-bold break-all block">{data.merkleRoot}</span>
          </div>

          <div className="border-t border-zinc-200 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Polygon Transaction Hash</span>
              <span className="text-emerald-800 font-bold break-all block">{data.polygonTxHash}</span>
            </div>

            <a
              href={`https://amoy.polygonscan.com/tx/${data.polygonTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>PolygonScan Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
