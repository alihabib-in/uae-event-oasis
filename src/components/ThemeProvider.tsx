"use client";

import * as React from "react";

type Theme = "dark";  // Changed to dark theme for black & white

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Create the context with a default undefined value
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force dark theme for black & white design
  const theme: Theme = "dark";

  // Add toggleTheme function that doesn't actually toggle (just keeps dark theme)
  const toggleTheme = () => {
    // This is just a stub function as we're enforcing dark mode
    console.log("Theme toggle attempted, but dark theme is enforced");
  };

  // Ensure this useEffect only runs in the browser
  React.useEffect(() => {
    // Apply theme class to document element
    const root = window.document.documentElement;
    
    // Set dark theme
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Save to localStorage
    localStorage.setItem("theme", "dark");
  }, []);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
