import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';
import { getIconForCategory } from '@/constants/categoryIcons';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';

const TECH_TABS = {
  CORE: { id: 'Core' },
  SUPPORTING: { id: 'Supporting' },
  BENEFITS: { id: 'Benefits' },
  METRICS: { id: 'Metrics' }
};

const TechStackTabs = {
  [TECH_TABS.CORE.id]: ({ solution }) => {
    const primaryTech = solution?.techStack?.primary;

    if (!primaryTech?.id) {
      return (
        <div className="p-4 text-n-3 text-center">
          No primary technologies configured
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-n-7 
            border border-n-6 hover:border-primary-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-n-6 flex items-center justify-center">
            <Icon 
              name={getIconForCategory(primaryTech.id) || 'cube'} 
              className="w-6 h-6 text-primary-1" 
            />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-n-1">
              {primaryTech.id.charAt(0).toUpperCase() + primaryTech.id.slice(1)}
            </div>
            <div className="text-sm text-n-3">
              {primaryTech.usage || 'Primary technology'}
            </div>
          </div>
          {primaryTech.implementation && (
            <div className="text-xs text-n-3 bg-n-6 px-2 py-1 rounded">
              {primaryTech.implementation}
            </div>
          )}
        </motion.div>
      </div>
    );
  },

  [TECH_TABS.SUPPORTING.id]: ({ solution }) => {
    const supportingTechs = solution?.techStack?.supporting || [];

    if (!supportingTechs.length) {
      return (
        <div className="p-4 text-n-3 text-center">
          No supporting technologies configured
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {supportingTechs.map((tech, index) => {
          // Safe access to tech properties
          const techId = tech?.id || `tech-${index}`;
          const displayName = techId.charAt(0).toUpperCase() + techId.slice(1);
          const usage = tech?.usage || 'Supporting technology';
          const features = tech?.features || [];

          return (
            <motion.div
              key={techId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-n-7 border border-n-6"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-n-6 flex items-center justify-center">
                  <Icon 
                    name={getIconForCategory(techId) || 'cube'} 
                    className="w-5 h-5 text-primary-1" 
                  />
                </div>
                <div className="font-semibold text-n-1">{displayName}</div>
              </div>
              <div className="text-sm text-n-3 mb-3">{usage}</div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full bg-n-6 text-sm text-n-3"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  },

  [TECH_TABS.BENEFITS.id]: ({ solution }) => {
    const benefits = solution?.benefits || [];

    if (!benefits.length) {
      return (
        <div className="p-4 text-n-3 text-center">
          No benefits configured
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-n-7 border border-n-6"
          >
            <div className="font-semibold text-n-1 mb-2">
              {benefit.title || 'Untitled Benefit'}
            </div>
            <div className="text-sm text-n-3">
              {benefit.description || 'No description available'}
            </div>
          </motion.div>
        ))}
      </div>
    );
  },

  [TECH_TABS.METRICS.id]: ({ solution }) => {
    const metrics = solution?.metrics || [];

    if (!metrics.length) {
      return (
        <div className="p-4 text-n-3 text-center">
          No metrics configured
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-n-7 border border-n-6"
          >
            <div className="h5 mb-1 text-primary-1">
              {metric.value || '0'}
            </div>
            <div className="text-sm text-n-3">
              {metric.label || 'Unlabeled Metric'}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
};

// Debug helper
const debugTechStack = (solution) => {
  console.log('Tech Stack Structure:', {
    primary: solution?.techStack?.primary,
    supporting: solution?.techStack?.supporting,
    benefits: solution?.benefits,
    metrics: solution?.metrics
  });
};

// Add this debug component wrapper
const DebugWrapper = ({ solution }) => {
  React.useEffect(() => {
    console.group('Tech Stack Debug');
    console.log('Solution:', solution);
    console.log('Tech Stack:', solution?.techStack);
    console.log('Primary:', solution?.techStack?.primary);
    console.groupEnd();
  }, [solution]);

  return null;
};

const IndustryHero = ({ industry }) => {
  if (!industry) {
    return <div>Loading...</div>;
  }

  const [activeTab, setActiveTab] = useState(TECH_TABS.CORE.id);
  const solution = industry?.solutions?.[0];
  const TabContent = TechStackTabs[activeTab];

  // Debug log
  React.useEffect(() => {
    debugTechStack(solution);
  }, [solution]);

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <DebugWrapper solution={solution} />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="relative z-10">
            {/* Breadcrumb */}
            <div className="text-n-3 mb-6 flex items-center gap-2">
              <Link to="/industries" className="hover:text-n-1">Industries</Link>
              <Icon name="arrow-right" className="w-4 h-4" />
              <span className="text-n-1">{industry.title}</span>
            </div>

            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-[72px] leading-[1.15] font-medium mb-6">
                {industry.title}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-n-3/75 text-2xl mb-10 max-w-[90%]"
            >
              {industry.description}
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {industry.metrics?.map((metric, index) => (
                <div key={index} className="text-2xl text-n-1">
                  {metric}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {industry.actions?.map((action, index) => (
                <Link 
                  key={index}
                  to={action.path}
                  className={`button ${action.variant}`}
                >
                  {action.icon && <Icon name={action.icon} className="w-5 h-5 mr-2" />}
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Tech Stack & Image */}
          <div className="relative lg:pl-10">
            {/* Tech Stack Section with Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-n-8 border border-n-6 rounded-2xl overflow-hidden mb-8"
            >
              <div className="border-b border-n-6 p-4">
                <div className="flex gap-2">
                  {Object.entries(TechStackTabs).map(([tabKey, TabContent]) => (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${activeTab === tabKey 
                          ? 'bg-primary-1 text-n-1' 
                          : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
                    >
                      {tabKey}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {solution ? (
                  <TabContent solution={solution} />
                ) : (
                  <div className="text-n-3 text-center">No solution data available</div>
                )}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src={industry.heroImage}
                alt={industry.title}
                className="w-full h-auto rounded-2xl"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} opacity-40`} />
            </motion.div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className={`absolute top-0 right-0 w-1/2 h-full 
          bg-radial-gradient ${industry.color} opacity-20 blur-xl pointer-events-none`} />
      </div>
    </Section>
  );
};

export default IndustryHero;
