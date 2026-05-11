import express from "express";
import {
  getAllRooms,
  getRoomById,
  getRoomTypes,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
  addRoomImage,
  removeRoomImage,
  getRoomFeatures,
  updateRoomFeature,
} from "../controllers/roomController.js";
import { protect, admin, manager, employee } from "../middleware/auth.js";
import { 
  validateRoomCreation,
  validateId,
  validateStatus
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getAllRooms);
router.get("/types", getRoomTypes);
router.get("/availability", getRoomAvailability);
router.get("/:id", validateId('id'), getRoomById);

// Protected routes
router.get("/:id/features", protect, validateId('id'), getRoomFeatures);

// Admin/Manager routes
router.post("/", protect, manager, validateRoomCreation, createRoom);
router.put("/:id", protect, manager, validateId('id'), updateRoom);
router.delete("/:id", protect, admin, validateId('id'), deleteRoom);

// Room images
router.post("/:id/images", protect, manager, validateId('id'), addRoomImage);
router.delete("/:id/images/:imageId", protect, manager, validateId('id'), validateId('imageId'), removeRoomImage);

// Room features
router.put("/:id/features/:feature_id", protect, manager, validateId('id'), validateId('feature_id'), updateRoomFeature);

export default router;
