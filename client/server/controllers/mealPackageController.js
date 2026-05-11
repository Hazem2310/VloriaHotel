import pool from "../config/db.js";

// Get all meal packages
export const getAllMealPackages = async (req, res) => {
  try {
    const [packages] = await pool.query(
      "SELECT * FROM meal_packages WHERE is_available = 1 ORDER BY price_per_day"
    );
    res.json(packages);
  } catch (error) {
    console.error("Error fetching meal packages:", error);
    res.status(500).json({ message: "Error fetching meal packages" });
  }
};

// Get single meal package
export const getMealPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [packages] = await pool.query(
      "SELECT * FROM meal_packages WHERE package_id = ?", 
      [id]
    );
    
    if (packages.length === 0) {
      return res.status(404).json({ message: "Meal package not found" });
    }
    
    res.json(packages[0]);
  } catch (error) {
    console.error("Error fetching meal package:", error);
    res.status(500).json({ message: "Error fetching meal package" });
  }
};
