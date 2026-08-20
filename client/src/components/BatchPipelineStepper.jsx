import React from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';

export function BatchPipelineStepper({ batch, compact = false }) {
  if (!batch) return null;

  // Determine current stage: 1 to 5
  // 1: Created (DRAFT / PENDING_DYER without dyer data)
  // 2: Dyeing Verified (PENDING_CETP or has dyeingRecord)
  // 3: CETP Verified (has cetpRecord)
  // 4: Footprint Calculated
  // 5: Passport Issued (status === 'PASSPORT_GENERATED')
  
  let currentStage = 1;
  if (batch.status === 'PASSPORT_GENERATED' || batch.passport) {
    currentStage = 5;
  } else if (batch.cetpRecord) {
    currentStage = 4;
  } else if (batch.dyeingRecord || batch.status === 'PENDING_CETP') {
    currentStage = 3;
  } else if (batch.status === 'PENDING_DYER') {
    currentStage = 2;
  }

  const steps = [
    { id: 1, label: 'Batch Created' },
    { id: 2, label: 'Dyeing Verified' },
    { id: 3, label: 'CETP Verified' },
    { id: 4, label: 'Footprint Calculated' },
    { id: 5, label: 'Passport Issued' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-medium">
        {steps.map((step, idx) => {
          const isDone = step.id < currentStage || (currentStage === 5);
          const isCurrent = step.id === currentStage && currentStage !== 5;
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-1">
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : isCurrent ? (
                  <span className="w-4 h-4 rounded-full bg-brand-700 text-white flex items-center justify-center text-[9px] font-bold animate-pulse shadow-glow-purple">
                    ◉
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-zinc-200 text-zinc-400 flex items-center justify-center text-[9px]">
                    ○
                  </span>
                )}
                <span className={isDone ? 'text-zinc-800 font-semibold' : isCurrent ? 'text-brand-700 font-bold' : 'text-zinc-400'}>
                  {step.label.split(' ')[0]}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <span className="text-zinc-300 text-xs">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting Track Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-100 -z-0 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-brand-700 to-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${((Math.min(currentStage, 5) - 1) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isDone = step.id < currentStage || (currentStage === 5);
          const isCurrent = step.id === currentStage && currentStage !== 5;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-100'
                    : isCurrent
                    ? 'bg-brand-700 text-white ring-4 ring-brand-100 animate-pulse'
                    : 'bg-white text-zinc-400 border border-zinc-200'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${
                  isDone
                    ? 'text-zinc-800 font-semibold'
                    : isCurrent
                    ? 'text-brand-700 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
