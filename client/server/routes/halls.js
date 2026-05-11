import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [halls] = await pool.query("SELECT * FROM halls");

    res.json({
      success: true,
      halls,
    });
  } catch (error) {
    console.error("Get halls error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching halls",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [halls] = await pool.query(
      "SELECT * FROM halls WHERE hall_id = ? OR id = ? LIMIT 1",
      [req.params.id, req.params.id]
    );

    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.json({
      success: true,
      hall: halls[0],
    });
  } catch (error) {
    console.error("Get hall by id error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching hall",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      hall_name,
      name,
      description,
      capacity,
      price_per_hour,
      price,
      image,
    } = req.body;

    const finalName = hall_name || name;
    const finalPrice = price_per_hour || price || 0;

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Hall name is required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO halls 
       (hall_name, description, capacity, price_per_hour, image)
       VALUES (?, ?, ?, ?, ?)`,
      [
        finalName,
        description || "",
        capacity || 0,
        finalPrice,
        image || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hall created successfully",
      hallId: result.insertId,
    });
  } catch (error) {
    console.error("Create hall error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating hall",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      hall_name,
      name,
      description,
      capacity,
      price_per_hour,
      price,
      image,
    } = req.body;

    const finalName = hall_name || name;
    const finalPrice = price_per_hour || price || 0;

    const [result] = await pool.query(
      `UPDATE halls
       SET hall_name = ?, description = ?, capacity = ?, price_per_hour = ?, image = ?
       WHERE hall_id = ? OR id = ?`,
      [
        finalName,
        description || "",
        capacity || 0,
        finalPrice,
        image || null,
        req.params.id,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      message: "Hall updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Update hall error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating hall",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM halls WHERE hall_id = ? OR id = ?",
      [req.params.id, req.params.id]
    );

    res.json({
      success: true,
      message: "Hall deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Delete hall error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting hall",
      error: error.message,
    });
  }
});

router.post("/book", async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Hall booking request received",
      booking: req.body,
    });
  } catch (error) {
    console.error("Book hall error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while booking hall",
      error: error.message,
    });
  }
});

export default router;