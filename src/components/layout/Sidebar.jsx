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
  IoAnalyticsOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    if (!user) return;

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
      {
        to: "/mentor/documents",
        icon: IoDocumentTextOutline,
        label: "Upload Documents",
      },
      { to: "/mentor/meetings", icon: IoVideocamOutline, label: "Meetings" },
      { to: "/mentor/chat", icon: IoChatbubblesOutline, label: "Chats" },
    ];

    const adminNavItems = [
      { to: "/admin/dashboard", icon: IoGridOutline, label: "Dashboard" },
      {
        to: "/admin/manage-applications",
        icon: IoDocumentTextOutline,
        label: "Applications",
      },
      {
        to: "/admin/post-internship",
        icon: IoBriefcaseOutline,
        label: "Post Internship",
      },
      {
        to: "/admin/interview-scheduler",
        icon: IoVideocamOutline,
        label: "Interviews",
      },
      { to: "/admin/reports", icon: IoAnalyticsOutline, label: "Reports" },
    ];

    if (user.role === "Intern") {
      setNavItems(internNavItems);
    } else if (user.role === "Mentor") {
      setNavItems(mentorNavItems);
    } else if (user.role === "Admin") {
      setNavItems(adminNavItems);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const baseLinkClass =
    "flex items-center px-4 py-3 text-indigo-100 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors duration-200";
  const activeLinkClass =
    "bg-indigo-950 bg-opacity-50 text-white font-semibold";

  const settingsLink =
    user?.role === "Intern"
      ? "/intern/settings"
      : user?.role === "Mentor"
      ? "/mentor/settings"
      : "/admin/settings";

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
            end={item.to.endsWith("/dashboard")}
            className={({ isActive }) =>
              `${baseLinkClass} ${isActive ? activeLinkClass : ""}`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Settings and Logout */}
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
