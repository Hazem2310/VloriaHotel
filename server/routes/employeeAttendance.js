import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const getEmployeeId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT employee_id FROM employees WHERE user_id = ? LIMIT 1",
    [userId]
  );

  return rows[0]?.employee_id || null;
};

router.get("/me", protect, async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.id);

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const [todayRows] = await pool.query(
      `
      SELECT *
      FROM employee_attendance
      WHERE employee_id = ?
        AND work_date = CURDATE()
      LIMIT 1
      `,
      [employeeId]
    );

    const [monthRows] = await pool.query(
      `
      SELECT COALESCE(SUM(total_hours), 0) AS monthlyHours
      FROM employee_attendance
      WHERE employee_id = ?
        AND MONTH(work_date) = MONTH(CURDATE())
        AND YEAR(work_date) = YEAR(CURDATE())
      `,
      [employeeId]
    );

    res.json({
      success: true,
      today: todayRows[0] || null,
      monthlyHours: Number(monthRows[0]?.monthlyHours || 0).toFixed(2),
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance",
      error: error.message,
    });
  }
});

router.post("/clock-in", protect, async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.id);

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const [existing] = await pool.query(
      `
      SELECT *
      FROM employee_attendance
      WHERE employee_id = ?
        AND work_date = CURDATE()
      LIMIT 1
      `,
      [employeeId]
    );

    if (existing.length > 0 && existing[0].clock_in) {
      return res.status(400).json({
        success: false,
        message: "You already clocked in today",
      });
    }

    await pool.query(
      `
      INSERT INTO employee_attendance
      (employee_id, work_date, clock_in)
      VALUES (?, CURDATE(), NOW())
      `,
      [employeeId]
    );

    res.json({
      success: true,
      message: "Clock in saved successfully",
    });
  } catch (error) {
    console.error("Clock in error:", error);
    res.status(500).json({
      success: false,
      message: "Clock in failed",
      error: error.message,
    });
  }
});

router.post("/clock-out", protect, async (req, res) => {
  try {
    const employeeId = await getEmployeeId(req.user.id);

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const [todayRows] = await pool.query(
      `
      SELECT *
      FROM employee_attendance
      WHERE employee_id = ?
        AND work_date = CURDATE()
      LIMIT 1
      `,
      [employeeId]
    );

    if (todayRows.length === 0 || !todayRows[0].clock_in) {
      return res.status(400).json({
        success: false,
        message: "You must clock in first",
      });
    }

    if (todayRows[0].clock_out) {
      return res.status(400).json({
        success: false,
        message: "You already clocked out today",
      });
    }

    await pool.query(
      `
      UPDATE employee_attendance
      SET 
        clock_out = NOW(),
        total_hours = TIMESTAMPDIFF(MINUTE, clock_in, NOW()) / 60
      WHERE attendance_id = ?
      `,
      [todayRows[0].attendance_id]
    );

    res.json({
      success: true,
      message: "Clock out saved successfully",
    });
  } catch (error) {
    console.error("Clock out error:", error);
    res.status(500).json({
      success: false,
      message: "Clock out failed",
      error: error.message,
    });
  }
});

export default router;