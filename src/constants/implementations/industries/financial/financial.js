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

