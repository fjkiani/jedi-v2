import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { FiPlay, FiCode } from 'react-icons/fi';

const scope = {
  useState: React.useState,
  useEffect: React.useEffect,
  React: React,
  render: (val) => val,
  Configuration: null,
  OpenAIApi: null
};

const defaultCode = `
function Example() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Interactive Example</h3>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          background: '#6366f1',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}

render(<Example />);
`.trim();

const InteractiveCode = ({ codeExample }) => {
  return (
    <LiveProvider 
      code={codeExample || defaultCode}
      scope={scope}
      noInline={false}
    >
      <div className="bg-n-7 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FiCode />
            Interactive Example
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-n-8 rounded-lg overflow-hidden">
            <LiveEditor 
              className="p-4"
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          <LiveError 
            className="text-red-500 p-2 rounded bg-red-500/10"
          />

          <div className="bg-n-8 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiPlay className="text-primary-1" />
              <h4 className="text-sm font-medium">Output</h4>
            </div>
            <LivePreview />
          </div>
        </div>
      </div>
    </LiveProvider>
  );
};

export default InteractiveCode;

