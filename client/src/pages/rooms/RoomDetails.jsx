import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI } from "../../Api/roomsApi";
import { bookingsAPI } from "../../Api/bookingsApi";
import { useAuth } from "../../context/AuthContext";
import styles from "./RoomDetails.module.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoomDetails = useCallback(async () => {
    try {
      const response = await roomsAPI.getById(id);
      if (response.data.success) {
        setRoom(response.data.room);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
      setError("Failed to load room details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const calculateTotalPrice = useCallback(() => {
    if (bookingData.checkIn && bookingData.checkOut && room) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setTotalPrice(nights * room.price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, room]);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to book a room");
      navigate("/auth");
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await bookingsAPI.create({
        roomId: room.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
      });

      if (response.data.success) {
        alert("Booking confirmed successfully!");
        navigate("/my-bookings");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const getRoomFeatures = () => {
    const baseFeatures = [
      { icon: "📶", name: "Free WiFi" },
      { icon: "📺", name: "Smart TV" },
      { icon: "❄️", name: "Air Conditioning" },
      { icon: "🍷", name: "Minibar" },
      { icon: "☕", name: "Coffee Station" },
      { icon: "🔒", name: "Safe Box" },
    ];

    if (room?.title.toLowerCase().includes("suite")) {
      return [
        ...baseFeatures,
        { icon: "🛁", name: "Luxury Bathtub" },
        { icon: "👔", name: "Walk-in Closet" },
        { icon: "🎯", name: "VIP Service" },
        { icon: "🧴", name: "Premium Toiletries" },
      ];
    } else if (room?.title.toLowerCase().includes("balcony")) {
      return [
        ...baseFeatures,
        { icon: "🌅", name: "Private Balcony" },
        { icon: "🪑", name: "Outdoor Seating" },
      ];
    } else if (room?.title.toLowerCase().includes("triple")) {
      return [
        ...baseFeatures,
        { icon: "👨‍👩‍👧", name: "Family Friendly" },
        { icon: "📦", name: "Extra Storage" },
      ];
    }
    
    return baseFeatures;
  };

  const getImageGallery = () => {
    // Placeholder images - in production, these would come from the database
    const baseImages = [
      room?.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ];
    return baseImages;
  };

  if (loading) {
    return <div className={styles.loading}>Loading room details...</div>;
  }

  if (error || !room) {
    return (
      <div className={styles.error}>
        <h2>Room not found</h2>
        <button onClick={() => navigate("/rooms")} className={styles.backBtn}>
          Back to Rooms
        </button>
      </div>
    );
  }

  const images = getImageGallery();
  const features = getRoomFeatures();

  return (
    <div className={styles.roomDetailsPage}>
      {/* Back Button */}
      <div className={styles.backSection}>
        <button onClick={() => navigate("/rooms")} className={styles.backBtn}>
          ← Back to Rooms
        </button>
      </div>

      <div className={styles.container}>
        {/* Image Gallery */}
        <div className={styles.gallerySection}>
          <div className={styles.mainImage}>
            <img src={images[selectedImage]} alt={room.title} />
            {!room.is_available && (
              <div className={styles.bookedOverlay}>
                <span>Currently Booked</span>
              </div>
            )}
          </div>
          
          <div className={styles.thumbnails}>
            {images.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.activeThumbnail : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Room Information */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div>
              <h1>{room.title}</h1>
              <div className={styles.roomMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.icon}>👥</span>
                  Up to {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.icon}>🛏️</span>
                  {room.capacity === 1 ? "Single" : room.capacity === 2 ? "Double" : room.capacity === 3 ? "Triple" : "Suite"}
                </span>
              </div>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.price}>${room.price}</span>
              <span className={styles.period}>/ night</span>
            </div>
          </div>

          <div className={styles.availability}>
            {room.is_available ? (
              <span className={styles.available}>✓ Available</span>
            ) : (
              <span className={styles.unavailable}>✗ Currently Booked</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h2>About This Room</h2>
            <p>{room.description}</p>
          </div>

          {/* Features */}
          <div className={styles.features}>
            <h2>Room Features</h2>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className={styles.amenities}>
            <h2>All Amenities Include</h2>
            <ul>
              <li>✓ 24/7 Room Service</li>
              <li>✓ Daily Housekeeping</li>
              <li>✓ Luxury Toiletries</li>
              <li>✓ Telephone</li>
              <li>✓ Hair Dryer</li>
              <li>✓ Iron (Upon Request)</li>
            </ul>
          </div>

          {/* Booking Form */}
          {room.is_available && (
            <div className={styles.bookingForm}>
              <h2>Book This Room</h2>
              
              <div className={styles.dateInputs}>
                <div className={styles.inputGroup}>
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {totalPrice > 0 && (
                <div className={styles.priceCalculation}>
                  <div className={styles.priceRow}>
                    <span>Room Rate:</span>
                    <span>${room.price} / night</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Number of Nights:</span>
                    <span>{Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                  <div className={`${styles.priceRow} ${styles.totalRow}`}>
                    <span>Total Price:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading || !bookingData.checkIn || !bookingData.checkOut}
                className={styles.confirmBtn}
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
