export const financialOverview = {
  'fraud-detection': {
    title: 'How Fraud Detection Works',
    description: 'Modern fraud detection combines real-time transaction monitoring with AI-powered pattern recognition to identify and prevent fraudulent activities before they cause financial losses.',
    workflow: {
      title: 'How It Works',
      description: 'The fraud detection pipeline consists of several critical steps:',
      steps: [
        {
          title: 'Data Collection & Integration',
          type: 'data-integration',
          description: 'Real-time transaction monitoring and data enrichment',
          details: [
            'Real-time transaction streams',
            'Historical transaction data',
            'User behavior patterns',
            'Device and location data'
          ],
          icon: 'database',
          technologies: {
            core: ['Apache Kafka', 'Redis Cache'],
            features: [
              'Real-time data processing',
              'Multi-source data integration',
              'High-throughput ingestion'
            ]
          }
        },
        {
          title: 'AI Analysis Engine',
          type: 'ai-analysis',
          description: 'Advanced pattern recognition and risk assessment',
          details: [
            'Machine learning model inference',
            'Pattern matching algorithms',
            'Risk scoring system',
            'Anomaly detection'
          ],
          icon: 'cpu',
          technologies: {
            core: ['TensorFlow', 'PyTorch', 'scikit-learn'],
            features: [
              'Real-time inference',
              'Pattern recognition',
              'Anomaly detection',
              'Risk scoring'
            ]
          }
        },
        {


            type: 'decision-engine',
          description: 'Automated decision making and alert generation',
          details: [
            'Risk-based decisioning',
            'Alert management',
            'Action orchestration',
            'Compliance tracking'
          ],
          icon: 'shield',
          technologies: {
            core: ['Rules Engine', 'Alert System'],
            features: [
              'Automated decisions',
              'Real-time alerts',
              'Compliance monitoring',
              'Audit logging'
            ]
          }
        }
      ]
    },
    keyPoints: [
      {
        title: 'Real-time Processing',
        description: 'Process millions of transactions per second',
        icon: 'zap',
        metrics: ['<100ms latency', '99.99% uptime']
      },
      {
        title: 'Advanced AI',
        description: 'State-of-the-art fraud detection models',
        icon: 'cpu',
        metrics: ['95% accuracy', '80% fraud prevention']
      },
      {
        title: 'Compliance',
        description: 'Built-in regulatory compliance',
        icon: 'shield',
        metrics: ['PCI DSS', 'GDPR compliant']
      }
    ]
  }
}; 