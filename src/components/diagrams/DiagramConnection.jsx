import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const DiagramConnection = ({ connection, fromNode, toNode }) => {
  if (!fromNode || !toNode) return null;

  // Style based on connection type
  const getConnectionStyle = () => {
    switch (connection.type) {
      case 'primary':
        return {
          stroke: '#2A85FF',
          strokeWidth: 2,
          filter: 'url(#glow)',
          strokeDasharray: 'none'
        };
      case 'secondary':
        return {
          stroke: '#4D4E5A',
          strokeWidth: 1.5,
          strokeDasharray: '4 4'
        };
      case 'monitoring':
        return {
          stroke: '#7FBA7A',
          strokeWidth: 1,
          strokeDasharray: '2 2'
        };
      default:
        return {
          stroke: '#2A85FF',
          strokeWidth: 2,
          strokeDasharray: 'none'
        };
    }
  };

  const style = getConnectionStyle();

  // Calculate control points for the curve
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  
  // Adjust control points based on vertical/horizontal distance
  const isVertical = Math.abs(dy) > Math.abs(dx);
  
  let controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y;
  
  if (isVertical) {
    // For vertical connections
    const midY = (fromNode.y + toNode.y) / 2;
    controlPoint1X = fromNode.x + 250;
    controlPoint1Y = fromNode.y + (dy * 0.15); // Reduced from 0.2
    controlPoint2X = toNode.x;
    controlPoint2Y = toNode.y - (dy * 0.15); // Adjusted for symmetry
  } else {
    // For horizontal connections
    controlPoint1X = fromNode.x + (dx * 0.4);
    controlPoint1Y = fromNode.y + 50;
    controlPoint2X = toNode.x - (dx * 0.4); // More pronounced curve
    controlPoint2Y = toNode.y + 50;
  }

  // Create two paths - one for the arrow and one for the dots
  const getOffsetPath = (offset) => {
    const verticalOffset = offset; // pixels above/below main path
    
    if (isVertical) {
      return `M ${fromNode.x + 250} ${fromNode.y + 50 + offset} 
              C ${controlPoint1X} ${controlPoint1Y + offset},
                ${controlPoint2X} ${controlPoint2Y + offset},
                ${toNode.x} ${toNode.y + 50 + offset}`;
    } else {
      return `M ${fromNode.x + 250} ${fromNode.y + 50 + offset} 
              C ${controlPoint1X} ${controlPoint1Y + offset},
                ${controlPoint2X} ${controlPoint2Y + offset},
                ${toNode.x} ${toNode.y + 50 + offset}`;
    }
  };

  const mainPath = getOffsetPath(0);  // Main path for the arrow
  const dotsPath = getOffsetPath(connection.type === 'secondary' ? -4 : 4);  // Offset path for dots

  // Calculate label position
  const labelX = (fromNode.x + toNode.x + 250) / 2;
  const labelY = (fromNode.y + toNode.y) / 2;
  
  // Adjust label position based on connection type
  const labelOffset = connection.type === 'secondary' ? -30 : 
                     connection.type === 'monitoring' ? 30 : 0;

  const [isHovered, setIsHovered] = useState(false);

  // Create unique ID for this connection's path
  const connectionId = `connection-${connection.from}-${connection.to}`;

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <defs>
        <filter id={`glow-${connectionId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="glow"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`labelGradient-${connectionId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#252631', stopOpacity: 0.98 }} />
          <stop offset="100%" style={{ stopColor: '#1C1C27', stopOpacity: 0.98 }} />
        </linearGradient>
      </defs>
      {/* Main connection path with arrow */}
      <motion.path
        id={connectionId}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          strokeWidth: isHovered ? style.strokeWidth * 1.5 : style.strokeWidth
        }}
        transition={{ duration: 0.5 }}
        d={mainPath}
        fill="none"
        style={{
          ...style,
          filter: style.filter ? `url(#glow-${connectionId})` : undefined
        }}
        markerEnd="url(#arrowhead)"
      />

      {/* Hidden path for dots (no arrow) */}
      <path
        id={`${connectionId}-dots`}
        d={dotsPath}
        stroke="none"
        fill="none"
      />

      {/* Connection Label with Background */}
      <motion.g
        animate={{
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? labelOffset - 2 : labelOffset
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        transform={`translate(${labelX}, ${labelY})`}
      >
        <rect
          x="-80"
          y="-32"
          width="160"
          height="50"
          rx="10"
          className="stroke-[#2E2F3D]"
          fill={`url(#labelGradient-${connectionId})`}
          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
        />
        <text
          className="fill-n-3 text-xs font-medium tracking-wide"
          textAnchor="middle"
          y="-12"
        >
          {connection.label}
        </text>
        {connection.protocol && (
          <text
            className="fill-n-4 text-[11px]"
            textAnchor="middle"
            y="10"
          >
            {connection.protocol}
          </text>
        )}
      </motion.g>

      {/* Add flowing dots along the offset path */}
      <g>
        {[0, 0.33, 0.66].map((offset, i) => (
          <circle 
            key={i} 
            r="2" 
            fill={style.stroke} 
            opacity="0.6"
          >
            <motion.animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin={`${offset * 3}s`}
              path={dotsPath}
            >
              <mpath href={`#${connectionId}-dots`} />
            </motion.animateMotion>
          </circle>
        ))}
      </g>
    </g>
  );
};

export default DiagramConnection; 