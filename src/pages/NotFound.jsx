import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import Button from '@/components/Button';
import { useTheme } from '@/context/ThemeContext';

const NotFound = () => {
  const { isDarkMode } = useTheme();
  return (
    <Section className="min-h-[60vh] flex items-center justify-center">
      <div className="container text-center py-20">
        <h1 className={`text-6xl sm:text-8xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>404</h1>
        <p className={`body-1 mb-8 max-w-md mx-auto ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Page not found. The link may be broken or the page has been moved.
        </p>
        <Button href="/">Return Home</Button>
      </div>
    </Section>
  );
};

export default NotFound;
