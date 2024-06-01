import express from "express";
import {
  createUser,
  confirmEmail,
  login,
  updateUser,
  confirmUpdate,
  requestAccountDeletion,
  confirmAccountDeletion,
  resetPassword,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/confirm/:token", confirmEmail);
router.put("/update", verifyToken, updateUser);
router.get("/update/confirm/:token", confirmUpdate);
router.post("/delete-account", requestAccountDeletion);
router.get("/delete-account/:token", confirmAccountDeletion);
router.post("/reset-password", resetPassword);

export default router;
