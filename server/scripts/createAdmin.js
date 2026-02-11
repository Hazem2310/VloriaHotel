import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const createAdminUser = async () => {
  try {
    const name = "Admin";
    const email = "admin@veloria.com";
    const password = "admin123";

    // Check if admin already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    
    if (existing.length > 0) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("\n⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
