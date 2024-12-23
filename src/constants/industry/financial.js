import { TECH_IDS } from '../registry/techRegistry';
import { USE_CASE_TECH_MAPPING, getUseCaseImplementation } from '../registry/useCaseRegistry';
import { techUseCaseMapper } from '../techUseCaseMapper';

export const financial = {
  id: 'financial',
  title: "Financial Services",
  icon: "chart-column",
  color: "from-[#2196F3] to-[#0D47A1]",
  heroImage: "/images/industries/financial-hero.jpg",
  description: "Transform financial services with AI-powered solutions for risk assessment, fraud detection, and automated trading.",
  
  solutions: [
    {
      id: "fraud-detection",
      title: "Fraud Detection",
      description: "Real-time fraud detection using advanced ML algorithms",
      fullDescription: "Our AI-powered fraud detection system processes millions of transactions in real-time, identifying suspicious patterns and preventing fraudulent activities before they impact your business.",
      
      techStack: {
        primary: {
          id: TECH_IDS.OPENAI,
          usage: "Core anomaly detection and pattern recognition",
          implementation: techUseCaseMapper[TECH_IDS.OPENAI].relatedUseCases.find(
            uc => uc.title === "Fraud Detection & Prevention"
          )
        },
        supporting: [
          {
            id: TECH_IDS.LANGCHAIN,
            usage: "Orchestration and reasoning chains for fraud analysis",
            features: ["Chain of thought reasoning", "Multi-step verification"]
          },
          {
            id: TECH_IDS.PINECONE,
            usage: "Vector storage for fraud patterns and historical data",
            features: ["Real-time similarity search", "Pattern matching"]
          },
          {
            id: TECH_IDS.WEAVIATE,
            usage: "Semantic search for transaction patterns",
            features: ["Contextual search", "Pattern recognition"]
          }
        ]
      },

      // metrics: [
      //   { 
      //     label: "Detection Accuracy",
      //     value: "99.9%",
      //     techContribution: {
      //       [TECH_IDS.OPENAI]: "Pattern recognition accuracy",
      //       [TECH_IDS.PINECONE]: "Historical pattern matching"
      //     }
      //   },
      //   { 
      //     label: "Response Time",
      //     value: "60% faster",
      //     techContribution: {
      //       [TECH_IDS.LANGCHAIN]: "Optimized processing chains",
      //       [TECH_IDS.WEAVIATE]: "Fast vector search"
      //     }
      //   },
      //   { 
      //     label: "Annual Savings",
      //     value: "$2M+",
      //     techContribution: {
      //       [TECH_IDS.OPENAI]: "Automated detection",
      //       [TECH_IDS.LANGCHAIN]: "Reduced manual processing"
      //     }
      //   }
      // ],

      // benefits: [
      //   {
      //     title: "Prevent financial losses",
      //     description: "AI-powered early detection prevents fraudulent transactions",
      //     enabledBy: [TECH_IDS.OPENAI, TECH_IDS.PINECONE]
      //   },
      //   {
      //     title: "Protect customer trust",
      //     description: "Real-time monitoring and instant response",
      //     enabledBy: [TECH_IDS.LANGCHAIN, TECH_IDS.WEAVIATE]
      //   },
      //   {
      //     title: "Reduce false positives",
      //     description: "Advanced pattern recognition reduces false alerts",
      //     enabledBy: [TECH_IDS.OPENAI, TECH_IDS.LANGCHAIN]
      //   },
      //   {
      //     title: "24/7 monitoring",
      //     description: "Continuous automated surveillance",
      //     enabledBy: [TECH_IDS.PINECONE, TECH_IDS.WEAVIATE]
      //   }
      // ],

      caseStudies: [
        {
          title: "Major Bank Fraud Prevention",
          description: "How we helped a major bank reduce fraud losses by 75%",
          metrics: ["$5M saved", "90% faster detection", "50% fewer false positives"],
          link: "/case-studies/bank-fraud-prevention",
          technologies: {
            core: [TECH_IDS.OPENAI, TECH_IDS.LANGCHAIN],
            supporting: [TECH_IDS.PINECONE, TECH_IDS.WEAVIATE],
            implementation: getUseCaseImplementation("Fraud Detection", TECH_IDS.OPENAI)
          }
        }
      ],

      architecture: {
        components: [
          {
            name: "Transaction Analysis Engine",
            tech: [TECH_IDS.OPENAI],
            role: "Core pattern recognition and anomaly detection"
          },
          {
            name: "Orchestration Layer",
            tech: [TECH_IDS.LANGCHAIN],
            role: "Process management and decision chains"
          },
          {
            name: "Pattern Database",
            tech: [TECH_IDS.PINECONE, TECH_IDS.WEAVIATE],
            role: "Fraud pattern storage and quick retrieval"
          }
        ],
        dataFlow: [
          "Transaction ingestion",
          "Pattern matching",
          "Risk assessment",
          "Alert generation"
        ]
      }
    },
    // Additional solutions would follow the same pattern...
  ]
};

export const fraudDetectionImplementation = {
  title: "Fraud Detection",
  description: "Real-time fraud detection using advanced ML algorithms",
  
  overview: {
    title: "Fraud Detection System",
    description: "Our AI-powered fraud detection system processes millions of transactions in real-time, identifying suspicious patterns and preventing fraudulent activities before they impact your business.",
    benefits: [
      "Real-time transaction monitoring",
      "Pattern recognition and anomaly detection",
      "Automated alert generation",
      "Reduced false positives"
    ]
  },

  techStack: {
    core: {
      title: "Core Technologies",
      items: [
        {
          name: "OpenAI GPT-4",
          description: "Advanced pattern recognition and anomaly detection",
          icon: "openai"
        },
        {
          name: "LangChain",
          description: "Orchestration and reasoning chains",
          icon: "langchain"
        }
      ]
    },
    supporting: {
      title: "Supporting Technologies",
      items: [
        {
          name: "Pinecone",
          description: "Vector storage for fraud patterns",
          icon: "database"
        },
        {
          name: "Redis",
          description: "Real-time caching and pattern matching",
          icon: "redis"
        }
      ]
    }
  },

  implementation: {
    title: "Implementation Guide",
    description: "Step-by-step guide to implement fraud detection",
    steps: [
      {
        title: "Data Ingestion",
        description: "Set up real-time transaction data ingestion",
        code: `
// Transaction Processor
const processTransaction = async (transaction) => {
  // Validate transaction data
  const validatedData = await validateTransaction(transaction);
  
  // Enrich with historical context
  const enrichedData = await enrichTransactionData(validatedData);
  
  return enrichedData;
};`,
        explanation: "Process and validate incoming transaction data before analysis"
      },
      {
        title: "Pattern Analysis",
        description: "Implement fraud pattern detection",
        code: `
// Pattern Analyzer
const analyzePatterns = async (transaction) => {
  const patterns = await vectorDB.similaritySearch(transaction);
  const riskScore = await calculateRiskScore(patterns);
  
  return {
    patterns,
    riskScore,
    timestamp: new Date()
  };
};`,
        explanation: "Analyze transaction patterns against known fraud signatures"
      },
      {
        title: "Alert Generation",
        description: "Configure real-time alert system",
        code: `
// Alert Manager
const generateAlert = async (analysis) => {
  if (analysis.riskScore > RISK_THRESHOLD) {
    await notificationService.send({
      level: 'HIGH',
      details: analysis,
      timestamp: new Date()
    });
  }
};`,
        explanation: "Generate and route alerts based on risk analysis"
      }
    ]
  },

  architecture: {
    title: "System Architecture",
    description: "Fraud detection system architecture and components",
    components: [
      {
        name: "Data Ingestion Layer",
        description: "Handles real-time transaction processing",
        technologies: ["Kafka", "Redis"]
      },
      {
        name: "Analysis Engine",
        description: "Core fraud detection logic",
        technologies: ["OpenAI", "LangChain"]
      },
      {
        name: "Pattern Storage",
        description: "Stores and indexes fraud patterns",
        technologies: ["Pinecone", "PostgreSQL"]
      }
    ],
    dataFlow: [
      "Transaction ingestion",
      "Real-time validation",
      "Pattern matching",
      "Risk assessment",
      "Alert generation"
    ]
  },

  examples: {
    title: "Usage Examples",
    items: [
      {
        title: "Basic Pattern Detection",
        code: `
// Example: Basic fraud detection
const detectFraud = async (transaction) => {
  const analysis = await fraudDetectionService.analyze(transaction);
  
  if (analysis.riskScore > THRESHOLD) {
    await alertService.notify({
      type: 'FRAUD_DETECTED',
      details: analysis
    });
  }
  
  return analysis;
};`
      },
      {
        title: "Advanced Integration",
        code: `
// Example: Advanced integration with existing systems
class FraudDetectionSystem {
  constructor(config) {
    this.openai = new OpenAI(config.openaiKey);
    this.vectorDB = new Pinecone(config.pineconeKey);
    this.cache = new Redis(config.redisConfig);
  }

  async analyzeTransaction(transaction) {
    // Check cache first
    const cached = await this.cache.get(transaction.id);
    if (cached) return cached;

    // Perform analysis
    const analysis = await this.performAnalysis(transaction);
    
    // Cache results
    await this.cache.set(transaction.id, analysis);
    
    return analysis;
  }
}`
      }
    ]
  },

  metrics: {
    title: "Performance Metrics",
    items: [
      {
        label: "Detection Accuracy",
        value: "99.9%",
        description: "Accuracy in identifying fraudulent transactions"
      },
      {
        label: "Processing Time",
        value: "<100ms",
        description: "Average transaction processing time"
      },
      {
        label: "False Positive Rate",
        value: "<0.1%",
        description: "Rate of false fraud alerts"
      }
    ]
  }
};