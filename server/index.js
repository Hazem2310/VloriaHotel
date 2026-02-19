import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { testConnection } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import serviceRoutes from "./routes/services.js";
import bookingRoutes from "./routes/bookings.js";
import reportRoutes from "./routes/reports.js";
import hallRoutes from "./routes/hallRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import mealPackageRoutes from "./routes/mealPackageRoutes.js";
import aiRoutes from "./routes/ai.js";
import uploadRouter from "./routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// test database connection
testConnection();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/meal-packages", mealPackageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Veloria Hotel API is running" });
});

// start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// error handling
server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other server process or change PORT.`,
    );
    process.exit(1);
  }
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
