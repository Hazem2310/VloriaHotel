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
    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name, email, status FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user roles from new system
    const [userRoles] = await pool.query(
      `SELECT r.role_name
       FROM user_roles ur
       JOIN roles r ON r.role_id = ur.role_id
       WHERE ur.user_id = ?`,
      [decoded.id]
    );

    let role = "customer";
    let roles = userRoles.map((x) => x.role_name);
    
    // Priority order: owner > admin > dept_manager > employee > customer
    if (roles.includes("owner")) role = "owner";
    else if (roles.includes("admin")) role = "admin";
    else if (roles.includes("dept_manager")) role = "dept_manager";
    else if (roles.includes("employee")) role = "employee";
    else role = roles[0] || "customer";

    req.user = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      role,
      roles,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

export const manager = (req, res, next) => {
  if (req.user && ["owner", "admin", "dept_manager"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as manager",
    });
  }
};

export const employee = (req, res, next) => {
  if (req.user && ["owner", "admin", "dept_manager", "employee"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as employee",
    });
  }
};
