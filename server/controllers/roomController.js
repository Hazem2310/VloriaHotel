import pool from "../dbSingleton.js";

export const getAllRooms = async (req, res) => {
  try {
    const { status } = req.query;
    
    let whereClause = "WHERE 1=1";
    const params = [];
    
    if (status && status !== "ALL") {
      whereClause += " AND status = ?";
      params.push(status);
    }

    const [rooms] = await pool.query(`
      SELECT * FROM rooms 
      ${whereClause}
      ORDER BY room_number
    `, params);

    const parsedRooms = rooms.map((room) => ({
      ...room,
      images: room.images ? JSON.parse(room.images) : [],
    }));

    res.json({
      success: true,
      count: parsedRooms.length,
      rooms: parsedRooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT * FROM rooms WHERE room_id = ?
    `, [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const room = rooms[0];
    
    // Parse JSON fields
    room.images = room.images ? JSON.parse(room.images) : [];

    res.json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomTypes = async (req, res) => {
  try {
    const [roomTypes] = await pool.query(`
      SELECT DISTINCT room_type as name, COUNT(*) as room_count
      FROM rooms 
      WHERE status = 'AVAILABLE'
      GROUP BY room_type
      ORDER BY room_type
    `);

    res.json({
      success: true,
      room_types: roomTypes,
    });
  } catch (error) {
    console.error("Get room types error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomAvailability = async (req, res) => {
  try {
    const { start_date, end_date, room_type } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Please provide start_date and end_date",
      });
    }

    let whereClause = "WHERE status = 'AVAILABLE'";
    const params = [];
    
    if (room_type) {
      whereClause += " AND room_type = ?";
      params.push(room_type);
    }

    const [availableRooms] = await pool.query(`
      SELECT * FROM rooms 
      ${whereClause}
      ORDER BY room_number
    `, params);

    // Parse images for each room
    const roomsWithImages = availableRooms.map(room => ({
      ...room,
      images: room.images ? JSON.parse(room.images) : []
    }));

    res.json({
      success: true,
      count: roomsWithImages.length,
      rooms: roomsWithImages,
    });
  } catch (error) {
    console.error("Get room availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { 
      room_number, 
      room_type_id, 
      floor, 
      extra_bed_allowed = false, 
      extra_bed_price = 0, 
      notes,
      status = 'ACTIVE' 
    } = req.body;

    if (!room_number || !room_type_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide room_number and room_type_id",
      });
    }

    // Check if room number already exists
    const [existing] = await pool.query("SELECT room_id FROM rooms WHERE room_number = ?", [room_number]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room number already exists",
      });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create room
      const [result] = await connection.query(`
        INSERT INTO rooms (room_number, room_type_id, floor, extra_bed_allowed, extra_bed_price, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [room_number, room_type_id, floor || null, extra_bed_allowed ? 1 : 0, extra_bed_price || 0, notes || null, status]);

      const roomId = result.insertId;

      // Get the created room with details
      const [newRoom] = await connection.query(`
        SELECT 
          r.*,
          rt.name as room_type_name,
          rt.base_capacity,
          rt.max_capacity,
          rt.base_price
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE r.room_id = ?
      `, [roomId]);

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Room created successfully",
        room: newRoom[0],
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const {
      room_number,
      room_type_id,
      floor,
      extra_bed_allowed,
      extra_bed_price,
      notes,
      status,
    } = req.body;

    const [rooms] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room_number && room_number !== rooms[0].room_number) {
      const [existing] = await pool.query(
        "SELECT room_id FROM rooms WHERE room_number = ? AND room_id != ?",
        [room_number, req.params.id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Room number already exists",
        });
      }
    }

    await pool.query(`
      UPDATE rooms 
      SET room_number = ?, room_type_id = ?, floor = ?, extra_bed_allowed = ?, extra_bed_price = ?, notes = ?, status = ?
      WHERE room_id = ?
    `, [
      room_number || rooms[0].room_number,
      room_type_id || rooms[0].room_type_id,
      floor !== undefined ? floor : rooms[0].floor,
      extra_bed_allowed !== undefined ? (extra_bed_allowed ? 1 : 0) : rooms[0].extra_bed_allowed,
      extra_bed_price !== undefined ? extra_bed_price : rooms[0].extra_bed_price,
      notes !== undefined ? notes : rooms[0].notes,
      status || rooms[0].status,
      req.params.id,
    ]);

    const [updatedRoom] = await pool.query(`
      SELECT 
        r.*,
        rt.name as room_type_name,
        rt.base_capacity,
        rt.max_capacity,
        rt.base_price,
        rt.description as room_type_description
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom[0],
    });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms WHERE room_id = ?", [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check for active bookings
    const [activeBookings] = await pool.query(`
      SELECT COUNT(*) as count
      FROM booking_rooms br
      JOIN bookings b ON br.booking_id = b.booking_id
      WHERE br.room_id = ? AND b.status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
    `, [req.params.id]);

    if (activeBookings[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete room with active bookings",
      });
    }

    // Soft delete by setting status to OUT_OF_SERVICE
    await pool.query("UPDATE rooms SET status = 'OUT_OF_SERVICE' WHERE room_id = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Room deactivated successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addRoomImage = async (req, res) => {
  try {
    const { image_url, sort_order = 0 } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        message: "Please provide image_url",
      });
    }

    const [result] = await pool.query(`
      INSERT INTO room_images (room_id, image_url, sort_order)
      VALUES (?, ?, ?)
    `, [req.params.id, image_url, sort_order]);

    res.status(201).json({
      success: true,
      message: "Room image added successfully",
      image_id: result.insertId,
    });
  } catch (error) {
    console.error("Add room image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeRoomImage = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM room_images WHERE image_id = ? AND room_id = ?",
      [req.params.imageId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      message: "Room image removed successfully",
    });
  } catch (error) {
    console.error("Remove room image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomFeatures = async (req, res) => {
  try {
    const [features] = await pool.query(`
      SELECT 
        f.feature_id,
        f.name,
        f.value_type,
        rf.value_bool,
        rf.value_text,
        rf.value_number
      FROM features f
      LEFT JOIN room_features rf ON f.feature_id = rf.feature_id AND rf.room_id = ?
      WHERE f.is_active = 1
      ORDER BY f.name
    `, [req.params.id]);

    res.json({
      success: true,
      features: features,
    });
  } catch (error) {
    console.error("Get room features error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateRoomFeature = async (req, res) => {
  try {
    const { feature_id } = req.params;
    const { value_bool, value_text, value_number } = req.body;

    // Check if feature exists
    const [feature] = await pool.query("SELECT value_type FROM features WHERE feature_id = ?", [feature_id]);
    if (feature.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feature not found",
      });
    }

    const value_type = feature[0].value_type;
    
    // Validate value based on type
    let updateData = {};
    if (value_type === 'BOOL') {
      updateData = { value_bool: value_bool ? 1 : 0, value_text: null, value_number: null };
    } else if (value_type === 'TEXT') {
      updateData = { value_bool: null, value_text: value_text || null, value_number: null };
    } else if (value_type === 'NUMBER') {
      updateData = { value_bool: null, value_text: null, value_number: value_number || null };
    }

    // Upsert room feature
    await pool.query(`
      INSERT INTO room_features (room_id, feature_id, value_bool, value_text, value_number)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      value_bool = VALUES(value_bool),
      value_text = VALUES(value_text),
      value_number = VALUES(value_number)
    `, [
      req.params.id,
      feature_id,
      updateData.value_bool,
      updateData.value_text,
      updateData.value_number
    ]);

    res.json({
      success: true,
      message: "Room feature updated successfully",
    });
  } catch (error) {
    console.error("Update room feature error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
