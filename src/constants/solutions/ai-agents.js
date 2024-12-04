export const aiAgentsSolution = {
  id: "4",
  title: "AI Agents Solutions",
  shortTitle: "AI Agents",
  slug: "ai-agents",
  description: "Autonomous AI agents that can perform complex tasks and interact with various tools and services",
  imageUrl: "/images/solutions/ai-agents.jpg",
  icon: "langchain",
  categories: ["AI", "Automation", "Agents"],

  businessValue: {
    metrics: [
      "Automate complex workflows with 90% less human intervention",
      "24/7 autonomous operation capability",
      "Reduce task completion time by 75%",
      "Scale operations across multiple domains"
    ],
    capabilities: [
      "Autonomous decision making",
      "Tool and API integration",
      "Multi-step task planning",
      "Self-improvement and learning"
    ],
    useCases: [
      "Automated Research Assistant",
      "Customer Service Agent",
      "Data Analysis Agent",
      "DevOps Automation Agent"
    ]
  },

  architecture: {
    title: "AI Agents Architecture",
    description: "Multi-agent system with tool integration and orchestration",
    nodes: [
      {
        id: 'agent-core',
        label: 'Agent Core',
        description: 'Central agent orchestration and decision making',
        technologies: {
          core: ["LangChain", "AutoGPT"],
          reasoning: ["ReAct", "CoT"],
          memory: ["Pinecone", "Redis"]
        }
      },
      {
        id: 'tool-integration',
        label: 'Tool Integration',
        description: 'External tool and API connections',
        technologies: {
          integration: ["LangChain Tools", "Function Calling"],
          apis: ["REST", "GraphQL"],
          auth: ["OAuth2", "API Keys"]
        }
      },
      {
        id: 'knowledge-base',
        label: 'Knowledge Base',
        description: 'Agent knowledge and context storage',
        technologies: {
          vectordb: ["Weaviate", "ChromaDB"],
          storage: ["PostgreSQL", "MongoDB"],
          cache: ["Redis", "Memcached"]
        }
      },
      {
        id: 'task-planning',
        label: 'Task Planning',
        description: 'Goal decomposition and task scheduling',
        technologies: {
          planning: ["Tree of Thoughts", "A* Search"],
          scheduling: ["Celery", "Apache Airflow"],
          optimization: ["Ray", "Dask"]
        }
      },
      {
        id: 'monitoring',
        label: 'Agent Monitoring',
        description: 'Performance and behavior monitoring',
        technologies: {
          observability: ["Prometheus", "Grafana"],
          logging: ["ELK Stack", "Datadog"],
          alerts: ["PagerDuty", "OpsGenie"]
        }
      }
    ],
    connections: [
      {
        from: 'agent-core',
        to: 'tool-integration',
        label: 'Tool Calls'
      },
      {
        from: 'agent-core',
        to: 'knowledge-base',
        label: 'Context'
      },
      {
        from: 'agent-core',
        to: 'task-planning',
        label: 'Goals'
      },
      {
        from: 'task-planning',
        to: 'tool-integration',
        label: 'Tasks'
      },
      {
        from: 'monitoring',
        to: 'agent-core',
        label: 'Feedback'
      }
    ]
  },

  techStack: {
    agentFrameworks: {
      'LangChain': {
        icon: 'https://cdn.simpleicons.org/langchain',
        description: 'Framework for building AI agents',
        category: 'Core',
        priority: 1
      },
      'AutoGPT': {
        icon: 'https://cdn.simpleicons.org/autogpt',
        description: 'Autonomous GPT-4 agent framework',
        category: 'Core',
        priority: 2
      }
    },
    vectorDatabases: {
      'Weaviate': {
        icon: 'https://cdn.simpleicons.org/weaviate',
        description: 'Vector database for agent knowledge',
        category: 'Data',
        priority: 1
      },
      'ChromaDB': {
        icon: 'https://cdn.simpleicons.org/chromadb',
        description: 'Embeddings database',
        category: 'Data',
        priority: 2
      }
    },
    orchestration: {
      'Airflow': {
        icon: 'https://cdn.simpleicons.org/apacheairflow',
        description: 'Task orchestration platform',
        category: 'Operations',
        priority: 1
      },
      'Celery': {
        icon: 'https://cdn.simpleicons.org/celery',
        description: 'Distributed task queue',
        category: 'Operations',
        priority: 2
      }
    }
  },

  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/github',
        description: 'Agent development and testing'
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Controlled agent evaluation'
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live agent deployment'
      }
    ],
    monitoring: {
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Agent metrics visualization'
      },
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Metrics collection'
      }
    }
  }
};
