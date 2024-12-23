import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import CodeBlock from '@/components/CodeBlock';
import LiveCodeEditor from '@/components/LiveCodeEditor';
import { documentationSections } from '@/constants/implementations/industries/financial/documentation';

const DocumentationTab = ({ documentation }) => {
  const [activeSection, setActiveSection] = useState('fundamentals');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeCode, setActiveCode] = useState('');

  const handleTryItLive = (code) => {
    setActiveCode(code);
    setIsEditorOpen(true);
  };

  const sections = [
    {
      id: 'fundamentals',
      label: 'Fundamentals',
      icon: 'book'
    },
    {
      id: 'advanced',
      label: 'Advanced Topics',
      icon: 'zap'
    },
    {
      id: 'bestPractices',
      label: 'Best Practices',
      icon: 'check-circle'
    },
    {
      id: 'examples',
      label: 'Examples',
      icon: 'code'
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: 'activity'
    }
  ];

  const renderSection = (section, content) => {
    const commonClasses = "p-4 rounded-lg bg-n-7";

    const renderContent = () => {
      switch (section.type) {
        case 'detailed':
          return content.split('\n\n').map((paragraph, idx) => (
            <div key={idx} className="mb-4">
              {paragraph.split('\n').map((line, lineIdx) => (
                <p key={lineIdx} className="text-n-3 mb-2">{line.trim()}</p>
              ))}
            </div>
          ));

        case 'list':
          let items = Array.isArray(content) ? content : [];
          
          if (section.matcher && typeof content === 'string') {
            const match = content.match(section.matcher.pattern);
            items = match ? section.matcher.transform(match[1]) : [];
          }
          
          return (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Icon name={section.icon} className="w-4 h-4 text-primary-1 mt-1" />
                  <span className="text-n-3">{item.trim()}</span>
                </li>
              ))}
            </ul>
          );

        case 'numbered':
          let steps = Array.isArray(content) ? content : [];
          
          if (section.matcher && typeof content === 'string') {
            const match = content.match(section.matcher.pattern);
            steps = match ? section.matcher.transform(match[1]) : [];
          }

          return (
            <ol className="space-y-2">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-n-6 text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-n-3">{step.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ol>
          );

        case 'code':
          return (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">🚀 Try It Yourself</h4>
                <button
                  onClick={() => handleTryItLive(content)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-1 text-n-1 hover:bg-primary-2 transition-colors"
                >
                  <Icon name="play" className="w-4 h-4" />
                  Try it Live
                </button>
              </div>
              <CodeBlock code={content} language="javascript" />
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className={commonClasses}>
        <h4 className="flex items-center gap-2 text-lg font-medium mb-3">
          <Icon name={section.icon} className="w-5 h-5 text-primary-1" />
          {section.title}
        </h4>
        {renderContent()}
      </div>
    );
  };

  const renderFundamentals = () => (
    <div className="space-y-8">
      {documentation.fundamentals.sections.map((section, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
          <h3 className="text-xl font-medium mb-4">{section.title}</h3>
          <p className="text-n-3 mb-6">{section.content}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min gap-6 mb-6">
            {/* Detailed Explanation */}
            {section.detailedExplanation && (
              <div className="p-4 rounded-lg bg-n-7">
                <h4 className="text-lg font-medium mb-4">How It Works</h4>
                {section.detailedExplanation.split('\n\n').map((paragraph, idx) => (
                  <div key={idx} className="mb-4">
                    {paragraph.split('\n').map((line, lineIdx) => (
                      <p key={lineIdx} className="text-n-3 mb-2">
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Key Points */}
            {section.keyPoints && (
              <div className="p-4 rounded-lg bg-n-7">
                <h4 className="text-lg font-medium mb-3">Key Points</h4>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="check-circle" className="w-5 h-5 text-primary-1 mt-1" />
                      <span className="text-n-3">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Purpose Section */}
            {section.explanation && (
              <div className="p-4 rounded-lg bg-n-7">
                <h4 className="flex items-center gap-2 text-lg font-medium mb-3">
                  <Icon name="target" className="w-5 h-5 text-primary-1" />
                  Purpose
                </h4>
                <ul className="space-y-2">
                  {section.explanation
                    .match(/🎯 Purpose([\s\S]*?)(?=🔍|$)/)?.[1]
                    .split('-')
                    .filter(Boolean)
                    .map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="check" className="w-4 h-4 text-primary-1 mt-1" />
                        <span className="text-n-3">{point.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Code Example (Full Width) */}
          {section.codeExample && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">🚀 Try It Yourself</h4>
                <button
                  onClick={() => handleTryItLive(section.codeExample)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-1 text-n-1 hover:bg-primary-2 transition-colors"
                >
                  <Icon name="play" className="w-4 h-4" />
                  Try it Live
                </button>
              </div>
              <CodeBlock code={section.codeExample} language="javascript" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAdvancedTopics = () => (
    <div className="space-y-8">
      {documentation.advancedTopics.topics.map((topic, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
          <h3 className="text-xl font-medium mb-4">{topic.title}</h3>
          <p className="text-n-3 mb-6">{topic.content}</p>
          
          {topic.architecture && (
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Components</h4>
              <ul className="grid grid-cols-2 gap-4 mb-6">
                {topic.architecture.components.map((component, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-n-7">
                    <Icon name="component" className="w-5 h-5 text-primary-1" />
                    <span className="text-n-3">{component}</span>
                  </li>
                ))}
              </ul>
              <CodeBlock code={topic.architecture.codeExample} language="javascript" />
            </div>
          )}

          {topic.implementation && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Implementation Steps</h4>
              <ul className="space-y-2 mb-4">
                {topic.implementation.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-n-6 flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-n-3">{step}</span>
                  </li>
                ))}
              </ul>
              <CodeBlock code={topic.implementation.codeExample} language="javascript" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderBestPractices = () => (
    <div className="space-y-8">
      {documentation.bestPractices.sections.map((section, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
          <h3 className="text-xl font-medium mb-6">{section.title}</h3>
          <div className="space-y-6">
            {section.practices.map((practice, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="font-medium">{practice.name}</h4>
                <p className="text-n-3">{practice.description}</p>
                <CodeBlock code={practice.example} language="javascript" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderExamples = () => (
    <div className="space-y-8">
      {documentation.examples.cases.map((example, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
          <h3 className="text-xl font-medium mb-4">{example.title}</h3>
          <p className="text-n-3 mb-6">{example.description}</p>
          <CodeBlock code={example.code} language="javascript" />
        </div>
      ))}
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-8">
      {documentation.monitoring.sections.map((section, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-8 border border-n-6">
          <h3 className="text-xl font-medium mb-4">{section.title}</h3>
          <p className="text-n-3 mb-6">{section.description}</p>
          <CodeBlock code={section.example} language="javascript" />
        </div>
      ))}
    </div>
  );

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
            {activeSection === 'fundamentals' && renderFundamentals()}
            {activeSection === 'advanced' && renderAdvancedTopics()}
            {activeSection === 'bestPractices' && renderBestPractices()}
            {activeSection === 'examples' && renderExamples()}
            {activeSection === 'monitoring' && renderMonitoring()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live Code Editor Modal */}
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