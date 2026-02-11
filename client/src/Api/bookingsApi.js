import api from "./api";

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post("/bookings", data),
  getMy: () => api.get("/bookings/my"),
  getAll: () => api.get("/bookings"),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};
