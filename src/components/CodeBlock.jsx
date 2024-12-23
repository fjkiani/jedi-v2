import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Icon } from './Icon';

const CodeBlock = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 p-2 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        <Icon 
          name={copied ? "check" : "copy"} 
          className="w-4 h-4 text-n-1"
        />
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          borderRadius: '0.75rem',
          backgroundColor: '#1A1D1F',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock; 