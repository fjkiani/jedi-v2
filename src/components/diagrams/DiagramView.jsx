import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { DiagramNode } from './DiagramNode';
import { DiagramConnection } from './DiagramConnection';

export const DiagramView = ({ diagram }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  console.log('DiagramView received:', diagram); // Debug log
  
  // Calculate dimensions based on nodes with padding
  const dimensions = useMemo(() => {
    if (!diagram?.nodes?.length) return { width: 1400, height: 900 };
    
    const padding = 150; // Increased padding
    const maxX = Math.max(...diagram.nodes.map(n => n.x + 300));
    const maxY = Math.max(...diagram.nodes.map(n => n.y + 250));
    
    return {
      width: Math.max(maxX + padding, 1400),
      height: Math.max(maxY + padding, 900)
    };
  }, [diagram?.nodes]);

  // Pan handling
  const handleMouseDown = (e) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!diagram?.nodes) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No diagram data available.</p>
      </div>
    );
  }

  // Draw security zones if available
  const renderZones = () => {
    if (!diagram.zones) return null;

    return diagram.zones.map(zone => {
      const zoneNodes = zone.nodes.map(nodeId => 
        diagram.nodes.find(n => n.id === nodeId)
      ).filter(Boolean);

      if (zoneNodes.length === 0) return null;

      const minX = Math.min(...zoneNodes.map(n => n.x)) - 100;
      const minY = Math.min(...zoneNodes.map(n => n.y)) - 100;
      const maxX = Math.max(...zoneNodes.map(n => n.x + 250)) + 100;
      const maxY = Math.max(...zoneNodes.map(n => n.y + 100)) + 100;

      return (
        <g key={zone.id}>
          {/* Zone background */}
          <rect
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            rx="24"
            className="fill-[#1C1C27] stroke-[#2E2F3D]"
            fillOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Zone label container - positioned above the zone */}
          <g transform={`translate(${minX}, ${minY - 70})`}>
            {/* Label background */}
            <rect
              x="0"
              y="0"
              width="300"
              height="50"
              rx="8"
              className="fill-[#1C1C27] stroke-[#2E2F3D]"
              fillOpacity="0.95"
            />
            {/* Zone name */}
            <text
              x="20"
              y="22"
              className="fill-n-3 text-sm font-medium"
            >
              {zone.label}
            </text>
            {/* Security and compliance info */}
            <text
              x="20"
              y="38"
              className="fill-n-4 text-xs"
            >
              {zone.security} • {zone.compliance.join(', ')}
            </text>
          </g>
        </g>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="p-2 bg-n-6 rounded hover:bg-n-5"
        >
          <Icon name="plus" className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
          className="p-2 bg-n-6 rounded hover:bg-n-5"
        >
          <Icon name="minus" className="w-4 h-4" />
        </button>
        <button 
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
          className="p-2 bg-n-6 rounded hover:bg-n-5"
        >
          <Icon name="refresh" className="w-4 h-4" />
        </button>
      </div>
      
      {/* Diagram container */}
      <div 
        className="relative overflow-hidden border border-n-6 rounded-lg bg-n-8"
        style={{ height: '800px' }} // Increased from 700px
      >
        <div 
          onMouseDown={handleMouseDown}
          style={{ 
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: '0 0',
            cursor: 'grab',
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            position: 'relative'
          }}
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0"
          >
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0 0, L12 4, L0 8, L3 4 Z"
                  fill="#2A85FF"
                  className="transition-colors duration-200"
                />
              </marker>
              
              <marker
                id="arrowhead-secondary"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0 0, L12 4, L0 8, L3 4 Z"
                  fill="#4D4E5A"
                />
              </marker>
            </defs>

            {/* Security Zones */}
            {renderZones()}

            {/* Draw connections */}
            {diagram.connections?.map((connection, index) => {
              const fromNode = diagram.nodes.find(n => n.id === connection.from);
              const toNode = diagram.nodes.find(n => n.id === connection.to);
              
              return (
                <DiagramConnection
                  key={`${connection.from}-${connection.to}`}
                  connection={connection}
                  fromNode={fromNode}
                  toNode={toNode}
                />
              );
            })}

            {/* Draw nodes */}
            {diagram.nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <DiagramNode node={node} />
              </motion.g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DiagramView;
