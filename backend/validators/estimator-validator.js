import Joi from "joi";

const createEstimatorValidator = Joi.object({
  livestockType: Joi.string().valid("cattle", "poultry").required(),
});

const productionSetupValidator = Joi.object({
  productionType: Joi.string()
    .valid("broiler", "layer", "beef", "dairy")
    .required(),
  productionSystem: Joi.string()
    .valid(
      "intensive",
      "semi-intensive",
      "extensive",
      "deep litter",
      "battery cage",
    )
    .required(),
  numberOfAnimals: Joi.number().min(1).required(),
  cycleDuration: Joi.number().min(1).required(),
  location: Joi.string().trim().required(),
});

const housingInfrastructureValidator = Joi.object({
  hasHousing: Joi.boolean().required(),

  housingType: Joi.when("hasHousing", {
    is: false,
    then: Joi.string().valid("basic", "standard", "premium").required(),
    otherwise: Joi.string().optional(),
  }),
  capacity: Joi.number().min(0).required(),

  equipment: Joi.array().items(Joi.string().trim()).default([]),
});

const feedOperationsValidator = Joi.object({
  feedPrice: Joi.number().min(0).required(),
  laborCost: Joi.number().min(0).required(),
  electricityCost: Joi.number().min(0).required(),
});

const healthManagementValidator = Joi.object({
  mortalityRate: Joi.number().min(0).max(100).required(),

  vaccinationProgram: Joi.string()
    .valid("minimal", "standard", "intensive")
    .required(),

  vetServiceFrequency: Joi.string()
    .valid("weekly", "monthly", "quarterly")
    .required(),

  medicationIntensity: Joi.string().valid("low", "medium", "high").required(),

  diseaseRiskLevel: Joi.string().valid("low", "medium", "high").required(),
});

const marketInputsValidator = Joi.object({
  sellingPricePerKg: Joi.number().min(0).optional(),

  eggPricePerEgg: Joi.number().min(0).optional(),

  milkPricePerLiter: Joi.number().min(0).optional(),
}).or("sellingPricePerKg", "eggPricePerEgg", "milkPricePerLiter");

export {
  createEstimatorValidator,
  productionSetupValidator,
  healthManagementValidator,
  housingInfrastructureValidator,
  feedOperationsValidator,
  marketInputsValidator,
};
