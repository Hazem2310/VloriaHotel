import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Rooms API
export const roomsAPI = {
  getAll: () => api.get("/rooms"),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post("/rooms", data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get("/services"),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post("/bookings", data),
  getMy: () => api.get("/bookings/my"),
  getAll: () => api.get("/bookings"),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// Reports API
export const reportsAPI = {
  get: () => api.get("/reports"),
};

// AI Chat API
export const aiAPI = {
  chat: (message, conversationHistory) => api.post("/ai/chat", { message, conversationHistory }),
};

export default api;
