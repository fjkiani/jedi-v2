import { createDiagram } from '@/constants/implementations/base/diagram-template';

export const patientRiskDiagram = createDiagram({
  title: "Patient Risk Analysis System",
  description: "AI-powered patient monitoring and risk assessment system",
  nodes: [
    {
      id: 'data-collection',
      label: 'Data Collection',
      x: 100,
      y: 100,
      description: 'Multi-source patient data collection',
      technologies: {
        main: {
          "HL7": "Healthcare data standard",
          "FHIR": "Modern healthcare APIs",
          "DICOM": "Medical imaging"
        }
      },
      metrics: {
        "throughput": "10k events/sec",
        "reliability": "99.999%"
      }
    },
    // ... other nodes
  ],
  connections: [
    {
      from: 'data-collection',
      to: 'processing',
      label: 'Patient Data',
      type: 'primary',
      protocol: 'HL7/FHIR'
    },
    // ... other connections
  ],
  zones: [
    {
      id: 'data-zone',
      label: 'Data Collection Zone',
      nodes: ['data-collection'],
      security: 'Private Subnet',
      compliance: ['HIPAA', 'GDPR']
    },
    // ... other zones
  ]
}); 