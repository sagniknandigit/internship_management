import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../services/authService";

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // To handle initial load

  // Effect to load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data; // <-- ADD THIS LINE to return the user data
    } catch (error) {
      console.error("Login failed in context:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear user info from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // The value that will be available to all children components
  const value = {
    isAuthenticated: !!token, // True if a token exists
    user,
    token,
    login,
    logout,
    loading, // Expose loading state for initial auth check
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};
