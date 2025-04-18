import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

import { cohere, langchain, openai, anthropic, aws, clay, lambda, snowflake } from "../assets/stack";


export const navigation = [
  {
    id: "0",
    title: "Solutions",
    url: "/solutions",
    dropdownItems: [
      {
        title: "AI/ML Solutions",
        url: "/solutions/ai-ml-solutions"
      },
      {
        title: "AI Agents",
        url: "/solutions/ai-agents"
      },
      {
        title: "Data Engineering",
        url: "/solutions/data-engineering"
      },
      {
        title: "MLOps & Model Deployment",
        description: "Coming Soon"
      },
      {
        title: "Computer Vision",
        description: "Coming Soon"
      },
      {
        title: "Knowledge as a Service",
        description: "Coming Soon"
      }
    ]
  },
  {
    id: "1",
    title: "Technology",
    url: "/technology",
    dropdownItems: [
      {
        title: "AI Platforms",
        items: [
          { title: "OpenAI", url: "/technology/openai" },
          { title: "LangChain", url: "/technology/langchain" },
          { title: "Hugging Face", url: "/technology/huggingface" }
        ]
      },
      {
        title: "Data & Infrastructure",
        items: [
          { title: "Pinecone", url: "/technology/pinecone" },
          { title: "Weaviate", url: "/technology/weaviate" },
          { title: "Kubernetes", description: "Coming Soon" }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Industries",
    url: "/industries",
    dropdownItems: [
      {
        title: "Financial Services",
        url: "/industries/financial",
        useCases: [
          { title: "Fraud Detection", url: "/industries/financial/fraud-detection" },
          { title: "Risk Analysis", url: "/industries/financial/risk-analysis" }
        ]
      },
      {
        title: "Healthcare",
        url: "/industries/healthcare",
        useCases: [
          { title: "Disease Prediction", url: "/industries/healthcare/disease-prediction" },
          { title: "Patient Care", url: "/industries/healthcare/patient-care" }
        ]
      },
      {
        title: "Manufacturing & Industry 4.0",
        description: "Coming Soon"
      },
      {
        title: "Retail & E-commerce",
        description: "Coming Soon"
      },
      {
        title: "Energy & Utilities",
        description: "Coming Soon"
      },
      {
        title: "Insurance",
        description: "Coming Soon"
      }
    ]
  },
  {
    id: "3",
    title: "Company",
    url: "#",
    dropdownItems: [
      { title: "About Us", url: "/about" },
      { title: "Team", url: "/team" },
      { title: "Careers", description: "Coming Soon" },
      { title: "Contact", url: "/contact" }
    ]
  },
  {
    id: "4",
    title: "Resources",
    url: "#",
    dropdownItems: [
      { title: "Case Studies", description: "Coming Soon" },
      { title: "Documentation", description: "Coming Soon" },
      { title: "Blog", url: "/blog" }
    ]
  }
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [
  {
    image: cohere,
    name: "COHERE",
    services: ["Text Generation", "Classification", "Embeddings"]
  },
  {
    image: langchain,
    name: "LANGCHAIN",
    services: ["LLM Framework", "Agents", "Memory"]
  },
  {
    image: openai,
    name: "OPENAI",
    services: ["GPT Models", "DALL-E", "Whisper"]
  },
  {
    image: anthropic,
    name: "ANTHROPIC",
    services: ["Claude AI", "Constitutional AI"]
  },
  {
    image: aws,
    name: "AWS",
    services: ["Cloud Computing", "ML Services", "Databases"]
  },
  {
    image: clay,
    name: "CLAY",
    services: ["Data Enrichment", "Lead Generation"]
  },
  {
    image: lambda,
    name: "LAMBDA",
    services: ["Serverless", "Auto Scaling", "Pay-per-use"]
  },
  {
    image: snowflake,
    name: "SNOWFLAKE",
    services: ["Data Warehouse", "Analytics", "Data Sharing"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
    name: "MONGODB",
    services: ["NoSQL Database", "Atlas", "Realm"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/postgresql.svg",
    name: "POSTGRESQL",
    services: ["SQL Database", "ACID Compliance", "JSON Support"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/redis.svg",
    name: "REDIS",
    services: ["In-Memory DB", "Caching", "Pub/Sub"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/docker.svg",
    name: "DOCKER",
    services: ["Containerization", "Microservices", "DevOps"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/terraform-enterprise.svg",
    name: "TERRAFORM",
    services: ["Infrastructure as Code", "Cloud Provisioning"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/grafana.svg",
    name: "GRAFANA",
    services: ["Monitoring", "Visualization", "Analytics"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/python-5.svg",
    name: "PYTHON",
    services: ["ML/AI", "Web Dev", "Automation"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
    name: "TYPESCRIPT",
    services: ["Type Safety", "JavaScript Superset", "Enterprise Dev"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
    name: "REACT",
    services: ["UI Library", "Component-Based", "Virtual DOM"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/huggingface-2.svg",
    name: "HUGGING FACE",
    services: ["Model Hub", "Transformers", "NLP Tools"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/tensorflow-2.svg",
    name: "TENSORFLOW",
    services: ["Deep Learning", "Neural Networks", "ML Models"]
  },
  {
    
    image: "https://cdn.worldvectorlogo.com/logos/pytorch-2.svg",
    name: "PYTORCH",
    services: ["Deep Learning", "Research", "Production ML"]
  },
  {
    image: "https://cdn.worldvectorlogo.com/logos/nvidia.svg",
    name: "NVIDIA",
    services: ["GPU Computing", "CUDA", "AI Infrastructure"]
  },

  {
    image: "https://www.vectorlogo.zone/logos/databricks/databricks-icon.svg",
    name: "DATABRICKS",
    services: ["Lakehouse", "ML Platform", "Data Analytics"]
  },

  {
    image: "https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg",
    name: "NODEJS",
    services: ["Server-Side", "JavaScript Runtime", "Event-Driven"]
  },
  // {
  //   image: "https://www.vectorlogo.zone/logos/weaviate/weaviate-icon.svg",
  //   name: "WEAVIATE",
  //   services: ["Vector DB", "Neural Search", "Semantic Search"]
  // },
  {
    image: "https://www.vectorlogo.zone/logos/fastly/fastly-icon.svg",
    name: "Fastly API",
    services: ["Streaming", "Edge Computing", "CDN"]
  },
  {
    image: "https://www.vectorlogo.zone/logos/neo4j/neo4j-icon.svg",
    name: "NEO4J",
    services: ["Graph Database", "Knowledge Graphs", "Graph Neural Networks"]
  },
  {
    image: "https://www.vectorlogo.zone/logos/python/python-icon.svg",
    name: "PYTHON",
    services: ["Data Engineering", "Machine Learning", "Data Processing"]
  },
  // {
  //   image: "https://www.vectorlogo.zone/icons/qdrant/qdrant-icon.svg",
  //   name: "QDRANT",
  //   services: ["Vector Search", "Semantic Search", "ML Similarity"]
  // },
  {
    image: "https://simpleicons.org/icons/ollama.svg",
    name: "OLLAMA",
    services: ["Local LLMs", "Model Management", "API"]
},
  {
    image: "https://simpleicons.org/icons/mlflow.svg",
    name: "MLFLOW",
    services: ["ML Lifecycle", "Experiment Tracking", "Model Registry"]
  },
  {
    image: "https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg",
    name: "ELASTIC",
    services: ["Search", "Analytics", "Observability"]
  },     
  {
    image: "https://simpleicons.org/icons/ray.svg",
    name: "RAY",
    services: ["Distributed ML", "Scaling AI", "Model Training"]
  },
  {
    image: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
    name: "GOOGLE CLOUD",
    services: ["Cloud Computing", "ML Services", "Databases"]
  },
  // {
  //   image: "https://www.vectorlogo.zone/logos/langchain/langchain-icon.svg",
  //   name: "Langchain",
  //   services: ["LLM Framework", "Agents", "Memory"]
  // },
  // {
  //   image: "https://www.vectorlogo.zone/logos/pytorch_lightning/pytorch_lightning-icon.svg",
  //   name: "LIGHTNING AI",
  //   services: ["ML Training", "Model Development", "AI Apps"]
  // },
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  // sliders04,
  // sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "AI for Healthcare ",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Rise of AI Agents",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Realtime Answer Retrieval (RAG)",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Knowledge as a Service (KaaS)",
    text: "Knowledge as a Service (KaaS) provides on-demand access to a comprehensive knowledge base tailored to your business needs. With KaaS, your organization can integrate expert insights, curated data, and advanced AI-driven knowledge systems to enhance decision-making, optimize workflows, and reduce operational costs. This service ensures that your team has immediate access to critical information, fostering continuous learning and innovation",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
  {
    id: "3",
    title: "Understanding Prompt Engineering",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText1 =
  "We partner with entrepreneurs, executives, and businesses to transform innovative ideas into fully functional, scalable software solutions and have the expertise to bring your vision to life.";

export const collabText2 =
  "Offering full-stack development, seamless system integration, and cloud-based solutions, we provide everything you need to build, launch, and grow your business successfully.";

export const collabText3 =
  "Our solutions are built to withstand economic downturns, ensuring that your technology remains robust and adaptable, keeping your business resilient and competitive, even in challenging market conditions";

export const collabContent = [
  {
    id: "0",
    title: "Enterprise AI Solutions",
    text: "Production-ready AI systems with custom LLMs, RAG architectures, and intelligent automation platforms",
    subcategories: [
      "Custom LLM Development",
      "Retrieval Augmented Generation",
      "Enterprise MLOps"
    ]
  },
  {
    id: "1",
    title: "AI Agents & Automation",
    text: "Autonomous AI agents that handle complex workflows, integrate with existing tools, and continuously learn",
    subcategories: [
      "Multi-Agent Systems",
      "Tool & API Integration",
      "Autonomous Workflows"
    ]
  },
  {
    id: "2",
    title: "Knowledge Infrastructure",
    text: "End-to-end knowledge processing pipelines, vector databases, and semantic search systems",
    subcategories: [
      "Vector Search & Embeddings",
      "Knowledge Graphs",
      "Semantic Processing"
    ]
  },
  {
    id: "3",
    title: "AI Strategy & Implementation",
    text: "Strategic consulting and implementation of AI solutions aligned with business objectives",
    subcategories: [
      "Use Case Discovery",
      "POC Development",
      "Production Scaling"
    ]
  }
];

export const collabApps = [
  {
    id: "0",
    title: "OpenAI",
    icon: "https://cdn.worldvectorlogo.com/logos/openai-2.svg",
    width: 34,
    height: 34,
  },
  {

    id: "1",
    title: "REACT",
    icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
    width: 34,
    height: 34,
  },
  {
    id: "2",
    title: "Llama Index",
    icon: "https://simpleicons.org/icons/ollama.svg",
    width: 34,
    height: 34,
  },
  {
    id: "3",
    title: "Hugging Face",
    icon: "https://cdn.worldvectorlogo.com/logos/huggingface-2.svg",
    width: 34,
    height: 34,
  },
  {
    id: "4",
    title: "Next.Js",
    icon: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Anthropic",
    icon: "https://simpleicons.org/icons/anthropic.svg",
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "NVIDIA",
    icon: "https://cdn.worldvectorlogo.com/logos/nvidia.svg",
    width: 34,
    height: 34,
  },
  {
    id: "7",
    title: "Neo4j",
    icon: "https://simpleicons.org/icons/neo4j.svg",
    width: 34,
    height: 34,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Web Development",
    description: "Modern Websites, Advanced Features",
    price: "1-5K",
    features: [
      "Professional website development tailored to your business needs",
      "Responsive design with optimized performance",
      "Integration with essential tools (CMS, analytics, SEO)",
      "1-month post-launch support to resolve issues quickly",
    ],
  },
  {
    id: "1",
    title: "Full-Stack Transformation",
    description: "Web, AI, and Data Infrastructure",
    price: "5-10K",
    features: [
      "End-to-end web and backend development for dynamic apps",
      "AI-powered chatbots and analytics for enhanced user interaction",
      "Data pipeline integration and visualization tools for real-time insights",
      "Priority support for 3 months to ensure seamless functionality and adaptation",
    ],
  },
  {
    id: "2",
    title: "Next-Gen ML Transformation",
    description: "Vector DBs, Embeddings, Graph DBs, RAG Implementation",
    price: "10-50K",
    features: [
      "Custom implementation of vector databases for semantic search",
      "Advanced embeddings and graph databases for robust data relationships",
      "Graph-based RAG architecture for real-time, context-aware answers",
      "6-month dedicated support for fine-tuning and scaling the solution",
    ],
  },
  {
    id: "4",
    title: "Enterprise",
    description: "Vector DBs, Embeddings, Graph DBs, RAG Implementation",
    price: "Reach out",
    features: [
      "All the above & beyond",
    ],
  },
];


export const benefits = [
  {
    id: "0",
    title: "AI/ML Solutions",
    text: "Custom AI models, LLM integration, RAG systems, and intelligent automation",
    slug: "ai-ml-solutions",
    imageUrl: "/path/to/hero-image.jpg",
    
    // Overview Tab Data
    subcategories: [
      "Custom AI Model Development",
      "LLM Integration & Fine-tuning",
      "RAG Systems Implementation",
      "AI Automation Workflows"
    ],
    benefits: [
      "Increased Operational Efficiency",
      "Enhanced Decision Making",
      "Reduced Costs",
      "Scalable AI Solutions"
    ],

    // Technical Tab Data
    techStack: [
      {
        name: "PyTorch",
        icon: "https://www.vectorlogo.zone/logos/pytorch/pytorch-icon.svg"
      },
      {
        name: "TensorFlow",
        icon: "https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg"
      },
      {
        name: "Langchain",
        icon: "/path/to/langchain-icon.svg"
      },
      {
        name: "ChromaDB",
        icon: "https://www.vectorlogo.zone/logos/trychroma/trychroma-icon.svg"
      }
    ],
    architectureDiagram: "/path/to/architecture-diagram.svg",
    
    // Case Studies Tab Data
    caseStudies: [
      {
        title: "Enterprise RAG Implementation",
        description: "Implemented a custom RAG system for a Fortune 500 company to improve document search and knowledge management.",
        image: "/path/to/case-study-1.jpg",
        results: [
          "90% reduction in search time",
          "75% improvement in answer accuracy",
          "50% decrease in support tickets"
        ],
        metrics: [
          { label: "ROI", value: "300%" },
          { label: "Time Saved", value: "1000hrs" },
          { label: "Accuracy", value: "95%" }
        ]
      },
      {
        title: "LLM Fine-tuning Project",
        description: "Custom-trained LLM for specialized industry knowledge and compliance requirements.",
        image: "/path/to/case-study-2.jpg",
        results: [
          "Specialized domain expertise",
          "Compliance adherence",
          "Reduced operational costs"
        ]
      }
    ],

    // Documentation Tab Data
    documentation: [
      {
        title: "Getting Started",
        content: "Step-by-step guide to implementing our AI solutions...",
        sections: [
          { title: "Prerequisites", content: "..." },
          { title: "Installation", content: "..." },
          { title: "Configuration", content: "..." }
        ]
      },
      {
        title: "API Reference",
        content: "Detailed API documentation...",
        sections: [
          { title: "Authentication", content: "..." },
          { title: "Endpoints", content: "..." },
          { title: "Examples", content: "..." }
        ]
      },
      {
        title: "Best Practices",
        content: "Recommended approaches and patterns...",
        sections: [
          { title: "Architecture", content: "..." },
          { title: "Security", content: "..." },
          { title: "Scaling", content: "..." }
        ]
      }
    ],

    // Additional Metadata
    features: [
      {
        title: "Custom AI Models",
        description: "Tailored AI solutions for your specific needs",
        icon: "🤖"
      },
      {
        title: "LLM Integration",
        description: "Seamless integration with leading language models",
        icon: "🔄"
      },
      {
        title: "RAG Systems",
        description: "Advanced retrieval-augmented generation",
        icon: "📚"
      }
    ],
    
    // Integration Options
    integrations: [
      {
        type: "API",
        description: "RESTful API integration",
        documentation: "/docs/api"
      },
      {
        type: "SDK",
        description: "Native SDK for major platforms",
        documentation: "/docs/sdk"
      }
    ],

    // Deployment Options
    deployment: [
      {
        type: "Cloud",
        platforms: ["AWS", "Azure", "GCP"]
      },
      {
        type: "On-Premise",
        requirements: ["Docker", "Kubernetes"]
      }
    ]
  },
  {
    id: "1",
    title: "Full-Stack Development",
    text: "Modern web apps, APIs, cloud architecture, and scalable backends",
    slug: "full-stack-development",
    imageUrl: "/images/solutions/full-stack.jpg",

    subcategories: [
      "Modern Web Applications",
      "RESTful & GraphQL APIs",
      "Cloud-Native Architecture",
      "Microservices Development"
    ],
    benefits: [
      "Rapid Development & Deployment",
      "Scalable Infrastructure",
      "Enhanced Performance",
      "Future-Proof Technology"
    ],

    techStack: [
      {
        name: "React",
        icon: "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
      },
      {
        name: "Node.js",
        icon: "https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg"
      },
      {
        name: "TypeScript",
        icon: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg"
      },
      {
        name: "AWS",
        icon: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg"
      }
    ],
    architectureDiagram: "/images/diagrams/full-stack-arch.svg",

    caseStudies: [
      {
        title: "E-Commerce Platform Modernization",
        description: "Transformed a legacy e-commerce system into a modern, scalable platform",
        image: "/images/case-studies/ecommerce.jpg",
        results: [
          "300% increase in page load speed",
          "50% reduction in infrastructure costs",
          "99.99% uptime achievement"
        ],
        metrics: [
          { label: "Performance", value: "+300%" },
          { label: "Cost Reduction", value: "50%" },
          { label: "Uptime", value: "99.99%" }
        ]
      }
    ],

    documentation: [
      {
        title: "Architecture Overview",
        content: `
# Full-Stack Architecture

Our full-stack solution uses a modern, scalable architecture:

\`\`\`mermaid
graph TD
    A[Client] --> B[CDN]
    B --> C[Load Balancer]
    C --> D[API Gateway]
    D --> E[Microservices]
    E --> F[Database]
\`\`\`
        `,
        sections: [
          { 
            title: "Frontend Architecture",
            content: "React-based SPA with Next.js for SSR..."
          },
          {
            title: "Backend Services",
            content: "Node.js microservices with Express..."
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Data Engineering",
    text: "Data pipelines, warehousing, analytics, and real-time processing",
    slug: "data-engineering",
    imageUrl: "/images/solutions/data-engineering.jpg",

    subcategories: [
      "ETL Pipeline Development",
      "Data Warehouse Design",
      "Real-time Analytics",
      "Data Lake Implementation"
    ],
    benefits: [
      "Automated Data Processing",
      "Real-time Insights",
      "Data-Driven Decisions",
      "Improved Data Quality"
    ],

    techStack: [
      {
        name: "Apache Spark",
        icon: "https://www.vectorlogo.zone/logos/apache_spark/apache_spark-icon.svg"
      },
      {
        name: "Snowflake",
        icon: "/images/tech/snowflake.svg"
      },
      {
        name: "Airflow",
        icon: "https://www.vectorlogo.zone/logos/apache_airflow/apache_airflow-icon.svg"
      },
      {
        name: "Kafka",
        icon: "https://www.vectorlogo.zone/logos/apache_kafka/apache_kafka-icon.svg"
      }
    ],
    architectureDiagram: "/images/diagrams/data-engineering-arch.svg",

    caseStudies: [
      {
        title: "Real-time Analytics Platform",
        description: "Built a real-time analytics platform processing millions of events per second",
        image: "/images/case-studies/analytics.jpg",
        results: [
          "Processing 1M+ events/second",
          "Sub-second query response",
          "90% reduction in processing costs"
        ],
        metrics: [
          { label: "Events/sec", value: "1M+" },
          { label: "Latency", value: "<1s" },
          { label: "Cost Savings", value: "90%" }
        ]
      }
    ]
  }
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "https://www.linkedin.com/company/jedilabs/",
  },
  // {
  //   id: "1",
  //   title: "Twitter",
  //   iconUrl: twitter,
  //   url: "#",
  // },
  // {
  //   id: "2",
  //   title: "Instagram",
  //   iconUrl: instagram,
  //   url: "#",
  // },
  // {
  //   id: "3",
  //   title: "Telegram",
  //   iconUrl: telegram,
  //   url: "#",
  // },
  // {
  //   id: "4",
  //   title: "Facebook",
  //   iconUrl: facebook,
  //   url: "#",
  // },
];



// Service Content
// constants.js
export const serviceContent = [
  {
    title: "AI-Powered Healthcare Transformation",
    title2: "100x Medical Diagnostic Efficiency",
    subtitle: "Revolutionize Healthcare Diagnostics with Exponential AI Solutions",
    description: "Our AI-powered diagnostic platform reduces analysis time by 97%, enabling medical professionals to diagnose conditions in seconds rather than hours.\n\nThis exponential improvement in efficiency translates to faster patient care, reduced costs, and significantly improved outcomes across healthcare organizations. Hospitals implementing our solution have seen dramatic improvements in patient throughput and diagnostic accuracy.",
    video: "/videos/medical-ai.mp4",
    useCases: [
      "Reduce diagnostic time from 30 minutes to just 30 seconds - a 60x improvement",
      "Increase radiologist productivity by up to 400% through AI-assisted workflows",
      "Achieve 99.7% accuracy in pneumonia detection, exceeding human-only diagnosis"
    ],
  },
  {
    title: "Financial Intelligence Platform",
    title2: "100x Revenue Optimization & Cost Efficiency",
    subtitle: "Transform Financial Decision-Making with AI-Powered Analytics",
    description: "Our comprehensive financial intelligence platform leverages advanced AI to identify revenue opportunities and cost efficiencies that traditional analysis misses.\n\nOrganizations implementing our solution have achieved revenue increases of up to 120x while simultaneously reducing operational costs by 60-90% through intelligent automation and predictive analytics.",
    video: "/videos/analytics.mp4",
    useCases: [
      "Identify hidden revenue opportunities worth 10-100x your current growth projections",
      "Reduce financial decision-making time from weeks to minutes - a 1000x improvement",
      "Automate 95% of manual financial processes while improving accuracy by 99.9%",
      "Achieve real-time financial visibility across all business units"
    ],
  },
  {
    title: "Intelligent Customer Engagement",
    title2: "100x Customer Relationship Transformation",
    subtitle: "Revolutionize Customer Interactions with AI-Powered Conversations",
    description: "Our Retrieval-Augmented Generation (RAG) platform transforms customer engagement by delivering personalized, accurate, and contextually relevant interactions at scale.\n\nCompanies implementing this solution have seen conversion rates increase by up to 150x while reducing customer service costs by 80% through intelligent automation of complex interactions.",
    video: "/videos/rdChat.mp4",
    useCases: [
      "Handle 100x more customer inquiries without increasing support staff",
      "Increase conversion rates by 15-150x through hyper-personalized engagement",
      "Reduce customer resolution time from days to seconds - a 1000x improvement"
    ],
  },
  {
    title: "Marketing ROI Maximizer",
    title2: "100x Marketing Performance Transformation",
    subtitle: "Achieve Exponential Marketing Returns Through AI-Powered Optimization",
    description: "Our machine learning marketing platform transforms raw advertising data into predictive insights that have delivered over 400% ROI for our clients.\n\nBy identifying high-performing channels, optimizing spend allocation in real-time, and predicting future performance, we help businesses achieve marketing results that were previously thought impossible.",
    video: "/videos/HH.mp4",
    useCases: [
      "Increase marketing ROI by 5-40x through AI-optimized channel allocation",
      "Predict customer lifetime value with 92% accuracy to focus acquisition efforts",
      "Reduce customer acquisition costs by 75-90% while increasing conversion quality",
      "Transform marketing from a cost center to a predictable revenue engine"
    ],
  },
];


export const brainwaveServices = [
  "Test",
  "Full-Stack Engineering",
  "Seamless Integration",
];




// Slider Settings
export const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};


