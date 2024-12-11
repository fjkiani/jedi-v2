const API_URL = import.meta.env.VITE_API_URL;

const USE_CASE_MAP = {
  "Analyze recent breakthroughs in CRISPR technology": {
    key: "crispr",
    defaultQuery: "Analyze recent breakthroughs in CRISPR technology"
  },
  "Summarize developments in renewable energy": {
    key: "renewableEnergy",
    defaultQuery: "Summarize developments in renewable energy"
  },
  "Review machine learning applications in drug discovery": {
    key: "drugDiscovery",
    defaultQuery: "Review machine learning applications in drug discovery"
  }
};

const getMockResponse = function(useCase, query) {
  console.log('getMockResponse called with:', { useCase, query });
  
  const responses = {
    "AI-Powered Research & Development": {
      crispr: {
        header: {
          icon: "🧬",
          title: "CRISPR Analysis Assistant",
          query: "Analyze recent breakthroughs in CRISPR technology",
          model: {
            name: "GPT-4 Turbo",
            version: "January 2024",
            capabilities: ["Research Analysis", "Technical Validation", "Safety Assessment"]
          },
          timestamp: new Date().toISOString(),
          responseId: `JL-${Math.random().toString(36).substr(2, 6)}`
        },
        sections: [
          {
            icon: "🤖",
            title: "HOW AI PROCESSED YOUR QUERY",
            subsections: [
              {
                marker: "🔸",
                title: "Initial Query Processing",
                subtitle: "📊 Query Analysis",
                mainPoint: "GPT-4 analyzed query intent: \"Recent CRISPR breakthroughs\"",
                details: [
                  "Advanced semantic parsing identified core research focus",
                  "Temporal analysis set 6-month relevance window",
                  "Priority scoring applied to breakthrough categories",
                  "Key areas: Gene editing efficiency (↑), Delivery systems (↑), Safety protocols (↑)"
                ]
              },
              {
                marker: "🔸",
                title: "Search Strategy",
                subtitle: "🔍 Vector Search & Processing",
                mainPoint: "Text-embedding-3-large model deployment",
                details: [
                  "1536-dimensional semantic vectors created",
                  "50,000+ research papers analyzed | 0.85 relevance threshold",
                  "Real-time processing pipeline with multi-language support"
                ]
              },
              {
                marker: "🔸",
                title: "Multi-Model Analysis",
                subtitle: "🧠 AI Processing Chain",
                bulletPoints: [
                  {
                    title: "GPT-4 Research Synthesis",
                    details: ["Methods analysis | Results interpretation | Impact scoring"]
                  },
                  {
                    title: "Bio-GPT Technical Validation",
                    details: ["Protocol verification | Success prediction | Safety checks"]
                  },
                  {
                    title: "Safety-GPT Assessment",
                    details: ["Risk evaluation | Compliance checks | Documentation"]
                  }
                ]
              },
              {
                marker: "🔸",
                title: "Knowledge Integration",
                subtitle: "📈 Impact Analysis",
                bulletPoints: [
                  "Source Weighting: Research (70%) | Trials (20%) | Patents (10%)",
                  "Breakthrough Ranking: Citations | Applications | Implementation",
                  "Impact Metrics: Success Rate | Cost Reduction | Time Savings"
                ]
              }
            ]
          },
          {
            icon: "🔬",
            title: "MAJOR DISCOVERIES",
            description: "GPT-4 and specialized models worked together:",
            fullWidth: true,
            discoveries: [
              {
                marker: "🔸",
                title: "Prime Editing Enhancement",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Analyzed 156 papers using natural language processing",
                    "Connected similar experiments using knowledge graphs",
                    "Identified success patterns across datasets"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH RESULT",
                  highlight: "✨ 89% Efficiency Improvement",
                  points: [
                    "Validated across 12 cell lines",
                    "Reproducible in standard lab conditions",
                    "Cost reduction: 45% vs traditional methods"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "Delivery Breakthrough",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Compared 47 delivery methods using pattern recognition",
                    "Simulated molecular interactions",
                    "Predicted cell penetration rates"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH RESULT",
                  highlight: "✨ 3x Better Cell Penetration",
                  points: [
                    "Works in hard-to-reach tissues",
                    "Reduced toxicity profile",
                    "Scalable manufacturing process"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "Off-Target Reduction",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Processed 234 validation studies",
                    "Used machine learning to identify mutation patterns",
                    "Ran predictive modeling across cell lines"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH RESULT",
                  highlight: "✨ 45% Fewer Off-targets",
                  points: [
                    "Highest safety rating to date",
                    "Immediate clinical potential",
                    "Patent-pending technology"
                  ]
                }
              }
            ]
          },
          {
            icon: "🧪",
            title: "TECHNICAL VALIDATION",
            subtitle: "Bio-GPT's contribution:",
            validation: {
              marker: "🔸",
              title: "Simulation & Testing",
              process: {
                title: "How AI Helped:",
                steps: [
                  "Generated 1,000+ test scenarios",
                  "Optimized parameters in real-time",
                  "Cross-validated results"
                ]
              },
              finding: {
                type: "KEY FINDING",
                highlight: "✨ 94% Reproducibility",
                points: [
                  "Validated in 23 labs",
                  "Standard deviation < 0.5%"
                ]
              }
            }
          },
          {
            icon: "💡",
            title: "IMPLEMENTATION ROADMAP",
            timeline: {
              marker: "🔸",
              title: "AI-Generated Timeline",
              plan: {
                type: "ADOPTION PLAN",
                highlight: "✨ 6-8 Month Timeline",
                phases: [
                  "Month 1-2: Protocol optimization",
                  "Month 3-5: Validation phase",
                  "Month 6-8: Full implementation"
                ]
              }
            }
          }
        ],
        footer: {
          metrics: {
            confidence: "94.7%",
            dataPoints: "1.2M",
            processingTime: "3.2s"
          },
          certifications: [
            "🔒 Enterprise Secure",
            "✓ HIPAA Compliant",
            "📊 Analytics Ready"
          ],
          poweredBy: "JediLabs AI™",
          modelInfo: {
            type: "Ensemble",
            components: [
              "GPT-4 Turbo",
              "Bio-GPT",
              "Safety-GPT"
            ]
          }
        }
      },
      renewableEnergy: {
        header: {
          icon: "⚡",
          title: "Renewable Energy Analysis",
          query: "Summarize developments in renewable energy",
          model: {
            name: "GPT-4 Turbo",
            version: "January 2024",
            capabilities: [
              "Energy Technology Analysis",
              "Scientific Literature Review",
              "Market Data Synthesis",
              "Technical Performance Evaluation"
            ]
          },
          timestamp: new Date().toISOString(),
          responseId: `JL-${Math.random().toString(36).substr(2, 6)}`
        },
        sections: [
          {
            icon: "🤖",
            title: "HOW AI PROCESSED YOUR QUERY",
            subsections: [
              {
                marker: "🔸",
                title: "Query Decomposition",
                subtitle: "🎯 Semantic Analysis",
                mainPoint: "Multi-dimensional parsing of 'renewable energy developments'",
                details: [
                  "Identified 4 key dimensions: Technology, Economics, Policy, Implementation",
                  "Created semantic embeddings for each dimension using text-embedding-3-large",
                  "Applied temporal filter: Last 18 months of developments",
                  "Generated sub-queries for each renewable category (solar, wind, etc.)"
                ]
              },
              {
                marker: "🔸",
                title: "Data Source Integration",
                subtitle: "📚 Knowledge Base Access",
                mainPoint: "Parallel processing of multiple data streams",
                details: [
                  "Scientific Papers: Connected to arXiv, ScienceDirect APIs",
                  "Market Data: Bloomberg New Energy Finance, IEA databases",
                  "Patent Filings: USPTO, EPO, WIPO databases",
                  "Policy Updates: Government portals, regulatory frameworks"
                ]
              },
              {
                marker: "🔸",
                title: "AI Processing Pipeline",
                subtitle: "⚙️ Model Chain Architecture",
                bulletPoints: [
                  {
                    title: "1. Initial Data Processing",
                    details: [
                      "GPT-4 Turbo: Primary query understanding and context setting",
                      "Claude-3: Scientific paper analysis and technical validation",
                      "PaLM 2: Patent analysis and innovation tracking"
                    ]
                  },
                  {
                    title: "2. Specialized Analysis",
                    details: [
                      "Energy-GPT: Technical feasibility and performance metrics",
                      "Market-GPT: Cost analysis and economic viability",
                      "Policy-GPT: Regulatory compliance and policy impact"
                    ]
                  },
                  {
                    title: "3. Data Synthesis",
                    details: [
                      "Cross-reference findings across models",
                      "Resolve conflicts using confidence scoring",
                      "Generate unified insights with uncertainty quantification"
                    ]
                  }
                ]
              },
              {
                marker: "🔸",
                title: "Verification Protocol",
                subtitle: "✅ Quality Assurance",
                bulletPoints: [
                  "Source Reliability: Academic (0.9), Industry (0.8), News (0.6)",
                  "Cross-Validation: Minimum 3 independent sources per claim",
                  "Temporal Relevance: Exponential decay weighting for older sources",
                  "Geographic Distribution: Weighted by market size and innovation index"
                ]
              }
            ]
          },
          {
            icon: "🔬",
            title: "MAJOR DISCOVERIES",
            description: "AI-synthesized breakthrough analysis:",
            discoveries: [
              {
                marker: "🔸",
                title: "Perovskite Solar Revolution",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Analyzed 1,236 research papers using NLP algorithms",
                    "Generated material property predictions using deep learning",
                    "Simulated 10,000+ atomic configurations",
                    "Vector similarity search across 1,236 research papers",
                    "Technical specification clustering using K-means",
                    "Performance claim verification through meta-analysis",
                    "Cost modeling using neural network predictions",
                    "Optimized manufacturing parameters via reinforcement learning"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 31.7% Efficiency | 92% Confidence Score",
                  points: [
                    "Validated by 3 independent labs (NREL, Fraunhofer, UNSW)",
                    "Manufacturing cost reduction: $0.13/W (↓47% YoY)",
                    "Stability improved to 92% after 2000 hours testing"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "Grid-Scale Storage Innovation",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Processed 845 battery chemistry papers using transformer models",
                    "Predicted material degradation patterns over 15-year cycles",
                    "Optimized electrode compositions using genetic algorithms",
                    "Validated safety protocols through scenario simulation"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 96% Round-Trip Efficiency | 89% Confidence Score",
                  points: [
                    "20-year lifespan prediction with minimal degradation",
                    "Cost reduction to $85/kWh (↓35% from baseline)",
                    "Zero thermal runaway events in 50,000 test cycles"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "Wind Turbine AI Optimization",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Real-time analysis of 5M+ sensor data points",
                    "Dynamic blade adjustment using neural networks",
                    "Weather pattern prediction with transformer models",
                    "Maintenance scheduling via predictive analytics"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 44% Efficiency Gain | 95% Confidence Score",
                  points: [
                    "Power output increased by 27% in variable conditions",
                    "Maintenance costs reduced by 52% through predictive care",
                    "Lifespan extended by 8 years via smart load management"
                  ]
                }
              }
            ]
          }
          // ... continuing with other sections
        ],
        footer: {
          metrics: {
            confidence: "93.2%",
            dataPoints: "1.8M",
            processingTime: "2.9s"
          },
          certifications: [
            "🔒 Enterprise Secure",
            "✓ ISO 27001 Compliant",
            "📊 Analytics Ready"
          ],
          poweredBy: "JediLabs AI™",
          modelInfo: {
            type: "Ensemble",
            components: [
              "GPT-4 Turbo",
              "Energy-GPT",
              "Market-GPT"
            ]
          }
        }
      },
      drugDiscovery: {
        header: {
          icon: "💊",
          title: "Drug Discovery AI Analysis",
          query: "Review machine learning applications in drug discovery",
          model: {
            name: "GPT-4 Turbo",
            version: "January 2024",
            capabilities: [
              "Molecular Analysis",
              "Clinical Trial Assessment",
              "Drug-Target Interaction",
              "Safety Profiling"
            ]
          },
          timestamp: new Date().toISOString(),
          responseId: `JL-${Math.random().toString(36).substr(2, 6)}`
        },
        sections: [
          {
            icon: "🤖",
            title: "HOW AI PROCESSED YOUR QUERY",
            subsections: [
              {
                marker: "🔸",
                title: "Query Decomposition",
                subtitle: "🎯 Analysis Framework",
                mainPoint: "Multi-modal analysis of drug discovery pipeline",
                details: [
                  "Identified 5 key phases: Target ID, Design, Synthesis, Screening, Optimization",
                  "Created specialized embeddings for chemical structures and proteins",
                  "Applied biomedical knowledge graph with 2.3M relationships",
                  "Generated phase-specific ML application analysis"
                ]
              },
              {
                marker: "🔸",
                title: "Data Integration",
                subtitle: "📚 Knowledge Sources",
                mainPoint: "Comprehensive data synthesis across domains",
                details: [
                  "PubChem & ChEMBL databases: 110M+ compounds analyzed",
                  "Clinical Trials Database: 425,000+ trials processed",
                  "Protein Data Bank: 180,000+ structures evaluated",
                  "FDA Documentation: Safety and approval patterns"
                ]
              },
              {
                marker: "🔸",
                title: "AI Processing Chain",
                subtitle: "⚙️ Model Architecture",
                bulletPoints: [
                  {
                    title: "1. Primary Analysis",
                    details: [
                      "GPT-4 Turbo: Research synthesis and context analysis",
                      "AlphaFold2: Protein structure prediction",
                      "MolFormer: Molecular property prediction"
                    ]
                  },
                  {
                    title: "2. Specialized Processing",
                    details: [
                      "DrugAI: ADMET property prediction",
                      "BioGPT: Mechanism of action analysis",
                      "SafetyNet: Toxicity prediction"
                    ]
                  },
                  {
                    title: "3. Integration & Validation",
                    details: [
                      "Cross-model validation framework",
                      "Uncertainty quantification",
                      "Expert system verification"
                    ]
                  }
                ]
              }
            ]
          },
          {
            icon: "🔬",
            title: "MAJOR DISCOVERIES",
            description: "AI-driven breakthroughs in drug discovery:",
            discoveries: [
              {
                marker: "🔸",
                title: "Novel Target Identification",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Analyzed 3.2M protein-protein interactions",
                    "Generated 50,000+ pathway simulations",
                    "Identified novel binding sites using deep learning",
                    "Validated through in-silico trials"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 312 Novel Targets | 94% Confidence Score",
                  points: [
                    "15 high-priority targets for rare diseases",
                    "Reduced target identification time by 71%",
                    "Validated through 3 independent lab studies"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "De Novo Drug Design",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Generated 1M+ novel molecular structures",
                    "Predicted binding affinity using quantum ML",
                    "Optimized drug-likeness properties",
                    "Simulated metabolic pathways"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 89% Success Rate | 91% Confidence Score",
                  points: [
                    "237 promising compounds identified",
                    "Synthesis time reduced by 65%",
                    "Predicted ADMET properties with 93% accuracy"
                  ]
                }
              },
              {
                marker: "🔸",
                title: "Clinical Trial Optimization",
                process: {
                  title: "How AI Helped:",
                  steps: [
                    "Processed 250,000+ historical trial data points",
                    "Predicted patient responses using ML",
                    "Optimized trial protocols with NLP",
                    "Generated adaptive trial designs"
                  ]
                },
                result: {
                  type: "BREAKTHROUGH VALIDATION",
                  highlight: "✨ 42% Efficiency Gain | 96% Confidence Score",
                  points: [
                    "Trial duration reduced by 8.5 months",
                    "Patient recruitment improved by 67%",
                    "Protocol amendments reduced by 83%"
                  ]
                }
              }
            ]
          },
          {
            icon: "🧪",
            title: "TECHNICAL VALIDATION",
            subtitle: "AI Validation Framework:",
            validation: {
              marker: "🔸",
              title: "Comprehensive Testing",
              process: {
                title: "Validation Methodology:",
                steps: [
                  "Ran 10,000+ virtual screening simulations",
                  "Conducted retrospective analysis on approved drugs",
                  "Performed cross-validation with wet-lab data"
                ]
              },
              finding: {
                type: "KEY FINDING",
                highlight: "✨ 92% Prediction Accuracy",
                points: [
                  "Validated across 5 major therapeutic areas",
                  "Reproduced in 12 independent labs",
                  "Meets FDA AI/ML validation guidelines"
                ]
              }
            }
          }
        ],
        footer: {
          metrics: {
            confidence: "93.5%",
            dataPoints: "2.1M",
            processingTime: "3.4s"
          },
          certifications: [
            "🔒 HIPAA Compliant",
            "✓ GxP Validated",
            "📊 FDA AI Framework Ready"
          ],
          poweredBy: "JediLabs AI™",
          modelInfo: {
            type: "Ensemble",
            components: [
              "GPT-4 Turbo",
              "DrugAI",
              "BioGPT"
            ]
          }
        }
      }
    }
  };

  // Find the config based on the query
  const useCaseConfig = USE_CASE_MAP[query];
  console.log('Found useCaseConfig:', useCaseConfig);

  if (!useCaseConfig) {
    console.log('No config found for query:', query);
    return null;
  }

  const response = responses[useCase.title]?.[useCaseConfig.key];
  console.log('Found response:', response);
  
  return response;
};


export const openAIService = {
  async generateResponse(useCase, query, context) {
    try {
      // Use provided query or default query for the use case
      const useCaseConfig = USE_CASE_MAP[query];
      if (!useCaseConfig) {
        return null;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      return getMockResponse(useCase, query);
    } catch (error) {
      console.error("JediLabs AI Service Error:", error);
      throw error;
    }
  }
}; 

