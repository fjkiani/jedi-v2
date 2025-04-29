import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { Icon } from '@/components/Icon'; // Assuming Icon component is correctly set up
import { useTheme } from '@/context/ThemeContext'; // Import useTheme

// Helper to render lists with icons - Enhanced Styling
const RenderListSection = ({ title, items, iconName }) => {
  const { isDarkMode } = useTheme();
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Use theme for text color */}
      <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'} flex items-center gap-2`}>
        <Icon name={iconName} className="w-5 h-5 text-primary-1" />
        {title}
      </h4>
      {/* Use theme for text color */}
      <ul className="space-y-2 pl-1">
        {items.map((item, index) => (
          <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
            {/* Use a consistent, themed check icon */}
            <Icon name="check-circle" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IndustryApplicationCard = ({ application }) => {
  const { isDarkMode } = useTheme(); // Get theme status

  if (!application) {
    // Use theme for text color
    return <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>Application data is missing.</p>;
  }

  const {
    applicationTitle,
    tagline,
    industryChallenge,
    jediApproach,
    keyCapabilities = [],
    expectedResults = [],
    jediComponent = [],
  } = application;

  return (
    <motion.div
      // Use theme for background, border, and shadow
      className={`p-6 md:p-8 rounded-xl ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} border shadow-md`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header Section (Spans full width) */}
      <div className="mb-8 border-b pb-6 border-n-6/50">
        <h3 className={`h4 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{applicationTitle}</h3>
        {tagline && <p className="text-md text-color-1 font-medium">{tagline}</p>}
      </div>

      {/* Responsive Two-Column Layout (Grid) */}
      {/* Stacks on small screens, 3 columns on large screens (2 for main, 1 for sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* --- Main Content Column (Challenge & Approach) --- */}
        {/* Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Challenge */}
          {/* Use theme for background, border, and text */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-8 border-n-5' : 'bg-n-2 border-n-3'} border`}>
            <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>The Challenge</h4>
            {/* Adjust prose theme */}
            <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none prose-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
              {industryChallenge?.raw ? (
                <RichText content={industryChallenge.raw} />
              ) : (
                <p>Details not available.</p>
              )}
            </div>
          </div>

          {/* Jedi Approach */}
          {/* Use theme for background, border, and text */}
           <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-8 border-n-5' : 'bg-n-2 border-n-3'} border`}>
            <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>The Jedi Approach</h4>
            {/* Adjust prose theme */}
            <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none prose-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
               {jediApproach?.raw ? (
                <RichText content={jediApproach.raw} />
               ) : (
                <p>Details not available.</p>
               )}
            </div>
          </div>
        </div>

        {/* --- Sidebar Column (Capabilities, Results, Components) --- */}
        {/* Takes 1 column on large screens */}
        <div className="lg:col-span-1 space-y-8">
          {/* Capabilities */}
          <RenderListSection title="Key Capabilities" items={keyCapabilities} iconName="check-square" />

          {/* Expected Results */}
          <RenderListSection title="Expected Results" items={expectedResults} iconName="trending-up" />

          {/* Jedi Components Used */}
          {jediComponent && jediComponent.length > 0 && (
            <div>
              {/* Use theme for text color */}
              <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'} flex items-center gap-2`}>
                <Icon name="puzzle" className="w-5 h-5 text-primary-1" />
                Key Jedi Components
              </h4>
              <div className="flex flex-wrap gap-2">
                {jediComponent.map(comp => (
                  <Link
                    key={comp.id}
                    to={`/technology/${comp.slug}`} // Link to technology detail page
                    // Use theme for background, border, text, and hover states
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-n-6 border-n-5 text-n-2 hover:text-n-1' : 'bg-n-2 border-n-3 text-n-6 hover:text-n-8'} border hover:border-primary-1 transition-colors text-xs font-medium`}
                    title={comp.name}
                  >
                    {comp.icon?.url ? (
                      <img src={comp.icon.url} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                    ) : (
                      // Use theme for fallback icon color
                      <Icon name="cpu" className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`} />
                    )}
                    <span className="truncate max-w-[150px]">{comp.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div> {/* End Sidebar Column */}

      </div> {/* End Grid Layout */}
    </motion.div>
  );
};

export default IndustryApplicationCard; 