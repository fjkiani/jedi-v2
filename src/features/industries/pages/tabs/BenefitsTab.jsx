import React from 'react';
import { Icon } from '@/components/Icon';

const BenefitsTab = ({ benefits }) => {
  if (!benefits || benefits.length === 0) {
    return <p className="text-n-4 italic">Key benefits information not available.</p>;
  }

  return (
    <div>
      <h3 className="h4 mb-4">Key Benefits</h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <Icon name="check" className="w-6 h-6 text-primary-1 mt-1 flex-shrink-0" />
            <span className="text-n-3">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsTab; 
