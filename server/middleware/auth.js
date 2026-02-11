import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "veloria-hotel-secret-key";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};
