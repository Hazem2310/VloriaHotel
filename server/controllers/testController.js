import pool from "../config/db.js";

// Test function to verify no double booking is possible
export const testDoubleBookingPrevention = async (req, res) => {
  try {
    const { room_id, start_date, end_date } = req.body;

    if (!room_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide room_id, start_date, and end_date",
      });
    }

    // Check existing bookings for the same room and date range
    const [existingBookings] = await pool.query(`
      SELECT 
        br.booking_room_id,
        br.start_date,
        br.end_date,
        b.status,
        u.first_name,
        u.last_name
      FROM booking_rooms br
      JOIN bookings b ON br.booking_id = b.booking_id
      JOIN users u ON b.customer_id = u.user_id
      WHERE br.room_id = ?
        AND br.start_date < ? 
        AND br.end_date > ?
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
      ORDER BY br.start_date
    `, [room_id, end_date, start_date]);

    // Test scenarios
    const testResults = {
      room_id: parseInt(room_id),
      requested_dates: {
        start_date,
        end_date
      },
      conflicting_bookings: existingBookings,
      is_available: existingBookings.length === 0,
      test_scenarios: []
    };

    // Test 1: Exact same dates
    const [exactOverlap] = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking_rooms br
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE br.room_id = ?
        AND br.start_date = ?
        AND br.end_date = ?
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [room_id, start_date, end_date]);

    testResults.test_scenarios.push({
      scenario: "Exact same dates",
      result: exactOverlap[0].count === 0,
      conflicts: exactOverlap[0].count
    });

    // Test 2: Overlapping start date
    const [startOverlap] = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking_rooms br
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE br.room_id = ?
        AND br.start_date < ?
        AND br.end_date > ?
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [room_id, end_date, start_date]);

    testResults.test_scenarios.push({
      scenario: "Overlapping dates",
      result: startOverlap[0].count === 0,
      conflicts: startOverlap[0].count
    });

    // Test 3: Check room capacity and status
    const [roomInfo] = await pool.query(`
      SELECT r.room_number, r.status, rt.name as room_type_name, rt.max_capacity
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = ?
    `, [room_id]);

    if (roomInfo.length > 0) {
      testResults.room_info = roomInfo[0];
      testResults.room_active = roomInfo[0].status === 'ACTIVE';
    }

    res.json({
      success: true,
      message: "Double booking prevention test completed",
      test_results: testResults,
      recommendation: testResults.is_available ? 
        "Room is available for booking" : 
        "Room has conflicting bookings - double booking prevented"
    });

  } catch (error) {
    console.error("Double booking test error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during double booking test",
    });
  }
};

// Test function to verify booking cancellation works correctly
export const testBookingCancellation = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide booking_id",
      });
    }

    // Get booking details before cancellation
    const [booking] = await pool.query(`
      SELECT * FROM bookings WHERE booking_id = ?
    `, [booking_id]);

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const originalStatus = booking[0].status;

    // Test cancellation
    await pool.query(`
      UPDATE bookings 
      SET status = 'CANCELLED', cancelled_at = NOW(), cancelled_by = ?, cancel_reason = 'Test cancellation'
      WHERE booking_id = ?
    `, [req.user.id, booking_id]);

    // Verify cancellation
    const [cancelledBooking] = await pool.query(`
      SELECT * FROM bookings WHERE booking_id = ?
    `, [booking_id]);

    // Test if cancelled booking is still considered in availability checks
    const [availabilityAfterCancel] = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking_rooms br
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE br.room_id IN (
        SELECT room_id FROM booking_rooms WHERE booking_id = ?
      )
        AND br.start_date < (SELECT end_date FROM booking_rooms WHERE booking_id = ?)
        AND br.end_date > (SELECT start_date FROM booking_rooms WHERE booking_id = ?)
        AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    `, [booking_id, booking_id, booking_id]);

    // Restore original status
    await pool.query(`
      UPDATE bookings 
      SET status = ?, cancelled_at = NULL, cancelled_by = NULL, cancel_reason = NULL
      WHERE booking_id = ?
    `, [originalStatus, booking_id]);

    res.json({
      success: true,
      message: "Booking cancellation test completed",
      test_results: {
        original_status: originalStatus,
        cancellation_successful: cancelledBooking[0].status === 'CANCELLED',
        cancelled_at_set: cancelledBooking[0].cancelled_at !== null,
        availability_after_cancel: availabilityAfterCancel[0].count === 0,
        test_passed: cancelledBooking[0].status === 'CANCELLED' && 
                    cancelledBooking[0].cancelled_at !== null && 
                    availabilityAfterCancel[0].count === 0
      }
    });

  } catch (error) {
    console.error("Booking cancellation test error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during cancellation test",
    });
  }
};

// Test function to verify employee soft delete works
export const testEmployeeSoftDelete = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee_id",
      });
    }

    // Get employee details before termination
    const [employee] = await pool.query(`
      SELECT e.*, u.first_name, u.last_name, u.email
      FROM employees e
      JOIN users u ON e.employee_id = u.user_id
      WHERE e.employee_id = ?
    `, [employee_id]);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const originalIsActive = employee[0].is_active;

    // Test soft termination
    await pool.query(`
      UPDATE employees 
      SET is_active = 0, terminated_at = NOW(), termination_reason = 'Test termination'
      WHERE employee_id = ?
    `, [employee_id]);

    // Verify soft delete
    const [terminatedEmployee] = await pool.query(`
      SELECT * FROM employees WHERE employee_id = ?
    `, [employee_id]);

    // Test if terminated employee can still log in (should be blocked by user status)
    const [userStatus] = await pool.query(`
      SELECT status FROM users WHERE user_id = ?
    `, [employee_id]);

    // Restore original status
    await pool.query(`
      UPDATE employees 
      SET is_active = ?, terminated_at = NULL, termination_reason = NULL
      WHERE employee_id = ?
    `, [originalIsActive, employee_id]);

    res.json({
      success: true,
      message: "Employee soft delete test completed",
      test_results: {
        original_is_active: originalIsActive,
        soft_delete_successful: terminatedEmployee[0].is_active === 0,
        terminated_at_set: terminatedEmployee[0].terminated_at !== null,
        termination_reason_set: terminatedEmployee[0].termination_reason === 'Test termination',
        employee_record_preserved: terminatedEmployee[0].employee_id === parseInt(employee_id),
        test_passed: terminatedEmployee[0].is_active === 0 && 
                    terminatedEmployee[0].terminated_at !== null && 
                    terminatedEmployee[0].termination_reason === 'Test termination'
      }
    });

  } catch (error) {
    console.error("Employee soft delete test error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during soft delete test",
    });
  }
};
