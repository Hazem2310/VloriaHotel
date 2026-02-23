import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hallsAPI } from "../../Api/hallsApi";
import styles from "./HallDetails.module.css";

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHallDetails();
  }, [id]);

  const fetchHallDetails = async () => {
    try {
      const data = await hallsAPI.getById(id);
      if (data.success && data.hall) {
        setHall(data.hall);
      } else {
        setError("Hall not found");
      }
    } catch (error) {
      console.error("Error fetching hall details:", error);
      setError("Failed to load hall details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading hall details...</div>;
  }

  if (error || !hall) {
    return (
      <div className={styles.error}>
        <h2>Hall not found</h2>
        <button onClick={() => navigate("/halls")} className={styles.backBtn}>
          Back to Halls
        </button>
      </div>
    );
  }

  return (
    <div className={styles.hallDetailsPage}>
      <div className={styles.backSection}>
        <button onClick={() => navigate("/halls")} className={styles.backBtn}>
          ← Back to Halls
        </button>
      </div>

      <div className={styles.container}>
        <h1>{hall.hall_name}</h1>
        <p>Hall details component - to be implemented</p>
      </div>
    </div>
  );
};

export default HallDetails;
