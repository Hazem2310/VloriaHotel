import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get files from directory
const getFilesFromDirectory = (dirPath, baseUrl) => {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        url: `${baseUrl}/${file}`,
        filename: file,
        name: path.parse(file).name
      }));
  } catch (error) {
    console.log(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
};

// Get all gallery images with categories
export const getGalleryImages = async (req, res) => {
  try {
    const { category } = req.query;
    const uploadsDir = path.join(__dirname, "../uploads");
    const baseUrl = "http://localhost:5000/uploads";
    
    let allImages = [];
    
    // Get specific room images as requested
    if (!category || category === "all" || category === "rooms") {
      try {
        const roomDir = path.join(uploadsDir, "rooms");
        const allRoomFiles = getFilesFromDirectory(roomDir, `${baseUrl}/rooms`);
        
        // Use specific room images as requested
        const specificRoomFiles = [
          "Garden View Room - Double1.jpeg",
          "Pool View Room - Double1.jpeg", 
          "Room with Balcony - Double1.jpeg",
          "Triple Room1.jpeg",
          "Room with Balcony - Double4.jpeg",
          "Pool View Room - Double3.jpeg"
        ];
        
        const selectedRoomImages = specificRoomFiles
          .map(filename => allRoomFiles.find(file => file.filename === filename))
          .filter(file => file !== undefined);
        
        if (selectedRoomImages.length > 0) {
          allImages.push({
            id: 1,
            title: "Our Rooms",
            subtitle: "Comfortable & Elegant Spaces",
            category: "rooms",
            description: "Experience luxury and comfort",
            images: selectedRoomImages
          });
        }
      } catch (error) {
        console.log("Error getting room images:", error.message);
      }
    }
    
    // Get specific hall images as requested
    if (!category || category === "all" || category === "halls") {
      try {
        const hallsDir = path.join(uploadsDir, "halls");
        const allHallFiles = getFilesFromDirectory(hallsDir, `${baseUrl}/halls`);
        
        // Use specific hall images as requested
        const specificHallFiles = ["halls1.jpeg", "halls2.jpeg"];
        
        const selectedHallImages = specificHallFiles
          .map(filename => allHallFiles.find(file => file.filename === filename))
          .filter(file => file !== undefined);
        
        if (selectedHallImages.length > 0) {
          allImages.push({
            id: 1,
            title: "Event Halls",
            subtitle: "Conference & Event Spaces",
            category: "halls",
            description: "Beautiful halls for your events",
            images: selectedHallImages
          });
        }
      } catch (error) {
        console.log("Error getting hall images:", error.message);
      }
    }
    
    // Get specific restaurant image as requested
    if (!category || category === "all" || category === "restaurants") {
      try {
        const restaurantDir = path.join(uploadsDir, "resturante");
        const allRestaurantFiles = getFilesFromDirectory(restaurantDir, `${baseUrl}/resturante`);
        
        // Use specific restaurant image as requested
        const specificRestaurantFile = allRestaurantFiles.find(file => file.filename === "res1.jpeg");
        
        if (specificRestaurantFile) {
          allImages.push({
            id: 1,
            title: "Restaurant",
            subtitle: "Fine Dining Experience",
            category: "restaurants",
            description: "Exquisite cuisine and ambiance",
            images: [specificRestaurantFile]
          });
        }
      } catch (error) {
        console.log("Error getting restaurant images:", error.message);
      }
    }

    res.json({
      success: true,
      count: allImages.length,
      images: allImages,
    });
  } catch (error) {
    console.error("Get gallery images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get gallery images by category
export const getGalleryByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const uploadsDir = path.join(__dirname, "../uploads");
    const baseUrl = "http://localhost:5000/uploads";
    
    let allImages = [];
    
    switch (category) {
      case "rooms":
        try {
          const roomDir = path.join(uploadsDir, "rooms");
          const allRoomFiles = getFilesFromDirectory(roomDir, `${baseUrl}/rooms`);
          
          // Use specific room images as requested
          const specificRoomFiles = [
            "Garden View Room - Double1.jpeg",
            "Pool View Room - Double1.jpeg", 
            "Room with Balcony - Double1.jpeg",
            "Triple Room1.jpeg",
            "Room with Balcony - Double4.jpeg",
            "Pool View Room - Double3.jpeg"
          ];
          
          const selectedRoomImages = specificRoomFiles
            .map(filename => allRoomFiles.find(file => file.filename === filename))
            .filter(file => file !== undefined);
          
          if (selectedRoomImages.length > 0) {
            allImages.push({
              id: 1,
              title: "Our Rooms",
              subtitle: "Comfortable & Elegant Spaces",
              category: "rooms",
              description: "Experience luxury and comfort",
              images: selectedRoomImages
            });
          }
        } catch (error) {
          console.log("Error getting room images:", error.message);
        }
        break;
        
      case "halls":
        try {
          const hallsDir = path.join(uploadsDir, "halls");
          const allHallFiles = getFilesFromDirectory(hallsDir, `${baseUrl}/halls`);
          
          // Use specific hall images as requested
          const specificHallFiles = ["halls1.jpeg", "halls2.jpeg"];
          
          const selectedHallImages = specificHallFiles
            .map(filename => allHallFiles.find(file => file.filename === filename))
            .filter(file => file !== undefined);
          
          if (selectedHallImages.length > 0) {
            allImages.push({
              id: 1,
              title: "Event Halls",
              subtitle: "Conference & Event Spaces",
              category: "halls",
              description: "Beautiful halls for your events",
              images: selectedHallImages
            });
          }
        } catch (error) {
          console.log("Error getting hall images:", error.message);
        }
        break;
        
      case "restaurants":
        try {
          const restaurantDir = path.join(uploadsDir, "resturante");
          const allRestaurantFiles = getFilesFromDirectory(restaurantDir, `${baseUrl}/resturante`);
          
          // Use specific restaurant image as requested
          const specificRestaurantFile = allRestaurantFiles.find(file => file.filename === "res1.jpeg");
          
          if (specificRestaurantFile) {
            allImages.push({
              id: 1,
              title: "Restaurant",
              subtitle: "Fine Dining Experience",
              category: "restaurants",
              description: "Exquisite cuisine and ambiance",
              images: [specificRestaurantFile]
            });
          }
        } catch (error) {
          console.log("Error getting restaurant images:", error.message);
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid category. Use: rooms, halls, or restaurants",
        });
    }

    res.json({
      success: true,
      count: allImages.length,
      images: allImages,
    });
  } catch (error) {
    console.error("Get gallery by category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get gallery statistics
export const getGalleryStats = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    const stats = {
      rooms: 0,
      halls: 0,
      restaurants: 0,
      total: 0
    };

    // Count rooms with images (from database)
    try {
      const [roomCount] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM rooms 
        WHERE images IS NOT NULL AND images != '[]' AND images != ''
      `);
      stats.rooms = roomCount[0].count;
    } catch (error) {
      console.log("Error counting rooms from database:", error.message);
      // Fallback: count files in rooms directory
      try {
        const roomsDir = path.join(uploadsDir, "rooms");
        if (fs.existsSync(roomsDir)) {
          const roomFiles = fs.readdirSync(roomsDir);
          stats.rooms = roomFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).length;
        }
      } catch (dirError) {
        console.log("Error counting room files:", dirError.message);
      }
    }

    // Count hall files
    try {
      const hallsDir = path.join(uploadsDir, "halls");
      if (fs.existsSync(hallsDir)) {
        const hallFiles = fs.readdirSync(hallsDir);
        stats.halls = hallFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).length;
      }
    } catch (error) {
      console.log("Error counting hall files:", error.message);
    }

    // Count restaurant files
    try {
      const restaurantDir = path.join(uploadsDir, "resturante");
      if (fs.existsSync(restaurantDir)) {
        const restaurantFiles = fs.readdirSync(restaurantDir);
        stats.restaurants = restaurantFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).length;
      }
    } catch (error) {
      console.log("Error counting restaurant files:", error.message);
    }

    stats.total = stats.rooms + stats.halls + stats.restaurants;

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get gallery stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
