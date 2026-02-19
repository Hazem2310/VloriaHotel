import pool from "../config/db.js";

export const getAllHalls = async (req, res) => {
  try {
    const [halls] = await pool.query("SELECT * FROM halls ORDER BY capacity DESC");

    res.json({
      success: true,
      halls,
    });
  } catch (error) {
    console.error("Get halls error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getHallById = async (req, res) => {
  try {
    const [halls] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [req.params.id]);

    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.json({
      success: true,
      hall: halls[0],
    });
  } catch (error) {
    console.error("Get hall error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createHall = async (req, res) => {
  try {
    const { name, description, capacity, price, image_url, status } = req.body;

    if (!name || !capacity || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO halls (name, description, capacity, price, image_url, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, capacity, price, image_url || "", status || "AVAILABLE"]
    );

    const [newHall] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Hall created successfully",
      hall: newHall[0],
    });
  } catch (error) {
    console.error("Create hall error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateHall = async (req, res) => {
  try {
    const { name, description, capacity, price, image_url, status } = req.body;

    const [halls] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [req.params.id]);

    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    await pool.query(
      "UPDATE halls SET name = ?, description = ?, capacity = ?, price = ?, image_url = ?, status = ? WHERE hall_id = ?",
      [
        name || halls[0].name,
        description || halls[0].description,
        capacity || halls[0].capacity,
        price || halls[0].price,
        image_url !== undefined ? image_url : halls[0].image_url,
        status || halls[0].status,
        req.params.id,
      ]
    );

    const [updatedHall] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Hall updated successfully",
      hall: updatedHall[0],
    });
  } catch (error) {
    console.error("Update hall error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteHall = async (req, res) => {
  try {
    const [halls] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [req.params.id]);

    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    await pool.query("DELETE FROM halls WHERE hall_id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Hall deleted successfully",
    });
  } catch (error) {
    console.error("Delete hall error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const bookHall = async (req, res) => {
  try {
    const { hall_id, event_date, event_type, guests_count, special_requests } = req.body;
    const user_id = req.user.id;

    if (!hall_id || !event_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide hall and event date",
      });
    }

    // Get hall details
    const [halls] = await pool.query("SELECT * FROM halls WHERE hall_id = ?", [hall_id]);
    
    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    const hall = halls[0];
    const total_price = hall.price;

    const [result] = await pool.query(
      `INSERT INTO hall_bookings (hall_id, user_id, event_date, event_type, guests_count, total_price, special_requests, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [hall_id, user_id, event_date, event_type, guests_count, total_price, special_requests]
    );

    res.status(201).json({
      success: true,
      message: "Hall booking request submitted successfully",
      booking_id: result.insertId,
    });
  } catch (error) {
    console.error("Book hall error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
