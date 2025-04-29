import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { FiX, FiCheckSquare, FiTrendingUp, FiCpu, FiActivity, FiInfo, FiBarChart2 } from 'react-icons/fi';
import { Icon } from '@/components/Icon'; // Re-use Icon component if available
import { useTheme } from '@/context/ThemeContext';
import Button from './Button'; // Assuming Button component exists

// Helper to render rich text safely
const renderRichText = (content) => {
  if (!content?.raw) return null;
  return <RichText content={content.raw} />;
};

// Helper to render lists
const renderList = (items, iconName = 'check-square', itemClassName = '', iconClassName = 'text-primary-1') => {
  const { isDarkMode } = useTheme();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p className={`text-sm italic ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>N/A</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'} ${itemClassName}`}>
          <Icon name={iconName} className={`w-4 h-4 ${iconClassName} mt-0.5 flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

// Detail Section Component
const DetailSection = ({ title, iconName, children, isDarkMode }) => (
  <div>
    <h4 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'} flex items-center gap-2`}>
      <Icon name={iconName} className="w-5 h-5 text-primary-1" />
      {title}
    </h4>
    <div className={`${isDarkMode ? 'text-n-3' : 'text-n-6'} prose prose-sm dark:prose-invert max-w-none`}>
      {children}
    </div>
  </div>
);

const UseCaseDetailView = ({ useCase, onClose }) => {
  const { isDarkMode } = useTheme();
  const [activeComponentId, setActiveComponentId] = useState(null); // If needed for component interaction

  if (!useCase) return null;

  const {
    title,
    tagline,
    description,
    industry,
    technologies = [],
    keyCapabilities = [],
    expectedResults = [],
    industryChallenge,
    jediApproach,
    jediComponent = [],
    metrics = [],
    implementation, // Assuming this is Rich Text or JSON
  } = useCase;

  // Basic rendering for implementation JSON for now
  const renderImplementation = (impl) => {
    if (!impl?.raw) return <p className={`text-sm italic ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>N/A</p>;
    // In a real scenario, parse and format the JSON properly
    // For now, just render the raw JSON structure if available
    // Or preferably, render RichText if implementation is a RichText field
     return (
       <div className={`p-4 rounded-md ${isDarkMode ? 'bg-n-8' : 'bg-n-2'} text-xs overflow-auto`}>
          <RichText content={impl.raw} />
       </div>
     );
  };

  return (
    <motion.div
      className={`relative rounded-2xl border ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'} shadow-xl overflow-hidden p-6 md:p-10`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */} 
      <button 
        onClick={onClose} 
        className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'text-n-4 hover:bg-n-7' : 'text-n-5 hover:bg-n-2'} transition-colors z-10`}
        aria-label="Close details"
      >
        <FiX size={20} />
      </button>

      {/* Header */}
      <div className="mb-8 border-b pb-6 border-n-6/50 pr-10">
        <span className="text-xs uppercase tracking-wider text-n-3 mb-2 block">
          {industry?.name || 'Use Case Details'}
        </span>
        <h2 className={`h2 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h2>
        {tagline && <p className="text-lg text-color-1 font-medium">{tagline}</p>}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {description && (
            <DetailSection title="Overview" iconName="info" isDarkMode={isDarkMode}>
              <p className="body-2 whitespace-pre-wrap">{description}</p>
            </DetailSection>
          )}
          
          {industryChallenge && (
             <DetailSection title="The Challenge" iconName="alert-triangle" isDarkMode={isDarkMode}>
               {renderRichText(industryChallenge)}
             </DetailSection>
          )}
          
          {jediApproach && (
             <DetailSection title="Our Approach" iconName="lightbulb" isDarkMode={isDarkMode}>
                {renderRichText(jediApproach)}
             </DetailSection>
          )}
          
          {implementation && (
             <DetailSection title="Implementation Details" iconName="code" isDarkMode={isDarkMode}>
               {renderImplementation(implementation)}
             </DetailSection>
          )}
        </div>

        {/* Right/Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
           {keyCapabilities.length > 0 && (
            <DetailSection title="Key Capabilities" iconName="check-square" isDarkMode={isDarkMode}>
              {renderList(keyCapabilities, 'check-circle', '', 'text-green-500')}
            </DetailSection>
           )}

           {expectedResults.length > 0 && (
            <DetailSection title="Expected Results" iconName="trending-up" isDarkMode={isDarkMode}>
              {renderList(expectedResults, 'award', '', 'text-blue-500')}
            </DetailSection>
           )}
           
           {metrics.length > 0 && (
            <DetailSection title="Success Metrics" iconName="bar-chart-2" isDarkMode={isDarkMode}>
              {renderList(metrics, 'activity', '', 'text-purple-500')}
            </DetailSection>
           )}

           {jediComponent.length > 0 && (
            <DetailSection title="Core Jedi Components" iconName="puzzle" isDarkMode={isDarkMode}>
               <div className="flex flex-wrap gap-2">
                {jediComponent.map(comp => (
                  <Link
                    key={comp.id}
                    to={`/technology/${comp.slug}`} // Assuming technology detail pages exist
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                      isDarkMode ? 'bg-n-6 border-n-5 text-n-3 hover:text-n-1 hover:border-n-4' : 'bg-n-2 border-n-3 text-n-5 hover:text-n-7 hover:border-n-4'
                    } transition-colors`}
                    title={comp.name}
                  >
                    {comp.icon?.url ? (
                      <img src={comp.icon.url} alt="" className="w-3.5 h-3.5" />
                    ) : (
                       <Icon name="cpu" className="w-3.5 h-3.5" />
                    )}
                    <span>{comp.name}</span>
                  </Link>
                ))}
              </div>
            </DetailSection>
           )}
           
           {/* Consider adding technologies list here too if desired */}
           
        </div>
      </div>

       {/* Optional: Add a more prominent close button at the bottom */}
       <div className="mt-10 text-center">
            <Button onClick={onClose} variant="secondary">Close Details</Button>
       </div>
    </motion.div>
  );
};

export default UseCaseDetailView; 