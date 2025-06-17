import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import NotFound from "../pages/NotFound.jsx";
import MentorLayout from "../layouts/MentorLayout.jsx";
import MentorDashboard from "../pages/Mentor/Dashboard.jsx";
import MentorTrackProgress from "../pages/Mentor/TrackProgress.jsx";
import MentorCommunication from "../pages/Mentor/Communication.jsx";
import ProtectedRoute from "./ProtectedRoutes.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/mentor"
          element={<ProtectedRoute requiredRole="mentor" />}
        >
          <Route
            path="dashboard"
            element={
              <MentorLayout>
                <MentorDashboard />
              </MentorLayout>
            }
          />
          <Route
            path="track-progress"
            element={
              <MentorLayout>
                <MentorTrackProgress />
              </MentorLayout>
            }
          />
          <Route
            path="communication"
            element={
              <MentorLayout>
                <MentorCommunication />
              </MentorLayout>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
