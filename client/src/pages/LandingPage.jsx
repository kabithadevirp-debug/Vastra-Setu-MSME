import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  QrCode, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  FlaskConical, 
  Droplets,
  Ship,
  Sparkles, 
  Calculator,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function LandingPage({ navigate }) {
  const { setCurrentRole, batches } = useApp();
  const sampleBatch = batches.find(b => b.passport) || batches[0];
  const samplePassportId = sampleBatch?.passport?.id || 'DPP-VS-2026-00892';

  // Live Carbon Estimator state
  const [calcFiber, setCalcFiber] = useState('organic_cotton_blend');
  const [calcWeightGsm, setCalcWeightGsm] = useState(180);
  const [calcQuantity, setCalcQuantity] = useState(4000);
  const [calcDye, setCalcDye] = useState('low_impact_reactive');
  const [calcFreight, setCalcFreight] = useState('sea');

  // Dynamic live calculation
  const fiberEmissions = {
    organic_cotton_blend: 3.8,
    organic_cotton: 3.4,
    conventional_cotton: 8.4,
    modal_tencel: 4.1,
  };

  const dyeEmissions = {
    low_impact_reactive: 2.2,
    natural_plant: 1.2,
    standard_synthetic: 4.8,
  };

  const freightEmissions = {
    sea: 0.016,
    air: 0.520,
  };

  const pieceWeightKg = (calcWeightGsm / 1000) * 1.2; // approx piece weight
  const totalBatchWeightKg = pieceWeightKg * calcQuantity;
  const totalBatchTonnes = totalBatchWeightKg / 1000;

  const totalCarbonKg = (totalBatchWeightKg * fiberEmissions[calcFiber]) +
                        (totalBatchWeightKg * dyeEmissions[calcDye]) +
                        (totalBatchTonnes * 10800 * freightEmissions[calcFreight]) +
                        (totalBatchWeightKg * 0.95);

  const totalCarbonTonnes = (totalCarbonKg / 1000).toFixed(2);
  const totalWaterLiters = Math.round(totalBatchWeightKg * 2400 * 0.08); // 92% recycled

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-zinc-200">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EU DPP Ready • ESPR 2026 Mandate</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-[1.1]">
                EU DPP Ready. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-950 via-brand-700 to-brand-500">
                  Every Garment. Every Proof. One Passport.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                VastraSetu bridges Indian textile MSMEs with European fashion buyers. Generate tamper-proof Digital Product Passports with verified fiber origin, low-impact dyeing specs, and CETP Zero Liquid Discharge water clearance.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentRole('msme');
                    navigate('/dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Launch Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/passport/${sampleBatch.id}`)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs border border-zinc-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <QrCode className="w-4 h-4 text-brand-700" />
                  <span>Explore Digital Passport</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>EU DPP Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Supply Chain Traceability</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Sustainability Data</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Passport Card Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                <div className="bg-white rounded-3xl shadow-passport border border-brand-900/10 overflow-hidden passport-border">
                  
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-extrabold text-xs tracking-wider uppercase">
                        Vastra<span className="text-brand-300">Setu</span>
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-200 border border-brand-400/30">
                        {samplePassportId}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white">
                      Organic Cotton Polo
                    </h3>
                    <p className="text-xs text-brand-200/80 mt-0.5">
                      Origin: Tiruppur, India • 4,000 pieces
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    
                    <div className="flex items-center gap-4 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                      <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-sm shrink-0">
                        <QRCodeSVG
                          value={`https://vastrasetu.vercel.app/verify/${samplePassportId}`}
                          size={76}
                          fgColor="#4C1D95"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-zinc-900 block">95% Organic Cotton / 5% Elastane</span>
                        <p className="text-zinc-500 text-[11px]">Buyer: Inditex / Zara (Germany)</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            ZLD Cleared
                          </span>
                          <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-800 text-[10px] font-bold border border-brand-200">
                            OEKO-TEX 100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
                        <span className="text-[10px] uppercase font-bold text-brand-800 block">Carbon</span>
                        <span className="text-xl font-extrabold text-brand-950 font-display">2.84 t</span>
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">↓ 18% below baseline</span>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-100">
                        <span className="text-[10px] uppercase font-bold text-cyan-800 block">Water</span>
                        <span className="text-xl font-extrabold text-cyan-950 font-display">186,400 L</span>
                        <span className="text-[10px] text-cyan-700 font-semibold block mt-0.5">92% Recycled (ZLD)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/verify/${samplePassportId}`)}
                      className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Simulate Public Buyer Scan</span>
                    </button>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 3-Step Explanation & Supply Chain Visualization */}
      <section className="py-16 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              3-Step Continuous Process
            </span>
            <h2 className="font-display font-extrabold text-3xl text-zinc-900">
              How VastraSetu Powers Export Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-3">
              <span className="text-xs font-mono font-bold text-brand-700 block">01 CREATE</span>
              <h3 className="font-display font-bold text-lg text-zinc-900">Garment Batch</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Log order details, GOTS yarn spinning mill origin, garment weight, and target European buyer.
              </p>
            </div>

            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-600 block">02 VERIFY</span>
              <h3 className="font-display font-bold text-lg text-zinc-900">Dyer + CETP Data</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Dyeing partner uploads OEKO-TEX certificate. CETP clears 92% closed-loop water recycling.
              </p>
            </div>

            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 block">03 PASSPORT</span>
              <h3 className="font-display font-bold text-lg text-zinc-900">QR-Powered DPP</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Generates tamper-proof QR passport with verified LCA footprint and Polygon integrity anchor.
              </p>
            </div>
          </div>

          {/* Supply Chain Traceability Node Visualization */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Supply Chain Visualization
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-zinc-800">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">MSME (Tiruppur)</span>
              <span className="text-zinc-300">↓</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-brand-200 text-brand-900 shadow-sm">DYER Partner</span>
              <span className="text-zinc-300">↓</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-cyan-200 text-cyan-900 shadow-sm">CETP Facility</span>
              <span className="text-zinc-300">↓</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">EXPORT (Port)</span>
              <span className="text-zinc-300">↓</span>
              <span className="bg-zinc-900 text-white px-3 py-1.5 rounded-lg shadow-sm">EU BUYER</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Live Carbon Estimator Sandbox */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-200 pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-zinc-200 shadow-sm space-y-8">
            <div className="max-w-xl space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                <Calculator className="w-3.5 h-3.5" />
                <span>Live Environmental Estimator</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900">
                Live Carbon & Water Footprint Sandbox
              </h2>
              <p className="text-xs text-zinc-500">
                Test how fiber selection, garment weight, and Tiruppur CETP water recycling determine your DPP score.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Fiber Type
                  </label>
                  <select
                    value={calcFiber}
                    onChange={(e) => setCalcFiber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                  >
                    <option value="organic_cotton_blend">95% Organic Cotton / 5% Elastane (3.8 kg CO₂e/kg)</option>
                    <option value="organic_cotton">100% GOTS Organic Cotton (3.4 kg CO₂e/kg)</option>
                    <option value="conventional_cotton">Conventional Cotton (8.4 kg CO₂e/kg)</option>
                    <option value="modal_tencel">Tencel Modal Micro-Fiber (4.1 kg CO₂e/kg)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Fabric Weight (GSM)
                    </label>
                    <input
                      type="number"
                      value={calcWeightGsm}
                      onChange={(e) => setCalcWeightGsm(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Batch Quantity
                    </label>
                    <input
                      type="number"
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Number(e.target.value))}
                      step="500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Dyeing Process
                    </label>
                    <select
                      value={calcDye}
                      onChange={(e) => setCalcDye(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                    >
                      <option value="low_impact_reactive">Low-Impact Reactive Dyes</option>
                      <option value="natural_plant">Natural Plant Bio-Dyes</option>
                      <option value="standard_synthetic">Standard Synthetic Winch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Freight Mode
                    </label>
                    <select
                      value={calcFreight}
                      onChange={(e) => setCalcFreight(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                    >
                      <option value="sea">Container Ship (Sea Freight)</option>
                      <option value="air">Air Cargo Freight</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Live Outputs */}
              <div className="lg:col-span-5 bg-zinc-900 rounded-2xl p-6 text-white space-y-4 shadow-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-300">Live Calculated LCA</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Estimated CO₂e</span>
                    <strong className="text-2xl font-extrabold text-white font-display block mt-0.5">
                      {totalCarbonTonnes} t
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">↓ 18% below baseline</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Water Footprint</span>
                    <strong className="text-2xl font-extrabold text-cyan-300 font-display block mt-0.5">
                      {totalWaterLiters.toLocaleString()} L
                    </strong>
                    <span className="text-[10px] text-cyan-300 block mt-0.5">92% ZLD Recycled</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentRole('msme');
                    navigate('/create-batch');
                  }}
                  className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Create Batch with These Specs →</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900">
            Ready to Issue Export Passports for Your Garments?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Join the Tiruppur digital sustainability pilot and generate EU DPP-compliant passports in minutes.
          </p>
          <button
            onClick={() => {
              setCurrentRole('msme');
              navigate('/create-batch');
            }}
            className="px-8 py-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Create Your First Digital Product Passport →</span>
          </button>
        </div>
      </section>

    </div>
  );
}
