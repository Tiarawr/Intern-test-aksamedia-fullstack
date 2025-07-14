import { createContext, useContext, useEffect, useState } from "react";
import {
  authAPI,
  userAPI,
  getCurrentUser,
  isAuthenticated,
} from "../../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const userData = getCurrentUser();

      // Load saved display name from localStorage if exists
      const savedDisplayName = localStorage.getItem("userDisplayName");
      if (savedDisplayName) {
        userData.displayName = savedDisplayName;
      }

      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);

      // Load saved display name for this user if exists
      const savedDisplayName = localStorage.getItem("userDisplayName");
      if (savedDisplayName) {
        response.data.admin.displayName = savedDisplayName;
      }

      setUser(response.data.admin);
      return { success: true };
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log("Logout API call failed:", error);
    } finally {
      // Clear saved display name on logout
      localStorage.removeItem("userDisplayName");
      setUser(null);
      // Redirect to login page
      window.location.href = "/";
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await userAPI.updateProfile(userData);
      if (response.status === "success") {
        setUser((prev) => ({ ...prev, ...userData }));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" };
    }
  };

  // New function to update display name locally
  const updateDisplayName = (name) => {
    localStorage.setItem("userDisplayName", name);
    setUser((prev) => ({
      ...prev,
      displayName: name,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUser,
        updateDisplayName, // Add this new function
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
