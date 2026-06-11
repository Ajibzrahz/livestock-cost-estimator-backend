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
      return next(new NotFoundError("Estimation not found"));
    }

    // Fix: was comparing estimation object to string — now checks status field
    if (estimation.status === "completed") {
      return next(
        new BadRequestError("This estimation has already been completed"),
      );
    }

    if (estimation.currentStep !== requiredStep - 1) {
      return next(
        new BadRequestError(
          `You must complete step ${requiredStep - 1} before proceeding to step ${requiredStep}`,
        ),
      );
    }

    req.estimation = estimation;
    next();
  } catch (error) {
    next(error);
  }
};

export default stepGuard;
