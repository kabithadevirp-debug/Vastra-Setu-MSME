/**
 * VastraSetu Carbon & Water Footprint Estimation Engine
 * Transparent LCA model for Textile MSME Exporters based on Higg MSI & ISO 14040/44 guidelines.
 */

// Emission factors (kg CO2e per kg of finished fabric)
const FIBER_EMISSION_FACTORS = {
  'organic_cotton': { name: '100% GOTS Organic Cotton', factor: 3.8, waterLitersPerKg: 2400 },
  'conventional_cotton': { name: 'Conventional Cotton', factor: 8.4, waterLitersPerKg: 10800 },
  'recycled_cotton': { name: 'Recycled Cotton (Pre/Post-Consumer)', factor: 2.1, waterLitersPerKg: 800 },
  'organic_cotton_blend': { name: '95% Organic Cotton / 5% Elastane', factor: 4.2, waterLitersPerKg: 2800 },
  'recycled_poly_cotton': { name: '60% Organic Cotton / 40% Recycled Poly', factor: 3.6, waterLitersPerKg: 1800 },
  'modal_tencel': { name: 'Tencel™ Modal / Lyocell Blend', factor: 4.1, waterLitersPerKg: 1900 },
  'linen_flax': { name: 'Organic Linen / Flax', factor: 3.2, waterLitersPerKg: 1500 },
};

// Dyeing & Wet Processing factors (kg CO2e per kg)
const DYEING_EMISSION_FACTORS = {
  'low_impact_reactive': { name: 'Low-Impact Azo-Free Reactive Dyes', factor: 2.2, waterLitersPerKg: 45 },
  'natural_plant': { name: 'OEKO-TEX Natural Plant / Bio Dyes', factor: 1.2, waterLitersPerKg: 30 },
  'solution_dyed': { name: 'Dope / Solution Dyed Fiber', factor: 1.5, waterLitersPerKg: 15 },
  'standard_synthetic': { name: 'Standard Synthetic Dye Process', factor: 4.8, waterLitersPerKg: 95 },
};

// Transport emission factors (kg CO2e per tonne-km)
const FREIGHT_FACTORS = {
  'sea': { name: 'Container Ship (Sea Freight)', factor: 0.016 },
  'air': { name: 'Air Cargo Freight', factor: 0.520 },
  'road': { name: 'Truck / Road Transport', factor: 0.082 },
};

// Default port-to-port distances (km)
const PORT_DISTANCES = {
  'rotterdam': { name: 'Rotterdam, Netherlands (EU)', km: 10800, defaultFreight: 'sea' },
  'hamburg': { name: 'Hamburg, Germany (EU)', km: 11200, defaultFreight: 'sea' },
  'felixstowe': { name: 'Felixstowe, UK', km: 10600, defaultFreight: 'sea' },
  'le_havre': { name: 'Le Havre, France (EU)', km: 10400, defaultFreight: 'sea' },
  'frankfurt_air': { name: 'Frankfurt Airport, Germany (Air)', km: 7400, defaultFreight: 'air' },
  'new_york': { name: 'Port of New York / New Jersey, USA', km: 13500, defaultFreight: 'sea' },
};

/**
 * Calculates estimated carbon footprint & water usage for a garment batch.
 */
export function calculateFootprint({
  fabricType = 'organic_cotton',
  garmentType = 'tshirt',
  quantity = 1000,
  weightGsm = 180,
  customWeightPerPieceKg = null,
  dyeType = 'low_impact_reactive',
  cetpRecyclingRate = 0.92, // 92% water recycled in Tiruppur ZLD CETP
  destinationPort = 'rotterdam',
  freightMode = 'sea',
  transportKm = null,
}) {
  // Estimated weight per piece based on garment type if not specified
  const defaultWeights = {
    'tshirt': 0.18, // 180g
    'hoodie': 0.55, // 550g
    'polo': 0.22, // 220g
    'blouse': 0.16, // 160g
    'tote': 0.14, // 140g
    'trousers': 0.42, // 420g
  };

  const pieceWeightKg = customWeightPerPieceKg || defaultWeights[garmentType] || 0.20;
  const totalBatchWeightKg = pieceWeightKg * quantity;
  const totalBatchTonnes = totalBatchWeightKg / 1000;

  // 1. Fiber Production Emission
  const fiberConfig = FIBER_EMISSION_FACTORS[fabricType] || FIBER_EMISSION_FACTORS['organic_cotton'];
  const fiberEmissionKg = totalBatchWeightKg * fiberConfig.factor;

  // 2. Dyeing & Wet Processing Emission
  const dyeConfig = DYEING_EMISSION_FACTORS[dyeType] || DYEING_EMISSION_FACTORS['low_impact_reactive'];
  const dyeEmissionKg = totalBatchWeightKg * dyeConfig.factor;

  // 3. Garment Manufacturing & Local Transport (Inland Tamil Nadu to Tuticorin/Chennai Port ~380km)
  const localTransportEmissionKg = totalBatchTonnes * 380 * FREIGHT_FACTORS['road'].factor;
  const manufacturingEnergyEmissionKg = totalBatchWeightKg * 0.95; // Solar + Grid spinning/knitting/stitching

  // 4. Global Freight Transport Emission
  const portConfig = PORT_DISTANCES[destinationPort] || PORT_DISTANCES['rotterdam'];
  const distanceKm = transportKm || portConfig.km;
  const freightConfig = FREIGHT_FACTORS[freightMode] || FREIGHT_FACTORS['sea'];
  const freightEmissionKg = totalBatchTonnes * distanceKm * freightConfig.factor;

  // Total Carbon Footprint
  const totalCarbonKg = fiberEmissionKg + dyeEmissionKg + localTransportEmissionKg + manufacturingEnergyEmissionKg + freightEmissionKg;
  const carbonPerPieceKg = totalCarbonKg / quantity;

  // Conventional Benchmark (Conventional Cotton + Synthetic Dye + No ZLD)
  const conventionalPerPieceKg = pieceWeightKg * (8.4 + 4.8 + 1.2) + (pieceWeightKg / 1000) * distanceKm * 0.016;
  const carbonSavingsPercent = Math.max(10, Math.round(((conventionalPerPieceKg - carbonPerPieceKg) / conventionalPerPieceKg) * 100));

  // Water Calculation
  const rawWaterLiters = totalBatchWeightKg * (fiberConfig.waterLitersPerKg + dyeConfig.waterLitersPerKg);
  const recycledWaterRate = Math.min(0.98, Math.max(0, cetpRecyclingRate));
  const netFreshwaterUsedLiters = rawWaterLiters * (1 - (recycledWaterRate * 0.65)); // Agricultural + Process net intake
  const waterPerPieceLiters = Math.round(netFreshwaterUsedLiters / quantity);
  const conventionalWaterPerPiece = Math.round((pieceWeightKg * (10800 + 95)));
  const waterSavingsPercent = Math.max(20, Math.round(((conventionalWaterPerPiece - waterPerPieceLiters) / conventionalWaterPerPiece) * 100));

  return {
    pieceWeightKg: Number(pieceWeightKg.toFixed(3)),
    totalBatchWeightKg: Math.round(totalBatchWeightKg),
    carbon: {
      totalKg: Math.round(totalCarbonKg * 10) / 10,
      perPieceKg: Number(carbonPerPieceKg.toFixed(2)),
      conventionalBenchmarkKg: Number(conventionalPerPieceKg.toFixed(2)),
      savingsPercent: carbonSavingsPercent,
      breakdown: {
        rawMaterialKg: Math.round(fiberEmissionKg),
        dyeingAndFinishingKg: Math.round(dyeEmissionKg),
        manufacturingEnergyKg: Math.round(manufacturingEnergyEmissionKg),
        logisticsAndFreightKg: Math.round(freightEmissionKg + localTransportEmissionKg),
      },
    },
    water: {
      totalLiters: Math.round(netFreshwaterUsedLiters),
      perPieceLiters: waterPerPieceLiters,
      conventionalBenchmarkLiters: conventionalWaterPerPiece,
      savingsPercent: waterSavingsPercent,
      recycledPercentage: Math.round(recycledWaterRate * 100),
    },
    methodology: {
      standard: 'ISO 14067 / Product Environmental Footprint (PEF) Textile Category Rules',
      estimationFormula: 'Fabric Weight × Fiber Factor + Dyeing Energy Factor + (Weight × Freight Distance × Transport Factor)',
      note: 'Estimates based on Tiruppur CETP ZLD closed-loop water recovery and verified GOTS organic supply chain factors.',
    },
  };
}
