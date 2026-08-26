import React, { useState } from 'react';
import { 
  MapPin, 
  Droplets, 
  Factory, 
  Ship, 
  Flag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  ExternalLink,
  Info,
  Building2,
  Calendar,
  Layers,
  Leaf,
  FlaskConical,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SupplyChainStepper({ batch, loading = false, className = '', navigate }) {
  const { setCurrentRole } = useApp() || {};

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6 animate-pulse ${className}`}>
        <div className="flex justify-between items-center">
          <div className="h-3 w-28 bg-zinc-200 rounded"></div>
          <div className="h-3 w-20 bg-zinc-200 rounded"></div>
        </div>
        <div className="flex items-center justify-between gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-xl bg-zinc-200"></div>
              <div className="h-2.5 w-14 bg-zinc-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-28 bg-zinc-100 rounded-xl"></div>
      </div>
    );
  }

  if (!batch) return null;

  // Derive dynamic stage information from real batch data
  const hasOrigin = !!batch.id;
  const hasDyer = !!(batch.dyeingRecord && (batch.dyeingRecord.verifiedBy || batch.dyeingRecord.completedAt || batch.dyeingRecord.certificateNo));
  const hasCetp = !!(batch.cetpRecord && (batch.cetpRecord.verifiedBy || batch.cetpRecord.completedAt || batch.cetpRecord.certificateNo));
  const hasPassport = !!(batch.passport && (batch.status === 'PASSPORT_GENERATED' || batch.passport.id));

  // Compute stage statuses
  const originStatus = hasOrigin ? 'Completed' : 'Pending';
  const dyerStatus = hasDyer ? 'Verified' : 'Pending';
  const cetpStatus = hasCetp ? 'Verified' : 'Pending';
  const portStatus = hasPassport ? 'In Transit' : (hasCetp ? 'Ready for Dispatch' : 'Pending');
  const destinationStatus = hasPassport ? 'In Transit' : 'Pending';

  const stages = [
    {
      id: 'origin',
      stepNum: 1,
      label: 'Origin & Mill',
      shortName: 'Tiruppur (Origin)',
      entityName: batch.yarnSpinningMill || 'Coimbatore Heritage Cotton Mills / Sri Jayavarma Knits',
      stageType: 'Fiber Origin & Yarn Spinning',
      icon: MapPin,
      status: originStatus,
      isDone: hasOrigin,
      location: 'Tiruppur & Coimbatore, Tamil Nadu, India',
      date: batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Aug 2026',
      description: `Raw fiber sourced from certified organic farms, spun at ${batch.yarnSpinningMill?.split('(')[0] || 'Coimbatore Heritage Cotton Mills'}, and knitted into ${batch.weightGsm || 180} GSM fabric.`,
      metrics: [
        { label: 'Fiber Composition', value: batch.fabricDescription || '100% GOTS Certified Organic Cotton' },
        { label: 'GOTS Scope Cert', value: batch.fiberCertificate?.certificateNo || 'CU-841920 Verified' },
      ],
      emptyText: null,
      portalRoute: null,
      portalRole: null
    },
    {
      id: 'dyer',
      stepNum: 2,
      label: 'Wet Processing',
      shortName: batch.dyerName ? batch.dyerName.split(' ')[0] + ' Dyers' : 'Dyer Partner',
      entityName: batch.dyerName || 'Rainbow Eco-Dyers Tiruppur',
      stageType: 'Wet Processing & Dyeing',
      icon: Droplets,
      status: dyerStatus,
      isDone: hasDyer,
      location: 'Veerapandi Industrial Estate, Tiruppur',
      date: batch.dyeingRecord?.completedAt 
        ? new Date(batch.dyeingRecord.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
        : (hasDyer ? '18 Aug 2026' : null),
      description: hasDyer
        ? (batch.dyeingRecord?.notes || `${batch.dyeingRecord?.dyeProcessName || 'Energy-efficient Cold Pad Batch (CPB)'} with OEKO-TEX Standard 100 Class I chemical safety compliance.`)
        : 'Wet processing facility has not yet submitted dyeing recipe parameters and OEKO-TEX test certificates.',
      metrics: hasDyer ? [
        { label: 'Dye Process & Temp', value: `${batch.dyeingRecord?.dyeProcessName ? 'CPB Eco-Dyeing' : 'Reactive Dyeing'} (${batch.dyeingRecord?.temperatureC || 60}°C)` },
        { label: 'Chemical Safety', value: batch.dyeingRecord?.chemicalCompliance || 'OEKO-TEX Standard 100 Class I & ZDHC MRSL' },
      ] : [],
      emptyText: 'Awaiting Dyeing Partner Verification — The dyehouse has not yet uploaded chemical compliance certificates.',
      portalRoute: '/portal/dyer',
      portalRole: 'dyer',
      portalLabel: 'Open Dyer Verification Portal →'
    },
    {
      id: 'cetp',
      stepNum: 3,
      label: 'CETP (ZLD)',
      shortName: batch.cetpName ? batch.cetpName.split(' ')[0] + ' CETP' : 'Arulpuram CETP',
      entityName: batch.cetpName || 'Arulpuram Common Effluent Treatment Plant (Unit 3)',
      stageType: 'Zero Liquid Discharge Water Treatment',
      icon: Factory,
      status: cetpStatus,
      isDone: hasCetp,
      location: 'Arulpuram Industrial Area, Tiruppur',
      date: batch.cetpRecord?.completedAt 
        ? new Date(batch.cetpRecord.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
        : (hasCetp ? '19 Aug 2026' : null),
      description: hasCetp
        ? (batch.cetpRecord?.notes || `Closed-loop Zero Liquid Discharge effluent treatment with ${batch.cetpRecord?.waterRecycledPercent || 92}% water recovery via Membrane Bio-Reactor (MBR), Reverse Osmosis (RO), and Multi-Effect Evaporator (MEE).`)
        : 'CETP facility has not yet confirmed effluent treatment and zero liquid discharge water clearance.',
      metrics: hasCetp ? [
        { label: 'Closed-Loop Water Recovery', value: `${batch.cetpRecord?.waterRecycledPercent || 92}% Process Water Recycled` },
        { label: 'TNPCB Consent Order', value: batch.cetpRecord?.certificateNo || 'TNPCB-CETP-ZLD-BATCH-8842' },
      ] : [],
      emptyText: 'Awaiting CETP Verification — Effluent water recycling and ZLD clearance have not been certified yet.',
      portalRoute: '/portal/cetp',
      portalRole: 'cetp',
      portalLabel: 'Open CETP ZLD Verification Portal →'
    },
    {
      id: 'port',
      stepNum: 4,
      label: 'Freight & Port',
      shortName: `Port of ${batch.destinationPort ? batch.destinationPort.charAt(0).toUpperCase() + batch.destinationPort.slice(1) : 'Hamburg'}`,
      entityName: `Chennai / Tuticorin Port → Port of ${(batch.destinationPort || 'hamburg').toUpperCase()}`,
      stageType: 'Maritime Freight & Customs Clearance',
      icon: Ship,
      status: portStatus,
      isDone: hasPassport,
      location: `Enroute to ${(batch.destinationPort || 'hamburg').toUpperCase()}, ${batch.targetCountry || 'Germany'}`,
      date: hasPassport ? '20 Aug 2026' : null,
      description: hasPassport
        ? `Consignment cleared for export with attached Digital Product Passport QR tags. Shipped via ${batch.freightMode === 'air' ? 'Air Cargo' : 'Low-Carbon Container Vessel (Sea Freight)'} to minimize transport emissions.`
        : 'Export customs documentation and port dispatch will be scheduled upon passport generation.',
      metrics: hasPassport ? [
        { label: 'Freight Mode', value: batch.freightMode === 'air' ? 'Air Freight' : 'Container Vessel (Sea Freight)' },
        { label: 'Transport Distance', value: 'approx. 10,800 nautical km' },
      ] : [],
      emptyText: 'Pending Export Dispatch — Shipment will be queued once all supplier verifications are completed.',
      portalRoute: null,
      portalRole: null
    },
    {
      id: 'destination',
      stepNum: 5,
      label: 'Destination',
      shortName: batch.targetCountry || 'Germany',
      entityName: `${batch.buyerName || 'European Fashion Importer'} Distribution Hub`,
      stageType: 'EU Retail & Consumer Distribution',
      icon: Flag,
      status: destinationStatus,
      isDone: hasPassport,
      location: `${batch.targetCountry || 'Germany'} (EU Single Market)`,
      date: hasPassport ? 'Scheduled Delivery' : null,
      description: hasPassport
        ? `Final delivery to ${batch.buyerName || 'European Buyer'} in ${batch.targetCountry || 'Germany'}. Consumers and customs authorities can scan the attached DPP QR code for full provenance and circularity guidance.`
        : 'Destination receipt will be tracked upon container arrival at destination port.',
      metrics: hasPassport ? [
        { label: 'Buyer & Brand', value: batch.buyerName || 'Inditex / Zara Europe' },
        { label: 'EU DPP Compliance', value: 'ESPR 2026 Compliant ✓' },
      ] : [],
      emptyText: 'Pending Arrival — Final delivery occurs following customs clearance at destination port.',
      portalRoute: null,
      portalRole: null
    }
  ];

  // Default active stage: find first pending stage or last completed stage
  const defaultStageIndex = stages.findIndex(s => !s.isDone);
  const initialActiveId = defaultStageIndex !== -1 
    ? (defaultStageIndex > 0 ? stages[defaultStageIndex].id : stages[0].id)
    : stages[stages.length - 1].id;

  const [activeStageId, setActiveStageId] = useState(initialActiveId);
  const activeStage = stages.find(s => s.id === activeStageId) || stages[0];

  const completedCount = stages.filter(s => s.isDone).length;
  const progressPercent = Math.min(100, Math.max(0, ((completedCount - 1) / (stages.length - 1)) * 100));

  const handlePortalNavigation = (route, role) => {
    if (setCurrentRole && role) {
      setCurrentRole(role);
    }
    if (navigate) {
      navigate(route);
    } else {
      window.location.href = route;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{status}</span>
          </span>
        );
      case 'In Transit':
      case 'Ready for Dispatch':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Truck className="w-3 h-3 text-amber-600" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500 border border-zinc-200">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className={`bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6 ${className}`}>
      
      {/* Header Eyebrow */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Interactive Supply Chain Route
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
            Click Stage for Details
          </span>
        </div>
        <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
          {completedCount} of 5 Stages Verified
        </span>
      </div>

      {/* Stepper Track with Nodes */}
      <div className="relative pt-2 pb-1 overflow-x-auto scrollbar-none">
        
        {/* Connecting Progress Track Line */}
        <div className="absolute left-6 right-6 top-[28px] h-1 bg-zinc-100 rounded-full z-0">
          <div 
            className="h-full bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5 Clickable Nodes */}
        <div className="flex items-start justify-between min-w-[540px] sm:min-w-0 relative z-10 gap-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = stage.id === activeStageId;
            const isDone = stage.isDone;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`group flex flex-col items-center text-center flex-1 transition-all duration-200 focus:outline-none ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                {/* Node Circle */}
                <div 
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                    isSelected
                      ? 'bg-brand-700 text-white ring-4 ring-brand-100 shadow-md shadow-brand-700/20'
                      : isDone
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-100 hover:bg-emerald-700'
                      : stage.status === 'In Transit'
                      ? 'bg-amber-500 text-white ring-2 ring-amber-100'
                      : 'bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Label */}
                <span className={`text-[11px] font-bold mt-2 whitespace-nowrap transition-colors ${
                  isSelected ? 'text-brand-900 font-extrabold' : isDone ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  {stage.label}
                </span>

                {/* Short Entity Pill */}
                <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[90px] block mt-0.5">
                  {stage.shortName}
                </span>

                {/* Status Indicator Dot */}
                <div className="mt-1.5">
                  {isDone ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ✓ Done
                    </span>
                  ) : stage.status === 'In Transit' ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 animate-pulse">
                      In Transit
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded">
                      Pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Dynamic Detail Panel for Selected Stage */}
      <div className="bg-zinc-50/90 rounded-2xl p-5 border border-zinc-200 transition-all duration-200 ease-in-out animate-in fade-in space-y-4">
        
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Stage {activeStage.stepNum}: {activeStage.stageType}
              </span>
              {getStatusBadge(activeStage.status)}
            </div>
            <h4 className="font-display font-extrabold text-base text-zinc-900 pt-1">
              {activeStage.entityName}
            </h4>
          </div>

          <div className="text-left sm:text-right text-xs text-zinc-500 space-y-0.5">
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{activeStage.location}</span>
            </div>
            {activeStage.date && (
              <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-zinc-400 font-mono">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>Verified: {activeStage.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description / Summary */}
        <p className="text-xs text-zinc-600 leading-relaxed">
          {activeStage.description}
        </p>

        {/* Pending Notice & Direct Portal Action Button */}
        {!activeStage.isDone && activeStage.emptyText && (
          <div className="p-4 bg-amber-50/90 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{activeStage.emptyText}</span>
            </div>

            {activeStage.portalRoute && (
              <button
                type="button"
                onClick={() => handlePortalNavigation(activeStage.portalRoute, activeStage.portalRole)}
                className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{activeStage.portalLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* 2 Stage-Specific Metrics (Only if data exists) */}
        {activeStage.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {activeStage.metrics.map((metric, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-zinc-200 text-xs flex items-center justify-between">
                <span className="text-zinc-500 font-medium">{metric.label}:</span>
                <strong className="text-zinc-900 font-semibold font-mono text-[11px] ml-2 text-right">
                  {metric.value}
                </strong>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Helpful Portal Quick Shortcut Strip */}
      <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <strong className="text-brand-900 font-extrabold block">Multi-Stakeholder Verification Portals:</strong>
          <p className="text-brand-700 text-[11px]">
            Switch roles to test supplier submissions & approvals in real time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => handlePortalNavigation('/portal/dyer', 'dyer')}
            className="px-3 py-1.5 bg-white border border-brand-300 hover:bg-brand-100 text-brand-800 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-2xs"
          >
            <span>Dyer Portal</span>
            <ArrowRight className="w-3 h-3 text-brand-600" />
          </button>
          <button
            onClick={() => handlePortalNavigation('/portal/cetp', 'cetp')}
            className="px-3 py-1.5 bg-white border border-brand-300 hover:bg-brand-100 text-brand-800 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-2xs"
          >
            <span>CETP Portal</span>
            <ArrowRight className="w-3 h-3 text-brand-600" />
          </button>
        </div>
      </div>

    </div>
  );
}
