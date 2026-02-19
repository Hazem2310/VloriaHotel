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
    amenities: {
      balcony: false,
      pool_view: false,
      sea_view: false,
      breakfast_included: false,
    },
  });
  const { t } = useLanguage();

  const applyFilters = useCallback(() => {
    let filtered = [...rooms];

    if (filters.search) {
      filtered = filtered.filter((room) =>
        room.room_type.toLowerCase().includes(filters.search.toLowerCase())
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
      filtered = filtered.filter((room) => room.status === 'AVAILABLE');
    }

    // Amenity filters
    if (filters.amenities.balcony) {
      filtered = filtered.filter((room) => room.balcony);
    }
    if (filters.amenities.pool_view) {
      filtered = filtered.filter((room) => room.pool_view);
    }
    if (filters.amenities.sea_view) {
      filtered = filtered.filter((room) => room.sea_view);
    }
    if (filters.amenities.breakfast_included) {
      filtered = filtered.filter((room) => room.breakfast_included);
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
      amenities: {
        balcony: false,
        pool_view: false,
        sea_view: false,
        breakfast_included: false,
      },
    });
  };

  const handleAmenityFilter = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const getRoomAmenities = (room) => {
    const amenities = [];
    
    if (room.wifi) amenities.push({ icon: "📶", name: "WiFi" });
    if (room.tv) amenities.push({ icon: "📺", name: "Smart TV" });
    if (room.air_conditioning) amenities.push({ icon: "❄️", name: "A/C" });
    if (room.room_service) amenities.push({ icon: "🍽️", name: "Room Service" });
    if (room.mini_bar) amenities.push({ icon: "🍷", name: "Minibar" });
    if (room.coffee_machine) amenities.push({ icon: "☕", name: "Coffee" });
    if (room.safe_box) amenities.push({ icon: "🔒", name: "Safe Box" });
    if (room.balcony) amenities.push({ icon: "🌅", name: "Balcony" });
    if (room.pool_view) amenities.push({ icon: "🏊", name: "Pool View" });
    if (room.sea_view) amenities.push({ icon: "🌊", name: "Sea View" });
    if (room.parking) amenities.push({ icon: "🅿️", name: "Parking" });
    if (room.breakfast_included) amenities.push({ icon: "🍳", name: "Breakfast" });
    
    return amenities;
  };

  const isSuite = (roomType) => {
    return roomType.toLowerCase().includes('suite');
  };

  const getSuiteBadge = (roomType) => {
    if (roomType.includes('Executive')) return { icon: "👑", text: "Premium Suite" };
    if (roomType.includes('Junior')) return { icon: "⭐", text: "Suite" };
    return null;
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.roomsPage}>
      <div className={styles.hero}>
        <h1>{t("luxuryRoomsTitle")}</h1>
        <p>{t("luxurySubtitle")}</p>
      </div>

      <div className={styles.container}>
        {/* Filters Section */}
        <aside className={styles.filters}>
          <div className={styles.filterHeader}>
            <h3>{t("filters")}</h3>
            <button onClick={clearFilters} className={styles.clearBtn}>
              {t("clearAll")}
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label>{t("searchByName")}</label>
            <input
              type="text"
              placeholder={t("searchRooms")}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>{t("priceRange")}</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder={t("minPrice")}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder={t("maxPrice")}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>{t("minimumCapacity")}</label>
            <select
              value={filters.capacity}
              onChange={(e) => handleFilterChange("capacity", e.target.value)}
            >
              <option value="">{t("anyCapacity")}</option>
              <option value="1">{t("oneGuest")}</option>
              <option value="2">{t("twoGuests")}</option>
              <option value="3">{t("threeGuests")}</option>
              <option value="4">{t("fourGuests")}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => handleFilterChange("availableOnly", e.target.checked)}
              />
              <span>{t("availableOnly")}</span>
            </label>
          </div>

          {/* Amenity Filters */}
          <div className={styles.filterGroup}>
            <label>{t("specialFeatures")}</label>
            <div className={styles.amenityFilters}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.amenities.balcony}
                  onChange={() => handleAmenityFilter("balcony")}
                />
                <span>🌅 Balcony</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.amenities.pool_view}
                  onChange={() => handleAmenityFilter("pool_view")}
                />
                <span>🏊 Pool View</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.amenities.sea_view}
                  onChange={() => handleAmenityFilter("sea_view")}
                />
                <span>🌊 Sea View</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.amenities.breakfast_included}
                  onChange={() => handleAmenityFilter("breakfast_included")}
                />
                <span>🍳 Breakfast</span>
              </label>
            </div>
          </div>

          {/* Room Features Info */}
          <div className={styles.filterInfo}>
            <h4>{t("includedInStay")}</h4>
            <ul>
              <li>✔ {t("freeWifi")}</li>
              <li>✔ {t("smartTV")}</li>
              <li>✔ {t("airConditioning")}</li>
              <li>✔ {t("roomService")}</li>
            </ul>
          </div>
        </aside>

        {/* Rooms Grid */}
        <main className={styles.roomsContent}>
          <div className={styles.resultsHeader}>
            <p>
              <strong>{filteredRooms.length}</strong> {filteredRooms.length === 1 ? t("roomAvailable") : t("roomsAvailable")}
            </p>
          </div>

          {filteredRooms.length === 0 ? (
            <div className={styles.noResults}>
              <p>{t("noRoomsMatch")}</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                {t("resetFilters")}
              </button>
            </div>
          ) : (
            <div className={styles.roomsGrid}>
              {filteredRooms.map((room) => {
                const suiteBadge = getSuiteBadge(room.room_type);
                const amenities = getRoomAmenities(room);
                
                return (
                  <div key={room.room_id} className={styles.card}>
                    <div className={styles.imageContainer}>
                      {room.image ? (
                        <img src={room.image} alt={room.room_type} className={styles.roomImage} />
                      ) : (
                        <div className={styles.noImage}>
                          <span className={styles.noImageIcon}>🏨</span>
                          <span className={styles.roomNumber}>Room {room.room_number}</span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={styles.statusBadge}>
                        {room.status === 'AVAILABLE' ? (
                          <span className={styles.statusAvailable}>✓ Available</span>
                        ) : room.status === 'BOOKED' ? (
                          <span className={styles.statusBooked}>Booked</span>
                        ) : (
                          <span className={styles.statusMaintenance}>Maintenance</span>
                        )}
                      </div>

                      {/* Suite Badge */}
                      {suiteBadge && (
                        <div className={styles.suiteBadge}>
                          <span>{suiteBadge.icon} {suiteBadge.text}</span>
                        </div>
                      )}

                      {/* Room Number Overlay */}
                      <div className={styles.roomNumberOverlay}>
                        Room {room.room_number}
                      </div>
                    </div>

                    <div className={styles.content}>
                      <div className={styles.header}>
                        <h3 className={styles.title}>{room.room_type}</h3>
                      </div>

                      {/* Capacity */}
                      <div className={styles.capacityInfo}>
                        <span className={styles.capacityIcon}>👥</span>
                        <span>{t("upToGuests")} {room.capacity} {room.capacity === 1 ? t("guest") : t("guests")}</span>
                      </div>

                      {/* Amenities with Icons */}
                      <div className={styles.amenitiesList}>
                        {amenities.slice(0, 3).map((amenity, index) => (
                          <div key={index} className={styles.amenityItem}>
                            <span className={styles.amenityIcon}>{amenity.icon}</span>
                            <span className={styles.amenityName}>{amenity.name}</span>
                          </div>
                        ))}
                        {amenities.length > 3 && (
                          <div className={styles.amenityMore}>
                            +{amenities.length - 3} more
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className={styles.priceSection}>
                        <div className={styles.price}>
                          <span className={styles.amount}>${room.price}</span>
                          <span className={styles.period}>{t("perNight")}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={styles.cardActions}>
                        <Link 
                          to={`/rooms/${room.room_id}`} 
                          className={styles.viewDetailsBtn}
                          state={{ scrollToBooking: false }}
                        >
                          {t("viewDetails")}
                        </Link>
                        <Link 
                          to={`/rooms/${room.room_id}`} 
                          className={styles.bookNowBtn}
                          state={{ scrollToBooking: true }}
                        >
                          {t("bookNow")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
