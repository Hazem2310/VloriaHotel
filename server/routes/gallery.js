import express from "express";
import {
  getGalleryImages,
  getGalleryByCategory,
  getGalleryStats,
} from "../controllers/galleryController.js";

const router = express.Router();

// Get all gallery images with optional category filter
router.get("/", getGalleryImages);

// Get gallery statistics
router.get("/stats", getGalleryStats);

// Get images by category
router.get("/category/:category", getGalleryByCategory);

export default router;
