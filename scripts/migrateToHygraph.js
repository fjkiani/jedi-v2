import { hygraph } from '../src/lib/hygraph';
import { migrateIndustries } from './migrations/hygraph/migrateIndustries';
import { migrateTechnologies } from './migrations/hygraph/migrateTechnologies';
import { migrateSolutions } from './migrations/hygraph/migrateSolutions';

const migrateToHygraph = async () => {
  console.log('Starting migration to Hygraph...');
  
  try {
    // First migrate industries
    await migrateIndustries();
    
    // Then migrate technologies
    await migrateTechnologies();
    
    // Finally migrate solutions
    await migrateSolutions();
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Run the migration
migrateToHygraph().catch(console.error); 