import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Default to dark mode (black mode)
    // Only use saved preference if it exists and is explicitly set to light mode
    const savedTheme = localStorage.getItem('theme');
    
    // Default to dark mode (true) unless explicitly set to light
    if (savedTheme === 'light') {
      return false;
    }
    
    // Default to dark mode for new users or any other case
    return true;
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