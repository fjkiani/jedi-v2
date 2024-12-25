import { createDiagram } from '@/constants/implementations/base/diagram-template';

export const aiAnalysisDiagram = createDiagram({
  title: "AI Analysis Engine",
  description: "Enterprise ML pipeline for real-time fraud detection and risk analysis",
  nodes: [
    {
      id: 'feature-engineering',
      label: 'Feature Engineering',
      x: 100,
      y: 100,
      description: 'Transform raw data into ML features',
      technologies: {
        main: {
          "Apache Spark": "Distributed processing",
          "Pandas": "Data transformation",
          "NumPy": "Numerical processing",
          "Feature Store": "Feature management"
        },
        processing: {
          "PySpark": "Distributed computing",
          "Dask": "Parallel computing",
          "Ray": "Distributed ML",
          "Feast": "Feature serving"
        },
        storage: {
          "Redis": "Online features",
          "Cassandra": "Feature storage",
          "S3": "Offline features"
        }
      },
      metrics: {
        "throughput": "50k events/sec",
        "latency": "<100ms",
        "feature count": "1000+",
        "update frequency": "5min"
      },
      features: [
        "Real-time feature computation",
        "Feature versioning",
        "Point-in-time correctness",
        "Feature monitoring",
        "Data validation"
      ]
    },
    {
      id: 'ml-inference',
      label: 'ML Inference Engine',
      x: 500,
      y: 100,
      description: 'Real-time model inference and serving',
      technologies: {
        main: {
          "TensorFlow Serving": "Model serving",
          "ONNX Runtime": "Model inference",
          "Triton": "Inference server",
          "TorchServe": "PyTorch serving"
        },
        optimization: {
          "TensorRT": "GPU acceleration",
          "OpenVINO": "CPU optimization",
          "CUDA": "GPU computing",
          "Intel MKL": "Math optimization"
        },
        monitoring: {
          "Prometheus": "Model metrics",
          "MLflow": "Model tracking",
          "Seldon": "Model deployment"
        }
      },
      metrics: {
        "inference time": "<20ms",
        "throughput": "1000 req/sec",
        "GPU utilization": "85%",
        "model accuracy": "99.5%"
      },
      features: [
        "Model A/B testing",
        "Dynamic batching",
        "Auto-scaling",
        "Model versioning",
        "Hardware acceleration"
      ]
    },
    {
      id: 'risk-scoring',
      label: 'Risk Scoring',
      x: 900,
      y: 100,
      description: 'Risk evaluation and score calculation',
      technologies: {
        main: {
          "Python": "Score calculation",
          "Redis": "Score caching",
          "gRPC": "Fast communication",
          "NumPy": "Numerical computation"
        },
        processing: {
          "Pandas": "Data processing",
          "SciPy": "Scientific computing",
          "Dask": "Parallel processing"
        },
        apis: {
          "FastAPI": "REST API",
          "gRPC": "RPC interface",
          "GraphQL": "Query interface"
        }
      },
      metrics: {
        "scoring time": "<50ms",
        "accuracy": "99.9%",
        "false positives": "<0.1%",
        "cache hit rate": "95%"
      },
      features: [
        "Real-time scoring",
        "Score explanation",
        "Confidence levels",
        "Risk thresholds",
        "Score aggregation"
      ]
    },
    {
      id: 'model-monitoring',
      label: 'Model Monitoring',
      x: 500,
      y: 400,
      description: 'ML model and data drift monitoring',
      technologies: {
        main: {
          "Evidently": "ML monitoring",
          "Prometheus": "Metrics collection",
          "Grafana": "Visualization",
          "Great Expectations": "Data validation"
        },
        analysis: {
          "Pandas": "Data analysis",
          "SciPy": "Statistical tests",
          "Plotly": "Interactive plots"
        },
        storage: {
          "InfluxDB": "Time series",
          "PostgreSQL": "Metadata",
          "S3": "Raw data"
        }
      },
      metrics: {
        "drift detection": "<1hr",
        "alert latency": "<1min",
        "data coverage": "100%",
        "monitoring delay": "<5min"
      },
      features: [
        "Data drift detection",
        "Model performance tracking",
        "Feature importance analysis",
        "Automated retraining triggers",
        "Custom metric tracking"
      ]
    }
  ],
  connections: [
    {
      from: 'feature-engineering',
      to: 'ml-inference',
      label: 'Features',
      type: 'primary',
      protocol: 'gRPC',
      dataFlow: {
        type: 'Streaming',
        format: 'Protobuf',
        volume: '50k/sec',
        latency: '<10ms'
      }
    },
    {
      from: 'ml-inference',
      to: 'risk-scoring',
      label: 'Predictions',
      type: 'primary',
      protocol: 'gRPC',
      dataFlow: {
        type: 'Streaming',
        format: 'Protobuf',
        volume: '1k/sec',
        latency: '<5ms'
      }
    },
    {
      from: 'ml-inference',
      to: 'model-monitoring',
      label: 'Model Metrics',
      type: 'monitoring',
      protocol: 'REST',
      dataFlow: {
        type: 'Metrics',
        format: 'JSON',
        volume: '100/sec',
        latency: '<100ms'
      }
    },
    {
      from: 'risk-scoring',
      to: 'model-monitoring',
      label: 'Score Metrics',
      type: 'monitoring',
      protocol: 'REST',
      dataFlow: {
        type: 'Metrics',
        format: 'JSON',
        volume: '100/sec',
        latency: '<100ms'
      }
    }
  ],
  zones: [
    {
      id: 'ml-zone',
      label: 'ML Processing Zone',
      nodes: ['feature-engineering', 'ml-inference', 'risk-scoring'],
      security: 'Private Subnet',
      compliance: ['SOC2', 'GDPR', 'ISO27001']
    },
    {
      id: 'monitoring-zone',
      label: 'Monitoring Zone',
      nodes: ['model-monitoring'],
      security: 'Private Subnet',
      compliance: ['SOC2']
    }
  ]
}); 