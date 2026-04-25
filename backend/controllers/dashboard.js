import { StatusCodes } from "http-status-codes";
import Estimation from "../models/estimation.js";

const getDashboardSummary = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const estimation = await Estimation.find({
      user: userId,
      status: "completed",
    });
    let totalCost = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    estimation.forEach((e) => {
      totalCost += e.results.totalCostEstimation || 0;
      totalRevenue += e.results.projectedRevenue || 0;
      totalProfit += e.results.projectedProfit || 0;
    });

    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalEstimationCost: totalCost,
        ProjectedProfit: totalProfit,
        ProjectedRevenue: totalRevenue,
        roi,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCostBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const estimation = await Estimation.find({
      user: userId,
      status: "completed",
    });

    let feed = 0;
    let vet = 0;
    let operations = 0;
    let others = 0;

    estimation.forEach((e) => {
      feed += e.feedOperations?.feedPrice || 0;
      vet += e.healthManagement?.vetServiceFrequency || 0;
      operations +=
        (e.feedOperations?.electricityCost || 0) +
          e.feedOperations?.laborCost || 0;

      others += 0;
    });

    return res.status(200).json({
      success: true,
      data: { feedingNutrition: feed, vetinary: vet, operations, others },
    });
  } catch (error) {
    next(error);
  }
};

const getRecentEstimation = async (req, res, next) => {
  try {
    const estimations = await Estimation.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(5);

    if (estimations.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        estimations: [],
        message: "No estimation yet",
      });
    }

    return res.status(200).json({
      success: true,
      estimations,
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const estimations = await Estimation.find({
      user: userId,
      status: "completed",
    });

    const monthly = {};

    estimations.forEach((e) => {
      const month = new Date(e.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      if (!monthly[month]) {
        monthly[month] = {
          cost: 0,
          revenue: 0,
          profit: 0,
        };
      }

      monthly[month].cost += e.results.totalCostEstimation || 0;
      monthly[month].revenue += e.results.projectedRevenue || 0;
      monthly[month].profit += e.results.projectedProfit || 0;
    });

    res.status(200).json({
      success: true,
      data: monthly,
    });
  } catch (error) {
    next(error);
  }
};

export {getAnalytics, getCostBreakdown, getDashboardSummary, getRecentEstimation}