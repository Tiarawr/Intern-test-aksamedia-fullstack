import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import EditProfileSimple from "./EditProfileSimple";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { user, logout } = useAuth();

  const getDisplayName = () => {
    if (!user) return "User";
    // Priority: displayName (from localStorage) > name > username > "User"
    return user.displayName || user.name || user.username || "User";
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tiara Company
              </h1>
            </div>

            {/* Right side - Theme selector and user menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <ThemeSelector />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{getDisplayName()}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">{getDisplayName()}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowEditProfile(true);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Edit Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      <EditProfileSimple
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  );
};

export default Header;
