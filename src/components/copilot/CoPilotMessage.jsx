import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import ProgressiveDisclosure from './ProgressiveDisclosure';

const CoPilotMessage = ({ message, onSuggestedQuery }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex gap-3 mb-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🤖</span>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-none">
        {/* Message Bubble */}
        <div className={`rounded-lg p-4 ${
          message.isError 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
            : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}>
          {/* Main Content */}
          <div className="text-gray-900 dark:text-white text-sm leading-relaxed mb-3">
            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
          </div>

          {/* Suggested Queries */}
          {message.suggestedQueries && message.suggestedQueries.length > 0 && (
            <div className="mb-3">
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {message.suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestedQuery(query)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200 border border-purple-200 dark:border-purple-700"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Content */}
          {message.hasInteractiveContent && message.responseData && (
            <ProgressiveDisclosure 
              responseData={message.responseData}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onSuggestedQuery={onSuggestedQuery}
            />
          )}

          {/* Timestamp */}
          <div className="text-lg text-gray-400 dark:text-gray-500 mt-2">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoPilotMessage; 