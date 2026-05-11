import React, { useEffect, useState } from "react";
import { employeeSchedulesAPI } from "../../Api/employeeSchedulesApi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const EmployeeDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const scheduleRes = await employeeSchedulesAPI.getMine();
      if (scheduleRes.data.success) {
        setSchedules(scheduleRes.data.schedules || []);
      }

      const attendanceRes = await fetch(`${API_URL}/employee-attendance/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const attendanceData = await attendanceRes.json();

      if (attendanceData.success) {
        setAttendance(attendanceData.today);
        setMonthlyHours(attendanceData.monthlyHours || 0);
      }
    } catch (error) {
      console.error("Employee dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async () => {
    await fetch(`${API_URL}/employee-attendance/clock-in`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    fetchAll();
  };

  const clockOut = async () => {
    await fetch(`${API_URL}/employee-attendance/clock-out`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    fetchAll();
  };

  const isClockedIn = attendance?.clock_in && !attendance?.clock_out;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px",
        background:
          "radial-gradient(circle at top left, #fff7e8, #f4f4f5 45%, #e8edf5)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(20px)",
          borderRadius: "36px",
          padding: "45px",
          boxShadow: "0 35px 90px rgba(15,23,42,0.16)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        <h1
          style={{
            fontSize: "54px",
            margin: 0,
            color: "#111827",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Employee Dashboard
        </h1>

        <p style={{ color: "#6b7280", fontSize: "18px", marginBottom: "35px" }}>
          Welcome back — ready for a productive day ✨
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              padding: "28px",
              borderRadius: "26px",
              background: "linear-gradient(135deg, #111827, #1f2937)",
              color: "white",
              boxShadow: "0 20px 45px rgba(17,24,39,0.25)",
            }}
          >
            <h3>This Month Hours</h3>
            <h2 style={{ fontSize: "44px", margin: 0 }}>{monthlyHours}</h2>
            <p>Total worked hours</p>
          </div>

          <div
            style={{
              padding: "28px",
              borderRadius: "26px",
              background: "linear-gradient(135deg, #c8a97e, #ead8c0)",
              color: "#111827",
              boxShadow: "0 20px 45px rgba(200,169,126,0.35)",
            }}
          >
            <h3>Today Status</h3>
            <h2 style={{ margin: 0 }}>
              {isClockedIn ? "Working Now 🟢" : "Not Working ⚪"}
            </h2>
            <p>
              In: {attendance?.clock_in ? new Date(attendance.clock_in).toLocaleTimeString() : "-"}
            </p>
            <p>
              Out: {attendance?.clock_out ? new Date(attendance.clock_out).toLocaleTimeString() : "-"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "18px", marginBottom: "45px" }}>
          <button
            onClick={clockIn}
            disabled={isClockedIn}
            style={{
              flex: 1,
              padding: "22px",
              borderRadius: "22px",
              border: "none",
              background: isClockedIn ? "#9ca3af" : "#16a34a",
              color: "white",
              fontSize: "20px",
              fontWeight: "800",
              cursor: isClockedIn ? "not-allowed" : "pointer",
              boxShadow: "0 18px 35px rgba(22,163,74,0.25)",
            }}
          >
            Clock In 🚀
          </button>

          <button
            onClick={clockOut}
            disabled={!isClockedIn}
            style={{
              flex: 1,
              padding: "22px",
              borderRadius: "22px",
              border: "none",
              background: !isClockedIn ? "#9ca3af" : "#dc2626",
              color: "white",
              fontSize: "20px",
              fontWeight: "800",
              cursor: !isClockedIn ? "not-allowed" : "pointer",
              boxShadow: "0 18px 35px rgba(220,38,38,0.25)",
            }}
          >
            Clock Out 🌙
          </button>
        </div>

        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Playfair Display, serif",
            marginBottom: "20px",
          }}
        >
          My Work Arrangement
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : schedules.length === 0 ? (
          <p>No work arrangement yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "18px" }}>
            {schedules.map((item) => (
              <div
                key={item.schedule_id}
                style={{
                  padding: "26px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                  border: "1px solid #ead8c0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 18px 35px rgba(200,169,126,0.15)",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {new Date(item.work_date).toLocaleDateString()}
                </h3>
                <p style={{ fontSize: "20px", margin: 0 }}>
                  {item.start_time} → {item.end_time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;