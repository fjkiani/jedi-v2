export const financialOverview = {
  'fraud-detection': {
    title: 'Enterprise Fraud Detection System',
    description: 'JEDI Labs\' advanced fraud detection system combines real-time monitoring with our proprietary AI models to achieve industry-leading accuracy.',
    workflow: {
      title: 'JEDI Labs Implementation',
      description: 'Our unique approach to fraud detection combines cutting-edge technologies with proprietary optimizations',
      steps: [
        {
          title: 'Data Collection & Integration',
          description: 'High-throughput data ingestion system processing millions of transactions',
          details: [
            'JEDI Stream™ (Powered by Apache Kafka) - Enhanced event streaming with 100k+ TPS',
            'JEDI Schema™ - Smart data integration across transactions, user behavior, and device info',
            'JEDI Quality Gate™ - Real-time data validation with Apache Spark processing',
            'JEDI Cache Layer™ - Multi-tier caching with hot/warm/cold data optimization'
          ],
          technicalSpecs: {
            throughput: '100k+ transactions per second',
            latency: '<50ms processing time',
            scalability: 'JEDI Scale™ horizontal architecture',
            storage: 'JEDI Store™ distributed tiering'
          },
          implementation: {
            core: [
              'JEDI Stream™ (Kafka-based)',
              'JEDI Schema™ (Spark-powered)',
              'JEDI Quality Gate™ (Redis-backed)'
            ],
            integrations: [
              'PostgreSQL with custom indexing',
              'Elasticsearch with JEDI Search™',
              'RabbitMQ with JEDI Queue™'
            ],
            protocols: [
              'HTTPS/2 with JEDI SSL™',
              'gRPC optimized streams',
              'WebSocket with JEDI Push™'
            ]
          },
          icon: 'database'
        },
        {
          title: 'AI Analysis Engine',
          description: 'Multi-model fraud detection system with real-time scoring',
          details: [
            'JEDI Ensemble™ - Advanced ML fusion (Random Forest, XGBoost, Deep Learning)',
            'JEDI AutoTune™ - Automated feature engineering and model optimization',
            'JEDI Deploy™ - Zero-downtime model deployment with automatic rollback',
            'JEDI Monitor™ - Real-time model performance and drift detection'
          ],
          technicalSpecs: {
            modelCount: '15+ specialized models in JEDI Ensemble™',
            accuracy: '99.7% with JEDI Boost™',
            falsePositives: '<0.1% with JEDI Filter™',
            retraining: 'Continuous with JEDI Learn™'
          },
          implementation: {
            models: [
              'JEDI Ensemble™ (TensorFlow + PyTorch)',
              'JEDI Boost™ (XGBoost enhanced)',
              'JEDI Neural™ (Custom architectures)'
            ],
            optimization: [
              'JEDI AutoTune™ (MLflow based)',
              'JEDI Scale™ (KubeFlow powered)',
              'JEDI Cache™ (TensorRT optimized)'
            ],
            monitoring: [
              'JEDI Monitor™ (Prometheus + Grafana)',
              'JEDI Metrics™ (Custom analytics)',
              'JEDI Alert™ (Smart notification)'
            ]
          },
          icon: 'cpu'
        },
        {
          title: 'Decision Engine',
          description: 'Rule-based decision engine with ML-powered risk scoring',
          details: [
            'JEDI Rules™ - Dynamic rule engine (built on Drools) with real-time updates',
            'JEDI Score™ - Multi-factor risk scoring with ML enhancement',
            'JEDI Action™ - Automated response system with custom workflows',
            'JEDI Case™ - Intelligent case management and routing'
          ],
          technicalSpecs: {
            rules: '1000+ rules in JEDI Rules™',
            response: '<100ms with JEDI Decide™',
            accuracy: '99.9% with JEDI Verify™',
            capacity: '10k+ rules/sec with JEDI Process™'
          },
          implementation: {
            core: [
              'JEDI Rules™ (Drools-based)',
              'JEDI Flow™ (Custom workflow)',
              'JEDI Response™ (Event-driven)'
            ],
            automation: [
              'JEDI Threshold™ (Smart limits)',
              'JEDI Route™ (ML routing)',
              'JEDI Priority™ (Smart queueing)'
            ],
            integration: [
              'GraphQL with JEDI Query™',
              'REST with JEDI API™',
              'WebSocket with JEDI Real-time™'
            ]
          },
          icon: 'git-branch'
        }
      ]
    },
    metrics: {
      performance: [
        {
          label: 'Transaction Processing',
          value: '100k+/sec',
          description: 'Real-time transaction processing capacity'
        },
        {
          label: 'Detection Rate',
          value: '99.7%',
          description: 'Fraud detection accuracy'
        },
        {
          label: 'False Positive Rate',
          value: '<0.1%',
          description: 'Industry-leading precision'
        }
      ],
      scalability: [
        {
          label: 'Peak Load',
          value: '1M+ TPS',
          description: 'Maximum tested throughput'
        },
        {
          label: 'Data Processing',
          value: '50TB+/day',
          description: 'Daily data processing volume'
        }
      ],
      business: [
        {
          label: 'Cost Savings',
          value: '$10M+/year',
          description: 'Average fraud prevention savings'
        },
        {
          label: 'ROI',
          value: '300%',
          description: 'Typical return on investment'
        }
      ]
    }
  }
}; 