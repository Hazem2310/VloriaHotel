import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "veloria-hotel-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [existingUsers] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

const [result] = await pool.query(
  "INSERT INTO users (first_name, last_name, email, password_hash, phone_number) VALUES (?, ?, ?, ?, ?)",
  [first_name, last_name, email, hashedPassword, phone_number || null]
);

// Assign customer role by default
await pool.query(
  "INSERT INTO user_roles (user_id, role_id) SELECT ?, role_id FROM roles WHERE role_name = 'customer'",
  [result.insertId]
);

    const token = generateToken(result.insertId);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: result.insertId,
        first_name,
        last_name,
        email,
        phone_number,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ role logic from new DB structure
    let role = "customer";
    let roles = [];

    const [userRoles] = await pool.query(
      `SELECT r.role_name
       FROM user_roles ur
       JOIN roles r ON r.role_id = ur.role_id
       WHERE ur.user_id = ?`,
      [user.user_id]
    );

    if (userRoles.length > 0) {
      roles = userRoles.map((x) => x.role_name);
      
      // Priority order: owner > admin > dept_manager > employee > customer
      if (roles.includes("owner")) role = "owner";
      else if (roles.includes("admin")) role = "admin";
      else if (roles.includes("dept_manager")) role = "dept_manager";
      else if (roles.includes("employee")) role = "employee";
      else role = roles[0] || "customer";
    }

    const token = generateToken(user.user_id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 👈 للتطوير أحسن
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        role,   // 👈 role واحد
        roles,  // 👈 كل الأدوار (اختياري)
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = async (req, res) => {
  try {
    // 1) get basic user data (بدون role!)
    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name, email, phone_number, created_at FROM users WHERE user_id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    // 2) role logic from new DB structure (same as login)
    let role = "customer";
    let roles = [];

    const [userRoles] = await pool.query(
      `SELECT r.role_name
       FROM user_roles ur
       JOIN roles r ON r.role_id = ur.role_id
       WHERE ur.user_id = ?`,
      [user.user_id]
    );

    if (userRoles.length > 0) {
      roles = userRoles.map((x) => x.role_name);
      
      // Priority order: owner > admin > dept_manager > employee > customer
      if (roles.includes("owner")) role = "owner";
      else if (roles.includes("admin")) role = "admin";
      else if (roles.includes("dept_manager")) role = "dept_manager";
      else if (roles.includes("employee")) role = "employee";
      else role = roles[0] || "customer";
    }

    // 3) response
    res.json({
      success: true,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        role,
        roles,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
