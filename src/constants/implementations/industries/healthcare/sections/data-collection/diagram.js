import { createDiagram } from '@/constants/implementations/base/diagram-template';

const dataCollectionDiagram = createDiagram({
  title: "Healthcare Data Collection",
  description: "FHIR-compliant healthcare data integration pipeline",
  nodes: [
    {
      id: 'ehr-systems',
      label: 'EHR Systems',
      x: 100,
      y: 100,
      description: 'Electronic Health Record Systems',
      technologies: {
        main: {
          "HL7": "Healthcare data standard",
          "FHIR": "Modern healthcare APIs"
        }
      }
    },
    {
      id: 'data-integration',
      label: 'Data Integration',
      x: 300,
      y: 100,
      description: 'Healthcare data integration layer',
      technologies: {
        main: {
          "Apache Kafka": "Event streaming",
          "HAPI FHIR": "FHIR server implementation"
        }
      }
    }
  ],
  connections: [
    {
      from: 'ehr-systems',
      to: 'data-integration',
      label: 'FHIR/HL7',
      type: 'primary'
    }
  ]
});

export { dataCollectionDiagram }; 