import { motion } from 'framer-motion';
import { useState } from 'react';
import CardSlider from './visualizations/CardSlider';
import ContentCard from './visualizations/ContentCard';

const AIResponse = ({ response }) => {
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

  // Find sections by title
  const findSection = (title) => {
    return response.sections?.find(section => section.title === title);
  };

  // Get content from subsections
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
              {response.title || 'AI Analysis'}
            </h3>
          </div>
          <div className="text-xs text-n-3">
            Powered by Industry AI
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-n-6">
        {response.sections?.map((section, index) => (
          <div key={index} className="p-4">
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl text-primary-1">{section.icon}</span>
                <h4 className="text-lg font-semibold text-n-1">{section.title}</h4>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has(index) ? 180 : 0 }}
                className="text-n-3"
              >
                ▼
              </motion.div>
            </button>

            {expandedSections.has(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-6"
              >
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
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIResponse; 