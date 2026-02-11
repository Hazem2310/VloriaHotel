import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomsAPI, bookingsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./RoomDetails.module.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await roomsAPI.getById(id);
      if (response.data.success) {
        setRoom(response.data.room);
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * room.price : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to make a booking");
      navigate("/auth");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out date must be after check-in date");
      return;
    }

    setBooking(true);
    try {
      const response = await bookingsAPI.create({
        roomId: room.id,
        checkIn,
        checkOut,
      });

      if (response.data.success) {
        alert(t("bookingSuccess"));
        navigate("/my-bookings");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.response?.data?.message || t("bookingError"));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  if (!room) {
    return <div className={styles.error}>Room not found</div>;
  }

  const totalPrice = calculateTotal();

  return (
    <div className={styles.roomDetails}>
      <div className={styles.imageSection}>
        {room.image ? (
          <img src={room.image} alt={room.title} />
        ) : (
          <div className={styles.noImage}>No Image Available</div>
        )}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.roomInfo}>
          <h1>{room.title}</h1>
          <div className={styles.roomMeta}>
            <span className={styles.price}>${room.price} / {t("pricePerNight")}</span>
            <span className={styles.capacity}>{room.capacity} {t("capacity")}</span>
            <span className={room.is_available ? styles.available : styles.unavailable}>
              {room.is_available ? t("available") : t("notAvailable")}
            </span>
          </div>
          <p className={styles.description}>{room.description}</p>
        </div>

        {room.is_available && (
          <div className={styles.bookingForm}>
            <h2>{t("bookRoom")}</h2>
            <form onSubmit={handleBooking}>
              <div className={styles.formGroup}>
                <label>{t("checkIn")}</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t("checkOut")}</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              {totalPrice > 0 && (
                <div className={styles.totalPrice}>
                  <span>{t("totalPrice")}:</span>
                  <span className={styles.amount}>${totalPrice}</span>
                </div>
              )}
              <button type="submit" disabled={booking || !totalPrice} className={styles.bookBtn}>
                {booking ? t("loading") : t("bookNow")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
