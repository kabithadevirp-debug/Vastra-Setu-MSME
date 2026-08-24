import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export function AccessDeniedPage({ navigate, requiredRole = 'Authorized Portal Users Only' }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            HTTP 403 Forbidden
          </span>
          <h2 className="font-display font-extrabold text-2xl text-zinc-900 pt-1">
            Access Denied
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Your current logged-in account does not have authorization to view this portal.
          </p>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-left text-xs space-y-1 font-mono text-zinc-700">
          <div><span className="text-zinc-400">Required Role:</span> <strong>{requiredRole}</strong></div>
          <div><span className="text-zinc-400">Access Mode:</span> <strong className="text-rose-600">STRICT PRODUCTION RBAC</strong></div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to MSME Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log In as Authorized Portal User</span>
          </button>
        </div>
      </div>
    </div>
  );
}
