import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { showToast } = useApp();
  const [token, setToken] = useState(() => localStorage.getItem('vastrasetu_jwt') || null);
  const [msme, setMsme] = useState(() => {
    const saved = localStorage.getItem('vastrasetu_account');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(() => {
    const saved = localStorage.getItem('vastrasetu_pending');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('vastrasetu_jwt', token);
    } else {
      localStorage.removeItem('vastrasetu_jwt');
    }
  }, [token]);

  useEffect(() => {
    if (msme) {
      localStorage.setItem('vastrasetu_account', JSON.stringify(msme));
    } else {
      localStorage.removeItem('vastrasetu_account');
    }
  }, [msme]);

  useEffect(() => {
    if (pendingRegistration) {
      localStorage.setItem('vastrasetu_pending', JSON.stringify(pendingRegistration));
    } else {
      localStorage.removeItem('vastrasetu_pending');
    }
  }, [pendingRegistration]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Invalid GSTIN/Email or password.');
      }
      setToken(data.data.accessToken);
      setMsme(data.data.account);
      showToast('Logged in successfully!', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Registration failed.');
      }
      setPendingRegistration({
        account: data.data.account,
        otpId: data.data.otpId,
        demoOtp: data.data.demoOtp,
      });
      setMsme(data.data.account);
      showToast('Account registered! Please verify contact with OTP.', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (msmeId, otp) => {
    setLoading(true);
    try {
      const targetId = msmeId || msme?.id || pendingRegistration?.account?.id;
      if (!targetId) {
        throw new Error('No active account ID found. Please register a new account.');
      }

      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msmeId: targetId, otp }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed.');
      }
      setMsme(data.data.account);
      showToast('Contact verified successfully!', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitIdentityProof = async (msmeId, docType, file, extraFields = {}) => {
    setLoading(true);
    try {
      const targetId = msmeId || msme?.id;
      const formData = new FormData();
      formData.append('msmeId', targetId);
      formData.append('docType', docType);
      if (file) formData.append('document', file);
      if (extraFields.gstin) formData.append('gstin', extraFields.gstin);

      const res = await fetch('/api/identity-proof', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!data.success && !data.data) {
        throw new Error(data.message || 'Proof submission failed.');
      }

      if (data.data?.accountStatus) {
        setMsme(prev => prev ? { ...prev, status: data.data.accountStatus } : prev);
      }

      showToast('Document processed via Tesseract OCR & OpenRouter AI!', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setMsme(null);
    setPendingRegistration(null);
    localStorage.removeItem('vastrasetu_jwt');
    localStorage.removeItem('vastrasetu_account');
    localStorage.removeItem('vastrasetu_pending');
    localStorage.removeItem('vastrasetu_token');
    localStorage.removeItem('vastrasetu_msme');
    showToast('Logged out of VastraSetu.', 'info');
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setMsme(data.data.account);
      showToast('Profile updated successfully!', 'success');
      return data.data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      msme,
      token,
      loading,
      pendingRegistration,
      login,
      register,
      verifyOtp,
      submitIdentityProof,
      logout,
      updateProfile,
      isAuthenticated: !!msme && (msme.status === 'ACTIVE' || msme.status === 'active'),
      accountStatus: msme ? msme.status : 'UNAUTHENTICATED',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
