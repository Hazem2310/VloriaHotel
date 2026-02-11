import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./booking.module.css";

const Booking = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useLanguage();

  const bookingTypes = [
    {
      id: "rooms",
      title: "Rooms Booking",
      description: "Experience luxury and comfort in our premium rooms and suites. Perfect for relaxation and rejuvenation.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      link: "/rooms",
      icon: "🛏️",
    },
    {
      id: "halls",
      title: "Halls Booking",
      description: "Host your special events in our elegant halls. Ideal for weddings, conferences, and celebrations.",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800",
      link: "/halls",
      icon: "🏛️",
    },
    {
      id: "restaurant",
      title: "Restaurant Reservation",
      description: "Indulge in fine dining with gourmet cuisine prepared by world-class chefs in an elegant atmosphere.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      link: "/restaurant",
      icon: "🍽️",
    },
  ];

  const filteredBookings =
    activeFilter === "all"
      ? bookingTypes
      : bookingTypes.filter((booking) => booking.id === activeFilter);

  return (
    <div className={styles.bookingPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Book Your Experience at Veloria</h1>
        <p>
          Choose your desired experience — whether it's a relaxing room stay, a grand hall event,
          or a fine dining reservation.
        </p>
      </div>

      <div className={styles.container}>
        {/* Filter Buttons */}
        <div className={styles.filters}>
          <button
            onClick={() => setActiveFilter("all")}
            className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("rooms")}
            className={`${styles.filterBtn} ${activeFilter === "rooms" ? styles.active : ""}`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveFilter("halls")}
            className={`${styles.filterBtn} ${activeFilter === "halls" ? styles.active : ""}`}
          >
            Halls
          </button>
          <button
            onClick={() => setActiveFilter("restaurant")}
            className={`${styles.filterBtn} ${activeFilter === "restaurant" ? styles.active : ""}`}
          >
            Restaurant
          </button>
        </div>

        {/* Booking Cards */}
        <div className={styles.bookingGrid}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.cardImage}>
                <img src={booking.image} alt={booking.title} />
                <div className={styles.cardOverlay}>
                  <span className={styles.cardIcon}>{booking.icon}</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h2>{booking.title}</h2>
                <p>{booking.description}</p>
                <Link to={booking.link} className={styles.bookButton}>
                  {booking.id === "rooms" && "Book a Room"}
                  {booking.id === "halls" && "Book a Hall"}
                  {booking.id === "restaurant" && "Reserve a Table"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;
