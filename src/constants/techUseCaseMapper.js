export const techUseCaseMapper = {
  openai: {
    id: "openai",
    icon: 'https://cdn.simpleicons.org/openai',
    name: "OpenAI",
    description: "Powering JediLabs' intelligent solutions with advanced language models",
    category: "Core AI",
    relatedUseCases: [
      {
        title: "AI-Powered Research & Development",
        solutionSlug: "ai-ml-solutions",
        implementation: {
          overview: "Accelerating R&D processes by leveraging GPT-4 for scientific literature analysis, experiment design, and hypothesis generation",
          architecture: {
            components: [
              {
                name: "Research Assistant Core",
                description: "GPT-4 powered engine for scientific analysis",
                tech: ["OpenAI API", "LangChain", "Vector DB"]
              },
              {
                name: "Knowledge Integration",
                description: "Scientific literature and domain knowledge processing",
                tech: ["Embeddings API", "Pinecone", "PyPDF"]
              },
              {
                name: "Experiment Design Module",
                description: "AI-driven experiment planning and optimization",
                tech: ["GPT-4", "Custom Prompts", "Domain Rules"]
              }
            ],
            flow: [
              "Research query processing and context building",
              "Literature analysis and knowledge synthesis",
              "Hypothesis generation and validation",
              "Experiment design recommendations",
              "Results analysis and insights generation"
            ]
          },
          benefits: [
            "50% reduction in research planning time",
            "90% faster literature review process",
            "Enhanced hypothesis generation accuracy",
            "Data-driven experiment optimization"
          ],
          codeExample: `
// Research Assistant Implementation
const processResearchQuery = async (query, context) => {
  // Simulated OpenAI instance for demo
  const openai = {
    chat: {
      completions: {
        create: async ({ messages }) => ({
          choices: [{
            message: { content: "Analysis results for your query..." }
          }]
        })
      }
    }
  };
  
  // Simulate API calls
  const relevantLiterature = "Sample literature data";
  const experimentHistory = "Previous experiment data";
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: \`You are an expert research assistant in life sciences.
                  Consider this scientific context: \${relevantLiterature}
                  Previous experiments: \${experimentHistory}\`
      },
      {
        role: "user",
        content: query
      }
    ]
  });

  return {
    analysis: completion.choices[0].message.content,
    citations: ["Sample citation 1", "Sample citation 2"],
    nextSteps: ["Proposed experiment 1", "Proposed experiment 2"]
  };
};

// Demo Component
function ResearchAssistantDemo() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const response = await processResearchQuery(
        "What are the latest findings in cancer research?",
        { projectId: "demo-123" }
      );
      setResult(response);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h3>Research Assistant Demo</h3>
      <button 
        onClick={handleQuery}
        style={{
          background: '#6366f1',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Run Research Query'}
      </button>
      
      {result && (
        <div style={{ 
          background: '#1f2937', 
          padding: '16px', 
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Required for react-live
render(<ResearchAssistantDemo />);
`
        },
        exampleQueries: {
          placeholder: "What are the latest developments in quantum computing?",
          samples: [
            "Analyze recent breakthroughs in CRISPR technology",
            "Summarize developments in renewable energy",
            "Review machine learning applications in drug discovery"
          ]
        },
        placeholder: "Try: 'Analyze recent breakthroughs in CRISPR technology'"
      },
      {
        title: "Intelligent Lab Assistant",
        solutionSlug: "ai-ml-solutions",
        implementation: {
          overview: "AI-powered assistant for real-time lab support, protocol optimization, and result interpretation",
          architecture: {
            components: [
              {
                name: "Protocol Assistant",
                description: "Real-time protocol guidance and optimization",
                tech: ["GPT-4", "Custom Lab Protocols DB"]
              },
              {
                name: "Results Analyzer",
                description: "Automated analysis of lab results",
                tech: ["Computer Vision API", "GPT-4 Vision", "Data Analytics"]
              },
              {
                name: "Safety Monitor",
                description: "Lab safety and compliance checking",
                tech: ["Safety Guidelines DB", "Real-time Monitoring"]
              }
            ],
            flow: [
              "Protocol request and customization",
              "Step-by-step guidance with safety checks",
              "Real-time troubleshooting support",
              "Results capture and analysis",
              "Documentation and reporting"
            ]
          },
          benefits: [
            "24/7 lab support availability",
            "Reduced protocol errors by 75%",
            "Automated documentation and compliance",
            "Faster result interpretation"
          ],
          codeExample: `
// Lab Assistant Implementation
const labAssistant = {
  async optimizeProtocol(protocol, labConditions) {
    // Simulated responses for demo
    return {
      optimizedSteps: [
        "1. Prepare samples under sterile conditions",
        "2. Adjust temperature to optimal range",
        "3. Run analysis with safety protocols"
      ],
      safetyNotes: "Ensure proper PPE is worn",
      qualityChecks: ["Temperature verification", "Sample integrity check"]
    };
  }
};

function LabAssistantDemo() {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const protocol = {
        type: "sample_analysis",
        steps: ["1. Collect sample", "2. Process sample", "3. Analyze results"]
      };
      
      const labConditions = "Temperature: 23°C, Humidity: 45%";
      
      const optimized = await labAssistant.optimizeProtocol(protocol, labConditions);
      setResult(optimized);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return React.createElement('div', 
    { style: { padding: '20px', color: 'white' } },
    [
      React.createElement('h3', { key: 'title' }, 'Lab Assistant Demo'),
      React.createElement('button', {
        key: 'optimize-button',
        onClick: runOptimization,
        disabled: loading,
        style: {
          background: '#6366f1',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '16px'
        }
      }, loading ? 'Optimizing...' : 'Optimize Protocol'),
      result && React.createElement('div', {
        key: 'result',
        style: {
          background: '#1f2937',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px'
        }
      }, [
        React.createElement('h4', { key: 'result-title' }, 'Optimization Results:'),
        React.createElement('div', { key: 'steps' }, [
          React.createElement('h5', { key: 'steps-title' }, 'Optimized Steps:'),
          React.createElement('ul', { key: 'steps-list' },
            result.optimizedSteps.map((step, index) =>
              React.createElement('li', { key: index }, step)
            )
          )
        ]),
        React.createElement('div', { key: 'safety' }, [
          React.createElement('h5', { key: 'safety-title' }, 'Safety Notes:'),
          React.createElement('p', { key: 'safety-notes' }, result.safetyNotes)
        ]),
        React.createElement('div', { key: 'checks' }, [
          React.createElement('h5', { key: 'checks-title' }, 'Quality Checks:'),
          React.createElement('ul', { key: 'checks-list' },
            result.qualityChecks.map((check, index) =>
              React.createElement('li', { key: index }, check)
            )
          )
        ])
      ])
    ]
  );
}

render(React.createElement(LabAssistantDemo));
`
        },
        exampleQueries: {
          placeholder: "Optimize protocol for DNA sequencing",
          samples: [
            "Suggest parameters for HPLC analysis",
            "Generate safety checklist for chemical synthesis",
            "Calculate reagent concentrations for buffer preparation"
          ]
        },
        placeholder: "Try: 'Optimize the PCR protocol for DNA amplification'"
      },
      {
        title: "Customer Support Automation",
        solutionSlug: "ai-ml-solutions",
        implementation: {
          overview: "Automating customer support with AI-driven chatbots and sentiment analysis",
          architecture: {
            components: [
              {
                name: "Chatbot Engine",
                description: "AI-driven customer interaction",
                tech: ["GPT-4", "Dialogflow", "Twilio"]
              },
              {
                name: "Sentiment Analyzer",
                description: "Real-time sentiment analysis",
                tech: ["NLP API", "Sentiment DB"]
              },
              {
                name: "Feedback Loop",
                description: "Continuous improvement of responses",
                tech: ["Feedback API", "Machine Learning"]
              }
            ],
            flow: [
              "Customer query reception",
              "Sentiment analysis and intent detection",
              "Response generation and delivery",
              "Feedback collection and analysis",
              "Model retraining and optimization"
            ]
          },
          benefits: [
            "Improved customer satisfaction",
            "Reduced response time by 60%",
            "Continuous learning and adaptation",
            "Scalable support operations"
          ],
          codeExample: `
// Chatbot Implementation
const handleCustomerQuery = async (query) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const sentiment = await analyzeSentiment(query);
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: \`You are a helpful customer support assistant. Sentiment: \${sentiment}\`
      },
      {
        role: "user",
        content: query
      }
    ],
    temperature: 0.5,
    max_tokens: 1500
  });

  return response.choices[0].message.content;
};`
        },
        exampleQueries: {
          placeholder: "How do I integrate the API with my application?",
          samples: [
            "Troubleshoot authentication errors",
            "Explain rate limiting policies",
            "Guide for updating API credentials"
          ]
        },
        placeholder: "Try: 'How do I reset my account password?'"
      }
    ],
    integrations: {
      primary: ["LangChain", "Vector Databases", "Custom Lab Systems"],
      apis: ["GPT-4", "Embeddings", "DALL-E"],
      security: ["Data Encryption", "Access Controls", "Audit Logging"]
    },
    metrics: {
      reliability: "99.9% uptime",
      responseTime: "<500ms average",
      accuracy: "95% in research contexts"
    }
  },
  langchain: {
    id: "langchain",
    icon: 'https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_icon.png',
    name: "LangChain",
    description: "Framework for building LLM applications",
    category: "Core AI",
    relatedUseCases: [
      {
        title: "Intelligent Search Assistant",
        solutionSlug: "ai-ml-solutions",
        implementation: {
          overview: "Building an intelligent search system using LangChain",
          // ... implementation details
        }
      }
    ]
  }
  // ... other technologies
}; 