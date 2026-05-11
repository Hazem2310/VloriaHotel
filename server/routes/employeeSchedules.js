import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/employees", protect, async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT 
        e.employee_id,
        e.user_id,
        e.employee_level,
        e.department,
        e.job_title,
        u.first_name,
        u.last_name,
        u.email
      FROM employees e
      JOIN users u ON u.user_id = e.user_id
      ORDER BY u.first_name ASC
    `);

    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const [schedules] = await pool.query(`
      SELECT 
        s.schedule_id,
        s.employee_id,
        s.work_date,
        s.start_time,
        s.end_time,
        u.first_name,
        u.last_name,
        u.email,
        e.department,
        e.job_title
      FROM employee_schedules s
      JOIN employees e ON e.employee_id = s.employee_id
      JOIN users u ON u.user_id = e.user_id
      ORDER BY s.work_date DESC, s.start_time ASC
    `);

    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching schedules",
      error: error.message,
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const [employees] = await pool.query(
      "SELECT employee_id FROM employees WHERE user_id = ? LIMIT 1",
      [req.user.id]
    );

    if (employees.length === 0) {
      return res.json({
        success: true,
        schedules: [],
        message: "No employee profile found",
      });
    }

    const employeeId = employees[0].employee_id;

    const [schedules] = await pool.query(
      `
      SELECT 
        schedule_id,
        employee_id,
        work_date,
        start_time,
        end_time
      FROM employee_schedules
      WHERE employee_id = ?
      ORDER BY work_date DESC, start_time ASC
      `,
      [employeeId]
    );

    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employee schedules",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { employee_id, work_date, start_time, end_time } = req.body;

    if (!employee_id || !work_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "employee_id, work_date, start_time, end_time are required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO employee_schedules 
      (employee_id, work_date, start_time, end_time)
      VALUES (?, ?, ?, ?)
      `,
      [employee_id, work_date, start_time, end_time]
    );

    res.status(201).json({
      success: true,
      message: "Work arrangement added successfully",
      schedule_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating schedule",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await pool.query("DELETE FROM employee_schedules WHERE schedule_id = ?", [
      req.params.id,
    ]);

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting schedule",
      error: error.message,
    });
  }
});

export default router;