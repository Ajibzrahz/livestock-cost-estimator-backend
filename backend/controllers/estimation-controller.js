/**
 * estimation-controller.js  (updated — ML-integrated version)
 *
 * Changes from original:
 *  - calculateEstimation now calls getMLPrediction() after the rule-based engine
 *  - If ML server is available, modelOutput is populated and the response
 *    includes an mlResults block alongside the rule-based results
 *  - If ML server is down, it falls back silently to the original behaviour
 */

import Estimation from "../models/estimation.js";
import { StatusCodes } from "http-status-codes";
import { runEstimation } from "../service/estimation-service.js";
import { getMLPrediction } from "../service/ml-service.js";   // ← NEW

// ─── unchanged step controllers ───────────────────────────────────────────────

const createEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.create({
      user: req.user.id,
      livestockType: req.body.livestockType,
      currentStep: 1,
    });
    res.status(StatusCodes.CREATED).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

const updateStep2 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.productionSetup = req.body;
    estimation.currentStep = 2;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

const updateStep3 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.housingInfrastructure = req.body;
    estimation.currentStep = 3;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

const updateStep4 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.feedOperations = req.body;
    estimation.currentStep = 4;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

const updateStep5 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.healthManagement = req.body;
    estimation.currentStep = 5;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

const updateStep6 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.marketInputs = req.body;
    estimation.currentStep = 6;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

// ─── CALCULATE — now includes ML layer ────────────────────────────────────────

const calculateEstimation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const estimation = await Estimation.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!estimation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Estimation not found",
      });
    }

    // 1. Run the existing rule-based calculation (unchanged)
    const ruleResults = runEstimation(estimation);

    estimation.results = {
      totalCostEstimation: ruleResults.totalCostEstimation,
      projectedRevenue:    ruleResults.projectedRevenue,
      projectedProfit:     ruleResults.projectedProfit,
      roi:                 ruleResults.roi,
    };
    estimation.status = "completed";

    // 2. Call ML server for enhanced predictions (non-blocking fallback)
    const mlOutput = await getMLPrediction(estimation);

    if (mlOutput) {
      // Populate the modelOutput subdocument (already in your Mongoose schema)
      estimation.modelOutput = {
        predictedFeedCost:        mlOutput.predictedFeedCost,
        predictedLaborCost:       mlOutput.predictedLaborCost,
        predictedElectricityCost: mlOutput.predictedElectricityCost,
        confidenceScore:          mlOutput.confidenceScore,
      };
    }

    await estimation.save();

    // 3. Build response — rule-based results always present; ML block only if available
    const responsePayload = {
      success:       true,
      estimation,
      costBreakdown: ruleResults.costBreakdown,
    };

    if (mlOutput) {
      responsePayload.mlResults = {
        totalCostEstimation: mlOutput.mlTotalCostEstimation,
        projectedRevenue:    mlOutput.mlProjectedRevenue,
        projectedProfit:     mlOutput.mlProjectedProfit,
        roi:                 mlOutput.mlRoi,
        confidenceNote:      mlOutput.confidenceNote,
      };
    }

    res.status(StatusCodes.OK).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

export {
  createEstimation,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  updateStep6,
  calculateEstimation,
};
