import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./manager.module.css";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    employeesCount: 0,
    tasksCount: 0,
    pendingRequests: 0,
    completedTasks: 0,
  });

  // 🔹 Fetch Manager Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const [empRes, taskRes, reqRes] = await Promise.all([
          axios.get("/api/manager/employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/manager/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/manager/requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const empData = empRes.data.employees || [];
        const taskData = taskRes.data.tasks || [];
        const reqData = reqRes.data.requests || [];

        setEmployees(empData.slice(0, 6)); // Show top 6 employees
        setTasks(taskData.slice(0, 8)); // Show top 8 tasks
        setRequests(reqData.slice(0, 8)); // Show top 8 requests

        setStats({
          employeesCount: empData.length,
          tasksCount: taskData.length,
          pendingRequests: reqData.filter((r) => r.status === "PENDING").length,
          completedTasks: taskData.filter((t) => t.status === "COMPLETED")
            .length,
        });
      } catch (err) {
        console.log("Manager dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 🟢 HEADER SECTION */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Manager Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back,{" "}
            <strong>
              {user?.first_name} {user?.last_name}
            </strong>
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/manager/employees" className={styles.btn}>
            Manage Employees
          </Link>
          <Link to="/manager/requests" className={styles.btn}>
            Review Requests
          </Link>
        </div>
      </div>

      {/* 📊 STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.cardBlue}`}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Active Employees</h3>
            <div className={styles.statNumber}>{stats.employeesCount}</div>
            <p className={styles.statLabel}>Under your management</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.cardGreen}`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Completed Tasks</h3>
            <div className={styles.statNumber}>{stats.completedTasks}</div>
            <p className={styles.statLabel}>This month</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.cardOrange}`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Total Tasks</h3>
            <div className={styles.statNumber}>{stats.tasksCount}</div>
            <p className={styles.statLabel}>Assigned tasks</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.cardRed}`}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <h3>Pending Requests</h3>
            <div className={styles.statNumber}>{stats.pendingRequests}</div>
            <p className={styles.statLabel}>Need your action</p>
          </div>
        </div>
      </div>

      {/* 👥 EMPLOYEES SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Team</h2>
          <Link to="/manager/employees" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>

        {employees.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No employees found</p>
          </div>
        ) : (
          <div className={styles.employeeGrid}>
            {employees.map((emp) => (
              <div key={emp.employee_id} className={styles.employeeCard}>
                <div className={styles.employeeHeader}>
                  <div className={styles.employeeAvatar}>
                    {emp.first_name?.charAt(0)}
                    {emp.last_name?.charAt(0)}
                  </div>
                  <div className={styles.employeeInfo}>
                    <h4 className={styles.employeeName}>
                      {emp.first_name} {emp.last_name}
                    </h4>
                    <p className={styles.employeeTitle}>{emp.job_title}</p>
                  </div>
                </div>
                <div className={styles.employeeDetails}>
                  <p>
                    <span>Department:</span> {emp.department}
                  </p>
                  <p>
                    <span>Salary:</span> ${emp.salary?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📌 TASKS SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Active Tasks</h2>
          <Link to="/manager/tasks" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tasks assigned</p>
          </div>
        ) : (
          <div className={styles.tasksList}>
            {tasks.map((task) => (
              <div key={task.task_id} className={styles.taskItem}>
                <div className={styles.taskContent}>
                  <h4 className={styles.taskTitle}>{task.title}</h4>
                  <p className={styles.taskDescription}>{task.description}</p>
                  <div className={styles.taskMeta}>
                    <span className={styles.taskAssignee}>
                      👤 {task.assigned_to_name || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div className={styles.taskFooter}>
                  <span
                    className={`${styles.taskStatus} ${styles[`status_${task.status?.toLowerCase()}`]}`}
                  >
                    {task.status || "PENDING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📩 REQUESTS SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Employee Requests</h2>
          <Link to="/manager/requests" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No pending requests</p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {requests.map((req) => (
              <div key={req.request_id} className={styles.requestItem}>
                <div className={styles.requestContent}>
                  <h4 className={styles.requestType}>
                    {req.type === "LEAVE"
                      ? "🏖️"
                      : req.type === "SHIFT_CHANGE"
                        ? "🔄"
                        : "📝"}{" "}
                    {req.type}
                  </h4>
                  <p className={styles.requestReason}>{req.reason}</p>
                  <p className={styles.requestDate}>
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`${styles.requestStatus} ${styles[`req_${req.status?.toLowerCase()}`]}`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
