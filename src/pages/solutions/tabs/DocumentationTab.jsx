import React from 'react';
import { motion } from 'framer-motion';

const DocumentationTab = ({ solution }) => {
  return (
    <div className="grid md:grid-cols-[240px,1fr] gap-8">
      {/* Documentation Navigation */}
      <div className="space-y-4">
        {solution.documentation?.map((doc, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 rounded-lg
              hover:bg-n-6 transition-colors"
          >
            {doc.title}
          </button>
        ))}
      </div>

      {/* Documentation Content */}
      <div className="prose prose-invert max-w-none">
        <h2>Getting Started</h2>
        <p>Documentation content goes here...</p>
      </div>
    </div>
  );
};

export default DocumentationTab; 