import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icon';

export const DiagramNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Helper function to flatten technology object
  const getTechList = (technologies) => {
    if (!technologies) return [];
    
    return Object.entries(technologies).reduce((acc, [category, techs]) => {
      if (typeof techs === 'object' && !Array.isArray(techs)) {
        return [...acc, ...Object.keys(techs)];
      }
      return acc;
    }, []);
  };

  const techList = getTechList(node.technologies);
  
  // Get metrics if available
  const hasMetrics = node.metrics && Object.keys(node.metrics).length > 0;
  const hasFeatures = node.features && node.features.length > 0;

  return (
    <motion.g
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="cursor-pointer"
    >
      {/* Base Node */}
      <rect
        x={node.x}
        y={node.y}
        width="250"
        height={isExpanded ? "200" : "100"}
        rx="12"
        className="fill-[#252631] stroke-[#2E2F3D]"
        initial={{ height: 100 }}
        animate={{ height: isExpanded ? 200 : 100 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Label */}
      <text
        x={node.x + 20}
        y={node.y + 30}
        className="fill-white text-base font-medium"
      >
        {node.label}
      </text>
      
      {/* Description */}
      <text
        x={node.x + 20}
        y={node.y + 50}
        className="fill-n-3 text-sm"
      >
        {node.description}
      </text>
      
      {/* Tech stack pills */}
      <g transform={`translate(${node.x + 20}, ${node.y + 65})`}>
        {techList.slice(0, 3).map((tech, idx) => (
          <g key={tech} transform={`translate(${idx * 75}, 0)`}>
            <rect
              width="70"
              height="20"
              rx="10"
              className="fill-[#1C1C27]"
            />
            <text
              x="35"
              y="14"
              className="fill-n-3 text-[10px]"
              textAnchor="middle"
            >
              {tech}
            </text>
          </g>
        ))}
        {techList.length > 3 && (
          <text
            x={3 * 75 + 10}
            y="14"
            className="fill-n-3 text-[10px]"
          >
            +{techList.length - 3} more
          </text>
        )}
      </g>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Metrics */}
            {hasMetrics && (
              <g transform={`translate(${node.x + 20}, ${node.y + 100})`}>
                <text className="fill-primary-1 text-xs font-medium">Metrics:</text>
                {Object.entries(node.metrics).map(([key, value], idx) => (
                  <text
                    key={key}
                    y={20 + idx * 16}
                    className="fill-n-3 text-[10px]"
                  >
                    {key}: {value}
                  </text>
                ))}
              </g>
            )}

            {/* Features */}
            {hasFeatures && (
              <g transform={`translate(${node.x + 140}, ${node.y + 100})`}>
                <text className="fill-primary-1 text-xs font-medium">Features:</text>
                {node.features.slice(0, 4).map((feature, idx) => (
                  <text
                    key={feature}
                    y={20 + idx * 16}
                    className="fill-n-3 text-[10px]"
                  >
                    • {feature}
                  </text>
                ))}
              </g>
            )}
          </motion.g>
        )}
      </AnimatePresence>
    </motion.g>
  );
};

export default DiagramNode;
