// src/Api/roomTypesApi.js
import apiClient from "./apiClient";

export const roomTypesAPI = {
  getAll: (query = "") => apiClient.get(`/room-types${query}`),
  getById: (id) => apiClient.get(`/room-types/${id}`),
  create: (data) => apiClient.post("/room-types", data),
  update: (id, data) => apiClient.put(`/room-types/${id}`, data),
  delete: (id) => apiClient.delete(`/room-types/${id}`),
};