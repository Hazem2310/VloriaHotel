import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { roomsAPI } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./rooms.module.css";

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

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

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

  const applyFilters = () => {
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

  return (
    <div className={styles.roomsPage}>
      <div className={styles.hero}>
        <h1>{t("roomsTitle")}</h1>
        <p>Discover our luxurious rooms and suites</p>
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
            <label>Search</label>
            <input
              type="text"
              placeholder="Search rooms..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
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
        </aside>

        {/* Rooms Grid */}
        <main className={styles.roomsContent}>
          <div className={styles.resultsHeader}>
            <p>
              {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} found
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
                      <div className={styles.noImage}>No Image</div>
                    )}
                    <div className={styles.roomBadge}>
                      {room.is_available ? (
                        <span className={styles.available}>{t("available")}</span>
                      ) : (
                        <span className={styles.unavailable}>{t("notAvailable")}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.roomInfo}>
                    <h3>{room.title}</h3>
                    <p className={styles.description}>{room.description}</p>

                    <div className={styles.roomMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.icon}>👥</span>
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className={styles.price}>
                        <span className={styles.amount}>${room.price}</span>
                        <span className={styles.period}>/ night</span>
                      </div>
                    </div>

                    <Link to={`/rooms/${room.id}`} className={styles.viewBtn}>
                      {t("viewDetails")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
