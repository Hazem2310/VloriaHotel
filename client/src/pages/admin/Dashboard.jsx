import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportsAPI } from "../../Api/reportsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Dashboard.module.css";
import { employeeSchedulesAPI } from "../../Api/employeeSchedulesApi";

const Dashboard = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState("");

  const [formData, setFormData] = useState({
    employee_id: "",
    work_date: "",
    start_time: "",
    end_time: "",
  });

  const { t } = useLanguage();

  useEffect(() => {
    fetchReports();
    fetchScheduleData();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
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

  const fetchScheduleData = async () => {
    try {
      setScheduleLoading(true);

      const [employeesRes, schedulesRes] = await Promise.all([
        employeeSchedulesAPI.getEmployees(),
        employeeSchedulesAPI.getAll(),
      ]);

      if (employeesRes.data.success) {
        setEmployees(employeesRes.data.employees || []);
      }

      if (schedulesRes.data.success) {
        setSchedules(schedulesRes.data.schedules || []);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleScheduleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setScheduleMessage("");
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (
      !formData.employee_id ||
      !formData.work_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setScheduleMessage("Please fill all work arrangement fields.");
      return;
    }

    try {
      setScheduleLoading(true);

      const res = await employeeSchedulesAPI.create({
        employee_id: Number(formData.employee_id),
        work_date: formData.work_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      if (res.data.success) {
        setScheduleMessage("Work arrangement added successfully.");
        setFormData({
          employee_id: "",
          work_date: "",
          start_time: "",
          end_time: "",
        });

        await fetchScheduleData();
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      setScheduleMessage(
        error.response?.data?.message || "Failed to add work arrangement."
      );
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    const confirmed = window.confirm("Delete this work arrangement?");
    if (!confirmed) return;

    try {
      setScheduleLoading(true);
      await employeeSchedulesAPI.delete(id);
      await fetchScheduleData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    } finally {
      setScheduleLoading(false);
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
      return `Room ${booking.room_number || "-"}${
        booking.room_type_name ? ` • ${booking.room_type_name}` : ""
      }`;
    }

    if (booking.booking_type === "HALL") {
      return booking.hall_name ? `Hall • ${booking.hall_name}` : "Hall Booking";
    }

    if (booking.booking_type === "RESTAURANT") {
      return booking.restaurant_name
        ? `Restaurant • ${booking.restaurant_name}`
        : "Restaurant Booking";
    }

    return booking.booking_type;
  };

  const getBookingDate = (booking) => {
    if (booking.booking_type === "ROOM") {
      return `${formatDate(booking.start_date)} → ${formatDate(
        booking.end_date
      )}`;
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
          <h1>{t("adminDashboard")}</h1>
          <p className={styles.subtitle}>Welcome to Veloria management overview</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <h3>{t("totalRevenue")}</h3>
            <p className={styles.statValue}>
              {formatCurrency(reports?.totalRevenue)}
            </p>
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
            <h3>Checked Out</h3>
            <p className={styles.statValue}>{reports?.completedBookings || 0}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💵</div>
          <div className={styles.statInfo}>
            <h3>{t("averagePrice")}</h3>
            <p className={styles.statValue}>
              {formatCurrency(reports?.averageBookingPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.middleGrid}>
        <div className={styles.panelCard}>
          <h2>Most Booked Room</h2>
          {reports?.mostBookedRoom ? (
            <div className={styles.roomInfo}>
              <p className={styles.roomTitle}>
                Room {reports.mostBookedRoom.room_number}
              </p>
              <p>{reports.mostBookedRoom.room_type_name}</p>
              <p className={styles.roomBookings}>
                {reports.mostBookedRoom.total_bookings} bookings
              </p>
            </div>
          ) : (
            <p>No room bookings yet</p>
          )}
        </div>

        <div className={styles.panelCard}>
          <h2>Room Status</h2>
          <div className={styles.miniStats}>
            <div className={styles.miniStat}>
              <span>Total Rooms</span>
              <strong>{reports?.roomStats?.total_rooms || 0}</strong>
            </div>
            <div className={styles.miniStat}>
              <span>Active</span>
              <strong>{reports?.roomStats?.active_rooms || 0}</strong>
            </div>
            <div className={styles.miniStat}>
              <span>Maintenance</span>
              <strong>{reports?.roomStats?.maintenance_rooms || 0}</strong>
            </div>
            <div className={styles.miniStat}>
              <span>Out of Service</span>
              <strong>{reports?.roomStats?.out_of_service_rooms || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/admin/manage-rooms" className={styles.actionCard}>
            <span className={styles.actionIcon}>🏨</span>
            <span>Manage Rooms</span>
          </Link>

          <Link to="/admin/manage-bookings" className={styles.actionCard}>
            <span className={styles.actionIcon}>📋</span>
            <span>Manage Bookings</span>
          </Link>

          <Link to="/admin/manage-rooms" className={styles.actionCard}>
            <span className={styles.actionIcon}>🛠️</span>
            <span>Room Availability</span>
          </Link>
        </div>
      </div>

      <div className={styles.panelCard}>
        <h2>Work Arrangement</h2>
        <p className={styles.subtitle}>
          Assign employee work date and shift hours.
        </p>

        <form
          onSubmit={handleCreateSchedule}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleScheduleChange}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.first_name} {emp.last_name} — {emp.job_title || emp.department}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="work_date"
            value={formData.work_date}
            onChange={handleScheduleChange}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />

          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleScheduleChange}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />

          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleScheduleChange}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />

          <button
            type="submit"
            disabled={scheduleLoading}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "#173b85",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {scheduleLoading ? "Saving..." : "Add Arrangement"}
          </button>
        </form>

        {scheduleMessage && (
          <p style={{ color: "#173b85", fontWeight: "700" }}>
            {scheduleMessage}
          </p>
        )}

        {schedules.length > 0 ? (
          <div className={styles.bookingsTable}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((s) => (
                  <tr key={s.schedule_id}>
                    <td>
                      {s.first_name} {s.last_name}
                    </td>
                    <td>{s.department || "-"}</td>
                    <td>{s.job_title || "-"}</td>
                    <td>{formatDate(s.work_date)}</td>
                    <td>{s.start_time}</td>
                    <td>{s.end_time}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteSchedule(s.schedule_id)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "10px",
                          border: "none",
                          background: "#b91c1c",
                          color: "white",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No work arrangements yet.</p>
        )}
      </div>

      <div className={styles.panelCard}>
        <h2>Booking Status Breakdown</h2>
        {reports?.statusBreakdown?.length > 0 ? (
          <div className={styles.statusList}>
            {reports.statusBreakdown.map((item) => (
              <div key={item.status} className={styles.statusItem}>
                <span>{item.status}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>No booking data available</p>
        )}
      </div>

      <div className={styles.panelCard}>
        <h2>Recent Bookings</h2>

        {reports?.recentBookings?.length > 0 ? (
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
                {reports.recentBookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>#{booking.booking_id}</td>
                    <td>
                      {booking.first_name} {booking.last_name}
                    </td>
                    <td>{booking.booking_type}</td>
                    <td>{getBookingTitle(booking)}</td>
                    <td>{getBookingDate(booking)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[booking.status] || ""
                        }`}
                      >
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
          <p>No recent bookings found</p>
        )}
      </div>

      <div className={styles.panelCard}>
        <h2>Monthly Revenue</h2>

        {reports?.monthlyRevenue?.length > 0 ? (
          <div className={styles.statusList}>
            {reports.monthlyRevenue.map((item) => (
              <div key={item.month} className={styles.statusItem}>
                <span>{item.month}</span>
                <strong>{formatCurrency(item.revenue)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>No revenue data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;