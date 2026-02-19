import express from "express";
import {
  getAllMeals,
  getMealsByType,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal
} from "../controllers/mealController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllMeals);
router.get("/type/:type", getMealsByType);
router.get("/:id", getMealById);

// Admin routes
router.post("/", protect, admin, createMeal);
router.put("/:id", protect, admin, updateMeal);
router.delete("/:id", protect, admin, deleteMeal);

export default router;
