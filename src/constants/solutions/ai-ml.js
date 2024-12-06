export const aiMlSolution = {
  // Basic information
  id: "1",
  title: "AI/ML Solutions",
  shortTitle: "AI/ML",
  slug: "ai-ml-solutions",
  description: "Enterprise-grade AI and machine learning solutions for intelligent automation and decision making",
  imageUrl: "/images/solutions/ai-ml.jpg",
  icon: "huggingface",
  categories: ["AI", "Machine Learning", "Deep Learning"],

  // Business value proposition
  businessValue: {
    metrics: [
      "Reduce manual document processing time by 80%",
      "Improve customer response accuracy to 95%",
      "Scale operations without adding headcount",
      "Available 24/7 for instant responses"
    ],
    capabilities: [
      "Understands and processes documents automatically",
      "Answers questions in natural language",
      "Learns from past interactions",
      "Handles multiple requests simultaneously"
    ],
    useCases: [
      "Customer Support Automation",
      "Document Analysis & Summary",
      "Intelligent Search Assistant",
      "Content Generation Helper"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "AI/ML Solutions Architecture",
    description: "Modern AI/ML system architecture with scalable components",
    layout: {
      type: "horizontal",
      spacing: { x: 400, y: 200 },
      startPosition: { x: 100, y: 100 }
    },
    nodes: [
      {
        id: 'frontend',
        label: 'AI Interface',
        x: 100,
        y: 100,
        description: 'User interface for AI interactions',
        technologies: {
          frontend: ["React", "Next.js"],
          ui: ["TailwindCSS"],
          state: ["Redux"]
        }
      },
      {
        id: 'api',
        label: 'ML Gateway',
        x: 600,
        y: 100,
        description: 'AI/ML request orchestration',
        technologies: {
          backend: ["FastAPI", "gRPC"],
          auth: ["JWT"],
          monitoring: ["OpenTelemetry"]
        }
      },
      {
        id: 'processing',
        label: 'ML Processing',
        x: 1100,
        y: 100,
        description: 'Machine learning inference engine',
        technologies: {
          ml: ["TensorFlow", "PyTorch"],
          optimization: ["ONNX"]
        }
      },
      {
        id: 'storage',
        label: 'Training Data',
        x: 350,
        y: 400,
        description: 'ML model training data storage',
        technologies: {
          storage: ["S3", "PostgreSQL"],
          cache: ["Redis"]
        }
      },
      {
        id: 'models',
        label: 'Model Registry',
        x: 850,
        y: 400,
        description: 'ML model versioning and storage',
        technologies: {
          registry: ["MLflow", "DVC"],
          monitoring: ["Prometheus"]
        }
      }
    ],
    connections: [
      {
        from: 'frontend',
        to: 'api',
        label: 'REST/GraphQL'
      },
      {
        from: 'api',
        to: 'processing',
        label: 'Model Inference'
      },
      {
        from: 'storage',
        to: 'processing',
        label: 'Training Data'
      },
      {
        from: 'processing',
        to: 'models',
        label: 'Model Updates'
      },
      {
        from: 'models',
        to: 'api',
        label: 'Model Serving'
      }
    ]
  },

  // Tech stack details
  techStack: {
    aiPlatforms: {
      'OpenAI': {
        icon: 'https://cdn.simpleicons.org/openai',
        description: 'Advanced language models and AI APIs',
        category: 'Core AI',
        priority: 1,
        useCases: [
          "Document Analysis & Summary",
          "Customer Support Automation"
        ]
      },
      'HuggingFace': {
        icon: 'https://cdn.simpleicons.org/huggingface',
        description: 'ML model hub and tools',
        category: 'Core AI',
        priority: 2
      }
    },
    mlOps: {
      'MLflow': {
        icon: 'https://cdn.simpleicons.org/mlflow',
        description: 'ML lifecycle management',
        category: 'Operations',
        priority: 1
      },
      'Kubeflow': {
        icon: 'https://cdn.simpleicons.org/kubeflow',
        description: 'ML toolkit for Kubernetes',
        category: 'Operations',
        priority: 2
      }
    },
    vectorDatabases: {
      'Pinecone': {
        icon: 'https://cdn.simpleicons.org/pinecone',
        description: 'Vector database for embeddings',
        category: 'Data',
        priority: 1
      },
      'Weaviate': {
        icon: 'https://cdn.simpleicons.org/weaviate',
        description: 'Vector search engine',
        category: 'Data',
        priority: 2
      }
    },
    infrastructure: {
      'Kubernetes': {
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Container orchestration platform',
        category: 'Infrastructure',
        priority: 1
      },
      'Docker': {
        icon: 'https://cdn.simpleicons.org/docker',
        description: 'Containerization platform',
        category: 'Infrastructure',
        priority: 2
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codepen',
        description: 'Development Environment for building and testing'
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/testinglibrary',
        description: 'Pre-production environment for final testing'
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live environment serving end users'
      }
    ],
    monitoring: {
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Metrics visualization'
      },
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Monitoring system'
      }
    },
    security: {
      'Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Secrets management'
      },
      'CloudFlare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'Security and performance'
      }
    }
  }
}; 