// server/dbSingleton.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class DatabaseSingleton {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      database: process.env.DB_NAME || "veloria_grand_hotel",
      port: Number(process.env.DB_PORT || 8889),
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  query(sql, values) {
    return this.pool.query(sql, values);
  }

  static instance;

  static getInstance() {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
}

export default DatabaseSingleton;