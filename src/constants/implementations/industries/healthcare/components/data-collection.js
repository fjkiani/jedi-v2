export const dataCollectionDocs = {
  title: "Data Collection & Integration",
  description: "Enterprise-grade healthcare data integration pipeline built on FHIR standards",
  
  architecture: [
    "FHIR-compliant data ingestion pipeline",
    "Real-time streaming with Apache Kafka",
    "Multi-source data integration (EHR, IoT devices, labs)",
    "HIPAA-compliant data handling",
    "Scalable event processing architecture"
  ],

  technologies: [
    "HL7 FHIR R4",
    "Apache Kafka",
    "HAPI FHIR Server",
    "PostgreSQL",
    "Redis Cache"
  ],

  sections: [
    {
      title: "FHIR Integration",
      description: "Standards-based healthcare data integration using HL7 FHIR",
      content: `Our FHIR implementation supports:
      - Patient demographics and history
      - Clinical observations and measurements
      - Diagnostic reports and lab results
      - Medications and allergies
      - Care plans and procedures`,
      codeExample: {
        title: "FHIR Patient Resource Integration",
        description: "Example of retrieving and processing patient data using FHIR API",
        code: `// FHIR Client Setup
const client = new FHIRClient({
  baseUrl: 'https://fhir.hospital.org/api/r4',
  auth: {
    type: 'bearer',
    token: process.env.FHIR_TOKEN
  }
});

// Fetch Patient Data with Related Resources
async function getPatientData(patientId) {
  // Get basic patient info
  const patient = await client.read({
    resourceType: 'Patient',
    id: patientId
  });

  // Get recent observations
  const observations = await client.search({
    resourceType: 'Observation',
    parameters: {
      patient: patientId,
      date: 'gt2023-01-01',
      _sort: '-date',
      _include: ['Observation:performer']
    }
  });

  return { patient, observations };
}`
      }
    },
    {
      title: "Real-time Data Streaming",
      description: "High-throughput event streaming for real-time health monitoring",
      content: `Our streaming architecture provides:
      - Sub-millisecond latency
      - Guaranteed message delivery
      - Automatic failover
      - Message replay capabilities
      - Data partitioning by facility`,
      codeExample: {
        title: "Kafka Stream Processing",
        description: "Real-time processing of vital signs data",
        code: `// Kafka Stream Configuration
const streamConfig = {
  applicationId: 'vital-signs-processor',
  brokers: ['kafka1:9092', 'kafka2:9092'],
  topic: 'patient.vitals'
};

// Create streaming topology
const topology = new StreamTopology()
  .input('patient.vitals')
  .windowedBy(TimeWindows.of(Duration.minutes(5)))
  .aggregate(
    () => new VitalSignsAggregator(),
    (key, value, aggregate) => {
      // Update running averages
      aggregate.addHeartRate(value.heartRate);
      aggregate.addBloodPressure(value.systolic, value.diastolic);
      aggregate.addTemperature(value.temperature);
      return aggregate;
    }
  )
  .filter(vitals => vitals.requiresAttention())
  .output('patient.alerts');

// Start the stream processor
const processor = new StreamProcessor(streamConfig);
processor.start(topology);`
      }
    },
    {
      title: "Data Validation & Transformation",
      description: "Ensuring data quality and consistency across sources",
      content: `Our validation pipeline includes:
      - FHIR resource validation
      - Terminology service integration
      - Data normalization
      - Unit conversion
      - Missing data handling`,
      codeExample: {
        title: "Data Validation Pipeline",
        description: "Validating and normalizing clinical data",
        code: `class ClinicalDataValidator {
  constructor(terminologyService) {
    this.terminology = terminologyService;
  }

  async validateObservation(observation) {
    // Validate LOINC code
    const code = observation.code.coding[0];
    const isValid = await this.terminology.validateCode({
      system: 'http://loinc.org',
      code: code.code
    });

    if (!isValid) {
      throw new ValidationError(\`Invalid LOINC code: \${code.code}\`);
    }

    // Normalize units
    const value = observation.valueQuantity;
    if (value) {
      const normalized = await this.normalizeUnits({
        value: value.value,
        unit: value.unit,
        targetUnit: this.getPreferredUnit(code.code)
      });
      
      observation.valueQuantity = normalized;
    }

    return observation;
  }
}`
      }
    }
  ],

  metrics: {
    performance: [
      "99.99% uptime",
      "<100ms average latency",
      "100k+ events/second throughput",
      "Zero data loss guarantee"
    ],
    compliance: [
      "HIPAA compliant",
      "GDPR ready",
      "SOC 2 Type II certified",
      "HITRUST CSF certified"
    ]
  }
}; 