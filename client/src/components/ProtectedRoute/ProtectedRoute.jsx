import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  managerOnly = false,
  employeeOnly = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // Normalize role to lowercase for consistent checking
  const userRole = (user.role || "").toLowerCase();
  console.log(
    "ProtectedRoute: Checking role:",
    userRole,
    "adminOnly:",
    adminOnly,
    "managerOnly:",
    managerOnly,
    "employeeOnly:",
    employeeOnly,
  );

  if (adminOnly && userRole !== "admin" && userRole !== "owner") {
    console.log("ProtectedRoute: Admin check failed, user role:", userRole);
    return <Navigate to="/" replace />;
  }

  if (managerOnly && userRole !== "manager") {
    console.log("ProtectedRoute: Manager check failed, user role:", userRole);
    return <Navigate to="/" replace />;
  }

  if (
    employeeOnly &&
    userRole !== "employee" &&
    userRole !== "manager" &&
    userRole !== "admin" &&
    userRole !== "owner"
  ) {
    console.log("ProtectedRoute: Employee check failed, user role:", userRole);
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute: Access granted for role:", userRole);
  return children;
};

export default ProtectedRoute;
