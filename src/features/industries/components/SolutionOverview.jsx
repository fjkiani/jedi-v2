import React from 'react';
import { Icon } from '@/components/Icon';
import { financialOverview } from '@/constants/implementations/industries/financial/overview';
import { healthcareOverview } from '@/constants/implementations/industries/healthcare/overview';

const INDUSTRY_OVERVIEWS = {
  financial: financialOverview,
  healthcare: healthcareOverview
};

const SolutionOverview = ({ industry, solution, onComponentClick }) => {
  const industryOverview = INDUSTRY_OVERVIEWS[industry.id];
  const config = industryOverview?.[solution.id];

  const handleComponentClick = (step) => {
    if (!step.type) return;
    
    onComponentClick({
      id: step.type,
      title: step.title,
      description: step.description,
      technologies: step.technologies || { core: [], features: [] }
    });
  };

  // If no config is found, show a fallback UI
  if (!config) {
    return (
      <div className="space-y-10">
        <div>
          <h2 className="h3 mb-4">Overview</h2>
          <p className="text-n-3 mb-8">{solution.fullDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Main Overview */}
      <div>
        <h2 className="h3 mb-4">{config.title}</h2>
        <p className="text-n-3 mb-8">{config.description}</p>
      </div>

      {/* Workflow Section */}
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-medium mb-6">{config.workflow.title}</h3>
          <p className="text-n-3 mb-6">{config.workflow.description}</p>
          <div className="space-y-6">
            {config.workflow.steps.map((step, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-n-7 border border-n-6 cursor-pointer transition-all hover:bg-n-6"
                onClick={() => handleComponentClick(step)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-n-6 flex items-center justify-center">
                    <Icon name={step.icon} className="w-6 h-6 text-primary-1" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      {step.title}
                      <Icon name="arrow-right" className="w-4 h-4 text-primary-1" />
                    </h4>
                    <p className="text-n-3 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details?.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="check" className="w-4 h-4 text-primary-1 mt-1" />
                          <span className="text-sm text-n-3">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Technology Preview - Only show if technologies exist */}
                    {step.technologies && step.technologies.core && (
                      <div className="mt-4 pt-4 border-t border-n-6">
                        <div className="flex items-center gap-2 text-sm text-n-3">
                          <Icon name="tool" className="w-4 h-4" />
                          <span>Technologies: </span>
                          <span className="text-primary-1">
                            {step.technologies.core.join(', ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Points Section */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-n-7 border border-n-6">
            <h3 className="text-xl font-medium mb-6">Key Capabilities</h3>
            <div className="grid gap-6">
              {config.keyPoints?.map((point, index) => (
                <div key={index} className="p-4 rounded-lg bg-n-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon name={point.icon} className="w-6 h-6 text-primary-1" />
                    <div>
                      <h4 className="font-medium">{point.title}</h4>
                      <p className="text-sm text-n-3">{point.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {point.metrics?.map((metric, idx) => (
                      <div key={idx} className="px-3 py-2 rounded bg-n-7 text-sm text-n-3">
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionOverview;