const commonLayouts = {
    horizontal: {
      spacing: { x: 300, y: 170 },
      startPosition: { x: 100, y: 80 }
    },
    vertical: {
      spacing: { x: 300, y: 200 },
      startPosition: { x: 100, y: 50 }
    }
  };
  
  const architectureDiagrams = {
    'ai-ml-solutions': {
      useCase: {
        title: "AI/ML Solutions Architecture",
        description: "Intelligent system that understands and processes information like a human assistant",
        businessValue: [
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
        examples: [
          "Customer Support Automation",
          "Document Analysis & Summary",
          "Intelligent Search Assistant",
          "Content Generation Helper"
        ],
        deployment: {
          environments: [
            "Development",
            "Staging",
            "Production",
            "DR Environment"
          ],
          infrastructure: [
            "AWS/Azure/GCP",
            "Kubernetes",
            "Docker",
            "Serverless",
            "Terraform",
            "GitLab"
          ],
          monitoring: [
            "Grafana",
            "Prometheus",
            "ELK Stack",
            "Datadog"
          ]
        }
      },
      nodes: [
        {
          id: 'frontend',
          label: 'Client Interface',
          x: 100,
          y: 80,
          description: 'Web interface for AI interactions',
          technologies: {
            frontend: ["React", "Next.js", "TypeScript"],
            ui: ["TailwindCSS", "Framer Motion"],
            state: ["Redux", "React Query"]
          }
        },
        {
          id: 'api',
          label: 'API Gateway',
          x: 400,
          y: 80,
          description: 'Request routing and orchestration',
          technologies: {
            backend: ["FastAPI", "gRPC"],
            auth: ["JWT", "OAuth2"],
            monitoring: ["OpenTelemetry"]
          }
        },
        {
          id: 'llm',
          label: 'LLM Service',
          x: 700,
          y: 80,
          description: 'Language model processing',
          technologies: {
            ml: ["GPT-4", "LangChain"],
            processing: ["PyTorch", "TensorFlow"],
            optimization: ["ONNX", "TensorRT"]
          }
        },
        {
          id: 'storage',
          label: 'Document Store',
          x: 250,
          y: 250,
          description: 'Document and metadata storage',
          technologies: {
            storage: ["PostgreSQL", "S3"],
            search: ["Elasticsearch"],
            cache: ["Redis"]
          }
        },
        {
          id: 'vector',
          label: 'Vector Store',
          x: 550,
          y: 250,
          description: 'Vector embeddings and similarity search',
          technologies: {
            vectordb: ["Pinecone", "Weaviate"],
            embeddings: ["OpenAI Ada", "HuggingFace"],
            analytics: ["Prometheus", "Grafana"]
          }
        }
      ],
      connections: [
        {
          from: 'frontend',
          to: 'api',
          label: 'HTTP/WS'
        },
        {
          from: 'api',
          to: 'llm',
          label: 'gRPC'
        },
        {
          from: 'storage',
          to: 'api',
          label: 'Data'
        },
        {
          from: 'api',
          to: 'vector',
          label: 'Search'
        },
        {
          from: 'llm',
          to: 'vector',
          label: 'Embeddings'
        }
      ]
    },
  
    'full-stack-development': {
      useCase: {
        title: "Full-Stack Web Application",
        description: "Modern scalable web application architecture",
        businessValue: [
          "Rapid development and deployment cycles",
          "Scalable from startup to enterprise",
          "Optimized user experience",
          "Real-time data synchronization"
        ],
        capabilities: [
          "Responsive cross-platform interface",
          "Real-time data updates",
          "Secure authentication & authorization",
          "Automated testing & deployment"
        ],
        examples: [
          "E-commerce Platform",
          "Social Media Application",
          "Enterprise Dashboard",
          "Collaboration Tools"
        ],
        deployment: {
          environments: [
            "Development",
            "Staging",
            "Production",
            "Edge CDN"
          ],
          infrastructure: [
            "AWS/Vercel",
            "Docker",
            "Kubernetes",
            "CloudFlare",
            "GitHub Actions"
          ],
          monitoring: [
            "New Relic",
            "Sentry",
            "DataDog",
            "LogRocket"
          ]
        }
      },
      nodes: [
        {
          id: 'frontend',
          label: 'Frontend App',
          x: 100,
          y: 80,
          description: 'Modern web application interface',
          technologies: {
            core: ["React", "Next.js", "TypeScript"],
            styling: ["TailwindCSS", "Styled Components"],
            state: ["Redux Toolkit", "React Query"]
          }
        },
        {
          id: 'backend',
          label: 'API Server',
          x: 400,
          y: 80,
          description: 'RESTful/GraphQL API service',
          technologies: {
            runtime: ["Node.js", "Express", "NestJS"],
            api: ["REST", "GraphQL", "WebSocket"],
            auth: ["JWT", "OAuth2", "Passport"]
          }
        },
        {
          id: 'database',
          label: 'Database',
          x: 700,
          y: 80,
          description: 'Data persistence layer',
          technologies: {
            primary: ["PostgreSQL", "MongoDB"],
            orm: ["Prisma", "TypeORM"],
            cache: ["Redis", "Memcached"]
          }
        },
        {
          id: 'cdn',
          label: 'CDN & Assets',
          x: 250,
          y: 250,
          description: 'Content delivery and static assets',
          technologies: {
            cdn: ["CloudFlare", "Akamai"],
            storage: ["S3", "CloudFront"],
            media: ["ImageKit", "Cloudinary"]
          }
        },
        {
          id: 'devops',
          label: 'DevOps',
          x: 550,
          y: 250,
          description: 'CI/CD and infrastructure',
          technologies: {
            ci: ["GitHub Actions", "Jenkins"],
            monitoring: ["Grafana", "Prometheus"],
            logging: ["ELK Stack", "Papertrail"]
          }
        }
      ],
      connections: [
        {
          from: 'frontend',
          to: 'backend',
          label: 'API/WS'
        },
        {
          from: 'backend',
          to: 'database',
          label: 'Queries'
        },
        {
          from: 'frontend',
          to: 'cdn',
          label: 'Assets'
        },
        {
          from: 'backend',
          to: 'devops',
          label: 'Metrics'
        },
        {
          from: 'database',
          to: 'devops',
          label: 'Logs'
        }
      ]
    },
  
    'data-engineering': {
      useCase: {
        title: "Data Engineering Pipeline",
        description: "Turn raw data into actionable business insights automatically",
        businessValue: [
          "Get insights 10x faster than manual analysis",
          "Reduce data processing costs by 60%",
          "Ensure 99.9% data accuracy",
          "Make decisions based on real-time data"
        ],
        capabilities: [
          "Processes data automatically 24/7",
          "Combines data from multiple sources",
          "Creates easy-to-understand reports",
          "Alerts when important changes happen"
        ],
        examples: [
          "Sales Performance Analytics",
          "Customer Behavior Tracking",
          "Inventory Management",
          "Financial Reporting"
        ],
        deployment: {
          environments: [
            "Development",
            "QA",
            "Production",
            "Analytics"
          ],
          infrastructure: [
            "AWS EMR",
            "Databricks",
            "Snowflake",
            "Kubernetes"
          ]
        }
      },
      nodes: [
        {
          id: 'sources',
          label: 'Data Sources',
          x: 100,
          y: 80,
          description: 'Multiple data input streams',
          technologies: {
            streaming: ["Kafka", "Kinesis"],
            batch: ["S3", "HDFS"],
            ingestion: ["Debezium", "Airbyte"]
          }
        },
        {
          id: 'processing',
          label: 'Data Processing',
          x: 400,
          y: 80,
          description: 'ETL and transformation pipeline',
          technologies: {
            compute: ["Spark", "Flink"],
            workflow: ["Airflow", "Dagster"],
            quality: ["Great Expectations", "dbt"]
          }
        },
        {
          id: 'warehouse',
          label: 'Data Warehouse',
          x: 700,
          y: 80,
          description: 'Centralized data storage',
          technologies: {
            storage: ["Snowflake", "Redshift"],
            modeling: ["dbt", "LookML"],
            governance: ["Collibra", "Alation"]
          }
        },
        {
          id: 'analytics',
          label: 'Analytics Engine',
          x: 250,
          y: 250,
          description: 'Business intelligence and analytics',
          technologies: {
            bi: ["Looker", "Tableau"],
            ml: ["SageMaker", "DataRobot"],
            visualization: ["D3.js", "Plotly"]
          }
        },
        {
          id: 'monitoring',
          label: 'Monitoring',
          x: 550,
          y: 250,
          description: 'Pipeline and data monitoring',
          technologies: {
            observability: ["Datadog", "Prometheus"],
            alerting: ["PagerDuty", "Grafana"],
            logging: ["ELK Stack", "Splunk"]
          }
        }
      ],
      connections: [
        {
          from: 'sources',
          to: 'processing',
          label: 'Raw Data'
        },
        {
          from: 'processing',
          to: 'warehouse',
          label: 'Processed'
        },
        {
          from: 'warehouse',
          to: 'analytics',
          label: 'Query'
        },
        {
          from: 'processing',
          to: 'monitoring',
          label: 'Metrics'
        }
      ]
    }
  };
  
  const defaultDiagram = {
    useCase: {
      title: "System Architecture",
      description: "Basic system architecture overview",
      features: [
        "Component Integration",
        "Data Flow Management",
        "System Monitoring",
        "Security Controls"
      ],
      deployment: {
        environments: [
          "Development",
          "Staging",
          "Production"
        ],
        infrastructure: [
          "Cloud Platform",
          "Containers",
          "Serverless"
        ]
      }
    },
    nodes: [
      {
        id: 'frontend',
        label: 'Frontend',
        x: 100,
        y: 80,
        description: 'User interface layer',
        technologies: {
          core: ["React", "TypeScript"],
          ui: ["TailwindCSS"],
          state: ["Redux"]
        }
      },
      {
        id: 'backend',
        label: 'Backend',
        x: 400,
        y: 80,
        description: 'Application logic',
        technologies: {
          core: ["Node.js", "Express"],
          database: ["PostgreSQL"],
          cache: ["Redis"]
        }
      }
    ],
    connections: [
      {
        from: 'frontend',
        to: 'backend',
        label: 'API Calls'
      }
    ]
  };
  
  // Single export statement for all items
  export {
    commonLayouts,
    architectureDiagrams,
    defaultDiagram
  };