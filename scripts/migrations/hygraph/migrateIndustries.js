import { hygraph } from '../../../src/lib/hygraph';
import { 
  GET_INDUSTRY_BY_TITLE,
  CREATE_INDUSTRY 
} from '../../../src/graphql/queries/industries';

const industries = [
  {
    title: "healthcare",
    name: "Healthcare",
    sections: [
      "patient-data-collection",
      "risk-analysis-engine",
      "clinical-decision-support"
    ]
  },
  {
    title: "financial",
    name: "Financial Services",
    sections: [
      "fraud-detection",
      "risk-assessment",
      "market-analysis"
    ]
  }
  // Add more industries as needed
];

const migrateIndustries = async () => {
  console.log('Starting industry migration to Hygraph...');
  
  for (const industry of industries) {
    try {
      // Check if industry already exists
      const { existingIndustry } = await hygraph.request(GET_INDUSTRY_BY_TITLE, {
        title: industry.title
      });

      if (existingIndustry) {
        console.log(`Industry ${industry.name} already exists, skipping...`);
        continue;
      }

      // Create new industry
      const result = await hygraph.request(CREATE_INDUSTRY, industry);
      
      console.log(`Successfully migrated industry: ${industry.name}`);
    } catch (error) {
      console.error(`Error migrating industry ${industry.name}:`, error);
    }
  }

  console.log('Industry migration completed!');
};

// Run the migration
migrateIndustries().catch(console.error); 