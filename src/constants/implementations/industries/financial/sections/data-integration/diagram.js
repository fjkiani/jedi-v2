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
      description: 'Multi-channel data ingestion',
      technologies: {
        channels: {
          "POS Systems": "Real-time transaction processing",
          "Mobile Apps": "Mobile payment & biometric data",
          "Web Portals": "Online banking & e-commerce",
          "ATM Network": "ATM transactions & location data",
          "APIs": "Third-party integrations"
        },
        protocols: {
          "REST": "External APIs",
          "WebSocket": "Real-time updates",
          "MQTT": "IoT device data",
          "gRPC": "High-performance streaming"
        }
      },
      metrics: {
        throughput: "100k events/sec",
        latency: "<10ms",
        reliability: "99.999%"
      }
    },
    {
      id: 'stream-processing',
      label: 'Stream Processing',
      x: 600,
      y: 100,
      description: 'Real-time event processing pipeline',
      technologies: {
        streaming: {
          "Apache Kafka": "Event backbone",
          "Apache Flink": "Stream processing",
          "Redis Streams": "In-memory processing",
          "Apache Storm": "Complex event processing"
        },
        processing: {
          "Kafka Streams": "Stream processing",
          "KSQL": "Stream analytics",
          "Apache Spark": "Batch processing"
        }
      },
      features: [
        "Event time processing",
        "Windowing operations",
        "State management",
        "Exactly-once semantics"
      ]
    },
    {
      id: 'data-enrichment',
      label: 'Data Enrichment',
      x: 1100,
      y: 100,
      description: 'Enrich and contextualize data',
      technologies: {
        enrichment: {
          "Redis Cache": "Fast lookup cache",
          "Elasticsearch": "Device fingerprint data",
          "Neo4j": "Relationship graphs",
          "MongoDB": "User profile store"
        },
        processing: {
          "Python": "Data transformation",
          "Pandas": "Data manipulation",
          "NumPy": "Numerical processing"
        }
      },
      features: [
        "Real-time enrichment",
        "Profile aggregation",
        "Entity resolution",
        "Feature computation"
      ]
    },
    {
      id: 'historical-data',
      label: 'Historical Data',
      x: 100,
      y: 500,
      description: 'Multi-tier data storage',
      technologies: {
        storage: {
          "PostgreSQL": "Transactional data",
          "MongoDB": "User profiles",
          "Snowflake": "Data warehouse",
          "S3": "Data lake"
        },
        processing: {
          "Apache Spark": "Batch processing",
          "dbt": "Data transformation",
          "Airflow": "Workflow orchestration"
        }
      },
      metrics: {
        storage: "10+ PB",
        retention: "7 years",
        queryLatency: "<100ms"
      }
    },
    {
      id: 'data-quality',
      label: 'Data Quality',
      x: 600,
      y: 500,
      description: 'Data validation and monitoring',
      technologies: {
        quality: {
          "Great Expectations": "Data validation",
          "Apache Griffin": "Data quality",
          "dbt": "Data transformation",
          "Monte Carlo": "Data observability"
        },
        monitoring: {
          "Prometheus": "Metrics collection",
          "Grafana": "Visualization",
          "Datadog": "APM"
        }
      },
      features: [
        "Schema validation",
        "Data lineage",
        "Quality metrics",
        "Anomaly detection"
      ]
    },
    {
      id: 'data-api',
      label: 'Data API Layer',
      x: 1100,
      y: 500,
      description: 'Unified data access layer',
      technologies: {
        api: {
          "GraphQL": "API gateway",
          "gRPC": "Internal services",
          "REST": "External APIs",
          "Kafka": "Event streaming"
        },
        security: {
          "OAuth2": "Authentication",
          "JWT": "Authorization",
          "API Gateway": "Rate limiting"
        }
      },
      metrics: {
        throughput: "50k req/sec",
        latency: "p99 < 100ms",
        availability: "99.99%"
      }
    }
  ],
  connections: [
    {
      from: 'transaction-sources',
      to: 'stream-processing',
      label: 'Raw Events',
      type: 'primary',
      protocol: 'Kafka',
      dataFlow: {
        type: 'Event Stream',
        format: 'Avro',
        volume: '100k/sec'
      }
    },
    {
      from: 'stream-processing',
      to: 'data-enrichment',
      label: 'Processed Data',
      type: 'primary',
      protocol: 'gRPC',
      dataFlow: {
        type: 'Enriched Stream',
        format: 'Protobuf',
        latency: '<50ms'
      }
    },
    {
      from: 'data-enrichment',
      to: 'data-api',
      label: 'Enriched Data',
      type: 'primary',
      protocol: 'GraphQL',
      dataFlow: {
        type: 'API Requests',
        format: 'JSON',
        latency: '<100ms'
      }
    },
    {
      from: 'historical-data',
      to: 'data-enrichment',
      label: 'Historical Context',
      type: 'secondary',
      protocol: 'SQL/NoSQL',
      style: 'dashed'
    },
    {
      from: 'stream-processing',
      to: 'historical-data',
      label: 'Persist Data',
      type: 'secondary',
      protocol: 'Batch/Stream',
      style: 'dashed'
    },
    {
      from: 'stream-processing',
      to: 'data-quality',
      label: 'Validate',
      type: 'monitoring',
      protocol: 'HTTP',
      style: 'dotted'
    },
    {
      from: 'data-quality',
      to: 'data-api',
      label: 'Quality Metrics',
      type: 'monitoring',
      protocol: 'REST',
      style: 'dotted'
    }
  ],
  zones: [
    {
      id: 'ingestion-zone',
      label: 'Data Ingestion Zone',
      nodes: ['transaction-sources', 'stream-processing'],
      security: 'DMZ',
      compliance: ['PCI-DSS', 'SOC2']
    },
    {
      id: 'processing-zone',
      label: 'Processing Zone',
      nodes: ['data-enrichment', 'data-quality'],
      security: 'Private Subnet',
      compliance: ['HIPAA', 'GDPR']
    },
    {
      id: 'storage-zone',
      label: 'Storage Zone',
      nodes: ['historical-data', 'data-api'],
      security: 'Private Subnet',
      compliance: ['PCI-DSS', 'SOX']
    }
  ],
  deployment: {
    environments: [
      {
        name: "Production",
        regions: ["us-east-1", "us-west-2"],
        scaling: {
          min: 10,
          max: 50,
          targetCPU: 70
        }
      },
      {
        name: "DR",
        regions: ["eu-west-1"],
        scaling: {
          min: 5,
          max: 25,
          targetCPU: 70
        }
      }
    ],
    infrastructure: {
      compute: ["EKS", "EC2 Auto Scaling"],
      storage: ["S3", "EBS", "ElastiCache"],
      networking: ["VPC", "CloudFront", "Route53"],
      security: ["WAF", "Shield", "KMS"]
    },
    monitoring: {
      metrics: ["CloudWatch", "Prometheus"],
      logging: ["ELK Stack", "CloudWatch Logs"],
      tracing: ["X-Ray", "Jaeger"],
      alerting: ["PagerDuty", "SNS"]
    }
  }
}; 