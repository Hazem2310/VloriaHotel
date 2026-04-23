import React, { useState, useEffect } from "react";
import { roomsAPI } from "../../Api/roomsApi";
import styles from "./RoomCards.module.css";

const RoomCards = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomsAPI.getAll();
        if (data.success && data.rooms) {
          setRooms(data.rooms);
        } else {
          setError("Failed to load rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) {
      return "/placeholder-room.jpg"; // Add a placeholder image
    }
    return images[0].image_url;
  };

  const getRoomFeatures = (features) => {
    if (!features || features.length === 0) return [];
    
    return features
      .filter(feature => feature.value_bool === 1 || feature.value_text || feature.value_number)
      .map(feature => feature.feature_name);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.roomsContainer}>
      <h2 className={styles.title}>Available Rooms</h2>
      <div className={styles.roomsGrid}>
        {rooms.map((room) => (
          <div key={room.room_id} className={styles.roomCard}>
            <div className={styles.imageContainer}>
              <img
                src={getImageUrl(room.images)}
                alt={room.room_type_name || room.room_number}
                className={styles.roomImage}
                onError={(e) => {
                  e.target.src = "/placeholder-room.jpg";
                }}
              />
              <div className={styles.roomPrice}>
                {formatPrice(room.price || room.base_price)}
              </div>
            </div>
            
            <div className={styles.roomInfo}>
              <h3 className={styles.roomNumber}>{room.room_number}</h3>
              <p className={styles.roomType}>{room.room_type_name}</p>
              
              <div className={styles.roomDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Capacity:</span>
                  <span>{room.capacity || room.base_capacity} guests</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Status:</span>
                  <span className={`${styles.status} ${styles[room.status?.toLowerCase()]}`}>
                    {room.status}
                  </span>
                </div>
              </div>

              {getRoomFeatures(room.features).length > 0 && (
                <div className={styles.features}>
                  <h4>Features:</h4>
                  <div className={styles.featureList}>
                    {getRoomFeatures(room.features).slice(0, 6).map((feature, index) => (
                      <span key={index} className={styles.feature}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.cardActions}>
                <button className={styles.viewDetailsBtn}>
                  View Details
                </button>
                <button className={styles.bookBtn}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && !loading && (
        <div className={styles.noRooms}>
          <p>No rooms available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default RoomCards;
