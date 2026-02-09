/**
 * Implementation Data Service
 *
 * Unified service for documentation, code examples, diagrams, and simulation config.
 * Fetches from Hygraph when available; falls back to local constants.
 *
 * @see DYNAMIC_IMPLEMENTATIONS_AND_SIMULATION_PLAN.md
 */

import { hygraphClient } from '@/lib/hygraph';
import { getIndustryDiagram } from '@/constants/registry/industryDiagramsRegistry';
import { getSectionsForIndustry } from '@/constants/registry/industrySectionsRegistry';
import { getSolutionConfig, SOLUTION_REGISTRY } from '@/constants/registry/solutionRegistry';

// Hygraph query for UseCase - implementation (Json) can hold documentationSections, simulationConfig
// When schema adds documentationSectionsJson, simulationConfigJson - extend this query
const GET_USE_CASE_IMPLEMENTATION = `
  query GetUseCaseImplementation($slug: String!) {
    useCaseS(where: { slug: $slug }, first: 1) {
      id
      title
      slug
      implementation
    }
  }
`;

// Hygraph query for Technology - add codeExamplesJson when schema supports it
const GET_TECHNOLOGY_IMPLEMENTATION = `
  query GetTechnologyImplementation($slug: String!) {
    technologyS(where: { slug: $slug }, first: 1) {
      id
      name
      slug
    }
  }
`;

/**
 * Local documentation derived from SOLUTION_REGISTRY (no hardcoding).
 * Uses first solution's docs per industry for backward compat with getDocumentationForIndustrySection.
 */
const LOCAL_DOCS = Object.fromEntries(
  Object.entries(SOLUTION_REGISTRY).map(([industryId, solutions]) => {
    const firstConfig = Object.values(solutions)[0];
    return [industryId, firstConfig?.documentation ?? null];
  })
);

/**
 * Get documentation for an industry + section.
 * Tries Hygraph first; falls back to local constants.
 *
 * @param {string} industryId - e.g. 'financial', 'healthcare'
 * @param {string} sectionId - e.g. 'fundamentals', 'data-integration'
 * @param {object} hygraphData - optional pre-fetched Hygraph use case/application data
 * @returns {{ docs: object, source: 'hygraph'|'local' }}
 */
export async function getDocumentationForIndustrySection(industryId, sectionId, hygraphData = null) {
  // Check for documentation in implementation Json or future documentationSectionsJson
  const docJson = hygraphData?.documentationSectionsJson ?? hygraphData?.implementation?.documentationSections;
  if (docJson) {
    try {
      const parsed = typeof docJson === 'string' ? JSON.parse(docJson) : docJson;
      const content = parsed[sectionId] || parsed.fundamentals;
      if (content) return { docs: content, source: 'hygraph' };
    } catch (e) {
      console.warn('[implementationDataService] Failed to parse documentationSectionsJson', e);
    }
  }

  const localDocs = LOCAL_DOCS[industryId];
  const content = localDocs?.[sectionId] ?? localDocs?.fundamentals;
  return { docs: content || null, source: 'local' };
}

/**
 * Get documentation sections for a use case by slug.
 *
 * @param {string} useCaseSlug - e.g. 'advanced-fraud-detection-system'
 * @returns {{ sections: array, docs: object, source: 'hygraph'|'local' }}
 */
export async function getDocumentationForUseCase(useCaseSlug) {
  try {
    const result = await hygraphClient.request(GET_USE_CASE_IMPLEMENTATION, { slug: useCaseSlug });
    const useCase = result?.useCaseS?.[0];
    const docSource = useCase?.documentationSectionsJson ?? useCase?.implementation?.documentationSections;
    if (docSource) {
      const parsed = typeof docSource === 'string' ? JSON.parse(docSource) : docSource;
      return { sections: parsed, docs: parsed, source: 'hygraph' };
    }
  } catch (e) {
    console.warn('[implementationDataService] Hygraph fetch failed for use case docs', e);
  }

  return { sections: null, docs: null, source: 'local' };
}

/**
 * Get code examples for a technology.
 *
 * @param {string} techSlug - e.g. 'langchain'
 * @returns {{ examples: array, source: 'hygraph'|'local' }}
 */
export async function getCodeExamplesForTechnology(techSlug) {
  try {
    const result = await hygraphClient.request(GET_TECHNOLOGY_IMPLEMENTATION, { slug: techSlug });
    const tech = result?.technologyS?.[0];
    if (tech?.codeExamplesJson) {
      const parsed = typeof tech.codeExamplesJson === 'string'
        ? JSON.parse(tech.codeExamplesJson)
        : tech.codeExamplesJson;
      const examples = Array.isArray(parsed) ? parsed : (parsed?.examples || []);
      return { examples, source: 'hygraph' };
    }
  } catch (e) {
    console.warn('[implementationDataService] Hygraph fetch failed for tech code examples', e);
  }

  return { examples: [], source: 'local' };
}

/**
 * Get simulation config for a use case.
 *
 * @param {string} useCaseSlug
 * @returns {{ config: object|null, source: 'hygraph'|'local' }}
 */
export async function getSimulationConfig(useCaseSlug) {
  try {
    const result = await hygraphClient.request(GET_USE_CASE_IMPLEMENTATION, { slug: useCaseSlug });
    const useCase = result?.useCaseS?.[0];
    const simSource = useCase?.simulationConfigJson ?? useCase?.implementation?.simulationConfig;
    if (simSource) {
      const parsed = typeof simSource === 'string' ? JSON.parse(simSource) : simSource;
      return { config: parsed, source: 'hygraph' };
    }
  } catch (e) {
    console.warn('[implementationDataService] Hygraph fetch failed for simulation config', e);
  }

  return { config: null, source: 'local' };
}

/**
 * Get diagram config for industry + section.
 * Uses local registry; Hygraph diagramConfigJson can be added later.
 *
 * @param {string} industryId
 * @param {string} sectionId
 * @param {object} hygraphData - optional pre-fetched data with diagramConfigJson
 * @returns {{ diagram: object|null, source: 'hygraph'|'local' }}
 */
export function getDiagramForSection(industryId, sectionId, hygraphData = null) {
  if (hygraphData?.diagramConfigJson) {
    try {
      const parsed = typeof hygraphData.diagramConfigJson === 'string'
        ? JSON.parse(hygraphData.diagramConfigJson)
        : hygraphData.diagramConfigJson;
      return { diagram: parsed, source: 'hygraph' };
    } catch (e) {
      console.warn('[implementationDataService] Failed to parse diagramConfigJson', e);
    }
  }

  const diagram = getIndustryDiagram(industryId, sectionId);
  return { diagram, source: 'local' };
}

/**
 * Get sections for an industry (nav items).
 * Uses local registry; can merge with Hygraph later.
 *
 * @param {string} industryId
 * @returns {array}
 */
export function getSections(industryId) {
  return getSectionsForIndustry(industryId);
}

/**
 * Get full implementation config (docs + diagram + simulation) for a solution.
 * Mirrors getSolutionConfig but can merge Hygraph data.
 *
 * @param {string} industryId
 * @param {string} solutionId - e.g. 'fraud-detection'
 * @returns {object|null}
 */
export function getSolutionImplementation(industryId, solutionId) {
  return getSolutionConfig(industryId, solutionId);
}

export const implementationDataService = {
  getDocumentationForIndustrySection,
  getDocumentationForUseCase,
  getCodeExamplesForTechnology,
  getSimulationConfig,
  getDiagramForSection,
  getSections,
  getSolutionImplementation,
};
