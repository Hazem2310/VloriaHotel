//be/dbSingleton.js
import mysql from "mysql";
// Define a DatabaseSingleton class to manage a single MySQL database connection.
class DatabaseSingleton {
  //   104
  constructor() {
    // Initialize the database connection configuration in the constructor.
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "veloria_grand_hotel",
    });
  }
  // Method for executing SQL queries.
  query(sql, values, callback) {
    return this.connection.query(sql, values, callback);
  }
  // Static method to create or return a single instance of the DatabaseSingleton class.
  static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseSingleton(); // Corrected instantiation
    }
    return this.instance;
  }
}
export const dbSingleton = DatabaseSingleton;
