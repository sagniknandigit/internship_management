import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const isAuthenticated = true;
  const userRole = "mentor";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.warn(
      `Access denied. Required role: ${requiredRole}, User role: ${userRole}`
    );
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
