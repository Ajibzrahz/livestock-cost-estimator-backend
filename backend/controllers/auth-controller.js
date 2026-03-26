import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import {
  attachCookiesToResponse,
  createHash,
  createUserToken,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/index.js";
import crypto from "crypto";
import Token from "../models/token.js";

//registering user
const register = async (req, res, next) => {
  const payload = req.body;

  try {
    //checking for existing user
    const isExisting = await User.findOne({ email: payload.email });
    if (isExisting) {
      const err = new ConflictError("Email already exists");
      return next(err);
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const newUser = await User.create({
      ...payload,
      role: role,
      verificationToken,
    });

    //sending Email

    const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${verificationToken}&email=${newUser.email}`;

    await sendVerificationEmail({
      name: newUser.name,
      email: newUser.email,
      verificationLink,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Please check your email to verify account",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken, email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new UnauthenticatedError("Verification Failed");
      return next(err);
    }

    if (user.verificationToken !== verificationToken) {
      const err = new UnauthenticatedError("Verification Failed");
      return next(err);
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = "";

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "email verified" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //checking existing user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const err = new UnauthenticatedError(
        "Email does not exist, try correct email or create account",
      );
      return next(err);
    }
    //comparing passwords
    const checkCredentials = await user.comparePassword(password);
    if (!checkCredentials) {
      const err = new UnauthenticatedError("Incorrect Credentials");
      return next(err);
    }

    if (!user.isVerified) {
      const err = new UnauthenticatedError("Please verify your email");
      return next(err);
    }

    const tokenUser = createUserToken(user);
    //creating token
    let refreshToken = "";

    const existingToken = await Token.findOne({ user: user._id });
    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });

      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: ` welcome onboard ${user.name} ` });
      return;
    }

    //checking for existing Token
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };

    await Token.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ msg: ` welcome onboard ${user.name} ` });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  await Token.findOneAndDelete({ user: req.user.id });

  res.cookie("accessToken", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.cookie("refreshToken", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({ msg: "user log out" });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide a valid email");
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordToken = crypto.randomBytes(70).toString("hex");
      //send email
      const resetPasswordLink = `http://localhost:5000/api/v1/auth/reset-password?token=${passwordToken}&email=${user.email}`;

      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        resetPasswordLink,
      });

      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "Please check your email for reset password link" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  const { newPassword, email, token } = req.body;

  if (!email || !newPassword || !token) {
    throw new BadRequestError("Please provide a valid email");
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const currentDate = new Date();
      const hasExpired = currentDate > user.passwordTokenExpirationDate;
      const checkToken = user.passwordToken === createHash(token);

      if (checkToken && !hasExpired) {
        user.password = newPassword;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;

        user.save();

        res.status(StatusCodes.OK);
      }
    }

    res.status(StatusCodes.OK).json({
      msg: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export {
  register,
  verifyEmail,
  login,
  logout,
  showCurrentUser,
  forgotPassword,
  resetPassword,
};
