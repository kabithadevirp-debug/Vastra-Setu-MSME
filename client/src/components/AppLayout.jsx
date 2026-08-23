import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileUp, 
  QrCode, 
  ShieldCheck, 
  Leaf, 
  User, 
  LogOut, 
  ChevronDown, 
  Plus, 
  Bell, 
  Building2,
  Clock,
  ShieldAlert,
  FileText,
  Landmark,
  Shield,
  Cpu
} from 'lucide-react';

export function AppLayout({ currentPath, navigate, children }) {
  const { msme, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const msmeNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Document Upload', path: '/documents', icon: FileUp },
    { label: 'Passports', path: '/passports', icon: QrCode },
    { label: 'Trust & Compliance', path: '/compliance', icon: ShieldCheck },
    { label: 'Green Growth Twin', path: '/twin', icon: Leaf },
  ];

  const rolePortals = [
    { label: 'Bank / NBFC Portal', path: '/portal/bank', icon: Landmark, role: 'Role 3' },
    { label: 'Government Auditor', path: '/portal/auditor', icon: ShieldAlert, role: 'Role 4' },
    { label: 'System Admin', path: '/portal/admin', icon: Cpu, role: 'Role 5' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col font-sans">
      
      {/* PERSISTENT TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-900/10">
                <span className="text-base">◈</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
                  Vastra<span className="text-emerald-700">Setu</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  DPP Platform
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Active Verification Status Badge */}
              {msme && (
                <button
                  onClick={() => navigate('/verification-status')}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    (msme.status === 'ACTIVE' || msme.status === 'active')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DPI Verified</span>
                </button>
              )}

              {/* New Batch Quick CTA */}
              <button
                onClick={() => navigate('/create-batch')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Passport</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {msme?.businessName ? msme.businessName.charAt(0) : 'M'}
                  </div>
                  <span className="hidden md:inline font-bold text-zinc-900 max-w-[140px] truncate">
                    {msme?.businessName || 'MSME Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2.5 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900 truncate">{msme?.businessName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{msme?.gstin}</p>
                    </div>

                    <button
                      onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>View & Edit Profile</span>
                    </button>

                    <button
                      onClick={() => { navigate('/documents'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Document Upload Status</span>
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

      {/* MAIN BODY WITH SIDEBAR */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION (WEB) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-sm sticky top-22 space-y-4">
            
            {/* SECTION 1: ROLE 1 MSME / PRODUCER */}
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-md">
                Role 1: MSME Producer
              </div>
              {msmeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-sm font-extrabold' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SECTION 2: ROLE PORTALS */}
            <div className="pt-2 border-t border-zinc-100 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Other Platform Portals
              </div>
              {rolePortals.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-sm font-extrabold' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-mono">
                      {item.role}
                    </span>
                  </button>
                );
              })}
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
