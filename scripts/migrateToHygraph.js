import { hygraphClient } from '../src/lib/hygraph.js';
import { migrateIndustries } from './migrations/hygraph/migrateIndustries.js';
import { migrateTechnologies } from './migrations/hygraph/migrateTechnologies.js';
import { migrateSolutions } from './migrations/hygraph/migrateSolutions.js';
import { migrateAIAgentUseCases } from './migrations/hygraph/migrateAIAgentUseCases.js';

const migrateToHygraph = async () => {
  console.log('Starting migration to Hygraph...');
  
  try {
    // First migrate industries
    await migrateIndustries();
    
    // Then migrate technologies
    await migrateTechnologies();
    
    // Then migrate solutions
    await migrateSolutions();
    
    // Finally migrate AI agent use cases
    await migrateAIAgentUseCases();
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Run the migration
migrateToHygraph().catch(console.error); 