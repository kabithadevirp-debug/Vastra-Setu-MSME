import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Leaf, 
  Droplets, 
  Award, 
  Layers, 
  Building2, 
  FlaskConical, 
  Ship, 
  FileCheck2, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  ThermometerSnowflake, 
  SunMedium, 
  HelpCircle
} from 'lucide-react';

export function PublicVerifyPage({ passportId, navigate }) {
  const { batches } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCert, setActiveCert] = useState(null);

  const batch = batches.find(b => (b.passport && b.passport.id === passportId) || b.id === passportId) || 
                batches.find(b => b.passport) || 
                batches[0];

  const passport = batch?.passport;

  if (!batch || !passport) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-zinc-900">Passport Record Not Found</h2>
        <p className="text-xs text-zinc-500">
          The requested QR passport ID <strong>{passportId}</strong> is either invalid or still undergoing supplier verification.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold"
        >
          Go to VastraSetu Overview
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20">
      
      {/* Top Apple-style Verification Trust Banner */}
      <div className="bg-white border-b border-zinc-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>✓ VERIFIED PRODUCT</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
            {batch.garmentTitle}
          </h1>
          <p className="text-xs text-zinc-500">
            Batch <strong>{batch.id}</strong> • Tiruppur, India → {batch.targetCountry}
          </p>
          <p className="text-[11px] text-zinc-400">
            This Digital Product Passport has been verified on VastraSetu Environmental Ledger.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Traceability Flow Bar */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            Supply Chain Route
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-800">
            <span className="bg-zinc-100 px-3 py-1.5 rounded-lg">Tiruppur (Origin)</span>
            <span className="text-zinc-300">→</span>
            <span className="bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-lg">Rainbow Eco-Dyers</span>
            <span className="text-zinc-300">→</span>
            <span className="bg-cyan-50 text-cyan-900 px-3 py-1.5 rounded-lg">Arulpuram CETP (ZLD)</span>
            <span className="text-zinc-300">→</span>
            <span className="bg-zinc-100 px-3 py-1.5 rounded-lg">Port of Hamburg</span>
            <span className="text-zinc-300">→</span>
            <span className="bg-brand-50 text-brand-900 px-3 py-1.5 rounded-lg">{batch.targetCountry}</span>
          </div>
        </div>

        {/* Clean Tabs */}
        <div className="flex border-b border-zinc-200 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'traceability', label: 'Traceability' },
            { id: 'environmental', label: 'Environmental' },
            { id: 'certificates', label: 'Certificates' },
            { id: 'care', label: 'Care & Circularity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white shadow-sm font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              Garment Specifications & Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Product Identity</span>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">Style / SKU Code:</span>
                  <strong className="font-mono text-zinc-900">{batch.styleCode}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">Order PO Number:</span>
                  <strong className="font-mono text-zinc-900">{batch.orderRef}</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">Fabric Composition:</span>
                  <strong className="text-zinc-900">{batch.fabricDescription}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fabric Weight:</span>
                  <strong className="text-zinc-900">{batch.weightGsm} GSM</strong>
                </div>
              </div>

              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Exporter & Hub</span>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">Manufacturer:</span>
                  <strong className="text-zinc-900">Sri Jayavarma Knits & Exports</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">MSME Udyam Registration:</span>
                  <strong className="font-mono text-zinc-900">UDYAM-TN-28-0019284</strong>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500">Location:</span>
                  <strong className="text-zinc-900">Tiruppur, Tamil Nadu, India</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Compliance Status:</span>
                  <strong className="text-emerald-700 font-bold">100% EU DPP Ready ✓</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Traceability */}
        {activeTab === 'traceability' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              Verified Data Provenance
            </h3>

            <div className="space-y-3">
              {[
                { stage: '1. Organic Cotton Farm', entity: 'Vidarbha Cotton Gin Cluster', cert: 'GOTS Organic v7.0', submittedBy: 'Coimbatore Spinning Mill', date: '14 Aug 2026' },
                { stage: '2. Yarn Spinning & Knitting', entity: batch.yarnSpinningMill, cert: 'CU-841920 Verified', submittedBy: 'Sri Jayavarma Knits', date: '16 Aug 2026' },
                { stage: '3. Wet Processing & Dyeing', entity: batch.dyerName, cert: 'OEKO-TEX Class I (OEKO-98442)', submittedBy: 'Rainbow Eco-Dyers', date: '18 Aug 2026' },
                { stage: '4. Effluent Treatment (ZLD)', entity: batch.cetpName, cert: '92% Water Recycled (TNPCB ZLD)', submittedBy: 'Arulpuram CETP Facility', date: '19 Aug 2026' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-brand-900 block">{item.stage}</span>
                    <p className="text-zinc-700">{item.entity}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold block">{item.cert}</span>
                  </div>
                  <div className="text-right text-[11px] text-zinc-400 shrink-0">
                    <span className="text-zinc-700 font-medium block">Submitted by {item.submittedBy}</span>
                    <span>Verified: {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Environmental */}
        {activeTab === 'environmental' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              Verified Environmental Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-800 block">Carbon Footprint</span>
                <span className="text-3xl font-extrabold text-brand-900 font-display block">2.84 t CO₂e</span>
                <span className="text-emerald-700 font-semibold block">↓ 18% below conventional baseline</span>
                <div className="pt-2 text-[11px] text-zinc-500 border-t border-brand-100">
                  Data provenance: Calculated via ISO 14067 LCA model
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-800 block">Water Recovery</span>
                <span className="text-3xl font-extrabold text-cyan-900 font-display block">92% Recycled</span>
                <span className="text-cyan-700 font-semibold block">186,400 L closed-loop reuse</span>
                <div className="pt-2 text-[11px] text-zinc-500 border-t border-cyan-100">
                  Submitted by Arulpuram CETP • Verified 20 Aug 2026
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Certificates */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              Audited Compliance Certificates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'gots', title: 'GOTS Organic Textile Standard', desc: '100% Certified Organic Cotton', num: 'CU-841920-GOTS-2026' },
                { type: 'oeko', title: 'OEKO-TEX® Standard 100', desc: 'Class I Baby-Safe Chemical Clearance', num: 'OEKO-2026-TX-98442' },
                { type: 'zdhc', title: 'ZDHC MRSL Level 3', desc: 'Zero Discharge of Hazardous Chemicals', num: 'ZDHC-IN-2026-MRSL-441' },
                { type: 'zld', title: 'TNPCB Zero Liquid Discharge', desc: '92% Closed Loop Water Recovery', num: 'TNPCB-CETP-ZLD-8842' },
              ].map((c) => (
                <div key={c.type} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">✓ Audited & Active</span>
                    <strong className="text-sm font-display text-zinc-900 block mt-0.5">{c.title}</strong>
                    <p className="text-xs text-zinc-500 mt-0.5">{c.desc}</p>
                    <span className="font-mono text-[10px] text-zinc-400 block mt-1">ID: {c.num}</span>
                  </div>

                  <button
                    onClick={() => setActiveCert(c.type)}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Care & Circularity */}
        {activeTab === 'care' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-zinc-900">
              Garment Care & Circularity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-center">
                <ThermometerSnowflake className="w-6 h-6 text-brand-700 mx-auto" />
                <strong className="text-zinc-900 block">Wash Cold at 30°C</strong>
                <p className="text-zinc-500 text-[11px]">Saves up to 60% consumer lifecycle energy.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-center">
                <SunMedium className="w-6 h-6 text-amber-600 mx-auto" />
                <strong className="text-zinc-900 block">Line Dry in Shade</strong>
                <p className="text-zinc-500 text-[11px]">Preserves organic fibers without tumble heat.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-center">
                <RefreshCw className="w-6 h-6 text-emerald-700 mx-auto" />
                <strong className="text-zinc-900 block">100% Circular Design</strong>
                <p className="text-zinc-500 text-[11px]">Monomaterial organic cotton ready for textile-to-textile recycling.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal
          certType={activeCert}
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          batch={batch}
        />
      )}

    </div>
  );
}
