import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { hallsAPI } from "../../Api/hallsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./halls.module.css";
import "./luxury-halls.css";

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minCapacity: "",
    maxCapacity: "",
    minPrice: "",
    maxPrice: "",
    availableOnly: false,
    eventType: "",
  });
  const { t } = useLanguage();

  const applyFilters = useCallback(() => {
    let filtered = [...halls];

    if (filters.search) {
      filtered = filtered.filter((hall) =>
        hall.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minCapacity) {
      filtered = filtered.filter((hall) => hall.capacity >= parseInt(filters.minCapacity));
    }

    if (filters.maxCapacity) {
      filtered = filtered.filter((hall) => hall.capacity <= parseInt(filters.maxCapacity));
    }

    if (filters.minPrice) {
      filtered = filtered.filter((hall) => hall.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((hall) => hall.price <= parseFloat(filters.maxPrice));
    }

    if (filters.availableOnly) {
      filtered = filtered.filter((hall) => hall.status === 'AVAILABLE');
    }

    if (filters.eventType) {
      filtered = filtered.filter((hall) => {
        switch(filters.eventType) {
          case 'wedding':
            return hall.suitable_for_weddings;
          case 'corporate':
            return hall.suitable_for_corporate;
          case 'birthday':
            return hall.suitable_for_birthdays;
          case 'conference':
            return hall.suitable_for_conferences;
          default:
            return true;
        }
      });
    }

    setFilteredHalls(filtered);
  }, [halls, filters]);

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchHalls = async () => {
    try {
      const data = await hallsAPI.getAll();
      console.log("Fetched halls data:", data);
      if (data.success) {
        setHalls(data.halls);
        setFilteredHalls(data.halls);
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
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
      minCapacity: "",
      maxCapacity: "",
      minPrice: "",
      maxPrice: "",
      availableOnly: false,
      eventType: "",
    });
  };

  const getHallFeatures = (hall) => {
    const features = [];
    if (hall.has_stage) features.push({ icon: "🎭", name: "Stage" });
    if (hall.sound_system) features.push({ icon: "🎤", name: "Sound System" });
    if (hall.projector) features.push({ icon: "📽️", name: "Projector" });
    if (hall.catering_available) features.push({ icon: "🍽️", name: "Catering" });
    if (hall.decoration_included) features.push({ icon: "🎨", name: "Decoration" });
    if (hall.parking_available) features.push({ icon: "🅿️", name: "Parking" });
    return features;
  };

  const getSuitableFor = (hall) => {
    const suitable = [];
    if (hall.suitable_for_weddings) suitable.push("Weddings");
    if (hall.suitable_for_corporate) suitable.push("Corporate");
    if (hall.suitable_for_birthdays) suitable.push("Birthdays");
    if (hall.suitable_for_conferences) suitable.push("Conferences");
    return suitable;
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.hallsPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Luxury Event Halls</h1>
        <p>Host unforgettable weddings, conferences, and private events in our elegant halls</p>
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
              placeholder="Search halls..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Capacity Range</label>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange("minCapacity", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxCapacity}
                onChange={(e) => handleFilterChange("maxCapacity", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range</label>
            <div className={styles.rangeInputs}>
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
            <label>Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange("eventType", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="wedding">Weddings</option>
              <option value="corporate">Corporate Events</option>
              <option value="birthday">Birthday Parties</option>
              <option value="conference">Conferences</option>
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

        {/* Main Content */}
        <main className={styles.hallsContent}>
          <div className={styles.resultsHeader}>
            <p>
              <strong>{filteredHalls.length}</strong> {filteredHalls.length === 1 ? "hall" : "halls"} available
            </p>
          </div>

          {filteredHalls.length === 0 ? (
            <div className={styles.noResults}>
              <p>No halls match your criteria</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.hallsGrid}>
              {filteredHalls.map((hall) => {
                const features = getHallFeatures(hall);
                const suitableFor = getSuitableFor(hall);

                return (
                  <div key={hall.hall_id} className={styles.card}>
                    <div className={styles.imageContainer}>
                      {hall.image_url ? (
                        <img src={hall.image_url} alt={hall.name} className={styles.hallImage} />
                      ) : (
                        <div className={styles.noImage}>
                          <span className={styles.noImageIcon}>🏛️</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className={styles.statusBadge}>
                        {hall.status === 'AVAILABLE' ? (
                          <span className={styles.statusAvailable}>✓ Available</span>
                        ) : (
                          <span className={styles.statusBooked}>Booked</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.content}>
                      <div className={styles.header}>
                        <h3 className={styles.title}>{hall.name}</h3>
                        {hall.hall_type && (
                          <span className={styles.hallTypeBadge}>
                            {hall.hall_type === 'Indoor' ? '🏛️' : '🌳'} {hall.hall_type}
                          </span>
                        )}
                      </div>

                      <p className={styles.description}>{hall.description}</p>

                      {/* Capacity */}
                      <div className={styles.capacityInfo}>
                        <span className={styles.capacityIcon}>👥</span>
                        <span>Up to {hall.capacity} Guests</span>
                      </div>

                      {/* Suitable For */}
                      {suitableFor.length > 0 && (
                        <div className={styles.suitableFor}>
                          <h4>Suitable For:</h4>
                          <div className={styles.tags}>
                            {suitableFor.map((type, index) => (
                              <span key={index} className={styles.tag}>
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      <div className={styles.featuresList}>
                        <h4>Quick Features:</h4>
                        <div className={styles.features}>
                          {features.slice(0, 4).map((feature, index) => (
                            <div key={index} className={styles.featureItem}>
                              <span className={styles.featureIcon}>{feature.icon}</span>
                              <span className={styles.featureName}>{feature.name}</span>
                            </div>
                          ))}
                          {features.length > 4 && (
                            <div className={styles.featureMore}>
                              +{features.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className={styles.priceSection}>
                        <div className={styles.price}>
                          <span className={styles.amount}>${hall.price}</span>
                          <span className={styles.period}>/ event</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={styles.cardActions}>
                        <Link
                          to={`/halls/${hall.hall_id}`}
                          className={styles.viewDetailsBtn}
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/halls/${hall.hall_id}`}
                          className={styles.bookNowBtn}
                        >
                          Book Now
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

      {/* Why Choose Section */}
      <div className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <h2>Why Choose Our Event Halls?</h2>
          <p className={styles.subtitle}>Experience excellence in every detail</p>
          
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>✨</div>
              <h3>Elegant Design</h3>
              <p>Beautifully designed spaces with modern amenities and sophisticated décor</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3>Flexible Setup</h3>
              <p>Customizable layouts including theater, banquet, and classroom styles</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>👨‍💼</div>
              <h3>Professional Staff</h3>
              <p>Dedicated event coordinators to ensure your event runs smoothly</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🍴</div>
              <h3>Premium Catering</h3>
              <p>Gourmet catering options from our award-winning restaurant</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Book Your Event?</h2>
          <p>Contact our events team today to discuss your requirements</p>
          <div className={styles.ctaButtons}>
            <Link to="/contact" className={styles.ctaPrimary}>
              Contact Us
            </Link>
            <a href="tel:+1234567890" className={styles.ctaSecondary}>
              📞 Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Halls;
