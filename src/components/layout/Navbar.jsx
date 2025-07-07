import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AninexLogo from "../../assets/images/aninex-logo.jpeg";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user?.role) return "/login";
    switch (user.role) {
      case "Admin":
        return "/admin/dashboard";
      case "Intern":
        return "/intern/dashboard";
      case "Mentor":
        return "/mentor/dashboard";
      default:
        return "/";
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
  };

  const renderAuthLinks = () => {
    if (loading) {
      return <div className="h-8 w-56 bg-gray-200 animate-pulse rounded-md" />;
    }

    if (isAuthenticated) {
      return (
        <>
          <NavLink
            to={getDashboardLink()}
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Dashboard
          </NavLink>
          <span className="text-gray-500 text-sm">|</span>
          <span className="text-gray-900 text-sm font-medium">
            Welcome, {getFirstName(user?.name)}
          </span>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <NavLink
            to="/login"
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Register
          </NavLink>
        </>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-4">
              <img className="h-16" src={AninexLogo} alt="Aninex Global" />
              <span className="hidden sm:block text-lg font-semibold">
                Aninex Global Services Private Limited
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">{renderAuthLinks()}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
