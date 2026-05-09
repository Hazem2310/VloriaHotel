import React from "react";
import styles from "./employee.module.css";

const MyTasks = () => {
  const tasks = [
    { id: 1, task: "Clean Room 205", status: "pending", priority: "high", time: "10:30 AM" },
    { id: 2, task: "Bring towels to Room 112", status: "pending", priority: "medium", time: "11:00 AM" },
    { id: 3, task: "Assist reception with check-in", status: "completed", priority: "normal", time: "09:00 AM" },
    { id: 4, task: "Restock minibar Room 301", status: "completed", priority: "normal", time: "08:30 AM" },
    { id: 5, task: "Prepare conference room", status: "pending", priority: "high", time: "02:00 PM" },
  ];

  return (
    <div className={styles.employeeContainer}>
      <div className={styles.header}>
        <h1>My Tasks</h1>
        <p>Tasks assigned to you</p>
      </div>

      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`${styles.taskCard} ${
              task.status === "completed" ? styles.taskCompleted : ""
            }`}
          >
            <div className={styles.taskHeader}>
              <h3>{task.task}</h3>
              <span
                className={`${styles.priorityBadge} ${
                  task.priority === "high"
                    ? styles.priorityHigh
                    : task.priority === "medium"
                    ? styles.priorityMedium
                    : styles.priorityNormal
                }`}
              >
                {task.priority}
              </span>
            </div>
            <div className={styles.taskFooter}>
              <span className={styles.taskTime}>{task.time}</span>
              <span
                className={`${styles.statusBadge} ${
                  task.status === "completed"
                    ? styles.statusCompleted
                    : styles.statusPending
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
