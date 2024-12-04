import { financial } from './financial';
import { healthcare } from './healthcare';
import { manufacturing } from './manufacturing';
import { retail } from './retail';

// Export individual industries
export { financial, healthcare, manufacturing, retail };

// Export as a collection
export const industries = {
  financial,
  healthcare,
  manufacturing,
  retail
};

// Export as a list for mapping
export const industriesList = Object.values(industries);

// Export industry IDs for routing
export const industryIds = Object.keys(industries);
