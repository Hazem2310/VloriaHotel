import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "veloria_grand_hotel_v2",
  port: Number(process.env.DB_PORT) || 8889, // MAMP usually 8889
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database Connected Successfully");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
  }
};

export default pool;