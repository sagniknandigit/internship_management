// src/layouts/MentorLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const MentorLayout = () => {
  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MentorLayout;
