/**
 * JEDI Components - Helper Functions
 * 
 * Utility functions for working with JEDI components, implementations, and architecture
 */

import { JEDI_ENSEMBLE } from '../components/ensemble.js';
import { JEDI_RULES } from '../components/rules.js';
import { JEDI_AUTOMATE } from '../components/automate.js';
import { ENSEMBLE_IMPLEMENTATIONS } from '../implementations/ensemble.js';
import { RULES_IMPLEMENTATIONS } from '../implementations/rules.js';
import { AUTOMATE_IMPLEMENTATIONS } from '../implementations/automate.js';

// All JEDI components
export const ALL_JEDI_COMPONENTS = [JEDI_ENSEMBLE, JEDI_RULES, JEDI_AUTOMATE];

// All implementations across all components
export const ALL_JEDI_IMPLEMENTATIONS = [
  ...ENSEMBLE_IMPLEMENTATIONS,
  ...RULES_IMPLEMENTATIONS,
  ...AUTOMATE_IMPLEMENTATIONS
];

// Alias for easier importing
export const getAllJediImplementations = () => ALL_JEDI_IMPLEMENTATIONS;

/**
 * Get a JEDI component by ID
 * @param {string} id - Component ID (e.g., 'jedi-ensemble', 'jedi-rules', 'jedi-automate')
 * @returns {Object|null} JEDI component object or null if not found
 */
export const getJediComponentById = (id) => {
  return ALL_JEDI_COMPONENTS.find(component => component.id === id);
};

/**
 * Get a JEDI component by name
 * @param {string} name - Component name (e.g., 'JEDI Ensemble™', 'JEDI Rules™', 'JEDI Automate™')
 * @returns {Object|null} JEDI component object or null if not found
 */
export const getJediComponentByName = (name) => {
  return ALL_JEDI_COMPONENTS.find(component => component.name === name);
};

/**
 * Get all implementations for a specific JEDI component
 * @param {string} componentId - Component ID
 * @returns {Array} Array of implementation objects
 */
export const getImplementationsByComponent = (componentId) => {
  switch (componentId) {
    case 'jedi-ensemble':
      return ENSEMBLE_IMPLEMENTATIONS;
    case 'jedi-rules':
      return RULES_IMPLEMENTATIONS;
    case 'jedi-automate':
      return AUTOMATE_IMPLEMENTATIONS;
    default:
      return [];
  }
};

/**
 * Get all implementations by industry
 * @param {string} industry - Industry name
 * @returns {Array} Array of implementation objects
 */
export const getImplementationsByIndustry = (industry) => {
  return ALL_JEDI_IMPLEMENTATIONS.filter(impl => 
    impl.industry.toLowerCase().includes(industry.toLowerCase())
  );
};

/**
 * Get all implementations by technology
 * @param {string} technology - Technology name
 * @returns {Array} Array of implementation objects
 */
export const getImplementationsByTechnology = (technology) => {
  return ALL_JEDI_IMPLEMENTATIONS.filter(impl => 
    impl.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

/**
 * Get all implementations by client
 * @param {string} client - Client name
 * @returns {Array} Array of implementation objects
 */
export const getImplementationsByClient = (client) => {
  return ALL_JEDI_IMPLEMENTATIONS.filter(impl => 
    impl.client.toLowerCase().includes(client.toLowerCase())
  );
};

/**
 * Get all unique industries from implementations
 * @returns {Array} Array of unique industry names
 */
export const getAllIndustries = () => {
  const industries = ALL_JEDI_IMPLEMENTATIONS.map(impl => impl.industry);
  return [...new Set(industries)];
};

/**
 * Get all unique technologies from implementations
 * @returns {Array} Array of unique technology names
 */
export const getAllTechnologies = () => {
  const technologies = ALL_JEDI_IMPLEMENTATIONS.flatMap(impl => impl.technologies);
  return [...new Set(technologies)];
};

/**
 * Get all unique clients from implementations
 * @returns {Array} Array of unique client names
 */
export const getAllClients = () => {
  const clients = ALL_JEDI_IMPLEMENTATIONS.map(impl => impl.client);
  return [...new Set(clients)];
};

/**
 * Get implementation statistics
 * @returns {Object} Statistics about implementations
 */
export const getImplementationStats = () => {
  return {
    totalImplementations: ALL_JEDI_IMPLEMENTATIONS.length,
    totalIndustries: getAllIndustries().length,
    totalTechnologies: getAllTechnologies().length,
    totalClients: getAllClients().length,
    implementationsByComponent: {
      'JEDI Ensemble™': ENSEMBLE_IMPLEMENTATIONS.length,
      'JEDI Rules™': RULES_IMPLEMENTATIONS.length,
      'JEDI Automate™': AUTOMATE_IMPLEMENTATIONS.length
    }
  };
};

/**
 * Search implementations by keyword
 * @param {string} keyword - Search keyword
 * @returns {Array} Array of matching implementation objects
 */
export const searchImplementations = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return ALL_JEDI_IMPLEMENTATIONS.filter(impl => 
    impl.client.toLowerCase().includes(lowerKeyword) ||
    impl.industry.toLowerCase().includes(lowerKeyword) ||
    impl.problem.toLowerCase().includes(lowerKeyword) ||
    impl.solution.toLowerCase().includes(lowerKeyword) ||
    impl.technologies.some(tech => tech.toLowerCase().includes(lowerKeyword))
  );
};

/**
 * Get component capabilities by component ID
 * @param {string} componentId - Component ID
 * @returns {Array} Array of capability objects
 */
export const getComponentCapabilities = (componentId) => {
  const component = getJediComponentById(componentId);
  return component ? component.capabilities : null;
};

/**
 * Get component problem description by component ID
 * @param {string} componentId - Component ID
 * @returns {Object|null} Problem object or null if not found
 */
export const getComponentProblem = (componentId) => {
  const component = getJediComponentById(componentId);
  return component ? component.problem : null;
};

/**
 * Get component user experience by component ID
 * @param {string} componentId - Component ID
 * @returns {Object|null} User experience object or null if not found
 */
export const getComponentUserExperience = (componentId) => {
  const component = getJediComponentById(componentId);
  return component ? component.userExperience : null;
};
