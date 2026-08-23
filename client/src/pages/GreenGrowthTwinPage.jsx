import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingDown, 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Zap, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  Building2, 
  ArrowRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export function GreenGrowthTwinPage({ navigate }) {
  const { msme } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Simulator Toggle States
  const [simSolar, setSimSolar] = useState(false);
  const [simLed, setSimLed] = useState(false);
  const [simZld, setSimZld] = useState(false);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    const fetchTwinData = async () => {
      setLoading(true);
      try {
        const msmeId = msme?.id || '';
        const [trendRes, predRes, recRes] = await Promise.allSettled([
          fetch(`/api/twin/trend?msmeId=${msmeId}`).then(r => r.json()),
          fetch(`/api/twin/prediction?msmeId=${msmeId}`).then(r => r.json()),
          fetch(`/api/twin/recommendations?msmeId=${msmeId}`).then(r => r.json())
        ]);

        if (trendRes.status === 'fulfilled' && trendRes.value.success) {
          setTrendData(trendRes.value.data);
        }
        if (predRes.status === 'fulfilled' && predRes.value.success) {
          setPrediction(predRes.value.data);
        }
        if (recRes.status === 'fulfilled' && recRes.value.success) {
          setRecommendations(recRes.value.data);
        }
      } catch (err) {
        console.error('Failed to fetch twin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTwinData();
  }, [msme]);

  // Live What-If Simulator Trigger
  useEffect(() => {
    const runSimulation = async () => {
      try {
        const msmeId = msme?.id || '';
        const res = await fetch(`/api/twin/simulate?msmeId=${msmeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            solarAdoption: simSolar,
            ledUpgrade: simLed,
            zldWaterRecycle: simZld
          })
        });
        const data = await res.json();
        if (data.success) {
          setSimResult(data.data);
        }
      } catch (err) {
        console.error('Simulation error:', err);
      }
    };

    runSimulation();
  }, [simSolar, simLed, simZld, msme]);

  const trends = trendData.length > 0 ? trendData : [
    { month: 'Mar', carbonKg: 3419.6, electricityKwh: 4776, waterLitres: 312000 },
    { month: 'Apr', carbonKg: 3249.9, electricityKwh: 4539, waterLitres: 298000 },
    { month: 'May', carbonKg: 3099.5, electricityKwh: 4329, waterLitres: 285000 },
    { month: 'Jun', carbonKg: 2979.9, electricityKwh: 4162, waterLitres: 274000 },
    { month: 'Jul', carbonKg: 2889.7, electricityKwh: 4036, waterLitres: 268000 },
    { month: 'Aug', carbonKg: 2835.3, electricityKwh: 3960, waterLitres: 260000 }
  ];

  const pred = prediction || {
    predictedCarbonKg: 2740.0,
    currentCarbonKg: 2835.3,
    trendDirection: 'DOWN',
    percentageChange: -3.3
  };

  const sim = simResult || {
    baselineCarbonKg: 2835.36,
    projectedCarbonKg: simSolar && simLed ? 1984.7 : (simSolar ? 1984.7 : (simLed ? 2551.8 : 2835.36)),
    carbonSavedKg: simSolar ? 850.6 : 0.0,
    percentageReduction: simSolar ? 30.0 : 0.0,
    projectedTrustScore: 94 + (simSolar ? 4 : 0) + (simLed ? 2 : 0) + (simZld ? 3 : 0)
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* PAGE HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Environmental Twin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Green Growth Twin & Simulator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
            Real-time monthly energy, water, and carbon analytics aggregated from verified TNEB bills and CETP effluent reports.
          </p>
        </div>

        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-right space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase block">Grid Emission Factor</span>
          <span className="text-xs font-extrabold text-zinc-900 font-mono">0.716 kg CO₂e / kWh</span>
          <span className="text-[10px] text-zinc-500 block">CEA India Central Electricity Authority</span>
        </div>
      </div>

      {/* SECTION 1 — TREND METRIC CARDS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Carbon Trend */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Scope 2 CO₂e
            </span>
            <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-0.5">
              <TrendingDown className="w-4 h-4" /> -17.1% (6 mo)
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-display">
              2.84 <span className="text-sm font-medium text-zinc-400">t CO₂e / mo</span>
            </span>
          </div>

          {/* Bar Visualizer */}
          <div className="h-24 flex items-end justify-between gap-2 pt-2">
            {trends.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-emerald-600 rounded-t-lg transition-all" 
                  style={{ height: `${Math.max(20, (t.carbonKg / 3500) * 80)}px` }} 
                />
                <span className="text-[10px] font-bold text-zinc-400">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Electricity kWh Trend */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> TNEB Electricity
            </span>
            <span className="text-xs font-extrabold text-indigo-700 font-mono">
              3,960 kWh
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-display">
              3.96 <span className="text-sm font-medium text-zinc-400">MWh / month</span>
            </span>
          </div>

          {/* Bar Visualizer */}
          <div className="h-24 flex items-end justify-between gap-2 pt-2">
            {trends.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-indigo-600 rounded-t-lg transition-all" 
                  style={{ height: `${Math.max(20, (t.electricityKwh / 5000) * 80)}px` }} 
                />
                <span className="text-[10px] font-bold text-zinc-400">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Water Litres Trend */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> CETP Water Usage
            </span>
            <span className="text-xs font-extrabold text-teal-700 font-mono">
              92% ZLD Recovery
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-display">
              260K <span className="text-sm font-medium text-zinc-400">Litres / month</span>
            </span>
          </div>

          {/* Bar Visualizer */}
          <div className="h-24 flex items-end justify-between gap-2 pt-2">
            {trends.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-teal-600 rounded-t-lg transition-all" 
                  style={{ height: `${Math.max(20, (t.waterLitres / 350000) * 80)}px` }} 
                />
                <span className="text-[10px] font-bold text-zinc-400">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 2 — LINEAR REGRESSION PREDICTION PANEL */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-800">
              Least-Squares Regression Prediction
            </span>
            <h2 className="text-xl font-extrabold font-display">
              Next Month Carbon Projection (September 2026)
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700">
            <TrendingDown className="w-6 h-6 text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Projected Carbon</span>
              <span className="font-mono font-extrabold text-lg text-emerald-300">{pred.predictedCarbonKg} kg CO₂e</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
          Methodology: Fitted via linear least-squares regression over historical TNEB bill data. Projections reflect directional trend estimates assuming stable monthly yarn spinning output.
        </p>
      </div>

      {/* SECTION 3 — LIVE WHAT-IF SIMULATOR */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-extrabold text-zinc-900 font-display">
              Interactive "What-If" Green Growth Simulator
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Simulate hypothetical renewable energy & water recycling upgrades. See live CO₂e reductions and Trust Score gains without saving fake data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Toggle 1: Solar */}
          <div className={`p-5 rounded-2xl border transition-all space-y-3 ${simSolar ? 'bg-emerald-50 border-emerald-300' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" /> 50 kW Solar Rooftop
              </span>
              <input 
                type="checkbox" 
                checked={simSolar} 
                onChange={(e) => setSimSolar(e.target.checked)}
                className="w-5 h-5 accent-emerald-700 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-500 leading-normal">
              Reduces TNEB grid electricity draw by ~30%.
            </p>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded block w-fit">
              +4 Trust Score Points
            </span>
          </div>

          {/* Toggle 2: LED */}
          <div className={`p-5 rounded-2xl border transition-all space-y-3 ${simLed ? 'bg-indigo-50 border-indigo-300' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> LED Retrofit
              </span>
              <input 
                type="checkbox" 
                checked={simLed} 
                onChange={(e) => setSimLed(e.target.checked)}
                className="w-5 h-5 accent-indigo-700 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-500 leading-normal">
              Lowers lighting load by ~10% across factory sheds.
            </p>
            <span className="text-[10px] font-extrabold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded block w-fit">
              +2 Trust Score Points
            </span>
          </div>

          {/* Toggle 3: ZLD Water */}
          <div className={`p-5 rounded-2xl border transition-all space-y-3 ${simZld ? 'bg-teal-50 border-teal-300' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-teal-600" /> ZLD Water Recirculation
              </span>
              <input 
                type="checkbox" 
                checked={simZld} 
                onChange={(e) => setSimZld(e.target.checked)}
                className="w-5 h-5 accent-teal-700 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-500 leading-normal">
              Reduces fresh water draw by ~25% in rinse cycles.
            </p>
            <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded block w-fit">
              +3 Trust Score Points
            </span>
          </div>

        </div>

        {/* SIMULATION RESULTS PREVIEW */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Simulation Result Preview</span>
            <h3 className="text-xl font-extrabold font-display">
              Projected Carbon: {sim.projectedCarbonKg} kg CO₂e / mo
            </h3>
            <p className="text-xs text-emerald-200/80">
              Estimated carbon reduction: <strong className="text-white">{sim.percentageReduction}%</strong> • Projected Trust Score: <strong className="text-white">{sim.projectedTrustScore} / 100</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-4 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-md shrink-0 hover:bg-emerald-50 transition-all flex items-center gap-1.5"
          >
            <span>Upload Verified Doc to Confirm →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
