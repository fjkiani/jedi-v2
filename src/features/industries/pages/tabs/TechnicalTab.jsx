import React from 'react';
import { Icon } from '@/components/Icon';
import CodeBlock from '@/components/CodeBlock';

const TechnicalTab = ({ solution, implementation, diagrams }) => {
  return (
    <div className="space-y-8">
      {/* Technical Overview */}
      <div className="p-6 rounded-xl bg-n-7 border border-n-6">
        <h3 className="text-xl font-medium mb-6">Technical Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {implementation?.technologies?.map((tech, index) => (
            <div key={index} className="p-4 rounded-lg bg-n-6">
              <h4 className="font-medium mb-2">{tech.name}</h4>
              <p className="text-sm text-n-3">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Details */}
      {implementation?.codeExamples?.map((example, index) => (
        <div key={index} className="p-6 rounded-xl bg-n-7 border border-n-6">
          <h4 className="font-medium mb-4">{example.title}</h4>
          <p className="text-n-3 mb-4">{example.description}</p>
          <CodeBlock code={example.code} language="javascript" />
        </div>
      ))}
    </div>
  );
};

export default TechnicalTab; 