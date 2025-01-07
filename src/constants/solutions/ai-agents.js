export const aiAgentsSolution = {
  // Basic information
  id: "4",
  title: "AI Agents Solutions",
  shortTitle: "AI Agents",
  slug: "ai-agents",
  description: "Autonomous AI agents that can perform complex tasks and interact with various tools and services.",
  imageUrl: "/images/solutions/ai-agents.jpg",
  icon: "langchain",
  categories: ["AI", "Automation", "Agents", "Machine Learning", "NLP", "Cognitive Computing"],

  // Business value proposition
  businessValue: {
    metrics: [
      "Automate complex workflows with up to 95% reduction in human intervention.",
      "24/7 autonomous operation capability without fatigue or errors.",
      "Reduce task completion time by up to 80% compared to manual processes.",
      "Scale operations across multiple domains with minimal additional cost.",
      "Improve accuracy and consistency in repetitive tasks by 99%.",
      "Enhance customer engagement with personalized interactions."
    ],
    capabilities: [
      "Autonomous decision-making and problem-solving.",
      "Integration with APIs, tools, and third-party services.",
      "Multi-step task planning and execution.",
      "Continuous learning and self-improvement through AI/ML algorithms.",
      "Natural Language Understanding and Generation.",
      "Contextual awareness and memory management."
    ],
    useCases: [
      "AI-Powered Research Assistant for Academic and Scientific Research",
      "Customer Service Agent",
      "Data Analysis Agent",
      "DevOps Automation Agent",
      "Financial Advisory Agent",
      "Healthcare Virtual Assistant",
      "Supply Chain Optimization Agent",
      "Cybersecurity Monitoring Agent",
      "Personalized Marketing Agent",
      "Legal Document Analysis Agent"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "AI Agents Workflow",
    description: "Step-by-step workflow of AI agent processing and analysis",
    layout: {
      type: "workflow",
      spacing: { x: 300, y: 150 },
      startPosition: { x: 100, y: 80 }
    },
    nodes: [
      {
        id: 'review',
        label: 'Healthcare professionals review and validate',
        x: 100,
        y: 80,
        description: 'Expert validation of AI recommendations'
      },
      {
        id: 'diagnose',
        label: 'Generate diagnostic recommendations',
        x: 400,
        y: 80,
        description: 'AI-powered diagnostic analysis'
      },
      {
        id: 'patterns',
        label: 'Identify patterns and correlations in patient data',
        x: 700,
        y: 80,
        description: 'Advanced pattern recognition'
      },
      {
        id: 'analyze',
        label: 'Analyze patient records and clinical data',
        x: 100,
        y: 280,
        description: 'Comprehensive data analysis'
      },
      {
        id: 'process',
        label: 'Process and analyze medical imaging data',
        x: 400,
        y: 280,
        description: 'Medical image processing'
      },
      {
        id: 'gather',
        label: 'Gather patient data from multiple sources',
        x: 700,
        y: 280,
        description: 'Data collection and integration'
      }
    ],
    connections: [
      {
        from: 'analyze',
        to: 'review',
        label: 'Data Analysis'
      },
      {
        from: 'process',
        to: 'diagnose',
        label: 'Image Analysis'
      },
      {
        from: 'gather',
        to: 'patterns',
        label: 'Data Integration'
      },
      {
        from: 'analyze',
        to: 'process',
        label: 'Clinical Context'
      },
      {
        from: 'process',
        to: 'gather',
        label: 'Image Data'
      }
    ]
  },

  // Tech stack details
  techStack: {
    userInterface: {
      'React': {
        icon: 'https://cdn.simpleicons.org/react',
        description: 'JavaScript library for building user interfaces.',
        category: 'User Interface',
        priority: 1
      },
      'Angular': {
        icon: 'https://cdn.simpleicons.org/angular',
        description: 'TypeScript-based open-source web application framework.',
        category: 'User Interface',
        priority: 2
      },
      'Flutter': {
        icon: 'https://cdn.simpleicons.org/flutter',
        description: 'UI toolkit for building natively compiled applications for mobile, web, and desktop.',
        category: 'User Interface',
        priority: 3
      },
      'Chatbot Platforms': {
        icon: 'https://cdn.simpleicons.org/chatbot',
        description: 'Platforms for building conversational interfaces.',
        category: 'User Interface',
        priority: 4
      }
    },
    nlpNlu: {
      'spaCy': {
        icon: 'https://cdn.simpleicons.org/spacy',
        description: 'Open-source library for advanced NLP.',
        category: 'NLP/NLU',
        priority: 1
      },
      'NLTK': {
        icon: 'https://cdn.simpleicons.org/nltk',
        description: 'Platform for building Python programs to work with human language data.',
        category: 'NLP/NLU',
        priority: 2
      },
      'Dialogflow': {
        icon: 'https://cdn.simpleicons.org/dialogflow',
        description: 'Google’s conversational AI development suite.',
        category: 'NLP/NLU',
        priority: 3
      },
      'Rasa': {
        icon: 'https://cdn.simpleicons.org/rasa',
        description: 'Open-source framework for building conversational AI.',
        category: 'NLP/NLU',
        priority: 4
      }
    },
    agentFrameworks: {
      'LangChain': {
        icon: 'https://cdn.simpleicons.org/langchain',
        description: 'Framework for building applications powered by language models.',
        category: 'Agent Core',
        priority: 1
      },
      'OpenAI Functions': {
        icon: 'https://cdn.simpleicons.org/openai',
        description: 'OpenAI’s interface for integrating language models with external functions.',
        category: 'Agent Core',
        priority: 2
      },
      'AutoGPT': {
        icon: 'https://cdn.simpleicons.org/autogpt',
        description: 'Experimental open-source application showcasing the capabilities of GPT-4.',
        category: 'Agent Core',
        priority: 3
      },
      'BabyAGI': {
        icon: 'https://cdn.simpleicons.org/artificialintelligence',
        description: 'Python script that uses GPT-4 to autonomously develop and manage tasks.',
        category: 'Agent Core',
        priority: 4
      }
    },
    toolIntegration: {
      'Zapier': {
        icon: 'https://cdn.simpleicons.org/zapier',
        description: 'Automation platform that connects various apps and services.',
        category: 'Integration',
        priority: 1
      },
      'AWS Lambda': {
        icon: 'https://cdn.simpleicons.org/awslambda',
        description: 'Serverless compute service that runs code in response to events.',
        category: 'Integration',
        priority: 2
      },
      'IFTTT': {
        icon: 'https://cdn.simpleicons.org/ifttt',
        description: 'Service that allows creating chains of conditional statements.',
        category: 'Integration',
        priority: 3
      },
      'Microsoft Power Automate': {
        icon: 'https://cdn.simpleicons.org/microsoft',
        description: 'Service that helps create automated workflows between apps.',
        category: 'Integration',
        priority: 4
      }
    },
    knowledgeBase: {
      'Pinecone': {
        icon: 'https://cdn.simpleicons.org/pinecone',
        description: 'Vector database for high-performance vector search.',
        category: 'Knowledge Base',
        priority: 1
      },
      'Weaviate': {
        icon: 'https://cdn.simpleicons.org/weaviate',
        description: 'Open-source vector search engine and vector DB.',
        category: 'Knowledge Base',
        priority: 2
      },
      'Neo4j': {
        icon: 'https://cdn.simpleicons.org/neo4j',
        description: 'Graph database management system.',
        category: 'Knowledge Base',
        priority: 3
      },
      'Redis': {
        icon: 'https://cdn.simpleicons.org/redis',
        description: 'In-memory data structure store, used as a database, cache, and message broker.',
        category: 'Knowledge Base',
        priority: 4
      }
    },
    taskPlanning: {
      'Ray': {
        icon: 'https://cdn.simpleicons.org/ray',
        description: 'Framework for building and running distributed applications.',
        category: 'Task Planning',
        priority: 1
      },
      'Dask': {
        icon: 'https://cdn.simpleicons.org/dask',
        description: 'Parallel computing library that scales Python code.',
        category: 'Task Planning',
        priority: 2
      },
      'Prefect': {
        icon: 'https://cdn.simpleicons.org/prefect',
        description: 'Workflow management system for data engineers.',
        category: 'Task Planning',
        priority: 3
      },
      'Apache Airflow': {
        icon: 'https://cdn.simpleicons.org/apacheairflow',
        description: 'Platform to programmatically author, schedule, and monitor workflows.',
        category: 'Task Planning',
        priority: 4
      }
    },
    machineLearning: {
      'GPT-4': {
        icon: 'https://cdn.simpleicons.org/openai',
        description: 'Latest language model developed by OpenAI.',
        category: 'Machine Learning',
        priority: 1
      },
      'TensorFlow': {
        icon: 'https://cdn.simpleicons.org/tensorflow',
        description: 'End-to-end open-source platform for machine learning.',
        category: 'Machine Learning',
        priority: 2
      },
      'PyTorch': {
        icon: 'https://cdn.simpleicons.org/pytorch',
        description: 'Open-source machine learning library for Python.',
        category: 'Machine Learning',
        priority: 3
      },
      'scikit-learn': {
        icon: 'https://cdn.simpleicons.org/scikitlearn',
        description: 'Machine learning library for Python.',
        category: 'Machine Learning',
        priority: 4
      }
    },
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Open-source systems monitoring and alerting toolkit.',
        category: 'Monitoring',
        priority: 1
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Open-source platform for data visualization.',
        category: 'Monitoring',
        priority: 2
      },
      'ELK Stack': {
        icon: 'https://cdn.simpleicons.org/elastic',
        description: 'Collection of three open-source products: Elasticsearch, Logstash, and Kibana.',
        category: 'Monitoring',
        priority: 3
      },
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Monitoring service for cloud-scale applications.',
        category: 'Monitoring',
        priority: 4
      }
    },
    security: {
      'OAuth2': {
        icon: 'https://cdn.simpleicons.org/oauth',
        description: 'Industry-standard protocol for authorization.',
        category: 'Security',
        priority: 1
      },
      'JWT': {
        icon: 'https://cdn.simpleicons.org/jsonwebtokens',
        description: 'Open standard for securely transmitting information.',
        category: 'Security',
        priority: 2
      },
      'Encryption Libraries': {
        icon: 'https://cdn.simpleicons.org/gnupg',
        description: 'Tools for securing data.',
        category: 'Security',
        priority: 3
      },
      'AWS Identity and Access Management': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Manage access to AWS services and resources.',
        category: 'Security',
        priority: 4
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codesandbox',
        description: 'Environment for agent development and testing.',
        tools: ["Docker Compose", "Localhost Servers", "Mock APIs"]
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Controlled environment for agent evaluation before production.',
        tools: ["Kubernetes Clusters", "Helm Charts", "Continuous Integration"]
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live environment serving end-users.',
        tools: ["AWS ECS/EKS", "Azure Container Instances", "Google Kubernetes Engine"]
      },
      {
        name: 'Testing',
        icon: 'https://cdn.simpleicons.org/testinglibrary',
        description: 'Automated testing environment.',
        tools: ["JUnit", "Selenium", "PyTest", "Jenkins"]
      },
      {
        name: 'Disaster Recovery',
        icon: 'https://cdn.simpleicons.org/evergreen',
        description: 'Backup environment for high availability.',
        tools: ["Multi-region Deployment", "Data Replication", "Failover Mechanisms"]
      }
    ],
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Systems monitoring and alerting toolkit.'
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics software.'
      },
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application performance monitoring.'
      },
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Monitoring service for cloud-scale applications.'
      }
    },
    security: {
      'HashiCorp Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Securely store and access secrets.'
      },
      'AWS IAM': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Manage access to AWS services and resources.'
      },
      'Azure Active Directory': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Identity and access management cloud solution.'
      },
      'SSL/TLS Encryption': {
        icon: 'https://cdn.simpleicons.org/letsencrypt',
        description: 'Secure communications over networks.'
      }
    },
    compliance: {
      'GDPR Compliance Tools': {
        icon: 'https://cdn.simpleicons.org/gdpr',
        description: 'Ensure data protection and privacy in the EU.'
      },
      'HIPAA Compliance': {
        icon: 'https://cdn.simpleicons.org/hipaa',
        description: 'Secure handling of sensitive patient data.'
      },
      'Audit Logging': {
        icon: 'https://cdn.simpleicons.org/audible',
        description: 'Record system activities for audits.'
      },
      'Data Anonymization': {
        icon: 'https://cdn.simpleicons.org/anonymous',
        description: 'Protect personal data by anonymizing it.'
      }
    }
  }
};