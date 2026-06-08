/**
 * LivestockIQ — ML Service
 * ─────────────────────────
 * Called from estimation-controller.js during the /calculate step.
 * Sends the completed estimation to the Python inference server,
 * gets back ML predictions, and merges them into the modelOutput field.
 *
 * Usage in estimation-controller.js:
 *
 *   import { getMLPrediction } from "../service/ml-service.js";
 *
 *   // inside calculateEstimation controller, after runEstimation():
 *   const mlOutput = await getMLPrediction(estimation);
 *   estimation.modelOutput = mlOutput;
 */

const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:8000";

/**
 * Converts a Mongoose Estimation document into the flat payload
 * the Python inference server expects.
 *
 * @param {import("../models/estimation.js").default} estimation
 * @returns {Object}
 */
const buildMLPayload = (estimation) => {
  const {
    livestockType,
    productionSetup = {},
    housingInfrastructure = {},
    feedOperations = {},
    healthManagement = {},
    marketInputs = {},
  } = estimation;

  return {
    // Step 1
    livestockType,

    // Step 2 – production setup
    productionType:   productionSetup.productionType,
    productionSystem: productionSetup.productionSystem,
    numberOfAnimals:  productionSetup.numberOfAnimals,
    cycleDuration:    productionSetup.cycleDuration,
    location:         productionSetup.location,

    // Step 3 – housing
    hasHousing:     housingInfrastructure.hasHousing ?? false,
    housingType:    housingInfrastructure.housingType || "basic",
    capacity:       housingInfrastructure.capacity    || 0,
    equipmentCount: (housingInfrastructure.equipment || []).length,

    // Step 4 – feed & ops
    feedPrice:       feedOperations.feedPrice       || 0,
    laborCost:       feedOperations.laborCost        || 0,
    electricityCost: feedOperations.electricityCost  || 0,

    // Step 5 – health
    mortalityRate:       healthManagement.mortalityRate       || 0,
    vaccinationProgram:  healthManagement.vaccinationProgram  || "minimal",
    vetServiceFrequency: healthManagement.vetServiceFrequency || "monthly",
    medicationIntensity: healthManagement.medicationIntensity || "low",
    diseaseRiskLevel:    healthManagement.diseaseRiskLevel    || "low",

    // Step 6 – market
    sellingPricePerKg: marketInputs.sellingPricePerKg || 0,
    eggPricePerEgg:    marketInputs.eggPricePerEgg    || 0,
    milkPricePerLiter: marketInputs.milkPricePerLiter || 0,
  };
};

/**
 * Sends estimation data to the Python ML server and returns predictions.
 *
 * On success returns:
 *   {
 *     totalCostEstimation : number,
 *     projectedRevenue    : number,
 *     projectedProfit     : number,
 *     roi                 : number,
 *     confidenceNote      : string,
 *     mlUsed              : true,
 *   }
 *
 * On failure (ML server unavailable) returns null so the caller can
 * fall back gracefully to the rule-based estimation-service.js result.
 *
 * @param {import("../models/estimation.js").default} estimation
 * @returns {Promise<Object|null>}
 */
export const getMLPrediction = async (estimation) => {
  try {
    const payload = buildMLPayload(estimation);

    const response = await fetch(`${ML_SERVER_URL}/predict`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(8000), // 8-second timeout
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[ML Service] Prediction failed:", response.status, errorBody);
      return null;
    }

    const data = await response.json();

    return {
      predictedFeedCost:       payload.feedPrice,       // already supplied by user
      predictedLaborCost:      payload.laborCost,        // already supplied by user
      predictedElectricityCost:payload.electricityCost,  // already supplied by user
      confidenceScore:         0.92,                     // placeholder until model exposes it
      mlUsed:                  true,
      // ML-adjusted financial outputs
      mlTotalCostEstimation:   data.totalCostEstimation,
      mlProjectedRevenue:      data.projectedRevenue,
      mlProjectedProfit:       data.projectedProfit,
      mlRoi:                   data.roi,
      confidenceNote:          data.confidenceNote,
    };
  } catch (err) {
    // Network error, timeout, or server down — degrade gracefully
    console.warn("[ML Service] Unavailable, using rule-based fallback:", err.message);
    return null;
  }
};

/**
 * Quick health check — call this on backend startup to warn early
 * if the ML server is not reachable.
 */
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
