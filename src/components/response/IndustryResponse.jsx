import { motion } from 'framer-motion';
import CardSlider from './visualizations/CardSlider';
import ContentCard from './visualizations/ContentCard';

const IndustryResponse = ({ response }) => {
  if (!response) return null;

  // Helper functions for card variant
  const renderComponentCards = (components) => {
    if (!components) return null;
    
    const cards = components.map(comp => (
      <ContentCard
        key={comp.name}
        title={comp.name}
        description={comp.description}
        technologies={comp.technologies}
        details={comp.details}
        explanation={comp.explanation}
      />
    ));

    return <CardSlider cards={cards} />;
  };

  const renderFlowCards = (flow) => {
    if (!flow) return null;

    const cards = flow.map(step => (
      <ContentCard
        key={step.step}
        title={step.step}
        description={step.description}
        details={step.details}
      />
    ));

    return <CardSlider cards={cards} />;
  };

  // Find sections by title for card variant
  const findSection = (title) => {
    return response.sections?.find(section => section.title === title);
  };

  // Get content from subsections for card variant
  const getSubsectionContent = (sectionTitle, subsectionTitle) => {
    const section = findSection(sectionTitle);
    return section?.subsections?.find(sub => sub.title === subsectionTitle)?.content;
  };

  return (
    <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-n-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary-1 animate-pulse" />
            <h3 className="text-lg font-semibold text-n-1">
              {response.header?.title || response.title || 'AI Analysis'}
            </h3>
          </div>
          <div className="text-xs text-n-3">
            Powered by Industry AI
          </div>
        </div>
        {response.header?.query && (
          <p className="text-n-3 mt-2">{response.header.query}</p>
        )}
      </div>

      {/* Content */}
      <div className="divide-y divide-n-6">
        {response.sections?.map((section, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl text-primary-1">{section.icon}</span>
              <h4 className="text-lg font-semibold text-n-1">{section.title}</h4>
            </div>

            <div className="space-y-6">
              {section.title === "SYSTEM OVERVIEW" && (
                <>
                  <div className="p-4 rounded-lg bg-n-7 border border-n-6">
                    <p className="text-n-3">
                      {getSubsectionContent("SYSTEM OVERVIEW", "System Architecture")}
                    </p>
                  </div>
                  {renderComponentCards(
                    getSubsectionContent("SYSTEM OVERVIEW", "Core Components")?.map(text => {
                      const [name, ...rest] = text.split(':');
                      const [description, ...points] = rest.join(':').split('\n');
                      return {
                        name,
                        description: description.trim(),
                        explanation: points.map(p => p.trim().replace('• ', ''))
                      };
                    })
                  )}
                </>
              )}

              {section.title === "PROCESSING FLOW" && (
                renderFlowCards(
                  getSubsectionContent("PROCESSING FLOW", "Analysis Steps")?.map(text => {
                    const [step, description] = text.split(':');
                    return {
                      step,
                      description: description.trim()
                    };
                  })
                )
              )}

              {section.title === "CAPABILITIES" && (
                <>
                  {renderComponentCards(
                    getSubsectionContent("CAPABILITIES", "Key Features")?.map(text => {
                      const [name, ...points] = text.split('\n');
                      return {
                        name: name.replace(':', ''),
                        explanation: points.map(p => p.trim().replace('• ', ''))
                      };
                    })
                  )}
                  {renderComponentCards(
                    getSubsectionContent("CAPABILITIES", "Technical Details")?.map(text => {
                      const [name, techLine, details] = text.split('\n');
                      return {
                        name: name.replace(':', ''),
                        technologies: techLine.replace('• Technologies: ', '').split(', '),
                        details: details.replace('• ', '')
                      };
                    })
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {response.footer && (
        <div className="border-t border-n-6 p-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4">
              {response.footer.metrics && (
                <>
                  <div>
                    <p className="text-sm text-n-3">Confidence</p>
                    <p className="text-white">{response.footer.metrics.confidence}</p>
                  </div>
                  <div>
                    <p className="text-sm text-n-3">Data Points</p>
                    <p className="text-white">{response.footer.metrics.dataPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-n-3">Processing Time</p>
                    <p className="text-white">{response.footer.metrics.processingTime}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {response.footer.certifications?.map((cert, index) => (
                <span key={index} className="px-2 py-1 bg-n-7 rounded text-sm text-n-1">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryResponse; 