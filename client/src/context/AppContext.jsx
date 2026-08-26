import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  MSME: {
    id: 'msme',
    name: 'MSME Exporter',
    company: 'Sri Jayavarma Knits & Exports Pvt Ltd',
    location: 'Tiruppur, India',
    badge: 'Exporter',
    color: 'bg-brand-700 text-white',
    description: 'Create garment batches, track supply chain compliance, and issue Digital Product Passports.'
  },
  DYER: {
    id: 'dyer',
    name: 'Dyer Partner',
    company: 'Rainbow Eco-Dyers Tiruppur',
    location: 'Veerapandi Industrial Estate',
    badge: 'Dyehouse',
    color: 'bg-indigo-600 text-white',
    description: 'Log dyeing recipes, thermal energy parameters, and upload OEKO-TEX / ZDHC chemical test certificates.'
  },
  CETP: {
    id: 'cetp',
    name: 'CETP Facility',
    company: 'Arulpuram Common Effluent Treatment Plant (Unit 3)',
    location: 'Arulpuram, Tiruppur',
    badge: 'ZLD Facility',
    color: 'bg-cyan-700 text-white',
    description: 'Verify Zero Liquid Discharge (ZLD) compliance, water recovery % and issue effluent clearance.'
  },
  BUYER: {
    id: 'buyer',
    name: 'Public Buyer / Customs',
    company: 'Inditex & European Customs Authority',
    location: 'Hamburg / Rotterdam / Global',
    badge: 'Auditor',
    color: 'bg-zinc-900 text-white',
    description: 'Scan garment QR code to verify full provenance, carbon LCA, and EU DPP ESPR compliance.'
  }
};

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(ROLES.MSME.id);
  const [batches, setBatches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/batches');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBatches(data.data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback for batches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      }
    } catch (err) {
      console.warn('Analytics fetch error:', err);
    }
  };

  // Reset Demo State
  const resetDemo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/batches/reset-demo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBatches(data.data);
          await fetchAnalytics();
          setCurrentRole(ROLES.MSME.id);
          showToast('Demo state successfully reset to initial seeds! ↺', 'info');
        }
      }
    } catch (err) {
      showToast('Failed to reset demo', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchAnalytics();
  }, []);

  // Create Batch
  const createBatch = async (batchData) => {
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBatches();
        await fetchAnalytics();
        showToast(`Batch ${data.data.id} created! Forwarded to Dyer for verification.`);
        return data.data;
      }
      throw new Error(data.message || 'Failed to create batch');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Submit Dyer specs
  const submitDyerData = async (batchId, dyerData) => {
    try {
      const res = await fetch(`/api/batches/${batchId}/dyeing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dyerData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBatches();
        await fetchAnalytics();
        showToast(`Dyeing verification recorded for ${batchId}. Forwarded to CETP.`);
        return data.data;
      }
      throw new Error(data.message || 'Failed to submit dyeing data');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Submit CETP specs
  const submitCetpData = async (batchId, cetpData) => {
    try {
      const res = await fetch(`/api/batches/${batchId}/cetp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cetpData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBatches();
        await fetchAnalytics();
        showToast(`ZLD Effluent clearance approved! Digital Product Passport generated for ${batchId}. 🎉`);
        return data.data;
      }
      throw new Error(data.message || 'Failed to submit CETP data');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeRoleConfig: ROLES[Object.keys(ROLES).find(k => ROLES[k].id === currentRole)] || ROLES.MSME,
        batches,
        loading,
        analytics,
        toast,
        showToast,
        resetDemo,
        fetchBatches,
        fetchAnalytics,
        createBatch,
        submitDyerData,
        submitCetpData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
