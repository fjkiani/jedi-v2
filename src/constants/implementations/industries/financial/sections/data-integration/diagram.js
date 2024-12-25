export const dataIntegrationDiagram = {
  useCase: {
    title: "Data Collection & Integration for Fraud Detection",
    description: "Real-time transaction monitoring system that collects, processes, and enriches data from multiple sources to detect fraudulent activities.",
    businessValue: [
      "Detect fraud in real-time with <100ms latency",
      "Reduce false positives by 60% through data enrichment",
      "Process over 10,000 transactions per second",
      "360° view of customer behavior patterns"
    ],
    capabilities: [
      "Multi-source data integration",
      "Real-time stream processing",
      "Historical data analysis",
      "Automated data enrichment",
      "Data quality monitoring",
      "Scalable data pipeline"
    ],
    examples: [
      "Credit card transaction monitoring",
      "Account access pattern analysis",
      "Cross-channel fraud detection",
      "Device fingerprinting integration"
    ]
  },
  nodes: [
    {
      id: 'transaction-sources',
      label: 'Transaction Sources',
      x: 100,
      y: 100,
      description: 'Multiple data input sources',
      technologies: {
        channels: {
          "POS Systems": "Point of sale transactions",
          "Mobile Apps": "Mobile payment data",
          "Web Portals": "Online banking transactions",
          "ATM Network": "ATM transaction data"
        }
      }
    },
    {
      id: 'stream-processing',
      label: 'Stream Processing',
      x: 400,
      y: 100,
      description: 'Real-time data processing',
      technologies: {
        streaming: {
          "Apache Kafka": "Message broker",
          "Apache Flink": "Stream processing",
          "Redis Streams": "In-memory streaming"
        }
      }
    },
    {
      id: 'data-enrichment',
      label: 'Data Enrichment',
      x: 700,
      y: 100,
      description: 'Enrich transaction data',
      technologies: {
        enrichment: {
          "Redis Cache": "Fast lookup cache",
          "Elasticsearch": "Device fingerprint data",
          "Neo4j": "Relationship graphs"
        }
      }
    },
    {
      id: 'historical-data',
      label: 'Historical Data',
      x: 100,
      y: 300,
      description: 'Historical transaction storage',
      technologies: {
        storage: {
          "PostgreSQL": "Transactional data",
          "MongoDB": "User profiles",
          "Snowflake": "Data warehouse"
        }
      }
    },
    {
      id: 'data-quality',
      label: 'Data Quality',
      x: 400,
      y: 300,
      description: 'Data validation and monitoring',
      technologies: {
        quality: {
          "Great Expectations": "Data validation",
          "Apache Griffin": "Data quality",
          "dbt": "Data transformation"
        }
      }
    },
    {
      id: 'data-api',
      label: 'Data API Layer',
      x: 700,
      y: 300,
      description: 'Unified data access',
      technologies: {
        api: {
          "GraphQL": "API gateway",
          "gRPC": "Internal services",
          "REST": "External APIs"
        }
      }
    }
  ],
  connections: [
    {
      from: 'transaction-sources',
      to: 'stream-processing',
      label: 'Raw Events'
    },
    {
      from: 'stream-processing',
      to: 'data-enrichment',
      label: 'Processed Data'
    },
    {
      from: 'data-enrichment',
      to: 'data-api',
      label: 'Enriched Data'
    },
    {
      from: 'historical-data',
      to: 'data-enrichment',
      label: 'Historical Context'
    },
    {
      from: 'stream-processing',
      to: 'historical-data',
      label: 'Persist Data'
    },
    {
      from: 'stream-processing',
      to: 'data-quality',
      label: 'Validate'
    },
    {
      from: 'data-quality',
      to: 'data-api',
      label: 'Quality Metrics'
    }
  ],
  deployment: {
    environments: [
      "Development",
      "Staging",
      "Production",
      "DR Site"
    ],
    infrastructure: [
      "AWS Financial Services",
      "Kubernetes Clusters",
      "Service Mesh",
      "Auto-scaling Groups"
    ],
    monitoring: [
      "Data Pipeline SLAs",
      "Stream Processing Latency",
      "Data Quality Metrics",
      "System Health Metrics"
    ]
  }
}; 