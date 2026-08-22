import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, ShieldCheck, Lock, Edit3, Save, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';

export function ProfilePage({ navigate }) {
  const { msme, updateProfile, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: msme?.businessName || '',
    address: msme?.address || '',
    contactName: msme?.contactName || '',
    contactPhone: msme?.contactPhone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      // Error handled by AuthContext toast
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-2xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-zinc-900">{msme?.businessName || 'Sri Jayavarma Knits & Exports Pvt Ltd'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Active MSME
              </span>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {msme?.address || 'Avinashi Road, Tiruppur, Tamil Nadu (PIN 641603)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isEditing ? 'Cancel Editing' : 'Edit Contact Details'}
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-zinc-200/80 shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Read-Only Government Identity Identifiers (Locked Post-Verification)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50/80 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Verified GSTIN (Permanent Tax ID)
              </label>
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-800 bg-white px-3.5 py-2.5 rounded-lg border border-zinc-300">
                <Lock className="w-4 h-4 text-zinc-400" />
                {msme?.gstin || '33AAACJ1928A1Z5'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Udyam Registration Number
              </label>
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-zinc-800 bg-white px-3.5 py-2.5 rounded-lg border border-zinc-300">
                <Lock className="w-4 h-4 text-zinc-400" />
                {msme?.udyamNumber || 'UDYAM-TN-28-0019284'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Editable Business & Contact Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Business Legal Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Factory Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Contact Person Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs disabled:bg-zinc-50 disabled:text-zinc-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
