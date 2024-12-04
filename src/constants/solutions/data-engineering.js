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
    description: "Modern data engineering architecture for processing and analyzing large-scale data",
    layout: {
      type: "horizontal",
      spacing: { x: 300, y: 170 },
      startPosition: { x: 100, y: 80 }
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
  },

  // Tech stack details
  techStack: {
    processing: {
      'Apache Spark': {
        icon: 'https://cdn.simpleicons.org/apachespark',
        description: 'Unified analytics engine for large-scale data',
        category: 'Processing',
        priority: 1
      },
      'Apache Kafka': {
        icon: 'https://cdn.simpleicons.org/apachekafka',
        description: 'Distributed event streaming platform',
        category: 'Processing',
        priority: 2
      },
      'Apache Beam': {
        icon: 'https://cdn.simpleicons.org/apachebeam',
        description: 'Unified programming model for batch/streaming',
        category: 'Processing',
        priority: 3
      }
    },
    orchestration: {
      'Apache Airflow': {
        icon: 'https://cdn.simpleicons.org/apacheairflow',
        description: 'Platform to programmatically schedule workflows',
        category: 'Orchestration',
        priority: 1
      },
      'Dagster': {
        icon: 'https://cdn.simpleicons.org/dagster',
        description: 'Data orchestrator for ML, analytics, and ETL',
        category: 'Orchestration',
        priority: 2
      },
      'Prefect': {
        icon: 'https://cdn.simpleicons.org/prefect',
        description: 'Modern workflow orchestration',
        category: 'Orchestration',
        priority: 3
      }
    },
    storage: {
      'Snowflake': {
        icon: 'https://cdn.simpleicons.org/snowflake',
        description: 'Cloud data platform',
        category: 'Storage',
        priority: 1
      },
      'Apache Iceberg': {
        icon: 'https://cdn.simpleicons.org/apacheiceberg',
        description: 'Open table format for huge analytic datasets',
        category: 'Storage',
        priority: 2
      },
      'Delta Lake': {
        icon: 'https://cdn.simpleicons.org/deltalake',
        description: 'Open-source storage layer',
        category: 'Storage',
        priority: 3
      }
    },
    transformation: {
      'dbt': {
        icon: 'https://cdn.simpleicons.org/dbt',
        description: 'Data transformation tool',
        category: 'Transformation',
        priority: 1
      },
      'Apache Hive': {
        icon: 'https://cdn.simpleicons.org/apachehive',
        description: 'Data warehouse software',
        category: 'Transformation',
        priority: 2
      },
      'Pandas': {
        icon: 'https://cdn.simpleicons.org/pandas',
        description: 'Data manipulation and analysis tool',
        category: 'Transformation',
        priority: 3
      }
    },
    quality: {
      'Great Expectations': {
        icon: 'https://cdn.simpleicons.org/greatexpectations',
        description: 'Data quality validation',
        category: 'Quality',
        priority: 1
      },
      'Apache Griffin': {
        icon: 'https://cdn.simpleicons.org/apache',
        description: 'Big data quality solution',
        category: 'Quality',
        priority: 2
      },
      'Soda': {
        icon: 'https://cdn.simpleicons.org/soda',
        description: 'Data quality monitoring',
        category: 'Quality',
        priority: 3
      }
    },
    visualization: {
      'Apache Superset': {
        icon: 'https://cdn.simpleicons.org/apachesuperset',
        description: 'Modern data exploration and visualization',
        category: 'Visualization',
        priority: 1
      },
      'Metabase': {
        icon: 'https://cdn.simpleicons.org/metabase',
        description: 'Open-source business intelligence tool',
        category: 'Visualization',
        priority: 2
      },
      'Looker': {
        icon: 'https://cdn.simpleicons.org/looker',
        description: 'Business intelligence and analytics',
        category: 'Visualization',
        priority: 3
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codepen',
        description: 'Development and testing environment'
      },
      {
        name: 'QA',
        icon: 'https://cdn.simpleicons.org/testinglibrary',
        description: 'Quality assurance environment'
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Production environment'
      },
      {
        name: 'Analytics',
        icon: 'https://cdn.simpleicons.org/googleanalytics',
        description: 'Analytics and reporting environment'
      }
    ],
    monitoring: {
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Infrastructure monitoring'
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Metrics visualization'
      },
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Metrics collection'
      }
    },
    security: {
      'Ranger': {
        icon: 'https://cdn.simpleicons.org/apacheranger',
        description: 'Data security and governance'
      },
      'Vault': {
        icon: 'https://cdn.simpleicons.org/vault',
        description: 'Secrets management'
      }
    }
  }
};


