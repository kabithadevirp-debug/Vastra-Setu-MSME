import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FlaskConical, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Droplets,
  Check,
  Layers,
  Thermometer,
  Zap,
  Building2,
  Award,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DyerPortalPage({ navigate }) {
  const { showToast } = useApp() || {};

  // Tab State: 'QUEUE', 'INVENTORY', 'COMPLIANCE', 'LOGS'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'inventory') return 'INVENTORY';
    if (tabParam === 'compliance') return 'COMPLIANCE';
    if (tabParam === 'logs') return 'LOGS';
    return 'QUEUE';
  });

  // Sync tab with URL query parameter
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const tabParam = newTab.toLowerCase();
    const newUrl = `${window.location.pathname}?tab=${tabParam}`;
    window.history.pushState(null, '', newUrl);
  };

  // Data states
  const [batches, setBatches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [expiringCerts, setExpiringCerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected batch for verification
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const selectedBatch = batches.find(b => b.id === selectedBatchId || b.batchNumber === selectedBatchId) || batches[0];

  // Inventory Filtering & Modals
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState('ALL');
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState({
    chemicalName: '',
    chemicalType: 'REACTIVE',
    oekoTexClass: 'CLASS_I',
    zdhcMrslLevel: 'LEVEL_3',
    quantityAvailable: 100,
    unit: 'KG',
    supplierName: '',
    batchLotNumber: ''
  });

  // Certificate Renewal Modal
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    certType: 'OEKO_TEX_STANDARD_100',
    certNumber: '',
    certClassOrLevel: 'Class I - Baby Safe',
    issuingBody: 'TESTEX AG, Switzerland',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
    documentUrl: '/sample-certs/oeko-tex-certificate.pdf'
  });

  // Verification Form State
  const [verifyForm, setVerifyForm] = useState({
    selectedDyestuffId: '',
    dyeType: 'low_impact_reactive',
    dyeProcessName: 'Energy-Efficient Cold Pad Batch (CPB) Eco-Dyeing',
    temperatureC: 60,
    chemicalCompliance: 'Azo-free ✓ • OEKO-TEX Standard 100 Class I & ZDHC MRSL Level 3',
    certificateNo: 'OEKO-2026-TX-98442',
    verifiedBy: 'Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)',
    quantityKg: 1100,
    waterLitres: 45000,
    notes: 'Zero Azo dyes, zero heavy metal mordants. 100% biomass steam boiler operated.'
  });

  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [auditFilter, setAuditFilter] = useState('ALL');

  // Fetch all dyer data from REST endpoints
  const fetchDyerData = async () => {
    setLoading(true);
    try {
      // 1. Batches
      const bRes = await fetch('/api/dyer/batches?dyerId=Rainbow%20Eco-Dyers');
      const bJson = await bRes.json();
      if (bJson.success && bJson.data) {
        setBatches(bJson.data);
        if (!selectedBatchId && bJson.data.length > 0) {
          setSelectedBatchId(bJson.data[0].batchNumber || bJson.data[0].id);
        }
      }

      // 2. Inventory
      const iRes = await fetch('/api/dyer/inventory?dyerId=Rainbow%20Eco-Dyers');
      const iJson = await iRes.json();
      if (iJson.success && iJson.data) {
        setInventory(iJson.data);
        if (iJson.data.length > 0 && !verifyForm.selectedDyestuffId) {
          setVerifyForm(prev => ({
            ...prev,
            selectedDyestuffId: iJson.data[0].id,
            chemicalCompliance: `${iJson.data[0].chemicalName} (Azo-free ✓ • ${iJson.data[0].oekoTexClass} • ZDHC ${iJson.data[0].zdhcMrslLevel})`
          }));
        }
      }

      // 3. Certifications
      const cRes = await fetch('/api/dyer/certifications?dyerId=Rainbow%20Eco-Dyers');
      const cJson = await cRes.json();
      if (cJson.success && cJson.data) {
        setCertifications(cJson.data);
      }

      // 4. Expiring Certs (< 30 days)
      const expRes = await fetch('/api/dyer/certifications/expiring?dyerId=Rainbow%20Eco-Dyers&days=30');
      const expJson = await expRes.json();
      if (expJson.success && expJson.data) {
        setExpiringCerts(expJson.data);
      }

      // 5. Audit Logs
      const aRes = await fetch('/api/dyer/audit-log?dyerId=Rainbow%20Eco-Dyers');
      const aJson = await aRes.json();
      if (aJson.success && aJson.data) {
        setAuditLogs(aJson.data);
      }

    } catch (err) {
      console.warn('Error loading dyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDyerData();
  }, []);

  // Handle Inventory Selection in Verification Form
  const handleDyestuffSelect = (e) => {
    const dId = e.target.value;
    const item = inventory.find(i => String(i.id) === String(dId));
    if (item) {
      setVerifyForm(prev => ({
        ...prev,
        selectedDyestuffId: dId,
        chemicalCompliance: `${item.chemicalName} (Azo-free ✓ • ${item.oekoTexClass} • ZDHC ${item.zdhcMrslLevel} Lot: ${item.batchLotNumber || 'LOT-2026'})`
      }));
    } else {
      setVerifyForm(prev => ({ ...prev, selectedDyestuffId: dId }));
    }
  };

  // Submit Batch Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setSubmittingVerification(true);
    try {
      const batchNum = selectedBatch.batchNumber || selectedBatch.id;
      const res = await fetch(`/api/dyer/batches/${batchNum}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dyeType: verifyForm.dyeType,
          dyeProcessName: verifyForm.dyeProcessName,
          temperatureC: verifyForm.temperatureC,
          chemicalCompliance: verifyForm.chemicalCompliance,
          certificateNo: verifyForm.certificateNo,
          verifiedBy: verifyForm.verifiedBy,
          quantityKg: verifyForm.quantityKg,
          waterLitres: verifyForm.waterLitres,
          remarks: verifyForm.notes
        })
      });

      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        if (showToast) showToast('Batch wet processing & OEKO-TEX verified! Advanced to CETP clearance.', 'success');
        fetchDyerData();
      } else {
        alert(json.message || 'Verification failed');
      }
    } catch (err) {
      alert('Error submitting verification: ' + err.message);
    } finally {
      setSubmittingVerification(false);
    }
  };

  // Add Inventory Item
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dyer/inventory?dyerId=Rainbow%20Eco-Dyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventoryItem)
      });
      const json = await res.json();
      if (json.success) {
        setShowAddInventoryModal(false);
        setNewInventoryItem({
          chemicalName: '',
          chemicalType: 'REACTIVE',
          oekoTexClass: 'CLASS_I',
          zdhcMrslLevel: 'LEVEL_3',
          quantityAvailable: 100,
          unit: 'KG',
          supplierName: '',
          batchLotNumber: ''
        });
        fetchDyerData();
      }
    } catch (err) {
      alert('Failed to add inventory: ' + err.message);
    }
  };

  // Delete Inventory Item
  const handleDeleteInventory = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dyestuff from stock?')) return;
    try {
      const res = await fetch(`/api/dyer/inventory/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) fetchDyerData();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  // Add / Renew Certificate
  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dyer/certifications?dyerId=Rainbow%20Eco-Dyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert)
      });
      const json = await res.json();
      if (json.success) {
        setShowAddCertModal(false);
        fetchDyerData();
      }
    } catch (err) {
      alert('Failed to save certificate: ' + err.message);
    }
  };

  // Filtered inventory
  const filteredInventory = inventory.filter(item => {
    if (inventoryTypeFilter === 'ALL') return true;
    return item.chemicalType === inventoryTypeFilter;
  });

  // Primary certificate statuses for top KPI cards
  const oekoCert = certifications.find(c => c.certType === 'OEKO_TEX_STANDARD_100');
  const zdhcCert = certifications.find(c => c.certType === 'ZDHC_MRSL');

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. TOP DYEING PARTNER BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <FlaskConical className="w-4 h-4" />
            <span>Wet Processing & Chemical Verification Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Rainbow Eco-Dyers Tiruppur
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
            Veerapandi Industrial Estate, Tiruppur • OEKO-TEX Standard 100 Class I & ZDHC MRSL Level 3 Accredited Processing Unit
          </p>
        </div>
        <div className="absolute right-6 top-6 hidden md:block text-right text-xs font-mono text-indigo-300/60">
          Lic: <strong className="text-white">TNPCB/DYE/2024/091</strong>
        </div>
      </div>

      {/* 2. EXPIRATION ALERT BANNER (If any certificate is within 30 days) */}
      {expiringCerts.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="text-amber-300 font-bold block">
                Facility Compliance Renewal Required ({expiringCerts.length} Certificate Expiring Soon)
              </strong>
              <span className="text-slate-300">
                {expiringCerts.map(c => `${c.title} expires on ${c.expiryDate}`).join(' • ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('COMPLIANCE'); setShowAddCertModal(true); }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shrink-0"
          >
            Upload Renewal Certificate
          </button>
        </div>
      )}

      {/* 3. DYNAMIC 4 STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => handleTabChange('QUEUE')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Available Batches</span>
            <FlaskConical className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">{batches.length}</p>
          <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
            In Verification Queue
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('COMPLIANCE')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>OEKO-TEX Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 font-display">
            {oekoCert ? 'Class I' : 'Verified'}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            {oekoCert?.certNumber || 'OEKO-2026-TX'}
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('INVENTORY')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Stocked Dyestuffs</span>
            <Droplets className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">{inventory.length}</p>
          <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
            100% Azo-Free Verified
          </span>
        </div>

        <div 
          onClick={() => handleTabChange('COMPLIANCE')}
          className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-1 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>ZDHC MRSL Level</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 font-display">
            {zdhcCert ? 'Level 3' : 'Conformant'}
          </p>
          <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
            {zdhcCert?.status === 'EXPIRING_SOON' ? 'Expires in 22d' : 'Active Registry'}
          </span>
        </div>
      </div>

      {/* 4. WORKSPACE TAB ROW */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => handleTabChange('QUEUE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'QUEUE'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Batch Verification Queue ({batches.length})
        </button>
        <button
          onClick={() => handleTabChange('INVENTORY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'INVENTORY'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Chemical & Dyestuff Inventory ({inventory.length})
        </button>
        <button
          onClick={() => handleTabChange('COMPLIANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'COMPLIANCE'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          OEKO-TEX & ZDHC Certificates ({certifications.length})
        </button>
        <button
          onClick={() => handleTabChange('LOGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LOGS'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Dyeing Audit Logs
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BATCH VERIFICATION QUEUE */}
      {/* ======================================================== */}
      {activeTab === 'QUEUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Assigned Batches List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Batches in Pipeline</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {batches.length} Available
              </span>
            </div>

            <div className="space-y-2">
              {batches.map((b) => {
                const bId = b.batchNumber || b.id;
                const isSelected = bId === selectedBatchId;

                return (
                  <div
                    key={b.id || b.batchNumber}
                    onClick={() => setSelectedBatchId(bId)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-zinc-900">{b.batchNumber || b.id}</span>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {b.status || 'READY'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-800 line-clamp-1">{b.productName}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                      <span>Buyer: {b.buyerName || 'EU Buyer'}</span>
                      <strong className="text-zinc-700">{b.quantity || 5000} pcs</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Verification Form Connected to Stocked Inventory */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-extrabold text-zinc-900 font-display">
                  Dyeing Recipe & OEKO-TEX Verification Form
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Log dyeing temperature, select certified chemical stock, and record test certificate for batch <strong className="text-zinc-900">{selectedBatch?.batchNumber || selectedBatch?.id}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-5">
              
              {/* CONNECTED CHEMICAL INVENTORY SELECTOR */}
              <div className="space-y-1.5 p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl">
                <label className="text-xs font-extrabold text-indigo-950 flex items-center justify-between">
                  <span>Select Stocked Dyestuff / Recipe</span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">ZDHC MRSL Level 3</span>
                </label>
                <select
                  value={verifyForm.selectedDyestuffId}
                  onChange={handleDyestuffSelect}
                  className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.chemicalName} — ({item.chemicalType}, {item.quantityAvailable} {item.unit} in stock, Lot: {item.batchLotNumber || 'LOT-2026'})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-zinc-500 block">
                  Automatically populates certified compliance reference and lot traceability into the DPP Merkle tree.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Dyeing Process Name</label>
                  <input
                    type="text"
                    value={verifyForm.dyeProcessName}
                    onChange={(e) => setVerifyForm({ ...verifyForm, dyeProcessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Bath Temperature (°C)</label>
                  <input
                    type="number"
                    value={verifyForm.temperatureC}
                    onChange={(e) => setVerifyForm({ ...verifyForm, temperatureC: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Quantity Processed (Kg)</label>
                  <input
                    type="number"
                    value={verifyForm.quantityKg}
                    onChange={(e) => setVerifyForm({ ...verifyForm, quantityKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Water Consumption (Litres)</label>
                  <input
                    type="number"
                    value={verifyForm.waterLitres}
                    onChange={(e) => setVerifyForm({ ...verifyForm, waterLitres: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Chemical Safety & Standard Statement</label>
                <input
                  type="text"
                  value={verifyForm.chemicalCompliance}
                  onChange={(e) => setVerifyForm({ ...verifyForm, chemicalCompliance: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                />
              </div>

              {/* Certificate Reference Card */}
              <div className="p-4 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-7 h-7 text-indigo-500" />
                  <div>
                    <strong className="text-xs font-bold text-zinc-900 block">OEKO-TEX Standard 100 Class I (TESTEX AG)</strong>
                    <span className="text-[10px] text-zinc-500 font-mono">Cert #{verifyForm.certificateNo} • Verified Azo-Free</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  ✓ Valid Certificate
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Verifying Quality Head</label>
                <input
                  type="text"
                  value={verifyForm.verifiedBy}
                  onChange={(e) => setVerifyForm({ ...verifyForm, verifiedBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:bg-white focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingVerification}
                className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submittingVerification ? 'Submitting Verification...' : 'Confirm & Sign Dyeing Record for Batch'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CHEMICAL & DYESTUFF INVENTORY */}
      {/* ======================================================== */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                Dyestuff & Auxiliary Chemical Inventory
              </h2>
              <p className="text-xs text-zinc-500">
                Stocked chemicals accredited under OEKO-TEX Standard 100 and ZDHC MRSL Level 3.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={inventoryTypeFilter}
                onChange={(e) => setInventoryTypeFilter(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700"
              >
                <option value="ALL">All Types</option>
                <option value="REACTIVE">Reactive Dyes</option>
                <option value="AZO_FREE">Azo-Free</option>
                <option value="NATURAL">Natural Organic</option>
                <option value="AUXILIARY">Enzymes & Auxiliaries</option>
              </select>

              <button
                onClick={() => setShowAddInventoryModal(true)}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Chemical</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Chemical Name & Supplier</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">OEKO-TEX / ZDHC</th>
                  <th className="py-3 px-4">Stock Available</th>
                  <th className="py-3 px-4">Lot Number</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-zinc-900 block font-sans">{item.chemicalName}</strong>
                      <span className="text-[10px] text-zinc-400">{item.supplierName || 'Authorized Chemical Vendor'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.chemicalType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-700 block">{item.oekoTexClass}</span>
                        <span className="text-[10px] font-mono text-purple-700 block">{item.zdhcMrslLevel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-zinc-900">
                      {item.quantityAvailable} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                      {item.batchLotNumber || 'LOT-2026-001'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteInventory(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete chemical"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: OEKO-TEX & ZDHC CERTIFICATES */}
      {/* ======================================================== */}
      {activeTab === 'COMPLIANCE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                Facility Accreditations & Environmental Licenses
              </h2>
              <p className="text-xs text-zinc-500">
                Official certificates ensuring export compliance for European Union and US brands.
              </p>
            </div>

            <button
              onClick={() => setShowAddCertModal(true)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload / Renew Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => {
              const isExpiring = cert.status === 'EXPIRING_SOON';
              return (
                <div
                  key={cert.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isExpiring 
                      ? 'border-amber-400 bg-amber-50/40' 
                      : 'border-zinc-200 bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      {cert.certType}
                    </span>
                    {isExpiring ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active & Valid
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-zinc-900">{cert.title}</h3>
                  
                  <div className="space-y-1 text-xs text-zinc-600 border-t border-zinc-200/60 pt-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cert #:</span>
                      <strong className="font-mono text-zinc-800">{cert.certNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Class/Level:</span>
                      <span className="font-bold text-indigo-700">{cert.certClassOrLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Issuing Body:</span>
                      <span>{cert.issuingBody}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Valid Until:</span>
                      <strong className={isExpiring ? 'text-amber-700 font-mono font-bold' : 'text-zinc-700 font-mono'}>
                        {cert.expiryDate}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Opening verified certificate PDF for ${cert.certNumber}`)}
                    className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Certificate PDF</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DYEING AUDIT LOGS */}
      {/* ======================================================== */}
      {activeTab === 'LOGS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display">
                Dyeing Operations Security & Audit Trail
              </h2>
              <p className="text-xs text-zinc-500">
                Tamper-evident log of chemical recipe signatures, batch verifications, and compliance updates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700"
              >
                <option value="ALL">All Actions</option>
                <option value="BATCH_VERIFICATION">Batch Verifications</option>
                <option value="INVENTORY_RESTOCK">Inventory Changes</option>
                <option value="CERTIFICATE_UPLOAD">Certificates</option>
                <option value="LOGIN">Logins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Details & Description</th>
                  <th className="py-3 px-4">Operator / Chemist</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {auditLogs
                  .filter(l => auditFilter === 'ALL' || l.actionType === auditFilter)
                  .map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-zinc-800">
                        {log.description}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                        {log.actor || 'Dr. K. Senthil Kumar'}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD CHEMICAL INVENTORY */}
      {/* ======================================================== */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">Add Dyestuff to Inventory</h3>
              <button onClick={() => setShowAddInventoryModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInventory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Chemical / Dyestuff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Novacron Brilliant Red FN-3GL"
                  value={newInventoryItem.chemicalName}
                  onChange={(e) => setNewInventoryItem({ ...newInventoryItem, chemicalName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Chemical Type</label>
                  <select
                    value={newInventoryItem.chemicalType}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, chemicalType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="REACTIVE">Reactive Dye</option>
                    <option value="AZO_FREE">Azo-Free Eco</option>
                    <option value="NATURAL">Natural Plant Extract</option>
                    <option value="AUXILIARY">Auxiliary Enzyme</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">OEKO-TEX Standard</label>
                  <select
                    value={newInventoryItem.oekoTexClass}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, oekoTexClass: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="CLASS_I">Class I (Baby Safe)</option>
                    <option value="CLASS_II">Class II (Direct Contact)</option>
                    <option value="CLASS_III">Class III</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Quantity Available</label>
                  <input
                    type="number"
                    required
                    value={newInventoryItem.quantityAvailable}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, quantityAvailable: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Unit</label>
                  <select
                    value={newInventoryItem.unit}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, unit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="KG">Kilograms (KG)</option>
                    <option value="LITERS">Liters (L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Huntsman Textile Effects"
                    value={newInventoryItem.supplierName}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, supplierName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Batch / Lot Number</label>
                  <input
                    type="text"
                    placeholder="e.g. LOT-HN-2026-99"
                    value={newInventoryItem.batchLotNumber}
                    onChange={(e) => setNewInventoryItem({ ...newInventoryItem, batchLotNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Add Dyestuff to Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: UPLOAD / RENEW CERTIFICATE */}
      {/* ======================================================== */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-extrabold text-zinc-900 font-display">Upload / Renew Facility Certificate</h3>
              <button onClick={() => setShowAddCertModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZDHC MRSL Conformance Certificate"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Certificate Type</label>
                  <select
                    value={newCert.certType}
                    onChange={(e) => setNewCert({ ...newCert, certType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  >
                    <option value="OEKO_TEX_STANDARD_100">OEKO-TEX Standard 100</option>
                    <option value="ZDHC_MRSL">ZDHC MRSL Conformance</option>
                    <option value="TNPCB_CTO">TNPCB Consent to Operate</option>
                    <option value="GOTS_WET_PROCESSING">GOTS Wet Processing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Certificate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZDHC-2026-991"
                    value={newCert.certNumber}
                    onChange={(e) => setNewCert({ ...newCert, certNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Issuing Authority</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ZDHC Foundation Amsterdam"
                    value={newCert.issuingBody}
                    onChange={(e) => setNewCert({ ...newCert, issuingBody: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newCert.expiryDate}
                    onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save & Verify Certificate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
