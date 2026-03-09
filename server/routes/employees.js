import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  terminateEmployee,
} from "../controllers/restaurantController.js";
import { protect, admin, manager } from "../middleware/auth.js";
import { 
  validateEmployeeCreation,
  validateId
} from "../middleware/validation.js";

const router = express.Router();

// Employee routes
router.get("/", protect, manager, getAllEmployees);
router.get("/:id", protect, manager, validateId('id'), getEmployeeById);
router.post("/", protect, admin, validateEmployeeCreation, createEmployee);
router.put("/:id/terminate", protect, admin, validateId('id'), terminateEmployee);

export default router;
