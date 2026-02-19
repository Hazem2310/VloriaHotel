import pool from "./config/db.js";

async function setHallImages() {
  try {
    console.log("🖼️  Setting hall images...\n");

    // Update Indoor hall with halls1.jpeg
    await pool.query(
      "UPDATE halls SET image_url = ? WHERE hall_type = 'Indoor'",
      ["http://localhost:5000/uploads/halls/halls1.jpeg"]
    );
    console.log("✅ Indoor hall → halls1.jpeg");

    // Update Outdoor hall with halls2.jpeg
    await pool.query(
      "UPDATE halls SET image_url = ? WHERE hall_type = 'Outdoor'",
      ["http://localhost:5000/uploads/halls/halls2.jpeg"]
    );
    console.log("✅ Outdoor hall → halls2.jpeg");

    console.log("\n🎉 Hall images updated successfully!");
    
    // Verify the update
    const [halls] = await pool.query("SELECT name, hall_type, image_url FROM halls ORDER BY hall_id");
    console.log("\n📸 Current Hall Images:");
    halls.forEach(hall => {
      console.log(`  ${hall.name} (${hall.hall_type}): ${hall.image_url}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setHallImages();
