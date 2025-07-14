import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or force default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      // Always start with light for debugging
      localStorage.removeItem("theme"); // Clear any previous dark mode
      return "light";
    }
    return "light";
  });

  // Apply theme to document (single useEffect for all theme changes)
  useEffect(() => {
    console.log("🔄 THEME EFFECT TRIGGERED");
    console.log("📋 Theme value:", theme);

    const root = document.documentElement;
    console.log("📋 Before - HTML classes:", root.classList.toString());

    // Remove all theme classes first
    root.classList.remove("light", "dark");

    // Add the current theme class
    if (theme === "dark") {
      root.classList.add("dark");
      console.log("🌙 Dark mode applied - HTML should have 'dark' class");
    } else {
      console.log("☀️ Light mode applied - HTML should NOT have 'dark' class");
    }

    console.log("📋 After - HTML classes:", root.classList.toString());
    console.log("🎨 CSS background should now be:", theme === "dark" ? "dark gray" : "light white");

    // Save to localStorage
    localStorage.setItem("theme", theme);
    console.log("💾 Theme saved to localStorage:", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("🔄 TOGGLE THEME CLICKED");
    console.log("📋 Current theme:", theme);
    console.log("📋 New theme:", newTheme);
    console.log("🎯 This should trigger useEffect and change HTML class");
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
