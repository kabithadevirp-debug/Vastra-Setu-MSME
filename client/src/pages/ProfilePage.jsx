import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Save, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  KeyRound, 
  History, 
  Monitor, 
  Globe, 
  Filter, 
  AlertCircle,
  ExternalLink,
  LogOut
} from 'lucide-react';

export function ProfilePage({ navigate }) {
  const { msme, updateProfile, loading } = useAuth();

  // Tab State: 'profile' | 'security' | 'audit' | 'sessions'
  const [activeTab, setActiveTab] = useState('profile');

  // Business Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: msme?.businessName || '',
    address: msme?.address || '',
    contactName: msme?.contactName || '',
    contactPhone: msme?.contactPhone || '',
  });

  // Password Change State
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passStatus, setPassStatus] = useState(null);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('ALL');

  // Sessions State
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (msme) {
      setProfileForm({
        businessName: msme.businessName || '',
        address: msme.address || '',
        contactName: msme.contactName || '',
        contactPhone: msme.contactPhone || ''
      });
    }
  }, [msme]);

  // Fetch Audit Logs & Sessions
  useEffect(() => {
    const fetchAuditAndSessions = async () => {
      try {
        const msmeId = msme?.id || '';
        const [logRes, sesRes] = await Promise.allSettled([
          fetch(`/api/audit-log?msmeId=${msmeId}&actionType=${actionFilter}`).then(r => r.json()),
          fetch(`/api/sessions?msmeId=${msmeId}`).then(r => r.json())
        ]);

        if (logRes.status === 'fulfilled' && logRes.value.success) {
          setAuditLogs(logRes.value.data);
        }
        if (sesRes.status === 'fulfilled' && sesRes.value.success) {
          setSessions(sesRes.value.data);
        }
      } catch (err) {
        console.error('Audit log fetch error:', err);
      }
    };

    fetchAuditAndSessions();
  }, [msme, actionFilter]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const msmeId = msme?.id || '';
      await fetch(`/api/profile?msmeId=${msmeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      await updateProfile(profileForm);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    try {
      const msmeId = msme?.id || '';
      const res = await fetch(`/api/profile/change-password?msmeId=${msmeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passForm)
      });
      const data = await res.json();
      if (data.success) {
        setPassStatus({ type: 'success', message: 'Password updated successfully. Other active sessions invalidated.' });
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPassStatus({ type: 'error', message: data.error || 'Password update failed.' });
      }
    } catch (err) {
      setPassStatus({ type: 'error', message: 'Failed to update password.' });
    }
  };

  const handleTerminateSessions = async () => {
    try {
      const msmeId = msme?.id || '';
      await fetch(`/api/sessions/all-except-current?msmeId=${msmeId}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.isCurrent));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center font-bold shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-display">
                {msme?.businessName || 'Sri Jayavarma Knits & Exports Pvt Ltd'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active MSME
              </span>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {msme?.address || 'Avinashi Road, Tiruppur, Tamil Nadu (PIN 641603)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/identity-proof')}
          className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Request Identity Re-Verification</span>
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-zinc-200 gap-6 text-xs font-bold">
        {[
          { id: 'profile', label: 'Business Profile', icon: User },
          { id: 'security', label: 'Password & Security', icon: KeyRound },
          { id: 'audit', label: 'Security Audit Log', icon: History },
          { id: 'sessions', label: 'Active Sessions', icon: Monitor }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 flex items-center gap-2 transition-all border-b-2 ${
                activeTab === t.id 
                  ? 'border-emerald-700 text-emerald-800 font-extrabold' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESS PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* READ-ONLY GOVERNMENT IDENTIFIERS */}
          <div>
            <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Read-Only Government Identity Identifiers (Locked Post-DPI Verification)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified ✓
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">
                  Verified GSTIN (Permanent Tax ID)
                </label>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-900 bg-white px-3.5 py-2.5 rounded-xl border border-zinc-300">
                  <span>{msme?.gstin || '33AAACJ1928A1Z5'}</span>
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1">
                  Udyam Registration Number
                </label>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-900 bg-white px-3.5 py-2.5 rounded-xl border border-zinc-300">
                  <span>{msme?.udyamNumber || 'UDYAM-TN-28-0019284'}</span>
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>
            </div>
          </div>

          {/* EDITABLE PARAMETERS */}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Editable Business Details</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Parameters'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Business Legal Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={profileForm.businessName}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Factory Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={profileForm.contactName}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={profileForm.contactPhone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            )}
          </form>

        </div>
      )}

      {/* TAB 2: PASSWORD & SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-700" />
              <span>Change Account Password</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Requires current password re-entry. Successfully changing password will terminate all other active device sessions.
            </p>
          </div>

          {passStatus && (
            <div className={`p-4 rounded-2xl text-xs font-bold border ${
              passStatus.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {passStatus.message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passForm.currentPassword}
                onChange={(e) => setPassForm(p => ({ ...p, currentPassword: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">New Password (Min 8 characters)</label>
              <input
                type="password"
                required
                value={passForm.newPassword}
                onChange={(e) => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Update Password & Revoke Sessions
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SECURITY AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <span>Security Audit Log</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Immutable record of logins, document uploads, and verification outcomes for judge compliance inspection.
              </p>
            </div>

            {/* ACTION TYPE FILTERS */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              {['ALL', 'LOGIN', 'DOCUMENT_UPLOAD', 'VERIFICATION_OUTCOME', 'PROFILE_CHANGE'].map((act) => (
                <button
                  key={act}
                  onClick={() => setActionFilter(act)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    actionFilter === act 
                      ? 'bg-zinc-900 text-white' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {act.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-zinc-200 rounded-2xl">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 text-zinc-500 uppercase font-bold text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                        log.actionType === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                        log.actionType === 'DOCUMENT_UPLOAD' ? 'bg-teal-100 text-teal-800' :
                        log.actionType === 'VERIFICATION_OUTCOME' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-800">{log.description}</td>
                    <td className="py-3 px-4 font-mono text-zinc-500">{log.ipAddress}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 font-display flex items-center gap-2">
                <Monitor className="w-5 h-5 text-emerald-700" />
                <span>Active Device Sessions</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Authorized browsers currently logged into this MSME account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTerminateSessions}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition-all"
            >
              Terminate All Other Sessions
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{s.device}</span>
                    {s.isCurrent && (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    IP: {s.ipAddress} • Logged in: {new Date(s.loginTime).toLocaleString()}
                  </p>
                </div>

                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={handleTerminateSessions}
                    className="text-xs font-bold text-rose-700 hover:underline"
                  >
                    Log Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
