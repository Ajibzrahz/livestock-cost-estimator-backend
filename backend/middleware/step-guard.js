import { BadRequestError, NotFoundError } from "../errors/index.js";
import Estimation from "../models/estimation.js";

const stepGuard = (requiredStep) => async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!estimation) {
      const err = new NotFoundError("Estimation not found");
      return next(err);
    }

    if (estimation === "completed") {
      const err = new BadRequestError(
        "The estimation has already been completed",
      );
    }

    if (estimation.currentStep !== requiredStep - 1) {
      const err = new BadRequestError(
        `you must first complete ${requiredStep - 1} first`,
      );
      return next(err);
    }
    req.estimation = estimation;

    next();
  } catch (error) {
    next(error);
  }
};

export default stepGuard
