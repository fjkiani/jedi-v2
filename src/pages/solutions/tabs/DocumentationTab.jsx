import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import CodeBlock from '@/components/CodeBlock';
import LiveCodeEditor from '@/components/LiveCodeEditor';
import { fraudDetectionDocs } from '@/constants/implementations/industries/financial/documentation';
import { getSectionDiagram } from '@/constants/implementations/industries/financial/sections/index';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';

const DocumentationTab = ({ documentation, selectedComponent, industry }) => {
  const [activeSection, setActiveSection] = useState('fundamentals');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeCode, setActiveCode] = useState('');

  const handleTryItLive = (code) => {
    setActiveCode(code);
    setIsEditorOpen(true);
  };

  // Get sections based on industry and solution
  const getSections = () => {
    if (industry.id === 'financial') {
      return [
        {
          id: 'fundamentals',
          label: 'Understanding Fraud Detection',
          icon: 'book'
        },
        {
          id: 'data-integration',
          label: 'Data Collection & Integration',
          icon: 'database'
        },
        {
          id: 'ai-analysis',
          label: 'AI Analysis Engine',
          icon: 'cpu'
        },
        {
          id: 'decision-engine',
          label: 'Decision Engine',
          icon: 'shield'
        }
      ];
    }
    
    // Healthcare sections
    if (industry.id === 'healthcare') {
      return [
        {
          id: 'data-collection',
          label: 'Data Collection & Integration',
          icon: 'database'
        },
        {
          id: 'ai-analysis',
          label: 'AI Analysis Engine',
          icon: 'cpu'
        },
        {
          id: 'clinical-decision',
          label: 'Clinical Decision Support',
          icon: 'activity'
        }
      ];
    }

    return [];
  };

  const sections = getSections();

  // Update active section when component changes
  useEffect(() => {
    if (selectedComponent?.type) {
      setActiveSection(selectedComponent.type);
    }
  }, [selectedComponent]);

  const renderSectionContent = () => {
    const diagram = getSectionDiagram(activeSection);
    const docs = industry.id === 'financial' ? fraudDetectionDocs : documentation;
    const content = docs[activeSection];
    
    console.log('Active Section:', activeSection);
    console.log('Section Diagram:', diagram);
    
    return (
      <div className="space-y-8">
        {/* Documentation content */}
        {content && (
          <div className="space-y-6">
            <div>
              <h3 className="h4 mb-4">{content.title}</h3>
              <p className="text-n-3">{content.description}</p>
            </div>

            {content.sections?.map((section, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-n-8 border border-n-6">
                <h4 className="text-lg font-medium mb-4">{section.title}</h4>
                <div className="space-y-4">
                  {section.content && (
                    <p className="text-n-3">{section.content}</p>
                  )}
                  
                  {section.keyPoints && (
                    <ul className="space-y-2">
                      {section.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Icon name="check" className="w-5 h-5 text-primary-1 mt-1" />
                          <span className="text-n-3">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.codeExample && (
                    <div className="relative">
                      <CodeBlock code={section.codeExample} language="javascript" />
                      <button
                        onClick={() => handleTryItLive(section.codeExample)}
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary-1 text-n-1 text-sm hover:bg-primary-2 transition-colors"
                      >
                        Try it Live
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Architecture Diagram */}
        {diagram && (
          <div className="mt-8">
            <h3 className="h4 mb-6">Architecture Overview</h3>
            <ArchitectureDiagram diagram={diagram} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex gap-2 p-1 rounded-xl bg-n-8 border border-n-6 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeSection === section.id 
                  ? 'bg-primary-1 text-n-1' 
                  : 'text-n-3 hover:text-n-1'
              }`}
            >
              <Icon name={section.icon} className="w-5 h-5" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {isEditorOpen && (
        <LiveCodeEditor
          code={activeCode}
          language="javascript"
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  );
};

export default DocumentationTab; 