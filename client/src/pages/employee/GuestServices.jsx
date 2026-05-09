import React, { useState } from "react";
import styles from "./employee.module.css";

const GuestServices = () => {
  const [activeTab, setActiveTab] = useState("checkin");

  const rooms = [
    { room: "101", guest: "John Smith", status: "occupied" },
    { room: "102", guest: null, status: "available" },
    { room: "103", guest: "Sarah Johnson", status: "occupied" },
    { room: "104", guest: null, status: "cleaning" },
    { room: "105", guest: "Mike Brown", status: "occupied" },
  ];

  return (
    <div className={styles.employeeContainer}>
      <div className={styles.header}>
        <h1>Guest Services</h1>
        <p>Check-in / Check-out / Room Status</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "checkin" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("checkin")}
        >
          Check-in
        </button>
        <button
          className={`${styles.tab} ${activeTab === "checkout" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("checkout")}
        >
          Check-out
        </button>
        <button
          className={`${styles.tab} ${activeTab === "rooms" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          Room Status
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "checkin" && (
          <div className={styles.serviceSection}>
            <h2>Guest Check-in</h2>
            <form className={styles.serviceForm}>
              <input type="text" placeholder="Guest Name" className={styles.input} />
              <input type="text" placeholder="Room Number" className={styles.input} />
              <input type="date" placeholder="Check-in Date" className={styles.input} />
              <button type="submit" className={styles.actionBtn}>Check-in Guest</button>
            </form>
          </div>
        )}

        {activeTab === "checkout" && (
          <div className={styles.serviceSection}>
            <h2>Guest Check-out</h2>
            <form className={styles.serviceForm}>
              <input type="text" placeholder="Room Number" className={styles.input} />
              <button type="submit" className={styles.actionBtn}>Check-out Guest</button>
            </form>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className={styles.serviceSection}>
            <h2>Room Status</h2>
            <div className={styles.roomsList}>
              {rooms.map((room) => (
                <div key={room.room} className={styles.roomCard}>
                  <div className={styles.roomNumber}>Room {room.room}</div>
                  <div className={styles.roomGuest}>{room.guest || "Vacant"}</div>
                  <span
                    className={`${styles.statusBadge} ${
                      room.status === "available"
                        ? styles.statusAvailable
                        : room.status === "occupied"
                        ? styles.statusOccupied
                        : styles.statusCleaning
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestServices;
