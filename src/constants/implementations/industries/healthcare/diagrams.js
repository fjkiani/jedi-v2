import { commonLayouts } from '../../../diagrams';

export const healthcareDiagram = {
  useCase: {
    title: "Patient Risk Analysis System",
    description: "AI-powered healthcare risk assessment and monitoring platform",
    businessValue: [
      "Early risk detection and prevention",
      "Improved patient outcomes",
      "Reduced healthcare costs",
      "Enhanced clinical decision support"
    ],
    capabilities: [
      "Real-time patient monitoring",
      "Predictive risk assessment",
      "Clinical decision support",
      "HIPAA-compliant data handling"
    ]
  },
  nodes: [
    {
      id: 'data-collection',
      label: 'Data Collection',
      x: commonLayouts.horizontal.startPosition.x,
      y: commonLayouts.horizontal.startPosition.y,
      description: 'Patient data collection and integration',
      technologies: {
        core: ["FHIR", "HL7"],
        integration: ["Apache Kafka", "RabbitMQ"],
        storage: ["PostgreSQL", "MongoDB"]
      }
    },
    {
      id: 'risk-engine',
      label: 'Risk Analysis Engine',
      x: commonLayouts.horizontal.startPosition.x + commonLayouts.horizontal.spacing.x,
      y: commonLayouts.horizontal.startPosition.y,
      description: 'AI-powered risk assessment',
      technologies: {
        ml: ["TensorFlow", "PyTorch"],
        analysis: ["Scikit-learn", "XGBoost"],
        optimization: ["ONNX", "TensorRT"]
      }
    },
    {
      id: 'clinical-support',
      label: 'Clinical Support',
      x: commonLayouts.horizontal.startPosition.x + (commonLayouts.horizontal.spacing.x * 2),
      y: commonLayouts.horizontal.startPosition.y,
      description: 'Clinical decision support system',
      technologies: {
        rules: ["Drools", "OpenCDS"],
        workflow: ["Camunda", "jBPM"],
        ui: ["React", "D3.js"]
      }
    },
    {
      id: 'monitoring',
      label: 'Monitoring & Alerts',
      x: commonLayouts.horizontal.startPosition.x + commonLayouts.horizontal.spacing.x,
      y: commonLayouts.horizontal.startPosition.y + commonLayouts.horizontal.spacing.y,
      description: 'Real-time monitoring and alerting',
      technologies: {
        monitoring: ["Prometheus", "Grafana"],
        alerting: ["PagerDuty", "Alertmanager"],
        logging: ["ELK Stack", "Loki"]
      }
    }
  ],
  connections: [
    {
      from: 'data-collection',
      to: 'risk-engine',
      label: 'Patient Data'
    },
    {
      from: 'risk-engine',
      to: 'clinical-support',
      label: 'Risk Scores'
    },
    {
      from: 'clinical-support',
      to: 'monitoring',
      label: 'Alerts'
    },
    {
      from: 'monitoring',
      to: 'data-collection',
      label: 'Feedback'
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
      "AWS Healthcare",
      "Kubernetes",
      "HIPAA Compliance",
      "Zero Trust Security"
    ],
    monitoring: [
      "Health Metrics",
      "Performance KPIs",
      "Compliance Auditing",
      "Security Monitoring"
    ]
  }
};

// For backward compatibility
export { healthcareDiagram as patientRiskAnalysisDiagram }; 