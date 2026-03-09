import { get, post, put, del } from "./apiClient";

export const roomsAPI = {
  getAll: (params = "") => get(`/rooms${params}`),
  getById: (id) => get(`/rooms/${id}`),
  getTypes: () => get("/rooms/types"),
  create: (data) => post("/rooms", data),
  update: (id, data) => put(`/rooms/${id}`, data),
  delete: (id) => del(`/rooms/${id}`),
};