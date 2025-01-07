// @ts-nocheck
export const aiMlSolution = {
  // Basic information
  id: "1",
  title: "AI/ML Solutions",
  shortTitle: "AI/ML",
  slug: "ai-ml-solutions",
  description: "Enterprise-grade AI and machine learning solutions for intelligent automation and decision-making.",
  imageUrl: "/images/solutions/ai-ml.jpg",
  icon: "huggingface",
  categories: ["AI", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"],

  // Business value proposition
  businessValue: {
    metrics: [
      "Reduce manual document processing time by up to 90%.",
      "Improve customer response accuracy to over 98%.",
      "Increase operational efficiency by 75% through intelligent automation.",
      "Scale operations without proportional increase in headcount.",
      "Available 24/7 for instant responses, improving customer satisfaction by 60%.",
      "Enhance decision-making speed by 5x with predictive analytics."
    ],
    capabilities: [
      "Understands and processes documents automatically using NLP and OCR.",
      "Provides accurate answers to questions in natural language.",
      "Learns from past interactions and continuously improves.",
      "Handles multiple requests simultaneously with horizontal scaling.",
      "Performs predictive analytics for informed decision-making.",
      "Processes and analyzes images and videos using computer vision."
    ],
    useCases: [
      "Customer Support Automation",
      "Document Analysis & Summarization",
      "Intelligent Search Assistant",
      "Content Generation Helper",
      "Predictive Maintenance",
      "Fraud Detection",
      "Personalized Marketing Recommendations",
      "Medical Image Analysis",
      "Voice Assistants",
      "Supply Chain Optimization"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "AI/ML Solutions Architecture",
    description: "Scalable AI/ML system architecture with various components for data processing, model training, and deployment.",
    layout: {
      type: "horizontal",
      spacing: { x: 400, y: 200 },
      startPosition: { x: 100, y: 100 }
    },
    nodes: [
      {
        id: 'data_sources',
        label: 'Data Sources',
        x: 100,
        y: 100,
        description: 'Sources of data for training and inference.',
        technologies: {
          structured: ["Databases (SQL, NoSQL)"],
          unstructured: ["Text Files", "Images", "Videos", "Audio"],
          streaming: ["Kafka", "Kinesis"],
          APIs: ["Third-party APIs", "Web Scraping"]
        }
      },
      {
        id: 'data_ingestion',
        label: 'Data Ingestion',
        x: 450,
        y: 100,
        description: 'Ingesting data securely and efficiently.',
        technologies: {
          tools: ["Apache NiFi", "AWS Glue", "Fivetran"],
          formats: ["CSV", "JSON", "Parquet"]
        }
      },
      {
        id: 'data_processing',
        label: 'Data Processing & Feature Engineering',
        x: 800,
        y: 100,
        description: 'Processing data and extracting features.',
        technologies: {
          bigData: ["Apache Spark", "Dask"],
          dataPrep: ["Pandas", "NumPy"],
          featureStore: ["Feast", "Hopsworks"]
        }
      },
      {
        id: 'model_training',
        label: 'Model Training',
        x: 1150,
        y: 100,
        description: 'Training ML models.',
        technologies: {
          frameworks: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn"],
          hardware: ["GPUs", "TPUs", "AutoML"],
          distributedTraining: ["Horovod", "Ray"]
        }
      },
      {
        id: 'model_registry',
        label: 'Model Registry',
        x: 1500,
        y: 100,
        description: 'Version control and storage for ML models.',
        technologies: {
          tools: ["MLflow", "DVC", "Kubeflow Model Registry"],
          repositories: ["Git", "Artifact Repositories"]
        }
      },
      {
        id: 'model_serving',
        label: 'Model Serving',
        x: 1500,
        y: 300,
        description: 'Deploying models for inference.',
        technologies: {
          serving: ["TensorFlow Serving", "TorchServe", "KFServing", "Seldon Core"],
          APIs: ["REST", "gRPC"],
          containers: ["Docker", "Kubernetes"]
        }
      },
      {
        id: 'inference_api',
        label: 'Inference API',
        x: 1150,
        y: 300,
        description: 'API layer for model inference.',
        technologies: {
          backend: ["FastAPI", "Flask", "Express.js"],
          authentication: ["OAuth2", "JWT"],
          rateLimiting: ["NGINX", "API Gateways"]
        }
      },
      {
        id: 'frontend_ui',
        label: 'Frontend UI',
        x: 800,
        y: 300,
        description: 'User interface for interaction.',
        technologies: {
          webApps: ["React", "Angular", "Vue.js"],
          mobileApps: ["Flutter", "React Native"],
          dashboards: ["Dash", "Streamlit"]
        }
      },
      {
        id: 'monitoring_logging',
        label: 'Monitoring & Logging',
        x: 450,
        y: 300,
        description: 'Monitoring models and applications.',
        technologies: {
          monitoring: ["Prometheus", "Grafana", "ELK Stack"],
          logging: ["Logstash", "Splunk"],
          APM: ["New Relic", "Datadog"],
          mlMonitoring: ["WhyLabs", "Evidently AI"]
        }
      },
      {
        id: 'feedback_loop',
        label: 'Feedback Loop',
        x: 100,
        y: 300,
        description: 'Continuous learning and model improvement.',
        technologies: {
          dataLabeling: ["Labelbox", "AWS SageMaker Ground Truth"],
          activeLearning: ["Uncertainty Sampling", "Reinforcement Learning"],
          cicd: ["Jenkins", "GitHub Actions", "Azure DevOps"]
        }
      }
    ],
    connections: [
      {
        from: 'data_sources',
        to: 'data_ingestion',
        label: 'Raw Data'
      },
      {
        from: 'data_ingestion',
        to: 'data_processing',
        label: 'Ingested Data'
      },
      {
        from: 'data_processing',
        to: 'model_training',
        label: 'Processed Data'
      },
      {
        from: 'model_training',
        to: 'model_registry',
        label: 'Trained Models'
      },
      {
        from: 'model_registry',
        to: 'model_serving',
        label: 'Model Versions'
      },
      {
        from: 'model_serving',
        to: 'inference_api',
        label: 'Inference'
      },
      {
        from: 'inference_api',
        to: 'frontend_ui',
        label: 'Responses'
      },
      {
        from: 'frontend_ui',
        to: 'inference_api',
        label: 'Requests'
      },
      {
        from: 'model_serving',
        to: 'monitoring_logging',
        label: 'Metrics & Logs'
      },
      {
        from: 'inference_api',
        to: 'monitoring_logging',
        label: 'API Metrics'
      },
      {
        from: 'frontend_ui',
        to: 'feedback_loop',
        label: 'User Feedback'
      },
      {
        from: 'monitoring_logging',
        to: 'feedback_loop',
        label: 'Performance Data'
      },
      {
        from: 'feedback_loop',
        to: 'data_processing',
        label: 'New Data'
      }
    ]
  },

  // Tech stack details
  techStack: {
    dataIngestion: {
      'Apache NiFi': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Data ingestion and ETL tool.',
        category: 'Data Ingestion',
        priority: 1
      },
      'AWS Glue': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Fully managed ETL (extract, transform, and load) service.',
        category: 'Data Ingestion',
        priority: 2
      },
      'Fivetran': {
        icon: 'https://cdn.simpleicons.org/fivetran',
        description: 'Automated data integration.',
        category: 'Data Ingestion',
        priority: 3
      }
    },
    dataProcessing: {
      'Apache Spark': {
        icon: 'https://cdn.simpleicons.org/apachespark',
        description: 'Unified analytics engine for large-scale data processing.',
        category: 'Data Processing',
        priority: 1
      },
      'Pandas': {
        icon: 'https://cdn.simpleicons.org/pandas',
        description: 'Data manipulation and analysis.',
        category: 'Data Processing',
        priority: 2
      },
      'Dask': {
        icon: 'https://cdn.simpleicons.org/dask',
        description: 'Parallel computing library for analytics.',
        category: 'Data Processing',
        priority: 3
      },
      'Feast': {
        icon: 'https://cdn.simpleicons.org/feast',
        description: 'Feature store for ML.',
        category: 'Feature Store',
        priority: 1
      }
    },
    modelTraining: {
      'TensorFlow': {
        icon: 'https://cdn.simpleicons.org/tensorflow',
        description: 'Open-source machine learning framework.',
        category: 'Model Training',
        priority: 1
      },
      'PyTorch': {
        icon: 'https://cdn.simpleicons.org/pytorch',
        description: 'Deep learning framework.',
        category: 'Model Training',
        priority: 2
      },
      'Scikit-learn': {
        icon: 'https://cdn.simpleicons.org/scikitlearn',
        description: 'Machine learning library.',
        category: 'Model Training',
        priority: 3
      },
      'XGBoost': {
        icon: 'https://cdn.simpleicons.org/xgboost',
        description: 'Gradient boosting framework.',
        category: 'Model Training',
        priority: 4
      },
      'AutoML': {
        icon: 'https://cdn.simpleicons.org/google',
        description: 'Automated machine learning.',
        category: 'Model Training',
        priority: 5
      },
      'HuggingFace': {
        icon: 'https://huggingface.co/front/assets/huggingface_logo.svg',
        description: 'Platform for building, training and deploying state of the art machine learning models.',
        category: 'Model Training',
        priority: 6,
        features: [
          'Pre-trained models for NLP and computer vision',
          'Model Hub with thousands of pre-trained models',
          'Datasets for training and fine-tuning',
          'Easy model deployment and sharing',
          'Active community and collaboration'
        ],
        businessValue: [
          'Accelerate AI development with pre-trained models',
          'Reduce training costs and time to market',
          'Access to state-of-the-art AI models',
          'Simplified model deployment and scaling',
          'Community-driven innovation and support'
        ],
        capabilities: [
          'Natural Language Processing',
          'Computer Vision',
          'Speech Recognition',
          'Transfer Learning',
          'Model Fine-tuning',
          'Model Deployment'
        ]
      }
    },
    modelDeployment: {
      'TensorFlow Serving': {
        icon: 'https://cdn.simpleicons.org/tensorflow',
        description: 'Flexible, high-performance serving system for ML models.',
        category: 'Model Serving',
        priority: 1
      },
      'TorchServe': {
        icon: 'https://cdn.simpleicons.org/pytorch',
        description: 'Serve PyTorch models in production.',
        category: 'Model Serving',
        priority: 2
      },
      'KFServing (KServe)': {
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Serverless inference on Kubernetes.',
        category: 'Model Serving',
        priority: 3
      },
      'Seldon Core': {
        icon: 'https://cdn.simpleicons.org/seldon',
        description: 'Open-source platform for deploying ML models on Kubernetes.',
        category: 'Model Serving',
        priority: 4
      }
    },
    mlOps: {
      'MLflow': {
        icon: 'https://cdn.simpleicons.org/mlflow',
        description: 'Open-source platform for managing the ML lifecycle.',
        category: 'MLOps',
        priority: 1
      },
      'Kubeflow': {
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Machine Learning toolkit for Kubernetes.',
        category: 'MLOps',
        priority: 2
      },
      'DVC': {
        icon: 'https://cdn.simpleicons.org/dvc',
        description: 'Data version control system.',
        category: 'MLOps',
        priority: 3
      },
      'Airflow': {
        icon: 'https://cdn.simpleicons.org/apacheairflow',
        description: 'Platform to programmatically author, schedule, and monitor workflows.',
        category: 'MLOps',
        priority: 4
      }
    },
    modelRegistry: {
      'MLflow Model Registry': {
        icon: 'https://cdn.simpleicons.org/mlflow',
        description: 'Centralized model store.',
        category: 'Model Registry',
        priority: 1
      },
      'DVC': {
        icon: 'https://cdn.simpleicons.org/dvc',
        description: 'Data and model versioning.',
        category: 'Model Registry',
        priority: 2
      },
      'AWS SageMaker Model Registry': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Managed model registry in AWS.',
        category: 'Model Registry',
        priority: 3
      }
    },
    frontend: {
      'React': {
        icon: 'https://cdn.simpleicons.org/react',
        description: 'JavaScript library for building user interfaces.',
        category: 'Frontend',
        priority: 1
      },
      'Angular': {
        icon: 'https://cdn.simpleicons.org/angular',
        description: 'TypeScript-based web application framework.',
        category: 'Frontend',
        priority: 2
      },
      'Vue.js': {
        icon: 'https://cdn.simpleicons.org/vuejs',
        description: 'Progressive JavaScript framework.',
        category: 'Frontend',
        priority: 3
      },
      'Flutter': {
        icon: 'https://cdn.simpleicons.org/flutter',
        description: 'UI toolkit for building natively compiled applications.',
        category: 'Mobile Apps',
        priority: 1
      },
      'Dash': {
        icon: 'https://cdn.simpleicons.org/plotly',
        description: 'Analytical web applications without Javascript.',
        category: 'Dashboards',
        priority: 1
      },
      'Streamlit': {
        icon: 'https://cdn.simpleicons.org/streamlit',
        description: 'Framework for creating data apps in Python.',
        category: 'Dashboards',
        priority: 2
      }
    },
    backend: {
      'FastAPI': {
        icon: 'https://cdn.simpleicons.org/fastapi',
        description: 'High performance, easy to learn, fast to code, ready for production.',
        category: 'Backend/API',
        priority: 1
      },
      'Flask': {
        icon: 'https://cdn.simpleicons.org/flask',
        description: 'Micro web framework written in Python.',
        category: 'Backend/API',
        priority: 2
      },
      'Express.js': {
        icon: 'https://cdn.simpleicons.org/express',
        description: 'Web application framework for Node.js.',
        category: 'Backend/API',
        priority: 3
      },
      'GraphQL': {
        icon: 'https://cdn.simpleicons.org/graphql',
        description: 'Query language for your API.',
        category: 'Backend/API',
        priority: 4
      }
    },
    databases: {
      'PostgreSQL': {
        icon: 'https://cdn.simpleicons.org/postgresql',
        description: 'Open-source relational database.',
        category: 'Databases',
        priority: 1
      },
      'MongoDB': {
        icon: 'https://cdn.simpleicons.org/mongodb',
        description: 'NoSQL document-oriented database.',
        category: 'Databases',
        priority: 2
      },
      'Redis': {
        icon: 'https://cdn.simpleicons.org/redis',
        description: 'In-memory data structure store.',
        category: 'Caching',
        priority: 1
      },
      'Elasticsearch': {
        icon: 'https://cdn.simpleicons.org/elasticsearch',
        description: 'Search engine based on Lucene library.',
        category: 'Search',
        priority: 1
      }
    },
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Monitoring system and time series database.',
        category: 'Monitoring',
        priority: 1
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics platform.',
        category: 'Monitoring',
        priority: 2
      },
      'ELK Stack': {
        icon: 'https://cdn.simpleicons.org/elastic',
        description: 'Logging and log analytics (Elasticsearch, Logstash, Kibana).',
        category: 'Logging',
        priority: 1
      },
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Monitoring service for cloud-scale applications.',
        category: 'APM',
        priority: 1
      },
      'Evidently AI': {
        icon: 'https://cdn.simpleicons.org/evidently',
        description: 'ML monitoring for data and model drift.',
        category: 'ML Monitoring',
        priority: 1
      }
    },
    infrastructure: {
      'Kubernetes': {
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Container orchestration system.',
        category: 'Infrastructure',
        priority: 1
      },
      'Docker': {
        icon: 'https://cdn.simpleicons.org/docker',
        description: 'Platform for developing, shipping, and running applications in containers.',
        category: 'Infrastructure',
        priority: 2
      },
      'AWS': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Amazon Web Services cloud platform.',
        category: 'Cloud',
        priority: 1
      },
      'Azure': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Microsoft Azure cloud platform.',
        category: 'Cloud',
        priority: 2
      },
      'Google Cloud Platform': {
        icon: 'https://cdn.simpleicons.org/googlecloud',
        description: 'Google Cloud Platform services.',
        category: 'Cloud',
        priority: 3
      }
    },
    security: {
      'HashiCorp Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Manage secrets and protect sensitive data.',
        category: 'Security',
        priority: 1
      },
      'CloudFlare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'Web infrastructure and website security.',
        category: 'Security',
        priority: 2
      },
      'OAuth2': {
        icon: 'https://cdn.simpleicons.org/oauth',
        description: 'Authorization framework.',
        category: 'Authentication',
        priority: 1
      },
      'JWT': {
        icon: 'https://cdn.simpleicons.org/jsonwebtokens',
        description: 'Transmit information securely between parties as a JSON object.',
        category: 'Authentication',
        priority: 2
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codesandbox',
        description: 'Environment for building and testing new features.',
        tools: ["Docker Compose", "Local Kubernetes Cluster", "Mock Services"]
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/heroku',
        description: 'Pre-production environment for testing end-to-end workflows.',
        tools: ["Continuous Integration", "Test Data Sets", "QA Automation"]
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live environment serving end-users.',
        tools: ["AWS", "Azure", "GCP", "Kubernetes", "Load Balancers"]
      },
      {
        name: 'Disaster Recovery',
        icon: 'https://cdn.simpleicons.org/evergreen',
        description: 'Backup environment for high availability and failover.',
        tools: ["Multi-region Deployment", "Data Replication", "Backup Strategies"]
      }
    ],
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Monitoring system and alerting toolkit.'
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics platform.'
      },
      'ELK Stack': {
        icon: 'https://cdn.simpleicons.org/elastic',
        description: 'Collection of three open-source products: Elasticsearch, Logstash, and Kibana.'
      },
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Monitoring and security platform for cloud applications.'
      },
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application performance monitoring and management.'
      }
    },
    security: {
      'HashiCorp Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Secure, store, and tightly control access to tokens, passwords, certificates, API keys.'
      },
      'CloudFlare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'Provides CDN, DNS, DDoS protection, and security.'
      },
      'SSL/TLS Encryption': {
        icon: 'https://cdn.simpleicons.org/letsencrypt',
        description: 'Encrypt data in transit.'
      },
      'AWS IAM': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Manage access to AWS services and resources securely.'
      },
      'Azure Active Directory': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Identity and access management service.'
      },
      'Compliance Tools': {
        icon: 'https://cdn.simpleicons.org/gdpr',
        description: 'Tools to ensure compliance with GDPR, HIPAA, etc.'
      }
    },
    ciCd: {
      'Jenkins': {
        icon: 'https://cdn.simpleicons.org/jenkins',
        description: 'Open-source automation server.',
        category: 'CI/CD',
        priority: 1
      },
      'GitHub Actions': {
        icon: 'https://cdn.simpleicons.org/githubactions',
        description: 'Automate, customize, and execute software development workflows from GitHub.',
        category: 'CI/CD',
        priority: 2
      },
      'Azure DevOps': {
        icon: 'https://cdn.simpleicons.org/azuredevops',
        description: 'Services for teams to share code, track work, and ship software.',
        category: 'CI/CD',
        priority: 3
      },
      'GitLab CI/CD': {
        icon: 'https://cdn.simpleicons.org/gitlab',
        description: 'Integrated continuous integration and continuous delivery.',
        category: 'CI/CD',
        priority: 4
      }
    }
  }
};