export const decisionEngineDiagram = {
  useCase: {
    title: "Decision Engine",
    description: "Automated decision making and alert generation system",
    businessValue: [
      "Automated decisions",
      "Consistent policy enforcement",
      "Rapid response",
      "Audit trail"
    ],
    capabilities: [
      "Rule-based decisions",
      "Alert generation",
      "Case management",
      "Audit logging"
    ]
  },
  nodes: [
    {
      id: 'rules-engine',
      label: 'Rules Engine',
      x: 100,
      y: 100,
      description: 'Business rules processing',
      technologies: {
        engine: ["Drools", "Easy Rules"],
        config: ["Spring Rules"]
      }
    },
    {
      id: 'alert-system',
      label: 'Alert System',
      x: 400,
      y: 100,
      description: 'Alert generation and routing',
      technologies: {
        messaging: ["RabbitMQ", "Kafka"],
        notification: ["SendGrid", "Twilio"]
      }
    },
    {
      id: 'case-management',
      label: 'Case Management',
      x: 700,
      y: 100,
      description: 'Fraud case handling',
      technologies: {
        workflow: ["Camunda", "jBPM"],
        ui: ["React", "Material-UI"]
      }
    },
    {
      id: 'audit-logging',
      label: 'Audit System',
      x: 400,
      y: 300,
      description: 'Decision audit trail',
      technologies: {
        storage: ["Elasticsearch", "MongoDB"],
        logging: ["Logstash", "Fluentd"]
      }
    }
  ],
  connections: [
    {
      from: 'rules-engine',
      to: 'alert-system',
      label: 'Decisions'
    },
    {
      from: 'alert-system',
      to: 'case-management',
      label: 'Alerts'
    },
    {
      from: 'rules-engine',
      to: 'audit-logging',
      label: 'Rules Audit'
    },
    {
      from: 'case-management',
      to: 'audit-logging',
      label: 'Case Audit'
    }
  ],
  deployment: {
    environments: [
      "Development",
      "Staging",
      "Production"
    ],
    infrastructure: [
      "AWS Cloud",
      "Kubernetes",
      "Service Mesh"
    ],
    monitoring: [
      "Decision Metrics",
      "Alert SLAs",
      "Audit Compliance"
    ]
  }
}; 