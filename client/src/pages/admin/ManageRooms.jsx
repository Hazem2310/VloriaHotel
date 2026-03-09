import React, { useEffect, useState } from "react";
import { roomsAPI } from "../../Api/roomsApi";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ManageRooms.module.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const initialFormData = {
  room_number: "",
  room_type_id: "",
  floor: "",
  extra_bed_allowed: false,
  extra_bed_price: "",
  notes: "",
  status: "ACTIVE",
  image_url: "",
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formData, setFormData] = useState(initialFormData);
  const { t } = useLanguage();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [statusFilter]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsRes, typesRes] = await Promise.all([
        roomsAPI.getAll("?status=ALL"),
        roomsAPI.getTypes(),
      ]);

      if (roomsRes.data.success) {
        setRooms(roomsRes.data.rooms || []);
      }

      if (typesRes.data.success) {
        setRoomTypes(typesRes.data.room_types || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const query = statusFilter === "ALL" ? "?status=ALL" : `?status=${statusFilter}`;
      const response = await roomsAPI.getAll(query);

      if (response.data.success) {
        setRooms(response.data.rooms || []);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);

      setFormData({
        room_number: room.room_number || "",
        room_type_id: room.room_type_id || "",
        floor: room.floor ?? "",
        extra_bed_allowed: Boolean(room.extra_bed_allowed),
        extra_bed_price: room.extra_bed_price ?? "",
        notes: room.notes || "",
        status: room.status || "ACTIVE",
        image_url: room.images?.[0]?.image_url || "",
      });
    } else {
      setEditingRoom(null);
      setFormData(initialFormData);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        room_number: formData.room_number,
        room_type_id: Number(formData.room_type_id),
        floor: formData.floor === "" ? null : Number(formData.floor),
        extra_bed_allowed: formData.extra_bed_allowed,
        extra_bed_price:
          formData.extra_bed_price === "" ? 0 : Number(formData.extra_bed_price),
        notes: formData.notes || null,
        status: formData.status,
      };

      let roomId = editingRoom?.room_id;

      if (editingRoom) {
        await roomsAPI.update(editingRoom.room_id, payload);
      } else {
        const createRes = await roomsAPI.create(payload);
        roomId = createRes?.data?.room?.room_id;
      }

      // add image only if provided and room exists
      if (formData.image_url && roomId) {
        try {
await fetch(`${API_URL}/rooms/${roomId}/images`, {            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify({
              image_url: formData.image_url,
              sort_order: 0,
            }),
          });
        } catch (imgError) {
          console.error("Image save failed:", imgError);
        }
      }

      await fetchRooms();
      closeModal();
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.response?.data?.message || "Error saving room");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this room?"
    );

    if (!confirmed) return;

    try {
      await roomsAPI.delete(roomId);
      await fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      alert(error.response?.data?.message || "Error deleting room");
    }
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toLowerCase();
    return styles[normalized] || "";
  };

  const getMainImage = (room) => {
    if (Array.isArray(room.images) && room.images.length > 0) {
      return room.images[0]?.image_url;
    }
    return "";
  };

  if (loading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  return (
    <div className={styles.manageRooms}>
      <div className={styles.header}>
        <div>
          <h1>{t("manageRooms")}</h1>
          <p className={styles.subtitle}>Manage hotel rooms, status, and room details</p>
        </div>

        <div className={styles.headerActions}>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>

          <button onClick={() => openModal()} className={styles.addButton}>
            + {t("addRoom")}
          </button>
        </div>
      </div>

      <div className={styles.roomsGrid}>
        {rooms.map((room) => {
          const imageUrl = getMainImage(room);

          return (
            <div key={room.room_id} className={styles.roomCard}>
              <div className={styles.roomImage}>
                {imageUrl ? (
                  <img src={imageUrl} alt={`Room ${room.room_number}`} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>

              <div className={styles.roomInfo}>
                <div className={styles.topRow}>
                  <h3>Room {room.room_number}</h3>
                  <span className={`${styles.statusBadge} ${getStatusClass(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                <p className={styles.roomType}>{room.room_type_name}</p>

                <p className={styles.description}>
                  {room.room_type_description || room.notes || "No description available"}
                </p>

                <div className={styles.roomDetails}>
                  <span>Floor: {room.floor ?? "-"}</span>
                  <span>Base Price: ${Number(room.base_price || 0).toFixed(2)}</span>
                  <span>Capacity: {room.base_capacity} - {room.max_capacity}</span>
                </div>

                <div className={styles.roomDetails}>
                  <span>
                    Extra Bed: {room.extra_bed_allowed ? "Yes" : "No"}
                  </span>
                  <span>
                    Extra Bed Price: ${Number(room.extra_bed_price || 0).toFixed(2)}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() => openModal(room)}
                    className={styles.editBtn}
                  >
                    {t("edit")}
                  </button>

                  <button
                    onClick={() => handleDelete(room.room_id)}
                    className={styles.deleteBtn}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingRoom ? t("editRoom") : t("addRoom")}</h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Room Number</label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={(e) => handleChange("room_number", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Room Type</label>
                  <select
                    value={formData.room_type_id}
                    onChange={(e) => handleChange("room_type_id", e.target.value)}
                    required
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map((type) => (
                      <option key={type.room_type_id} value={type.room_type_id}>
                        {type.name} - ${Number(type.base_price || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Floor</label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Extra Bed Price</label>
                  <input
                    type="number"
                    value={formData.extra_bed_price}
                    onChange={(e) => handleChange("extra_bed_price", e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => handleChange("image_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.extra_bed_allowed}
                    onChange={(e) =>
                      handleChange("extra_bed_allowed", e.target.checked)
                    }
                  />
                  <span>Extra bed allowed</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows="4"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelBtn}
                >
                  {t("cancel")}
                </button>

                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? "Saving..." : t("save")}
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