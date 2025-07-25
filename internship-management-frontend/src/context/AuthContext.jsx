import React, { createContext, useState, useContext, useEffect } from "react";
// Import the actual login, get current user, and logout functions from authService
import {
  login as authLogin,
  getCurrentUser,
  logout as authLogout,
} from "../services/authService";

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial load

  // Effect to load user from localStorage on initial render using getCurrentUser
  useEffect(() => {
    try {
      const storedUser = getCurrentUser(); // Get user directly from authService
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load user from local storage:", error);
      setUser(null); // Ensure user is null if there's an error parsing
    } finally {
      setLoading(false);
    }
  }, []); // Run only once on initial component mount

  const login = async (email, password) => {
    try {
      // Call the login function from authService, which handles local storage for currentUser
      const loggedInUser = await authLogin(email, password);
      setUser(loggedInUser); // Set the user state in AuthContext
      // Note: authService.js now handles localStorage.setItem('currentUser')
      return loggedInUser; // Return the user data
    } catch (error) {
      console.error("Login failed in context:", error);
      throw error; // Re-throw the error for UI components to handle
    }
  };

  const logout = () => {
    setUser(null); // Clear user state in context
    authLogout(); // Call authService's logout to clear local storage item
    // No need to remove 'user' from localStorage here, authService.logout does that.
  };

  // The value that will be available to all children components
  const value = {
    isAuthenticated: !!user, // True if a user object exists (user is logged in)
    user,
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
