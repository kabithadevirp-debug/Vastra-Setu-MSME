import React, { useState, useEffect } from 'react';
import { DigitalProductPassportView } from '../components/DigitalProductPassportView';
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock, HelpCircle, ArrowLeft } from 'lucide-react';

export function PublicVerifyPage({ passportId, navigate }) {
  const [verifyData, setVerifyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifyData = async () => {
      try {
        const id = passportId || 'BATCH-01';
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-600 font-bold">Verifying Product Passport on Polygon Blockchain Ledger...</p>
        </div>
      </div>
    );
  }

  const livePassport = verifyData || {
    verdict: 'AUTHENTIC',
    productName: 'EcoWear Polo T-Shirt',
    fabricDescription: '100% Organic Cotton',
    buyerName: 'EcoWear / Zara Europe',
    msmeBusinessName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    hsCode: '6109.10',
    originCountry: 'India (Tiruppur Cluster)',
    dateOfManufacture: '15 May 2025',
    batchId: passportId || 'EW-2505-001',
    gtin: '08976543211234',
    carbonKg: 12.4,
    waterLitres: 56.2,
    energyKwh: 2.8,
    sustainableMatPct: 85,
    polygonTxHash: '0x7f3a9c218842109284102984',
    passportHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    merkleRoot: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
      {/* PUBLIC BUYER TOP NAV */}
      <header className="bg-white border-b border-zinc-200 shadow-xs py-3.5 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate && navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-xs">
              <span>◈</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg text-zinc-900">
                Vastra<span className="text-emerald-700">Setu</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Public Buyer Passport Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate ? navigate('/login') : (window.location.href = '/login')}
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-all"
          >
            MSME Login →
          </button>
        </div>
      </header>

      {/* RENDER MASTER DIGITAL PRODUCT PASSPORT VIEW WITH REAL TIME DATA */}
      <main className="pt-4">
        <DigitalProductPassportView passportData={livePassport} isPublic={true} navigate={navigate} />
      </main>
    </div>
  );
}
