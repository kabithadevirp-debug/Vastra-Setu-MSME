import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { showToast } = useApp() || {};
  const defaultDemoAccount = {
    id: 'e1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c',
    businessName: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    gstin: '33AAACJ1928A1Z5',
    address: 'Sf No. 441/2, Palladam Road, Veerapandi Post, Tiruppur, Tamil Nadu 641605, India',
    sector: 'Textiles',
    contactName: 'Kavitha Devi',
    contactEmail: 'export@jayavarma.in',
    contactPhone: '+91 98422 19284',
    status: 'verified'
  };

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
      if (showToast) showToast('Logged in successfully!', 'success');
      return data.data;
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
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
      if (showToast) showToast('Account registered successfully!', 'success');
      return data.data;
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (msmeId, rawOtp) => {
    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msmeId, otp: rawOtp }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Invalid OTP code.');
      }
      setMsme(data.data.account);
      setPendingRegistration(null);
      if (showToast) showToast('Contact verified successfully!', 'success');
      return data.data;
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitIdentityProof = async (msmeId, docType, fileUrl, extractedData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/identity-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msmeId, docType, fileUrl, extractedData }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit document.');
      }
      if (showToast) showToast(`${docType.toUpperCase()} document verified!`, 'success');
      return data.data;
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
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
    if (showToast) showToast('Logged out.', 'info');
  };

  const updateProfile = (updatedFields) => {
    setMsme(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{
      msme,
      setMsme,
      token,
      setToken,
      loading,
      pendingRegistration,
      login,
      register,
      verifyOtp,
      submitIdentityProof,
      logout,
      updateProfile,
      isAuthenticated: !!msme,
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
