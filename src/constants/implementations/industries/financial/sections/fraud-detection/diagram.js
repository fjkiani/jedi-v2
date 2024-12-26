export const fraudDetectionDiagram = {
  useCase: {
    title: "Fraud Detection System",
    description: "Real-time fraud detection and prevention",
    businessValue: [
      "Detect fraud in real-time",
      "Reduce false positives",
      "Process high transaction volumes",
      "Minimize financial losses"
    ],
    capabilities: [
      "Real-time transaction monitoring",
      "ML-based risk scoring",
      "Rule-based decision making",
      "Automated alert generation"
    ]
  },
  nodes: [
    {
      id: 'transaction-ingestion',
      label: 'Transaction Ingestion',
      x: 100,
      y: 100,
      description: 'Real-time transaction processing',
      technologies: {
        main: {
          "Kafka": "Event streaming",
          "Redis": "Caching layer",
          "gRPC": "High-performance APIs",
          "Protobuf": "Data serialization"
        },
        processing: {
          "Spring Boot": "Application framework",
          "Node.js": "API layer",
          "RabbitMQ": "Message queuing"
        }
      }
    },
    {
      id: 'ml-engine',
      label: 'ML Engine',
      x: 400,
      y: 100,
      description: 'Machine learning inference engine',
      technologies: {
        main: {
          "TensorFlow": "ML framework",
          "PyTorch": "Deep learning",
          "scikit-learn": "ML algorithms",
          "ONNX": "Model interoperability"
        }
      }
    },
    {
      id: 'rules-engine',
      label: 'Rules Engine',
      x: 700,
      y: 100,
      description: 'Business rules processing',
      technologies: {
        main: {
          "Drools": "Rules engine",
          "Decision Tables": "Business logic",
          "Easy Rules": "Rule processing"
        }
      }
    }
  ],
  connections: [
    {
      from: 'transaction-ingestion',
      to: 'ml-engine',
      label: 'Transaction Data',
      type: 'primary'
    },
    {
      from: 'ml-engine',
      to: 'rules-engine',
      label: 'Risk Scores',
      type: 'primary'
    }
  ],
  deployment: {
    environments: [
      "Development",
      "Staging",
      "Production"
    ],
    infrastructure: [
      "Kubernetes",
      "AWS",
      "Terraform"
    ],
    monitoring: [
      "Prometheus",
      "Grafana",
      "ELK Stack"
    ]
  }
}; 