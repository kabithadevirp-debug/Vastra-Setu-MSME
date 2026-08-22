import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, ShieldAlert, ArrowRight, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export function OtpVerifyPage({ navigate }) {
  const { pendingRegistration, msme, verifyOtp, loading } = useAuth();
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendStatus, setResendStatus] = useState('');
  const [demoCode, setDemoCode] = useState(pendingRegistration?.demoOtp || '884920');

  const targetAccount = pendingRegistration?.account || msme;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetAccount?.id) {
      setErrorMsg('Account context missing. Please register or sign in again.');
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      await verifyOtp(targetAccount.id, otp.trim());
      navigate('/identity-proof');
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed.');
    }
  };

  const handleResend = async () => {
    setResendStatus('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msmeId: targetAccount?.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      if (data.data?.demoOtp) {
        setDemoCode(data.data.demoOtp);
      }
      setTimeLeft(300);
      setResendStatus('New OTP code generated and sent!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xl overflow-hidden text-center p-8">
        <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-700">
          <KeyRound className="w-7 h-7" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-3">
          Step 1b — Contact Verification
        </span>

        <h1 className="text-xl font-bold text-zinc-900 mb-1">Verify Contact Ownership</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
          We sent a single-use 6-digit verification code to <span className="font-semibold text-zinc-800">{targetAccount?.contactEmail || 'your email'}</span> and mobile phone.
        </p>

        {/* Demo OTP Banner for Hackathon Evaluation */}
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-3 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-900">Hackathon Single-Use Demo OTP:</div>
            <div className="font-mono text-base font-bold text-amber-800 tracking-widest mt-0.5">{demoCode}</div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-left flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {resendStatus && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs text-left flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-center font-mono text-2xl font-bold tracking-widest text-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>Code expires in: <strong className="text-zinc-800">{formatTime(timeLeft)}</strong></span>
            <button
              type="button"
              onClick={handleResend}
              className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Verifying OTP...' : 'Verify Contact & Proceed'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
