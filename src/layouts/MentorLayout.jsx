import React from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/sidebar.jsx";

const MentorLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />{" "}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">{children} </main>
      </div>
    </div>
  );
};

export default MentorLayout;
