import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  AlertCircle,
  FileText,
  Bot,
  Loader2
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { AccessDeniedPage } from './AccessDeniedPage';

export function GreenGrowthTwinPage({ navigate }) {
  const { msme } = useAuth();
  const { currentRole } = useApp() || {};
  const userRole = currentRole || msme?.role || 'msme';

  if (userRole !== 'msme') {
    return <AccessDeniedPage navigate={navigate} requiredRole="MSME Garment Producer / Exporter" />;
  }

  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Simulator Toggle States
  const [simSolar, setSimSolar] = useState(false);
  const [simLed, setSimLed] = useState(false);
  const [simZld, setSimZld] = useState(false);

  // Simulation Result & AI Narrative
  const [simResult, setSimResult] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const debounceTimerRef = useRef(null);

  // Fetch 100% Real Baseline Data on Mount
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
          setTrendData(trendRes.value.data || []);
        } else {
          setTrendData([]);
        }

        if (predRes.status === 'fulfilled' && predRes.value.success) {
          setPrediction(predRes.value.data);
        } else {
          setPrediction(null);
        }

        if (recRes.status === 'fulfilled' && recRes.value.success) {
          setRecommendations(recRes.value.data || []);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        console.error('Failed to fetch real twin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTwinData();
  }, [msme]);

  // Debounced What-If Simulation Trigger with AI Narrative (google/gemini-2.5-flash)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setNarrativeLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const msmeId = msme?.id || '';
        const res = await fetch(`/api/twin/simulate-with-narrative?msmeId=${msmeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            solarAdoption: simSolar,
            ledUpgrade: simLed,
            zldWaterRecycle: simZld
          })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setSimResult(data.data.simulationResult);
          setNarrative(data.data.narrative);
        }
      } catch (err) {
        console.error('Simulation API error:', err);
      } finally {
        setNarrativeLoading(false);
      }
    }, 800); // 800ms debounce to protect OpenRouter API from toggle spam

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [simSolar, simLed, simZld, msme]);

  const trends = trendData;
  const latestTrend = trends.length > 0 ? trends[trends.length - 1] : null;

  const sim = simResult || {
    baselineCarbonKg: latestTrend ? latestTrend.carbonKg : 0.0,
    projectedCarbonKg: latestTrend ? latestTrend.carbonKg : 0.0,
    carbonSavedKg: 0.0,
    percentageReduction: 0.0,
    trustScoreDelta: 0,
    projectedTrustScore: 86
  };

  const currentNarrative = narrative || {
    explanation: "Selecting green tech upgrades above computes deterministic carbon savings and generates AI insights for your factory.",
    nextStep: "Toggle solar rooftop or LED retrofit controls to model operational improvements."
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* PAGE HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-Time Environmental Twin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-display">
            Green Growth Twin & AI Simulator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
            Sourced directly from verified TNEB power bills and CETP effluent reports. Zero fake baseline seed data.
          </p>
        </div>

        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-right space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase block">CEA Grid Emission Factor</span>
          <span className="text-xs font-extrabold text-zinc-900 font-mono">0.716 kg CO₂e / kWh</span>
          <span className="text-[10px] text-zinc-500 block">Central Electricity Authority (CEA India)</span>
        </div>
      </div>

      {/* SECTION 1 — REAL TREND METRIC CARDS & CHARTS */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-medium text-zinc-500">Querying real monthly sustainability snapshots from PostgreSQL...</p>
        </div>
      ) : trends.length === 0 ? (
        /* HONEST SPARSE STATE (0 DATA POINTS) */
        <div className="bg-gradient-to-br from-slate-900 to-zinc-900 text-white p-8 rounded-3xl border border-zinc-800 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-extrabold font-display">Building Your Sustainability Trend</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No verified monthly sustainability snapshots found. Upload monthly TNEB electricity bills and CETP effluent reports in the Document Vault to initialize your real-time environmental twin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/document-upload')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Upload Operational Document →</span>
          </button>
        </div>
      ) : (
        /* REAL DATA TREND CHARTS */
        <div className="space-y-4">
          {trends.length < 3 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Building trend history ({trends.length}/3 months):</strong> Upload {3 - trends.length} more monthly documents to unlock AI linear regression predictions.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Scope 2 CO2e Trend */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> Scope 2 CO₂e
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">Real Snapshot</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-zinc-900 font-display">
                  {latestTrend ? latestTrend.carbonKg : 0} <span className="text-sm font-medium text-zinc-400">kg CO₂e</span>
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="h-24 flex items-end justify-around gap-2 pt-2 border-t border-zinc-100">
                {trends.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-emerald-600 rounded-t-lg transition-all" 
                      style={{ height: `${Math.max(15, (t.carbonKg / Math.max(...trends.map(tr => tr.carbonKg || 1))) * 75)}px` }} 
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
                <span className="text-xs font-bold text-indigo-700 font-mono">
                  {latestTrend ? latestTrend.electricityKwh : 0} kWh
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-zinc-900 font-display">
                  {latestTrend ? latestTrend.electricityKwh : 0} <span className="text-sm font-medium text-zinc-400">kWh / mo</span>
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="h-24 flex items-end justify-around gap-2 pt-2 border-t border-zinc-100">
                {trends.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-indigo-600 rounded-t-lg transition-all" 
                      style={{ height: `${Math.max(15, (t.electricityKwh / Math.max(...trends.map(tr => tr.electricityKwh || 1))) * 75)}px` }} 
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
                <span className="text-xs font-bold text-teal-700 font-mono">
                  {latestTrend ? latestTrend.waterLitres : 0} L
                </span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-zinc-900 font-display">
                  {latestTrend ? latestTrend.waterLitres : 0} <span className="text-sm font-medium text-zinc-400">Litres / mo</span>
                </span>
              </div>

              {/* Bar Visualizer */}
              <div className="h-24 flex items-end justify-around gap-2 pt-2 border-t border-zinc-100">
                {trends.map((t, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-teal-600 rounded-t-lg transition-all" 
                      style={{ height: `${Math.max(15, (t.waterLitres / Math.max(...trends.map(tr => tr.waterLitres || 1))) * 75)}px` }} 
                    />
                    <span className="text-[10px] font-bold text-zinc-400">{t.month}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 2 — LINEAR REGRESSION PREDICTION PANEL */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-800">
              Least-Squares Regression Model
            </span>
            <h2 className="text-xl font-extrabold font-display">
              Linear Regression Carbon Projection
            </h2>
          </div>

          {prediction && prediction.hasEnoughData ? (
            <div className="flex items-center gap-3 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700">
              <TrendingDown className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Next Month Projection</span>
                <span className="font-mono font-extrabold text-lg text-emerald-300">{prediction.predictedCarbonKg} kg CO₂e</span>
              </div>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-semibold">
              🔒 Minimum 3 Months Required
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
          {prediction && prediction.hasEnoughData
            ? prediction.methodology
            : "Upload at least 3 months of verified TNEB bills to generate mathematical least-squares regression forecasting."}
        </p>
      </div>

      {/* SECTION 3 — VISUALLY ISOLATED WHAT-IF SIMULATOR WITH AI NARRATIVE */}
      <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-lg p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* PROJECTION MODE BADGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                Interactive "What-If" Green Growth Simulator
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                PROJECTION MODE
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Simulates hypothetical green upgrades on top of your current real baseline. Projections are never written to official ledger tables.
            </p>
          </div>
        </div>

        {/* TOGGLE CONTROLS */}
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

        {/* DETERMINISTIC NUMERIC RESULTS BOX */}
        <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Deterministic Simulation Result</span>
            <h3 className="text-xl font-extrabold font-display text-white">
              Projected Carbon: {sim.projectedCarbonKg} kg CO₂e / mo
            </h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Carbon savings: <strong className="text-emerald-300">{sim.percentageReduction}%</strong> ({sim.carbonSavedKg} kg CO₂e) • Projected Trust Score: <strong className="text-emerald-300">{sim.projectedTrustScore} / 100</strong> (+{sim.trustScoreDelta} pts)
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/document-upload')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shrink-0 transition-all flex items-center gap-1.5"
          >
            <span>Upload Real Doc to Confirm →</span>
          </button>
        </div>

        {/* AI SUSTAINABILITY ADVISOR NARRATIVE CARD (google/gemini-2.5-flash) */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white font-display">AI Sustainability Advisor Insight</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                google/gemini-2.5-flash
              </span>
            </div>

            {narrativeLoading && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating AI Narrative...</span>
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              <strong className="text-white">Business Impact:</strong> {currentNarrative.explanation}
            </p>
            <p className="text-emerald-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <strong className="text-white">Recommended Next Step:</strong> {currentNarrative.nextStep}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
