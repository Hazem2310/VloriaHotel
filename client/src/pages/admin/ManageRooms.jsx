import React, { useEffect, useState } from "react";
import { roomsAPI } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ManageRooms.module.css";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    capacity: "",
    image: "",
    is_available: true,
  });
  const { t } = useLanguage();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomsAPI.update(editingRoom.id, formData);
      } else {
        await roomsAPI.create(formData);
      }
      fetchRooms();
      closeModal();
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.response?.data?.message || "Error saving room");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await roomsAPI.delete(id);
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        alert(error.response?.data?.message || "Error deleting room");
      }
    }
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        title: room.title,
        description: room.description,
        price: room.price,
        capacity: room.capacity,
        image: room.image || "",
        is_available: room.is_available,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        capacity: "",
        image: "",
        is_available: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.manageRooms}>
      <div className={styles.header}>
        <h1>{t("manageRooms")}</h1>
        <button onClick={() => openModal()} className={styles.addButton}>
          + {t("addRoom")}
        </button>
      </div>

      <div className={styles.roomsGrid}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImage}>
              {room.image ? (
                <img src={room.image} alt={room.title} />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
            <div className={styles.roomInfo}>
              <h3>{room.title}</h3>
              <p className={styles.description}>{room.description}</p>
              <div className={styles.roomDetails}>
                <span>${room.price}/night</span>
                <span>{room.capacity} guests</span>
                <span className={room.is_available ? styles.available : styles.unavailable}>
                  {room.is_available ? t("available") : t("notAvailable")}
                </span>
              </div>
              <div className={styles.actions}>
                <button onClick={() => openModal(room)} className={styles.editBtn}>
                  {t("edit")}
                </button>
                <button onClick={() => handleDelete(room.id)} className={styles.deleteBtn}>
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingRoom ? t("editRoom") : t("addRoom")}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price per Night ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <span>Available for booking</span>
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                  {t("cancel")}
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
