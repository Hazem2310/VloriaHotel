import pool from "../config/db.js";

export const getReports = async (req, res) => {
  try {
    // Total bookings
    const [totalBookingsResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM bookings
    `);

    // Completed bookings (using CHECKED_OUT as completed)
    const [completedBookingsResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE status = 'CHECKED_OUT'
    `);

    // Total revenue from paid invoices
    const [totalRevenueResult] = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM invoices
      WHERE status = 'PAID'
    `);

    // Average paid invoice amount
    const [averagePriceResult] = await pool.query(`
      SELECT COALESCE(AVG(total_amount), 0) AS average
      FROM invoices
      WHERE status = 'PAID'
    `);

    // Most booked room
    const [mostBookedRoomResult] = await pool.query(`
      SELECT 
        r.room_id,
        r.room_number,
        rt.name AS room_type_name,
        COUNT(br.booking_id) AS total_bookings
      FROM booking_rooms br
      JOIN rooms r ON br.room_id = r.room_id
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE b.status NOT IN ('CANCELLED', 'NO_SHOW')
      GROUP BY r.room_id, r.room_number, rt.name
      ORDER BY total_bookings DESC
      LIMIT 1
    `);

    // Recent bookings
    const [recentBookings] = await pool.query(`
      SELECT 
        b.booking_id,
        b.booking_type,
        b.status,
        b.created_at,
        u.first_name,
        u.last_name,
        u.email,

        br.start_date,
        br.end_date,
        r.room_number,
        rt.name AS room_type_name,

        bh.event_date,
        bh.start_time,
        bh.end_time,
        h.name AS hall_name,

        bres.reservation_datetime,
        bres.party_size,
        res.name AS restaurant_name,

        i.total_amount
      FROM bookings b
      JOIN users u ON b.customer_id = u.user_id

      LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
      LEFT JOIN rooms r ON br.room_id = r.room_id
      LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id

      LEFT JOIN booking_halls bh ON b.booking_id = bh.booking_id
      LEFT JOIN halls h ON bh.hall_id = h.hall_id

      LEFT JOIN booking_restaurant bres ON b.booking_id = bres.booking_id
      LEFT JOIN restaurants res ON bres.restaurant_id = res.restaurant_id

      LEFT JOIN invoices i ON b.booking_id = i.booking_id

      ORDER BY b.created_at DESC
      LIMIT 10
    `);

    // Status breakdown
    const [statusBreakdown] = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM bookings
      GROUP BY status
      ORDER BY count DESC
    `);

    // Monthly revenue from paid invoices in last 6 months
    const [monthlyRevenue] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COALESCE(SUM(total_amount), 0) AS revenue,
        COUNT(*) AS invoices_count
      FROM invoices
      WHERE status = 'PAID'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Room stats
    const [roomStats] = await pool.query(`
      SELECT
        COUNT(*) AS total_rooms,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_rooms,
        SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) AS maintenance_rooms,
        SUM(CASE WHEN status = 'OUT_OF_SERVICE' THEN 1 ELSE 0 END) AS out_of_service_rooms
      FROM rooms
    `);

    res.json({
      success: true,
      reports: {
        totalRevenue: Number(totalRevenueResult[0].total || 0),
        totalBookings: Number(totalBookingsResult[0].total || 0),
        completedBookings: Number(completedBookingsResult[0].total || 0),
        averageBookingPrice: Number(averagePriceResult[0].average || 0),
        mostBookedRoom: mostBookedRoomResult[0] || null,
        recentBookings,
        statusBreakdown,
        monthlyRevenue,
        roomStats: roomStats[0] || {
          total_rooms: 0,
          active_rooms: 0,
          maintenance_rooms: 0,
          out_of_service_rooms: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
      error: error.message,
    });
  }
};