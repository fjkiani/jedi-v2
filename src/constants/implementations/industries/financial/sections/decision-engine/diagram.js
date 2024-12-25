import { createDiagram } from '@/constants/implementations/base/diagram-template';

export const decisionEngineDiagram = createDiagram({
  title: "Decision Engine",
  description: "Enterprise-grade decision automation system with real-time rule processing and compliance monitoring",
  nodes: [
    {
      id: 'rule-ingestion',
      label: 'Rule Ingestion',
      x: 100,
      y: 100,
      description: 'Business rule management and versioning',
      technologies: {
        main: {
          "DMN": "Decision Model Notation",
          "BPMN": "Business Process Modeling",
          "YAML": "Rule configuration",
          "JSON Schema": "Rule validation"
        },
        processing: {
          "Apache Camel": "Rule routing & integration",
          "Spring Rules": "Rule validation & parsing",
          "Git": "Version control",
          "Jenkins": "Rule deployment"
        },
        storage: {
          "PostgreSQL": "Rule metadata",
          "Redis": "Rule cache"
        }
      },
      metrics: {
        "rule updates": "100/day",
        "validation time": "<500ms",
        "deployment time": "<5min",
        "version history": "90 days"
      },
      features: [
        "Rule versioning & rollback",
        "Syntax validation",
        "Impact analysis",
        "Deployment scheduling"
      ]
    },
    {
      id: 'rules-engine',
      label: 'Rules Engine',
      x: 500,
      y: 100,
      description: 'High-performance decision execution engine',
      technologies: {
        main: {
          "Drools": "Core rules engine",
          "Easy Rules": "Simple rule processing",
          "Decision Tables": "Business rules",
          "OpenL Tablets": "Excel-based rules"
        },
        processing: {
          "Java": "Core engine implementation",
          "Kotlin": "Rule DSL & extensions",
          "Groovy": "Dynamic rule scripting",
          "MVEL": "Expression language"
        },
        optimization: {
          "JMH": "Performance benchmarking",
          "GraalVM": "Native compilation",
          "JProfiler": "Performance profiling"
        }
      },
      metrics: {
        "throughput": "10k decisions/sec",
        "latency p95": "<50ms",
        "latency p99": "<100ms",
        "rule compilation": "<2s"
      },
      features: [
        "Complex event processing",
        "Forward/backward chaining",
        "Decision trees & tables",
        "Rule versioning & hot reload",
        "Statistical tracking",
        "Circuit breaking"
      ]
    },
    {
      id: 'decision-api',
      label: 'Decision API',
      x: 900,
      y: 100,
      description: 'Multi-protocol decision service interface',
      technologies: {
        main: {
          "gRPC": "High-performance API",
          "REST": "HTTP interface",
          "GraphQL": "Flexible queries",
          "WebSocket": "Real-time updates"
        },
        caching: {
          "Redis": "Decision caching",
          "Hazelcast": "Distributed cache",
          "Caffeine": "Local cache"
        },
        security: {
          "OAuth2": "Authentication",
          "OPA": "Authorization",
          "mTLS": "Service security"
        }
      },
      metrics: {
        "throughput": "5k req/sec",
        "latency": "<50ms",
        "cache hit rate": "85%",
        "error rate": "<0.1%"
      },
      features: [
        "Rate limiting",
        "Circuit breaking",
        "Request validation",
        "Response transformation",
        "Batch processing"
      ]
    },
    {
      id: 'decision-store',
      label: 'Decision Store',
      x: 100,
      y: 400,
      description: 'Scalable decision history storage',
      technologies: {
        storage: {
          "PostgreSQL": "Transactional data",
          "MongoDB": "Decision logs",
          "S3": "Long-term storage",
          "ClickHouse": "Analytics"
        },
        processing: {
          "Apache Kafka": "Event streaming",
          "Debezium": "CDC pipeline",
          "Apache Spark": "Data processing",
          "dbt": "Data transformation"
        },
        backup: {
          "WAL-E": "Point-in-time recovery",
          "pgBackRest": "Backup management"
        }
      },
      metrics: {
        "storage size": "5TB",
        "retention": "7 years",
        "write throughput": "1k/sec",
        "query latency": "<100ms"
      }
    },
    {
      id: 'audit-system',
      label: 'Audit System',
      x: 500,
      y: 400,
      description: 'Comprehensive compliance and auditing',
      technologies: {
        main: {
          "Elasticsearch": "Audit log storage",
          "Kibana": "Log analysis & visualization",
          "OpenSearch": "Log search & analytics",
          "Logstash": "Log processing"
        },
        compliance: {
          "AWS CloudTrail": "API auditing",
          "Vault": "Secrets auditing",
          "OPA": "Policy auditing"
        }
      },
      features: [
        "Full audit trail",
        "Compliance reporting",
        "Decision replay",
        "Access logging",
        "Change tracking",
        "Data lineage"
      ],
      metrics: {
        "log retention": "7 years",
        "search latency": "<2s",
        "indexing delay": "<5s"
      }
    },
    {
      id: 'monitoring',
      label: 'Decision Monitoring',
      x: 900,
      y: 400,
      description: 'Real-time performance and business monitoring',
      technologies: {
        main: {
          "Prometheus": "Metrics collection",
          "Grafana": "Visualization",
          "AlertManager": "Alert management",
          "VictoriaMetrics": "Time series DB"
        },
        tracing: {
          "Jaeger": "Distributed tracing",
          "OpenTelemetry": "Observability",
          "Zipkin": "Trace analysis"
        }
      },
      metrics: {
        "metric count": "1000+",
        "retention": "90 days",
        "scrape interval": "15s",
        "alert latency": "<1min"
      },
      features: [
        "SLO monitoring",
        "Business metrics",
        "Anomaly detection",
        "Capacity planning",
        "Performance analytics"
      ]
    }
  ],
  connections: [
    {
      from: 'rule-ingestion',
      to: 'rules-engine',
      label: 'Business Rules',
      type: 'primary',
      protocol: 'Internal'
    },
    {
      from: 'rules-engine',
      to: 'decision-api',
      label: 'Decisions',
      type: 'primary',
      protocol: 'gRPC'
    },
    {
      from: 'rules-engine',
      to: 'decision-store',
      label: 'Persist',
      type: 'secondary',
      protocol: 'SQL/NoSQL'
    },
    {
      from: 'decision-store',
      to: 'audit-system',
      label: 'Audit Data',
      type: 'secondary',
      protocol: 'CDC'
    },
    {
      from: 'rules-engine',
      to: 'monitoring',
      label: 'Engine Metrics',
      type: 'monitoring',
      protocol: 'REST'
    },
    {
      from: 'decision-api',
      to: 'monitoring',
      label: 'API Metrics',
      type: 'monitoring',
      protocol: 'REST'
    }
  ],
  zones: [
    {
      id: 'processing-zone',
      label: 'Decision Processing Zone',
      nodes: ['rule-ingestion', 'rules-engine', 'decision-api'],
      security: 'Private Subnet',
      compliance: ['SOC2', 'GDPR']
    },
    {
      id: 'storage-zone',
      label: 'Storage Zone',
      nodes: ['decision-store', 'audit-system'],
      security: 'Private Subnet',
      compliance: ['PCI-DSS', 'SOX']
    },
    {
      id: 'monitoring-zone',
      label: 'Monitoring Zone',
      nodes: ['monitoring'],
      security: 'Private Subnet',
      compliance: ['SOC2']
    }
  ]
}); 