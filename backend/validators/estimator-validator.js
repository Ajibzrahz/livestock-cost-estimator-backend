import Joi from "joi";

// ── Step 1 — Create estimation ────────────────────────────────────────────────
const createEstimatorValidator = Joi.object({
  livestockType: Joi.string().valid("cattle", "poultry").required(),
});

// ── Step 2 — Production setup ─────────────────────────────────────────────────
const productionSetupValidator = Joi.object({
  productionType: Joi.string().valid("broiler", "layer", "beef").required(),
  productionSystem: Joi.string()
    .valid(
      "intensive",
      "semi-intensive",
      "extensive",
      "deep litter",
      "battery cage",
      "mixed",
    )
    .required(),
  numberOfAnimals: Joi.number().min(1).required(),
  cycleDuration: Joi.number().min(1).required(),
  location: Joi.string().trim().required(),
  coordinates: Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
  }).optional(),
});

// ── Step 3 — Housing & infrastructure ────────────────────────────────────────
const housingInfrastructureValidator = Joi.object({
  housingStatus: Joi.string()
    .valid("existing", "need-to-build", "not-required")
    .required(),
  housingType: Joi.when("housingStatus", {
    is: "need-to-build",
    then: Joi.string()
      .valid(
        "wooden",
        "block-concrete",
        "steel-structure",
        "basic",
        "standard",
        "premium",
      )
      .required(),
    otherwise: Joi.string().optional(),
  }),
  requiredSpace: Joi.number().min(0).optional(),
  farmSize: Joi.number().min(0).optional(),
  waterSource: Joi.string().trim().optional(),
  buildingMaterial: Joi.string().trim().optional(),
  fencingType: Joi.string().trim().optional(),
  equipment: Joi.array().items(Joi.string().trim()).default([]),
  hasHousing: Joi.boolean().optional(),
  capacity: Joi.number().min(0).optional(),
});

// ── Step 4 — Feed & operations (includes market inputs) ───────────────────────
const feedOperationsValidator = Joi.object({
  // Poultry broiler staged feed
  broilerStarterCost: Joi.number().min(0).optional(),
  broilerFinisherCost: Joi.number().min(0).optional(),

  // Poultry layer staged feed
  chickStarterCost: Joi.number().min(0).optional(),
  growerMashCost: Joi.number().min(0).optional(),
  layerMashCost: Joi.number().min(0).optional(),

  // Cattle feed
  feedCostPerKg: Joi.number().min(0).optional(),
  supplementCost: Joi.number().min(0).optional(),
  grazingAvailability: Joi.boolean().optional(),

  // Manual override
  feedPrice: Joi.number().min(0).optional(),
  manualOverride: Joi.boolean().optional(),

  // Shared
  laborCost: Joi.number().min(0).required(),
  electricityCost: Joi.number().min(0).required(),

  // Market inputs — now part of this step
  sellingPricePerKg: Joi.number().min(0).optional(),
  eggPricePerEgg: Joi.number().min(0).optional(),
});

// ── Step 5 (final) — Health management ───────────────────────────────────────
const healthManagementValidator = Joi.object({
  mortalityRate: Joi.number().min(0).max(100).required(),
  vaccinationProgram: Joi.string()
    .valid("minimal", "basic", "standard", "intensive")
    .required(),
  vetServiceFrequency: Joi.string()
    .valid("weekly", "monthly", "quarterly")
    .required(),
  medicationIntensity: Joi.string().valid("low", "medium", "high").required(),
  diseaseRiskLevel: Joi.string().valid("low", "medium", "high").optional(),
  parasiteControl: Joi.string()
    .valid("none", "occasional", "regular")
    .optional(),
});

export {
  createEstimatorValidator,
  productionSetupValidator,
  housingInfrastructureValidator,
  feedOperationsValidator,
  healthManagementValidator,
};
