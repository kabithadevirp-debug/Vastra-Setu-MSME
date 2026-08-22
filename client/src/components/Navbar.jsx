import React, { useState } from 'react';
import { useApp, ROLES } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronDown, 
  RotateCcw, 
  Plus, 
  Bell,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FlaskConical,
  Droplets,
  ScanLine,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Clock,
  LogOut,
  User,
  FileCheck2,
  Lock,
  UserPlus
} from 'lucide-react';

export function Navbar({ currentPath, navigate }) {
  const { currentRole, setCurrentRole, activeRoleConfig, batches, resetDemo } = useApp();
  const { msme, logout } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const completedBatch = batches.find(b => b.passport) || batches[0];

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Batches', path: '/batches' },
    { label: 'Passports', path: `/passport/${completedBatch?.id || 'VS-2026-0042'}` },
    { label: 'Sustainability', path: '/analytics' },
  ];

  const notifications = [
    { id: 1, title: 'Udyam & GST Verification Complete', batch: 'MSME Verified', time: 'Just now', type: 'success' },
    { id: 2, title: 'CETP Zero Liquid Discharge verified', batch: 'VS-2026-0042', time: '15 min ago', type: 'success' },
    { id: 3, title: 'OEKO-TEX renewal reminder (30 days)', batch: 'Facility Lic #091', time: '1 day ago', type: 'warning' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(msme ? '/dashboard' : '/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-900/10">
              <span className="text-base">◈</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
                  Vastra<span className="text-emerald-700">Setu</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  DPP
                </span>
              </div>
            </div>
          </div>

          {/* 4 Core Navigation Items (LOGGED IN USERS ONLY) */}
          {msme && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path || 
                  (item.path === '/dashboard' && (currentPath === '/dashboard')) ||
                  (item.label === 'Batches' && (currentPath === '/batches' || currentPath.startsWith('/batches/'))) ||
                  (item.label === 'Passports' && (currentPath.startsWith('/passport') || currentPath.startsWith('/verify')));

                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-emerald-800 bg-emerald-50 font-bold' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Account Verification Status Badge (ONLY WHEN LOGGED IN) */}
            {msme && (
              <button
                onClick={() => navigate('/verification-status')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  (msme.status === 'ACTIVE' || msme.status === 'active')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : (msme.status === 'VERIFICATION_FAILED' || msme.status === 'verification_failed')
                    ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {(msme.status === 'ACTIVE' || msme.status === 'active') ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified MSME</span>
                  </>
                ) : (msme.status === 'VERIFICATION_FAILED' || msme.status === 'verification_failed') ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Verification Failed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending Proofs</span>
                  </>
                )}
              </button>
            )}

            {/* New Batch Button */}
            {msme && (
              <button
                onClick={() => navigate('/create-batch')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-all hover:shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Batch</span>
              </button>
            )}

            {/* Notifications Bell (Logged In Only) */}
            {msme && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in">
                    <div className="px-3.5 py-2 border-b border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">Notifications</span>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">3 New</span>
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
            )}

            {/* LOGGED IN USER PROFILE MENU */}
            {msme ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {msme.businessName ? msme.businessName.charAt(0) : 'M'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in">
                    <div className="px-3.5 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900 truncate">{msme.businessName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">{msme.gstin}</p>
                    </div>

                    <button
                      onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>View & Edit Profile</span>
                    </button>

                    <button
                      onClick={() => { navigate('/identity-proof'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Identity Proof Documents</span>
                    </button>

                    <div className="border-t border-zinc-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* LOGGED OUT / UNAUTHENTICATED USER BUTTONS */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-bold text-xs transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
