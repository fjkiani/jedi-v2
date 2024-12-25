import React from 'react';
import { Icon } from '@/components/Icon';

const OverviewTab = ({ solution, industry }) => {
  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="h4 mb-4">Industry Impact</h3>
          <p className="text-n-3">{solution.fullDescription}</p>
          
          {solution.benefits && (
            <div className="mt-6">
              <h4 className="font-medium mb-4">Key Benefits</h4>
              <ul className="space-y-3">
                {solution.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="h4 mb-4">Solution Capabilities</h3>
          <ul className="space-y-3">
            {solution.capabilities?.map((capability, index) => (
              <li key={index} className="flex items-start gap-3">
                <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                <span className="text-n-3">{capability}</span>
              </li>
            ))}
          </ul>

          {solution.features && (
            <div className="mt-8">
              <h4 className="font-medium mb-4">Key Features</h4>
              <div className="grid gap-4">
                {solution.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-n-7 border border-n-6"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon 
                        name={feature.icon || 'check'} 
                        className="w-5 h-5 text-primary-1" 
                      />
                      <h5 className="font-medium">{feature.title}</h5>
                    </div>
                    <p className="text-n-3 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {solution.useCases && (
        <div>
          <h3 className="h4 mb-6">Common Use Cases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.useCases.map((useCase, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-n-7 border border-n-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center">
                    <Icon name={useCase.icon || 'layout'} className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold">{useCase.title}</h4>
                </div>
                <p className="text-n-3">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {solution.industryStats && (
        <div className="p-8 rounded-2xl bg-n-7 border border-n-6">
          <h3 className="h4 mb-6">Industry Statistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {solution.industryStats.map((stat, index) => (
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