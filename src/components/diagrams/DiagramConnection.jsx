import React from 'react';

export const DiagramConnection = ({ connection, nodes }) => {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);
  
  if (!fromNode || !toNode) return null;

  const startX = fromNode.x + 200;
  const startY = fromNode.y + 40;
  const endX = toNode.x;
  const endY = toNode.y + 40;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
        fill="none"
        className="stroke-[#4D4E5A]"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      {connection.label && (
        <text
          x={(startX + endX) / 2}
          y={(startY + endY) / 2 - 10}
          className="fill-n-3 text-xs"
          textAnchor="middle"
        >
          {connection.label}
        </text>
      )}
    </g>
  );
}; 