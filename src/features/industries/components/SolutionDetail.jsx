import React from 'react';
import { Icon } from '@/components/Icon'; // Assuming Icon component exists
// Consider adding a syntax highlighter component if you have one, e.g., react-syntax-highlighter
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Example style

// Simple placeholder for code block - replace with a real syntax highlighter if available
const CodeBlock = ({ code, language = 'javascript' }) => {
  if (!code) return null;
  return (
    <pre className="bg-n-8 p-4 rounded-lg overflow-x-auto text-sm text-n-3 border border-n-6 my-4">
      <code>{code}</code>
    </pre>
  );
};

const SolutionDetail = ({ useCase }) => {
  // Ensure useCase data exists
  if (!useCase) {
    return (
      <div className="p-6 bg-n-7 rounded-lg border border-n-6">
        <p className="text-n-4">Loading solution details...</p>
      </div>
    );
  }

  const { architecture, implementation } = useCase;
  const archDesc = architecture?.description;
  const components = architecture?.components;
  const flow = architecture?.flow;
  const codeSnippet = implementation?.codeSnippet; // Assuming key 'codeSnippet' in JSON
  const diagramUrl = implementation?.architectureDiagramUrl; // Assuming key 'architectureDiagramUrl' in JSON

  return (
    <div className="space-y-10 p-6 bg-n-7 rounded-2xl border border-n-6 shadow-lg">

      {/* Architecture Overview Section */}
      {archDesc && (
        <div>
          <h3 className="h4 mb-4 text-n-1 flex items-center gap-2">
            <Icon name="architecture" className="w-6 h-6 text-primary-1" /> {/* Use appropriate icon */}
            Architecture Overview
          </h3>
          <p className="body-2 text-n-3 whitespace-pre-line">{archDesc}</p>
        </div>
      )}

      {/* Architecture Components Section */}
      {components && components.length > 0 && (
        <div>
          <h3 className="h4 mb-6 text-n-1 flex items-center gap-2">
             <Icon name="puzzle" className="w-6 h-6 text-primary-1" /> {/* Use appropriate icon */}
            Key Components
          </h3>
          <div className="space-y-6">
            {components.map((comp) => (
              <div key={comp.id} className="p-4 bg-n-6 rounded-lg border border-n-5">
                <h4 className="font-semibold text-n-1 mb-2">{comp.name}</h4>
                <p className="text-sm text-n-3 mb-3">{comp.description}</p>
                {comp.details && <p className="text-xs text-n-4 italic mb-3">Details: {comp.details}</p>}
                {comp.explanation && comp.explanation.length > 0 && (
                   <ul className="list-disc list-inside text-xs text-n-4 space-y-1">
                     {comp.explanation.map((exp, idx) => <li key={idx}>{exp}</li>)}
                   </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture Flow Section */}
      {flow && flow.length > 0 && (
        <div>
          <h3 className="h4 mb-6 text-n-1 flex items-center gap-2">
            <Icon name="git-branch" className="w-6 h-6 text-primary-1" /> {/* Use appropriate icon */}
            Process Flow
          </h3>
          <ol className="relative border-l border-n-5 space-y-6 ml-2">
            {flow.map((step, index) => (
              <li key={step.id || index} className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary-1 rounded-full -left-3 ring-4 ring-n-7 text-n-8 font-bold text-xs">
                  {index + 1}
                </span>
                <h4 className="font-semibold text-n-1 mb-1">{step.step}</h4>
                <p className="text-sm text-n-3 mb-2">{step.description}</p>
                {step.details && <p className="text-xs text-n-4 italic">Details: {step.details}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Implementation: Code Snippet Section */}
      {codeSnippet && (
        <div>
          <h3 className="h4 mb-4 text-n-1 flex items-center gap-2">
            <Icon name="code" className="w-6 h-6 text-primary-1" />
            Code Example
          </h3>
          {/* Replace CodeBlock with your actual SyntaxHighlighter component if available */}
          <CodeBlock code={codeSnippet} language="python" />
        </div>
      )}

      {/* Implementation: Architecture Diagram Section */}
      {diagramUrl && (
        <div>
          <h3 className="h4 mb-4 text-n-1 flex items-center gap-2">
            <Icon name="image" className="w-6 h-6 text-primary-1" />
            Architecture Diagram
          </h3>
          <div className="p-4 bg-n-6 rounded-lg border border-n-5 flex justify-center">
            <img
              src={diagramUrl}
              alt="Architecture Diagram"
              className="max-w-full h-auto rounded-md shadow-md"
            />
          </div>
        </div>
      )}

      {/* Fallback if no specific content is available */}
      {!archDesc && (!components || components.length === 0) && (!flow || flow.length === 0) && !codeSnippet && !diagramUrl && (
         <p className="text-n-4 text-center py-8">Detailed information not yet available for this solution.</p>
      )}

    </div>
  );
};

export default SolutionDetail; 