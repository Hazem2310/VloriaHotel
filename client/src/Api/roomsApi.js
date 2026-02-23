import { get, post, put, del } from "./apiClient";

// Rooms API
export const roomsAPI = {
  getAll: () => get("/rooms"),
  getById: (id) => get(`/rooms/${id}`),
  create: (data) => post("/rooms", data),
  update: (id, data) => put(`/rooms/${id}`, data),
  delete: (id) => del(`/rooms/${id}`),
};
