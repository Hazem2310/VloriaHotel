//controllers/authController.js
import pool from "../dbSingleton.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    // CHECK EMAIL
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // INSERT USER (IMPORTANT: role included)
    const [result] = await pool.query(
      `INSERT INTO users
      (first_name, last_name, email, password, phone_number, status, role, created_at)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE', 'CUSTOMER', NOW())`,
      [first_name, last_name, email, hashedPassword, phone_number],
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user_id: result.insertId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT user_id, first_name, last_name, email, status, role FROM users WHERE user_id = ?",
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GET USER ROLES FROM EMPLOYEE_ROLES TABLE
    const [userRoles] = await pool.query(
      `SELECT r.role_name
       FROM employee_roles er
       JOIN roles r ON r.role_id = er.role_id
       WHERE er.user_id = ?`,
      [user.user_id],
    );

    // Also check employee_level from employees table
    const [employeeData] = await pool.query(
      `SELECT employee_level FROM employees WHERE user_id = ?`,
      [user.user_id],
    );

    let role = "customer";
    let roles = userRoles.map((x) => x.role_name);

    // Add employee_level to roles if it exists
    if (employeeData.length > 0 && employeeData[0].employee_level) {
      roles.push(employeeData[0].employee_level.toLowerCase());
    }

    // Priority order: owner > admin > manager > employee > customer
    if (roles.includes("owner")) role = "owner";
    else if (roles.includes("admin")) role = "admin";
    else if (roles.includes("manager")) role = "manager";
    else if (roles.includes("employee")) role = "employee";
    else role = roles[0] || "customer";

    // GENERATE TOKEN
    const token = generateToken(user, role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
        role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export { register, login, logout, getMe };
