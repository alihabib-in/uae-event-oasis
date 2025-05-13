"use client";

import * as React from "react";

type Theme = "light";  // Only light theme

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void; // Added this function to the type
};

// Create the context with a default undefined value
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light theme
  const theme: Theme = "light";

  // Add toggleTheme function that doesn't actually toggle (just keeps light theme)
  const toggleTheme = () => {
    // This is just a stub function as we're enforcing light mode
    console.log("Theme toggle attempted, but light theme is enforced");
  };

  // Ensure this useEffect only runs in the browser
  React.useEffect(() => {
    // Apply theme class to document element
    const root = window.document.documentElement;
    
    // Set light theme
    root.classList.remove("dark");
    root.classList.add("light");
    
    // Save to localStorage
    localStorage.setItem("theme", "light");
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
