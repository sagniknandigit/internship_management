import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../ui/ProfileAvatar";

import {
  IoGridOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoCheckmarkDoneCircleOutline,
  IoChatbubblesOutline,
  IoVideocamOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoFileTrayFullOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Define navigation items for each role
    const internNavItems = [
      { to: "/intern/dashboard", icon: IoGridOutline, label: "Dashboard" },
      {
        to: "/internships",
        icon: IoBriefcaseOutline,
        label: "Find Internships",
      },
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

    const mentorNavItems = [
      { to: "/mentor/dashboard", icon: IoGridOutline, label: "Dashboard" },
      {
        to: "/mentor/interns",
        icon: IoPeopleOutline,
        label: "Assigned Interns",
      },
      {
        to: "/mentor/tasks",
        icon: IoFileTrayFullOutline,
        label: "Review Tasks",
      },
      { to: "/mentor/meetings", icon: IoVideocamOutline, label: "Meetings" },
      { to: "/mentor/chat", icon: IoChatbubblesOutline, label: "Chats" },
    ];

    // Set the navigation items based on the user's role
    if (user.role === "Intern") {
      setNavItems(internNavItems);
    } else if (user.role === "Mentor") {
      setNavItems(mentorNavItems);
    }
    // Add other roles like 'Admin' here if needed
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- Reusable Tailwind classes ---
  const baseLinkClass =
    "flex items-center px-4 py-3 text-indigo-100 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors duration-200";
  const activeLinkClass =
    "bg-indigo-950 bg-opacity-50 text-white font-semibold";

  // Determine the settings link based on role
  const settingsLink =
    user?.role === "Intern" ? "/intern/settings" : "/mentor/settings";

  return (
    <div className="flex flex-col w-64 h-full bg-indigo-800 text-white">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 mt-4">
        <ProfileAvatar user={user} size="lg" />
        <p className="mt-3 text-lg font-semibold">{user?.name}</p>
        <p className="text-sm text-indigo-300">{user?.role}</p>
      </div>

      {/* Dynamic Navigation */}
      <nav className="flex-1 px-4 py-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.endsWith("/dashboard")} // Ensure only dashboard is 'end'
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : ""}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Settings and Logout Section */}
      <div className="px-4 py-4 border-t border-indigo-700 space-y-2">
        <NavLink
          to={settingsLink}
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
