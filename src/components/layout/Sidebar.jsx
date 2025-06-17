import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AninexLogo from "../../assets/images/aninex-logo.jpeg";
import ProfileAvatar from "../ui/ProfileAvatar"; 

import {
  IoGridOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoCheckmarkDoneCircleOutline,
  IoChatbubblesOutline,
  IoVideocamOutline,
  IoSettingsOutline, // <-- New Icon
  IoLogOutOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/intern/dashboard", icon: IoGridOutline, label: "Dashboard" },
    { to: "/internships", icon: IoBriefcaseOutline, label: "Find Internships" },
    {
      to: "/intern/applications",
      icon: IoDocumentTextOutline,
      label: "My Applications",
    },
    {
      to: "/intern/tasks",
      icon: IoCheckmarkDoneCircleOutline,
      label: "My Tasks",
    },
    {
      to: "/intern/documents",
      icon: IoDocumentTextOutline,
      label: "Documents",
    },
    {
      to: "/intern/chat",
      icon: IoChatbubblesOutline,
      label: "Chat with Mentor",
    },
    { to: "/intern/meetings", icon: IoVideocamOutline, label: "Meetings" },
  ];

  // --- NEW professional color theme ---
  const baseLinkClass =
    "flex items-center px-4 py-3 text-indigo-100 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors duration-200";
  const activeLinkClass =
    "bg-indigo-950 bg-opacity-50 text-white font-semibold";

  return (
    <div className="flex flex-col w-64 h-full bg-indigo-800 text-white">
      {/* <div className="flex items-center justify-center h-20 border-b border-indigo-700">
        <img className="h-8" src={AninexLogo} alt="Aninex" />
      </div> */}

      {/* --- NEW Profile Section at the top --- */}
      <div className="flex flex-col items-center p-4 mt-4">
        <ProfileAvatar user={user} size="lg" />
        <p className="mt-3 text-lg font-semibold">{user?.name}</p>
        <p className="text-sm text-indigo-300">{user?.role}</p>
      </div>

      <nav className="flex-1 px-4 py-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/intern/dashboard"}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : ""}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* --- NEW Settings and Logout Section at the bottom --- */}
      <div className="px-4 py-4 border-t border-indigo-700 space-y-2">
        <NavLink
          to="/intern/settings"
          className={({ isActive }) =>
            `${baseLinkClass} ${isActive ? activeLinkClass : ""}`
          }
        >
          <IoSettingsOutline className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </NavLink>
        <button onClick={handleLogout} className={`${baseLinkClass} w-full`}>
          <IoLogOutOutline className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
