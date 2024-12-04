import { techStacks, domainTechStacks, DEFAULT_ICON } from '../constants/techStacks';

export const getNodeIcon = (node, domain) => {
  if (!node.technologies) return DEFAULT_ICON;
  
  try {
    // First try to get from domainTechStacks
    const domainComponents = domainTechStacks[domain]?.components;
    if (domainComponents?.[node.label]?.icon) {
      return domainComponents[node.label].icon;
    }

    // Get first technology and look for its icon
    const firstCategory = Object.keys(node.technologies)[0];
    const firstTech = node.technologies[firstCategory]?.[0];
    
    if (!firstTech) return DEFAULT_ICON;

    // Look through all categories in techStacks for the domain
    const domainTechStack = techStacks[domain];
    if (!domainTechStack) return DEFAULT_ICON;

    for (const category in domainTechStack) {
      const tech = domainTechStack[category]?.[firstTech];
      if (tech?.icon) {
        return tech.icon;
      }
    }

    // If not found in domain-specific stack, try common tech stacks
    for (const stack in techStacks) {
      for (const category in techStacks[stack]) {
        const tech = techStacks[stack][category]?.[firstTech];
        if (tech?.icon) {
          return tech.icon;
        }
      }
    }

    return DEFAULT_ICON;
  } catch (error) {
    console.warn(`Error getting icon for node ${node.label}:`, error);
    return DEFAULT_ICON;
  }
};

export const getNodeTechInfo = (node) => {
  if (!node.technologies) return [];
  return Object.values(node.technologies)
    .flat()
    .slice(0, 2);
}; 