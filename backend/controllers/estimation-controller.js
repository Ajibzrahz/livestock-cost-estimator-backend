import Estimation from "../models/estimation.js";
import { StatusCodes } from "http-status-codes";
import { runEstimation } from "../service/estimation-service.js";

const createEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.create({
      user: req.user.id,
      livestockType: req.body.livestockType,
      currentStep: 1,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      estimation,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
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

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
  } catch (error) {
    next(error);
  }
};

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

    const results = runEstimation(estimation);

    estimation.results = {
      totalCostEstimation: results.totalCostEstimation,
      projectedRevenue: results.projectedRevenue,
      projectedProfit: results.projectedProfit,
      roi: results.roi,
    };

    estimation.status = "completed";

    await estimation.save();

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
      costBreakdown: results.costBreakdown,
    });
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
