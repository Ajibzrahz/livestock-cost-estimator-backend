import express from "express";
import { getProfile, deleteAccount, updateProfile } from "../controllers/user-controller.js";
import { authenticateUser, authorizePermission } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateUser);

router.route("/").get(getProfile).patch(updateProfile);
router.delete("/:id", authorizePermission("admin", "user"), deleteAccount);

export default router;
