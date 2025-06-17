import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle the initial loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 2. If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    // Save the location they were trying to go to, so we can redirect them back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated but role is not authorized, show an unauthorized message
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If authenticated and authorized, render the child component
  return children;
};

export default ProtectedRoute;
