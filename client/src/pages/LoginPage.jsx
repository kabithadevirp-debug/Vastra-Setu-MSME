import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';

export function LoginPage({ navigate, onLoggedIn }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your GSTIN/Email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Invoke AuthContext login to update global msme state
      const data = await login(identifier.trim(), password);
      const account = data.account || data;
      
      if (onLoggedIn) {
        onLoggedIn(account);
      }

      // Account Status Redirect Logic
      const status = (account?.status || '').toLowerCase();

      if (status === 'active') {
        navigate('/dashboard');
      } else if (status === 'pending_verification') {
        navigate('/verify-otp', { state: { msmeId: account.id } });
      } else if (status === 'verification_in_progress') {
        navigate('/identity-proof', { state: { msmeId: account.id } });
      } else if (status === 'verification_failed') {
        navigate('/verification-status', { state: { msmeId: account.id, status: 'rejected' } });
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setErrorMsg(err.message || 'Invalid GSTIN/Email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-slate-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-extrabold text-white tracking-wider">VASTRASETU</span>
        </div>
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enter your credentials to access your Digital Product Passports
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10 backdrop-blur-xl space-y-6">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Identifier Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                GSTIN / Email Address / Phone *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="33AAACJ1928A1Z5 or email@company.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact your MSME admin or support@vastrasetu.in to reset your password.')}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-900 rounded-xl border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400">
              New to VastraSetu?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
