export const dataEngineeringSolution = {
  // Basic information
  id: "2",
  title: "Data Engineering",
  shortTitle: "Data",
  slug: "data-engineering",
  description: "End-to-end data pipeline solutions for processing, storing, and analyzing large-scale data",
  imageUrl: "/images/solutions/data-engineering.jpg",
  icon: "database",
  categories: ["Data Processing", "ETL", "Analytics", "Big Data"],

  // Business value proposition
  businessValue: {
    metrics: [
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
    useCases: [
      "Sales Performance Analytics",
      "Customer Behavior Tracking",
      "Inventory Management",
      "Financial Reporting"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "Data Engineering Pipeline",
    description: "End-to-end data pipeline workflow from ingestion to insights",
    layout: {
      type: "workflow",
      spacing: { x: 300, y: 150 },
      startPosition: { x: 100, y: 80 }
    },
    nodes: [
      {
        id: 'collect',
        label: 'Collect data from multiple sources',
        x: 100,
        y: 80,
        description: 'Data ingestion from various sources'
      },
      {
        id: 'process',
        label: 'Process and transform raw data',
        x: 400,
        y: 80,
        description: 'ETL and data transformation'
      },
      {
        id: 'analyze',
        label: 'Analyze and generate insights',
        x: 700,
        y: 80,
        description: 'Data analysis and insights'
      },
      {
        id: 'store',
        label: 'Store in data warehouse',
        x: 100,
        y: 280,
        description: 'Data storage and management'
      },
      {
        id: 'validate',
        label: 'Validate data quality',
        x: 400,
        y: 280,
        description: 'Data quality checks'
      },
      {
        id: 'visualize',
        label: 'Create visualizations',
        x: 700,
        y: 280,
        description: 'Data visualization and reporting'
      }
    ],
    connections: [
      {
        from: 'collect',
        to: 'process',
        label: 'Raw Data'
      },
      {
        from: 'process',
        to: 'analyze',
        label: 'Processed Data'
      },
      {
        from: 'store',
        to: 'validate',
        label: 'Stored Data'
      },
      {
        from: 'validate',
        to: 'visualize',
        label: 'Validated Data'
      },
      {
        from: 'process',
        to: 'store',
        label: 'Transform'
      },
      {
        from: 'analyze',
        to: 'visualize',
        label: 'Insights'
      }
    ],
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
    }
  },

  // Tech stack details
  techStack: {
    ingestion: {
      'Apache NiFi': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Data ingestion and ETL tool.',
        category: 'Ingestion',
        priority: 1
      },
      'Fivetran': {
        icon: 'https://cdn.simpleicons.org/fivetran',
        description: 'Automated data integration.',
        category: 'Ingestion',
        priority: 2
      },
      'Kafka Connect': {
        icon: 'https://cdn.simpleicons.org/apachekafka',
        description: 'Streaming data pipelines with Kafka.',
        category: 'Ingestion',
        priority: 3
      },
      'Apache Sqoop': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Data transfer between Hadoop and relational databases.',
        category: 'Ingestion',
        priority: 4
      }
    },
    processing: {
      'Apache Spark': {
        icon: 'https://cdn.simpleicons.org/apachespark',
        description: 'Unified analytics engine for large-scale data.',
        category: 'Processing',
        priority: 1
      },
      'Apache Flink': {
        icon: 'https://cdn.simpleicons.org/apacheflink',
        description: 'Scalable stream processing framework.',
        category: 'Processing',
        priority: 2
      },
      'Apache Beam': {
        icon: 'https://cdn.simpleicons.org/apachebeam',
        description: 'Unified programming model for batch and streaming data processing.',
        category: 'Processing',
        priority: 3
      },
      'Google Dataflow': {
        icon: 'https://cdn.simpleicons.org/googlecloud',
        description: 'Managed service for executing Apache Beam pipelines.',
        category: 'Processing',
        priority: 4
      }
    },
    orchestration: {
      'Apache Airflow': {
        icon: 'https://cdn.simpleicons.org/apacheairflow',
        description: 'Platform to programmatically author, schedule, and monitor workflows.',
        category: 'Orchestration',
        priority: 1
      },
      'Prefect': {
        icon: 'https://cdn.simpleicons.org/prefect',
        description: 'Dataflow automation platform.',
        category: 'Orchestration',
        priority: 2
      },
      'Dagster': {
        icon: 'https://cdn.simpleicons.org/dagster',
        description: 'Data orchestrator for machine learning, analytics, and ETL.',
        category: 'Orchestration',
        priority: 3
      },
      'Luigi': {
        icon: 'https://cdn.simpleicons.org/spotify',
        description: 'Python module that helps build complex pipelines.',
        category: 'Orchestration',
        priority: 4
      }
    },
    storage: {
      'Amazon S3': {
        icon: 'https://cdn.simpleicons.org/amazons3',
        description: 'Scalable object storage.',
        category: 'Storage',
        priority: 1
      },
      'Azure Data Lake Storage': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Scalable storage for big data analytics.',
        category: 'Storage',
        priority: 2
      },
      'Google Cloud Storage': {
        icon: 'https://cdn.simpleicons.org/googlecloud',
        description: 'Unified object storage for developers and enterprises.',
        category: 'Storage',
        priority: 3
      },
      'Apache HBase': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Scalable, distributed big data store.',
        category: 'Storage',
        priority: 4
      }
    },
    warehousing: {
      'Snowflake': {
        icon: 'https://cdn.simpleicons.org/snowflake',
        description: 'Cloud data platform and data warehouse.',
        category: 'Data Warehousing',
        priority: 1
      },
      'Amazon Redshift': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Fast, simple, cost-effective data warehousing.',
        category: 'Data Warehousing',
        priority: 2
      },
      'Google BigQuery': {
        icon: 'https://cdn.simpleicons.org/googlecloud',
        description: 'Serverless, highly scalable data warehouse.',
        category: 'Data Warehousing',
        priority: 3
      },
      'Azure Synapse Analytics': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Limitless analytics service with data warehousing.',
        category: 'Data Warehousing',
        priority: 4
      }
    },
    transformation: {
      'dbt (Data Build Tool)': {
        icon: 'https://cdn.simpleicons.org/dbt',
        description: 'Data transformation tool that enables data analysts and engineers to transform data in their warehouses.',
        category: 'Transformation',
        priority: 1
      },
      'Apache Hive': {
        icon: 'https://cdn.simpleicons.org/apachehive',
        description: 'Data warehouse software that facilitates reading, writing, and managing large datasets.',
        category: 'Transformation',
        priority: 2
      },
      'AWS Glue': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Fully managed extract, transform, and load (ETL) service.',
        category: 'Transformation',
        priority: 3
      },
      'Talend': {
        icon: 'https://cdn.simpleicons.org/talend',
        description: 'Data integration and data integrity tools.',
        category: 'Transformation',
        priority: 4
      }
    },
    quality: {
      'Great Expectations': {
        icon: 'https://cdn.simpleicons.org/greatexpectations',
        description: 'Python-based tool for validating, documenting, and profiling data.',
        category: 'Quality',
        priority: 1
      },
      'Datafold': {
        icon: 'https://cdn.simpleicons.org/datafold',
        description: 'Data diffs and regression testing for data pipelines.',
        category: 'Quality',
        priority: 2
      },
      'Deequ': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Library for unit testing data with Spark.',
        category: 'Quality',
        priority: 3
      },
      'Soda SQL': {
        icon: 'https://cdn.simpleicons.org/soda',
        description: 'Checks data in databases to find invalid, missing, or unexpected data.',
        category: 'Quality',
        priority: 4
      }
    },
    visualization: {
      'Tableau': {
        icon: 'https://cdn.simpleicons.org/tableau',
        description: 'Visual analytics platform for business intelligence.',
        category: 'Visualization',
        priority: 1
      },
      'Power BI': {
        icon: 'https://cdn.simpleicons.org/powerbi',
        description: 'Business analytics service by Microsoft.',
        category: 'Visualization',
        priority: 2
      },
      'Looker': {
        icon: 'https://cdn.simpleicons.org/looker',
        description: 'Business intelligence and big data analytics platform.',
        category: 'Visualization',
        priority: 3
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Open-source platform for monitoring and observability.',
        category: 'Visualization',
        priority: 4
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codepen',
        description: 'Development and testing environment for developers.',
        tools: ["Docker Compose", "Minikube", "Local Stack"]
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/virtualbox',
        description: 'Pre-production environment mirroring production.',
        tools: ["Kubernetes", "Helm Charts", "Terraform"]
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live environment serving end-users.',
        tools: ["AWS", "Azure", "Google Cloud Platform", "Kubernetes"]
      },
      {
        name: 'Disaster Recovery',
        icon: 'https://cdn.simpleicons.org/evergreen',
        description: 'Backup environment for high availability.',
        tools: ["Multi-region Deployment", "Data Replication", "Failover Strategies"]
      },
      {
        name: 'Analytics',
        icon: 'https://cdn.simpleicons.org/googleanalytics',
        description: 'Environment dedicated to analytics and reporting.',
        tools: ["Data Warehouses", "BI Tools", "Data Lakes"]
      }
    ],
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'System monitoring and alerting toolkit.'
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics software.'
      },
      'ELK Stack': {
        icon: 'https://cdn.simpleicons.org/elasticsearch',
        description: 'Log management and analytics (Elasticsearch, Logstash, Kibana).'
      },
      'Splunk': {
        icon: 'https://cdn.simpleicons.org/splunk',
        description: 'Platform for operational intelligence.'
      },
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application performance monitoring.'
      }
    },
    security: {
      'HashiCorp Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Secrets management and data protection.'
      },
      'Apache Ranger': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Framework to enable, monitor, and manage comprehensive data security.'
      },
      'AWS IAM': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Access control and identity management.'
      },
      'Azure Active Directory': {
        icon: 'https://cdn.simpleicons.org/microsoftazure',
        description: 'Identity and access management service.'
      },
      'Encryption Tools': {
        icon: 'https://cdn.simpleicons.org/gnupg',
        description: 'Encrypt data at rest and in transit.'
      }
    },
    compliance: {
      'GDPR Compliance Tools': {
        icon: 'https://cdn.simpleicons.org/gdpr',
        description: 'Tools to ensure compliance with European data protection.'
      },
      'HIPAA Compliance Tools': {
        icon: 'https://cdn.simpleicons.org/hipaa',
        description: 'Tools to ensure compliance with healthcare data regulations.'
      },
      'Audit Logging': {
        icon: 'https://cdn.simpleicons.org/scrollreveal',
        description: 'Maintain logs for auditing and compliance.'
      },
      'Data Masking': {
        icon: 'https://cdn.simpleicons.org/datamask',
        description: 'Mask sensitive data in non-production environments.'
      }
    }
  }
};