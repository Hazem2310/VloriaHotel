import pool from "../config/db.js";

const seedData = async () => {
  try {
    console.log("🌱 Seeding database with sample data...");

    // Insert sample rooms
    const rooms = [
      {
        title: "Deluxe Ocean Suite",
        description: "Luxurious suite with panoramic ocean views, king-size bed, and private balcony. Features include marble bathroom, mini-bar, and premium amenities.",
        price: 299.99,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        is_available: true,
      },
      {
        title: "Family Paradise Room",
        description: "Spacious family room with two queen beds, separate living area, and stunning city views. Perfect for families with children.",
        price: 199.99,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        is_available: true,
      },
      {
        title: "Executive Business Suite",
        description: "Modern suite designed for business travelers with workspace, high-speed WiFi, and premium coffee maker. Includes access to executive lounge.",
        price: 249.99,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        is_available: true,
      },
      {
        title: "Romantic Honeymoon Suite",
        description: "Elegant suite with jacuzzi, champagne on arrival, and rose petal decoration. Perfect for couples celebrating special occasions.",
        price: 349.99,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        is_available: true,
      },
      {
        title: "Standard Comfort Room",
        description: "Cozy and comfortable room with all essential amenities. Great value for budget-conscious travelers.",
        price: 129.99,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        is_available: true,
      },
    ];

    for (const room of rooms) {
      await pool.query(
        "INSERT INTO rooms (title, description, price, capacity, image, is_available) VALUES (?, ?, ?, ?, ?, ?)",
        [room.title, room.description, room.price, room.capacity, room.image, room.is_available]
      );
    }

    console.log("✅ Sample rooms added!");

    // Insert sample services
    const services = [
      {
        name: "Airport Transfer",
        description: "Luxury car service to and from the airport with professional driver",
        price: 75.00,
      },
      {
        name: "Spa & Wellness Package",
        description: "Full day spa access with massage, facial, and wellness treatments",
        price: 150.00,
      },
      {
        name: "Fine Dining Experience",
        description: "5-course gourmet dinner prepared by our Michelin-star chef",
        price: 120.00,
      },
      {
        name: "Room Service (24/7)",
        description: "Round-the-clock in-room dining service",
        price: 25.00,
      },
    ];

    for (const service of services) {
      await pool.query(
        "INSERT INTO services (name, description, price) VALUES (?, ?, ?)",
        [service.name, service.description, service.price]
      );
    }

    console.log("✅ Sample services added!");
    console.log("\n🎉 Database seeded successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
