import express from "express";
import {
  getAnalytics,
  getCostBreakdown,
  getDashboardSummary,
  getRecentEstimation,
} from "../controllers/dashboard.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateUser);

router.get("/summary", getDashboardSummary);
router.get("/cost-breakdown", getCostBreakdown);
router.get("/recent", getRecentEstimation);
router.get("/analytics", getAnalytics);

export default router;
