import pool from "../config/db.js";

export const getAllRooms = async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms ORDER BY created_at DESC");
    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room: rooms[0],
    });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { title, description, price, capacity, image, is_available } = req.body;

    if (!title || !description || !price || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO rooms (title, description, price, capacity, image, is_available) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, price, capacity, image || "", is_available !== undefined ? is_available : true]
    );

    const [newRoom] = await pool.query("SELECT * FROM rooms WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom[0],
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { title, description, price, capacity, image, is_available } = req.body;

    const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await pool.query(
      "UPDATE rooms SET title = ?, description = ?, price = ?, capacity = ?, image = ?, is_available = ? WHERE id = ?",
      [
        title || rooms[0].title,
        description || rooms[0].description,
        price || rooms[0].price,
        capacity || rooms[0].capacity,
        image !== undefined ? image : rooms[0].image,
        is_available !== undefined ? is_available : rooms[0].is_available,
        req.params.id,
      ]
    );

    const [updatedRoom] = await pool.query("SELECT * FROM rooms WHERE id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom[0],
    });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await pool.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
