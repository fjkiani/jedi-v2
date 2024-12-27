import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const AIResponse = ({ response }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!response) return null;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header with Model Info */}
      <div className="bg-n-8 rounded-lg p-6 sticky top-4 z-10 border border-n-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="text-white font-medium">JediLabs AI Analysis</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-n-3">Powered by</span>
                <span className="text-xs text-primary-1">{response.header.model.name}</span>
                <span className="text-xs text-n-3">|</span>
                <span className="text-xs text-n-3">{response.header.model.version}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-n-3 block">Response ID: {response.header.responseId}</span>
            <span className="text-xs text-n-3 block mt-1">
              {new Date(response.header.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{response.header.icon}</span>
          <h2 className="text-xl font-medium text-white">{response.header.title}</h2>
        </div>
        
        <p className="text-n-3 mt-2">Analyzing: "{response.header.query}"</p>
        
        {/* Model Capabilities */}
        <div className="flex flex-wrap gap-2 mt-4">
          {response.header.model.capabilities.map((capability, idx) => (
            <span key={idx} className="px-2 py-1 bg-n-7 rounded-full text-xs text-n-3">
              {capability}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between px-4 sticky top-[120px] z-10 bg-n-8/80 backdrop-blur-sm py-2 rounded-lg border border-n-6">
        {response.sections.map((section, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSection(idx)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
              ${activeSection === idx ? 'bg-primary-1 text-white' : 'text-n-3 hover:text-white'}`}
          >
            <span className="text-lg">{section.icon}</span>
            <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-4">
        {response.sections.map((section, sectionIdx) => (
          <motion.div
            key={sectionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className="bg-n-8 rounded-lg border border-n-6 overflow-hidden"
          >
            {/* Section Header - Always visible */}
            <button
              onClick={() => toggleSection(sectionIdx)}
              className="w-full flex items-center justify-between p-6 hover:bg-n-7 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h3 className="text-lg font-medium text-white">{section.title}</h3>
                  {section.subtitle && (
                    <p className="text-sm text-n-3">{section.subtitle}</p>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has(sectionIdx) ? 180 : 0 }}
                className="text-n-3"
              >
                ▼
              </motion.div>
            </button>

            {/* Section Content - Collapsible */}
            <AnimatePresence>
              {expandedSections.has(sectionIdx) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 border-t border-n-6">
                    {section.description && (
                      <p className="text-n-3 mb-6">{section.description}</p>
                    )}

                    <div className="space-y-4">
                      {section.subsections?.map((subsection, idx) => (
                        <SubSection key={idx} data={subsection} />
                      ))}
                      {section.discoveries?.map((discovery, idx) => (
                        <Discovery key={idx} data={discovery} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer - Sticky at bottom */}
      <motion.div 
        className="bg-n-8 rounded-lg p-6 border border-n-6 sticky bottom-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Confidence Score"
            value={response.footer.metrics.confidence}
            icon="📊"
          />
          <MetricCard
            label="Data Points"
            value={response.footer.metrics.dataPoints}
            icon="🔢"
          />
          <MetricCard
            label="Processing Time"
            value={response.footer.metrics.processingTime}
            icon="⚡"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-n-6">
          <div className="flex items-center space-x-4">
            {response.footer.certifications.map((cert, idx) => (
              <span key={idx} className="text-xs text-n-3">{cert}</span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-n-3">Powered by</span>
            <span className="text-xs text-primary-1">{response.footer.poweredBy}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Update SubSection to be full width
const SubSection = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-n-7 rounded-lg p-6 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-2 mb-4">
        <span>{data.marker}</span>
        <span className="font-medium text-white">{data.title}</span>
        {data.subtitle && (
          <>
            <span className="text-n-3">|</span>
            <span className="text-n-3">{data.subtitle}</span>
          </>
        )}
      </div>
      
      {data.mainPoint && (
        <div className="mb-4 text-n-2">• {data.mainPoint}</div>
      )}

      <div className="space-y-2">
        {data.details?.map((detail, idx) => (
          <div key={idx} className="text-n-3 flex items-start">
            <span className="mr-2">-</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Update Discovery to be full width
const Discovery = ({ data }) => (
  <div className="bg-n-7 rounded-lg p-6 hover:bg-n-6 transition-colors">
    <div className="flex items-center space-x-2 mb-3">
      <span>{data.marker}</span>
      <span className="font-medium text-white">{data.title}</span>
    </div>
    
    <div className="ml-6">
      <div className="mb-2 text-n-2">{data.process.title}</div>
      {data.process.steps.map((step, idx) => (
        <div key={idx} className="ml-4 text-n-3">- {step}</div>
      ))}
    </div>

    {data.result && (
      <div className="ml-6 mt-4 bg-n-7 rounded-lg p-4">
        <div className="text-white mb-2">{data.result.type}</div>
        <div className="text-primary-1 font-medium mb-2">
          {data.result.highlight}
        </div>
        {data.result.points.map((point, idx) => (
          <div key={idx} className="text-n-3">• {point}</div>
        ))}
      </div>
    )}
  </div>
);

const ValidationSection = ({ data }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2 mb-3">
      <span>{data.marker}</span>
      <span className="font-medium text-white">{data.title}</span>
    </div>
    
    <div className="ml-6">
      <div className="mb-2 text-n-2">{data.process.title}</div>
      {data.process.steps.map((step, idx) => (
        <div key={idx} className="ml-4 text-n-3">- {step}</div>
      ))}
    </div>

    {data.finding && (
      <div className="ml-6 mt-4 bg-n-7 rounded-lg p-4">
        <div className="text-white mb-2">{data.finding.type}</div>
        <div className="text-primary-1 font-medium mb-2">
          {data.finding.highlight}
        </div>
        {data.finding.points.map((point, idx) => (
          <div key={idx} className="text-n-3">• {point}</div>
        ))}
      </div>
    )}
  </div>
);

const TimelineSection = ({ data }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2 mb-3">
      <span>{data.marker}</span>
      <span className="font-medium text-white">{data.title}</span>
    </div>

    {data.plan && (
      <div className="ml-6 mt-4 bg-n-7 rounded-lg p-4">
        <div className="text-white mb-2">{data.plan.type}</div>
        <div className="text-primary-1 font-medium mb-2">
          {data.plan.highlight}
        </div>
        {data.plan.phases.map((phase, idx) => (
          <div key={idx} className="text-n-3">• {phase}</div>
        ))}
      </div>
    )}
  </div>
);

const MetricCard = ({ label, value, icon }) => (
  <div className="bg-n-7 rounded-lg p-3">
    <div className="flex items-center space-x-2 mb-1">
      <span>{icon}</span>
      <span className="text-xs text-n-3">{label}</span>
    </div>
    <div className="text-lg font-medium text-white">{value}</div>
  </div>
);

export default AIResponse; 