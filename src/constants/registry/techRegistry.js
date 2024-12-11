export const TECH_CATEGORIES = {
  AI_PLATFORMS: 'aiPlatforms',
  ML_FRAMEWORKS: 'mlFrameworks',
  VECTOR_DBS: 'vectorDatabases',
  ML_OPS: 'mlOps',
  INFRASTRUCTURE: 'infrastructure',
  DEPLOYMENT: 'deployment'
};

export const TECH_IDS = {
  OPENAI: 'openai',
  LANGCHAIN: 'langchain',
  PINECONE: 'pinecone',
  HUGGINGFACE: 'huggingface'
};

export const USE_CASE_TYPES = {
  CUSTOMER_SUPPORT: 'customer-support-automation',
  DOCUMENT_ANALYSIS: 'document-analysis-summary',
  INTELLIGENT_SEARCH: 'intelligent-search-assistant',
  CONTENT_GENERATION: 'content-generation-helper'
};

// Add this export
export const TECH_CATEGORY_MAPPING = {
  [TECH_IDS.OPENAI]: TECH_CATEGORIES.AI_PLATFORMS,
  [TECH_IDS.LANGCHAIN]: TECH_CATEGORIES.ML_FRAMEWORKS,
  [TECH_IDS.PINECONE]: TECH_CATEGORIES.VECTOR_DBS,
  [TECH_IDS.HUGGINGFACE]: TECH_CATEGORIES.ML_FRAMEWORKS
};

// Add this export
export const USE_CASE_REQUIREMENTS = {
  [USE_CASE_TYPES.CUSTOMER_SUPPORT]: {
    requiredCategories: [TECH_CATEGORIES.AI_PLATFORMS],
    optionalCategories: [TECH_CATEGORIES.VECTOR_DBS]
  },
  // ... other use case requirements
};