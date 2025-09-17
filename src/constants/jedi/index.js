/**
 * JEDI Components - Main Export File
 * 
 * This is the main entry point for all JEDI component data and utilities.
 * Import from this file to access all JEDI components, implementations, and helpers.
 */

// Core JEDI Components
export { JEDI_ENSEMBLE } from './components/ensemble.js';
export { JEDI_RULES } from './components/rules.js';
export { JEDI_AUTOMATE } from './components/automate.js';

// JEDI Implementations
export { ENSEMBLE_IMPLEMENTATIONS } from './implementations/ensemble.js';
export { RULES_IMPLEMENTATIONS } from './implementations/rules.js';
export { AUTOMATE_IMPLEMENTATIONS } from './implementations/automate.js';

// JEDI Architecture
export { JEDI_ARCHITECTURE } from './architecture/index.js';

// Helper Functions
export * from './utils/helpers.js';

// Re-export commonly used constants for convenience
export { ALL_JEDI_COMPONENTS, ALL_JEDI_IMPLEMENTATIONS, getAllJediImplementations } from './utils/helpers.js';

// Legacy support - maintain backward compatibility
export const JEDI_COMPONENTS = {
  ENSEMBLE: () => import('./components/ensemble.js').then(m => m.JEDI_ENSEMBLE),
  RULES: () => import('./components/rules.js').then(m => m.JEDI_RULES),
  AUTOMATE: () => import('./components/automate.js').then(m => m.JEDI_AUTOMATE)
};
