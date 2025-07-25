import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {" "}
      <Sidebar /> 
      <div className="flex flex-col flex-1 ml-64 overflow-x-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {" "}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
