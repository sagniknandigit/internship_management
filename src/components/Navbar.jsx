import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-200 transition-colors duration-200"
        >
          Aninex Internships
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Register
          </Link>
          <button className="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
