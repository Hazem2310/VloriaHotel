import pool from "../config/db.js";

export const getReports = async (req, res) => {
  try {
    const [totalBookingsResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM booking
    `);

    const [completedBookingsResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM booking
      WHERE status IN ('CHECKED_OUT', 'COMPLETED', 'PAID')
    `);

    const [totalRevenueResult] = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM invoices
    `);

    const [averagePriceResult] = await pool.query(`
      SELECT COALESCE(AVG(total_amount), 0) AS average
      FROM invoices
    `);

    const [recentBookings] = await pool.query(`
      SELECT *
      FROM booking
      ORDER BY booking_id DESC
      LIMIT 10
    `);

    const [statusBreakdown] = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM booking
      GROUP BY status
      ORDER BY count DESC
    `);

    const [monthlyRevenue] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM invoices
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
      LIMIT 6
    `);

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
        totalRevenue: Number(totalRevenueResult[0]?.total || 0),
        totalBookings: Number(totalBookingsResult[0]?.total || 0),
        completedBookings: Number(completedBookingsResult[0]?.total || 0),
        averageBookingPrice: Number(averagePriceResult[0]?.average || 0),
        mostBookedRoom: null,
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