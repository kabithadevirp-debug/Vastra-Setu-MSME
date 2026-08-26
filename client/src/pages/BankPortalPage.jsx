import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Leaf, 
  TrendingUp, 
  CheckCircle2, 
  Percent, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Award,
  DollarSign
} from 'lucide-react';

export function BankPortalPage({ navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null);

  const msmeList = [
    {
      id: 'MSME-8819',
      name: 'Sri Jayavarma Knits & Exports Pvt Ltd',
      location: 'Tiruppur, Tamil Nadu',
      gstin: '33AAACJ1928A1Z5',
      trustScore: 94,
      esgTier: 'PRIME_GREEN',
      loanEligibility: '₹2.50 Cr',
      interestRateConcession: '1.25%',
      zdhcStatus: 'Level 3 Zero Discharge',
      waterRecycled: '98.2%',
      passportsIssued: 142,
      dpiVerified: true,
    },
    {
      id: 'MSME-4412',
      name: 'Coimbatore Processing Mills Ltd',
      location: 'Coimbatore, Tamil Nadu',
      gstin: '33AABCC4412B1Z9',
      trustScore: 88,
      esgTier: 'GREEN_TIER_1',
      loanEligibility: '₹1.80 Cr',
      interestRateConcession: '1.00%',
      zdhcStatus: 'Level 2 Compliant',
      waterRecycled: '91.5%',
      passportsIssued: 89,
      dpiVerified: true,
    },
    {
      id: 'MSME-1029',
      name: 'Kaveri Eco Dyers & Processors',
      location: 'Karur, Tamil Nadu',
      gstin: '33AABCK1029C1Z1',
      trustScore: 76,
      esgTier: 'MODERATE_RISK',
      loanEligibility: '₹90 Lakhs',
      interestRateConcession: '0.50%',
      zdhcStatus: 'Level 1 Compliant',
      waterRecycled: '84.0%',
      passportsIssued: 45,
      dpiVerified: true,
    }
  ];

  const filteredMsmes = msmeList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.gstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Role 3: Bank / NBFC Financial Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            Green Credit & ESG Loan Underwriting
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Verify MSME Digital Product Passports, inspect cryptographic ZDHC effluent compliance, and calculate interest rate concessions for green textile financing.
          </p>
        </div>
      </div>

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Verified Green MSMEs</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">1,248</p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            +14% this month
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Avg MSME Trust Score</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">91.4 / 100</p>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
            DPI Verified
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Green Credit Sanctioned</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 font-display">₹48.5 Cr</p>
          <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
            SIDBI Scheme
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Max Interest Concession</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 font-display">1.25% p.a.</p>
          <span className="text-[11px] text-zinc-600 font-medium">
            Based on Merkle Proofs
          </span>
        </div>
      </div>

      {/* SEARCH & DIRECTORY */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 font-display">
              MSME Green Credit Directory
            </h2>
            <p className="text-xs text-zinc-500">
              Underwriting dashboard for SIDBI, SBI, HDFC, and NBFC ESG loan originators.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by MSME or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50/50">
                <th className="py-3 px-4">MSME Name & GSTIN</th>
                <th className="py-3 px-4">Trust Score</th>
                <th className="py-3 px-4">ESG Risk Rating</th>
                <th className="py-3 px-4">Recycled Water</th>
                <th className="py-3 px-4">Pre-Approved Credit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredMsmes.map((msme) => (
                <tr key={msme.id} className="hover:bg-zinc-50/80 transition-all">
                  <td className="py-4 px-4">
                    <div className="font-bold text-zinc-900">{msme.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500">{msme.gstin} • {msme.location}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {msme.trustScore} / 100
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold px-2.5 py-1 rounded-full text-[11px] bg-teal-50 text-teal-800 border border-teal-200">
                      {msme.esgTier}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-zinc-700">
                    {msme.waterRecycled}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-extrabold text-zinc-900">{msme.loanEligibility}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">-{msme.interestRateConcession} Interest Concession</div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveModal(msme)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* INSPECTION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-zinc-200 shadow-2xl animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-bold text-zinc-900 text-lg font-display">{activeModal.name}</h3>
                <p className="text-xs font-mono text-zinc-500">{activeModal.gstin}</p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 font-bold flex items-center justify-center hover:bg-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                <div className="font-bold text-emerald-900">Green Loan Eligibility Breakdown:</div>
                <div className="flex justify-between text-emerald-800">
                  <span>Base Interest Rate:</span>
                  <span className="font-bold">9.50% p.a.</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>ESG Concession Discount:</span>
                  <span>-{activeModal.interestRateConcession}</span>
                </div>
                <div className="border-t border-emerald-200 pt-1 flex justify-between font-extrabold text-emerald-950">
                  <span>Effective Green Loan Rate:</span>
                  <span>{(9.5 - parseFloat(activeModal.interestRateConcession)).toFixed(2)}% p.a.</span>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
                <div className="font-bold text-zinc-800">Verified Cryptographic Proofs:</div>
                <div className="text-zinc-600 flex justify-between">
                  <span>ZDHC Water Status:</span>
                  <span className="font-bold text-emerald-700">{activeModal.zdhcStatus}</span>
                </div>
                <div className="text-zinc-600 flex justify-between">
                  <span>Passports Issued:</span>
                  <span className="font-bold text-zinc-900">{activeModal.passportsIssued} Batches</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Green Credit Line of ${activeModal.loanEligibility} sanctioned for ${activeModal.name}!`);
                  setActiveModal(null);
                }}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Sanction Green Loan Line
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
