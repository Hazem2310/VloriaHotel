import express from "express";
import { protect } from "../middleware/auth.js";
import { getEmployeeTasks } from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", protect, getEmployeeTasks);
export default router;