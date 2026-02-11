import React, { useEffect, useState } from "react";
import { servicesAPI } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./halls.module.css";

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await servicesAPI.getAll();
      if (response.data.success) {
        // Filter services that are halls/events
        const hallServices = response.data.services.filter(
          (service) =>
            service.name.toLowerCase().includes("hall") ||
            service.name.toLowerCase().includes("event") ||
            service.name.toLowerCase().includes("conference")
        );
        setHalls(hallServices);
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBooking = (hall) => {
    if (!user) {
      alert("Please login to request a booking");
      return;
    }
    setSelectedHall(hall);
    setShowModal(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    alert("Booking request submitted! Our team will contact you shortly.");
    setShowModal(false);
    setSelectedHall(null);
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.hallsPage}>
      <div className={styles.hero}>
        <h1>Event Halls & Conference Rooms</h1>
        <p>Perfect venues for weddings, conferences, and special events</p>
      </div>

      <div className={styles.container}>
        {halls.length === 0 ? (
          <div className={styles.noHalls}>
            <p>No event halls available at the moment</p>
          </div>
        ) : (
          <div className={styles.hallsGrid}>
            {halls.map((hall) => (
              <div key={hall.id} className={styles.hallCard}>
                <div className={styles.hallImage}>
                  <div className={styles.placeholder}>
                    <span className={styles.icon}>🏛️</span>
                  </div>
                </div>

                <div className={styles.hallInfo}>
                  <h2>{hall.name}</h2>
                  <p className={styles.description}>{hall.description}</p>

                  <div className={styles.features}>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>👥</span>
                      <span>Up to 200 guests</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>🎤</span>
                      <span>Sound System</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>🍽️</span>
                      <span>Catering Available</span>
                    </div>
                    <div className={styles.feature}>
                      <span className={styles.featureIcon}>💡</span>
                      <span>Professional Lighting</span>
                    </div>
                  </div>

                  <div className={styles.pricing}>
                    <span className={styles.price}>${hall.price}</span>
                    <span className={styles.period}>/ event</span>
                  </div>

                  <button
                    onClick={() => handleRequestBooking(hall)}
                    className={styles.bookBtn}
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.infoSection}>
          <h2>Why Choose Our Event Halls?</h2>
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>✨</div>
              <h3>Elegant Design</h3>
              <p>Beautifully designed spaces with modern amenities</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3>Flexible Setup</h3>
              <p>Customizable layouts for any type of event</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>👨‍💼</div>
              <h3>Professional Staff</h3>
              <p>Dedicated event coordinators to assist you</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🍴</div>
              <h3>Premium Catering</h3>
              <p>Gourmet catering options from our restaurant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Request Modal */}
      {showModal && selectedHall && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Request Booking for {selectedHall.name}</h2>
            <form onSubmit={handleSubmitRequest}>
              <div className={styles.formGroup}>
                <label>Event Type</label>
                <select required>
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="conference">Conference</option>
                  <option value="meeting">Business Meeting</option>
                  <option value="party">Private Party</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Event Date</label>
                <input type="date" required min={new Date().toISOString().split("T")[0]} />
              </div>
              <div className={styles.formGroup}>
                <label>Number of Guests</label>
                <input type="number" required min="1" max="200" />
              </div>
              <div className={styles.formGroup}>
                <label>Additional Requirements</label>
                <textarea rows="4" placeholder="Special requests, catering preferences, etc."></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Halls;
