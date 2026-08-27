import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useReducedMotion, 
  useInView 
} from 'framer-motion';
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
  ChevronRight,
  FileCheck,
  Award,
  Landmark,
  BadgeCheck,
  Lock,
  Cpu,
  Layers,
  Users,
  Search,
  Check,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Animated numeric counter supporting decimals
function AnimatedCounter({ value, duration = 1.2, decimals = 0, suffix = '', prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) {
      setDisplayValue(value);
      return;
    }
    if (!isInView) return;

    let start = 0;
    const end = parseFloat(value);
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      // easeOutExpo
      const progress = frame / totalFrames;
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, duration, isInView, shouldReduce]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
}

// Scrambled Merkle Hash resolving micro-interaction
function ResolvingHash({ targetHash = '0x7a9c8e42b10f983d' }) {
  const [text, setText] = useState(targetHash);
  const [isResolved, setIsResolved] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const characters = '0123456789abcdefABCDEF';

  useEffect(() => {
    if (!isInView) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        targetHash
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetHash[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= targetHash.length) {
        clearInterval(interval);
        setIsResolved(true);
      }
      iteration += 1 / 2;
    }, 35);

    return () => clearInterval(interval);
  }, [isInView, targetHash]);

  return (
    <span ref={ref} className="inline-flex items-center gap-1.5 font-mono text-[11px]">
      <span className={isResolved ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
        {text}
      </span>
      {isResolved && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 inline" />
        </motion.span>
      )}
    </span>
  );
}

export function LandingPage({ navigate }) {
  const shouldReduceMotion = useReducedMotion();

  // Public verification search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Live Carbon & Water Estimator state
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

  const pieceWeightKg = (calcWeightGsm / 1000) * 1.2;
  const totalBatchWeightKg = pieceWeightKg * calcQuantity;
  const totalBatchTonnes = totalBatchWeightKg / 1000;

  const totalCarbonKg = (totalBatchWeightKg * fiberEmissions[calcFiber]) +
                        (totalBatchWeightKg * dyeEmissions[calcDye]) +
                        (totalBatchTonnes * 10800 * freightEmissions[calcFreight]) +
                        (totalBatchWeightKg * 0.95);

  const totalCarbonTonnes = Number((totalCarbonKg / 1000).toFixed(2));
  const totalWaterLiters = Math.round(totalBatchWeightKg * 2400 * 0.08); // 92% recycled

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.25, 1, 0.5, 1] // smooth easeOut
      }
    }
  };

  const stepCardVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: 'easeOut'
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        dppId: searchQuery.trim().toUpperCase(),
        exporter: 'Sri Jayavarma Knits & Exports Pvt Ltd',
        product: '100% Organic Cotton Crewneck T-Shirt',
        trustScore: 98,
        status: 'VERIFIED_ACTIVE',
        cluster: 'Tiruppur Textile Cluster',
        oekoTex: 'OEKO-TEX Standard 100 Class I (Verified)',
        cetpZld: '94.2% Recycled (TNPCB ZLD Order #8842)',
        merkleRoot: '0x8f4c...91b2'
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs font-semibold text-emerald-200">
        <motion.span 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2"
        >
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
            DPI-FIRST PLATFORM
          </span>
          <span>Zero Blockchain Hype • Institutional DPI Verification + DPDP Consent Architecture</span>
          <span className="hidden sm:inline text-emerald-400">→</span>
        </motion.span>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-20 lg:pb-32 border-b border-slate-800/80">
        {/* Subtle Animated Background Glows */}
        <motion.div 
          animate={{ 
            opacity: [0.12, 0.22, 0.12],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none -z-10" 
        />
        <div className="absolute top-1/3 left-1/4 w-[420px] h-[260px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column with Staggered Entrance */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>EU ESPR 2026 Ready • Digital Product Passport</span>
              </motion.div>

              <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
                Turn your compliance documents into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  verified sustainability proof.
                </span>
              </motion.h1>

              <motion.p variants={fadeUpVariant} className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                VastraSetu converts scattered GST invoices, TNEB electricity bills, CETP effluent reports, and PCB certificates into tamper-proof Digital Product Passports for European buyers, banks, and regulators.
              </motion.p>

              {/* Primary & Secondary CTAs with subtle interactive pulse */}
              <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Get Started (Sign Up)</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Login to Account</span>
                </motion.button>
              </motion.div>

              {/* Trust Key Badges */}
              <motion.div variants={fadeUpVariant} className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>DPI Govt Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Polygon Merkle Root Anchored</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>98/100 Trust Score Badge</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Hero Visual Card with Animated Border & Counter */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                
                {/* Sample Passport Card */}
                <div className="bg-slate-900/90 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 space-y-5 backdrop-blur-xl relative overflow-hidden">
                  
                  {/* Subtle Shimmer Ray */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                  />

                  {/* Card Top */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm tracking-wider text-emerald-400">VASTRASETU</span>
                        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                          VERIFIED DPP
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">Sri Jayavarma Knits & Exports</h3>
                      <p className="text-xs text-slate-400">Tiruppur Cluster • GSTIN 33AAACJ1928A1Z5</p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm font-mono">
                      <AnimatedCounter value={98} duration={1.5} />
                    </div>
                  </div>

                  {/* QR & Metrics */}
                  <div className="grid grid-cols-12 gap-4 items-center bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
                    <div className="col-span-4 flex justify-center bg-white p-2 rounded-xl shadow-xs">
                      <QRCodeSVG
                        value="https://vastrasetu.vercel.app/verify/DPP-VS-2026-00892"
                        size={84}
                        fgColor="#020617"
                      />
                    </div>

                    <div className="col-span-8 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Trust Badge:</span>
                        <span className="text-emerald-400 font-bold">PLATINUM GREEN</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Carbon LCA:</span>
                        <span className="font-semibold text-white">
                          <AnimatedCounter value={2.84} decimals={2} suffix=" t CO₂e" /> (↓18%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">CETP Water:</span>
                        <span className="font-semibold text-cyan-300">92% ZLD Recycled</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Polygon Hash:</span>
                        <ResolvingHash targetHash="0x7a9c8f2b3e4d" />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate('/register')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-md shadow-emerald-500/10"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>Create Your MSME Passport Now →</span>
                  </motion.button>

                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PUBLIC VERIFICATION SEARCH BAR */}
      <section className="py-12 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Instant Public Verification
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Verify Any Garment Passport or Merkle Root
            </h2>
            <p className="text-xs text-slate-400">
              Enter any DPP ID (e.g. <span className="font-mono text-emerald-300">DPP-VS-2026-00892</span>) to inspect live cryptographic evidence.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter DPP ID (e.g. DPP-VS-2026-00892)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              {isSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"
                  />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Passport</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Search Result Card Reveal */}
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="mt-6 bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 max-w-2xl mx-auto space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <strong className="text-sm text-white font-mono">{searchResult.dppId}</strong>
                      <p className="text-xs text-slate-400">{searchResult.exporter} • {searchResult.cluster}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    TRUST SCORE: {searchResult.trustScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dyeing & Chemistry</span>
                    <span className="font-bold text-indigo-300">{searchResult.oekoTex}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">ZLD Water Recovery</span>
                    <span className="font-bold text-cyan-300">{searchResult.cetpZld}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">Polygon Merkle Root</span>
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">{searchResult.merkleRoot} ✓</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4-STEP PROGRESSIVE FLOW) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              4-Step Trust Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              How VastraSetu Turns Operational Data into Trust
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No paper PDFs. No fake claims. Direct API verification from source to digital product passport.
            </p>
          </div>

          {/* Staggered Scroll-Revealed Steps Container */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            
            {/* Step 1 */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-colors shadow-lg shadow-black/20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm font-mono">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Upload Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload existing operational records: GST invoices, TNEB electricity bills, CETP effluent reports, and PCB certificates.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-teal-500/40 transition-colors shadow-lg shadow-black/20"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-extrabold text-sm font-mono">
                02
              </div>
              <h3 className="text-lg font-bold text-white">DPI API Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Government APIs verify GSTIN active state, Udyam registration, utility consumption match, and CETP Zero Liquid Discharge status.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-colors shadow-lg shadow-black/20"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-sm font-mono">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Living Digital Passport</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                VastraSetu calculates carbon & water LCA footprints, generates a 0-100 Trust Score, and builds the EU ESPR 2026 passport.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-colors shadow-lg shadow-black/20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm font-mono">
                04
              </div>
              <h3 className="text-lg font-bold text-white">Merkle Tree QR Proof</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export buyers, banks, and auditors scan the GS1-compliant QR code to verify anti-tamper Polygon Merkle root integrity.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 3. WHO IT'S FOR (4 STAKEHOLDER ROLE CARDS) */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              Multi-Stakeholder Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              One Platform for Four Key Audiences
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              VastraSetu creates a shared source of truth across MSMEs, European brands, green lenders, and government monitoring agencies.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            
            {/* Role 1: MSME */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">For MSME / Producer</span>
                <h3 className="text-xl font-bold text-white">Prove credentials & win export orders</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transform paper electricity bills and effluent reports into EU-compliant passports. Stop losing orders to unverified claims.
              </p>
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                <span>Create MSME Account →</span>
              </button>
            </motion.div>

            {/* Role 2: Export Buyer */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-teal-500/40 transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">For Export Buyer (EU / US)</span>
                <h3 className="text-xl font-bold text-white">Instant anti-tamper compliance verification</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan QR codes to inspect fiber origin, GOTS certification, Zero Liquid Discharge clearance, and carbon LCA before placing purchase orders.
              </p>
              <button onClick={() => navigate('/passport/DPP-VS-2026-00892')} className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300">
                <span>Inspect Sample Passport →</span>
              </button>
            </motion.div>

            {/* Role 3: Bank / NBFC */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">For Banks & Green Lenders</span>
                <h3 className="text-xl font-bold text-white">Fast-track green loans with real performance data</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replace unverified loan applications with live Trust Scores and verified utility compliance to approve lower-rate sustainability loans.
              </p>
              <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300">
                <span>Access Credit Assessment →</span>
              </button>
            </motion.div>

            {/* Role 4: Government */}
            <motion.div 
              variants={stepCardVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">For Government & PCB</span>
                <h3 className="text-xl font-bold text-white">Cluster-wide monitoring & fraud detection</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor textile clusters (e.g. Tiruppur) for environmental compliance, cross-checking production volume against electricity & effluent reports.
              </p>
              <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
                <span>View Compliance Portal →</span>
              </button>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 4. LIVE CARBON & WATER SANDBOX ESTIMATOR */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-800 space-y-8"
          >
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <Calculator className="w-3.5 h-3.5" />
                <span>Live Environmental Estimator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Garment LCA Footprint Sandbox
              </h2>
              <p className="text-xs text-slate-400">
                Test how fiber selection, fabric weight, and Tiruppur CETP water recycling determine your passport's sustainability rating.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Fiber Type
                  </label>
                  <select
                    value={calcFiber}
                    onChange={(e) => setCalcFiber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  >
                    <option value="organic_cotton_blend">95% Organic Cotton / 5% Elastane (3.8 kg CO₂e/kg)</option>
                    <option value="organic_cotton">100% GOTS Organic Cotton (3.4 kg CO₂e/kg)</option>
                    <option value="conventional_cotton">Conventional Cotton (8.4 kg CO₂e/kg)</option>
                    <option value="modal_tencel">Tencel Modal Micro-Fiber (4.1 kg CO₂e/kg)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Fabric Weight (GSM)
                    </label>
                    <input
                      type="number"
                      value={calcWeightGsm}
                      onChange={(e) => setCalcWeightGsm(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Batch Quantity
                    </label>
                    <input
                      type="number"
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Number(e.target.value))}
                      step="500"
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Dyeing Process
                    </label>
                    <select
                      value={calcDye}
                      onChange={(e) => setCalcDye(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="low_impact_reactive">Low-Impact Reactive Dyes</option>
                      <option value="natural_plant">Natural Plant Bio-Dyes</option>
                      <option value="standard_synthetic">Standard Synthetic Winch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Freight Mode
                    </label>
                    <select
                      value={calcFreight}
                      onChange={(e) => setCalcFreight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="sea">Container Ship (Sea Freight)</option>
                      <option value="air">Air Cargo Freight</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Outputs with Dynamic Animation */}
              <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-6 text-white space-y-4 border border-slate-800">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Live Calculated Passport LCA</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Estimated CO₂e</span>
                    <strong className="text-2xl font-extrabold text-white block mt-1 font-mono">
                      <AnimatedCounter value={totalCarbonTonnes} decimals={2} suffix=" t" />
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-1">↓ 18% below baseline</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Water Footprint</span>
                    <strong className="text-2xl font-extrabold text-cyan-300 block mt-1 font-mono">
                      <AnimatedCounter value={totalWaterLiters} suffix=" L" />
                    </strong>
                    <span className="text-[10px] text-cyan-300 block mt-1">92% ZLD Recycled</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>Sign Up to Issue Passports →</span>
                </motion.button>
              </div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-950 py-12 border-t border-slate-800 text-xs text-slate-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-extrabold text-white tracking-wider font-display">VASTRASETU</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                India's DPI-First Digital Product Passport Platform for Textile MSMEs.
              </p>
            </div>

            <div className="flex items-center gap-6 font-semibold text-slate-300">
              <button onClick={() => navigate('/')} className="hover:text-emerald-400 transition-colors">Home</button>
              <button onClick={() => navigate('/register')} className="hover:text-emerald-400 transition-colors">Sign Up</button>
              <button onClick={() => navigate('/login')} className="hover:text-emerald-400 transition-colors">Login</button>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 VastraSetu Inc. Built for MSME Textile Compliance & ESPR 2026.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>DPDP Consent Framework</span>
            </div>
          </div>
        </div>
      </motion.footer>

    </div>
  );
}
