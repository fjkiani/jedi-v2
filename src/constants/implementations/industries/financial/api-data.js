import { USE_CASE_REGISTRY } from '@/constants/registry/useCaseRegistry';
import { generateDiscoveries, generateValidation } from '@/services/factories/responseDataFactory';

export const INDUSTRY_USE_CASES = {
  financial: {
    "ai-ml-solutions": {
      queries: Object.fromEntries(
        Object.values(USE_CASE_REGISTRY["ai-ml-solutions"].useCases).flatMap(useCase => 
          useCase.queries.map(query => [
            query,
            {
              icon: "🎯",
              title: useCase.title,
              capabilities: useCase.capabilities,
              mainPoint: useCase.implementation.mainPoint,
              processingSteps: useCase.implementation.processingSteps,
              discoveries: generateDiscoveries(useCase.id),
              validation: generateValidation(useCase.id)
            }
          ])
        )
      )
    },
    "ai-agents": {
      queries: Object.fromEntries(
        Object.values(USE_CASE_REGISTRY["ai-agents"].useCases).flatMap(useCase => 
          useCase.queries.map(query => [
            query,
            {
              icon: useCase.id === "trading-agent" ? "🤖" : "📚",
              title: useCase.title,
              capabilities: useCase.capabilities,
              mainPoint: useCase.implementation?.mainPoint,
              processingSteps: useCase.implementation?.processingSteps,
              discoveries: generateDiscoveries(useCase.id),
              validation: generateValidation(useCase.id)
            }
          ])
        )
      )
    }
  }
}; 