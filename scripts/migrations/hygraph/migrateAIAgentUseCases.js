import { hygraphClient } from '../../../src/lib/hygraph.js';

const CREATE_USE_CASE = `
  mutation CreateUseCase(
    $title: String!
    $description: String!
    $category: String!
    $queries: [String!]!
    $capabilities: [String!]!
    $architecture: Json!
    $implementation: Json!
  ) {
    createUseCase(
      data: {
        title: $title
        description: $description
        category: $category
        queries: $queries
        capabilities: $capabilities
        architecture: $architecture
        implementation: $implementation
      }
    ) {
      id
      title
    }
  }
`;

const aiAgentUseCases = [
  {
    title: "Automated Research Assistant",
    description: "An AI agent that assists researchers by automating literature review, data collection, and analysis tasks. It can process large volumes of academic papers, extract key findings, and generate comprehensive research summaries.",
    category: "ai-agents",
    queries: [
      "How can I automate my research literature review?",
      "What are the key findings from recent papers in my field?",
      "Can you analyze these research papers and summarize the methodology?"
    ],
    capabilities: [
      "Automated literature review and summarization",
      "Citation analysis and recommendation",
      "Research trend identification",
      "Data extraction and synthesis",
      "Bibliography management"
    ],
    architecture: {
      description: "A scalable architecture for processing and analyzing research documents",
      components: [
        {
          name: "Document Processor",
          description: "Handles document ingestion and text extraction",
          details: ["PDF parsing", "OCR capabilities", "Text normalization"],
          explanation: "Processes various document formats into analyzable text"
        },
        {
          name: "NLP Engine",
          description: "Performs natural language processing tasks",
          details: ["Named entity recognition", "Topic modeling", "Semantic analysis"],
          explanation: "Extracts meaning and relationships from text"
        },
        {
          name: "Knowledge Graph",
          description: "Maintains relationships between research entities",
          details: ["Citation network", "Author relationships", "Topic hierarchies"],
          explanation: "Enables contextual understanding and recommendations"
        }
      ],
      flow: [
        {
          step: "Document Ingestion",
          description: "Process and normalize research documents",
          details: ["Convert PDFs to text", "Extract metadata", "Identify document structure"]
        },
        {
          step: "Content Analysis",
          description: "Analyze document content using NLP",
          details: ["Extract key findings", "Identify methodologies", "Analyze citations"]
        },
        {
          step: "Knowledge Integration",
          description: "Integrate findings into knowledge graph",
          details: ["Update citation network", "Link related research", "Identify trends"]
        }
      ]
    },
    implementation: {
      overview: "Implementation details for the research assistant",
      technologies: [
        {
          name: "LangChain",
          description: "For orchestrating LLM workflows",
          stack: ["Python", "OpenAI API", "Embeddings"]
        },
        {
          name: "Neo4j",
          description: "For knowledge graph storage",
          stack: ["Graph Database", "Cypher Query Language"]
        }
      ],
      metrics: [
        "Processing speed: 100 papers/minute",
        "Accuracy: 95% in citation extraction",
        "Summary quality: 4.5/5 researcher rating"
      ]
    }
  },
  {
    title: "Customer Service Agent",
    description: "An AI-powered customer service agent that handles customer inquiries, resolves issues, and provides personalized support 24/7. It can understand context, manage multiple conversations, and escalate complex issues when necessary.",
    category: "ai-agents",
    queries: [
      "How can I automate customer support?",
      "What's the best way to handle customer inquiries 24/7?",
      "Can AI help improve customer satisfaction scores?"
    ],
    capabilities: [
      "Natural language understanding",
      "Multi-language support",
      "Sentiment analysis",
      "Issue classification and routing",
      "Automated response generation",
      "Escalation management"
    ],
    architecture: {
      description: "A robust architecture for handling customer interactions at scale",
      components: [
        {
          name: "Conversation Manager",
          description: "Handles multiple customer conversations simultaneously",
          details: ["Session management", "Context tracking", "State persistence"],
          explanation: "Maintains conversation flow and context"
        },
        {
          name: "Intent Classifier",
          description: "Identifies customer intent and routes accordingly",
          details: ["Intent recognition", "Entity extraction", "Priority assessment"],
          explanation: "Understands customer needs and directs conversations"
        },
        {
          name: "Response Generator",
          description: "Generates appropriate responses based on context",
          details: ["Template management", "Dynamic response generation", "Personalization"],
          explanation: "Creates contextually relevant responses"
        }
      ],
      flow: [
        {
          step: "Initial Contact",
          description: "Receive and analyze customer inquiry",
          details: ["Identify customer", "Analyze sentiment", "Extract key information"]
        },
        {
          step: "Issue Resolution",
          description: "Process and resolve customer issue",
          details: ["Generate response", "Check knowledge base", "Apply business rules"]
        },
        {
          step: "Follow-up",
          description: "Ensure customer satisfaction",
          details: ["Satisfaction survey", "Issue tracking", "Feedback collection"]
        }
      ]
    },
    implementation: {
      overview: "Implementation details for the customer service agent",
      technologies: [
        {
          name: "Rasa",
          description: "For conversational AI",
          stack: ["Python", "TensorFlow", "SpaCy"]
        },
        {
          name: "Redis",
          description: "For session management",
          stack: ["In-memory database", "Pub/Sub", "Caching"]
        }
      ],
      metrics: [
        "Response time: < 1 second",
        "Resolution rate: 85%",
        "Customer satisfaction: 4.2/5"
      ]
    }
  },
  {
    title: "Data Analysis Agent",
    description: "An AI agent that automates data analysis tasks, identifies patterns, generates insights, and creates visualizations. It can handle large datasets, perform statistical analysis, and provide actionable recommendations.",
    category: "ai-agents",
    queries: [
      "How can I automate my data analysis workflow?",
      "What insights can be extracted from my dataset?",
      "Can AI help identify patterns in my data?"
    ],
    capabilities: [
      "Automated data cleaning and preprocessing",
      "Statistical analysis",
      "Pattern recognition",
      "Anomaly detection",
      "Visualization generation",
      "Insight extraction"
    ],
    architecture: {
      description: "A comprehensive architecture for automated data analysis",
      components: [
        {
          name: "Data Preprocessor",
          description: "Handles data cleaning and preparation",
          details: ["Missing value handling", "Outlier detection", "Feature engineering"],
          explanation: "Prepares data for analysis"
        },
        {
          name: "Analysis Engine",
          description: "Performs statistical analysis and modeling",
          details: ["Statistical testing", "Machine learning", "Time series analysis"],
          explanation: "Extracts patterns and insights from data"
        },
        {
          name: "Visualization Generator",
          description: "Creates data visualizations",
          details: ["Chart generation", "Interactive dashboards", "Report creation"],
          explanation: "Presents insights visually"
        }
      ],
      flow: [
        {
          step: "Data Ingestion",
          description: "Import and validate data",
          details: ["Format validation", "Schema detection", "Quality checks"]
        },
        {
          step: "Analysis",
          description: "Perform analysis and generate insights",
          details: ["Statistical analysis", "Pattern detection", "Hypothesis testing"]
        },
        {
          step: "Reporting",
          description: "Generate reports and visualizations",
          details: ["Create visualizations", "Generate insights", "Format reports"]
        }
      ]
    },
    implementation: {
      overview: "Implementation details for the data analysis agent",
      technologies: [
        {
          name: "Pandas",
          description: "For data manipulation",
          stack: ["Python", "NumPy", "Jupyter"]
        },
        {
          name: "Plotly",
          description: "For interactive visualizations",
          stack: ["Python", "JavaScript", "D3.js"]
        }
      ],
      metrics: [
        "Processing speed: 1M rows/second",
        "Accuracy: 99% in statistical tests",
        "Visualization quality: 4.8/5"
      ]
    }
  }
];

const migrateAIAgentUseCases = async () => {
  console.log('Starting AI Agent use cases migration...');
  
  for (const useCase of aiAgentUseCases) {
    try {
      const result = await hygraphClient.request(CREATE_USE_CASE, useCase);
      console.log(`Successfully created use case: ${useCase.title}`);
    } catch (error) {
      console.error(`Error creating use case ${useCase.title}:`, error);
    }
  }
  
  console.log('AI Agent use cases migration completed!');
};

export { migrateAIAgentUseCases }; 