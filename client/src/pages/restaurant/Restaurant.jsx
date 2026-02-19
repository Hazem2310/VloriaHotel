import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Restaurant.module.css";

const Restaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to make a reservation");
      navigate("/auth");
      return;
    }

    console.log("Reservation submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ date: "", time: "", guests: "2", specialRequests: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.restaurantPage}>
      <div className={styles.hero}>
        <h1>Fine Dining Experience</h1>
        <p>Indulge in exquisite cuisine prepared by world-class chefs</p>
      </div>

      <div className={styles.container}>
        {/* Restaurant Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.cardImage}>
              <img
                src="http://localhost:5000/uploads/resturante/res1.jpeg"
                alt="Veloria Grand Hotel Restaurant"
              />
            </div>
            <div className={styles.cardContent}>
              <h2>About Our Restaurant</h2>
              <p>
                Experience culinary excellence in an elegant atmosphere. Our Michelin-starred chef
                creates innovative dishes using the finest local and international ingredients.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.icon}>👨‍🍳</span>
                  <span>Michelin-Star Chef</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>🍷</span>
                  <span>Premium Wine Selection</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>🌟</span>
                  <span>Elegant Ambiance</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>🎵</span>
                  <span>Live Music</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.hours}>
            <h3>Opening Hours</h3>
            <div className={styles.hoursList}>
              <div className={styles.hourItem}>
                <span>Breakfast</span>
                <span>6:00 AM - 10:30 AM</span>
              </div>
              <div className={styles.hourItem}>
                <span>Lunch</span>
                <span>12:00 PM - 3:00 PM</span>
              </div>
              <div className={styles.hourItem}>
                <span>Dinner</span>
                <span>6:00 PM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Form */}
        <div className={styles.reservationSection}>
          <div className={styles.formCard}>
            <h2>Make a Reservation</h2>

            {submitted && (
              <div className={styles.successMessage}>
                ✓ Reservation request submitted! We'll confirm shortly.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Time</label>
                <select name="time" value={formData.time} onChange={handleChange} required>
                  <option value="">Select time</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Number of Guests</label>
                <select name="guests" value={formData.guests} onChange={handleChange} required>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7 Guests</option>
                  <option value="8">8 Guests</option>
                  <option value="more">More than 8</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Dietary restrictions, allergies, special occasions..."
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Reserve Table
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
