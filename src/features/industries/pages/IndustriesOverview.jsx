import React from 'react';
import Section from '@/components/Section';
import { industriesList } from '@/constants/industry';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';

const IndustriesOverview = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="h1 mb-4">Industries Overview</h1>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Explore how our AI solutions transform different industries
          </p>
        </div>

        {/* Industries List */}
        <div className="grid gap-8">
          {industriesList.map((industry) => (
            <div 
              key={industry.id}
              className="p-8 rounded-2xl bg-n-7 border border-n-6"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${industry.color} 
                  flex items-center justify-center flex-shrink-0`}>
                  <Icon name={industry.icon} className="w-8 h-8 text-n-1" />
                </div>

                <div>
                  {/* Title */}
                  <h3 className="h3 mb-4">{industry.title}</h3>
                  
                  {/* Description */}
                  <p className="body-2 text-n-3 mb-6">
                    {industry.description}
                  </p>

                  {/* Solutions */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {industry.solutions.map((solution, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-1" />
                        <span className="text-n-1">{solution.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More */}
                  <Link 
                    to={`/industries/${industry.id}`}
                    className="button button-primary"
                  >
                    Learn More
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default IndustriesOverview; 