import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { getIconForCategory } from '@/constants/categoryIcons';

// Fallback icons for different tech types
const TECH_TYPE_ICONS = {
  ai: 'brain',
  database: 'database',
  analytics: 'chart-bar',
  integration: 'plug',
  security: 'shield',
  cloud: 'cloud',
  default: 'cube'
};

// Helper function to get icon based on tech ID
const getTechIcon = (techId) => {
  if (!techId) return TECH_TYPE_ICONS.default;
  
  // First try category icons
  const categoryIcon = getIconForCategory(techId);
  if (categoryIcon) return categoryIcon;

  // Fallback to tech type icons
  const techType = techId.toLowerCase();
  return Object.entries(TECH_TYPE_ICONS).find(([key]) => 
    techType.includes(key)
  )?.[1] || TECH_TYPE_ICONS.default;
};

const formatTechName = (techId) => {
  if (!techId) return 'Unknown Technology';
  return techId.charAt(0).toUpperCase() + techId.slice(1);
};

const IndustrySolutionCard = ({ solution, industry, relationships, index }) => {
  const metrics = solution.metrics || [];
  const technologies = solution.technologies || [];
  const benefits = solution.benefits || [];

  // Debug log
  console.log('Solution Data:', {
    solution,
    techStack: solution?.techStack,
    primary: solution?.techStack?.primary,
    supporting: solution?.techStack?.supporting
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-8 rounded-3xl bg-n-7 border border-n-6 overflow-hidden group"
    >
      <div className="relative z-2">
        {/* Solution Icon */}
        <div className={`w-12 h-12 mb-6 rounded-xl bg-gradient-to-br ${industry.color} 
          flex items-center justify-center`}>
          <Icon name={solution.icon || 'bulb'} className="w-6 h-6 text-n-1" />
        </div>

        {/* Solution Header */}
        <h4 className="h4 mb-4">{solution.title}</h4>
        <p className="body-2 text-n-3 mb-6">{solution.description}</p>

        {/* Technical Overview */}
        <div className="mb-6 p-4 rounded-xl bg-n-6">
          <h5 className="text-n-1 mb-3">Technical Overview</h5>
          <div className="space-y-3">
            {/* Primary Technology */}
            {solution?.techStack?.primary && (
              <div>
                <div className="text-sm text-primary-1 mb-1">Core Technology</div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-n-7">
                  <Icon 
                    name={getTechIcon(solution.techStack.primary.id)} 
                    className="w-5 h-5 text-primary-1" 
                  />
                  <div>
                    <div className="text-sm text-n-1">
                      {formatTechName(solution.techStack.primary.id)}
                    </div>
                    <div className="text-xs text-n-3">
                      {solution.techStack.primary.usage || 'Primary technology'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supporting Technologies */}
            {solution?.techStack?.supporting?.length > 0 && (
              <div>
                <div className="text-sm text-primary-1 mb-1">Supporting Technologies</div>
                <div className="space-y-2">
                  {solution.techStack.supporting.map((tech, idx) => {
                    if (!tech) return null;
                    
                    return (
                      <div key={idx} className="p-3 rounded-lg bg-n-7">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon 
                            name={getTechIcon(tech.id)} 
                            className="w-5 h-5 text-primary-1" 
                          />
                          <div className="text-sm text-n-1">
                            {formatTechName(tech.id)}
                          </div>
                        </div>
                        <div className="text-xs text-n-3">
                          {tech.usage || 'Supporting technology'}
                        </div>
                        {tech.features?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tech.features.map((feature, fidx) => (
                              <span 
                                key={fidx}
                                className="px-2 py-1 text-xs rounded-full bg-n-6 text-primary-1"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Implementation Details */}
            {solution?.architecture?.components?.length > 0 && (
              <div>
                <div className="text-sm text-primary-1 mb-1">Implementation Details</div>
                <div className="space-y-2">
                  {solution.architecture.components.map((component, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-n-7">
                      <div className="text-sm text-n-1 mb-1">{component.name}</div>
                      <div className="text-xs text-n-3">{component.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {metrics.map((metric, i) => (
              <div key={i} className="p-4 rounded-2xl bg-n-6">
                <div className="h5 mb-1 text-primary-1">{metric.value}</div>
                <div className="text-sm text-n-3">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Benefits Section */}
        {benefits.length > 0 && (
          <div className="mb-6">
            <h5 className="text-n-1 mb-3">Benefits & Implementation</h5>
            {benefits.map((benefit, i) => (
              <div key={i} className="mb-4 p-4 rounded-xl bg-n-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="check-circle" className="w-5 h-5 text-primary-1" />
                  <span className="text-n-1">{benefit.title}</span>
                </div>
                {benefit.description && (
                  <p className="text-sm text-n-3 mb-3">{benefit.description}</p>
                )}
                {benefit.enabledBy && (
                  <div className="space-y-2">
                    <div className="text-xs text-primary-1">Technical Implementation:</div>
                    <div className="flex flex-wrap gap-2">
                      {benefit.enabledBy.map((tech, techIdx) => (
                        <div key={techIdx} className="p-2 rounded-lg bg-n-7">
                          <div className="text-xs text-n-1">{tech}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Learn More Link */}
        <Link
          to={`/industries/${industry.id}/${solution.id}`}
          className="flex items-center gap-2 text-primary-1 hover:text-primary-2 transition-colors"
        >
          <span>Learn More</span>
          <Icon name="arrow-right" className="w-4 h-4" />
        </Link>
      </div>

      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br 
        ${industry.color} opacity-0 group-hover:opacity-10 
        transition-opacity duration-500`} />
    </motion.div>
  );
};

export default IndustrySolutionCard;


