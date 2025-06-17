import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Pages
import HomePage from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminDashboard from "../pages/Admin/Dashboard";
import InternDashboard from "../pages/Intern/Dashboard";
import MentorDashboard from "../pages/Mentor/Dashboard";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoutes";
import InternshipsPage from "../pages/InternshipsPage";
import InternLayout from "../layouts/InternLayout";
import MyApplications from "../pages/Intern/MyApplications";
import MyTasks from "../pages/Intern/MyTasks";
import Documents from "../pages/Intern/Documents";
import Chat from "../pages/Intern/Chat";
import Settings from "../pages/Intern/Settings";
import Meetings from "../pages/Intern/Meetings";

// Route Guard

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // A wrapper for the root route to handle the initial redirect
  const InitialRedirect = () => {
    if (loading) {
      return <div>Loading...</div>; // Or a full-page spinner
    }
    // If the user is not authenticated, redirect them to the login page
    return !isAuthenticated ? <Navigate to="/login" /> : <HomePage />;
  };

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/intern"
        element={
          <ProtectedRoute roles={["Intern"]}>
            <InternLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InternDashboard />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="documents" element={<Documents />} />
        <Route path="chat" element={<Chat />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* The root path handles the initial redirect logic */}
      <Route
        path="/"
        element={
          <MainLayout>
            <InitialRedirect />
          </MainLayout>
        }
      />

      {/* --- PROTECTED ROUTES --- */}
      {/* These routes are only accessible if the user is logged in AND has the correct role */}

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["Admin"]}>
            {/* You can create a dedicated AdminLayout here if needed */}
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Intern Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<InitialRedirect />} />
        <Route path="/internships" element={<InternshipsPage />} />
      </Route>

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute roles={["Mentor"]}>
            <MainLayout>
              <MentorDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Not Found Route - must be last */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
