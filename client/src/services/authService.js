/**
 * Centralized Auth & Verification API Service for VastraSetu
 * Communicates with Spring Boot & Express backend REST APIs
 */

const API_BASE = '/api';

export const authService = {
  /**
   * Register a new MSME account
   */
  async register(formData) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Server unreachable or returned an invalid response.');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Registration failed. Please check inputs.');
    }
    return data.data;
  },

  /**
   * Verify OTP contact confirmation
   */
  async verifyOtp(msmeId, otp) {
    const response = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msmeId, otp }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Invalid server response during OTP verification.');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'OTP verification failed.');
    }
    return data.data;
  },

  /**
   * Authenticate MSME user and obtain JWT tokens
   */
  async login(identifier, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Invalid server response during login.');
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Invalid GSTIN/Email or password.');
    }
    if (data.data?.accessToken) {
      localStorage.setItem('vastrasetu_jwt', data.data.accessToken);
    }
    return data.data;
  },

  /**
   * Upload Identity Proof Document (Udyam / GST Certificate)
   */
  async submitIdentityProof(msmeId, docType, file, gstin) {
    const formData = new FormData();
    formData.append('msmeId', msmeId);
    formData.append('docType', docType);
    if (file) {
      formData.append('document', file);
    }
    if (gstin) {
      formData.append('gstin', gstin);
    }

    const response = await fetch(`${API_BASE}/identity-proof`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Failed to submit identity proof.');
    }
    return data.data;
  },

  /**
   * Fetch current verification status & audit logs for an MSME
   */
  async getVerificationStatus(msmeId) {
    const response = await fetch(`${API_BASE}/identity-proof/status?msmeId=${encodeURIComponent(msmeId)}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Failed to fetch verification status.');
    }
    return data.data;
  },

  /**
   * Fetch MSME account profile
   */
  async getProfile(msmeId) {
    const response = await fetch(`${API_BASE}/profile?msmeId=${encodeURIComponent(msmeId)}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Failed to fetch profile.');
    }
    return data.data;
  },

  /**
   * Logout and clear tokens
   */
  logout() {
    localStorage.removeItem('vastrasetu_jwt');
    localStorage.removeItem('vastrasetu_account');
  }
};
