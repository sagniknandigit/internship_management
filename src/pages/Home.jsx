import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Find Your Next Opportunity at Aninex
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Our internship program is designed to provide hands-on experience,
        mentorship, and a direct path to a successful career in technology.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
        <Link
          to="/internships"
          className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          View Internships
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
