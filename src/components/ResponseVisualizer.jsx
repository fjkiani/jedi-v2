import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const ResponseVisualizer = ({ response }) => {
  const [activeSection, setActiveSection] = useState(0);
  
  if (!response) return null;
  
  const { header, sections, footer } = response;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-n-1/10 pb-4">
        <div className="text-3xl">{header.icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{header.title}</h2>
          <p className="text-n-3">{header.query}</p>
        </div>
      </div>
      
      {/* Sections Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-n-1/10 pb-4">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === index 
                ? 'bg-primary-1 text-n-8' 
                : 'bg-n-7 text-n-3 hover:bg-n-6'
            }`}
            onClick={() => setActiveSection(index)}
          >
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>
      
      {/* Active Section Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{sections[activeSection].title}</h3>
          <p className="text-n-3 text-sm">{sections[activeSection].description}</p>
        </div>
        
        {sections[activeSection].subsections.map((subsection, idx) => (
          <div key={idx} className="border border-n-1/10 rounded-lg p-4">
            <h4 className="text-base font-medium mb-4">{subsection.title}</h4>
            
            {/* Render different content types */}
            {subsection.type === 'reactflow' && subsection.content && (
              <div className="h-[400px] bg-n-7 rounded-lg overflow-hidden">
                <ReactFlow
                  nodes={subsection.content.nodes || []}
                  edges={subsection.content.edges || []}
                  fitView
                >
                  <Background color="#333" gap={16} />
                  <Controls />
                </ReactFlow>
              </div>
            )}
            
            {!subsection.type && Array.isArray(subsection.content) && (
              <div className="space-y-3">
                {subsection.content.map((item, i) => (
                  <div key={i} className="border border-n-1/10 rounded-lg p-3 bg-n-7">
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <h5 className="font-medium">{item.name}</h5>
                    </div>
                    {item.description && (
                      <p className="text-sm text-n-3 mt-1">{item.description}</p>
                    )}
                    {Array.isArray(item.details) && item.details.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {item.details.map((detail, d) => (
                          <li key={d} className="text-sm flex items-start gap-2">
                            <span className="text-primary-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.technologies.map((tech, t) => (
                          <span key={t} className="px-2 py-1 bg-n-8 rounded-md text-lg">
                            {tech.icon} {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!subsection.type && typeof subsection.content === 'string' && (
              <div className="bg-n-7 rounded-lg p-4 whitespace-pre-wrap text-sm">
                {subsection.content}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-n-1/10 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {footer.metrics && Object.entries(footer.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-lg text-n-3 uppercase">{key}</p>
                  <p className="text-lg font-medium">{value}</p>
                </div>
              ))}
            </div>
            
            {Array.isArray(footer.certifications) && footer.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {footer.certifications.map((cert, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-1/10 text-primary-1 rounded-full text-lg">
                    {cert}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseVisualizer; 
    <div className="space-y-4">
      {/* Metadata Display */}
      <div className="flex items-center justify-between text-sm text-n-3">
        <div className="flex items-center space-x-4">
          <span>Confidence: {metadata.confidence}%</span>
          <span>Processing Time: {metadata.processingTime}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          {actions.map(action => (
            <motion.button
              key={action.type}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full bg-n-7 text-n-1 text-lg"
              onClick={() => handleAction(action)}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Related Queries */}
      <div className="flex flex-wrap gap-2">
        {relatedQueries.map((query, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 rounded-full bg-primary-1 bg-opacity-10 text-primary-1 text-lg"
            onClick={() => handleRelatedQuery(query)}
          >
            {query}
          </motion.button>
        ))}
      </div>
    </div>
  );
}; 