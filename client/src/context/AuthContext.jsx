import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    first_name,
    last_name,
    email,
    password,
    phone_number
  ) => {
    try {
      const response = await api.post("/auth/register", {
        first_name,
        last_name,
        email,
        password,
        phone_number,
      });

      if (response.data?.success) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message: "Registration failed",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.success) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        setUser(response.data.user);

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      }

      return {
        success: false,
        message: response.data?.message || "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const normalizedRole = user?.role?.toLowerCase() || "";
  const normalizedRoles = user?.roles?.map((r) => r.toLowerCase()) || [];

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "owner" ||
    normalizedRoles.includes("admin") ||
    normalizedRoles.includes("owner");

  const isEmployee =
    normalizedRole === "employee" || normalizedRoles.includes("employee");

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin,
    isEmployee,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;