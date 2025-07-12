import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
// import { AppProvider, useApp } from "./services/api";
// import ApiService from "./services/api";

// App wrapper component with authentication logic

function AppContent({ token, onLogin, onLogout, isLoading }) {

  // useEffect(() => {
  //   // Check if user is already logged in
  //   const checkAuth = () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       ApiService.setToken(token);
  //       // Here you could validate the token with the backend
  //       // For now, we'll just assume it's valid if it exists
  //     }
  //     setIsLoading(false);
  //   };

  //   checkAuth();
  // }, []);



  // const handleLogout = () => {
  //   ApiService.removeToken();
  //   window.location.reload();
  // };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {token ? (
        <Dashboard onLogout={onLogout} />
      ) : (
        <Login onLogin={onLogin} />
      )}
    </div>
  );
}

// Main App component with Provider

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (loginData) => {
    setToken(loginData.token);
    localStorage.setItem("token", loginData.token);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AppContent
      token={token}
      onLogin={handleLogin}
      onLogout={handleLogout}
      isLoading={isLoading}
    />
  );
}
