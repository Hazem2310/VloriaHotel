import pool from "../config/db.js";

const rooms = [
  {
    title: "Pool View Room",
    description: "Elegant room overlooking the hotel's main swimming pool, featuring large panoramic windows, premium bedding, smart TV, minibar, coffee machine, marble bathroom, and modern lighting.",
    price: 150,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    is_available: true,
  },
  {
    title: "Garden View Room",
    description: "A calm and relaxing room with a scenic garden view, natural tones, king-size bed, luxury linens, workspace desk, rainfall shower, and complimentary welcome amenities.",
    price: 130,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    is_available: true,
  },
  {
    title: "Room with Balcony",
    description: "Spacious room including a private balcony with seating area, ideal for enjoying morning coffee. Includes king bed, lounge chair, smart lighting system, minibar, and luxury bathroom essentials.",
    price: 180,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    is_available: true,
  },
  {
    title: "Standard Room (No Balcony)",
    description: "Modern and comfortable room designed for business or short stays. Includes queen bed, wardrobe, smart TV, safe box, minibar, and elegant bathroom.",
    price: 100,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    is_available: true,
  },
  {
    title: "Triple Room",
    description: "Perfect for families or groups. Includes three premium beds, spacious layout, seating corner, large bathroom, storage space, and full in-room amenities.",
    price: 200,
    capacity: 3,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    is_available: true,
  },
  {
    title: "Junior Suite",
    description: "Spacious suite with separate sitting area, premium king-size bed, marble bathroom with bathtub, luxury toiletries, coffee station, and upgraded room service options.",
    price: 280,
    capacity: 2,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    is_available: true,
  },
  {
    title: "Executive Suite",
    description: "High-end suite with separate living room, dining table, walk-in closet, panoramic view, luxury bathroom with bathtub and shower, smart control system, and VIP amenities.",
    price: 450,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
    is_available: true,
  },
];

async function seedRooms() {
  try {
    console.log("🌱 Starting to seed rooms...");

    // Check if rooms already exist
    const [existingRooms] = await pool.query("SELECT COUNT(*) as count FROM rooms");
    
    if (existingRooms[0].count > 0) {
      console.log(`⚠️  Database already has ${existingRooms[0].count} rooms.`);
      console.log("Do you want to clear existing rooms and reseed? (This will delete all rooms)");
      console.log("If yes, run: npm run clear-rooms");
      process.exit(0);
    }

    // Insert rooms
    for (const room of rooms) {
      await pool.query(
        "INSERT INTO rooms (title, description, price, capacity, image, is_available) VALUES (?, ?, ?, ?, ?, ?)",
        [room.title, room.description, room.price, room.capacity, room.image, room.is_available]
      );
      console.log(`✅ Added: ${room.title}`);
    }

    console.log("\n🎉 Successfully seeded all 7 luxury rooms!");
    console.log("\n📊 Room Summary:");
    console.log("1. Pool View Room - $150/night (2 guests)");
    console.log("2. Garden View Room - $130/night (2 guests)");
    console.log("3. Room with Balcony - $180/night (2 guests)");
    console.log("4. Standard Room - $100/night (2 guests)");
    console.log("5. Triple Room - $200/night (3 guests)");
    console.log("6. Junior Suite - $280/night (2 guests)");
    console.log("7. Executive Suite - $450/night (4 guests)");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding rooms:", error);
    process.exit(1);
  }
}

seedRooms();
