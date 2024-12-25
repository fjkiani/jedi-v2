export const aiAnalysisDiagram = {
  useCase: {
    title: "AI Analysis Engine",
    description: "Advanced pattern recognition and risk assessment system",
    businessValue: [
      "Accurate fraud detection",
      "Real-time risk scoring",
      "Pattern recognition",
      "Anomaly detection"
    ],
    capabilities: [
      "Machine learning inference",
      "Pattern matching",
      "Risk scoring",
      "Anomaly detection"
    ]
  },
  nodes: [
    {
      id: 'feature-engineering',
      label: 'Feature Engineering',
      x: 100,
      y: 100,
      description: 'Transform raw data into ML features',
      technologies: {
        processing: ["Scikit-learn", "Pandas"],
        optimization: ["NumPy", "RAPIDS"]
      }
    },
    {
      id: 'ml-inference',
      label: 'ML Inference Engine',
      x: 400,
      y: 100,
      description: 'Real-time model inference',
      technologies: {
        ml: ["TensorFlow", "PyTorch"],
        serving: ["TensorFlow Serving", "Triton"]
      }
    },
    {
      id: 'risk-scoring',
      label: 'Risk Scoring',
      x: 700,
      y: 100,
      description: 'Calculate risk scores',
      technologies: {
        rules: ["Drools", "Easy Rules"],
        cache: ["Redis"]
      }
    },
    {
      id: 'model-monitoring',
      label: 'Model Monitoring',
      x: 400,
      y: 300,
      description: 'Monitor model performance',
      technologies: {
        monitoring: ["MLflow", "Prometheus"],
        visualization: ["Grafana", "Tensorboard"]
      }
    }
  ],
  connections: [
    {
      from: 'feature-engineering',
      to: 'ml-inference',
      label: 'Features'
    },
    {
      from: 'ml-inference',
      to: 'risk-scoring',
      label: 'Predictions'
    },
    {
      from: 'ml-inference',
      to: 'model-monitoring',
      label: 'Metrics'
    },
    {
      from: 'risk-scoring',
      to: 'model-monitoring',
      label: 'Scores'
    }
  ],
  deployment: {
    environments: [
      "Development",
      "Staging",
      "Production"
    ],
    infrastructure: [
      "GPU Clusters",
      "Kubernetes",
      "Model Registry"
    ],
    monitoring: [
      "Model Performance",
      "Inference Latency",
      "Feature Drift"
    ]
  }
}; 