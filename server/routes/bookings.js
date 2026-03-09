import express from "express";
import {
  createRoomBooking,
  createRestaurantBooking,
  createHallBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  checkRoomAvailability,
} from "../controllers/bookingController.js";
import { protect, admin, manager, employee } from "../middleware/auth.js";
import { 
  validateRoomBooking, 
  validateRestaurantBooking, 
  validateHallBooking,
  validateId,
  validateStatus
} from "../middleware/validation.js";

const router = express.Router();

// Room bookings
router.post("/room", protect, validateRoomBooking, createRoomBooking);
router.post("/restaurant", protect, validateRestaurantBooking, createRestaurantBooking);
router.post("/hall", protect, validateHallBooking, createHallBooking);

// Get bookings
router.get("/my", protect, getMyBookings);
router.get("/", protect, employee, getAllBookings);

// Booking management
router.put("/:id/status", protect, manager, validateId('id'), validateStatus(['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW', 'CHECKED_IN', 'CHECKED_OUT']), updateBookingStatus);
router.delete("/:id", protect, validateId('id'), cancelBooking);

// Availability check
router.get("/check-availability", checkRoomAvailability);

export default router;
