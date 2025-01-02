import { hygraph } from '../../../src/lib/hygraph';
import { technologyRegistry, TECH_CATEGORIES } from '../../../src/constants/registry/technologyRegistry';
import { 
  GET_TECHNOLOGY_BY_SLUG, 
  CREATE_TECHNOLOGY 
} from '../../../src/graphql/queries/technologies';
import {
  GET_INDUSTRY_BY_TITLE,
  CREATE_INDUSTRY_TECHNOLOGY_RELATION
} from '../../../src/graphql/queries/industries';

const formatTechnologyData = (tech) => {
  return {
    name: tech.name,
    slug: tech.slug,
    description: tech.description,
    icon: {
      upload: tech.icon.type === "LOCAL" ? tech.icon.path : null,
      url: tech.icon.type === "CDN" ? tech.icon.url : null
    },
    iconType: tech.icon.type,
    iconPath: tech.icon.path,
    iconUrl: tech.icon.url,
    category: tech.category,
    subcategories: tech.subcategories,
    services: tech.services,
    primaryUses: tech.details.primaryUses,
    metrics: JSON.stringify(tech.details.metrics),
    deployment: JSON.stringify(tech.details.deployment),
    compatibleWith: tech.integration.compatibleWith,
    apis: tech.integration.apis,
    documentation: tech.resources.documentation,
    github: tech.resources.github,
    website: tech.resources.website
  };
};

const linkTechnologyToIndustry = async (techId, industries) => {
  for (const industryTitle of industries) {
    try {
      // Get industry by title
      const { industry } = await hygraph.request(GET_INDUSTRY_BY_TITLE, {
        title: industryTitle.toLowerCase()
      });

      if (!industry) {
        console.log(`Industry ${industryTitle} not found, skipping...`);
        continue;
      }

      // Create relation between industry and technology
      await hygraph.request(CREATE_INDUSTRY_TECHNOLOGY_RELATION, {
        industryId: industry.id,
        technologyId: techId
      });

      console.log(`Linked technology to industry: ${industryTitle}`);
    } catch (error) {
      console.error(`Error linking technology to industry ${industryTitle}:`, error);
    }
  }
};

const migrateToHygraph = async () => {
  console.log('Starting migration to Hygraph...');
  
  for (const [id, tech] of Object.entries(technologyRegistry)) {
    try {
      // Check if technology already exists
      const { technology } = await hygraph.request(GET_TECHNOLOGY_BY_SLUG, {
        slug: tech.slug
      });

      if (technology) {
        console.log(`Technology ${tech.name} already exists, skipping...`);
        continue;
      }

      // Format the technology data
      const formattedTech = formatTechnologyData(tech);

      // Create new technology
      const result = await hygraph.request(CREATE_TECHNOLOGY, formattedTech);
      
      // Link technology to industries based on use cases
      const industries = tech.details.useCases.map(useCase => 
        useCase.relatedSolution.split('-')[0]
      );
      await linkTechnologyToIndustry(result.createTechnology.id, [...new Set(industries)]);

      console.log(`Successfully migrated ${tech.name}`);
    } catch (error) {
      console.error(`Error migrating ${tech.name}:`, error);
    }
  }

  console.log('Migration completed!');
};

// Run the migration
migrateToHygraph().catch(console.error); 