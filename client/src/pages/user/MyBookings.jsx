import React, { useEffect, useState } from "react";
import { bookingsAPI } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMy();
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingsAPI.cancel(id);
        fetchBookings();
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.myBookings}>
      <h1>{t("myBookingsTitle")}</h1>

      {bookings.length === 0 ? (
        <div className={styles.noBookings}>
          <p>{t("noBookings")}</p>
        </div>
      ) : (
        <div className={styles.bookingsGrid}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingImage}>
                {booking.room_image ? (
                  <img src={booking.room_image} alt={booking.room_title} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.bookingInfo}>
                <h3>{booking.room_title}</h3>
                <div className={styles.dates}>
                  <div>
                    <span className={styles.label}>{t("checkIn")}:</span>
                    <span>{new Date(booking.check_in).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{t("checkOut")}:</span>
                    <span>{new Date(booking.check_out).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={styles.details}>
                  <span className={styles.price}>${booking.total_price}</span>
                  <span className={`${styles.status} ${styles[booking.status]}`}>
                    {t(booking.status)}
                  </span>
                </div>
                {booking.status === "pending" && (
                  <button onClick={() => handleCancel(booking.id)} className={styles.cancelBtn}>
                    {t("cancelBooking")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
