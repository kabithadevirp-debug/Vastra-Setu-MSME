import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Layers, 
  Plus, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronDown, 
  Truck, 
  Sparkles, 
  Building2, 
  Zap,
  FlaskConical,
  Droplets,
  Landmark,
  ShieldAlert,
  FileText,
  Activity,
  Award,
  TrendingUp,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export function AppLayout({ currentPath, navigate, children }) {
  const { msme, logout } = useAuth();
  const { currentRole } = useApp() || {};
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Determine active role dynamically
  const activeRole = currentRole || msme?.role || (
    currentPath.startsWith('/portal/dyer') || currentPath === '/dyer' ? 'dyer' :
    currentPath.startsWith('/portal/cetp') || currentPath === '/cetp' ? 'cetp' :
    currentPath.startsWith('/portal/bank') || currentPath === '/bank' ? 'bank' :
    currentPath.startsWith('/portal/auditor') || currentPath === '/govt-audit' ? 'auditor' :
    'msme'
  );

  const roleConfigs = {
    msme: {
      workspaceTitle: 'Exporter Workspace',
      badgeLabel: 'Textile Exporter',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeIcon: ShieldCheck,
      ctaLabel: '+ New Batch',
      ctaIcon: Plus,
      ctaAction: () => navigate('/create-batch'),
      helperTitle: 'Consistency Check',
      helperText: 'Every garment batch links configurable production stages with OCR-extracted certificates.',
      navItems: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Green Growth Twin', path: '/twin', icon: Zap },
        { label: 'Garment Batches', path: '/batches', icon: Layers },
        { label: 'Document Vault', path: '/vault', icon: ShieldCheck },
        { label: '+ Create Batch', path: '/create-batch', icon: Plus },
        { label: 'Bank Snapshot', path: '/bank-snapshot', icon: Building2 },
        { label: 'Govt Audit View', path: '/govt-audit', icon: Truck },
      ]
    },
    dyer: {
      workspaceTitle: 'Dyeing Partner Workspace',
      badgeLabel: 'Dyeing Partner Facility',
      badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      badgeIcon: FlaskConical,
      ctaLabel: '+ Verify Dyeing Batch',
      ctaIcon: FlaskConical,
      ctaAction: () => navigate('/portal/dyer'),
      helperTitle: 'OEKO-TEX & ZDHC MRSL',
      helperText: 'Azo-free eco pad-batch recipe compliance with 100% biomass boiler operation.',
      navItems: [
        { label: 'Batch Dyeing Queue', path: '/portal/dyer', icon: FlaskConical },
        { label: 'Chemical & Dyestuff', path: '/portal/dyer?tab=inventory', icon: Droplets },
        { label: 'OEKO-TEX & ZDHC', path: '/portal/dyer?tab=compliance', icon: ShieldCheck },
        { label: 'Dyeing Audit Logs', path: '/portal/dyer?tab=logs', icon: FileText },
      ]
    },
    cetp: {
      workspaceTitle: 'CETP ZLD Workspace',
      badgeLabel: 'CETP ZLD Plant Operator',
      badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      badgeIcon: Droplets,
      ctaLabel: '+ Log ZLD Clearance',
      ctaIcon: Droplets,
      ctaAction: () => navigate('/portal/cetp'),
      helperTitle: '100% ZLD Compliance',
      helperText: 'Membrane Bio-Reactor (MBR) + Multi-Effect Evaporator (MEE) salt recovery.',
      navItems: [
        { label: 'Effluent Clearance Queue', path: '/portal/cetp', icon: Droplets },
        { label: 'Live RO & MEE Monitor', path: '/portal/cetp?tab=monitor', icon: Activity },
        { label: 'TNPCB ZLD Consent Order', path: '/portal/cetp?tab=consent', icon: ShieldCheck },
        { label: 'Water Recovery Ledger', path: '/portal/cetp?tab=records', icon: FileText },
      ]
    },
    bank: {
      workspaceTitle: 'Green Finance Workspace',
      badgeLabel: 'Bank / NBFC Underwriter',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeIcon: Landmark,
      ctaLabel: '+ Underwrite Green Loan',
      ctaIcon: TrendingUp,
      ctaAction: () => navigate('/portal/bank'),
      helperTitle: 'SIDBI Green Loan Scheme',
      helperText: 'Automatic 1.25% p.a. interest concession for MSMEs with Trust Score ≥ 90.',
      navItems: [
        { label: 'Green Credit Directory', path: '/portal/bank', icon: Landmark },
        { label: 'ESG Risk Scorecards', path: '/portal/bank?tab=risk', icon: Award },
        { label: 'Sanctioned Facilities', path: '/portal/bank?tab=sanctions', icon: TrendingUp },
        { label: 'RBI Green Finance Audit', path: '/portal/bank?tab=reports', icon: FileText },
      ]
    },
    auditor: {
      workspaceTitle: 'Government Audit Workspace',
      badgeLabel: 'Regulatory Auditor',
      badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
      badgeIcon: ShieldAlert,
      ctaLabel: 'Export Regional CSV',
      ctaIcon: FileText,
      ctaAction: () => alert('Exporting TNPCB Regulatory Audit Trail CSV...'),
      helperTitle: 'TNPCB & CPCB Oversight',
      helperText: 'Real-time cryptographic anomaly checks against claimed volume vs TNEB kWh usage.',
      navItems: [
        { label: 'Regional Compliance Grid', path: '/portal/auditor', icon: ShieldAlert },
        { label: 'Fraud & Anomaly Queue', path: '/portal/auditor?tab=fraud', icon: AlertTriangle },
        { label: 'Statutory Registry (IEC)', path: '/portal/auditor?tab=registry', icon: Building2 },
        { label: 'Cluster ZLD Heatmap', path: '/portal/auditor?tab=heatmap', icon: Layers },
      ]
    }
  };

  const config = roleConfigs[activeRole] || roleConfigs.msme;
  const BadgeIcon = config.badgeIcon;
  const CtaIcon = config.ctaIcon;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col font-sans">
      
      {/* PERSISTENT TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                if (activeRole === 'dyer') navigate('/portal/dyer');
                else if (activeRole === 'cetp') navigate('/portal/cetp');
                else if (activeRole === 'bank') navigate('/portal/bank');
                else if (activeRole === 'auditor') navigate('/portal/auditor');
                else navigate('/dashboard');
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-900/10">
                <span className="text-base">◈</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
                  Vastra<span className="text-emerald-700">Setu</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  DPP Platform
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Role Indicator Badge */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${config.badgeStyle}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{config.badgeLabel}</span>
              </div>

              {/* Role CTA Button */}
              <button
                onClick={config.ctaAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
              >
                <CtaIcon className="w-3.5 h-3.5" />
                <span>{config.ctaLabel}</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {msme?.businessName ? msme.businessName.charAt(0) : 'U'}
                  </div>
                  <span className="hidden md:inline font-bold text-zinc-900 max-w-[140px] truncate">
                    {msme?.businessName || config.badgeLabel}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900 truncate">{msme?.businessName || config.badgeLabel}</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{msme?.gstin || config.badgeLabel}</p>
                    </div>

                    <button
                      onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Security & Profile Settings</span>
                    </button>

                    <div className="border-t border-zinc-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* MAIN BODY WITH ROLE-SPECIFIC SIDEBAR */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-3 border border-zinc-200 shadow-xs sticky top-22 space-y-3">
            
            <div className="space-y-1">
              <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${config.badgeStyle}`}>
                {config.workspaceTitle}
              </div>

              {config.navItems.map((item) => {
                const Icon = item.icon;
                const currentFullPath = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : currentPath;
                const isActive = currentPath === item.path || 
                  currentFullPath === item.path ||
                  (item.path === '/dashboard' && currentPath === '/') ||
                  (item.path === '/batches' && currentPath.startsWith('/batches/')) ||
                  (item.path === '/portal/dyer' && currentPath === '/portal/dyer' && (!window.location.search || window.location.search === '?tab=queue')) ||
                  (item.path === '/portal/cetp' && currentPath === '/portal/cetp' && (!window.location.search || window.location.search === '?tab=queue')) ||
                  (item.path === '/portal/bank' && currentPath === '/portal/bank' && (!window.location.search || window.location.search === '?tab=directory')) ||
                  (item.path === '/portal/auditor' && currentPath === '/portal/auditor' && (!window.location.search || window.location.search === '?tab=leaderboard'));

                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive 
                        ? 'bg-indigo-700 text-white shadow-xs font-extrabold' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Consistency Helper Badge */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs space-y-1 text-zinc-600">
              <div className="flex items-center gap-1 font-bold text-zinc-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{config.helperTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-snug">
                {config.helperText}
              </p>
            </div>

          </div>
        </aside>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}
