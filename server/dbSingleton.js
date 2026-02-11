// server/dbSingleton.js
import mysql from "mysql2/promise";

class DatabaseSingleton {
  constructor() {
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "veloria_grand_hotel",
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
