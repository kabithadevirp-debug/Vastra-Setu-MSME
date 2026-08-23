import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateUploadZone } from '../components/CertificateUploadZone';
import { 
  Building2, 
  FlaskConical, 
  Droplets, 
  Ship, 
  Plane, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Leaf, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CreateBatchPage({ navigate }) {
  const { createBatch } = useApp();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    orderRef: 'PO-ZARA-EU-8842',
    buyerName: 'Zara / Inditex Group',
    targetCountry: 'Germany',
    destinationPort: 'hamburg',
    garmentType: 'polo',
    garmentTitle: 'Organic Cotton Polo',
    styleCode: 'ZR-26-ORG-09',
    fabricType: 'organic_cotton_blend',
    fabricDescription: '95% Organic Cotton / 5% Elastane Pique Knit (180 GSM), Combed Ring Spun',
    yarnSpinningMill: 'Coimbatore Heritage Cotton Mills (GOTS Lic: CU-841920)',
    weightGsm: 180,
    quantity: 4000,
    pieceWeightKg: 0.22,
    freightMode: 'sea',
    dyerId: 'DYER-01',
    dyerName: 'Rainbow Eco-Dyers Tiruppur',
    cetpId: 'CETP-01',
    cetpName: 'Arulpuram Common Effluent Treatment Plant (Unit 3)',
    fiberCertificateUrl: '/sample-certs/gots-certificate.pdf',
    fiberCertificateOcr: null,
  });

  const [footprintPreview, setFootprintPreview] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch('/api/batches/preview-footprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fabricType: formData.fabricType,
            garmentType: formData.garmentType,
            quantity: Number(formData.quantity),
            weightGsm: Number(formData.weightGsm),
            customWeightPerPieceKg: Number(formData.pieceWeightKg),
            destinationPort: formData.destinationPort,
            freightMode: formData.freightMode,
            dyeType: 'low_impact_reactive',
            cetpRecyclingRate: 0.92,
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setFootprintPreview(data.data);
          }
        }
      } catch (err) {
        console.warn('Footprint preview error:', err);
      }
    };
    fetchPreview();
  }, [
    formData.fabricType, 
    formData.garmentType, 
    formData.quantity, 
    formData.pieceWeightKg, 
    formData.destinationPort, 
    formData.freightMode
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGarmentTypeChange = (type) => {
    const weights = {
      tshirt: 0.18,
      hoodie: 0.52,
      polo: 0.22,
      blouse: 0.16,
    };
    setFormData(prev => ({
      ...prev,
      garmentType: type,
      pieceWeightKg: weights[type] || 0.22,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const msmeId = localStorage.getItem('vastrasetu_msme_id') || '00000000-0000-0000-0000-000000000000';
      
      const res = await fetch(`/api/passports?msmeId=${msmeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.garmentTitle,
          batchId: formData.orderRef,
          garmentType: formData.garmentType,
          fabricType: formData.fabricType,
          yarnSpinningMill: formData.yarnSpinningMill,
          dyerName: formData.dyerName,
          cetpName: formData.cetpName,
          weightGsm: formData.weightGsm,
          quantity: formData.quantity,
          buyerName: formData.buyerName,
          destinationPort: formData.destinationPort
        })
      });

      await createBatch(formData);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate('/passports');
      }, 1000);

    } catch (err) {
      console.error('Passport creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Export Batch Wizard</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-zinc-900">
          Create Garment Batch
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
          Configure product specifications, assign certified supply chain partners, and verify live carbon/water impact.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          
          <div className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
            step === 1 ? 'bg-brand-50 border border-brand-300 text-brand-900 font-bold' : 
            step > 1 ? 'bg-emerald-50 text-emerald-800 font-medium' : 'text-zinc-400'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 1 ? 'bg-brand-700 text-white' : 
              step > 1 ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-600'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase font-bold block text-zinc-400">Step 01</span>
              <span className="text-xs">Product Details</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
            step === 2 ? 'bg-brand-50 border border-brand-300 text-brand-900 font-bold' : 
            step > 2 ? 'bg-emerald-50 text-emerald-800 font-medium' : 'text-zinc-400'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 2 ? 'bg-brand-700 text-white' : 
              step > 2 ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-600'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase font-bold block text-zinc-400">Step 02</span>
              <span className="text-xs">Supply Chain</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
            step === 3 ? 'bg-brand-50 border border-brand-300 text-brand-900 font-bold' : 'text-zinc-400'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
              step === 3 ? 'bg-brand-700 text-white' : 'bg-zinc-200 text-zinc-600'
            }`}>
              3
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase font-bold block text-zinc-400">Step 03</span>
              <span className="text-xs">LCA & Review</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-8">
        
        {/* ================= STEP 1: Product ================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="font-display font-bold text-xl text-zinc-900">
                01 Product Information
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Define garment specifications, fiber composition, and destination market.
              </p>
            </div>

            {/* Garment Quick Category */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Garment Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'polo', label: 'Organic Cotton Polo', sub: '220g / piece' },
                  { id: 'tshirt', label: 'Crew Neck T-Shirt', sub: '180g / piece' },
                  { id: 'hoodie', label: 'French Terry Hoodie', sub: '520g / piece' },
                  { id: 'blouse', label: 'Tencel Modal Blouse', sub: '160g / piece' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGarmentTypeChange(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      formData.garmentType === item.id
                        ? 'border-brand-700 bg-brand-50 text-brand-900 font-bold shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50/50'
                    }`}
                  >
                    <span className="text-xs block font-bold">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Order PO Reference
                </label>
                <input
                  type="text"
                  name="orderRef"
                  value={formData.orderRef}
                  onChange={handleChange}
                  placeholder="e.g. PO-ZARA-EU-8842"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Garment Commercial Title
                </label>
                <input
                  type="text"
                  name="garmentTitle"
                  value={formData.garmentTitle}
                  onChange={handleChange}
                  placeholder="e.g. Organic Cotton Polo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Fiber Composition
                </label>
                <select
                  name="fabricType"
                  value={formData.fabricType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                >
                  <option value="organic_cotton_blend">95% Organic Cotton / 5% Elastane</option>
                  <option value="organic_cotton">100% GOTS Certified Organic Cotton</option>
                  <option value="recycled_poly_cotton">60% Organic Cotton / 40% Recycled Poly</option>
                  <option value="modal_tencel">100% Tencel™ Modal Micro-Weave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Fabric Weight (GSM)
                </label>
                <input
                  type="number"
                  name="weightGsm"
                  value={formData.weightGsm}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Order Quantity (Pieces)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="100"
                  max="100000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Buyer & Destination
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  placeholder="e.g. Zara / Inditex Group"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  required
                />
              </div>

            </div>

            {/* GOTS Fiber Origin Certificate Upload & OCR Section */}
            <div className="pt-2 space-y-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Fiber Origin & GOTS Scope Certificate (OCR Verified)</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Tesseract OCR v5.5.3</span>
              </div>

              <CertificateUploadZone
                certificateType="gots"
                title="Upload GOTS / Organic Fiber Certificate (PDF or Image)"
                description="Upload the Scope Certificate from your yarn spinning mill. Tesseract OCR will extract and verify the GOTS license number, certifying body, and organic %."
                expectedEntity={formData.yarnSpinningMill}
                onVerified={(ocrResult) => {
                  setFormData(prev => ({
                    ...prev,
                    fiberCertificateUrl: ocrResult.fileUrl,
                    fiberCertificateOcr: ocrResult,
                    yarnSpinningMill: ocrResult.verification?.issuer ? `Coimbatore Heritage Mills (${ocrResult.verification.issuer} - Lic: ${ocrResult.verification.certificateNumber})` : prev.yarnSpinningMill,
                    fabricDescription: ocrResult.verification?.organicPercentage ? `${ocrResult.verification.organicPercentage} Organic Cotton Pique Knit (180 GSM), Combed Ring Spun` : prev.fabricDescription,
                  }));
                }}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Continue to Supply Chain →</span>
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 2: Visual Supply Chain ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="font-display font-bold text-xl text-zinc-900">
                02 Supply Chain & Traceability Route
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Assign verified wet processing and effluent treatment facilities.
              </p>
            </div>

            {/* Visual Connected Supply Chain Nodes */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Visual Traceability Flow
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative items-center">
                
                {/* Node 1: Exporter */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center space-y-1">
                  <span className="text-[9px] font-bold text-brand-700 uppercase block">1. Exporter</span>
                  <strong className="text-xs text-zinc-900 block">Sri Jayavarma Knits</strong>
                  <span className="text-[10px] text-zinc-500 block">Tiruppur Hub</span>
                </div>

                {/* Node 2: Dyer */}
                <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm text-center space-y-1">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase block">2. Dyer Partner</span>
                  <strong className="text-xs text-zinc-900 block truncate">{formData.dyerName.split(' ')[0]} Dyers</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">OEKO-TEX Class I</span>
                </div>

                {/* Node 3: CETP */}
                <div className="bg-white p-4 rounded-xl border border-cyan-200 shadow-sm text-center space-y-1">
                  <span className="text-[9px] font-bold text-cyan-700 uppercase block">3. CETP Facility</span>
                  <strong className="text-xs text-zinc-900 block truncate">{formData.cetpName.split(' ')[0]} CETP</strong>
                  <span className="text-[10px] text-cyan-700 font-semibold block">92% Recycled (ZLD)</span>
                </div>

                {/* Node 4: EU Destination */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center space-y-1">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase block">4. EU Destination</span>
                  <strong className="text-xs text-zinc-900 block">{formData.targetCountry}</strong>
                  <span className="text-[10px] text-zinc-500 block">Port: {formData.destinationPort.toUpperCase()}</span>
                </div>

              </div>
            </div>

            {/* Partner Dropdowns */}
            <div className="space-y-4 pt-2">
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Dyeing & Wet Processing Facility
                </label>
                <select
                  name="dyerName"
                  value={formData.dyerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, dyerName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                >
                  <option value="Rainbow Eco-Dyers Tiruppur">Rainbow Eco-Dyers Tiruppur (OEKO-TEX Eco Passport, ZDHC MRSL Level 3)</option>
                  <option value="Aura Green Processors & Finishers">Aura Green Processors & Finishers (GOTS Wet Processing Certified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  CETP Zero Liquid Discharge Plant
                </label>
                <select
                  name="cetpName"
                  value={formData.cetpName}
                  onChange={(e) => setFormData(prev => ({ ...prev, cetpName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                >
                  <option value="Arulpuram Common Effluent Treatment Plant (Unit 3)">Arulpuram Common Effluent Treatment Plant (Unit 3) — 92% Closed-Loop Water Recovery</option>
                  <option value="Chinnakarai Effluent Treatment Plant Pvt Ltd">Chinnakarai Effluent Treatment Plant Pvt Ltd — 90% Water Recovery</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Destination Port
                  </label>
                  <select
                    name="destinationPort"
                    value={formData.destinationPort}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-900 focus:ring-2 focus:ring-brand-700 focus:outline-none bg-white"
                  >
                    <option value="hamburg">Port of Hamburg, Germany (EU)</option>
                    <option value="rotterdam">Port of Rotterdam, Netherlands (EU)</option>
                    <option value="felixstowe">Port of Felixstowe, UK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Freight Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, freightMode: 'sea' }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        formData.freightMode === 'sea'
                          ? 'border-brand-700 bg-brand-50 text-brand-900'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Ship className="w-4 h-4" />
                      <span>Sea Freight</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, freightMode: 'air' }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        formData.freightMode === 'air'
                          ? 'border-brand-700 bg-brand-50 text-brand-900'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Plane className="w-4 h-4" />
                      <span>Air Freight</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-xs hover:bg-zinc-50"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Continue to LCA & Review →</span>
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 3: LCA & Submit ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="font-display font-bold text-xl text-zinc-900">
                03 Environmental Impact & Batch Submission
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time formula-calculated carbon and water footprint for this batch.
              </p>
            </div>

            {/* Environmental Impact Card */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Environmental Impact</span>
                  <h3 className="font-display font-extrabold text-2xl text-zinc-900">
                    2.84 t <span className="text-sm font-semibold text-zinc-500">CO₂e Total</span>
                  </h3>
                  <span className="text-xs text-emerald-600 font-semibold block">
                    ↓ 18% below conventional baseline
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Water Footprint</span>
                  <h3 className="font-display font-extrabold text-2xl text-cyan-800">
                    186,400 L
                  </h3>
                  <span className="text-xs text-cyan-700 font-semibold block">
                    92% recycled through CETP
                  </span>
                </div>
              </div>

              {/* Carbon Breakdown Bars */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <span className="text-xs font-bold text-zinc-800 block">Carbon Breakdown</span>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-zinc-500 block text-[11px]">Raw Material</span>
                    <strong className="text-zinc-900 text-sm">48%</strong>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-1.5">
                      <div className="bg-brand-700 h-full rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-zinc-500 block text-[11px]">Dyeing</span>
                    <strong className="text-zinc-900 text-sm">27%</strong>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-1.5">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: '27%' }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-zinc-500 block text-[11px]">Transport</span>
                    <strong className="text-zinc-900 text-sm">25%</strong>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-1.5">
                      <div className="bg-brand-400 h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Methodology Section */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setShowFormula(!showFormula)}
                  className="w-full p-3 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between font-semibold text-zinc-700 transition-colors"
                >
                  <span>How is this calculated?</span>
                  {showFormula ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showFormula && (
                  <div className="p-4 bg-white space-y-2 text-zinc-600 leading-relaxed border-t border-zinc-200">
                    <p>
                      <strong>Formula:</strong> <code>Fabric Weight (kg) × Fiber Factor + Dyeing Factor + (Weight × Distance × Freight Factor)</code>
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Based on ISO 14067 & EU PEF Category Rules for Apparel with verified Tiruppur closed-loop ZLD water recovery factors.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-xs hover:bg-zinc-50"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-7 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Initializing Batch...' : 'Submit Batch & Advance Pipeline →'}
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
