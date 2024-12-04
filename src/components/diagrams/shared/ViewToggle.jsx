import React from 'react';

export const ViewToggle = ({ activeView, setActiveView }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setActiveView('diagram')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          activeView === 'diagram' 
            ? 'bg-primary-1 text-white' 
            : 'bg-[#252631] text-n-3 hover:text-white'
        }`}
      >
        Diagram
      </button>
      <button
        onClick={() => setActiveView('business')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          activeView === 'business' 
            ? 'bg-primary-1 text-white' 
            : 'bg-[#252631] text-n-3 hover:text-white'
        }`}
      >
        Business
      </button>
      <button
        onClick={() => setActiveView('deployment')}
        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
          activeView === 'deployment' 
            ? 'bg-primary-1 text-white' 
            : 'bg-[#252631] text-n-3 hover:text-white'
        }`}
      >
        Tech Stack
      </button>
    </div>
  );
}; 