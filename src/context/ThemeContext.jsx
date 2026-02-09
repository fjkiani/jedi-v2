import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Default to LIGHT mode as per new doctrine
    const savedTheme = localStorage.getItem('theme');

    // If explicitly set to dark, respect it
    if (savedTheme === 'dark') {
      return true;
    }

    // Otherwise default to light mode (false)
    return false;
  });

  // Apply theme changes
  useEffect(() => {
    // Update document class
    document.documentElement.classList.toggle('dark', isDarkMode);
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 