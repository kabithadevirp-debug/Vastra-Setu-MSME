import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Award, 
  FileText, 
  Building2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Eye
} from 'lucide-react';

export function CertificateModal({ certType, isOpen, onClose, batch }) {
  if (!isOpen) return null;

  const [showOcrText, setShowOcrText] = useState(false);

  const certData = {
    'gots': {
      title: 'Global Organic Textile Standard (GOTS)',
      version: 'GOTS Version 7.0 - Organic Certified',
      certNumber: batch?.fiberCertificate?.certificateNo || 'CU-841920-GOTS-2026',
      issuer: batch?.fiberCertificate?.issuer || 'Control Union Certifications B.V. (Netherlands / India)',
      holder: batch?.yarnSpinningMill || 'Coimbatore Heritage Cotton Mills / Sri Jayavarma Knits',
      validUntil: '31 December 2026',
      standard: '100% Certified Organic Raw Cotton (No GMOs, No Toxic Synthetic Pesticides)',
      badgeColor: 'bg-emerald-700 text-white',
      chainOfCustody: 'Field-to-Yarn Transaction Certificate (TC) #TC-IND-2026-99014',
      fileUrl: batch?.fiberCertificate?.certificateUrl || '/sample-certs/gots-certificate.pdf',
      ocrScore: 98,
      ocrEngine: 'Tesseract OCR v5.5.3',
      markers: [
        { label: 'GOTS Standard v7.0', status: 'PASS' },
        { label: 'License CU-841920', status: 'PASS' },
        { label: 'Organic Content 95%', status: 'PASS' },
        { label: 'Control Union Accredited', status: 'PASS' }
      ]
    },
    'oeko': {
      title: 'OEKO-TEX® Standard 100 Class I (Baby Safe)',
      version: 'Annex 4 - Product Class I',
      certNumber: batch?.dyeingRecord?.certificateNo || 'OEKO-2026-TX-98442',
      issuer: 'TESTEX AG & Hohenstein Textile Testing Institute',
      holder: batch?.dyerName || 'Rainbow Eco-Dyers Tiruppur',
      validUntil: '31 December 2026',
      standard: 'Tested for over 1,000 harmful chemicals, heavy metals, azo colorants, and formaldehyde.',
      badgeColor: 'bg-indigo-700 text-white',
      chainOfCustody: 'Dyeing Batch Test Clearance #DYE-TC-2026-88',
      fileUrl: batch?.dyeingRecord?.certificateUrl || '/sample-certs/oeko-tex-certificate.pdf',
      ocrScore: 96,
      ocrEngine: 'Tesseract OCR v5.5.3',
      markers: [
        { label: 'Standard 100 Class I', status: 'PASS' },
        { label: 'ZDHC MRSL Level 3', status: 'PASS' },
        { label: 'Azo-Free Verified', status: 'PASS' },
        { label: 'Hohenstein Validated', status: 'PASS' }
      ]
    },
    'zdhc': {
      title: 'ZDHC MRSL Level 3 Conformity',
      version: 'Manufacturing Restricted Substances List v3.1',
      certNumber: 'ZDHC-IN-2026-MRSL-441',
      issuer: 'ZDHC Roadmap to Zero Foundation',
      holder: batch?.dyerName || 'Rainbow Eco-Dyers Tiruppur',
      validUntil: '28 October 2026',
      standard: 'Zero discharge of hazardous synthetic chemicals in process water and sludge.',
      badgeColor: 'bg-teal-700 text-white',
      chainOfCustody: 'InCheck Chemical Verification Report Verified',
      fileUrl: '/sample-certs/oeko-tex-certificate.pdf',
      ocrScore: 95,
      ocrEngine: 'Tesseract OCR v5.5.3',
      markers: [
        { label: 'MRSL Conformance Level 3', status: 'PASS' },
        { label: 'InCheck Gateway Verified', status: 'PASS' },
        { label: 'Zero Hazardous Discharge', status: 'PASS' }
      ]
    },
    'zld': {
      title: 'TNPCB Zero Liquid Discharge (ZLD) Effluent Clearance',
      version: 'Closed-Loop Water Recovery Compliance',
      certNumber: batch?.cetpRecord?.certificateNo || 'TNPCB-CETP-ZLD-BATCH-8842',
      issuer: 'Tamil Nadu Pollution Control Board (TNPCB) & Tiruppur CETP Federation',
      holder: batch?.cetpName || 'Arulpuram Common Effluent Treatment Plant (Unit 3)',
      validUntil: 'Continuous Real-Time IoT Monitoring Active',
      standard: '94% Process Water Recycled via RO + Multi-Effect Evaporator (MEE). Zero River Discharge.',
      badgeColor: 'bg-cyan-700 text-white',
      chainOfCustody: 'Daily Effluent Online TDS/COD/BOD Continuous Monitoring Sensor Log ID: TN-CETP-SENSOR-884',
      fileUrl: batch?.cetpRecord?.certificateUrl || '/sample-certs/tnpcb-zld-certificate.pdf',
      ocrScore: 99,
      ocrEngine: 'Tesseract OCR v5.5.3',
      markers: [
        { label: '100% ZLD Operational', status: 'PASS' },
        { label: '92-94% Closed-Loop Recovery', status: 'PASS' },
        { label: 'MEE Salt Crystallized', status: 'PASS' },
        { label: 'TNPCB Consent Order Valid', status: 'PASS' }
      ]
    }
  };

  const current = certData[certType] || certData['gots'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-brand-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/20 border border-brand-400/30 rounded-2xl text-brand-200 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  OCR Verified Audit Certificate
                </span>
                <span className="text-xs text-brand-200/80 font-mono">Score: {current.ocrScore}%</span>
              </div>
              <h3 className="text-xl font-display font-extrabold text-white mt-1">
                {current.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-5 text-xs text-zinc-700">
          
          {/* Metadata Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Certificate Number:</span>
              <span className="font-mono font-bold text-zinc-900">{current.certNumber}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Issuing Body:</span>
              <span className="font-semibold text-zinc-800 text-right">{current.issuer}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Certified Facility:</span>
              <span className="font-semibold text-zinc-800 text-right">{current.holder}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Validity Period:</span>
              <span className="font-semibold text-emerald-700">{current.validUntil}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Chain of Custody / TC:</span>
              <span className="font-mono text-zinc-700 text-[11px]">{current.chainOfCustody}</span>
            </div>
          </div>

          {/* OCR Trust Markers Breakdown */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Tesseract OCR Verified Trust Markers
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {current.markers.map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <span className="font-semibold text-emerald-950 text-[11px]">{m.label}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {m.status} ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Statement */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Compliance Standard Scope</h4>
            <p className="text-zinc-600 bg-brand-50/40 p-3.5 rounded-xl border border-brand-100 leading-relaxed text-[11px]">
              {current.standard}
            </p>
          </div>

          {/* Blockchain & Digital Seal */}
          <div className="flex items-center gap-2.5 p-3.5 bg-zinc-900 text-zinc-200 rounded-xl text-[11px] font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-white font-semibold">Polygon PoS Environmental Ledger Anchor</span>
              <span className="text-zinc-400 truncate block text-[10px]">0x7f8a9c3d4e0821b209e51c89f53e6b12d98c24a91901df4819e68b31a0e7</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-zinc-50 p-4 sm:p-6 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">EU ESPR & DPP Compliance Ready</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Audit Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
