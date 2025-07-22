import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  }); // Added captcha to formData
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Display success message from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setError(null); // Clear any previous error if coming from success
      // Clear the location state to prevent message from re-appearing on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setLoading(true);

    // Simple Captcha validation (as per existing logic)
    if (formData.captcha !== "9") {
      // 4 + 5 = 9
      setError("Incorrect CAPTCHA answer.");
      setLoading(false);
      return;
    }

    try {
      // The login function now returns the user data directly on success
      const user = await auth.login(formData.email, formData.password);

      // Redirect based on the returned user's role
      if (user.role === "Intern") {
        navigate("/intern/dashboard");
      } else if (user.role === "Mentor") {
        navigate("/mentor/dashboard");
      } else {
        // This case should ideally not be reached for "Admin" or "Suspend"
        // as auth.login throws an error for "Suspend" and Admin has a separate login.
        setError("This login is for Interns and Mentors only.");
        auth.logout(); // Log out the user if they're not Intern/Mentor
      }
    } catch (err) {
      // Display error message from authService (e.g., "Invalid email or password.", "Your account has been suspended...")
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border-2 border-indigo-100">
        {" "}
        {/* Changed border color to indigo */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Log in to your Intern or Mentor account.
        </p>
        {successMessage && (
          <p className="bg-green-100 text-green-700 text-sm text-center p-3 rounded-lg mb-4">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="your.email@example.com"
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

          {/* Simple Captcha Section */}
          <div className="mb-6 flex items-center justify-between content-center leading-3">
            <label htmlFor="captchaAnswer" className="block text-gray-700">
              Solve this CAPTCHA:{" "}
            </label>
            <span className="font-mono font-bold items-center">4 + 5 = </span>
            <input
              type="text"
              id="captchaAnswer"
              name="captcha"
              value={formData.captcha}
              onChange={handleChange}
              required
              placeholder="Your answer"
              className="input-field w-32 text-center"
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
            {loading ? <Spinner /> : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register Here
          </Link>
        </p>
        <p className="text-center text-xs text-gray-500 mt-4">
          Are you an Admin?{" "}
          <Link
            to="/admin/login"
            className="text-gray-600 hover:underline font-semibold"
          >
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
