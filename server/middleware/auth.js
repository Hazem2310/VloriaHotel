//middleware/auth.js
import jwt from "jsonwebtoken";
import pool from "../dbSingleton.js";

const JWT_SECRET = process.env.JWT_SECRET || "veloria-hotel-secret-key";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name, email, status, role FROM users WHERE user_id = ?",
      [decoded.id],
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
   FROM employee_roles er
   JOIN roles r ON r.role_id = er.role_id
   WHERE er.user_id = ?`,
      [decoded.id],
    );

    let role = "customer";
    let roles = userRoles.map((x) => x.role_name);

    // Priority order: owner > admin > manager > employee > customer
    if (roles.includes("owner")) role = "owner";
    else if (roles.includes("admin")) role = "admin";
    else if (roles.includes("manager")) role = "manager";
    else if (roles.includes("employee")) role = "employee";
    else role = roles[0] || "customer";

    const user = users[0];

    req.user = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      role: role,
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
  if (req.user && req.user.role === "OWNER") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

export const manager = (req, res, next) => {
  if (req.user && (req.user.role === "OWNER" || req.user.role === "EMPLOYEE")) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as manager",
    });
  }
};

export const employee = (req, res, next) => {
  if (req.user && req.user.role !== "CUSTOMER") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as employee",
    });
  }
};
