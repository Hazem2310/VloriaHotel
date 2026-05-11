// server/routes/upload.js

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main uploads folder
const uploadsDir = path.join(__dirname, "../uploads");

// Create main uploads folder
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create category folders
const categories = ["rooms", "halls", "resturante"];

categories.forEach((category) => {
  const categoryPath = path.join(uploadsDir, category);

  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || "rooms";

    const categoryPath = path.join(uploadsDir, category);

    cb(null, categoryPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images are allowed (jpeg, jpg, png, gif, webp)"
      )
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

// Upload middleware
const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

// Upload Route
router.post("/", uploadMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const category = req.body.category || "rooms";

    res.json({
      success: true,
      message: "File uploaded successfully",

      file: {
        filename: req.file.filename,

        path: `/uploads/${category}/${req.file.filename}`,

        url: `http://localhost:5000/uploads/${category}/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

export default router;