import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const activeLinkClass = "bg-blue-700 text-white font-semibold";
  const normalLinkClass = "text-gray-300 hover:bg-blue-600 hover:text-white";

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 shadow-lg">
      <div className="text-2xl font-bold mb-8 text-center text-blue-400">
        Mentor Panel
      </div>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink
              to="/mentor/dashboard"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive ? activeLinkClass : normalLinkClass
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/mentor/track-progress"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive ? activeLinkClass : normalLinkClass
                }`
              }
            >
              Track Progress
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/mentor/communication"
              className={({ isActive }) =>
                `block py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive ? activeLinkClass : normalLinkClass
                }`
              }
            >
              Communication
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
