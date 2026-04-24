import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  calculateEstimation,
  createEstimation,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  updateStep6,
} from "../controllers/estimation-controller.js";
import {
  createEstimatorValidator,
  feedOperationsValidator,
  healthManagementValidator,
  housingInfrastructureValidator,
  marketInputsValidator,
  productionSetupValidator,
} from "../validators/estimator-validator.js";
import validator from "../middleware/validator.js";
import stepGuard from "../middleware/step-guard.js";

const router = express.Router();
router.use(authenticateUser);

router.post("/", validator(createEstimatorValidator), createEstimation);
router.patch(
  "/:id/step-2",
  stepGuard(2),
  validator(productionSetupValidator),
  updateStep2,
);
router.patch(
  "/:id/step-3",
  stepGuard(3),
  validator(housingInfrastructureValidator),
  updateStep3,
);
router.patch(
  "/:id/step-4",
  stepGuard(4),
  validator(feedOperationsValidator),
  updateStep4,
);
router.patch(
  "/:id/step-5",
  stepGuard(5),
  validator(healthManagementValidator),
  updateStep5,
);
router.patch(
  "/:id/step-6",
  stepGuard(6),
  validator(marketInputsValidator),
  updateStep6,
);
router.post("/:id/calculate", calculateEstimation);

export default router;
