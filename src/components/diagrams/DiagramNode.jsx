import React from 'react';
import { motion } from 'framer-motion';

export const DiagramNode = ({ node }) => {
  // Helper function to flatten technology object
  const getTechList = (technologies) => {
    if (!technologies) return [];
    
    return Object.entries(technologies).reduce((acc, [category, techs]) => {
      // Handle array format
      if (Array.isArray(techs)) {
        return [...acc, ...techs];
      }
      // Handle object format with descriptions
      if (typeof techs === 'object') {
        return [...acc, ...Object.keys(techs)];
      }
      return acc;
    }, []);
  };

  const techList = getTechList(node.technologies);

  return (
    <motion.g
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
    >
      {/* Node background */}
      <rect
        x={node.x}
        y={node.y}
        width="250"
        height="100"
        rx="12"
        className="fill-[#252631] stroke-[#2E2F3D]"
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
    </motion.g>
  );
};
