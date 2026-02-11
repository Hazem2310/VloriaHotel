import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", protect, admin, createRoom);
router.put("/:id", protect, admin, updateRoom);
router.delete("/:id", protect, admin, deleteRoom);

export default router;
