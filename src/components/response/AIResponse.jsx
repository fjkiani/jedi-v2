import { motion } from 'framer-motion';

const AIResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className="space-y-6">
      {/* Header with Model Info */}
      <div className="bg-n-8 rounded-lg p-6">
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
            <span 
              key={idx}
              className="px-2 py-1 bg-n-7 rounded-full text-xs text-n-3"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-4">
        {response.sections.map((section, sectionIdx) => {
          const shouldBePaired = 
            section.title?.includes('HOW AI PROCESSED') || 
            section.title?.includes('MAJOR DISCOVERIES') ||
            section.title?.includes('TECHNICAL VALIDATION') || 
            section.title?.includes('IMPLEMENTATION ROADMAP');

          // Skip if this is the second item of a pair we've already rendered
          if (shouldBePaired && 
              (section.title?.includes('MAJOR DISCOVERIES') || 
               section.title?.includes('IMPLEMENTATION ROADMAP')) && 
              sectionIdx % 2 === 1) {
            return null;
          }

          // If it's the first of a pair
          if (shouldBePaired && sectionIdx % 2 === 0) {
            const nextSection = response.sections[sectionIdx + 1];
            
            return (
              <div key={sectionIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="bg-n-8 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-white">{section.title}</h3>
                      {section.subtitle && (
                        <p className="text-sm text-n-3">{section.subtitle}</p>
                      )}
                    </div>
                  </div>
                  {section.description && (
                    <p className="text-n-3 mb-4">{section.description}</p>
                  )}
                  {section.subsections?.map((subsection, idx) => (
                    <SubSection key={idx} data={subsection} />
                  ))}
                  {section.discoveries?.map((discovery, idx) => (
                    <Discovery key={idx} data={discovery} />
                  ))}
                </motion.div>

                {/* Next Section */}
                {nextSection && shouldBePaired && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (sectionIdx + 1) * 0.1 }}
                    className="bg-n-8 rounded-lg p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{nextSection.icon}</span>
                      <div>
                        <h3 className="text-lg font-medium text-white">{nextSection.title}</h3>
                        {nextSection.subtitle && (
                          <p className="text-sm text-n-3">{nextSection.subtitle}</p>
                        )}
                      </div>
                    </div>
                    {nextSection.description && (
                      <p className="text-n-3 mb-4">{nextSection.description}</p>
                    )}
                    {nextSection.subsections?.map((subsection, idx) => (
                      <SubSection key={idx} data={subsection} />
                    ))}
                    {nextSection.discoveries?.map((discovery, idx) => (
                      <Discovery key={idx} data={discovery} />
                    ))}
                  </motion.div>
                )}
              </div>
            );
          }

          // Regular full-width sections (anything not in a pair)
          if (!shouldBePaired) {
            return (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIdx * 0.1 }}
                className="bg-n-8 rounded-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-white">{section.title}</h3>
                    {section.subtitle && (
                      <p className="text-sm text-n-3">{section.subtitle}</p>
                    )}
                  </div>
                </div>
                {section.description && (
                  <p className="text-n-3 mb-4">{section.description}</p>
                )}
                {section.subsections?.map((subsection, idx) => (
                  <SubSection key={idx} data={subsection} />
                ))}
                {section.discoveries?.map((discovery, idx) => (
                  <Discovery key={idx} data={discovery} />
                ))}
              </motion.div>
            );
          }
        })}
      </div>

      {/* Footer */}
      <div className="bg-n-8 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
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
      </div>
    </div>
  );
};

// Subcomponents
const SubSection = ({ data }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-2 mb-2">
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
      <div className="ml-6 mb-2 text-n-2">• {data.mainPoint}</div>
    )}

    {data.details?.map((detail, idx) => (
      <div key={idx} className="ml-8 text-n-3">- {detail}</div>
    ))}

    {data.bulletPoints?.map((point, idx) => (
      <div key={idx} className="ml-6">
        {typeof point === 'string' ? (
          <div className="text-n-3">• {point}</div>
        ) : (
          <div>
            <div className="text-n-2">• {point.title}</div>
            {point.details.map((detail, detailIdx) => (
              <div key={detailIdx} className="ml-4 text-n-3">- {detail}</div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

const Discovery = ({ data }) => (
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