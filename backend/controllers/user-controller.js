import { StatusCodes } from "http-status-codes";
import {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/index.js";
import User from "../models/user.js";
import Estimation from "../models/estimation.js";

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const profile = await User.findById(id).select("name email role -_id");
    if (!profile) {
      const err = new NotFoundError("user not found");
      return next(err);
    }
    const estimations = await Estimation.find({ user: id })
      .select(
        "livestockType status results.totalCostEstimation results.projectedProfit createdAt",
      )
      .sort("-createdAt"); // Show newest first
    if (!estimations) {
      return res
        .status(StatusCodes.OK)
        .json({ messagge: "You haven't created any estimation" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ profile, estimations, count: estimations.length });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { id: targetId } = req.params;
    const { id: currentUser, role } = req.user;

    if (role !== "admin" && id !== targetId) {
      throw new UnauthorizedError("Not authorized to delete this account");
    }

    const user = await User.findById(targetId);
    if (!user) {
      throw new NotFoundError(`No user found with id: ${targetId}`);
    }
    await User.findByIdAndDelete(targetId);

    if (currentUser === targetId) {
      res.cookie("accessToken", "delete", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.cookie("refreshToken", "delete", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Account Successfully Deleted" });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, email, password } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = password;
    }
    await user.save();

    const updatedUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res
      .status(StatusCodes.OK)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export { getProfile, deleteAccount, updateProfile };
