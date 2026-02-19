import pool from "./config/db.js";

async function fixHallTypesAndImages() {
  try {
    console.log("🔧 Fixing hall types and images...\n");

    // First, fix the hall types
    await pool.query(
      "UPDATE halls SET hall_type = 'Indoor' WHERE name LIKE '%Indoor%'"
    );
    console.log("✅ Set Grand Indoor Hall to type: Indoor");

    await pool.query(
      "UPDATE halls SET hall_type = 'Outdoor' WHERE name LIKE '%Outdoor%' OR name LIKE '%Poolside%'"
    );
    console.log("✅ Set Poolside Outdoor Venue to type: Outdoor");

    // Now update images based on hall type
    await pool.query(
      "UPDATE halls SET image_url = ? WHERE hall_type = 'Indoor'",
      ["http://localhost:5000/uploads/halls/halls1.jpeg"]
    );
    console.log("✅ Indoor hall → halls1.jpeg");

    await pool.query(
      "UPDATE halls SET image_url = ? WHERE hall_type = 'Outdoor'",
      ["http://localhost:5000/uploads/halls/halls2.jpeg"]
    );
    console.log("✅ Outdoor hall → halls2.jpeg");

    console.log("\n🎉 Hall types and images updated successfully!");
    
    // Verify the update
    const [halls] = await pool.query("SELECT name, hall_type, image_url FROM halls ORDER BY hall_id");
    console.log("\n📸 Final Hall Configuration:");
    halls.forEach(hall => {
      const imageName = hall.image_url ? hall.image_url.split('/').pop() : 'None';
      console.log(`\n  ${hall.name}`);
      console.log(`    Type: ${hall.hall_type}`);
      console.log(`    Image: ${imageName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixHallTypesAndImages();
