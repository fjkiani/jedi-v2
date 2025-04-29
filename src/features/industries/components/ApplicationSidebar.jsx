import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon'; 
import { useTheme } from '@/context/ThemeContext';

// Helper function to render list items safely
const renderList = (items, iconName = 'check-circle', itemClassName = '', iconClassName = 'text-green-500') => {
  const { isDarkMode } = useTheme();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Not available.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'} ${itemClassName}`}>
          <Icon name={iconName} className={`w-4 h-4 ${iconClassName} mt-0.5 flex-shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

// Renamed props from 'useCase' to 'application'
const ApplicationSidebar = ({ application }) => {
  const { isDarkMode } = useTheme();

  // Ensure application data exists
  if (!application) {
    return (
      // Use theme for background, border, text
      <div className={`sticky top-20 space-y-6 p-6 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} rounded-lg border`}>
        <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>Loading sidebar data...</p>
      </div>
    );
  }

  // Destructure relevant fields from 'application' prop
  const { keyCapabilities = [], expectedResults = [], jediComponent = [] } = application;

  // --- ADD THIS LOG ---
  console.log('[ApplicationSidebar] Received application data:', {
      keyCapabilities,
      expectedResults,
      jediComponent
  });
  // --------------------

  return (
    // Sticky positioning, use theme for background, border, shadow
    <div className={`sticky top-20 space-y-8 p-6 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} rounded-2xl border shadow-lg`}>

      {/* Key Capabilities Section - Use 'capabilities' from application */}
      <div>
        <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Capabilities</h3>
        {renderList(keyCapabilities, 'check-square', '', 'text-primary-1')}
      </div>

      {/* Expected Results Section - Use 'results' from application */}
      <div>
        <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Expected Results</h3>
        {renderList(expectedResults, 'trending-up', '', 'text-blue-500')}
      </div>

      {/* Jedi Components Used Section - Use 'components' from application */}
      <div>
        <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Jedi Components</h3>
        {jediComponent && jediComponent.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {jediComponent.map((comp) => (
              <Link
                key={comp.id}
                to={`/technology/${comp.slug}`} // Link to the component detail page
                // Use theme for tag styling
                className={`flex items-center gap-2 px-3 py-1.5 ${isDarkMode ? 'bg-n-6 border-n-5 text-n-2 hover:text-n-1' : 'bg-n-2 border-n-3 text-n-6 hover:text-n-8'} rounded-full border hover:border-primary-1 transition-colors`}
                title={comp.name} // Tooltip for full name
              >
                {comp.icon?.url ? (
                  <img src={comp.icon.url} alt={comp.name} className="w-5 h-5 object-contain" />
                ) : (
                  // Use theme for fallback icon
                  <Icon name="cpu" className={`w-4 h-4 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`} />
                )}
                <span className="text-xs font-medium truncate max-w-[100px]">{comp.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Component information not available.</p>
        )}
      </div>

      {/* Optional CTA can remain */}
      {/* <div className="pt-6 border-t border-n-6">
        <h4 className="text-sm font-semibold mb-3 text-n-2">Interested?</h4>
        <Link to="/contact" className="button button-sm button-gradient w-full">
          Contact Us
        </Link>
      </div> */}
    </div>
  );
};

export default ApplicationSidebar; 