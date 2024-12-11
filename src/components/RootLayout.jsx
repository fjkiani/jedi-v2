import React from 'react';
import { useTheme } from '../context/ThemeContext';

const RootLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-light-2 dark:bg-n-8`}>
      {children}
    </div>
  );
};

export default RootLayout; 