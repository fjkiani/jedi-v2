import { TECH_IDS } from './techRegistry';

const baseTechConfig = {
  getIcon: (techId) => `https://cdn.simpleicons.org/${techId}`,
  getDefaultMetrics: () => ({
    reliability: "99.9% uptime",
    responseTime: "<500ms",
    accuracy: "95%+"
  })
};

export const getTechConfig = (techId) => {
  const configs = {
    [TECH_IDS.OPENAI]: {
      name: "OpenAI",
      description: "JediLabs' expertise in leveraging OpenAI for enterprise solutions",
      icon: baseTechConfig.getIcon('openai'),
      expertise: [
        "Custom model fine-tuning",
        "Prompt engineering",
        "Context optimization",
        "Enterprise integration"
      ],
      additionalInfo: {
        integration: [
          "Seamless API integration",
          "Custom workflow support",
          "Multi-platform compatibility"
        ],
        enterprise: [
          "Enterprise-grade security",
          "Scalable infrastructure",
          "24/7 support"
        ]
      },
      metrics: {
        reliability: "99.9% uptime",
        accuracy: "95%+ across use cases",
        scalability: "100K+ requests/day",
        security: "Enterprise-grade"
      },
      useCases: [
        {
          type: "customer-support-automation",
          title: "Customer Support Automation",
          implementation: {
            overview: "JediLabs' enterprise-grade customer support automation leverages OpenAI's GPT-4 alongside custom-trained models to deliver intelligent, context-aware support across multiple channels.",
            techStack: {
              "GPT-4": {
                role: "Core language understanding and response generation",
                features: [
                  "Multi-language support",
                  "Context-aware responses",
                  "Sentiment analysis",
                  "Intent classification"
                ]
              },
              "LangChain": {
                role: "Orchestration and memory management",
                features: [
                  "Conversation history management",
                  "Multi-step reasoning",
                  "Tool integration"
                ]
              },
              "Pinecone": {
                role: "Knowledge base vector storage",
                features: [
                  "Semantic search",
                  "Real-time updates",
                  "Scalable storage"
                ]
              }
            },
            industryApplications: {
              technology: {
                useCase: "Technical Support Automation",
                impact: "85% reduction in response time",
                example: "Automated troubleshooting for SaaS platforms",
                metrics: {
                  resolution: "90% first-contact resolution",
                  satisfaction: "92% CSAT score",
                  coverage: "24/7 support availability"
                }
              },
              healthcare: {
                useCase: "Patient Care Support",
                impact: "75% faster query resolution",
                example: "Appointment scheduling and care instructions",
                metrics: {
                  compliance: "100% HIPAA compliant",
                  accuracy: "99% in medical terms",
                  coverage: "Multi-language support"
                }
              },
              financial: {
                useCase: "Banking Support Services",
                impact: "60% cost reduction",
                example: "Transaction inquiries and fraud reporting",
                metrics: {
                  security: "Bank-grade encryption",
                  accuracy: "99.9% transaction accuracy",
                  response: "<30s average response time"
                }
              }
            },
            architecture: {
              components: [
                {
                  name: "Query Processor",
                  description: "Analyzes incoming queries using GPT-4",
                  tech: ["OpenAI API", "Custom Classification"]
                },
                {
                  name: "Context Engine",
                  description: "Maintains conversation history and user context",
                  tech: ["LangChain", "Redis"]
                },
                {
                  name: "Knowledge Base",
                  description: "Stores and retrieves relevant information",
                  tech: ["Pinecone", "Embeddings API"]
                },
                {
                  name: "Response Generator",
                  description: "Creates contextual, accurate responses",
                  tech: ["GPT-4", "Templates", "Tone Control"]
                }
              ],
              flow: [
                "Query analysis and intent detection",
                "Context enrichment with user history",
                "Knowledge base consultation",
                "Response generation and validation",
                "Continuous learning and improvement"
              ]
            },
            benefits: [
              {
                title: "Cost Efficiency",
                description: "Reduce support costs by up to 60%",
                icon: "trending-down"
              },
              {
                title: "24/7 Availability",
                description: "Continuous support across all time zones",
                icon: "clock"
              },
              {
                title: "Scalability",
                description: "Handle thousands of queries simultaneously",
                icon: "maximize"
              },
              {
                title: "Consistency",
                description: "Maintain uniform response quality",
                icon: "check-circle"
              }
            ],
            codeExample: `
// Customer Support Implementation
const handleCustomerQuery = async (query, context) => {
  // Initialize OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  // Get conversation history
  const history = await getConversationHistory(context.userId);
  
  // Retrieve relevant knowledge
  const relevantDocs = await searchKnowledgeBase(query);
  
  // Generate response
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: \`You are a helpful customer support agent.
                  Context: \${relevantDocs}
                  Tone: Professional and friendly\`
      },
      ...history,
      { role: "user", content: query }
    ],
    temperature: 0.7
  });

  // Validate response
  const validatedResponse = await validateResponse(
    completion.choices[0].message.content,
    context.compliance
  );

  return validatedResponse;
};`
          }
        },
        {
          type: "document-analysis-summary",
          title: "Document Analysis & Summary",
          implementation: {
            overview: "JediLabs' advanced document processing system that transforms unstructured documents into actionable insights, powered by OpenAI's language models",
            techStack: {
              "GPT-4": {
                role: "Document understanding and analysis",
                features: [
                  "Multi-format document processing",
                  "Key information extraction",
                  "Summary generation",
                  "Cross-reference analysis"
                ]
              },
              "Document AI": {
                role: "Document preprocessing and OCR",
                features: [
                  "OCR capabilities",
                  "Layout analysis",
                  "Table extraction",
                  "Image processing"
                ]
              },
              "Vector DB": {
                role: "Document storage and retrieval",
                features: [
                  "Semantic search",
                  "Version control",
                  "Document linking",
                  "Access management"
                ]
              }
            },
            benefits: [
              {
                title: "Time Savings",
                description: "80% faster document processing",
                icon: "clock"
              },
              {
                title: "Accuracy",
                description: "95% accuracy in key info extraction",
                icon: "check-circle"
              },
              {
                title: "Scalability",
                description: "Process thousands of documents simultaneously",
                icon: "maximize"
              },
              {
                title: "Compliance",
                description: "Automated compliance checking",
                icon: "shield"
              }
            ],
            industryApplications: {
              legal: {
                useCase: "Contract Analysis",
                impact: "90% faster contract review",
                example: "Automated contract analysis and risk assessment",
                metrics: {
                  accuracy: "98% accuracy in clause identification",
                  speed: "200+ pages per minute",
                  coverage: "Multiple contract types supported"
                }
              },
              healthcare: {
                useCase: "Medical Record Processing",
                impact: "75% reduction in processing time",
                example: "Patient record analysis and summary generation",
                metrics: {
                  compliance: "HIPAA compliant",
                  accuracy: "99% accuracy in medical term extraction",
                  integration: "EMR system compatible"
                }
              },
              financial: {
                useCase: "Financial Document Analysis",
                impact: "85% faster report processing",
                example: "Financial statement analysis and risk assessment",
                metrics: {
                  accuracy: "99.9% accuracy in number extraction",
                  compliance: "SEC/FINRA compliant",
                  processing: "Real-time analysis capabilities"
                }
              }
            }
          }
        },
        {
          type: "intelligent-search-assistant",
          title: "Intelligent Search Assistant",
          implementation: {
            overview: "JediLabs' cognitive search solution that understands user intent and delivers precise results across enterprise knowledge bases",
            techStack: {
              "GPT-4": {
                role: "Query understanding and result ranking",
                features: [
                  "Natural language understanding",
                  "Context preservation",
                  "Intent recognition",
                  "Answer synthesis"
                ]
              },
              "Vector Search": {
                role: "Semantic search engine",
                features: [
                  "Semantic matching",
                  "Real-time indexing",
                  "Multi-modal search",
                  "Relevance ranking"
                ]
              },
              "Knowledge Graph": {
                role: "Information relationship mapping",
                features: [
                  "Entity relationship mapping",
                  "Dynamic updates",
                  "Context enrichment",
                  "Data validation"
                ]
              }
            },
            benefits: [
              {
                title: "Enhanced Accuracy",
                description: "95% search relevance improvement",
                icon: "target"
              },
              {
                title: "Time Efficiency",
                description: "70% faster information retrieval",
                icon: "clock"
              },
              {
                title: "Knowledge Discovery",
                description: "Uncover hidden insights",
                icon: "search"
              },
              {
                title: "User Experience",
                description: "Natural language interface",
                icon: "users"
              }
            ],
            industryApplications: {
              // ... similar structure to other use cases
            }
          }
        },
        {
          type: "content-generation-helper",
          title: "Content Generation Helper",
          implementation: {
            overview: "JediLabs' AI-powered content creation system that maintains brand voice while scaling content operations",
            techStack: {
              "GPT-4": {
                role: "Content generation and optimization",
                features: [
                  "Brand voice preservation",
                  "Multi-format content",
                  "SEO optimization",
                  "Tone adjustment"
                ]
              },
              "Content Manager": {
                role: "Content workflow orchestration",
                features: [
                  "Version control",
                  "Approval workflows",
                  "Asset management",
                  "Distribution automation"
                ]
              },
              "Analytics Engine": {
                role: "Performance tracking and optimization",
                features: [
                  "Engagement tracking",
                  "A/B testing",
                  "ROI measurement",
                  "Trend analysis"
                ]
              }
            },
            benefits: [
              {
                title: "Productivity",
                description: "5x faster content creation",
                icon: "zap"
              },
              {
                title: "Consistency",
                description: "100% brand voice alignment",
                icon: "check-square"
              },
              {
                title: "SEO Performance",
                description: "40% better search rankings",
                icon: "trending-up"
              },
              {
                title: "Scale",
                description: "Unlimited content generation",
                icon: "maximize"
              }
            ],
            industryApplications: {
              // ... similar structure to other use cases
            }
          }
        },
        {
          type: "fraud-detection",
          title: "Fraud Detection & Prevention",
          implementation: {
            overview: "AI-powered fraud detection using OpenAI's advanced pattern recognition",
            techStack: {
              "GPT-4": {
                role: "Anomaly Detection Engine",
                features: [
                  "Neural network-based pattern recognition",
                  "Real-time transaction analysis",
                  "Anomaly detection algorithms"
                ]
              },
              "Vector Database": {
                role: "Pattern Storage & Matching",
                features: [
                  "Real-time processing",
                  "Historical pattern matching",
                  "Fraud pattern database"
                ]
              }
            },
            industryApplications: {
              financial: {
                useCase: "Banking Fraud Prevention",
                impact: "75% reduction in fraudulent transactions",
                metrics: {
                  accuracy: "99.9% detection rate",
                  speed: "Real-time processing",
                  coverage: "All transaction types"
                }
              }
            }
          }
        }
      ]
    }
  };

  return configs[techId] || null;
}; 