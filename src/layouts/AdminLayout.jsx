import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* The content for each specific intern page will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
