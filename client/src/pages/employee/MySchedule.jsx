import React from "react";
import styles from "./employee.module.css";

const MySchedule = () => {
  const schedule = [
    { day: "Monday", shift: "08:00 - 16:00", status: "scheduled", department: "Front Desk" },
    { day: "Tuesday", shift: "OFF", status: "off", department: "-" },
    { day: "Wednesday", shift: "16:00 - 00:00", status: "scheduled", department: "Front Desk" },
    { day: "Thursday", shift: "08:00 - 16:00", status: "scheduled", department: "Front Desk" },
    { day: "Friday", shift: "08:00 - 16:00", status: "scheduled", department: "Front Desk" },
    { day: "Saturday", shift: "OFF", status: "off", department: "-" },
    { day: "Sunday", shift: "16:00 - 00:00", status: "scheduled", department: "Front Desk" },
  ];

  return (
    <div className={styles.employeeContainer}>
      <div className={styles.header}>
        <h1>My Schedule</h1>
        <p>Weekly work shifts</p>
      </div>

      <div className={styles.scheduleGrid}>
        {schedule.map((item, index) => (
          <div
            key={index}
            className={`${styles.scheduleCard} ${
              item.status === "off" ? styles.scheduleOff : ""
            }`}
          >
            <h3>{item.day}</h3>
            <div className={styles.scheduleTime}>{item.shift}</div>
            <div className={styles.scheduleDepartment}>{item.department}</div>
            <span
              className={`${styles.statusBadge} ${
                item.status === "off"
                  ? styles.statusOff
                  : styles.statusScheduled
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySchedule;
