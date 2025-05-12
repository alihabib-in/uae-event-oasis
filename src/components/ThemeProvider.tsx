
"use client";

import * as React from "react";

type Theme = "light";  // Only light theme

type ThemeContextType = {
  theme: Theme;
};

// Create the context with a default undefined value
const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light theme
  const theme: Theme = "light";

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

  const value = React.useMemo(() => ({ theme }), [theme]);

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
