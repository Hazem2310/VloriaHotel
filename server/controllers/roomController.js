import pool from "../config/db.js";

export const getAllRooms = async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms ORDER BY room_number");
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
    const [rooms] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

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
    const { room_number, room_type, price, capacity, image, status } = req.body;

    if (!room_number || !room_type || !price || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO rooms (room_number, room_type, price, capacity, image, status) VALUES (?, ?, ?, ?, ?, ?)",
      [room_number, room_type, price, capacity, image || "", status || "AVAILABLE"]
    );

    const [newRoom] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [result.insertId]);

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
    const { room_type, capacity, image, price, status } = req.body;

    const [rooms] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await pool.query(
      "UPDATE rooms SET room_type = ?, capacity = ?, image = ?, price = ?, status = ? WHERE room_id = ?",
      [
        room_type || rooms[0].room_type,
        capacity || rooms[0].capacity,
        image !== undefined ? image : rooms[0].image,
        price || rooms[0].price,
        status || rooms[0].status,
        req.params.id,
      ]
    );

    const [updatedRoom] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

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
    const [rooms] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await pool.query("DELETE FROM rooms WHERE room_id = ?", [req.params.id]);

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
