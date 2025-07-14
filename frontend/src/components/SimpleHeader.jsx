import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeSelector from "./ThemeSelector";

const SimpleHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tiara Company
            </h1>
          </div>

          {/* Right side - Only theme selector */}
          <div className="flex items-center space-x-4">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
