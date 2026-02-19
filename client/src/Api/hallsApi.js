import { get, post, put, del } from "./apiClient";

export const hallsAPI = {
  getAll: () => get("/halls"),
  getById: (id) => get(`/halls/${id}`),
  create: (hallData) => post("/halls", hallData),
  update: (id, hallData) => put(`/halls/${id}`, hallData),
  delete: (id) => del(`/halls/${id}`),
  bookHall: (bookingData) => post("/halls/book", bookingData),
};
