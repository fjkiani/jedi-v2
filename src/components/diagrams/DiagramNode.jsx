import React from 'react';
import { motion } from 'framer-motion';
import { getNodeIcon, getNodeTechInfo } from '../../utils/diagramUtils';

export const DiagramNode = ({ node, domain, onClick }) => {
  return (
    <motion.g
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Node background */}
      <rect
        x={node.x}
        y={node.y}
        width="200"
        height="80"
        rx="12"
        className="fill-[#252631] stroke-[#2E2F3D]"
      />
      
      {/* Icon */}
      <image
        href={getNodeIcon(node, domain)}
        x={node.x + 20}
        y={node.y + 20}
        width="24"
        height="24"
        style={{ filter: 'invert(1)' }}
      />
      
      {/* Label */}
      <text
        x={node.x + 55}
        y={node.y + 35}
        className="fill-white text-base font-medium"
      >
        {node.label}
      </text>
      
      {/* Tech stack pills */}
      <g>
        {getNodeTechInfo(node).map((tech, idx) => (
          <g key={tech} transform={`translate(${node.x + 55 + idx * 70}, ${node.y + 55})`}>
            <rect
              width="60"
              height="20"
              rx="10"
              className="fill-[#1C1C27]"
            />
            <text
              x="30"
              y="14"
              className="fill-n-3 text-[10px]"
              textAnchor="middle"
            >
              {tech}
            </text>
          </g>
        ))}
      </g>
    </motion.g>
  );
};
