import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { roomsAPI } from "../../Api/roomsApi";
import { bookingsAPI } from "../../Api/bookingsApi";
import { reportsAPI } from "../../Api/reportsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.get();
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>{t("adminDashboard")}</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <h3>{t("totalRevenue")}</h3>
            <p className={styles.statValue}>${reports?.totalRevenue || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statInfo}>
            <h3>{t("totalBookings")}</h3>
            <p className={styles.statValue}>{reports?.totalBookings || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{t("completedBookings")}</h3>
            <p className={styles.statValue}>{reports?.completedBookings || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💵</div>
          <div className={styles.statInfo}>
            <h3>{t("averagePrice")}</h3>
            <p className={styles.statValue}>${reports?.averageBookingPrice || 0}</p>
          </div>
        </div>
      </div>

      {reports?.mostBookedRoom && (
        <div className={styles.mostBooked}>
          <h3>{t("mostBookedRoom")}</h3>
          <div className={styles.roomInfo}>
            <p className={styles.roomTitle}>{reports.mostBookedRoom.title}</p>
            <p className={styles.roomBookings}>
              {reports.mostBookedRoom.total_bookings} bookings
            </p>
          </div>
        </div>
      )}

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/admin/rooms" className={styles.actionCard}>
            <span className={styles.actionIcon}>🏨</span>
            <span>{t("manageRooms")}</span>
          </Link>
          <Link to="/admin/services" className={styles.actionCard}>
            <span className={styles.actionIcon}>🛎️</span>
            <span>{t("manageServices")}</span>
          </Link>
          <Link to="/admin/bookings" className={styles.actionCard}>
            <span className={styles.actionIcon}>📋</span>
            <span>{t("manageBookings")}</span>
          </Link>
        </div>
      </div>

      {reports?.recentBookings && reports.recentBookings.length > 0 && (
        <div className={styles.recentBookings}>
          <h2>Recent Bookings</h2>
          <div className={styles.bookingsTable}>
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {reports.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.user_name}</td>
                    <td>{booking.room_title}</td>
                    <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                    <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.status} ${styles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>${booking.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
