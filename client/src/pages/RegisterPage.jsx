import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';

export function RegisterPage({ navigate, onRegistered }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    address: '',
    sector: 'Textiles & Apparel',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // GSTIN Pattern Regex: 2 digits + 5 letters + 4 digits + 1 letter + 1 char + Z + 1 char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password Strength Calculation
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
    if (score <= 3) return { score: 65, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const pwdStrength = calculatePasswordStrength(formData.password);

  const validateField = (name, value) => {
    let err = '';
    if (name === 'businessName' && !value.trim()) {
      err = 'Business name is required.';
    } else if (name === 'gstin') {
      const cleanGstin = value.trim().toUpperCase();
      if (!cleanGstin) {
        err = 'GSTIN is required.';
      } else if (cleanGstin.length !== 15) {
        err = 'GSTIN must be exactly 15 characters.';
      } else if (!gstinRegex.test(cleanGstin)) {
        err = 'Invalid GSTIN format (e.g. 33AAACJ1928A1Z5).';
      }
    } else if (name === 'contactName' && !value.trim()) {
      err = 'Contact person name is required.';
    } else if (name === 'contactEmail') {
      if (!value.trim()) {
        err = 'Contact email is required.';
      } else if (!emailRegex.test(value.trim())) {
        err = 'Please enter a valid email address.';
      }
    } else if (name === 'contactPhone' && !value.trim()) {
      err = 'Phone number is required.';
    } else if (name === 'password') {
      if (!value) {
        err = 'Password is required.';
      } else if (value.length < 8) {
        err = 'Password must be at least 8 characters long.';
      }
    } else if (name === 'confirmPassword') {
      if (value !== formData.password) {
        err = 'Passwords do not match.';
      }
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (type !== 'checkbox') {
      validateField(name, val);
    } else if (name === 'agreeTerms') {
      setErrors(prev => ({ ...prev, agreeTerms: val ? '' : 'You must agree to the Terms & Privacy Policy to proceed.' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Run full validation
    const newErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.gstin.trim()) {
      newErrors.gstin = 'GSTIN is required.';
    } else if (!gstinRegex.test(formData.gstin.trim().toUpperCase())) {
      newErrors.gstin = 'Invalid GSTIN format (e.g. 33AAACJ1928A1Z5).';
    }
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact person name is required.';
    if (!formData.contactEmail.trim() || !emailRegex.test(formData.contactEmail.trim())) {
      newErrors.contactEmail = 'Valid email is required.';
    }
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required.';
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy to proceed.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        businessName: formData.businessName.trim(),
        gstin: formData.gstin.trim().toUpperCase(),
        address: formData.address.trim() || 'Tiruppur Textile Cluster',
        sector: formData.sector,
        contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim().toLowerCase(),
        contactPhone: formData.contactPhone.trim(),
        password: formData.password,
      };

      const result = await register(payload);
      
      if (onRegistered) {
        onRegistered(result);
      }

      // Route to OTP verification page
      const accountId = result.account?.id || result.id;
      navigate('/verify-otp', { state: { msmeId: accountId, demoOtp: result.demoOtp } });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-slate-950">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-extrabold text-white tracking-wider">VASTRASETU</span>
        </div>
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          Create MSME Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enter your official business details to begin DPI-verified onboarding
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10 backdrop-blur-xl space-y-6">
          
          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Registration Error</strong>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Official Business Name *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Sri Jayavarma Knits & Exports Pvt Ltd"
                  className={`block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.businessName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.businessName && <p className="mt-1 text-[11px] text-red-400">{errors.businessName}</p>}
            </div>

            {/* GSTIN & Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  15-Digit GSTIN *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    maxLength={15}
                    placeholder="e.g. 33AAACJ1928A1Z5"
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border text-xs font-mono font-bold uppercase text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.gstin ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                {errors.gstin && <p className="mt-1 text-[11px] text-red-400">{errors.gstin}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Industry Sector
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Textiles & Apparel">Textiles & Apparel</option>
                  <option value="Yarn & Spinning">Yarn & Spinning</option>
                  <option value="Dyeing & Processing">Dyeing & Processing</option>
                  <option value="Garment Export">Garment Export</option>
                </select>
              </div>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Person Name *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Jayavarma"
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.contactName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                {errors.contactName && <p className="mt-1 text-[11px] text-red-400">{errors.contactName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98422 10982"
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.contactPhone ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                {errors.contactPhone && <p className="mt-1 text-[11px] text-red-400">{errors.contactPhone}</p>}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Contact Email Address *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="ramesh@jayavarmaknits.com"
                  className={`block w-full pl-10 pr-4 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.contactEmail ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                  }`}
                />
              </div>
              {errors.contactEmail && <p className="mt-1 text-[11px] text-red-400">{errors.contactEmail}</p>}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-10 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${pwdStrength.color}`} style={{ width: `${pwdStrength.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold ${pwdStrength.text}`}>Strength: {pwdStrength.label}</span>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-10 py-3 bg-slate-900 rounded-xl border text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-400">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                />
                <span className="text-xs text-slate-400 leading-normal">
                  I agree to the <span className="text-emerald-400 font-medium">Terms & Conditions</span>, <span className="text-emerald-400 font-medium">Privacy Policy</span>, and DPDP Consent Framework for DPI verification.
                </span>
              </label>
              {errors.agreeTerms && <p className="mt-1 text-[11px] text-red-400">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Verify Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Log in here
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
