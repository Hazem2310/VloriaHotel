import express from "express";
import bcrypt from "bcrypt";
import DatabaseSingleton from "../dbSingleton.js";

const router = express.Router();
const db = DatabaseSingleton.getInstance();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
       (first_name, last_name, email, password, phone_number, status)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
      [first_name, last_name, email, hashedPassword, phone_number]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user_id: user.user_id,
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
