import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../ui/ProfileAvatar";
import { getData } from "../../services/dataService"; // Import getData to fetch updates

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
  IoNotificationsOutline, // NEW: Import Notifications icon
  IoCreateOutline, // NEW: Import Create icon for Post Update
} from "react-icons/io5";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); // NEW: State for unread count

  // Function to calculate unread notifications
  const calculateUnreadCount = useCallback(() => {
    if (!user) return;
    try {
      const allUpdates = getData("updates") || [];
      const relevantUnreadUpdates = allUpdates.filter((update) => {
        // An update is relevant if:
        // 1. It targets 'All' users.
        // 2. It targets the user's specific role.
        // 3. It targets the user's specific ID.
        const isRelevant =
          update.targetRole === "All" ||
          update.targetRole === user.role ||
          (update.targetRole === "Specific" && update.targetUserId === user.id);
        // And it has NOT been read by the current user
        const isUnread = !(update.readBy && update.readBy.includes(user.id));
        return isRelevant && isUnread;
      });
      setUnreadNotificationCount(relevantUnreadUpdates.length);
    } catch (error) {
      console.error("Failed to calculate unread notification count:", error);
      setUnreadNotificationCount(0);
    }
  }, [user]); // Dependency on user to re-calculate if user changes

  // Effect to update navItems based on user role
  useEffect(() => {
    if (!user) return;

    const internNavItems = [
      { to: "/intern/dashboard", icon: IoGridOutline, label: "Dashboard" },
      {
        to: "/intern/notifications",
        icon: IoNotificationsOutline,
        label: "Notifications",
        showCount: true,
      }, // NEW: Moved and added showCount
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
        to: "/mentor/notifications",
        icon: IoNotificationsOutline,
        label: "Notifications",
        showCount: true,
      }, // NEW: Moved and added showCount
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
      {
        to: "/mentor/post-update",
        icon: IoCreateOutline,
        label: "Post Update",
      },
    ];

    const adminNavItems = [
      { to: "/admin/dashboard", icon: IoGridOutline, label: "Dashboard" },
      {
        to: "/admin/notifications",
        icon: IoNotificationsOutline,
        label: "Notifications",
        showCount: true,
      }, // NEW: Moved and added showCount
      {
        to: "/admin/all-internships",
        icon: IoFileTrayFullOutline,
        label: "All Internships",
      },
      {
        to: "/admin/manage-users",
        icon: IoPeopleOutline,
        label: "Manage Users",
      },
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
      { to: "/admin/post-update", icon: IoCreateOutline, label: "Post Update" },
    ];

    if (user.role === "Intern") {
      setNavItems(internNavItems);
    } else if (user.role === "Mentor") {
      setNavItems(mentorNavItems);
    } else if (user.role === "Admin") {
      setNavItems(adminNavItems);
    }
  }, [user]);

  // Effect to calculate unread count periodically
  useEffect(() => {
    calculateUnreadCount(); // Initial calculation
    const intervalId = setInterval(calculateUnreadCount, 5000); // Recalculate every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [calculateUnreadCount]); // Dependency on calculateUnreadCount

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
    <div className="flex flex-col w-64 min-h-screen h-dvh fixed bg-indigo-800 text-white overflow-y-auto justify-start hide-scrollbar">
      <div className="flex flex-col items-center p-4 mt-4">
        <ProfileAvatar user={user} size="lg" />
        <p className="mt-3 text-lg font-semibold">{user?.name}</p>
        <p className="text-sm text-indigo-300">{user?.role}</p>
      </div>
      <div>
        <nav className="flex-1 px-4 py-4 mt-4 space-y-2 ">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith("/dashboard")} // 'end' prop is useful for dashboard to only be active on exact path
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : ""}`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
              {item.showCount &&
                unreadNotificationCount > 0 && ( // NEW: Display badge conditionally
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

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
    </div>
  );
};

export default Sidebar;
