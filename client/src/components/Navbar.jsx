import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { 
  ChevronDown, 
  RotateCcw, 
  Layers, 
  QrCode, 
  BarChart3, 
  Plus, 
  Bell,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FlaskConical,
  Droplets,
  ScanLine,
  X
} from 'lucide-react';

export function Navbar({ currentPath, navigate }) {
  const { currentRole, setCurrentRole, activeRoleConfig, batches, resetDemo } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const completedBatch = batches.find(b => b.passport) || batches[0];
  const completedPassportId = completedBatch?.passport?.id || 'DPP-VS-2026-00892';

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Batches', path: '/batches' },
    { label: 'Passports', path: `/passport/${completedBatch?.id || 'VS-2026-0042'}` },
    { label: 'Sustainability', path: '/analytics' },
  ];

  const notifications = [
    { id: 1, title: 'CETP data verified', batch: 'VS-2026-0042', time: '2 min ago', type: 'success' },
    { id: 2, title: 'OEKO-TEX certificate verified', batch: 'VS-2026-0041', time: '15 min ago', type: 'success' },
    { id: 3, title: 'OEKO-TEX renewal reminder (30 days)', batch: 'Facility Lic #091', time: '1 day ago', type: 'warning' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-900/10">
              <span className="text-base">◈</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
                  Vastra<span className="text-brand-700">Setu</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  DPP
                </span>
              </div>
            </div>
          </div>

          {/* 4 Core Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || 
                (item.path === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard')) ||
                (item.label === 'Batches' && (currentPath === '/batches' || currentPath.startsWith('/batches/'))) ||
                (item.label === 'Passports' && (currentPath.startsWith('/passport') || currentPath.startsWith('/verify')));

              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-brand-700 bg-brand-50 font-bold' 
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Notifications + Persona Pill + Reset Demo + Create Batch */}
          <div className="flex items-center gap-2.5">
            
            {/* New Batch Button */}
            <button
              onClick={() => navigate('/create-batch')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-2 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">Notifications</span>
                    <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">3 New</span>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-zinc-50 transition-colors flex items-start gap-2.5 text-xs">
                        {n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-zinc-800 leading-tight">{n.title}</p>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">{n.batch} • {n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all shadow-sm"
              >
                <span className="text-zinc-400 font-normal hidden lg:inline">Viewing as:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  <strong className="text-zinc-900">{activeRoleConfig.name.split(' ')[0]}</strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-zinc-100 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Switch Demo Role</p>
                  </div>
                  {Object.values(ROLES).map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setCurrentRole(role.id);
                        setRoleDropdownOpen(false);
                        if (role.id === 'msme') navigate('/dashboard');
                        else if (role.id === 'dyer') navigate('/portal/dyer');
                        else if (role.id === 'cetp') navigate('/portal/cetp');
                        else if (role.id === 'buyer') navigate(`/verify/${completedPassportId}`);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        currentRole === role.id ? 'bg-brand-50 text-brand-900 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {role.id === 'msme' && <Building2 className="w-3.5 h-3.5 text-brand-700" />}
                        {role.id === 'dyer' && <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />}
                        {role.id === 'cetp' && <Droplets className="w-3.5 h-3.5 text-cyan-600" />}
                        {role.id === 'buyer' && <ScanLine className="w-3.5 h-3.5 text-zinc-700" />}
                        <span>{role.name}</span>
                      </div>
                      {currentRole === role.id && (
                        <span className="text-[10px] font-bold text-brand-700">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Demo State Button */}
            <button
              onClick={resetDemo}
              title="Reset demo data back to initial seeds"
              className="p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-brand-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
