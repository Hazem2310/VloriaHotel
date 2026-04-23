import { get } from "./apiClient";

export const galleryAPI = {
  getAll: (params = "") => get(`/gallery${params}`),
  getByCategory: (category) => get(`/gallery/category/${category}`),
  getStats: () => get("/gallery/stats"),
};
