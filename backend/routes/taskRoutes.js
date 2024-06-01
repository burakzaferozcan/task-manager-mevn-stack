import express from "express";
import {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/:userId", verifyToken, getTasks);
router.get("/:userId/:taskId", verifyToken, getSingleTask);
router.put("/:userId/:taskId", verifyToken, updateTask);
router.delete("/:userId/:taskId", verifyToken, deleteTask);

export default router;
