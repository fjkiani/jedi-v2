export const fraudDetectionDiagram = {
  nodes: [
    {
      id: 'kafka',
      label: 'Kafka Stream',
      description: 'High-throughput event streaming\n• Processes 1M+ transactions per second\n• Guarantees no data loss\n• Works across multiple data centers\n• Keeps transactions in order\n• Responds in under 1ms',
      x: 100,
      y: 100,
      type: "Stream",
      technologies: {
        core: ['Apache Kafka'],
        features: [
          'Real-time Events: Processes transactions as they happen',
          'Partition Sharding: Splits data across servers for speed',
        ]
      }
    },
    {
      id: 'fraud-service',
      label: 'Fraud Detection Engine',
      description: 'AI-powered fraud analysis\n• Uses multiple AI models together\n• Learns from new patterns\n• Adjusts risk levels automatically\n• Tests new detection methods safely\n• Tracks model versions',
      x: 500,
      y: 100,
      type: "Service",
      technologies: {
        core: ['Node.js', 'Python', 'TensorFlow'],
        features: [
          'AI that learns complex fraud patterns',
          ' Combines multiple fraud detection methods',
          ' Extracts important transaction patterns',
        ]
      }
    },
    {
      id: 'redis',
      label: 'Redis Cache',
      description: 'Ultra-fast pattern checking\n• Stores patterns in memory for speed\n• Uses smart filtering techniques\n• Tracks patterns over time\n• Prevents system overload\n• Handles server failures',
      x: 900,
      y: 100,
      type: "Storage",
      technologies: {
        core: ['Redis Enterprise'],
        features: [
          'Quickly checks if a pattern might be fraud',
          'Tracks suspicious activity over time',
          'Analyzes patterns across time periods',
          'Runs AI models directly in cache',
        ]
      }
    },
    {
      id: 'pinecone',
      label: 'Vector Database',
      description: 'Smart pattern matching\n• Finds similar fraud patterns\n• Groups similar behaviors\n• Spots unusual activities\n• Compares transaction similarities\n• Updates patterns instantly',
      x: 300,
      y: 400,
      type: "Storage",
      technologies: {
        core: ['VectorDB'],
        features: [
          ' Finds similar fraud patterns quickly',
          ' Organizes patterns for fast lookup',
          ' Measures how close patterns match',
          ' Combines different search methods',
        ]
      }
    },
    {
      id: 'alert',
      label: 'Alert System',
      description: 'Smart alert handling\n• Routes alerts by risk level\n• Groups related alerts together\n• Guides investigation steps\n• Automates basic responses\n• Tracks regulatory compliance',
      x: 700,
      y: 400,
      type: "Alert",
      technologies: {
        core: ['Node.js', 'RabbitMQ'],
        features: [
          'Handles high-risk alerts first',
          'Groups related suspicious activities',
          'Ensures timely alert handling',
          'Tracks all investigation steps',
        ]
      }
    }
  ],
  connections: [
    {
      from: 'kafka',
      to: 'fraud-service',
      label: 'Transaction Events'
    },
    {
      from: 'fraud-service',
      to: 'redis',
      label: 'Cache Results'
    },
    {
      from: 'fraud-service',
      to: 'pinecone',
      label: 'Pattern Matching'
    },
    {
      from: 'fraud-service',
      to: 'alert',
      label: 'High Risk Alerts'
    }
  ]
};
