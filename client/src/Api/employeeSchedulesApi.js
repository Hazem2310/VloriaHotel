import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const employeeSchedulesAPI = {
  getAll: () => api.get("/employee-schedules"),
  getMine: () => api.get("/employee-schedules/me"),
  getEmployees: () => api.get("/employee-schedules/employees"),
  create: (data) => api.post("/employee-schedules", data),
  delete: (id) => api.delete(`/employee-schedules/${id}`),
};