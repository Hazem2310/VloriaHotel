import pool from "../dbSingleton.js";
export const getEmployeeDashboard = async (req, res) => {
  try {
    const [employee] = await pool.query(
      `SELECT e.employee_id, e.job_title, e.department, e.employee_level,
              u.first_name, u.last_name
       FROM employees e
       JOIN users u ON u.user_id = e.user_id
       WHERE e.user_id = ?`,
      [req.user.id]
    );

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      success: true,
      employee: employee[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};