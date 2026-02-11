import pool from "../config/db.js";

async function checkDatabase() {
  try {
    console.log("🔍 Checking database structure...\n");

    // Check if database exists
    const [databases] = await pool.query("SHOW DATABASES LIKE 'veloria_hotel'");
    console.log("Database exists:", databases.length > 0 ? "✅ Yes" : "❌ No");

    if (databases.length === 0) {
      console.log("\n❌ Database 'veloria_hotel' does not exist!");
      console.log("💡 Run: npm run setup-db");
      process.exit(1);
    }

    // Use the database
    await pool.query("USE veloria_hotel");

    // Check tables
    const [tables] = await pool.query("SHOW TABLES");
    console.log("\n📋 Tables in database:");
    if (tables.length === 0) {
      console.log("❌ No tables found!");
    } else {
      tables.forEach((table) => {
        console.log(`  ✅ ${Object.values(table)[0]}`);
      });
    }

    // Check rooms table structure
    try {
      const [columns] = await pool.query("DESCRIBE rooms");
      console.log("\n🏨 Rooms table structure:");
      columns.forEach((col) => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });

      // Check room count
      const [count] = await pool.query("SELECT COUNT(*) as count FROM rooms");
      console.log(`\n📊 Total rooms in database: ${count[0].count}`);
    } catch (error) {
      console.log("\n❌ Rooms table does not exist!");
      console.log("💡 Run: npm run setup-db");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDatabase();
