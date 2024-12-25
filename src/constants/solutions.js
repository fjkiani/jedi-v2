export const solutions = [
  {
    id: 'ai-ml-solutions',
    title: "AI/ML Solutions",
    description: "Enterprise-grade AI and machine learning solutions for intelligent automation",
    businessValue: {
      metrics: [
        "Reduce operational costs by 40%",
        "Improve decision accuracy by 85%",
        "Automate 70% of routine tasks",
        "Scale operations without linear headcount"
      ],
      capabilities: [
        "Real-time prediction and inference",
        "Automated feature engineering",
        "Model monitoring and retraining",
        "Scalable ML infrastructure"
      ],
      useCases: [
        "Fraud Detection",
        "Risk Analysis",
        "Customer Segmentation",
        "Predictive Maintenance"
      ]
    },
    architecture: {
      title: "AI/ML Architecture",
      description: "Scalable and production-ready machine learning architecture",
      diagram: "ai-ml-solutions"
    },
    techStack: {
      mlFrameworks: {
        "TensorFlow": {
          icon: "/icons/tensorflow.svg",
          description: "Deep learning and neural networks",
          useCases: ["Fraud Detection", "Risk Analysis"]
        },
        "PyTorch": {
          icon: "/icons/pytorch.svg",
          description: "Research and production ML",
          useCases: ["Customer Segmentation"]
        }
      },
      mlOps: {
        "MLflow": {
          icon: "/icons/mlflow.svg",
          description: "ML lifecycle management",
          useCases: ["Model Training", "Experiment Tracking"]
        },
        "Kubeflow": {
          icon: "/icons/kubeflow.svg",
          description: "ML workflows on Kubernetes",
          useCases: ["Model Deployment"]
        }
      }
    }
  }
];

export const getSolutionBySlug = (slug) => {
  return solutions.find(solution => solution.id === slug);
};
