import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon'; // Assuming Icon component exists and works

// Helper function to render list items safely
const renderList = (items, iconName = 'check') => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-n-4">Not available.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-n-3">
          <Icon name={iconName} className="w-4 h-4 text-primary-1 mt-0.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const SolutionSidebar = ({ useCase }) => {
  // Ensure useCase data exists before trying to access its properties
  if (!useCase) {
    return (
      <div className="sticky top-20 space-y-6 p-6 bg-n-7 rounded-lg border border-n-6">
        <p className="text-n-4">Loading sidebar data...</p>
      </div>
    );
  }

  const { capabilities, metrics, technologies } = useCase;

  return (
    // Sticky positioning to keep sidebar visible on scroll
    <div className="sticky top-20 space-y-8 p-6 bg-n-7 rounded-2xl border border-n-6 shadow-lg">

      {/* Key Capabilities Section */}
      <div>
        <h3 className="h5 mb-4 text-n-1">Key Capabilities</h3>
        {renderList(capabilities, 'check-circle')}
      </div>

      {/* Metrics Section */}
      <div>
        <h3 className="h5 mb-4 text-n-1">Metrics</h3>
        {renderList(metrics, 'bar-chart-2')}
      </div>

      {/* Technologies Used Section */}
      <div>
        <h3 className="h5 mb-4 text-n-1">Technologies Used</h3>
        {technologies && technologies.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <Link
                key={tech.id}
                to={`/technology/${tech.slug}`} // Link to the technology detail page
                className="flex items-center gap-2 px-3 py-1 bg-n-6 rounded-full border border-n-5 hover:border-primary-1 transition-colors"
                title={tech.name} // Tooltip for full name
              >
                {tech.icon?.url ? (
                  <img src={tech.icon.url} alt={tech.name} className="w-5 h-5 object-contain" />
                ) : (
                  <Icon name="code" className="w-4 h-4 text-n-3" /> // Fallback icon
                )}
                <span className="text-xs font-medium text-n-2 truncate max-w-[100px]">{tech.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-n-4">Technology information not available.</p>
        )}
      </div>

      {/* Optional: Add a CTA or related links section if needed */}
      {/* <div className="pt-6 border-t border-n-6">
        <h4 className="text-sm font-semibold mb-3 text-n-2">Interested?</h4>
        <Link to="/contact" className="button button-sm button-gradient w-full">
          Contact Us
        </Link>
      </div> */}
    </div>
  );
};

export default SolutionSidebar;
