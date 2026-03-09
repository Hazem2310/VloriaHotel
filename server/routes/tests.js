import express from "express";
import {
  testDoubleBookingPrevention,
  testBookingCancellation,
  testEmployeeSoftDelete,
} from "../controllers/testController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Test endpoints (admin only, for development/testing)
router.post("/double-booking", protect, admin, testDoubleBookingPrevention);
router.post("/booking-cancellation", protect, admin, testBookingCancellation);
router.post("/employee-soft-delete", protect, admin, testEmployeeSoftDelete);

export default router;
