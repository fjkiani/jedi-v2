import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';

const IndustrySolutionCard = ({ title, description, industrySlug, useCaseSlug, index }) => {
  const { isDarkMode } = useTheme();
  // Basic validation for required props for linking and display
  if (!title || !industrySlug || !useCaseSlug) {
    console.warn("IndustrySolutionCard missing required props:", { title, industrySlug, useCaseSlug });
    return null; // Don't render the card if essential link info is missing
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      // Added h-full and flex display for consistent card height and bottom-aligned link
      className={`relative p-6 rounded-2xl overflow-hidden group h-full flex flex-col border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}
    >
      {/* Added flex-grow to make content area expand */}
      <div className="relative z-2 flex-grow">
        {/* Removed Solution Icon section (icon wasn't fetched) */}

        {/* Solution Header - Use new props */}
        <h4 className={`h4 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h4>
        <p className={`body-2 mb-6 line-clamp-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          {description || "No description available."} {/* Handle potentially missing description */}
        </p>

        {/* Removed Technical Overview Section */}
        {/* Removed Metrics Section */}
        {/* Removed Benefits Section */}
      </div>

      {/* Learn More Link - Use new props for the URL */}
      {/* Added mt-auto to push link to the bottom, pt-4 for spacing */}
      <div className="mt-auto pt-4">
        <Link
          // Use industrySlug and useCaseSlug for the link
          to={`/industries/${industrySlug}/${useCaseSlug}`}
          className="inline-flex items-center gap-2 text-primary-1 hover:text-primary-2 transition-colors font-semibold"
          aria-label={`Explore ${title} use case`}
        >
          <span>Explore {title}</span>
          <Icon name="arrow-right" className="w-4 h-4" />
        </Link>
      </div>

      {/* Background Gradient - Removed dependency on industry.color */}
      {/* Using a generic hover effect */}
      <div className={`absolute inset-0 bg-gradient-to-br
        from-primary-1/10 to-n-7 opacity-0 group-hover:opacity-10
        transition-opacity duration-500 pointer-events-none`} />
    </motion.div>
  );
};

export default IndustrySolutionCard;


