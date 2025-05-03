import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button'; // Assuming Button handles internal/external links

const CallToAction = ({
  title = "Need a Custom Solution?", // Default title
  description = "Our team can help you build a tailored solution that meets your specific needs.", // Default description
  buttonText = "Contact Us", // Default button text
  buttonLink = "/contact", // Default link
  className = '', // Allow custom container classes
  buttonStyle = 'gradient' // Default button style
}) => {
  const { isDarkMode } = useTheme();

  // Helper to get button classes based on style prop
  const getButtonClasses = () => {
    switch (buttonStyle) {
      case 'primary':
        return 'button button-primary';
      case 'secondary':
        // Example: You might need specific light/dark secondary styles
        return `button ${isDarkMode ? 'button-secondary' : 'button-secondary'}`; // Adjust if needed
      case 'gradient':
      default:
        return 'button button-gradient';
    }
  };

  return (
    // Container with theme styles and custom class support
    <div className={`rounded-2xl p-8 border max-w-3xl mx-auto text-center ${ 
      isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'
    } ${className}`}>
      
      {/* Title with theme styles */}
      <h2 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {title}
      </h2>
      
      {/* Description with theme styles */}
      <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-6`}>
        {description}
      </p>
      
      {/* Button - using Link for internal routing, styled as a button */}
      <Link
        to={buttonLink}
        className={getButtonClasses()} 
      >
        {buttonText}
      </Link>
      
      {/* Alternative: If using a Button component that handles links 
      <Button href={buttonLink} className={getButtonClasses()}>
        {buttonText}
      </Button>
      */}
    </div>
  );
};

export default CallToAction; 