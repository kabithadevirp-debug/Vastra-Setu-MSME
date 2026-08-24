import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DigitalProductPassportView } from '../components/DigitalProductPassportView';
import { QrCode, ArrowLeft } from 'lucide-react';

export function PassportViewPage({ batchId, navigate }) {
  const { batches = [] } = useApp() || {};
  const [livePassportData, setLivePassportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const foundBatch = batches.find(b => b.id === batchId || (b.passport && b.passport.id === batchId));

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const id = batchId || 'BATCH-01';
        const res = await fetch(`/api/passports/${id}`);
        const data = await res.json();
        if (data.success) {
          setLivePassportData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch passport details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [batchId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-500 font-medium">Loading Real-Time Digital Product Passport...</p>
      </div>
    );
  }

  const batch = livePassportData || foundBatch || {
    id: batchId || 'BATCH-01',
    productName: 'EcoWear Polo T-Shirt',
    fabricDescription: '100% Organic Cotton',
    buyerName: 'EcoWear / Zara Europe',
    msmeBusinessName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    hsCode: '6109.10',
    originCountry: 'India (Tiruppur Cluster)',
    dateOfManufacture: '15 May 2025',
    batchId: batchId || 'EW-2505-001',
    gtin: '08976543211234',
    carbonKg: 12.4,
    waterLitres: 56.2,
    energyKwh: 2.8,
    sustainableMatPct: 85,
    polygonTxHash: '0x7f3a9c218842109284102984',
    passport: {
      id: batchId || 'DPP-2025-00098765',
      polygonTxHash: '0x7f3a9c218842109284102984'
    }
  };

  return <DigitalProductPassportView batch={batch} passportData={batch} isPublic={false} navigate={navigate} />;
}
