import React, { useEffect, useState } from "react";
import { reportsAPI } from "../../Api/reportsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Dashboard.module.css";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportsAPI.get();
      if (response.data.success && response.data.reports?.recentBookings) {
        setBookings(response.data.reports.recentBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 403) {
        setError("Access Denied: You need admin privileges to view this page.");
      } else if (error.response?.status === 401) {
        setError("Unauthorized: Please log in again.");
      } else {
        setError(error.response?.data?.message || "Failed to load bookings.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toFixed(2)}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  };

  const getBookingTitle = (booking) => {
    if (booking.booking_type === "ROOM") {
      return `Room ${booking.room_number || "-"}${booking.room_type_name ? ` - ${booking.room_type_name}` : ""}`;
    }
    if (booking.booking_type === "HALL") {
      return booking.hall_name ? `Hall - ${booking.hall_name}` : "Hall Booking";
    }
    if (booking.booking_type === "RESTAURANT") {
      return booking.restaurant_name ? `Restaurant - ${booking.restaurant_name}` : "Restaurant Booking";
    }
    return booking.booking_type;
  };

  const getBookingDate = (booking) => {
    if (booking.booking_type === "ROOM") {
      return `${formatDate(booking.start_date)} to ${formatDate(booking.end_date)}`;
    }
    if (booking.booking_type === "HALL") {
      return booking.event_date ? formatDate(booking.event_date) : "-";
    }
    if (booking.booking_type === "RESTAURANT") {
      return booking.reservation_datetime
        ? new Date(booking.reservation_datetime).toLocaleString()
        : "-";
    }
    return "-";
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <div>
          <h1>Manage Bookings</h1>
          <p className={styles.subtitle}>All hotel bookings overview</p>
        </div>
      </div>

      <div className={styles.panelCard}>
        <h2>All Bookings</h2>
        {bookings.length > 0 ? (
          <div className={styles.bookingsTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>#{booking.booking_id}</td>
                    <td>{booking.first_name} {booking.last_name}</td>
                    <td>{booking.booking_type}</td>
                    <td>{getBookingTitle(booking)}</td>
                    <td>{getBookingDate(booking)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[booking.status] || ""}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>{formatCurrency(booking.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
