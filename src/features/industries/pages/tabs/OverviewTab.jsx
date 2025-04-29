import React from 'react';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';

// Updated: Displays Impact, Benefits, Use Cases, Statistics
const OverviewTab = ({ industryData }) => {
  if (!industryData) {
    return <div className="text-n-4">Loading overview data...</div>;
  }

  // Destructure required fields
  const {
    fullDescription,
    benefits = [],
    relatedUseCases = [],
    statisticsJson = [],
    slug // Need slug for use case links
  } = industryData;

  return (
    <div className="space-y-10">
      {/* Impact Section (Rich Text) */}
      <div>
        <h3 className="h4 mb-4">Industry Impact</h3>
        {fullDescription?.raw?.children?.map((node, index) => (
          <p key={index} className="text-n-3 mb-3">
            {node.children?.map(child => child.text).join('')}
          </p>
        )) || <p className="text-n-4 italic">Detailed description not available.</p>}
      </div>

      {/* Benefits Section */}
      {benefits && benefits.length > 0 && (
        <div>
          <h3 className="h4 mb-4">Key Benefits</h3>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <Icon name="check" className="w-6 h-6 text-primary-1 mt-1 flex-shrink-0" />
                <span className="text-n-3">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Use Cases Section */}
      {relatedUseCases && relatedUseCases.length > 0 && (
        <div>
          <h3 className="h4 mb-6">Related Use Cases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedUseCases.map((useCase) => (
              <Link
                key={useCase.id}
                to={`/industries/${slug}/${useCase.slug}`} // Use industry slug
                className="block p-6 rounded-xl bg-n-7 border border-n-6 hover:border-primary-1 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center flex-shrink-0">
                    <Icon name={'layout'} className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary-1 transition-colors">{useCase.title}</h4>
                </div>
                <p className="text-n-3 line-clamp-3">{useCase.description || "Click to learn more."}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {statisticsJson && statisticsJson.length > 0 && (
        <div className="p-8 rounded-2xl bg-n-7 border border-n-6">
          <h3 className="h4 mb-6">Industry Statistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {statisticsJson.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-1 mb-2">
                  {stat.value}
                </div>
                <p className="text-n-3">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;