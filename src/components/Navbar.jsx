import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Aninex Internships
        </Link>

        <ul className="flex space-x-4 font-medium">
          <li>
            <Link to="/" className="hover:text-yellow-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/internships" className="hover:text-yellow-300">
              Internships
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-yellow-300">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
