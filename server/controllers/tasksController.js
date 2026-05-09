import pool from "../dbSingleton.js";

// GET EMPLOYEE TASKS
export const getEmployeeTasks = async (req, res) => {
  try {
    const [emp] = await pool.query(
      "SELECT employee_id FROM employees WHERE user_id = ?",
      [req.user.id]
    );

    if (emp.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = emp[0].employee_id;

    const [tasks] = await pool.query(
      `SELECT * FROM employee_tasks
       WHERE employee_id = ?`,
      [employeeId]
    );

    res.json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};