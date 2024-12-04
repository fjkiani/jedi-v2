import React from 'react';

export const SectionHeader = ({ title, count }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-medium text-white">{title}</h3>
    <span className="px-2 py-1 text-xs text-n-3 bg-[#252631] rounded-full">
      {count} items
    </span>
  </div>
); 