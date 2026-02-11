import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);

export default router;
