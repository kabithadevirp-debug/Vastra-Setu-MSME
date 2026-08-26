import React from 'react';
import { CheckCircle2, Clock, Send, FileText } from 'lucide-react';

export function StatusBadge({ status, size = 'md' }) {
  const configs = {
    'PASSPORT_GENERATED': {
      label: 'Passport Issued',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    'PENDING_CETP': {
      label: 'Pending CETP',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      dot: 'bg-amber-500 animate-pulse',
    },
    'PENDING_DYER': {
      label: 'Pending Dyer',
      bg: 'bg-brand-50 text-brand-800 border-brand-200',
      icon: Send,
      dot: 'bg-brand-600 animate-pulse',
    },
    'DRAFT': {
      label: 'Draft Batch',
      bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      icon: FileText,
      dot: 'bg-zinc-400',
    },
  };

  const config = configs[status] || configs['DRAFT'];
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 gap-1.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5 gap-2 font-semibold' 
    : 'text-xs font-semibold px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${sizeClasses} transition-all`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
