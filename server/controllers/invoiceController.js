import pool from "../config/db.js";

// Helper function to calculate booking total
export const calculateBookingTotal = async (bookingId) => {
  const [booking] = await pool.query("SELECT booking_type FROM bookings WHERE booking_id = ?", [bookingId]);
  
  if (booking.length === 0) {
    throw new Error("Booking not found");
  }

  const bookingType = booking[0].booking_type;
  let subtotal = 0;
  let items = [];

  if (bookingType === 'ROOM') {
    const [roomBookings] = await pool.query(`
      SELECT 
        br.*,
        r.room_number,
        rt.name as room_type_name,
        mp.package_name
      FROM booking_rooms br
      JOIN rooms r ON br.room_id = r.room_id
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      LEFT JOIN meal_packages mp ON br.meal_package_id = mp.package_id
      WHERE br.booking_id = ?
    `, [bookingId]);

    for (const br of roomBookings) {
      const nights = Math.ceil((new Date(br.end_date) - new Date(br.start_date)) / (1000 * 60 * 60 * 24));
      
      // Room nights
      const roomTotal = br.nightly_price * nights;
      items.push({
        item_type: 'ROOM_NIGHTS',
        description: `${br.room_type_name} - ${br.room_number} (${nights} nights)`,
        quantity: nights,
        unit_price: br.nightly_price,
        total_price: roomTotal
      });
      subtotal += roomTotal;

      // Extra bed
      if (br.extra_bed && br.extra_bed_price > 0) {
        const extraBedTotal = br.extra_bed_price * nights;
        items.push({
          item_type: 'EXTRA_BED',
          description: `Extra bed for ${br.room_number} (${nights} nights)`,
          quantity: nights,
          unit_price: br.extra_bed_price,
          total_price: extraBedTotal
        });
        subtotal += extraBedTotal;
      }

      // Meal package
      if (br.meal_package_id && br.meal_price_per_day > 0) {
        const mealTotal = br.meal_price_per_day * nights;
        items.push({
          item_type: 'MEAL_PLAN',
          description: `${br.package_name} for ${br.room_number} (${nights} nights)`,
          quantity: nights,
          unit_price: br.meal_price_per_day,
          total_price: mealTotal
        });
        subtotal += mealTotal;
      }
    }
  } else if (bookingType === 'RESTAURANT') {
    const [restaurantBookings] = await pool.query(`
      SELECT 
        br.*,
        r.name as restaurant_name,
        rt.table_name
      FROM booking_restaurant br
      JOIN restaurants r ON br.restaurant_id = r.restaurant_id
      LEFT JOIN restaurant_tables rt ON br.table_id = rt.table_id
      WHERE br.booking_id = ?
    `, [bookingId]);

    for (const br of restaurantBookings) {
      // Restaurant reservation (flat fee or could be calculated differently)
      const reservationFee = 50; // This could be configured per restaurant
      items.push({
        item_type: 'RESTAURANT_RES',
        description: `Table reservation at ${br.restaurant_name} for ${br.party_size} people`,
        quantity: 1,
        unit_price: reservationFee,
        total_price: reservationFee
      });
      subtotal += reservationFee;
    }
  } else if (bookingType === 'HALL') {
    const [hallBookings] = await pool.query(`
      SELECT 
        bh.*,
        h.name as hall_name
      FROM booking_halls bh
      JOIN halls h ON bh.hall_id = h.hall_id
      WHERE bh.booking_id = ?
    `, [bookingId]);

    for (const bh of hallBookings) {
      items.push({
        item_type: 'HALL_RENT',
        description: `${bh.hall_name} rental - ${bh.event_type || 'Event'}`,
        quantity: 1,
        unit_price: bh.price_snapshot,
        total_price: bh.price_snapshot
      });
      subtotal += bh.price_snapshot;
    }
  }

  return { subtotal, items };
};

export const createInvoice = async (req, res) => {
  try {
    const { booking_id, vat_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide booking_id",
      });
    }

    // Check if invoice already exists
    const [existing] = await pool.query("SELECT invoice_id FROM invoices WHERE booking_id = ?", [booking_id]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this booking",
      });
    }

    // Get booking details
    const [booking] = await pool.query(`
      SELECT b.*, u.first_name, u.last_name, u.email
      FROM bookings b
      JOIN users u ON b.customer_id = u.user_id
      WHERE b.booking_id = ?
    `, [booking_id]);

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingData = booking[0];

    // Calculate booking total
    const { subtotal, items } = await calculateBookingTotal(booking_id);

    // Get VAT rate
    let vatPercentage = 0;
    let vatAmount = 0;

    if (vat_id) {
      const [vat] = await pool.query("SELECT percentage FROM vat_settings WHERE vat_id = ?", [vat_id]);
      if (vat.length > 0) {
        vatPercentage = vat[0].percentage;
        vatAmount = (subtotal * vatPercentage) / 100;
      }
    } else {
      // Get current VAT rate
      const [currentVat] = await pool.query(`
        SELECT percentage 
        FROM vat_settings 
        WHERE effective_from <= NOW() 
        ORDER BY effective_from DESC 
        LIMIT 1
      `);
      
      if (currentVat.length > 0) {
        vatPercentage = currentVat[0].percentage;
        vatAmount = (subtotal * vatPercentage) / 100;
      }
    }

    const totalAmount = subtotal + vatAmount;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create invoice
      const [invoiceResult] = await connection.query(`
        INSERT INTO invoices (booking_id, customer_id, vat_id, subtotal, vat_amount, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'DRAFT')
      `, [booking_id, bookingData.customer_id, vat_id || null, subtotal, vatAmount, totalAmount]);

      const invoiceId = invoiceResult.insertId;

      // Create invoice items
      for (const item of items) {
        await connection.query(`
          INSERT INTO invoice_items (invoice_id, item_type, description, quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [invoiceId, item.item_type, item.description, item.quantity, item.unit_price, item.total_price]);
      }

      await connection.commit();

      // Get complete invoice with items
      const [newInvoice] = await pool.query(`
        SELECT 
          i.*,
          b.booking_type,
          u.first_name,
          u.last_name,
          u.email,
          vs.percentage as vat_percentage
        FROM invoices i
        JOIN bookings b ON i.booking_id = b.booking_id
        JOIN users u ON i.customer_id = u.user_id
        LEFT JOIN vat_settings vs ON i.vat_id = vs.vat_id
        WHERE i.invoice_id = ?
      `, [invoiceId]);

      const [invoiceItems] = await pool.query(`
        SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY item_id
      `, [invoiceId]);

      res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        invoice: {
          ...newInvoice[0],
          items: invoiceItems
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during invoice creation",
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const [invoices] = await pool.query(`
      SELECT 
        i.*,
        b.booking_type,
        u.first_name,
        u.last_name,
        u.email,
        vs.percentage as vat_percentage
      FROM invoices i
      JOIN bookings b ON i.booking_id = b.booking_id
      JOIN users u ON i.customer_id = u.user_id
      LEFT JOIN vat_settings vs ON i.vat_id = vs.vat_id
      WHERE i.invoice_id = ?
    `, [req.params.id]);

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoice = invoices[0];

    // Get invoice items
    const [items] = await pool.query(`
      SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY item_id
    `, [req.params.id]);

    // Get payments
    const [payments] = await pool.query(`
      SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC
    `, [req.params.id]);

    res.json({
      success: true,
      invoice: {
        ...invoice,
        items,
        payments
      }
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const [invoices] = await pool.query(`
      SELECT 
        i.*,
        b.booking_type,
        b.created_at as booking_date,
        vs.percentage as vat_percentage
      FROM invoices i
      JOIN bookings b ON i.booking_id = b.booking_id
      LEFT JOIN vat_settings vs ON i.vat_id = vs.vat_id
      WHERE i.customer_id = ?
      ORDER BY i.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      count: invoices.length,
      invoices: invoices,
    });
  } catch (error) {
    console.error("Get my invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const { status, start_date, end_date } = req.query;
    
    let whereClause = "WHERE 1=1";
    const params = [];
    
    if (status) {
      whereClause += " AND i.status = ?";
      params.push(status);
    }
    
    if (start_date && end_date) {
      whereClause += " AND i.created_at BETWEEN ? AND ?";
      params.push(start_date, end_date);
    }

    const [invoices] = await pool.query(`
      SELECT 
        i.*,
        b.booking_type,
        u.first_name,
        u.last_name,
        u.email,
        vs.percentage as vat_percentage
      FROM invoices i
      JOIN bookings b ON i.booking_id = b.booking_id
      JOIN users u ON i.customer_id = u.user_id
      LEFT JOIN vat_settings vs ON i.vat_id = vs.vat_id
      ${whereClause}
      ORDER BY i.created_at DESC
    `, params);

    res.json({
      success: true,
      count: invoices.length,
      invoices: invoices,
    });
  } catch (error) {
    console.error("Get all invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["DRAFT", "ISSUED", "PAID", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [invoices] = await pool.query("SELECT * FROM invoices WHERE invoice_id = ?", [req.params.id]);

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await pool.query("UPDATE invoices SET status = ? WHERE invoice_id = ?", [status, req.params.id]);

    const [updatedInvoice] = await pool.query(`
      SELECT 
        i.*,
        b.booking_type,
        u.first_name,
        u.last_name,
        u.email,
        vs.percentage as vat_percentage
      FROM invoices i
      JOIN bookings b ON i.booking_id = b.booking_id
      JOIN users u ON i.customer_id = u.user_id
      LEFT JOIN vat_settings vs ON i.vat_id = vs.vat_id
      WHERE i.invoice_id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      message: "Invoice status updated successfully",
      invoice: updatedInvoice[0],
    });
  } catch (error) {
    console.error("Update invoice status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { invoice_id, amount, method, transaction_ref } = req.body;

    if (!invoice_id || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: "Please provide invoice_id, amount, and method",
      });
    }

    // Validate payment method
    const validMethods = ["VISA", "CASH", "MASTERCARD", "PAYPAL", "OTHER"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Get invoice details
    const [invoice] = await pool.query("SELECT * FROM invoices WHERE invoice_id = ?", [invoice_id]);
    if (invoice.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const invoiceData = invoice[0];

    // Check if payment amount exceeds total
    const [existingPayments] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as paid_amount
      FROM payments 
      WHERE invoice_id = ? AND status = 'SUCCEEDED'
    `, [invoice_id]);

    const totalPaid = existingPayments[0].paid_amount;
    if (totalPaid + amount > invoiceData.total_amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds invoice total",
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create payment
      const [paymentResult] = await connection.query(`
        INSERT INTO payments (invoice_id, amount, method, status, transaction_ref)
        VALUES (?, ?, ?, 'SUCCEEDED', ?)
      `, [invoice_id, amount, method, transaction_ref || null]);

      const paymentId = paymentResult.insertId;

      // Check if invoice is fully paid
      const [newTotalPaid] = await connection.query(`
        SELECT COALESCE(SUM(amount), 0) as paid_amount
        FROM payments 
        WHERE invoice_id = ? AND status = 'SUCCEEDED'
      `, [invoice_id]);

      if (newTotalPaid[0].paid_amount >= invoiceData.total_amount) {
        await connection.query("UPDATE invoices SET status = 'PAID' WHERE invoice_id = ?", [invoice_id]);
      } else if (invoiceData.status === 'DRAFT') {
        await connection.query("UPDATE invoices SET status = 'ISSUED' WHERE invoice_id = ?", [invoice_id]);
      }

      await connection.commit();

      // Get payment details
      const [newPayment] = await connection.query(`
        SELECT p.*, i.total_amount, i.status as invoice_status
        FROM payments p
        JOIN invoices i ON p.invoice_id = i.invoice_id
        WHERE p.payment_id = ?
      `, [paymentId]);

      res.status(201).json({
        success: true,
        message: "Payment processed successfully",
        payment: newPayment[0],
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment processing",
    });
  }
};

export const getPaymentsByInvoice = async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT 
        p.*,
        i.total_amount,
        i.customer_id,
        u.first_name,
        u.last_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.invoice_id
      JOIN users u ON i.customer_id = u.user_id
      WHERE p.invoice_id = ?
      ORDER BY p.payment_date DESC
    `, [req.params.invoiceId]);

    res.json({
      success: true,
      count: payments.length,
      payments: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createRefund = async (req, res) => {
  try {
    const { payment_id, amount, reason, method } = req.body;

    if (!payment_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide payment_id and amount",
      });
    }

    // Get payment details
    const [payment] = await pool.query(`
      SELECT p.*, i.total_amount, i.invoice_id
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.invoice_id
      WHERE p.payment_id = ?
    `, [payment_id]);

    if (payment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const paymentData = payment[0];

    // Check if payment can be refunded
    if (paymentData.status !== 'SUCCEEDED') {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be refunded",
      });
    }

    // Check refund amount
    const [existingRefunds] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as refunded_amount
      FROM refunds 
      WHERE payment_id = ? AND status = 'SUCCEEDED'
    `, [payment_id]);

    const totalRefunded = existingRefunds[0].refunded_amount;
    const maxRefundable = paymentData.amount - totalRefunded;
    
    if (amount > maxRefundable) {
      return res.status(400).json({
        success: false,
        message: `Maximum refundable amount is ${maxRefundable}`,
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create refund
      const [refundResult] = await connection.query(`
        INSERT INTO refunds (payment_id, amount, method, status, reason)
        VALUES (?, ?, ?, 'SUCCEEDED', ?)
      `, [payment_id, amount, method || paymentData.method, reason || null]);

      const refundId = refundResult.insertId;

      // Update payment status if fully refunded
      if (totalRefunded + amount >= paymentData.amount) {
        await connection.query("UPDATE payments SET status = 'REFUNDED' WHERE payment_id = ?", [payment_id]);
      } else {
        await connection.query("UPDATE payments SET status = 'PARTIALLY_REFUNDED' WHERE payment_id = ?", [payment_id]);
      }

      await connection.commit();

      // Get refund details
      const [newRefund] = await connection.query(`
        SELECT r.*, p.payment_date, p.method as original_method
        FROM refunds r
        JOIN payments p ON r.payment_id = p.payment_id
        WHERE r.refund_id = ?
      `, [refundId]);

      res.status(201).json({
        success: true,
        message: "Refund processed successfully",
        refund: newRefund[0],
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Create refund error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during refund processing",
    });
  }
};
