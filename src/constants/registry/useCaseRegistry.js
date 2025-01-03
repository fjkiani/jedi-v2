import { techUseCaseMapper } from '../techUseCaseMapper';
import { fraudDetectionImplementation } from '../implementations/industries/financial/fraudDetection';

// Tech Use Case Mapping
export const USE_CASE_TECH_MAPPING = {
  "Fraud Detection": {
    primaryTech: "openai",
    relatedTech: ["langchain", "pinecone"],
    solutionId: "ai-ml-solutions"
  },
  "AI Risk Assessment": {
    primaryTech: "openai",
    relatedTech: ["langchain", "weaviate"],
    solutionId: "ai-ml-solutions"
  },
  "Trading Agent": {
    primaryTech: "openai",
    relatedTech: ["langchain"],
    solutionId: "ai-agents"
  }
};

// Industry Use Case Registry
export const USE_CASE_REGISTRY = {
  financial: {
    "fundamentals": {
      id: "fundamentals",
      title: "Fundamentals",
      useCases: {
        "fraud-detection": {
          id: "fraud-detection",
          title: "Fraud Detection",
          implementation: fraudDetectionImplementation,
          queries: [
            "Analyze transaction fraud patterns in real-time",
            "Review ML models for fraud detection",
            "Evaluate fraud prevention strategies"
          ],
          capabilities: ["Pattern Recognition", "Real-time Analysis", "Risk Assessment"]
        }
      }
    },
    "ai-ml-solutions": {
      id: "ai-ml-solutions",
      title: "AI/ML Solutions",
      useCases: {
        "fraud-detection": {
          id: "fraud-detection",
          title: "Fraud Detection",
          techMapping: USE_CASE_TECH_MAPPING["Fraud Detection"],
          implementation: fraudDetectionImplementation,
          queries: fraudDetectionImplementation.exampleQueries.samples,
          capabilities: ["Pattern Recognition", "Real-time Analysis", "Risk Assessment"],
          metrics: fraudDetectionImplementation.metrics
        },
        "risk-assessment": {
          id: "risk-assessment",
          title: "AI Risk Assessment",
          techMapping: USE_CASE_TECH_MAPPING["AI Risk Assessment"],
          queries: [
            "Analyze AI-powered risk assessment models",
            "Review risk scoring algorithms",
            "Evaluate model performance metrics"
          ],
          capabilities: ["Risk Modeling", "ML Model Evaluation", "Real-time Scoring"]
        }
      }
    },
    "ai-agents": {
      id: "ai-agents",
      title: "AI Agents",
      useCases: {
        "trading-agent": {
          id: "trading-agent",
          title: "Trading Agent",
          techMapping: USE_CASE_TECH_MAPPING["Trading Agent"],
          queries: [
            "Evaluate automated trading agent performance",
            "Analyze trading strategy effectiveness",
            "Review risk management protocols"
          ],
          capabilities: ["Market Analysis", "Automated Trading", "Risk Management"]
        }
      }
    }
  }
};

// Helper function to get implementation details
export const getUseCaseImplementation = (industry, solutionId, useCaseId) => {
  return USE_CASE_REGISTRY[industry]?.[solutionId]?.useCases?.[useCaseId]?.implementation;
};

// Helper to get use cases by industry and solution
export const getUseCases = (industry, solutionId) => {
  return USE_CASE_REGISTRY[industry]?.[solutionId]?.useCases || {};
}; 