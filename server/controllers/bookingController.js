import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const [rooms] = await pool.query("SELECT * FROM rooms WHERE id = ? AND is_available = TRUE", [roomId]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found or not available",
      });
    }

    const room = rooms[0];
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    const [result] = await pool.query(
      "INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, roomId, checkIn, checkOut, totalPrice, "pending"]
    );

    const [newBooking] = await pool.query(
      `SELECT b.*, r.title as room_title, r.image as room_image, u.name as user_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking[0],
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, r.title as room_title, r.image as room_image, r.capacity 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, r.title as room_title, r.image as room_image, u.name as user_name, u.email as user_email 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC`
    );

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [bookings] = await pool.query("SELECT * FROM bookings WHERE id = ?", [req.params.id]);

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id]);

    const [updatedBooking] = await pool.query(
      `SELECT b.*, r.title as room_title, r.image as room_image, u.name as user_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking[0],
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const [bookings] = await pool.query("SELECT * FROM bookings WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not authorized",
      });
    }

    if (bookings[0].status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete completed booking",
      });
    }

    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", ["cancelled", req.params.id]);

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
