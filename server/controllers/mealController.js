import pool from "../config/db.js";

// Get all available meals
export const getAllMeals = async (req, res) => {
  try {
    const [meals] = await pool.query(
      "SELECT * FROM meals WHERE is_available = 1 ORDER BY meal_type, name"
    );
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ message: "Error fetching meals" });
  }
};

// Get meals by type (Breakfast, Lunch, Dinner)
export const getMealsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const [meals] = await pool.query(
      "SELECT * FROM meals WHERE meal_type = ? AND is_available = 1 ORDER BY name",
      [type]
    );
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals by type:", error);
    res.status(500).json({ message: "Error fetching meals" });
  }
};

// Get single meal
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const [meals] = await pool.query("SELECT * FROM meals WHERE meal_id = ?", [id]);
    
    if (meals.length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }
    
    res.json(meals[0]);
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({ message: "Error fetching meal" });
  }
};

// Create new meal (admin only)
export const createMeal = async (req, res) => {
  try {
    const { name, description, meal_type, price, is_available } = req.body;
    
    const [result] = await pool.query(
      "INSERT INTO meals (name, description, meal_type, price, is_available) VALUES (?, ?, ?, ?, ?)",
      [name, description, meal_type, price, is_available ?? 1]
    );
    
    res.status(201).json({
      message: "Meal created successfully",
      meal_id: result.insertId
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Error creating meal" });
  }
};

// Update meal (admin only)
export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, meal_type, price, is_available } = req.body;
    
    const [result] = await pool.query(
      "UPDATE meals SET name = ?, description = ?, meal_type = ?, price = ?, is_available = ? WHERE meal_id = ?",
      [name, description, meal_type, price, is_available, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }
    
    res.json({ message: "Meal updated successfully" });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ message: "Error updating meal" });
  }
};

// Delete meal (admin only)
export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query("DELETE FROM meals WHERE meal_id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }
    
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: "Error deleting meal" });
  }
};
