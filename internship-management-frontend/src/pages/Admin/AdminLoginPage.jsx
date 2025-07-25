import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext to use the login function
import Spinner from "../../components/ui/Spinner";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // The login function from AuthContext will return the user data directly on success
      // It also handles throwing an error if the user is suspended.
      const user = await auth.login(formData.email, formData.password);

      // Now we can reliably redirect based on the returned user's role
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        // This case handles if a non-admin user (e.g., Intern or Mentor) tries to log in via the admin page
        setError("Access Denied. This portal is for administrators only.");
        auth.logout(); // Log them out immediately as they tried to access the wrong portal
      }
    } catch (err) {
      // This will catch errors from authService, including "Invalid email or password."
      // or "Your account has been suspended..."
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-500/20 flex items-center justify-center p-4">
      {" "}
      {/* Changed background to bg-gray-50 for consistency */}
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border-2 border-indigo-100">
        {" "}
        {/* Added indigo border for consistency */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Admin Portal
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please log in to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="example@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p
              className={`text-red-500 text-sm text-center mb-4 ${
                error.includes("suspended") ? "font-bold" : ""
              }`}
            >
              {error}
              {error.includes("suspended") && (
                <span className="block mt-1">
                  Contact admin at{" "}
                  <a
                    href="mailto:admin@aninex.com"
                    className="text-indigo-600 hover:underline"
                  >
                    admin@aninex.com
                  </a>
                </span>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:bg-indigo-300"
          >
            {loading ? <Spinner /> : "Log In as Admin"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Back to{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login Page
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
