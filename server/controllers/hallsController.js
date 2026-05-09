import pool from "../dbSingleton.js";

export const getAllHalls = async (req, res) => {
  try {
    const [halls] = await pool.query(`
      SELECT * FROM halls
      ORDER BY hall_id
    `);

    res.json({
      success: true,
      count: halls.length,
      halls: halls,
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
    const [halls] = await pool.query(`
      SELECT * FROM halls WHERE hall_id = ?
    `, [req.params.id]);

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
    const { name, capacity, location, price_per_hour, suitable_for_weddings, suitable_for_corporate, suitable_for_birthdays, suitable_for_conferences, description } = req.body;

    const [result] = await pool.query(`
      INSERT INTO halls (name, capacity, location, price_per_hour, suitable_for_weddings, suitable_for_corporate, suitable_for_birthdays, suitable_for_conferences, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [name, capacity, location, price_per_hour, suitable_for_weddings, suitable_for_corporate, suitable_for_birthdays, suitable_for_conferences, description]);

    res.status(201).json({
      success: true,
      message: "Hall created successfully",
      hall_id: result.insertId,
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
    const { id } = req.params;
    const { name, capacity, location, price_per_hour, suitable_for_weddings, suitable_for_corporate, suitable_for_birthdays, suitable_for_conferences, description } = req.body;

    const [result] = await pool.query(`
      UPDATE halls 
      SET name = ?, capacity = ?, location = ?, price_per_hour = ?, suitable_for_weddings = ?, suitable_for_corporate = ?, suitable_for_birthdays = ?, suitable_for_conferences = ?, description = ?
      WHERE hall_id = ?
    `, [name, capacity, location, price_per_hour, suitable_for_weddings, suitable_for_corporate, suitable_for_birthdays, suitable_for_conferences, description, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.json({
      success: true,
      message: "Hall updated successfully",
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
    const { id } = req.params;

    const [result] = await pool.query(`
      DELETE FROM halls WHERE hall_id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

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
