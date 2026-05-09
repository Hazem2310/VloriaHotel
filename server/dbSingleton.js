import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "veloria_grand_hotel",
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("✅ Database connected");

    connection.release();

  } catch (error) {
    console.log("❌ Database connection failed");
    console.log(error);
  }
};

export default pool;