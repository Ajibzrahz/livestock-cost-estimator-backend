import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    livestockType: {
      type: String,
      enum: ["cattle", "poultry"],
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },

    currentStep: {
      type: Number,
      default: 1,
    },

    // ── STEP 1 — PRODUCTION SETUP ─────────────────────────────────────────────
    productionSetup: {
      productionType: {
        type: String,
        enum: ["broiler", "layer", "beef"],
      },
      productionSystem: {
        type: String,
        enum: [
          "intensive",
          "semi-intensive",
          "extensive",
          "deep litter",
          "battery cage",
          "mixed",
        ],
      },
      numberOfAnimals: { type: Number, min: 1 },
      cycleDuration: { type: Number, min: 1 },
      location: { type: String, trim: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    // ── STEP 2 — HOUSING & INFRASTRUCTURE ────────────────────────────────────
    housingInfrastructure: {
      housingStatus: {
        type: String,
        enum: ["existing", "need-to-build", "not-required"],
        default: "existing",
      },
      housingType: {
        type: String,
        enum: [
          "wooden",
          "block-concrete",
          "steel-structure",
          "basic",
          "standard",
          "premium",
        ],
      },
      requiredSpace: { type: Number, min: 0 },
      farmSize: { type: Number, min: 0 },
      waterSource: { type: String, trim: true },
      buildingMaterial: { type: String, trim: true },
      fencingType: { type: String, trim: true },
      equipment: [{ type: String, trim: true }],

      // Backward compatibility
      hasHousing: { type: Boolean, default: false },
      capacity: { type: Number, min: 0 },
    },

    // ── STEP 3 — FEED & OPERATIONS ────────────────────────────────────────────
    // Market inputs merged into this step
    feedOperations: {
      // Poultry broiler staged feed (per 25kg bag)
      broilerStarterCost: { type: Number, min: 0, default: 0 },
      broilerFinisherCost: { type: Number, min: 0, default: 0 },

      // Poultry layer staged feed (per 25kg bag)
      chickStarterCost: { type: Number, min: 0, default: 0 },
      growerMashCost: { type: Number, min: 0, default: 0 },
      layerMashCost: { type: Number, min: 0, default: 0 },

      // Cattle feed
      feedCostPerKg: { type: Number, min: 0, default: 0 },
      supplementCost: { type: Number, min: 0, default: 0 },
      grazingAvailability: { type: Boolean, default: false },

      // Computed total feed price (set by backend)
      feedPrice: { type: Number, min: 0, default: 0 },

      // Manual override toggle
      manualOverride: { type: Boolean, default: false },

      // Shared
      laborCost: { type: Number, min: 0, default: 0 },
      electricityCost: { type: Number, min: 0, default: 0 },

      // Market inputs merged here (no longer a separate step)
      sellingPricePerKg: { type: Number, min: 0, default: 0 },
      eggPricePerEgg: { type: Number, min: 0, default: 0 },
    },

    // ── STEP 4 — HEALTH MANAGEMENT ────────────────────────────────────────────
    healthManagement: {
      mortalityRate: { type: Number, min: 0, max: 100 },
      vaccinationProgram: {
        type: String,
        enum: ["minimal", "basic", "standard", "intensive"],
      },
      vetServiceFrequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly"],
      },
      medicationIntensity: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      diseaseRiskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      // Cattle only
      parasiteControl: {
        type: String,
        enum: ["none", "occasional", "regular"],
        default: "none",
      },
    },

    // ── RESULTS ───────────────────────────────────────────────────────────────
    results: {
      totalCostEstimation: { type: Number, default: 0 },
      projectedRevenue: { type: Number, default: 0 },
      projectedProfit: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
    },

    // ── ML OUTPUT ─────────────────────────────────────────────────────────────
    modelOutput: {
      predictedFeedCost: { type: Number, default: 0 },
      predictedLaborCost: { type: Number, default: 0 },
      predictedElectricityCost: { type: Number, default: 0 },
      confidenceScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const Estimation = mongoose.model("Estimation", estimationSchema);
export default Estimation;
