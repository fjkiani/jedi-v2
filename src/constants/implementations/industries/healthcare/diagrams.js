export const patientRiskAnalysisDiagram = {
  nodes: [
    {
      id: 'data-ingestion',
      label: 'Health Data Ingestion',
      description: 'HIPAA-compliant data processing\n• EHR/EMR integration\n• Real-time vitals monitoring\n• Lab results processing\n• Medication tracking\n• Secure data encryption',
      x: 100,
      y: 100,
      type: "Input",
      technologies: {
        core: ['HL7 FHIR', 'DICOM'],
        features: [
          'Secure health data integration',
          'Real-time patient monitoring',
          'Multi-source data aggregation'
        ]
      }
    },
    {
      id: 'analysis-engine',
      label: 'Clinical Analysis Engine',
      description: 'AI-powered health analysis\n• Patient risk stratification\n• Condition prediction\n• Treatment optimization\n• Drug interaction checking\n• Continuous monitoring',
      x: 500,
      y: 100,
      type: "Service",
      technologies: {
        core: ['TensorFlow', 'PyTorch', 'Clinical NLP'],
        features: [
          'Real-time health risk assessment',
          'Predictive analytics for patient outcomes',
          'Medical knowledge graph integration'
        ]
      }
    },
    {
      id: 'clinical-db',
      label: 'Clinical Database',
      description: 'Secure patient data storage\n• HIPAA compliance\n• Audit logging\n• Data versioning\n• Access controls\n• Encryption at rest',
      x: 900,
      y: 100,
      type: "Storage",
      technologies: {
        core: ['FHIR Server', 'PostgreSQL'],
        features: [
          'Compliant health data storage',
          'Clinical data versioning',
          'Secure access management'
        ]
      }
    },
    {
      id: 'alert-system',
      label: 'Clinical Alert System',
      description: 'Smart clinical alerting\n• Risk-based prioritization\n• Care team notification\n• Intervention tracking\n• Escalation management\n• Compliance logging',
      x: 300,
      y: 400,
      type: "Alert",
      technologies: {
        core: ['RabbitMQ', 'Clinical Decision Support'],
        features: [
          'Real-time clinical alerts',
          'Care team coordination',
          'Intervention tracking'
        ]
      }
    },
    {
      id: 'ml-models',
      label: 'Clinical ML Models',
      description: 'Healthcare-specific AI\n• Risk prediction\n• Outcome analysis\n• Treatment optimization\n• Pattern recognition\n• Continuous learning',
      x: 700,
      y: 400,
      type: "ML",
      technologies: {
        core: ['Clinical AI Models', 'Medical NLP'],
        features: [
          'Disease progression prediction',
          'Treatment response analysis',
          'Patient risk stratification'
        ]
      }
    }
  ],
  connections: [
    {
      from: 'data-ingestion',
      to: 'analysis-engine',
      label: 'Patient Data Stream'
    },
    {
      from: 'analysis-engine',
      to: 'clinical-db',
      label: 'Analysis Results'
    },
    {
      from: 'analysis-engine',
      to: 'alert-system',
      label: 'Clinical Alerts'
    },
    {
      from: 'analysis-engine',
      to: 'ml-models',
      label: 'Model Updates'
    },
    {
      from: 'ml-models',
      to: 'analysis-engine',
      label: 'Predictions'
    }
  ]
}; 