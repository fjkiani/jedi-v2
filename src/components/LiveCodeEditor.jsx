import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Icon } from '@/components/Icon';

const LiveCodeEditor = ({ code, language = 'javascript', onClose }) => {
  const [editorCode, setEditorCode] = useState(code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const modalRef = useRef(null);

  // Custom console implementation with styled output
  const customConsole = {
    log: (...args) => {
      setOutput(prev => {
        const formattedArgs = args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        });
        return prev + formattedArgs.join(' ') + '\n';
      });
    },
    error: (...args) => {
      setOutput(prev => prev + '❌ Error: ' + args.join(' ') + '\n');
    }
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorCode]); // Re-attach listener when code changes

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleEditorChange = (value) => {
    setEditorCode(value);
  };

  const handleRunCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput('🚀 Initializing Code Execution...\n\n');

    try {
      // Replace console.log with our custom implementation
      const modifiedCode = editorCode.replace(
        /console\.log/g, 
        'customConsole.log'
      ).replace(
        /console\.error/g,
        'customConsole.error'
      );

      // Create a function that will run with our custom console
      const runCode = new Function('customConsole', `
        return (async () => {
          try {
            ${modifiedCode}
          } catch (error) {
            customConsole.error(error);
          }
        })();
      `);

      setOutput(prev => prev + '📝 Executing code...\n\n');
      
      const result = await runCode(customConsole);
      
      if (result !== undefined) {
        setOutput(prev => prev + '\n📊 Final Result:\n' + 
          '=================\n' +
          JSON.stringify(result, null, 2) +
          '\n\n✨ Execution completed successfully!\n'
        );
      }
    } catch (error) {
      setOutput(prev => 
        prev + 
        '\n❌ Execution Error:\n' +
        '=================\n' +
        error.message + '\n'
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-n-8/90" >
      <div ref={modalRef} className="relative w-[90%] max-w-5xl h-[80vh] bg-n-7 rounded-xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-n-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">Live Code Editor</h3>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-1 text-n-1 hover:bg-primary-2 transition-colors disabled:opacity-50"
              >
                <Icon name="play" className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-n-6 rounded-lg transition-colors"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex flex-1 min-h-0">
            {/* Code Editor */}
            <div className="w-1/2 h-full border-r border-n-6">
              <Editor
                height="100%"
                defaultLanguage={language}
                defaultValue={editorCode}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="w-1/2 h-full bg-n-8 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-n-6">
                <h4 className="font-medium">Output</h4>
                <button
                  onClick={() => setOutput('')}
                  className="text-sm text-n-3 hover:text-n-1"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="font-mono text-sm text-n-3 whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          </div>

          {/* Editor Footer */}
          <div className="flex items-center justify-between p-4 border-t border-n-6">
            <div className="text-sm text-n-3">
              Press Ctrl + Enter to run code
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditorCode(code)}
                className="px-3 py-1 text-sm rounded-lg hover:bg-n-6 transition-colors"
              >
                Reset Code
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(editorCode)}
                className="px-3 py-1 text-sm rounded-lg hover:bg-n-6 transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCodeEditor;
