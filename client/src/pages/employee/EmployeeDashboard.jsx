import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import styles from "./employee.module.css";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]);

  // GET EMPLOYEE INFO
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/employee/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setEmployeeData(res.data.employee);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // GET TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTasks(res.data.tasks);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={styles.employeeContainer}>
      <div className={styles.header}>
        <h1>Employee Dashboard</h1>

        <p>
          Welcome back, {employeeData?.first_name} {employeeData?.last_name}
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Today's Tasks</h3>
          <div className={styles.statNumber}>{tasks.length}</div>
          <p>Task list updated</p>
        </div>

        <div className={styles.statCard}>
          <h3>Current Shift</h3>
          <div className={styles.statNumber}>08:00 - 16:00</div>
          <p>{employeeData?.job_title}</p>
        </div>

        <div className={styles.statCard}>
          <h3>Status</h3>
          <div className={`${styles.statusBadge} ${styles.statusActive}`}>
            Active
          </div>
          <p>Ready for tasks</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>My Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          tasks.map((task) => (
            <div key={task.task_id} className={styles.notification}>
              <p>{task.title}</p>
              <span>{task.status}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.section}>
        <h2>Recent Notifications</h2>
        <div className={styles.notifications}>
          <div className={styles.notification}>
            <span className={styles.notificationTime}>10:30 AM</span>
            <p>New task assigned: Clean Room 205</p>
          </div>

          <div className={styles.notification}>
            <span className={styles.notificationTime}>09:15 AM</span>
            <p>Guest request: Extra towels Room 112</p>
          </div>

          <div className={styles.notification}>
            <span className={styles.notificationTime}>08:00 AM</span>
            <p>Shift started - Front Desk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;