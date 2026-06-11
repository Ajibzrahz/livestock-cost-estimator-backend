const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:8000";

// ── Smart defaults by livestock/production type ───────────────────────────────
const SMART_DEFAULTS = {
  poultry: {
    broiler: {
      feedPrice: 650000,
      laborCost: 80000,
      electricityCost: 25000,
      mortalityRate: 5,
      vaccinationProgram: "standard",
      medicationIntensity: "medium",
      vetServiceFrequency: "monthly",
      sellingPricePerKg: 3500,
      eggPricePerEgg: 0,
    },
    layer: {
      feedPrice: 700000,
      laborCost: 90000,
      electricityCost: 30000,
      mortalityRate: 4,
      vaccinationProgram: "standard",
      medicationIntensity: "medium",
      vetServiceFrequency: "monthly",
      sellingPricePerKg: 0,
      eggPricePerEgg: 120,
    },
  },
  cattle: {
    beef: {
      feedPrice: 350000,
      laborCost: 120000,
      electricityCost: 30000,
      mortalityRate: 3,
      vaccinationProgram: "standard",
      medicationIntensity: "low",
      vetServiceFrequency: "quarterly",
      sellingPricePerKg: 5000,
      eggPricePerEgg: 0,
    },
  },
};

// ── Compute total feed price from staged inputs ───────────────────────────────
const computeTotalFeedPrice = (feed, productionType, defaults) => {
  if (!feed) return defaults.feedPrice || 0;
  if (feed.manualOverride && feed.feedPrice > 0) return feed.feedPrice;

  if (productionType === "broiler") {
    const t = (feed.broilerStarterCost || 0) + (feed.broilerFinisherCost || 0);
    if (t > 0) return t;
  }
  if (productionType === "layer") {
    const t =
      (feed.chickStarterCost || 0) +
      (feed.growerMashCost || 0) +
      (feed.layerMashCost || 0);
    if (t > 0) return t;
  }
  if (productionType === "beef") {
    const t = (feed.feedCostPerKg || 0) + (feed.supplementCost || 0);
    if (t > 0) return t;
  }

  return feed.feedPrice || defaults.feedPrice || 0;
};

// ── Apply smart defaults ───────────────────────────────────────────────────────
export const applySmartDefaults = (estimation) => {
  const lt = estimation.livestockType;
  const pt = estimation.productionSetup?.productionType;
  const defaults = SMART_DEFAULTS[lt]?.[pt] || {};

  const feed = estimation.feedOperations || {};
  const health = estimation.healthManagement || {};

  const feedPrice = computeTotalFeedPrice(feed, pt, defaults);

  return {
    feedPrice: feedPrice || defaults.feedPrice || 0,
    laborCost: feed.laborCost || defaults.laborCost || 0,
    electricityCost: feed.electricityCost || defaults.electricityCost || 0,

    // Market inputs now in feedOperations
    sellingPricePerKg:
      feed.sellingPricePerKg || defaults.sellingPricePerKg || 0,
    eggPricePerEgg: feed.eggPricePerEgg || defaults.eggPricePerEgg || 0,

    mortalityRate: health.mortalityRate || defaults.mortalityRate || 5,
    vaccinationProgram:
      health.vaccinationProgram || defaults.vaccinationProgram || "standard",
    medicationIntensity:
      health.medicationIntensity || defaults.medicationIntensity || "medium",
    vetServiceFrequency:
      health.vetServiceFrequency || defaults.vetServiceFrequency || "monthly",
    diseaseRiskLevel: health.diseaseRiskLevel || "medium",
    parasiteControl: health.parasiteControl || "none",
  };
};

// ── Build ML payload ───────────────────────────────────────────────────────────
const buildMLPayload = (estimation) => {
  const filled = applySmartDefaults(estimation);
  const setup = estimation.productionSetup || {};
  const housing = estimation.housingInfrastructure || {};

  const hasHousing =
    housing.housingStatus === "existing" ||
    housing.housingStatus === "not-required" ||
    housing.hasHousing === true;

  return {
    livestockType: estimation.livestockType,
    productionType: setup.productionType,
    productionSystem: setup.productionSystem,
    numberOfAnimals: setup.numberOfAnimals,
    cycleDuration: setup.cycleDuration,
    location: setup.location,

    hasHousing,
    housingType: housing.housingType || "basic",
    capacity: housing.capacity || housing.requiredSpace || 0,
    equipmentCount: (housing.equipment || []).length,

    feedPrice: filled.feedPrice,
    laborCost: filled.laborCost,
    electricityCost: filled.electricityCost,

    mortalityRate: filled.mortalityRate,
    vaccinationProgram: filled.vaccinationProgram,
    medicationIntensity: filled.medicationIntensity,
    vetServiceFrequency: filled.vetServiceFrequency,
    diseaseRiskLevel: filled.diseaseRiskLevel,

    sellingPricePerKg: filled.sellingPricePerKg,
    eggPricePerEgg: filled.eggPricePerEgg,
    milkPricePerLiter: 0,

    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
};

// ── Get ML prediction ──────────────────────────────────────────────────────────
export const getMLPrediction = async (estimation) => {
  try {
    const payload = buildMLPayload(estimation);
    const feed = estimation.feedOperations || {};
    const health = estimation.healthManagement || {};

    const defaultsApplied = {
      feedPrice:
        !feed.feedPrice &&
        !feed.broilerStarterCost &&
        !feed.chickStarterCost &&
        !feed.feedCostPerKg,
      laborCost: !feed.laborCost,
      electricityCost: !feed.electricityCost,
      mortalityRate: !health.mortalityRate,
      sellingPricePerKg: !feed.sellingPricePerKg,
      eggPricePerEgg: !feed.eggPricePerEgg,
    };

    const response = await fetch(`${ML_SERVER_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[ML Service] Prediction failed:",
        response.status,
        errorBody,
      );
      return null;
    }

    const data = await response.json();

    return {
      predictedFeedCost: payload.feedPrice,
      predictedLaborCost: payload.laborCost,
      predictedElectricityCost: payload.electricityCost,
      confidenceScore: 0.92,
      mlUsed: true,
      defaultsApplied,

      mlTotalCostEstimation: data.totalCostEstimation,
      mlProjectedRevenue: data.projectedRevenue,
      mlProjectedProfit: data.projectedProfit,
      mlRoi: data.roi,
      confidenceNote: data.confidenceNote,
    };
  } catch (err) {
    console.warn(
      "[ML Service] Unavailable, using rule-based fallback:",
      err.message,
    );
    return null;
  }
};

// ── Health check ───────────────────────────────────────────────────────────────
export const checkMLHealth = async () => {
  try {
    const res = await fetch(`${ML_SERVER_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    console.log("[ML Service] Health check OK:", data);
    return true;
  } catch {
    console.warn("[ML Service] Health check FAILED — ML server may be down.");
    return false;
  }
};
