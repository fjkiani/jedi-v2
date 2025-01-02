import { useCaseService } from '@/services/useCaseService';

// Base section types that can be reused across industries
export const SECTION_TYPES = {
  FUNDAMENTALS: 'fundamentals',
  DATA_COLLECTION: 'data-collection',
  ANALYSIS: 'analysis',
  DECISION_ENGINE: 'decision-engine',
  MONITORING: 'monitoring',
  COMPLIANCE: 'compliance'
};

// Common section icons that can be reused
export const SECTION_ICONS = {
  [SECTION_TYPES.FUNDAMENTALS]: 'book',
  [SECTION_TYPES.DATA_COLLECTION]: 'database',
  [SECTION_TYPES.ANALYSIS]: 'cpu',
  [SECTION_TYPES.DECISION_ENGINE]: 'shield',
  [SECTION_TYPES.MONITORING]: 'activity',
  [SECTION_TYPES.COMPLIANCE]: 'check-square'
};

// Industry-specific section configurations
export const INDUSTRY_SECTIONS = {
  financial: [
    {
      id: SECTION_TYPES.FUNDAMENTALS,
      label: 'Understanding Fraud Detection',
      icon: SECTION_ICONS[SECTION_TYPES.FUNDAMENTALS]
    },
    {
      id: SECTION_TYPES.DATA_COLLECTION,
      label: 'Data Collection & Integration',
      icon: SECTION_ICONS[SECTION_TYPES.DATA_COLLECTION]
    },
    {
      id: SECTION_TYPES.ANALYSIS,
      label: 'AI Analysis Engine',
      icon: SECTION_ICONS[SECTION_TYPES.ANALYSIS]
    },
    {
      id: SECTION_TYPES.DECISION_ENGINE,
      label: 'Decision Engine',
      icon: SECTION_ICONS[SECTION_TYPES.DECISION_ENGINE]
    }
  ],
  healthcare: [
    {
      id: SECTION_TYPES.FUNDAMENTALS,
      label: 'Understanding Patient Risk',
      icon: SECTION_ICONS[SECTION_TYPES.FUNDAMENTALS]
    },
    {
      id: SECTION_TYPES.DATA_COLLECTION,
      label: 'Patient Data Collection',
      icon: SECTION_ICONS[SECTION_TYPES.DATA_COLLECTION]
    },
    {
      id: SECTION_TYPES.ANALYSIS,
      label: 'Risk Analysis Engine',
      icon: SECTION_ICONS[SECTION_TYPES.ANALYSIS]
    },
    {
      id: 'clinical-decision',
      label: 'Clinical Decision Support',
      icon: 'stethoscope'
    }
  ]
};

// Helper functions
export const getSectionsForIndustry = (industryId) => {
  // Start with hardcoded sections as fallback
  const defaultSections = INDUSTRY_SECTIONS[industryId] || [];
  
  // Return hardcoded sections for now
  // Later we can enhance this to merge with Hygraph data
  return defaultSections;
};

export const getSectionConfig = (industryId, sectionId) => {
  const sections = INDUSTRY_SECTIONS[industryId] || [];
  return sections.find(section => section.id === sectionId);
};

// Future enhancement: merge with Hygraph data
// export const getHygraphSections = async (industryId) => {
//   try {
//     const hygraphSections = await useCaseService.getIndustrySections(industryId);
//     return hygraphSections;
//   } catch (error) {
//     console.error('Error fetching Hygraph sections:', error);
//     return [];
//   }
// }; 