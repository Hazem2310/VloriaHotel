import pool from "../config/db.js";

async function clearRooms() {
  try {
    console.log("🗑️  Clearing all rooms from database...");
    
    await pool.query("DELETE FROM rooms");
    
    console.log("✅ All rooms have been deleted!");
    console.log("💡 Run 'npm run seed-rooms' to add the 7 luxury rooms again.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing rooms:", error);
    process.exit(1);
  }
}

clearRooms();
