import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  addRestaurantTable,
  getAllHalls,
  getHallById,
  createHall,
  addHallImage,
  getAllDepartments,
  createDepartment,
  getAllMealPackages,
  createMealPackage,
} from "../controllers/restaurantController.js";
import { protect, admin, manager, employee } from "../middleware/auth.js";

const router = express.Router();

// Restaurant routes
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants", protect, manager, createRestaurant);
router.post("/restaurants/:id/tables", protect, manager, addRestaurantTable);

// Hall routes
router.get("/halls", getAllHalls);
router.get("/halls/:id", getHallById);
router.post("/halls", protect, manager, createHall);
router.post("/halls/:id/images", protect, manager, addHallImage);

// Department routes
router.get("/departments", protect, employee, getAllDepartments);
router.post("/departments", protect, admin, createDepartment);

// Meal package routes
router.get("/meal-packages", getAllMealPackages);
router.post("/meal-packages", protect, manager, createMealPackage);

export default router;
