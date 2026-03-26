import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  showCurrentUser,
  verifyEmail,
} from "../controllers/auth-controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validators/user-validator.js";
import validator from "../middleware/validator.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validator(registerValidation), register);
router.post("/login", validator(loginValidation), login);
router.delete("/logout", authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.get("/showMe", authenticateUser, showCurrentUser);
router.post("/forgot-password", authenticateUser, forgotPassword)
router.post("/reset-password", authenticateUser, resetPassword)


export default router;
