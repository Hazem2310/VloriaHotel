import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getMyInvoices,
  getAllInvoices,
  updateInvoiceStatus,
  createPayment,
  getPaymentsByInvoice,
  createRefund,
} from "../controllers/invoiceController.js";
import { protect, admin, manager, employee } from "../middleware/auth.js";
import { 
  validatePayment,
  validateRefund,
  validateId,
  validateStatus
} from "../middleware/validation.js";

const router = express.Router();

// Invoice routes
router.post("/", protect, employee, createInvoice);
router.get("/my", protect, getMyInvoices);
router.get("/", protect, manager, getAllInvoices);
router.get("/:id", protect, validateId('id'), getInvoiceById);
router.put("/:id/status", protect, manager, validateId('id'), validateStatus(['DRAFT', 'ISSUED', 'PAID', 'CANCELLED']), updateInvoiceStatus);

// Payment routes
router.post("/payments", protect, employee, validatePayment, createPayment);
router.get("/:invoiceId/payments", protect, manager, validateId('invoiceId'), getPaymentsByInvoice);

// Refund routes
router.post("/refunds", protect, admin, validateRefund, createRefund);

export default router;
