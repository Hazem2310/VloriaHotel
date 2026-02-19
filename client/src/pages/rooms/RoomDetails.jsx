import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { roomsAPI } from "../../Api/roomsApi";
import { bookingsAPI } from "../../Api/bookingsApi";
import { getAllMealPackages } from "../../Api/mealPackagesApi";
import { useAuth } from "../../context/AuthContext";
import styles from "./RoomDetails.module.css";
import mealStyles from "./MealSelection.module.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const bookingFormRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [mealPackages, setMealPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
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

  const fetchMealPackages = useCallback(async () => {
    try {
      const data = await getAllMealPackages();
      console.log("Fetched meal packages:", data);
      setMealPackages(data || []);
    } catch (error) {
      console.error("Error fetching meal packages:", error);
    }
  }, []);

  const calculateTotalPrice = useCallback(() => {
    if (bookingData.checkIn && bookingData.checkOut && room) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        let roomTotal = nights * room.price;
        
        // Calculate meal package cost
        let packageTotal = 0;
        if (selectedPackage) {
          const pkg = mealPackages.find(p => p.package_id === selectedPackage);
          if (pkg) {
            packageTotal = pkg.price_per_day * nights;
          }
        }
        
        setTotalPrice(roomTotal + packageTotal);
      } else {
        setTotalPrice(0);
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, room, selectedPackage, mealPackages]);

  useEffect(() => {
    fetchRoomDetails();
    fetchMealPackages();
  }, [fetchRoomDetails, fetchMealPackages]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  useEffect(() => {
    // Scroll to booking form if coming from "Book Now" button
    if (location.state?.scrollToBooking && bookingFormRef.current && room) {
      setTimeout(() => {
        bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [location.state, room]);

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
        mealPackageId: selectedPackage,
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
    if (!room) return [];
    
    const features = [];
    
    if (room.wifi) features.push({ icon: "📶", name: "Free WiFi" });
    if (room.tv) features.push({ icon: "📺", name: "Smart TV" });
    if (room.air_conditioning) features.push({ icon: "❄️", name: "Air Conditioning" });
    if (room.mini_bar) features.push({ icon: "🍷", name: "Minibar" });
    if (room.coffee_machine) features.push({ icon: "☕", name: "Coffee Machine" });
    if (room.safe_box) features.push({ icon: "🔒", name: "Safe Box" });
    if (room.room_service) features.push({ icon: "🍽️", name: "Room Service" });
    if (room.balcony) features.push({ icon: "�", name: "Private Balcony" });
    if (room.pool_view) features.push({ icon: "🏊", name: "Pool View" });
    if (room.sea_view) features.push({ icon: "�", name: "Sea View" });
    if (room.parking) features.push({ icon: "🅿️", name: "Parking" });
    if (room.breakfast_included) features.push({ icon: "🍳", name: "Breakfast Included" });
    
    return features;
  };

  const getImageGallery = () => {
    if (!room || !room.image) {
      return [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      ];
    }
    
    // Use the room's main image plus related images
    return [
      room.image,
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ];
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
            <img src={images[selectedImage]} alt={room.room_type} />
            {room.status !== 'AVAILABLE' && (
              <div className={styles.bookedOverlay}>
                <span>{room.status === 'BOOKED' ? 'Currently Booked' : 'Under Maintenance'}</span>
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
              <h1>{room.room_type}</h1>
              <div className={styles.roomMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.icon}>🚪</span>
                  Room {room.room_number}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.icon}>�</span>
                  Up to {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.icon}>�️</span>
                  {room.room_type.includes("Double") ? "Double Bed" : room.room_type.includes("Triple") ? "Triple Beds" : room.room_type.includes("Suite") ? "King Suite" : "Standard"}
                </span>
              </div>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.price}>${room.price}</span>
              <span className={styles.period}>/ night</span>
            </div>
          </div>

          <div className={styles.availability}>
            {room.status === 'AVAILABLE' ? (
              <span className={styles.available}>✓ Available</span>
            ) : (
              <span className={styles.unavailable}>✗ Currently Booked</span>
            )}
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h2>About This Room</h2>
            <p>Experience luxury and comfort in our {room.room_type}. This elegantly designed room offers premium amenities and exceptional service to ensure a memorable stay at Veloria Grand Hotel.</p>
            <p>Perfect for {room.capacity === 1 ? 'solo travelers' : room.capacity === 2 ? 'couples' : room.capacity === 3 ? 'small families or groups' : 'families and larger groups'}, this room provides {room.room_type.includes('Suite') ? 'spacious luxury accommodations' : 'comfortable and modern facilities'} with stunning views and world-class amenities.</p>
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
          {room.status === 'AVAILABLE' && (
            <div className={styles.bookingForm} ref={bookingFormRef}>
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

              {/* Meal Package Selection */}
              <div className={mealStyles.mealSelection}>
                <h3>Add Meal Package to Your Stay (Optional)</h3>
                <p className={mealStyles.mealSubtitle}>Choose a meal package to enjoy during your stay. Price is per day.</p>
                
                <div className={mealStyles.packageList}>
                  <label className={mealStyles.mealItem}>
                    <input
                      type="radio"
                      name="mealPackage"
                      checked={selectedPackage === null}
                      onChange={() => setSelectedPackage(null)}
                    />
                    <div className={mealStyles.mealInfo}>
                      <span className={mealStyles.mealName}>No Meal Package</span>
                      <span className={mealStyles.mealDesc}>Room only - no meals included</span>
                    </div>
                    <span className={mealStyles.mealPrice}>$0.00</span>
                  </label>
                  
                  {mealPackages.map(pkg => (
                    <label key={pkg.package_id} className={mealStyles.mealItem}>
                      <input
                        type="radio"
                        name="mealPackage"
                        checked={selectedPackage === pkg.package_id}
                        onChange={() => setSelectedPackage(pkg.package_id)}
                      />
                      <div className={mealStyles.mealInfo}>
                        <span className={mealStyles.mealName}>
                          {pkg.package_name}
                          {pkg.includes_breakfast && ' 🍳'}
                          {pkg.includes_lunch && ' 🍽️'}
                          {pkg.includes_dinner && ' 🌙'}
                        </span>
                        <span className={mealStyles.mealDesc}>{pkg.description}</span>
                      </div>
                      <span className={mealStyles.mealPrice}>${pkg.price_per_day}/day</span>
                    </label>
                  ))}
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
                  {selectedPackage && (
                    <>
                      {(() => {
                        const pkg = mealPackages.find(p => p.package_id === selectedPackage);
                        const nights = Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24));
                        return pkg ? (
                          <>
                            <div className={styles.priceRow}>
                              <span>Meal Package:</span>
                              <span>{pkg.package_name}</span>
                            </div>
                            <div className={mealStyles.priceRowSmall}>
                              <span>  ${pkg.price_per_day}/day × {nights} nights</span>
                              <span>${(pkg.price_per_day * nights).toFixed(2)}</span>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </>
                  )}
                  <div className={`${styles.priceRow} ${styles.totalRow}`}>
                    <span>Total Price:</span>
                    <span>${totalPrice.toFixed(2)}</span>
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
