import { hygraphManagement } from '../../../src/lib/hygraph.js';
import * as dotenv from 'dotenv';

dotenv.config();

const GET_MODELS_QUERY = `
  query {
    models {
      id
      apiId
      displayName
      fields {
        id
        apiId
        displayName
        type
        isList
        relationModel {
          id
          apiId
          displayName
        }
      }
    }
  }
`;

const UPDATE_MODEL_MUTATION = `
  mutation UpdateModel($modelId: ID!, $fields: [ModelFieldInput!]!) {
    updateModel(
      data: {
        id: $modelId
        fields: $fields
      }
    ) {
      id
      apiId
      displayName
      fields {
        id
        apiId
        displayName
        type
      }
    }
  }
`;

const migrateSchema = async () => {
  console.log('Starting schema migration...');

  try {
    const schemaResult = await hygraphManagement.request(GET_MODELS_QUERY);
    console.log('Schema:', JSON.stringify(schemaResult, null, 2));

    const useCaseModel = schemaResult.models.find(model => model.apiId === 'UseCase');
    if (!useCaseModel) {
      throw new Error('UseCase model not found in schema');
    }

    // Update the UseCase model with new fields
    const newFields = [
      { displayName: "Documentation", apiId: "documentation", type: "Relation", relationModel: "Documentation" },
      { displayName: "Case Studies", apiId: "caseStudies", type: "Relation", relationModel: "CaseStudy", isList: true },
      { displayName: "Interactive Examples", apiId: "interactiveExamples", type: "Relation", relationModel: "InteractiveExample", isList: true },
      { displayName: "Technical Details", apiId: "technicalDetails", type: "Json" }
    ];

    try {
      const updateResult = await hygraphManagement.request(UPDATE_MODEL_MUTATION, {
        modelId: useCaseModel.id,
        fields: newFields
      });
      console.log('Updated UseCase model:', JSON.stringify(updateResult, null, 2));
    } catch (error) {
      console.error('Error updating UseCase model:', error);
      throw error;
    }

    console.log('Schema migration completed successfully!');
  } catch (error) {
    console.error('Error during schema migration:', error);
    throw error;
  }
};

// Add main execution
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  migrateSchema()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateSchema }; 