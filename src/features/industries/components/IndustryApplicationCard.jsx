import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { Icon } from '@/components/Icon'; // Assuming Icon component is correctly set up

// Helper to render lists with icons
const RenderListSection = ({ title, items, iconName }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-n-3 flex items-center gap-2">
        <Icon name={iconName} className="w-5 h-5 text-primary-1" />
        {title}
      </h4>
      <ul className="space-y-2 pl-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-n-3">
            <Icon name="check-circle" className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IndustryApplicationCard = ({ application }) => {
  if (!application) {
    return <p className="text-n-4">Application data is missing.</p>;
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
      className="p-6 rounded-xl bg-n-7 border border-n-6 shadow-md space-y-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div>
        <h3 className="h4 mb-1">{applicationTitle}</h3>
        {tagline && <p className="text-md text-color-1 font-medium">{tagline}</p>}
      </div>

      {/* Challenge */}
      <div className="p-4 rounded-lg bg-n-8 border border-n-5">
        <h4 className="text-lg font-semibold mb-2 text-n-3">The Challenge</h4>
        <div className="prose prose-invert max-w-none prose-sm text-n-3">
          {industryChallenge?.raw ? (
            <RichText content={industryChallenge.raw} />
          ) : (
            <p>Details not available.</p>
          )}
        </div>
      </div>

      {/* Jedi Approach */}
       <div className="p-4 rounded-lg bg-n-8 border border-n-5">
        <h4 className="text-lg font-semibold mb-2 text-n-3">The Jedi Approach</h4>
        <div className="prose prose-invert max-w-none prose-sm text-n-1">
           {jediApproach?.raw ? (
            <RichText content={jediApproach.raw} />
           ) : (
            <p>Details not available.</p>
           )}
        </div>
      </div>

      {/* Capabilities */}
      <RenderListSection title="Key Capabilities Enabled" items={keyCapabilities} iconName="check-square" />

      {/* Expected Results */}
      <RenderListSection title="Expected Results & Value" items={expectedResults} iconName="trending-up" />


      {/* Jedi Components Used */}
      {jediComponent && jediComponent.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 text-n-3 flex items-center gap-2">
            <Icon name="puzzle" className="w-5 h-5 text-primary-1" />
            Key Jedi Components Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {jediComponent.map(comp => (
              <Link
                key={comp.id}
                // Point to a future component detail page if desired, otherwise '#' or just display text
                to={`/technology/${comp.slug}`} // Assuming technology detail page exists
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-n-6 border border-n-5 hover:border-primary-1 transition-colors text-xs font-medium text-n-2 hover:text-n-1"
                title={comp.name}
              >
                {comp.icon?.url ? (
                  <img src={comp.icon.url} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                ) : (
                  <Icon name="cpu" className="w-4 h-4 flex-shrink-0 text-n-3" /> // Fallback icon
                )}
                <span className="truncate max-w-[150px]">{comp.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IndustryApplicationCard; 