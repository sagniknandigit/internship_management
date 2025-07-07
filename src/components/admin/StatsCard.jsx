import React from "react";
import { FaUserTie, FaUserGraduate, FaBriefcase } from "react-icons/fa";

const iconMap = {
  mentor: <FaUserTie className="text-blue-600 w-6 h-6" />,
  intern: <FaUserGraduate className="text-green-600 w-6 h-6" />,
  internship: <FaBriefcase className="text-purple-600 w-6 h-6" />,
};

const StatsCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center space-x-4">
      <div className="bg-gray-100 p-3 rounded-full">
        {iconMap[icon] || <FaBriefcase className="text-gray-600 w-6 h-6" />}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;
