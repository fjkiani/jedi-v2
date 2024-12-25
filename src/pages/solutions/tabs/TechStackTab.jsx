import React from 'react';
import { Icon } from '@/components/Icon';

const TechStackTab = ({ solution, onTechClick }) => {
  return (
    <div className="space-y-10">
      {Object.entries(solution.techStack).map(([category, technologies]) => (
        <div key={category}>
          <h3 className="h4 mb-6 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(technologies).map(([name, tech]) => (
              <div 
                key={name}
                onClick={() => onTechClick(name)}
                className="bg-n-7 rounded-xl p-6 border border-n-6 cursor-pointer 
                         transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={tech.icon} alt={name} className="w-8 h-8" />
                  <h4 className="font-semibold text-white">{name}</h4>
                </div>
                <p className="text-n-3 mb-4">{tech.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-primary-1">
                  <span>View Implementation Details</span>
                  <Icon name="arrow-right" className="w-4 h-4" />
                </div>

                {tech.useCases && (
                  <div className="mt-4 pt-4 border-t border-n-6">
                    <h5 className="text-sm font-medium text-n-3 mb-2">
                      Related Use Cases:
                    </h5>
                    <ul className="text-sm text-n-4">
                      {solution.businessValue.useCases
                        .filter(useCase => tech.useCases.includes(useCase))
                        .map((useCase, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-1"></span>
                            {useCase}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackTab; 