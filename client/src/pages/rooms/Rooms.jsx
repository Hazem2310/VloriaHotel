import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { roomsAPI } from "../../Api/roomsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./rooms.module.css";
import "./amenities-section.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    availableOnly: false,
  });
  const { t } = useLanguage();

  const applyFilters = useCallback(() => {
    let filtered = [...rooms];

    if (filters.search) {
      filtered = filtered.filter((room) =>
        room.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((room) => room.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((room) => room.price <= parseFloat(filters.maxPrice));
    }

    if (filters.capacity) {
      filtered = filtered.filter((room) => room.capacity >= parseInt(filters.capacity));
    }

    if (filters.availableOnly) {
      filtered = filtered.filter((room) => room.is_available);
    }

    setFilteredRooms(filtered);
  }, [rooms, filters]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      if (response.data.success) {
        setRooms(response.data.rooms);
        setFilteredRooms(response.data.rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      capacity: "",
      availableOnly: false,
    });
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  const getRoomAmenities = (roomTitle) => {
    const commonAmenities = ["WiFi", "Smart TV", "A/C", "Minibar", "Coffee Station", "Safe Box"];
    
    if (roomTitle.toLowerCase().includes("suite")) {
      return [...commonAmenities, "Bathtub", "VIP Service", "Premium Toiletries"];
    } else if (roomTitle.toLowerCase().includes("triple")) {
      return [...commonAmenities, "Extra Space", "Family Friendly"];
    } else if (roomTitle.toLowerCase().includes("balcony")) {
      return [...commonAmenities, "Private Balcony", "Outdoor Seating"];
    }
    return commonAmenities;
  };

  return (
    <div className={styles.roomsPage}>
      <div className={styles.hero}>
        <h1>Luxury Rooms & Suites</h1>
        <p>Experience unparalleled comfort and elegance at Veloria Grand Hotel</p>
      </div>

      <div className={styles.container}>
        {/* Filters Section */}
        <aside className={styles.filters}>
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear All
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label>Search by Name</label>
            <input
              type="text"
              placeholder="Search rooms..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range (per night)</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Minimum Capacity</label>
            <select
              value={filters.capacity}
              onChange={(e) => handleFilterChange("capacity", e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1+ Guest</option>
              <option value="2">2+ Guests</option>
              <option value="3">3+ Guests</option>
              <option value="4">4+ Guests</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => handleFilterChange("availableOnly", e.target.checked)}
              />
              <span>Available Only</span>
            </label>
          </div>

          {/* Room Features Info */}
          <div className={styles.filterInfo}>
            <h4>All Rooms Include:</h4>
            <ul>
              <li>✓ Free High-Speed WiFi</li>
              <li>✓ Smart TV</li>
              <li>✓ Air Conditioning</li>
              <li>✓ 24/7 Room Service</li>
              <li>✓ Daily Housekeeping</li>
              <li>✓ Luxury Toiletries</li>
            </ul>
          </div>
        </aside>

        {/* Rooms Grid */}
        <main className={styles.roomsContent}>
          <div className={styles.resultsHeader}>
            <p>
              <strong>{filteredRooms.length}</strong> {filteredRooms.length === 1 ? "room" : "rooms"} available
            </p>
          </div>

          {filteredRooms.length === 0 ? (
            <div className={styles.noResults}>
              <p>No rooms match your criteria</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.roomsGrid}>
              {filteredRooms.map((room) => (
                <div key={room.id} className={styles.roomCard}>
                  <div className={styles.roomImage}>
                    {room.image ? (
                      <img src={room.image} alt={room.title} />
                    ) : (
                      <div className={styles.noImage}>
                        <span className={styles.noImageIcon}>🏨</span>
                        <span>Luxury Room</span>
                      </div>
                    )}
                    <div className={styles.roomBadge}>
                      {room.is_available ? (
                        <span className={styles.available}>Available</span>
                      ) : (
                        <span className={styles.unavailable}>Booked</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.roomInfo}>
                    <div className={styles.roomHeader}>
                      <h3>{room.title}</h3>
                      <div className={styles.roomType}>
                        <span className={styles.typeIcon}>🛏️</span>
                        <span>{room.capacity === 1 ? "Single" : room.capacity === 2 ? "Double" : room.capacity === 3 ? "Triple" : "Suite"}</span>
                      </div>
                    </div>
                    
                    <p className={styles.description}>{room.description}</p>

                    {/* Amenities */}
                    <div className={styles.amenities}>
                      {getRoomAmenities(room.title).slice(0, 4).map((amenity, index) => (
                        <span key={index} className={styles.amenityTag}>
                          {amenity}
                        </span>
                      ))}
                      {getRoomAmenities(room.title).length > 4 && (
                        <span className={styles.amenityTag}>+{getRoomAmenities(room.title).length - 4} more</span>
                      )}
                    </div>

                    <div className={styles.roomMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.icon}>👥</span>
                        <span>Up to {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}</span>
                      </div>
                      <div className={styles.price}>
                        <span className={styles.amount}>${room.price}</span>
                        <span className={styles.period}>/ night</span>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <Link to={`/rooms/${room.id}`} className={styles.viewDetailsBtn}>
                        View Details
                      </Link>
                      <Link to={`/rooms/${room.id}`} className={styles.bookNowBtn}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* General Amenities Section */}
      <div className={styles.amenitiesSection}>
        <div className={styles.amenitiesContainer}>
          <h2>Luxury Hotel Room Features</h2>
          <p className={styles.amenitiesSubtitle}>Every room at Veloria Grand Hotel includes premium amenities for your comfort</p>
          
          <div className={styles.amenitiesGrid}>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>📶</span>
              <h4>Free High-Speed WiFi</h4>
              <p>Stay connected with complimentary high-speed internet</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>📺</span>
              <h4>Smart TV</h4>
              <p>Entertainment with premium channels and streaming</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>❄️</span>
              <h4>Air Conditioning</h4>
              <p>Climate control for perfect room temperature</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>🍷</span>
              <h4>Minibar</h4>
              <p>Refreshments and snacks at your convenience</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>☕</span>
              <h4>Coffee & Tea Station</h4>
              <p>Premium coffee and tea selection</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>🔒</span>
              <h4>Safety Deposit Box</h4>
              <p>Secure storage for your valuables</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>🧴</span>
              <h4>Luxury Toiletries</h4>
              <p>Premium bath and body products</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>🍽️</span>
              <h4>24/7 Room Service</h4>
              <p>Dining delivered to your room anytime</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>🧹</span>
              <h4>Daily Housekeeping</h4>
              <p>Professional cleaning service every day</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>📞</span>
              <h4>Telephone</h4>
              <p>Direct line for guest services</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>💨</span>
              <h4>Hair Dryer</h4>
              <p>Professional hair dryer in every room</p>
            </div>
            <div className={styles.amenityCard}>
              <span className={styles.amenityIcon}>👔</span>
              <h4>Iron (Upon Request)</h4>
              <p>Ironing facilities available on request</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
