import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// Restaurant Controllers
export const getAllRestaurants = async (req, res) => {
  try {
    const [restaurants] = await pool.query(`
      SELECT 
        r.*,
        COUNT(rt.table_id) as table_count
      FROM restaurants r
      LEFT JOIN restaurant_tables rt ON r.restaurant_id = rt.restaurant_id AND rt.is_active = 1
      WHERE r.is_active = 1
      GROUP BY r.restaurant_id
      ORDER BY r.name
    `);

    res.json({
      success: true,
      count: restaurants.length,
      restaurants: restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const [restaurants] = await pool.query(`
      SELECT r.* FROM restaurants r 
      WHERE r.restaurant_id = ? AND r.is_active = 1
    `, [req.params.id]);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const restaurant = restaurants[0];

    // Get tables
    const [tables] = await pool.query(`
      SELECT * FROM restaurant_tables 
      WHERE restaurant_id = ? AND is_active = 1 
      ORDER BY table_name
    `, [req.params.id]);

    res.json({
      success: true,
      restaurant: {
        ...restaurant,
        tables
      }
    });
  } catch (error) {
    console.error("Get restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, location, opening_hours } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide restaurant name",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO restaurants (name, location, opening_hours)
      VALUES (?, ?, ?)
    `, [name, location || null, opening_hours || null]);

    const [newRestaurant] = await pool.query(
      "SELECT * FROM restaurants WHERE restaurant_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: newRestaurant[0],
    });
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addRestaurantTable = async (req, res) => {
  try {
    const { table_name, capacity } = req.body;

    if (!table_name || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Please provide table_name and capacity",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO restaurant_tables (restaurant_id, table_name, capacity)
      VALUES (?, ?, ?)
    `, [req.params.id, table_name, capacity]);

    res.status(201).json({
      success: true,
      message: "Table added successfully",
      table_id: result.insertId,
    });
  } catch (error) {
    console.error("Add restaurant table error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Hall Controllers
export const getAllHalls = async (req, res) => {
  try {
    const { hall_type, status = 'ACTIVE' } = req.query;
    
    let whereClause = "WHERE h.status = ?";
    const params = [status];
    
    if (hall_type) {
      whereClause += " AND h.hall_type = ?";
      params.push(hall_type);
    }

    const [halls] = await pool.query(`
      SELECT 
        h.*,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'image_id', hi.image_id,
              'image_url', hi.image_url,
              'sort_order', hi.sort_order
            )
          )
          FROM hall_images hi
          WHERE hi.hall_id = h.hall_id
          ORDER BY hi.sort_order
        ) as images
      FROM halls h
      ${whereClause}
      ORDER BY h.name
    `, params);

    // Parse images for each hall
    const hallsWithImages = halls.map(hall => ({
      ...hall,
      images: hall.images ? JSON.parse(hall.images) : []
    }));

    res.json({
      success: true,
      count: hallsWithImages.length,
      halls: hallsWithImages,
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
      SELECT h.* FROM halls h 
      WHERE h.hall_id = ? AND h.status = 'ACTIVE'
    `, [req.params.id]);

    if (halls.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    const hall = halls[0];

    // Get images
    const [images] = await pool.query(`
      SELECT * FROM hall_images 
      WHERE hall_id = ? 
      ORDER BY sort_order
    `, [req.params.id]);

    res.json({
      success: true,
      hall: {
        ...hall,
        images
      }
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
    const { name, description, hall_type, capacity, base_price } = req.body;

    if (!name || !hall_type || !capacity || base_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO halls (name, description, hall_type, capacity, base_price)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description || null, hall_type, capacity, base_price]);

    const [newHall] = await pool.query(
      "SELECT * FROM halls WHERE hall_id = ?",
      [result.insertId]
    );

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

export const addHallImage = async (req, res) => {
  try {
    const { image_url, sort_order = 0 } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        message: "Please provide image_url",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO hall_images (hall_id, image_url, sort_order)
      VALUES (?, ?, ?)
    `, [req.params.id, image_url, sort_order]);

    res.status(201).json({
      success: true,
      message: "Hall image added successfully",
      image_id: result.insertId,
    });
  } catch (error) {
    console.error("Add hall image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Employee Controllers
export const getAllEmployees = async (req, res) => {
  try {
    const { department_id, is_active } = req.query;
    
    let whereClause = "WHERE 1=1";
    const params = [];
    
    if (department_id) {
      whereClause += " AND e.department_id = ?";
      params.push(department_id);
    }
    
    if (is_active !== undefined) {
      whereClause += " AND e.is_active = ?";
      params.push(is_active === 'true' ? 1 : 0);
    }

    const [employees] = await pool.query(`
      SELECT 
        e.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        d.name as department_name,
        (
          SELECT JSON_ARRAYAGG(r.role_name)
          FROM user_roles ur
          JOIN roles r ON ur.role_id = r.role_id
          WHERE ur.user_id = e.employee_id
        ) as roles
      FROM employees e
      JOIN users u ON e.employee_id = u.user_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      ${whereClause}
      ORDER BY u.first_name, u.last_name
    `, params);

    // Parse roles for each employee
    const employeesWithRoles = employees.map(employee => ({
      ...employee,
      roles: employee.roles ? JSON.parse(employee.roles) : []
    }));

    res.json({
      success: true,
      count: employeesWithRoles.length,
      employees: employeesWithRoles,
    });
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT 
        e.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        d.name as department_name
      FROM employees e
      JOIN users u ON e.employee_id = u.user_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      WHERE e.employee_id = ?
    `, [req.params.id]);

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employee = employees[0];

    // Get roles
    const [roles] = await pool.query(`
      SELECT r.role_name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.role_id
      WHERE ur.user_id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      employee: {
        ...employee,
        roles: roles.map(r => r.role_name)
      }
    });
  } catch (error) {
    console.error("Get employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      password, 
      phone_number,
      department_id,
      job_title,
      hire_date,
      salary,
      roles = ['employee']
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [userResult] = await connection.query(`
        INSERT INTO users (first_name, last_name, email, password_hash, phone_number)
        VALUES (?, ?, ?, ?, ?)
      `, [first_name, last_name, email, hashedPassword, phone_number || null]);

      const userId = userResult.insertId;

      // Create employee
      const [employeeResult] = await connection.query(`
        INSERT INTO employees (employee_id, department_id, job_title, hire_date, salary)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, department_id || null, job_title || null, hire_date || null, salary || null]);

      // Assign roles
      for (const roleName of roles) {
        await connection.query(`
          INSERT INTO user_roles (user_id, role_id)
          SELECT ?, role_id FROM roles WHERE role_name = ?
        `, [userId, roleName]);
      }

      await connection.commit();

      const [newEmployee] = await connection.query(`
        SELECT 
          e.*,
          u.first_name,
          u.last_name,
          u.email,
          u.phone_number,
          d.name as department_name
        FROM employees e
        JOIN users u ON e.employee_id = u.user_id
        LEFT JOIN departments d ON e.department_id = d.department_id
        WHERE e.employee_id = ?
      `, [userId]);

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: newEmployee[0],
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const terminateEmployee = async (req, res) => {
  try {
    const { termination_reason } = req.body;

    const [employees] = await pool.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employee = employees[0];

    if (!employee.is_active) {
      return res.status(400).json({
        success: false,
        message: "Employee is already terminated",
      });
    }

    await pool.query(`
      UPDATE employees 
      SET is_active = 0, terminated_at = NOW(), termination_reason = ?
      WHERE employee_id = ?
    `, [termination_reason || null, req.params.id]);

    res.json({
      success: true,
      message: "Employee terminated successfully",
    });
  } catch (error) {
    console.error("Terminate employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Department Controllers
export const getAllDepartments = async (req, res) => {
  try {
    const [departments] = await pool.query(`
      SELECT 
        d.*,
        COUNT(e.employee_id) as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.department_id = e.department_id AND e.is_active = 1
      WHERE d.is_active = 1
      GROUP BY d.department_id
      ORDER BY d.name
    `);

    res.json({
      success: true,
      count: departments.length,
      departments: departments,
    });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide department name",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO departments (name) VALUES (?)",
      [name]
    );

    const [newDepartment] = await pool.query(
      "SELECT * FROM departments WHERE department_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: newDepartment[0],
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Meal Package Controllers
export const getAllMealPackages = async (req, res) => {
  try {
    const [packages] = await pool.query(`
      SELECT * FROM meal_packages 
      WHERE is_available = 1 
      ORDER BY package_name
    `);

    res.json({
      success: true,
      count: packages.length,
      packages: packages,
    });
  } catch (error) {
    console.error("Get meal packages error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createMealPackage = async (req, res) => {
  try {
    const { 
      package_name, 
      package_type, 
      description, 
      price_per_day,
      includes_breakfast,
      includes_lunch,
      includes_dinner
    } = req.body;

    if (!package_name || !package_type || price_per_day === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO meal_packages (
        package_name, package_type, description, price_per_day,
        includes_breakfast, includes_lunch, includes_dinner
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      package_name, 
      package_type, 
      description || null, 
      price_per_day,
      includes_breakfast ? 1 : 0,
      includes_lunch ? 1 : 0,
      includes_dinner ? 1 : 0
    ]);

    const [newPackage] = await pool.query(
      "SELECT * FROM meal_packages WHERE package_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Meal package created successfully",
      package: newPackage[0],
    });
  } catch (error) {
    console.error("Create meal package error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
