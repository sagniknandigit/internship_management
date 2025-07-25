import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../components/layout/ScrollToTop"; // Ensure ScrollToTop is imported

// Layouts
import MainLayout from "../layouts/MainLayout";
import InternLayout from "../layouts/InternLayout";
import MentorLayout from "../layouts/MentorLayout";
import AdminLayout from "../layouts/AdminLayout";

// General Pages
import HomePage from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFound";
import InternshipsPage from "../pages/InternshipsPage";

// Admin Pages
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminDashboard from "../pages/Admin/Dashboard";
import ManageApplications from "../pages/Admin/ManageApplications";
import PostInternship from "../pages/Admin/PostInternship";
import InterviewScheduler from "../pages/Admin/InterviewScheduler";
import Reports from "../pages/Admin/Reports";
import AdminSettings from "../pages/Admin/AdminSettings";
import AllInternships from "../pages/Admin/AllInternships";
import ManageUsers from "../pages/Admin/ManageUsers";
import PostUpdate from "../pages/Admin/PostUpdate"; // NEW: Import PostUpdate

// Intern Pages
import InternDashboard from "../pages/Intern/Dashboard";
import ApplyForm from "../pages/Intern/ApplyForm";
import MyApplications from "../pages/Intern/MyApplications";
import MyTasks from "../pages/Intern/MyTasks";
import Documents from "../pages/Intern/Documents";
import Chat from "../pages/Intern/Chat";
import Settings from "../pages/Intern/Settings";
import Meetings from "../pages/Intern/Meetings";

// Mentor Pages
import MentorDashboard from "../pages/Mentor/Dashboard";
import AssignedInterns from "../pages/Mentor/AssignedInterns";
import ReviewTasks from "../pages/Mentor/ReviewTasks";
import MentorMeetings from "../pages/Mentor/MentorMeetings";
import MentorChat from "../pages/Mentor/MentorChat";
import MentorSettings from "../pages/Mentor/MentorSettings";
import MentorDocuments from "../pages/Mentor/MentorDocuments";

// Common Pages
import Notifications from "../pages/common/Notifications"; // NEW: Import Notifications

// Components
import ProtectedRoute from "./ProtectedRoutes"; // Correctly named ProtectedRoute

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop /> {/* Scrolls to top on route change */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Main Public Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/internships" element={<InternshipsPage />} />
        </Route>

        {/* Intern Routes: ProtectedRoute wraps InternLayout which contains the Sidebar */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute roles={["Intern"]}>
              <InternLayout /> {/* InternLayout renders the Sidebar */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InternDashboard />} />
          <Route path="apply/:internshipId" element={<ApplyForm />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="documents" element={<Documents />} />
          <Route path="chat" element={<Chat />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />{" "}
          {/* NEW: Notifications Route */}
        </Route>

        {/* Mentor Routes: ProtectedRoute wraps MentorLayout which contains the Sidebar */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute roles={["Mentor"]}>
              <MentorLayout /> {/* MentorLayout renders the Sidebar */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="interns" element={<AssignedInterns />} />
          <Route path="tasks" element={<ReviewTasks />} />
          <Route path="documents" element={<MentorDocuments />} />
          <Route path="meetings" element={<MentorMeetings />} />{" "}
          <Route path="chat" element={<MentorChat />} />
          <Route path="settings" element={<MentorSettings />} />
          <Route path="post-update" element={<PostUpdate />} />{" "}
          {/* NEW: Post Update Route */}
          <Route path="notifications" element={<Notifications />} />{" "}
          {/* NEW: Notifications Route */}
        </Route>

        {/* Admin Routes: ProtectedRoute wraps AdminLayout which contains the Sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout /> {/* AdminLayout renders the Sidebar */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="all-internships" element={<AllInternships />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-applications" element={<ManageApplications />} />
          <Route path="post-internship" element={<PostInternship />} />
          <Route path="interview-scheduler" element={<InterviewScheduler />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="post-update" element={<PostUpdate />} />{" "}
          {/* NEW: Post Update Route */}
          <Route path="notifications" element={<Notifications />} />{" "}
          {/* NEW: Notifications Route */}
        </Route>

        {/* Catch-All for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
