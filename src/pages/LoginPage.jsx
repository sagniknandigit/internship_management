import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      // Clear the location state to prevent message from re-appearing
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

    try {
      // The login function now returns the user data directly
      const { user } = await auth.login(formData.email, formData.password);

      // Now we can reliably redirect based on the returned user's role
      if (user.role === "Intern") {
        navigate("/intern/dashboard");
      } else if (user.role === "Mentor") {
        navigate("/mentor/dashboard");
      } else {
        setError("This login is for Interns and Mentors only.");
        auth.logout();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border-2 border-blue-100">
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Simple Captcha placeholder */}
          <div className="mb-6 text-center flex flex-row items-center leading-1">
            <p className="text-gray-600">
              Please solve:{" "}
              <span className="font-mono font-bold">4 + 5 = ?</span>
            </p>
            <input
              type="text"
              required name="captcha"
              placeholder="Your answer"
              className="w-1/2 mx-auto px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-300"
          >
            {loading ? <Spinner /> : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
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
