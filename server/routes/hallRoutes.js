import express from "express";
import {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  bookHall,
} from "../controllers/hallController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllHalls);
router.get("/:id", getHallById);

// Protected routes
router.post("/book", protect, bookHall);

// Admin routes
router.post("/", protect, admin, createHall);
router.put("/:id", protect, admin, updateHall);
router.delete("/:id", protect, admin, deleteHall);

export default router;
