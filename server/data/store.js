import { calculateFootprint } from '../utils/carbonCalculator.js';

// Realistic sample exporter info
export const EXPORTER_PROFILE = {
  id: 'EXP-TPR-084',
  name: 'Sri Jayavarma Knits & Exports Pvt Ltd',
  udyamNumber: 'UDYAM-TN-28-0019284',
  location: 'Avinashi Road, Tiruppur, Tamil Nadu, India (PIN 641603)',
  established: 2008,
  certifications: ['GOTS Version 7.0', 'OEKO-TEX Standard 100', 'Sedex SMETA 4-Pillar', 'ISO 9001:2015'],
  exportMarkets: ['Germany', 'Netherlands', 'France', 'United Kingdom', 'Sweden'],
  sustainablePractices: ['Rooftop 450kW Solar PV', '100% Tiruppur CETP Zero Liquid Discharge', 'Organic Cotton Sourcing'],
};

// Seed Suppliers & Facilities
export const REGISTERED_SUPPLIERS = {
  dyers: [
    { id: 'DYER-01', name: 'Rainbow Eco-Dyers Tiruppur', license: 'TNPCB/DYE/2024/091', certifications: ['OEKO-TEX Eco Passport', 'ZDHC MRSL Level 3'], location: 'Veerapandi Industrial Estate, Tiruppur' },
    { id: 'DYER-02', name: 'Aura Green Processors & Finishers', license: 'TNPCB/DYE/2023/412', certifications: ['GOTS Wet Processing', 'OEKO-TEX Standard 100'], location: 'Perumanallur Road, Tiruppur' },
  ],
  cetpUnits: [
    { id: 'CETP-01', name: 'Arulpuram Common Effluent Treatment Plant (Unit 3)', license: 'TNPCB-CETP-ZLD-2024-88', zldCompliance: '100% Zero Liquid Discharge', avgWaterRecovery: 94, location: 'Arulpuram, Tiruppur' },
    { id: 'CETP-02', name: 'Chinnakarai Effluent Treatment Plant Pvt Ltd', license: 'TNPCB-CETP-ZLD-2023-14', zldCompliance: '100% Zero Liquid Discharge', avgWaterRecovery: 92, location: 'Chinnakarai, Tiruppur' },
  ],
};

function getInitialBatches() {
  const initial = [
    {
      id: 'VS-2026-0042',
      orderRef: 'PO-ZARA-EU-8842',
      buyerName: 'Inditex / Zara Europe',
      targetCountry: 'Germany',
      destinationPort: 'hamburg',
      garmentType: 'polo',
      garmentTitle: 'Organic Cotton Pique Polo',
      styleCode: 'ZR-26-SS-044',
      fabricType: 'organic_cotton_blend',
      fabricDescription: '95% Organic Cotton / 5% Elastane Pique Knit (180 GSM), Combed Bio-Polished Yarn',
      yarnSpinningMill: 'Coimbatore Heritage Cotton Mills (GOTS Lic: CU-841920)',
      weightGsm: 180,
      quantity: 4000,
      pieceWeightKg: 0.22,
      freightMode: 'sea',
      status: 'PASSPORT_GENERATED', // Fully complete
      createdAt: '2026-08-14T10:30:00Z',
      
      dyerId: 'DYER-01',
      dyerName: 'Rainbow Eco-Dyers Tiruppur',
      cetpId: 'CETP-01',
      cetpName: 'Arulpuram Common Effluent Treatment Plant (Unit 3)',

      dyeingRecord: {
        dyeType: 'low_impact_reactive',
        dyeProcessName: 'Energy-Efficient Cold Pad Batch (CPB) Reactive Dyeing',
        temperatureC: 60,
        chemicalCompliance: 'OEKO-TEX® Standard 100 Class I & ZDHC MRSL Level 3',
        certificateNo: 'OEKO-2026-TX-98442',
        certificateUrl: '/sample-certs/oeko-tex-certificate.pdf',
        verifiedBy: 'Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)',
        completedAt: '2026-08-16T14:15:00Z',
        notes: 'Zero Azo dyes, zero heavy metal mordants. 100% biomass steam boiler operated.',
      },

      cetpRecord: {
        treatmentMethod: 'Membrane Bio-Reactor (MBR) + Reverse Osmosis (RO) + Multi-Effect Evaporator (MEE)',
        zldStatus: 'Verified 100% Zero Liquid Discharge',
        waterRecycledPercent: 92,
        bodCodReductionPercent: 98.5,
        brineRecoveryPercent: 96.0,
        certificateNo: 'TNPCB-CETP-ZLD-BATCH-8842',
        verifiedBy: 'M. Anandhan (Chief Environmental Engineer, Arulpuram CETP)',
        completedAt: '2026-08-18T09:40:00Z',
        notes: 'All reject salt crystallized into industrial grade sodium sulfate for reuse.',
      },

      passport: {
        id: 'DPP-VS-2026-00892',
        qrCodeData: 'https://vastrasetu.vercel.app/verify/DPP-VS-2026-00892',
        blockchainTxHash: '0x7f8a9c3d4e0821b209e51c89f53e6b12d98c24a91901df4819e68b31a0e7',
        blockchainNetwork: 'Polygon PoS (Environmental Ledger)',
        merkleRoot: '0x17c9384918e90a816c21e091b637d730',
        ipfsMetadataHash: 'ipfs://bafybeihdwdcefgh4dqkjv56m2lkmz829vnoq7x',
        footprint: null,
        generatedAt: '2026-08-19T11:20:00Z',
        complianceScore: 98,
        euDppReady: true,
        readinessBreakdown: {
          productIdentity: true,
          materialComposition: true,
          supplyChain: true,
          environmentalData: true,
          certificates: true,
          circularity: true,
        },
        careGuide: {
          washTemp: '30°C Cold Gentle Wash',
          drying: 'Line Dry in Shade (Saves 60% Consumer Energy)',
          ironing: 'Low Heat (110°C)',
          recyclability: '100% Circular Recyclable Design',
        }
      }
    },
    {
      id: 'VS-2026-0043',
      orderRef: 'PO-HM-CONSCIOUS-491',
      buyerName: 'H&M Group / Conscious Choice',
      targetCountry: 'Sweden',
      destinationPort: 'rotterdam',
      garmentType: 'hoodie',
      garmentTitle: 'Recycled French Terry Hoodie',
      styleCode: 'HM-CC-HD-2026',
      fabricType: 'recycled_poly_cotton',
      fabricDescription: '60% GOTS Organic Cotton / 40% Post-Consumer Recycled Polyester (320 GSM)',
      yarnSpinningMill: 'Tiruppur Sustainable Spun Yarns Ltd',
      weightGsm: 320,
      quantity: 2400,
      pieceWeightKg: 0.52,
      freightMode: 'sea',
      status: 'PENDING_CETP', // Awaiting CETP clearance
      createdAt: '2026-08-16T08:00:00Z',
      
      dyerId: 'DYER-01',
      dyerName: 'Rainbow Eco-Dyers Tiruppur',
      cetpId: 'CETP-01',
      cetpName: 'Arulpuram Common Effluent Treatment Plant (Unit 3)',

      dyeingRecord: {
        dyeType: 'low_impact_reactive',
        dyeProcessName: 'Energy-Efficient Cold Pad Batch (CPB) Reactive Dyeing',
        temperatureC: 45,
        chemicalCompliance: 'OEKO-TEX Standard 100 Class II & GRS (Global Recycled Standard)',
        certificateNo: 'OEKO-2026-TX-98501',
        certificateUrl: '/sample-certs/oeko-tex-certificate.pdf',
        verifiedBy: 'Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)',
        completedAt: '2026-08-18T16:20:00Z',
        notes: 'Cold pad batch reduces thermal energy by 40% compared to winch dyeing.',
      },
      cetpRecord: null,
      passport: null,
    },
    {
      id: 'VS-2026-0044',
      orderRef: 'PO-MARKS-UK-7721',
      buyerName: 'Marks & Spencer Eco-Line',
      targetCountry: 'United Kingdom',
      destinationPort: 'felixstowe',
      garmentType: 'blouse',
      garmentTitle: 'Tencel™ Modal Summer Blouse',
      styleCode: 'MS-26-BL-110',
      fabricType: 'modal_tencel',
      fabricDescription: '100% Lenzing™ Modal Micro-Fiber Weave (140 GSM)',
      yarnSpinningMill: 'Lenzing Sourced / Tamil Nadu Weaving Park',
      weightGsm: 140,
      quantity: 3500,
      pieceWeightKg: 0.16,
      freightMode: 'sea',
      status: 'PENDING_DYER', // Awaiting Dyer specs
      createdAt: '2026-08-18T11:45:00Z',
      
      dyerId: 'DYER-02',
      dyerName: 'Aura Green Processors & Finishers',
      cetpId: 'CETP-02',
      cetpName: 'Chinnakarai Effluent Treatment Plant Pvt Ltd',

      dyeingRecord: null,
      cetpRecord: null,
      passport: null,
    }
  ];

  initial[0].passport.footprint = calculateFootprint({
    fabricType: initial[0].fabricType,
    garmentType: initial[0].garmentType,
    quantity: initial[0].quantity,
    weightGsm: initial[0].weightGsm,
    customWeightPerPieceKg: initial[0].pieceWeightKg,
    dyeType: initial[0].dyeingRecord.dyeType,
    cetpRecyclingRate: initial[0].cetpRecord.waterRecycledPercent / 100,
    destinationPort: initial[0].destinationPort,
    freightMode: initial[0].freightMode,
  });

  return initial;
}

let batches = getInitialBatches();

export const store = {
  getBatches: () => batches,
  
  getBatchById: (id) => batches.find(b => b.id === id || (b.passport && b.passport.id === id)),

  getBatchByPassportId: (passportId) => batches.find(b => b.passport && b.passport.id === passportId),

  resetDemo: () => {
    batches = getInitialBatches();
    return batches;
  },

  createBatch: (data) => {
    const nextNum = batches.length + 42;
    const id = `VS-2026-${String(nextNum).padStart(4, '0')}`;
    
    const newBatch = {
      id,
      orderRef: data.orderRef || `PO-EXP-${Date.now().toString().slice(-4)}`,
      buyerName: data.buyerName || 'European Fashion Importer',
      targetCountry: data.targetCountry || 'Germany',
      destinationPort: data.destinationPort || 'rotterdam',
      garmentType: data.garmentType || 'polo',
      garmentTitle: data.garmentTitle || 'Organic Cotton Polo',
      styleCode: data.styleCode || `ZR-26-ORG-${Math.floor(10 + Math.random() * 89)}`,
      fabricType: data.fabricType || 'organic_cotton',
      fabricDescription: data.fabricDescription || '100% GOTS Certified Organic Cotton',
      yarnSpinningMill: data.yarnSpinningMill || 'Coimbatore Heritage Cotton Mills',
      weightGsm: Number(data.weightGsm) || 180,
      quantity: Number(data.quantity) || 4000,
      pieceWeightKg: Number(data.pieceWeightKg) || 0.22,
      freightMode: data.freightMode || 'sea',
      status: 'PENDING_DYER',
      createdAt: new Date().toISOString(),
      
      dyerId: data.dyerId || 'DYER-01',
      dyerName: data.dyerName || 'Rainbow Eco-Dyers Tiruppur',
      cetpId: data.cetpId || 'CETP-01',
      cetpName: data.cetpName || 'Arulpuram Common Effluent Treatment Plant (Unit 3)',

      fiberCertificate: data.fiberCertificate || {
        standard: 'GOTS Version 7.0',
        certificateNo: data.gotsLicenseNo || 'CU-841920',
        issuer: 'Control Union Certifications B.V.',
        certificateUrl: data.fiberCertificateUrl || '/sample-certs/gots-certificate.pdf',
        ocrVerified: !!data.fiberCertificateOcr,
        ocrData: data.fiberCertificateOcr || null,
        verifiedAt: new Date().toISOString(),
      },

      dyeingRecord: null,
      cetpRecord: null,
      passport: null,
    };

    batches.unshift(newBatch);
    return newBatch;
  },

  updateDyeingRecord: (batchId, dyeingData) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    batch.dyeingRecord = {
      dyeType: dyeingData.dyeType || 'low_impact_reactive',
      dyeProcessName: dyeingData.dyeProcessName || 'Energy-Efficient Cold Pad Batch (CPB) Reactive Dyeing',
      temperatureC: Number(dyeingData.temperatureC) || 60,
      chemicalCompliance: dyeingData.chemicalCompliance || 'OEKO-TEX® Standard 100 Class I & ZDHC MRSL Level 3',
      certificateNo: dyeingData.certificateNo || `OEKO-2026-TX-${Math.floor(10000 + Math.random() * 90000)}`,
      certificateUrl: dyeingData.certificateUrl || '/sample-certs/oeko-tex-certificate.pdf',
      ocrVerified: !!dyeingData.ocrData,
      ocrData: dyeingData.ocrData || null,
      verifiedBy: dyeingData.verifiedBy || 'Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)',
      completedAt: new Date().toISOString(),
      notes: dyeingData.notes || 'Zero Azo dyes, zero heavy metal mordants. 100% biomass steam boiler operated.',
    };

    if (!batch.cetpRecord) {
      batch.status = 'PENDING_CETP';
    } else if (!batch.passport) {
      store.generatePassport(batch.id);
    }

    return batch;
  },

  updateCetpRecord: (batchId, cetpData) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    batch.cetpRecord = {
      treatmentMethod: cetpData.treatmentMethod || 'Membrane Bio-Reactor (MBR) + Reverse Osmosis (RO) + Multi-Effect Evaporator (MEE)',
      zldStatus: cetpData.zldStatus || 'Verified 100% Zero Liquid Discharge',
      waterRecycledPercent: Number(cetpData.waterRecycledPercent) || 92,
      bodCodReductionPercent: Number(cetpData.bodCodReductionPercent) || 98.5,
      brineRecoveryPercent: Number(cetpData.brineRecoveryPercent) || 96.0,
      certificateNo: cetpData.certificateNo || `TNPCB-CETP-ZLD-BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      certificateUrl: cetpData.certificateUrl || '/sample-certs/tnpcb-zld-certificate.pdf',
      ocrVerified: !!cetpData.ocrData,
      ocrData: cetpData.ocrData || null,
      verifiedBy: cetpData.verifiedBy || 'M. Anandhan (Chief Environmental Engineer, Arulpuram CETP)',
      completedAt: new Date().toISOString(),
      notes: cetpData.notes || 'All reject salt crystallized into industrial grade sodium sulfate for reuse.',
    };

    if (batch.dyeingRecord) {
      store.generatePassport(batch.id);
    } else {
      batch.status = 'PENDING_DYER';
    }

    return batch;
  },

  generatePassport: (batchId) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    const passportId = `DPP-VS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomHash = '0x7f8a' + Array.from({length: 60}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const randomMerkle = '0x17c9' + Array.from({length: 28}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const footprint = calculateFootprint({
      fabricType: batch.fabricType,
      garmentType: batch.garmentType,
      quantity: batch.quantity,
      weightGsm: batch.weightGsm,
      customWeightPerPieceKg: batch.pieceWeightKg,
      dyeType: batch.dyeingRecord ? batch.dyeingRecord.dyeType : 'low_impact_reactive',
      cetpRecyclingRate: batch.cetpRecord ? (batch.cetpRecord.waterRecycledPercent / 100) : 0.92,
      destinationPort: batch.destinationPort,
      freightMode: batch.freightMode,
    });

    batch.passport = {
      id: passportId,
      qrCodeData: `https://vastrasetu.vercel.app/verify/${passportId}`,
      blockchainTxHash: randomHash,
      blockchainNetwork: 'Polygon PoS (Environmental Ledger)',
      merkleRoot: randomMerkle,
      ipfsMetadataHash: `ipfs://bafybeihdwd${Math.random().toString(36).substring(2, 9)}`,
      footprint,
      generatedAt: new Date().toISOString(),
      complianceScore: 98,
      euDppReady: true,
      readinessBreakdown: {
        productIdentity: true,
        materialComposition: true,
        supplyChain: true,
        environmentalData: true,
        certificates: true,
        circularity: true,
      },
      careGuide: {
        washTemp: '30°C Eco Cold Wash',
        drying: 'Natural Line Dry (Reduces Consumer Phase Carbon by 55%)',
        ironing: 'Warm Iron (110°C)',
        recyclability: '100% Circular Recyclable Design',
      }
    };

    batch.status = 'PASSPORT_GENERATED';
    return batch;
  },

  getAnalytics: () => {
    const totalBatches = batches.length;
    const generatedPassports = batches.filter(b => b.passport).length;
    const pendingDyer = batches.filter(b => b.status === 'PENDING_DYER').length;
    const pendingCetp = batches.filter(b => b.status === 'PENDING_CETP').length;

    let totalGarments = 0;
    let totalCarbonTrackedKg = 0;
    let totalCarbonSavedKg = 0;
    let totalWaterSavedLiters = 0;

    batches.forEach(b => {
      totalGarments += b.quantity;
      if (b.passport && b.passport.footprint) {
        totalCarbonTrackedKg += b.passport.footprint.carbon.totalKg;
        const convTotal = b.passport.footprint.carbon.conventionalBenchmarkKg * b.quantity;
        totalCarbonSavedKg += Math.max(0, convTotal - b.passport.footprint.carbon.totalKg);
        const convWaterTotal = b.passport.footprint.water.conventionalBenchmarkLiters * b.quantity;
        totalWaterSavedLiters += Math.max(0, convWaterTotal - b.passport.footprint.water.totalLiters);
      }
    });

    return {
      exporter: EXPORTER_PROFILE,
      totalBatches,
      generatedPassports,
      pendingDyer,
      pendingCetp,
      totalGarments,
      totalCarbonTrackedTonnes: Number((totalCarbonTrackedKg / 1000).toFixed(2)) || 4.8,
      totalCarbonSavedTonnes: Number((totalCarbonSavedKg / 1000).toFixed(2)) || 2.8,
      totalWaterSavedMillionLiters: Number((totalWaterSavedLiters / 1000000).toFixed(2)) || 2.4,
      euDppComplianceReadiness: 87,
      readinessChecklist: [
        { label: 'Product identity & style code', status: true },
        { label: 'Material composition & fiber origin', status: true },
        { label: 'Supply chain partner traceability', status: true },
        { label: 'LCA Environmental footprint data', status: true },
        { label: 'Audited compliance certificates', status: true },
        { label: 'Circularity & care instructions', status: true },
      ],
      topExportDestinations: [
        { country: 'Germany', percentage: 45, batches: 3 },
        { country: 'Netherlands', percentage: 25, batches: 2 },
        { country: 'United Kingdom', percentage: 20, batches: 1 },
        { country: 'Sweden', percentage: 10, batches: 1 },
      ],
      supplyChainPerformance: {
        dyeingPartners: 2,
        cetpFacilities: 2,
        verifiedBatches: generatedPassports,
        certificatesLogged: 12,
      },
      recentActivity: [
        { timestamp: 'Just now', event: 'Digital Product Passport DPP-VS-2026-00892 verified by Inditex EU scan', type: 'scan' },
        { timestamp: '1 hour ago', event: 'Arulpuram CETP Unit 3 certified ZLD compliance for VS-2026-0042', type: 'cetp' },
        { timestamp: '3 hours ago', event: 'Rainbow Eco-Dyers uploaded OEKO-TEX Standard 100 cert', type: 'dyeing' },
        { timestamp: '1 day ago', event: 'New Batch VS-2026-0043 created for H&M Conscious', type: 'batch' },
      ]
    };
  }
};
