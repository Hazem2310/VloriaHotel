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
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (first_name, last_name, email, password, phone_number) => {
    try {
      const response = await api.post("/auth/register", {
        first_name,
        last_name,
        email,
        password,
        phone_number,
      });

      if (response.data?.success) {
        // لا تعملي setUser هون إذا بدك بعد التسجيل تروحي Login
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      console.log("REGISTER RESPONSE:", error.response);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message || // 👈 هاي بتجيب CORS / Network Error
          "Registration failed",
      };
    }
  };

 const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data?.success) {
      setUser(response.data.user);

      // ✅ رجّعي اليوزر مع النتيجة عشان نقرر وين نودّيها
      return { success: true, user: response.data.user };
    }

    return { success: false, message: response.data?.message || "Login failed" };
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
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
isAdmin: user?.role === "admin" || user?.role === "owner" ||
         user?.roles?.includes("admin") || user?.roles?.includes("owner")  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
