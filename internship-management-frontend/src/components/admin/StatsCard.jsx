import React from "react";
import {
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaVideo,
  FaClipboardList,
} from "react-icons/fa";

// Map icon names to components and their default Tailwind CSS text colors
const iconMap = {
  mentor: { component: FaUserTie, colorClass: "text-blue-600" },
  intern: { component: FaUserGraduate, colorClass: "text-green-600" },
  internship: { component: FaBriefcase, colorClass: "text-purple-600" },
  total: { component: FaUsers, colorClass: "text-indigo-600" }, // For Total Users/General Count
  applications: { component: FaFileAlt, colorClass: "text-red-600" }, // For Total Applications
  interviews: { component: FaVideo, colorClass: "text-yellow-600" }, // For Total Interviews
  active: { component: FaBriefcase, colorClass: "text-teal-600" }, // For Active Listings
  // FaClipboardList is a fallback if an icon name is not found
};

const StatsCard = ({ title, count, icon }) => {
  // Removed 'color' prop as its usage was redundant with iconMap
  const IconComponent = iconMap[icon]?.component || FaClipboardList; // Default to a generic list icon
  const iconColorClass = iconMap[icon]?.colorClass || "text-gray-600"; // Default icon color

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-gray-100">
      <div className={`bg-gray-100 p-3 rounded-full ${iconColorClass}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;
