import React from 'react';

const ResearchAssistantDemo = () => {
  const [query, setQuery] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Mock OpenAI API call structure for demonstration
  const mockOpenAICall = `
    // Real implementation would use:
    const openai = new OpenAIApi(new Configuration({ apiKey: 'your-api-key' }));
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Research Assistant' },
        { role: 'user', content: 'Analyze: ' + query }
      ]
    });
  `;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockResponse = {
        findings: [
          `Recent developments in ${query} research`,
          `New methodologies for studying ${query}`,
          `International collaboration advances in ${query}`
        ],
        nextSteps: [
          "Review latest publications",
          "Identify research gaps",
          "Develop research proposals"
        ]
      };

      setResult(mockResponse);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        findings: ['Error retrieving findings.'],
        nextSteps: ['Error retrieving next steps.']
      });
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', { style: { padding: '20px', color: 'white' } }, [
    React.createElement('h3', { key: 'title' }, 'Research Assistant'),
    React.createElement('pre', {
      key: 'api-example',
      style: { 
        background: '#1f2937',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        marginBottom: '16px'
      }
    }, mockOpenAICall),
    React.createElement('div', {
      key: 'hint',
      style: { marginBottom: '10px', fontSize: '14px', color: '#9CA3AF' }
    }, "Try searching for topics like cancer, climate change, or AI advancements."),
    React.createElement('input', {
      key: 'input',
      type: 'text',
      value: query,
      onChange: (e) => setQuery(e.target.value),
      placeholder: "Enter your research topic...",
      style: {
        width: '100%',
        padding: '8px',
        marginBottom: '16px',
        borderRadius: '4px',
        border: '1px solid #6366f1',
        background: '#1f2937',
        color: 'white'
      }
    }),
    React.createElement('button', {
      key: 'button',
      onClick: handleSearch,
      disabled: loading,
      style: {
        background: loading ? '#4B5563' : '#6366f1',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer'
      }
    }, loading ? 'Loading...' : 'Search Research'),
    result && React.createElement('div', {
      key: 'results',
      style: {
        marginTop: '20px',
        background: '#1f2937',
        padding: '16px',
        borderRadius: '8px'
      }
    }, [
      React.createElement('h4', {
        key: 'result-title',
        style: { color: '#6366f1', marginBottom: '16px' }
      }, `Results for: ${query}`),
      React.createElement('div', { key: 'findings' }, [
        React.createElement('h5', {
          key: 'findings-title',
          style: { color: '#9CA3AF', marginBottom: '8px' }
        }, 'Key Findings:'),
        React.createElement('ul', {
          key: 'findings-list',
          style: { paddingLeft: '20px' }
        }, result.findings.map((finding, index) =>
          React.createElement('li', {
            key: index,
            style: { marginBottom: '8px' }
          }, finding)
        ))
      ]),
      React.createElement('div', { key: 'steps' }, [
        React.createElement('h5', {
          key: 'steps-title',
          style: { color: '#9CA3AF', marginBottom: '8px' }
        }, 'Recommended Next Steps:'),
        React.createElement('ul', {
          key: 'steps-list',
          style: { paddingLeft: '20px' }
        }, result.nextSteps.map((step, index) =>
          React.createElement('li', {
            key: index,
            style: { marginBottom: '8px' }
          }, step)
        ))
      ])
    ])
  ]);
};

export default ResearchAssistantDemo;
