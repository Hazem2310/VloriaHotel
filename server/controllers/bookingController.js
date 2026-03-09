import pool from "../config/db.js";

// Helper function to check room availability for date range
export const checkRoomAvailability = async (roomId, startDate, endDate, excludeBookingId = null) => {
  const query = `
    SELECT COUNT(*) as conflicts
    FROM booking_rooms br
    JOIN bookings b ON br.booking_id = b.booking_id
    WHERE br.room_id = ?
      AND br.start_date < ? 
      AND br.end_date > ?
      AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
      ${excludeBookingId ? 'AND br.booking_id != ?' : ''}
  `;
  
  const params = excludeBookingId 
    ? [roomId, endDate, startDate, excludeBookingId]
    : [roomId, endDate, startDate];
    
  const [result] = await pool.query(query, params);
  return result[0].conflicts === 0;
};

// Helper function to calculate room pricing
export const calculateRoomPrice = async (roomId, startDate, endDate, adults = 1, children = 0, extraBed = false, mealPackageId = null) => {
  // Get room type and base info
  const [roomInfo] = await pool.query(`
    SELECT r.room_id, r.room_number, rt.room_type_id, rt.base_price, rt.base_capacity, rt.max_capacity,
           r.extra_bed_allowed, r.extra_bed_price
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.room_type_id
    WHERE r.room_id = ? AND r.status = 'ACTIVE'
  `, [roomId]);

  if (roomInfo.length === 0) {
    throw new Error("Room not found or not active");
  }

  const room = roomInfo[0];
  const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  
  // Check capacity
  const totalGuests = adults + children;
  if (totalGuests > room.max_capacity) {
    throw new Error("Room capacity exceeded");
  }

  // Get pricing for the date range
  let nightlyPrice = room.base_price;
  
  // Check for special rates in the period
  const [specialRates] = await pool.query(`
    SELECT nightly_price
    FROM room_rates
    WHERE room_type_id = ? AND start_date <= ? AND end_date >= ?
    ORDER BY start_date DESC
    LIMIT 1
  `, [room.room_type_id, startDate, startDate]);

  if (specialRates.length > 0) {
    nightlyPrice = specialRates[0].nightly_price;
  }

  // Calculate room total
  let roomTotal = nightlyPrice * nights;

  // Add extra bed charge
  let extraBedPrice = 0;
  if (extraBed && room.extra_bed_allowed && room.extra_bed_price) {
    extraBedPrice = room.extra_bed_price * nights;
    roomTotal += extraBedPrice;
  }

  // Calculate meal package cost
  let mealPricePerDay = 0;
  if (mealPackageId) {
    const [mealPackage] = await pool.query(`
      SELECT price_per_day
      FROM meal_packages
      WHERE package_id = ? AND is_available = 1
    `, [mealPackageId]);

    if (mealPackage.length > 0) {
      mealPricePerDay = mealPackage[0].price_per_day;
      roomTotal += mealPricePerDay * nights;
    }
  }

  return {
    room,
    nights,
    nightlyPrice,
    roomTotal,
    extraBedPrice,
    mealPricePerDay,
    totalPrice: roomTotal
  };
};

export const createRoomBooking = async (req, res) => {
  try {
    const { 
      room_id, 
      start_date, 
      end_date, 
      adults = 1, 
      children = 0, 
      extra_bed = false, 
      meal_package_id = null,
      notes 
    } = req.body;

    // Validate required fields
    if (!room_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide room_id, start_date, and end_date",
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Check if today's date is before start_date
    if (new Date() > startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    // Check room availability
    const isAvailable = await checkRoomAvailability(room_id, start_date, end_date);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Room is not available for the selected dates",
      });
    }

    // Calculate pricing
    const pricing = await calculateRoomPrice(
      room_id, start_date, end_date, adults, children, extra_bed, meal_package_id
    );

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create booking header
      const [bookingResult] = await connection.query(`
        INSERT INTO bookings (customer_id, booking_type, status, notes)
        VALUES (?, 'ROOM', 'PENDING', ?)
      `, [req.user.id, notes || null]);

      const bookingId = bookingResult.insertId;

      // Create booking room details
      const [bookingRoomResult] = await connection.query(`
        INSERT INTO booking_rooms (
          booking_id, room_id, start_date, end_date, adults, children,
          extra_bed, nightly_price, extra_bed_price, meal_package_id, meal_price_per_day
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bookingId,
        room_id,
        start_date,
        end_date,
        adults,
        children,
        extra_bed ? 1 : 0,
        pricing.nightlyPrice,
        pricing.extraBedPrice,
        meal_package_id,
        pricing.mealPricePerDay
      ]);

      // Get complete booking details
      const [newBooking] = await connection.query(`
        SELECT 
          b.*,
          br.booking_room_id,
          br.start_date,
          br.end_date,
          br.adults,
          br.children,
          br.extra_bed,
          br.nightly_price,
          br.extra_bed_price,
          br.meal_package_id,
          br.meal_price_per_day,
          r.room_number,
          rt.name as room_type_name,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        JOIN booking_rooms br ON b.booking_id = br.booking_id
        JOIN rooms r ON br.room_id = r.room_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        JOIN users u ON b.customer_id = u.user_id
        WHERE b.booking_id = ?
      `, [bookingId]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Room booking created successfully",
        booking: newBooking[0],
        pricing: {
          nights: pricing.nights,
          room_total: pricing.roomTotal,
          total_price: pricing.totalPrice
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

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
    const {
      restaurant_id,
      table_id,
      reservation_datetime,
      party_size,
      duration_minutes = 90,
      special_requests
    } = req.body;

    // Validate required fields
    if (!restaurant_id || !reservation_datetime || !party_size) {
      return res.status(400).json({
        success: false,
        message: "Please provide restaurant_id, reservation_datetime, and party_size",
      });
    }

    // Validate reservation datetime
    const reservationDate = new Date(reservation_datetime);
    if (reservationDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reservation datetime must be in the future",
      });
    }

    // Check restaurant availability
    const [conflicts] = await pool.query(`
      SELECT COUNT(*) as conflicts
      FROM booking_restaurant br
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE br.restaurant_id = ?
        AND br.reservation_datetime < DATE_ADD(?, INTERVAL ? MINUTE)
        AND DATE_ADD(br.reservation_datetime, INTERVAL br.duration_minutes MINUTE) > ?
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [restaurant_id, reservation_datetime, duration_minutes, reservation_datetime]);

    if (conflicts[0].conflicts > 0) {
      return res.status(400).json({
        success: false,
        message: "Restaurant is not fully available for the selected time",
      });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create booking header
      const [bookingResult] = await connection.query(`
        INSERT INTO bookings (customer_id, booking_type, status)
        VALUES (?, 'RESTAURANT', 'PENDING')
      `, [req.user.id]);

      const bookingId = bookingResult.insertId;

      // Create restaurant booking details
      await connection.query(`
        INSERT INTO booking_restaurant (
          booking_id, restaurant_id, table_id, reservation_datetime,
          party_size, duration_minutes, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        bookingId,
        restaurant_id,
        table_id || null,
        reservation_datetime,
        party_size,
        duration_minutes,
        special_requests || null
      ]);

      // Get complete booking details
      const [newBooking] = await connection.query(`
        SELECT 
          b.*,
          br.reservation_datetime,
          br.party_size,
          br.duration_minutes,
          br.special_requests,
          r.name as restaurant_name,
          r.location,
          rt.table_name,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        JOIN booking_restaurant br ON b.booking_id = br.booking_id
        JOIN restaurants r ON br.restaurant_id = r.restaurant_id
        LEFT JOIN restaurant_tables rt ON br.table_id = rt.table_id
        JOIN users u ON b.customer_id = u.user_id
        WHERE b.booking_id = ?
      `, [bookingId]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Restaurant booking created successfully",
        booking: newBooking[0],
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

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
      special_requests
    } = req.body;

    // Validate required fields
    if (!hall_id || !event_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Please provide hall_id, event_date, start_time, and end_time",
      });
    }

    // Validate event date
    const eventDate = new Date(event_date);
    if (eventDate < new Date().setHours(0,0,0,0)) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past",
      });
    }

    // Check hall availability
    const [conflicts] = await pool.query(`
      SELECT COUNT(*) as conflicts
      FROM booking_halls bh
      JOIN bookings b ON bh.booking_id = b.booking_id
      WHERE bh.hall_id = ?
        AND bh.event_date = ?
        AND (
          (bh.start_time <= ? AND bh.end_time > ?) OR
          (bh.start_time < ? AND bh.end_time >= ?) OR
          (bh.start_time >= ? AND bh.end_time <= ?)
        )
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [hall_id, event_date, start_time, start_time, end_time, end_time, start_time, end_time]);

    if (conflicts[0].conflicts > 0) {
      return res.status(400).json({
        success: false,
        message: "Hall is not available for the selected time",
      });
    }

    // Get hall pricing
    const [hallInfo] = await pool.query(`
      SELECT hall_id, name, base_price, status
      FROM halls
      WHERE hall_id = ? AND status = 'ACTIVE'
    `, [hall_id]);

    if (hallInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found or not active",
      });
    }

    const hall = hallInfo[0];

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create booking header
      const [bookingResult] = await connection.query(`
        INSERT INTO bookings (customer_id, booking_type, status)
        VALUES (?, 'HALL', 'PENDING')
      `, [req.user.id]);

      const bookingId = bookingResult.insertId;

      // Create hall booking details
      await connection.query(`
        INSERT INTO booking_halls (
          booking_id, hall_id, event_date, start_time, end_time,
          event_type, guests_count, price_snapshot, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        bookingId,
        hall_id,
        event_date,
        start_time,
        end_time,
        event_type || null,
        guests_count || 0,
        hall.base_price,
        special_requests || null
      ]);

      // Get complete booking details
      const [newBooking] = await connection.query(`
        SELECT 
          b.*,
          bh.event_date,
          bh.start_time,
          bh.end_time,
          bh.event_type,
          bh.guests_count,
          bh.price_snapshot,
          bh.special_requests,
          h.name as hall_name,
          h.hall_type,
          h.capacity,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        JOIN booking_halls bh ON b.booking_id = bh.booking_id
        JOIN halls h ON bh.hall_id = h.hall_id
        JOIN users u ON b.customer_id = u.user_id
        WHERE b.booking_id = ?
      `, [bookingId]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Hall booking created successfully",
        booking: newBooking[0],
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

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
    const [bookings] = await pool.query(`
      SELECT 
        b.*,
        CASE 
          WHEN b.booking_type = 'ROOM' THEN (
            SELECT JSON_OBJECT(
              'booking_room_id', br.booking_room_id,
              'start_date', br.start_date,
              'end_date', br.end_date,
              'adults', br.adults,
              'children', br.children,
              'extra_bed', br.extra_bed,
              'nightly_price', br.nightly_price,
              'extra_bed_price', br.extra_bed_price,
              'meal_package_id', br.meal_package_id,
              'meal_price_per_day', br.meal_price_per_day,
              'room_number', r.room_number,
              'room_type_name', rt.name
            )
            FROM booking_rooms br
            JOIN rooms r ON br.room_id = r.room_id
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'RESTAURANT' THEN (
            SELECT JSON_OBJECT(
              'reservation_datetime', br.reservation_datetime,
              'party_size', br.party_size,
              'duration_minutes', br.duration_minutes,
              'special_requests', br.special_requests,
              'restaurant_name', r.name,
              'location', r.location,
              'table_name', rt.table_name
            )
            FROM booking_restaurant br
            JOIN restaurants r ON br.restaurant_id = r.restaurant_id
            LEFT JOIN restaurant_tables rt ON br.table_id = rt.table_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'HALL' THEN (
            SELECT JSON_OBJECT(
              'event_date', bh.event_date,
              'start_time', bh.start_time,
              'end_time', bh.end_time,
              'event_type', bh.event_type,
              'guests_count', bh.guests_count,
              'price_snapshot', bh.price_snapshot,
              'special_requests', bh.special_requests,
              'hall_name', h.name,
              'hall_type', h.hall_type,
              'capacity', h.capacity
            )
            FROM booking_halls bh
            JOIN halls h ON bh.hall_id = h.hall_id
            WHERE bh.booking_id = b.booking_id
            LIMIT 1
          )
        END as details
      FROM bookings b
      WHERE b.customer_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    // Parse JSON details for each booking
    const bookingsWithDetails = bookings.map(booking => ({
      ...booking,
      details: booking.details ? JSON.parse(booking.details) : null
    }));

    res.json({
      success: true,
      count: bookingsWithDetails.length,
      bookings: bookingsWithDetails,
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
    const { booking_type, status, start_date, end_date } = req.query;
    
    let whereClause = "WHERE 1=1";
    const params = [];
    
    if (booking_type) {
      whereClause += " AND b.booking_type = ?";
      params.push(booking_type);
    }
    
    if (status) {
      whereClause += " AND b.status = ?";
      params.push(status);
    }
    
    if (start_date && end_date) {
      whereClause += " AND b.created_at BETWEEN ? AND ?";
      params.push(start_date, end_date);
    }

    const [bookings] = await pool.query(`
      SELECT 
        b.*,
        CASE 
          WHEN b.booking_type = 'ROOM' THEN (
            SELECT JSON_OBJECT(
              'booking_room_id', br.booking_room_id,
              'start_date', br.start_date,
              'end_date', br.end_date,
              'adults', br.adults,
              'children', br.children,
              'extra_bed', br.extra_bed,
              'nightly_price', br.nightly_price,
              'extra_bed_price', br.extra_bed_price,
              'meal_package_id', br.meal_package_id,
              'meal_price_per_day', br.meal_price_per_day,
              'room_number', r.room_number,
              'room_type_name', rt.name
            )
            FROM booking_rooms br
            JOIN rooms r ON br.room_id = r.room_id
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'RESTAURANT' THEN (
            SELECT JSON_OBJECT(
              'reservation_datetime', br.reservation_datetime,
              'party_size', br.party_size,
              'duration_minutes', br.duration_minutes,
              'special_requests', br.special_requests,
              'restaurant_name', r.name,
              'location', r.location,
              'table_name', rt.table_name
            )
            FROM booking_restaurant br
            JOIN restaurants r ON br.restaurant_id = r.restaurant_id
            LEFT JOIN restaurant_tables rt ON br.table_id = rt.table_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'HALL' THEN (
            SELECT JSON_OBJECT(
              'event_date', bh.event_date,
              'start_time', bh.start_time,
              'end_time', bh.end_time,
              'event_type', bh.event_type,
              'guests_count', bh.guests_count,
              'price_snapshot', bh.price_snapshot,
              'special_requests', bh.special_requests,
              'hall_name', h.name,
              'hall_type', h.hall_type,
              'capacity', h.capacity
            )
            FROM booking_halls bh
            JOIN halls h ON bh.hall_id = h.hall_id
            WHERE bh.booking_id = b.booking_id
            LIMIT 1
          )
        END as details,
        u.first_name,
        u.last_name,
        u.email
      FROM bookings b
      JOIN users u ON b.customer_id = u.user_id
      ${whereClause}
      ORDER BY b.created_at DESC
    `, params);

    // Parse JSON details for each booking
    const bookingsWithDetails = bookings.map(booking => ({
      ...booking,
      details: booking.details ? JSON.parse(booking.details) : null
    }));

    res.json({
      success: true,
      count: bookingsWithDetails.length,
      bookings: bookingsWithDetails,
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
    const { id } = req.params;

    if (!status || !["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "CHECKED_IN", "CHECKED_OUT"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [bookings] = await pool.query("SELECT * FROM bookings WHERE booking_id = ?", [id]);

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    // Handle cancellation
    if (status === "CANCELLED") {
      await pool.query(`
        UPDATE bookings 
        SET status = ?, cancelled_at = NOW(), cancelled_by = ?, cancel_reason = ?
        WHERE booking_id = ?
      `, [status, req.user.id, req.body.cancel_reason || null, id]);
    } else {
      await pool.query("UPDATE bookings SET status = ? WHERE booking_id = ?", [status, id]);
    }

    // Get updated booking with details
    const [updatedBooking] = await pool.query(`
      SELECT 
        b.*,
        CASE 
          WHEN b.booking_type = 'ROOM' THEN (
            SELECT JSON_OBJECT(
              'booking_room_id', br.booking_room_id,
              'start_date', br.start_date,
              'end_date', br.end_date,
              'adults', br.adults,
              'children', br.children,
              'extra_bed', br.extra_bed,
              'nightly_price', br.nightly_price,
              'extra_bed_price', br.extra_bed_price,
              'meal_package_id', br.meal_package_id,
              'meal_price_per_day', br.meal_price_per_day,
              'room_number', r.room_number,
              'room_type_name', rt.name
            )
            FROM booking_rooms br
            JOIN rooms r ON br.room_id = r.room_id
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'RESTAURANT' THEN (
            SELECT JSON_OBJECT(
              'reservation_datetime', br.reservation_datetime,
              'party_size', br.party_size,
              'duration_minutes', br.duration_minutes,
              'special_requests', br.special_requests,
              'restaurant_name', r.name,
              'location', r.location,
              'table_name', rt.table_name
            )
            FROM booking_restaurant br
            JOIN restaurants r ON br.restaurant_id = r.restaurant_id
            LEFT JOIN restaurant_tables rt ON br.table_id = rt.table_id
            WHERE br.booking_id = b.booking_id
            LIMIT 1
          )
          WHEN b.booking_type = 'HALL' THEN (
            SELECT JSON_OBJECT(
              'event_date', bh.event_date,
              'start_time', bh.start_time,
              'end_time', bh.end_time,
              'event_type', bh.event_type,
              'guests_count', bh.guests_count,
              'price_snapshot', bh.price_snapshot,
              'special_requests', bh.special_requests,
              'hall_name', h.name,
              'hall_type', h.hall_type,
              'capacity', h.capacity
            )
            FROM booking_halls bh
            JOIN halls h ON bh.hall_id = h.hall_id
            WHERE bh.booking_id = b.booking_id
            LIMIT 1
          )
        END as details,
        u.first_name,
        u.last_name,
        u.email
      FROM bookings b
      JOIN users u ON b.customer_id = u.user_id
      WHERE b.booking_id = ?
    `, [id]);

    const result = updatedBooking[0];
    result.details = result.details ? JSON.parse(result.details) : null;

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: result,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancel_reason } = req.body;

    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = ? AND customer_id = ?", 
      [id, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not authorized",
      });
    }

    const booking = bookings[0];

    if (["CANCELLED", "NO_SHOW", "CHECKED_OUT"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking in current status",
      });
    }

    await pool.query(`
      UPDATE bookings 
      SET status = 'CANCELLED', cancelled_at = NOW(), cancelled_by = ?, cancel_reason = ?
      WHERE booking_id = ?
    `, [req.user.id, cancel_reason || null, id]);

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
