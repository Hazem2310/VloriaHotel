import express from "express";
import { protect } from "../middleware/auth.js";
import { getEmployeeDashboard } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/dashboard", protect, getEmployeeDashboard);

export default router;