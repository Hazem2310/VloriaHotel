import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "veloria-hotel-secret-key";

export const protect = async (req, res, next) => {
  try {
    const bearerToken =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    const token = req.cookies?.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.query(
      `SELECT 
        user_id,
        first_name,
        last_name,
        email,
        status,
        role
       FROM users
       WHERE user_id = ?
       LIMIT 1`,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const role = String(user.role || "customer").toLowerCase();

    req.user = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      role,
      roles: [role],
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const admin = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (role === "admin" || role === "owner") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

export const manager = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (["owner", "admin", "dept_manager"].includes(role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as manager",
    });
  }
};

export const employee = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (["owner", "admin", "dept_manager", "employee"].includes(role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as employee",
    });
  }
};