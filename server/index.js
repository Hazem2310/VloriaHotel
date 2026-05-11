import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { testConnection } from "./config/db.js";
import employeeAttendanceRoutes from "./routes/employeeAttendance.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import hallRoutes from "./routes/halls.js";
import serviceRoutes from "./routes/services.js";
import bookingRoutes from "./routes/bookings.js";
import reportRoutes from "./routes/reports.js";
import mealRoutes from "./routes/mealRoutes.js";
import mealPackageRoutes from "./routes/mealPackageRoutes.js";
import aiRoutes from "./routes/ai.js";
import uploadRouter from "./routes/upload.js";
import employeeRoutes from "./routes/employees.js";
import invoiceRoutes from "./routes/invoices.js";
import testRoutes from "./routes/tests.js";
import galleryRoutes from "./routes/gallery.js";
import employeeScheduleRoutes from "./routes/employeeSchedules.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : 5000;

const app = express();

// ========================
// Middlewares
// ========================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========================
// Static Files
// ========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  "/upload",
  express.static(path.join(__dirname, "upload"))
);

// ========================
// Database Connection
// ========================

testConnection();

// ========================
// API Routes
// ========================

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/halls", hallRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/meals", mealRoutes);
app.use("/api/employee-schedules", employeeScheduleRoutes);
app.use("/api/employee-attendance", employeeAttendanceRoutes);
app.use(
  "/api/meal-packages",
  mealPackageRoutes
);

app.use("/api/reports", reportRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/upload", uploadRouter);

app.use("/api/employees", employeeRoutes);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/gallery", galleryRoutes);

// ========================
// Health Route
// ========================

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Veloria Hotel API is running",
  });
});

// ========================
// 404 Route
// ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ========================
// Global Error Handler
// ========================

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ========================
// Start Server
// ========================

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );

  console.log(
    `🌐 Client URL: ${
      process.env.CLIENT_URL ||
      "http://localhost:5173"
    }`
  );

  console.log(
    `📁 Uploads folder: ${path.join(
      __dirname,
      "uploads"
    )}`
  );
});

// ========================
// Error Handling
// ========================

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use.`
    );

    process.exit(1);
  }

  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error(
    "Uncaught exception:",
    err
  );
});

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled rejection:",
      reason
    );
  }
);