// ── Animal acquisition cost per head (2025 Nigerian market prices) ────────────
const getAnimalAcquisitionCost = (numberOfAnimals, productionType, mortalityRate) => {
  const mortalityBuffer = 1 + (mortalityRate / 100);

  // Buy extra animals to account for expected mortality
  const animalsToAcquire = Math.ceil(numberOfAnimals * mortalityBuffer);

  if (productionType === "broiler") {
    const pricePerBird = 1000; // ₦800–₦1,200 avg
    return animalsToAcquire * pricePerBird;
  }
  if (productionType === "layer") {
    const pricePerBird = 1200; // ₦1,000–₦1,500 avg
    return animalsToAcquire * pricePerBird;
  }
  if (productionType === "beef") {
    const pricePerHead = 200000; // ₦150,000–₦300,000 avg weaner
    return animalsToAcquire * pricePerHead;
  }
  return 0;
};

// ── Derive total feed price from staged inputs ────────────────────────────────
const computeFeedPrice = (feedOperations, productionType) => {
  if (!feedOperations) return 0;

  if (feedOperations.manualOverride && feedOperations.feedPrice > 0) {
    return feedOperations.feedPrice;
  }

  if (productionType === "broiler") {
    const total = (feedOperations.broilerStarterCost || 0) + (feedOperations.broilerFinisherCost || 0);
    if (total > 0) return total;
  }
  if (productionType === "layer") {
    const total = (feedOperations.chickStarterCost || 0) + (feedOperations.growerMashCost || 0) + (feedOperations.layerMashCost || 0);
    if (total > 0) return total;
  }
  if (productionType === "beef") {
    const total = (feedOperations.feedCostPerKg || 0) + (feedOperations.supplementCost || 0);
    if (total > 0) return total;
  }

  return feedOperations.feedPrice || 0;
};

// ── Housing cost helpers ──────────────────────────────────────────────────────
const getPoultryHousingCost = (n, h) => {
  if (h?.housingStatus === "existing" || h?.housingStatus === "not-required") return 0;
  if (h?.hasHousing) return 0;

  const t = h?.housingType || "basic";
  if (t === "steel-structure" || t === "premium")  return n * 4000;
  if (t === "block-concrete"  || t === "standard") return n * 2500;
  return n * 1500;
};

const getCattleHousingCost = (n, h) => {
  if (h?.housingStatus === "existing" || h?.housingStatus === "not-required") return 0;
  if (h?.hasHousing) return 0;

  const t = h?.housingType || "basic";
  if (t === "steel-structure" || t === "premium")  return n * 150000;
  if (t === "block-concrete"  || t === "standard") return n * 130000;
  return n * 80000;
};

// ── Shared cost helpers ───────────────────────────────────────────────────────
const getEquipmentCost = (n, equipment = []) =>
  equipment?.length ? equipment.length * n * 50 : 0;

const getVaccinationCost = (n, program) => {
  if (program === "intensive")                       return n * 500;
  if (program === "standard")                        return n * 250;
  if (program === "minimal" || program === "basic")  return n * 100;
  return 0;
};

const getMedicationCost = (n, intensity) => {
  if (intensity === "high")   return n * 400;
  if (intensity === "medium") return n * 200;
  if (intensity === "low")    return n * 100;
  return 0;
};

const getVetServiceCost = (n, frequency) => {
  if (frequency === "weekly")    return n * 300;
  if (frequency === "monthly")   return n * 150;
  if (frequency === "quarterly") return n * 75;
  return 0;
};

const getParasiteControlCost = (n, parasiteControl) => {
  if (parasiteControl === "regular")    return n * 200;
  if (parasiteControl === "occasional") return n * 100;
  return 0;
};

// ── Poultry estimation ────────────────────────────────────────────────────────
const runPoultryEstimation = (estimation) => {
  const setup   = estimation.productionSetup       || {};
  const housing = estimation.housingInfrastructure || {};
  const feed    = estimation.feedOperations        || {};
  const health  = estimation.healthManagement      || {};

  const n             = setup.numberOfAnimals || 0;
  const cycleDuration = setup.cycleDuration   || 0;
  const productionType= setup.productionType;
  const mortalityRate = health.mortalityRate  || 0;

  const feedPrice       = computeFeedPrice(feed, productionType);
  const laborCost       = feed.laborCost       || 0;
  const electricityCost = feed.electricityCost || 0;

  // Market inputs now in feedOperations
  const sellingPricePerKg = feed.sellingPricePerKg || 0;
  const eggPricePerEgg    = feed.eggPricePerEgg    || 0;

  // ── Startup costs ──
  const animalAcquisitionCost = getAnimalAcquisitionCost(n, productionType, mortalityRate);
  const housingCost           = getPoultryHousingCost(n, housing);
  const equipmentCost         = getEquipmentCost(n, housing.equipment);
  const vaccinationCost       = getVaccinationCost(n, health.vaccinationProgram);

  // ── Operating costs ──
  const medicationCost  = getMedicationCost(n, health.medicationIntensity);
  const vetServiceCost  = getVetServiceCost(n, health.vetServiceFrequency);

  const totalStartupCost =
    animalAcquisitionCost + housingCost + equipmentCost + vaccinationCost;

  const totalOperatingCost =
    feedPrice + laborCost + electricityCost + medicationCost + vetServiceCost;

  const totalCostEstimation = totalStartupCost + totalOperatingCost;

  const surviving = n * (1 - mortalityRate / 100);
  let projectedRevenue = 0;

  if (productionType === "broiler") {
    projectedRevenue = surviving * 2.2 * sellingPricePerKg;
  } else if (productionType === "layer") {
    projectedRevenue = surviving * (cycleDuration * 5) * eggPricePerEgg;
  }

  const projectedProfit = projectedRevenue - totalCostEstimation;
  const roi = totalCostEstimation > 0
    ? (projectedProfit / totalCostEstimation) * 100
    : 0;

  return {
    totalCostEstimation,
    projectedRevenue,
    projectedProfit,
    roi,
    costBreakdown: {
      startupCosts: {
        animalAcquisitionCost,
        housingCost,
        equipmentCost,
        vaccinationCost,
        totalStartupCost,
      },
      operatingCosts: {
        feedPrice,
        laborCost,
        electricityCost,
        medicationCost,
        vetServiceCost,
        totalOperatingCost,
      },
      totalCostEstimation,
    },
  };
};

// ── Cattle estimation ─────────────────────────────────────────────────────────
const runCattleEstimation = (estimation) => {
  const setup   = estimation.productionSetup       || {};
  const housing = estimation.housingInfrastructure || {};
  const feed    = estimation.feedOperations        || {};
  const health  = estimation.healthManagement      || {};

  const n            = setup.numberOfAnimals || 0;
  const productionType = setup.productionType;
  const mortalityRate  = health.mortalityRate || 0;

  const feedPrice       = computeFeedPrice(feed, productionType);
  const laborCost       = feed.laborCost       || 0;
  const electricityCost = feed.electricityCost || 0;

  const sellingPricePerKg = feed.sellingPricePerKg || 0;

  // ── Startup costs ──
  const animalAcquisitionCost = getAnimalAcquisitionCost(n, productionType, mortalityRate);
  const housingCost           = getCattleHousingCost(n, housing);
  const equipmentCost         = getEquipmentCost(n, housing.equipment);
  const vaccinationCost       = getVaccinationCost(n, health.vaccinationProgram);

  // ── Operating costs ──
  const medicationCost      = getMedicationCost(n, health.medicationIntensity);
  const vetServiceCost      = getVetServiceCost(n, health.vetServiceFrequency);
  const parasiteControlCost = getParasiteControlCost(n, health.parasiteControl);

  const totalStartupCost =
    animalAcquisitionCost + housingCost + equipmentCost + vaccinationCost;

  const totalOperatingCost =
    feedPrice + laborCost + electricityCost +
    medicationCost + vetServiceCost + parasiteControlCost;

  const totalCostEstimation = totalStartupCost + totalOperatingCost;

  const surviving = n * (1 - mortalityRate / 100);
  const projectedRevenue = productionType === "beef"
    ? surviving * 250 * sellingPricePerKg
    : 0;

  const projectedProfit = projectedRevenue - totalCostEstimation;
  const roi = totalCostEstimation > 0
    ? (projectedProfit / totalCostEstimation) * 100
    : 0;

  return {
    totalCostEstimation,
    projectedRevenue,
    projectedProfit,
    roi,
    costBreakdown: {
      startupCosts: {
        animalAcquisitionCost,
        housingCost,
        equipmentCost,
        vaccinationCost,
        totalStartupCost,
      },
      operatingCosts: {
        feedPrice,
        laborCost,
        electricityCost,
        medicationCost,
        vetServiceCost,
        parasiteControlCost,
        totalOperatingCost,
      },
      totalCostEstimation,
    },
  };
};

// ── Entry point ───────────────────────────────────────────────────────────────
export const runEstimation = (estimation) => {
  if (estimation.livestockType === "poultry") return runPoultryEstimation(estimation);
  if (estimation.livestockType === "cattle")  return runCattleEstimation(estimation);
  throw new Error("Unsupported livestock type");
};
