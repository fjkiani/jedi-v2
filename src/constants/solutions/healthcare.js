export const healthcareSolution = {
  id: "healthcare",
  title: "Healthcare & Life Sciences Solutions",
  shortTitle: "Healthcare",
  slug: "healthcare-solutions",
  description: "Enterprise-grade healthcare AI solutions for patient care and clinical decision support",
  
  solutions: {
    "patient-risk-analysis": {
      title: "AI-Powered Patient Risk Analysis",
      description: "Real-time patient monitoring and predictive risk assessment",
      icon: "activity",
      capabilities: [
        "Real-time vital sign monitoring",
        "Early warning system for clinical deterioration",
        "Predictive analytics for patient outcomes",
        "Clinical decision support integration",
        "HIPAA-compliant data processing"
      ],
      metrics: {
        accuracy: "95% prediction accuracy",
        response: "< 3 min alert response time",
        reduction: "80% reduction in critical events",
        coverage: "24/7 continuous monitoring"
      },
      clinicalUseCase: {
        scenarios: [
          {
            title: "Early Sepsis Detection",
            description: "Continuous monitoring of vital signs and lab results to detect early signs of sepsis",
            impact: "47% reduction in sepsis-related mortality"
          },
          {
            title: "Post-Surgery Monitoring",
            description: "Real-time tracking of post-operative patients for complications",
            impact: "62% reduction in post-surgical complications"
          },
          {
            title: "Chronic Disease Management",
            description: "Long-term monitoring of patients with chronic conditions",
            impact: "35% reduction in hospital readmissions"
          }
        ],
        workflow: [
          {
            step: "Data Collection",
            description: "Continuous gathering of patient vitals, lab results, and EHR data",
            technologies: ["HL7 FHIR", "IoMT Devices", "EHR Integration"]
          },
          {
            step: "Real-time Analysis",
            description: "AI-powered analysis of patient data streams",
            technologies: ["Clinical AI Models", "Stream Processing", "Medical NLP"]
          },
          {
            step: "Risk Assessment",
            description: "Continuous evaluation of patient risk levels",
            technologies: ["Predictive Analytics", "Clinical Rules Engine"]
          },
          {
            step: "Alert Generation",
            description: "Smart alerting system for healthcare providers",
            technologies: ["Clinical Decision Support", "Mobile Alerts"]
          }
        ]
      },
      implementation: {
        architecture: {
          components: [
            {
              name: "Data Ingestion Layer",
              description: "HIPAA-compliant data collection and processing",
              technologies: ["FHIR", "HL7", "DICOM"]
            },
            {
              name: "Clinical AI Engine",
              description: "Advanced medical analysis and prediction",
              technologies: ["TensorFlow", "Clinical NLP", "Medical Knowledge Graphs"]
            },
            {
              name: "Risk Assessment Module",
              description: "Real-time risk calculation and trending",
              technologies: ["Predictive Models", "Statistical Analysis"]
            },
            {
              name: "Alert Management System",
              description: "Intelligent clinical alerting and notification",
              technologies: ["Clinical Rules Engine", "Mobile Push Notifications"]
            }
          ],
          security: {
            compliance: ["HIPAA", "HITECH", "GDPR"],
            features: [
              "End-to-end encryption",
              "Role-based access control",
              "Audit logging",
              "Data anonymization"
            ]
          }
        }
      }
    }
  }
};