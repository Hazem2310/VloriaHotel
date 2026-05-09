import React from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./employee.module.css";

const EmployeeProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.employeeContainer}>
      <div className={styles.header}>
        <h1>My Profile</h1>
        <p>Your account information</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {user?.first_name?.charAt(0) || "E"}
          </div>
          <div className={styles.profileInfo}>
            <h2>{user?.first_name} {user?.last_name}</h2>
            <p>{user?.email}</p>
            <span className={styles.roleBadge}>{user?.role || "Employee"}</span>
          </div>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailRow}>
            <label>Department:</label>
            <span>Front Desk</span>
          </div>
          <div className={styles.detailRow}>
            <label>Phone:</label>
            <span>{user?.phone || "Not set"}</span>
          </div>
          <div className={styles.detailRow}>
            <label>Status:</label>
            <span className={styles.statusActive}>Active</span>
          </div>
          <div className={styles.detailRow}>
            <label>Member Since:</label>
            <span>2024</span>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button className={styles.actionBtn}>Edit Profile</button>
          <button className={styles.actionBtnSecondary}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
