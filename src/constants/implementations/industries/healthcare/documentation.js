export const patientRiskAnalysisDocs = {
  'data-collection': {
    architecture: [
      'FHIR-compliant data ingestion pipeline',
      'Real-time streaming architecture',
      'Multi-source data integration',
      'HIPAA-compliant data handling'
    ],
    technologies: [
      'HL7 FHIR R4',
      'Apache Kafka',
      'HAPI FHIR Server',
      'PostgreSQL'
    ],
    codeExamples: [
      {
        title: 'FHIR Data Integration',
        description: 'Example of integrating patient data using FHIR',
        code: `// FHIR Patient Resource Integration
const client = new FHIRClient({
  baseUrl: 'https://fhir-server/api',
  headers: { /* auth headers */ }
});

async function getPatientData(patientId) {
  const patient = await client.read({
    resourceType: 'Patient',
    id: patientId
  });
  
  const observations = await client.search({
    resourceType: 'Observation',
    parameters: {
      patient: patientId,
      date: 'gt2023-01-01',
      _sort: '-date'
    }
  });

  return { patient, observations };
}`
      }
    ]
  },
  // Add similar structures for 'ai-analysis' and 'clinical-decision'
};