import express from "express";
import {
  getAllMealPackages,
  getMealPackageById
} from "../controllers/mealPackageController.js";

const router = express.Router();

router.get("/", getAllMealPackages);
router.get("/:id", getMealPackageById);

export default router;
