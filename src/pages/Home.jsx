// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">
        Welcome to Aninex Internship Portal
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Streamlining your internship experience, from application to success.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 border border-blue-600 text-blue-600 text-lg font-semibold rounded-lg shadow-md hover:bg-blue-50 hover:text-blue-700 transition duration-300"
        >
          Register
        </Link>
      </div>
      <p className="mt-12 text-gray-500">
        (Note: Temporarily, you can access mentor dashboard via{" "}
        <Link to="/mentor/dashboard" className="text-blue-500 underline">
          /mentor/dashboard
        </Link>
        )
      </p>
    </div>
  );
};

export default Home;
