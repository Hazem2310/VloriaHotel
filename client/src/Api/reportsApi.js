import api from "./api";

// Reports API
export const reportsAPI = {
  get: () => api.get("/reports"),
};
