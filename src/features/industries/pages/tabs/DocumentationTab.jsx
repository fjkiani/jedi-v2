import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';
import CodeBlock from '@/components/CodeBlock';
import LiveCodeEditor from '@/components/LiveCodeEditor';
import ArchitectureDiagram from '@/components/diagrams/ArchitectureDiagram';

const DocumentationTab = ({ documentation, industry }) => {
  const [activeSection, setActiveSection] = useState('data-integration');
  const [activeArchTab, setActiveArchTab] = useState('use-case');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeCode, setActiveCode] = useState('');

  // Get sections based on industry
  const getSections = () => {
    if (industry.id === 'financial') {
      return [
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
    return [];
  };

  const sections = getSections();

  const handleTryItLive = (code) => {
    setActiveCode(code);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
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

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Content rendering based on activeSection */}
          {/* This will be populated with the content from our documentation structure */}
        </motion.div>
      </AnimatePresence>

      {/* Live Code Editor */}
      {isEditorOpen && (
        <LiveCodeEditor
          code={activeCode}
          language="javascript"
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default DocumentationTab; 