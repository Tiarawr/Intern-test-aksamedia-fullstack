import React, { useState, useRef } from "react";
import Header from "./components/Header";
// import ApiService from "./services/api"; // Commented out until backend is ready
// import { useApp } from "./services/api"; // Commented out until backend is ready

// Mock credentials for demo
const MOCK_CREDENTIALS = {
  username: "admin",
  password: "pastibisa",
};

function Notification({ show, type, title, message, onClose }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-80 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-3 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${
        type === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <div className="flex-shrink-0">
        {type === "error" ? (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs mt-1 opacity-90">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Removed useApp dependency - will be restored when backend is ready
  // const { dispatch } = useApp();

  // Notification state
  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });
  const notifTimeout = useRef();

  // Check theme
  React.useEffect(() => {
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDarkMode(hasDarkClass);
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Show notification
  const showNotification = (type, title, message) => {
    setNotif({ show: true, type, title, message });
    clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(
      () => setNotif((n) => ({ ...n, show: false })),
      4000
    );
  };

  // Mock login function
  const mockLogin = async (username, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (
      username === MOCK_CREDENTIALS.username &&
      password === MOCK_CREDENTIALS.password
    ) {
      return {
        status: "success",
        data: {
          token: "mock_jwt_token_12345",
          admin: {
            id: 1,
            name: "Administrator",
            username: "admin",
            email: "admin@company.com",
          },
        },
      };
    } else {
      throw new Error("Username atau password salah");
    }
  };

  // Handle login with mock API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!username || !password) {
      showNotification(
        "error",
        "Form Tidak Lengkap!",
        "Mohon isi username dan password"
      );
      return;
    }

    setIsLoading(true);

    // Mock dispatch for loading state
    // dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Use mock login instead of real API
      const response = await mockLogin(username, password);

      if (response.status === "success") {
        // Mock token storage (will be replaced with real ApiService)
        localStorage.setItem("auth_token", response.data.token);

        // Mock global state update (will be replaced with real dispatch)
        // dispatch({
        //   type: "LOGIN_SUCCESS",
        //   payload: response.data,
        // });

        showNotification(
          "success",
          "Login Berhasil!",
          `Selamat datang, ${response.data.admin.name}!`
        );

        setTimeout(() => {
          if (onLogin) onLogin(response.data);
        }, 1000);
      } else {
        throw new Error(response.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Mock dispatch for error state
      // dispatch({ type: "SET_ERROR", payload: error.message });

      showNotification(
        "error",
        "Login Gagal!",
        error.message || "Terjadi kesalahan pada server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    setUsername(MOCK_CREDENTIALS.username);
    setPassword(MOCK_CREDENTIALS.password);
    showNotification(
      "success",
      "Demo Credentials",
      "Kredensial demo berhasil diisi!"
    );
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header - tidak menampilkan user menu di login page */}
      <Header showUserMenu={false} />

      {/* Notification */}
      <Notification
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif((n) => ({ ...n, show: false }))}
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div
          className={`w-full max-w-md p-8 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center`}
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Masuk ke Akun
            </h1>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Silakan masukkan kredensial Anda
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className={`h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div
            className={`mt-6 p-4 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Demo Login
              </h3>
              <button
                onClick={fillDemoCredentials}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  Username:
                </span>
                <code
                  className={`px-2 py-1 rounded ${
                    isDarkMode
                      ? "bg-gray-600 text-blue-400"
                      : "bg-white text-blue-600"
                  }`}
                >
                  admin
                </code>
              </div>
              <div className="flex justify-between">
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  Password:
                </span>
                <code
                  className={`px-2 py-1 rounded ${
                    isDarkMode
                      ? "bg-gray-600 text-blue-400"
                      : "bg-white text-blue-600"
                  }`}
                >
                  pastibisa
                </code>
              </div>
            </div>
          </div>

          {/* Development Notice */}
          <div
            className={`mt-4 p-3 rounded-lg border ${
              isDarkMode
                ? "bg-yellow-900 border-yellow-700 text-yellow-200"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">
                Mode Mock - Backend belum dikoneksikan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
