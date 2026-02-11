import pool from "../config/db.js";

export const getAllServices = async (req, res) => {
  try {
    const [services] = await pool.query("SELECT * FROM services ORDER BY created_at DESC");
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO services (name, description, price) VALUES (?, ?, ?)",
      [name, description, price]
    );

    const [newService] = await pool.query("SELECT * FROM services WHERE id = ?", [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: newService[0],
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const [services] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await pool.query("UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?", [
      name || services[0].name,
      description || services[0].description,
      price || services[0].price,
      req.params.id,
    ]);

    const [updatedService] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Service updated successfully",
      service: updatedService[0],
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const [services] = await pool.query("SELECT * FROM services WHERE id = ?", [req.params.id]);

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await pool.query("DELETE FROM services WHERE id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
