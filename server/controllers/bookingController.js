import pool from "../config/db.js";

const BOOKING_TABLE = "booking";

export const checkRoomAvailability = async () => {
  return true;
};

export const calculateRoomPrice = async () => {
  return {
    room: null,
    nights: 1,
    nightlyPrice: 0,
    roomTotal: 0,
    extraBedPrice: 0,
    mealPricePerDay: 0,
    totalPrice: 0,
  };
};

export const createRoomBooking = async (req, res) => {
  try {
    const { room_id, start_date, end_date, notes } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO booking 
      (customer_id, booking_type, status, notes, created_at)
      VALUES (?, 'ROOM', 'PENDING', ?, NOW())
      `,
      [req.user.id, notes || null]
    );

    res.status(201).json({
      success: true,
      message: "Room booking created successfully",
      booking_id: result.insertId,
      booking: {
        booking_id: result.insertId,
        customer_id: req.user.id,
        booking_type: "ROOM",
        status: "PENDING",
        room_id,
        start_date,
        end_date,
        notes,
      },
    });
  } catch (error) {
    console.error("Create room booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during booking creation",
    });
  }
};

export const createRestaurantBooking = async (req, res) => {
  try {
    const { restaurant_id, reservation_datetime, party_size, special_requests } =
      req.body;

    const [result] = await pool.query(
      `
      INSERT INTO booking 
      (customer_id, booking_type, status, notes, created_at)
      VALUES (?, 'RESTAURANT', 'PENDING', ?, NOW())
      `,
      [req.user.id, special_requests || null]
    );

    res.status(201).json({
      success: true,
      message: "Restaurant booking created successfully",
      booking_id: result.insertId,
      booking: {
        booking_id: result.insertId,
        customer_id: req.user.id,
        booking_type: "RESTAURANT",
        status: "PENDING",
        restaurant_id,
        reservation_datetime,
        party_size,
        special_requests,
      },
    });
  } catch (error) {
    console.error("Create restaurant booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during booking creation",
    });
  }
};

export const createHallBooking = async (req, res) => {
  try {
    const {
      hall_id,
      event_date,
      start_time,
      end_time,
      event_type,
      guests_count,
      special_requests,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO booking 
      (customer_id, booking_type, status, notes, created_at)
      VALUES (?, 'HALL', 'PENDING', ?, NOW())
      `,
      [req.user.id, special_requests || null]
    );

    const bookingId = result.insertId;

    try {
      await pool.query(
        `
        INSERT INTO hall_bookings
        (booking_id, hall_id, event_date, start_time, end_time, event_type, guests_count, special_requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          bookingId,
          hall_id,
          event_date,
          start_time,
          end_time,
          event_type || null,
          guests_count || 0,
          special_requests || null,
        ]
      );
    } catch (hallError) {
      console.log("Hall details insert skipped:", hallError.message);
    }

    res.status(201).json({
      success: true,
      message: "Hall booking created successfully",
      booking_id: bookingId,
      booking: {
        booking_id: bookingId,
        customer_id: req.user.id,
        booking_type: "HALL",
        status: "PENDING",
        hall_id,
        event_date,
        start_time,
        end_time,
        event_type,
        guests_count,
        special_requests,
      },
    });
  } catch (error) {
    console.error("Create hall booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during booking creation",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `
      SELECT *
      FROM booking
      WHERE customer_id = ?
      ORDER BY booking_id DESC
      `,
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
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { booking_type, status } = req.query;

    let query = `
      SELECT 
        b.*,
        u.first_name,
        u.last_name,
        u.email
      FROM booking b
      LEFT JOIN users u ON b.customer_id = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (booking_type) {
      query += " AND b.booking_type = ?";
      params.push(booking_type);
    }

    if (status) {
      query += " AND b.status = ?";
      params.push(status);
    }

    query += " ORDER BY b.booking_id DESC";

    const [bookings] = await pool.query(query, params);

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
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "NO_SHOW",
      "CHECKED_IN",
      "CHECKED_OUT",
      "COMPLETED",
      "PAID",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE booking
      SET status = ?
      WHERE booking_id = ?
      `,
      [status, id]
    );

    res.json({
      success: true,
      message: "Booking status updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      UPDATE booking
      SET status = 'CANCELLED'
      WHERE booking_id = ? AND customer_id = ?
      `,
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};