import pool from "../config/db.js";

export const getReports = async (req, res) => {
  try {
    const [totalRevenueResult] = await pool.query(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'completed'"
    );

    const [totalBookingsResult] = await pool.query("SELECT COUNT(*) as total FROM bookings");

    const [completedBookingsResult] = await pool.query(
      "SELECT COUNT(*) as total FROM bookings WHERE status = 'completed'"
    );

    const [averagePriceResult] = await pool.query(
      "SELECT COALESCE(AVG(total_price), 0) as average FROM bookings WHERE status = 'completed'"
    );

    const [mostBookedRoomResult] = await pool.query(
      `SELECT r.title, r.id, COUNT(b.id) as total_bookings 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       GROUP BY r.id, r.title 
       ORDER BY total_bookings DESC 
       LIMIT 1`
    );

    const [recentBookings] = await pool.query(
      `SELECT b.*, r.title as room_title, u.name as user_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC 
       LIMIT 10`
    );

    const [statusBreakdown] = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM bookings 
       GROUP BY status`
    );

    const [monthlyRevenue] = await pool.query(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         SUM(total_price) as revenue,
         COUNT(*) as bookings
       FROM bookings 
       WHERE status = 'completed' 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month 
       ORDER BY month DESC`
    );

    res.json({
      success: true,
      reports: {
        totalRevenue: parseFloat(totalRevenueResult[0].total).toFixed(2),
        totalBookings: totalBookingsResult[0].total,
        completedBookings: completedBookingsResult[0].total,
        averageBookingPrice: parseFloat(averagePriceResult[0].average).toFixed(2),
        mostBookedRoom: mostBookedRoomResult[0] || null,
        recentBookings,
        statusBreakdown,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
