import React from 'react';

const AboutIcon = ({ path, viewBox, className }) => {
  return (
    <svg 
      className={className} 
      viewBox={viewBox || "0 0 24 24"} 
      fill="none"
    >
      {path.split(' M ').map((p, index) => (
        <path
          key={index}
          d={index === 0 ? p : `M${p}`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

export default AboutIcon; 