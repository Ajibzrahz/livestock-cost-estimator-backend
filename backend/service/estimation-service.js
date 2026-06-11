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
const getPoultryHousingCost = (numberOfAnimals, h) => {
  if (h?.housingStatus === "existing" || h?.housingStatus === "not-required") return 0;
  if (h?.hasHousing) return 0;

  const t = h?.housingType || "basic";
  if (t === "steel-structure" || t === "premium")  return numberOfAnimals * 4000;
  if (t === "block-concrete"  || t === "standard") return numberOfAnimals * 2500;
  return numberOfAnimals * 1500; // wooden / basic
};

const getCattleHousingCost = (numberOfAnimals, h) => {
  if (h?.housingStatus === "existing" || h?.housingStatus === "not-required") return 0;
  if (h?.hasHousing) return 0;

  const t = h?.housingType || "basic";
  if (t === "steel-structure" || t === "premium")  return numberOfAnimals * 150000;
  if (t === "block-concrete"  || t === "standard") return numberOfAnimals * 130000;
  return numberOfAnimals * 80000; // wooden / basic
};

// ── Shared cost helpers ───────────────────────────────────────────────────────
const getEquipmentCost = (n, equipment = []) =>
  equipment?.length ? equipment.length * n * 50 : 0;

const getVaccinationCost = (n, program) => {
  if (program === "intensive")                    return n * 500;
  if (program === "standard")                     return n * 250;
  if (program === "minimal" || program === "basic") return n * 100;
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

  const feedPrice       = computeFeedPrice(feed, productionType);
  const laborCost       = feed.laborCost       || 0;
  const electricityCost = feed.electricityCost || 0;
  const mortalityRate   = health.mortalityRate || 0;

  // Market inputs now live in feedOperations
  const sellingPricePerKg = feed.sellingPricePerKg || 0;
  const eggPricePerEgg    = feed.eggPricePerEgg    || 0;

  const housingCost     = getPoultryHousingCost(n, housing);
  const equipmentCost   = getEquipmentCost(n, housing.equipment);
  const vaccinationCost = getVaccinationCost(n, health.vaccinationProgram);
  const medicationCost  = getMedicationCost(n, health.medicationIntensity);
  const vetServiceCost  = getVetServiceCost(n, health.vetServiceFrequency);

  const totalCostEstimation =
    feedPrice + laborCost + electricityCost +
    housingCost + equipmentCost +
    vaccinationCost + medicationCost + vetServiceCost;

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
      feedPrice, laborCost, electricityCost,
      housingCost, equipmentCost,
      vaccinationCost, medicationCost, vetServiceCost,
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

  const feedPrice       = computeFeedPrice(feed, productionType);
  const laborCost       = feed.laborCost       || 0;
  const electricityCost = feed.electricityCost || 0;
  const mortalityRate   = health.mortalityRate || 0;

  // Market inputs now live in feedOperations
  const sellingPricePerKg = feed.sellingPricePerKg || 0;

  const housingCost         = getCattleHousingCost(n, housing);
  const equipmentCost       = getEquipmentCost(n, housing.equipment);
  const vaccinationCost     = getVaccinationCost(n, health.vaccinationProgram);
  const medicationCost      = getMedicationCost(n, health.medicationIntensity);
  const vetServiceCost      = getVetServiceCost(n, health.vetServiceFrequency);
  const parasiteControlCost = getParasiteControlCost(n, health.parasiteControl);

  const totalCostEstimation =
    feedPrice + laborCost + electricityCost +
    housingCost + equipmentCost +
    vaccinationCost + medicationCost + vetServiceCost + parasiteControlCost;

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
      feedPrice, laborCost, electricityCost,
      housingCost, equipmentCost,
      vaccinationCost, medicationCost, vetServiceCost, parasiteControlCost,
    },
  };
};

// ── Entry point ───────────────────────────────────────────────────────────────
export const runEstimation = (estimation) => {
  if (estimation.livestockType === "poultry") return runPoultryEstimation(estimation);
  if (estimation.livestockType === "cattle")  return runCattleEstimation(estimation);
  throw new Error("Unsupported livestock type");
};
