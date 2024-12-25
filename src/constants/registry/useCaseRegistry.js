import { techUseCaseMapper } from '../techUseCaseMapper';

export const USE_CASE_TECH_MAPPING = {
  // AI/ML Solutions Use Cases
  "Customer Support Automation": {
    primaryTech: "openai",
    relatedTech: ["langchain", "pinecone"],
    solutionId: "ai-ml-solutions"
  },
  "Document Analysis & Summary": {
    primaryTech: "openai",
    relatedTech: ["langchain", "weaviate"],
    solutionId: "ai-ml-solutions"
  },
  "Intelligent Search Assistant": {
    primaryTech: "langchain",
    relatedTech: ["openai", "pinecone"],
    solutionId: "ai-ml-solutions"
  },
  "Content Generation Helper": {
    primaryTech: "openai",
    relatedTech: ["langchain", "mlflow"],
    solutionId: "ai-ml-solutions"
  },
  // AI Agents Use Cases
  "Automated Research Assistant": {
    primaryTech: "langchain",
    relatedTech: ["autogpt", "weaviate"],
    solutionId: "ai-agents"
  },
  "Customer Service Agent": {
    primaryTech: "langchain",
    relatedTech: ["openai", "chromadb"],
    solutionId: "ai-agents"
  },
  "Data Analysis Agent": {
    primaryTech: "autogpt",
    relatedTech: ["langchain", "weaviate"],
    solutionId: "ai-agents"
  },
  "DevOps Automation Agent": {
    primaryTech: "langchain",
    relatedTech: ["airflow", "celery"],
    solutionId: "ai-agents"
  },
  // Healthcare Solutions Use Cases
  "Patient Risk Analysis": {
    primaryTech: "clinical-ai",
    relatedTech: ["fhir", "ml-models"],
    solutionId: "healthcare-solutions"
  },
  "Clinical Decision Support": {
    primaryTech: "clinical-ai",
    relatedTech: ["ehr-integration", "medical-nlp"],
    solutionId: "healthcare-solutions"
  },
  "Remote Patient Monitoring": {
    primaryTech: "health-monitoring",
    relatedTech: ["clinical-ai", "fhir"],
    solutionId: "healthcare-solutions"
  }
};

// Helper function to get implementation details
export const getUseCaseImplementation = (useCase, techId) => {
  const mapping = USE_CASE_TECH_MAPPING[useCase];
  if (!mapping) return null;

  const tech = techUseCaseMapper[techId];
  if (!tech) return null;

  return tech.relatedUseCases.find(uc => uc.title === useCase);
}; 