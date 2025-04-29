import os
import logging
import json
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from graphql import GraphQLError

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logging.error("Hygraph configuration missing in .env file (VITE_HYGRAPH_ENDPOINT, VITE_HYGRAPH_TOKEN)")
    exit(1)

# --- GraphQL Client Setup ---
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "gcms-stage": "DRAFT" # Mutate the DRAFT stage
    },
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

# --- Data to Populate ---
# Define the component data here.
# Use the exact field names (API IDs) from your Hygraph schema.
# For Rich Text, provide the 'raw' object structure.
# For relations (technologySubcategories), provide a list of slugs.

JEDI_COMPONENTS_DATA = {
    # AI Analysis Engine Components
    "jedi-ensemble": {
        "name": "JEDI Ensemble™",
        "parentEngine": "aiAnalysisEngine",
        "tagline": "Advanced ML fusion for superior predictive power.",
        "description": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Combines multiple machine learning models (e.g., Random Forest, XGBoost, Deep Learning) using sophisticated fusion techniques to achieve higher accuracy and robustness than single models alone, particularly effective on complex, high-dimensional datasets."}]}
                ]
            }
        },
        "implementationHighlights": [
           "Leverages frameworks like TensorFlow, PyTorch, and scikit-learn."
        ],
        "technologySubcategorySlugs": ["model-training"] # Example slug
    },
    "jedi-autotune": {
        "name": "JEDI AutoTune™",
        "parentEngine": "aiAnalysisEngine",
        "tagline": "Automated feature engineering and model optimization.",
        "description": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Streamlines the model development lifecycle by automatically engineering relevant features and tuning hyperparameters for optimal performance, reducing manual effort and ensuring models stay effective."}]}
                ]
            }
        },
        "implementationHighlights": [
            "Integrates with MLflow for experiment tracking."
        ],
        "technologySubcategorySlugs": ["model-training", "automation-tools"] # Example slugs
    },
    # Decision Engine Components
    "jedi-rules": {
        "name": "JEDI Rules™",
        "parentEngine": "decisionEngine",
        "tagline": "Dynamic rule engine with real-time updates.",
        "description": {
            "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "A flexible and powerful rule engine enabling dynamic business logic execution. Supports real-time updates and complex condition evaluation for automated decision-making."}]}
                ]
            }
        },
        "implementationHighlights": [
            "Built on Drools."
        ],
        "technologySubcategorySlugs": ["rule-engines"] # Example slug - create if needed
    },
    # Core Products
    "proteinbind": {
        "name": "ProteinBind",
        "parentEngine": "coreProduct",
        "tagline": "AI-powered molecular simulation and binding prediction.",
        "description": {
             "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Accurately simulates molecular interactions to predict protein structures and protein-ligand binding affinity. Key for identifying potential drug targets and performing virtual screening of candidates, significantly reducing wet-lab experimentation time and cost."}]}
                ]
            }
        },
        "implementationHighlights": [],
        "technologySubcategorySlugs": ["molecular-simulation", "drug-discovery"] # Example slugs
    },
    # --- Add data for other components below, updating their parentEngine values similarly ---
    "jedi-deploy": {
        "name": "JEDI Deploy™",
        "parentEngine": "deploymentMonitoring", # Assuming this is the correct API ID
        "tagline": "Streamlined deployment for AI/ML models.",
        "description": {
             "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Manages the deployment lifecycle of machine learning models across various environments (cloud, on-premise, edge). Ensures smooth transitions from development to production with automated workflows."}]}
                ]
            }
        },
        "implementationHighlights": [
            "Integrates with Kubernetes and KubeFlow.",
            "Supports containerization using Docker."
        ],
        "technologySubcategorySlugs": ["deployment", "automation-tools"] # Example slugs
    },
    "jedi-monitor": {
        "name": "JEDI Monitor™",
        "parentEngine": "deploymentMonitoring", # Assuming this is the correct API ID
        "tagline": "Real-time monitoring and performance tracking for AI systems.",
        "description": {
             "raw": {
                "children": [
                    {"type": "paragraph", "children": [{"text": "Provides comprehensive monitoring of deployed AI models, tracking performance metrics, data drift, and operational health in real-time. Includes alerting and automated feedback loops."}]}
                ]
            }
        },
        "implementationHighlights": [
            "Connects with monitoring tools like Prometheus and Grafana.",
            "Features automated drift detection algorithms."
        ],
        "technologySubcategorySlugs": ["monitoring", "automation-tools"] # Example slugs
    },
    # "molmim-renamed": { "parentEngine": "coreProduct", ... },
}

# --- GraphQL Definitions ---
CHECK_COMPONENT_EXISTS_QUERY = gql("""
  query CheckJediComponent($slug: String!) {
    jediComponents(where: { slug: $slug }, stage: DRAFT) {
      id
    }
  } 
""")

# --- RESTORING FULL MUTATION ---
CREATE_JEDI_COMPONENT_MUTATION = gql("""
  mutation CreateJediComponent(
    $name: String!
    $slug: String!
    # --- Using list type and correct Enum name --- 
    $parentEngine: [jediComponents!]
    # --- Adding optional fields back --- 
    $tagline: String
    $description: RichTextAST 
    $implementationHighlights: [String!]
    $subcategoryConnections: [TechnologySubcategoryWhereUniqueInput!]
  ) {
    createJediComponent(
      data: {
        name: $name
        slug: $slug
        parentEngine: $parentEngine
        # --- Adding optional fields back --- 
        tagline: $tagline
        description: $description
        implementationHighlights: $implementationHighlights
        technologySubcategory: { connect: $subcategoryConnections }
      }
    ) {
      id
      slug
      name
      parentEngine # Query back to see format
    }
  }
""")

PUBLISH_JEDI_COMPONENT_MUTATION = gql("""
  mutation PublishJediComponent($id: ID!) {
    publishJediComponent(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
""")

# --- Main Logic ---
def main():
    logging.info("Starting Jedi Component population script...")
    created_count = 0
    published_count = 0
    skipped_count = 0
    failed_create_count = 0
    failed_publish_count = 0

    for slug, details in JEDI_COMPONENTS_DATA.items():
        logging.info(f"Processing component: '{details['name']}' (slug: {slug})")

        # 1. Check if component already exists
        try:
            existing = client.execute(CHECK_COMPONENT_EXISTS_QUERY, variable_values={"slug": slug})
            if existing.get("jediComponents") and len(existing["jediComponents"]) > 0:
                logging.info(f"  Component with slug '{slug}' already exists (ID: {existing['jediComponents'][0]['id']}). Skipping creation.")
                skipped_count += 1
                continue
        except Exception as e:
            logging.error(f"  Error checking for existing component '{slug}': {e}")
            # Optionally decide if you want to stop or continue on check failure
            continue

        # 2. Prepare variables for FULL creation mutation
        # Format Rich Text fields correctly (pass the raw object)
        desc_raw = details.get("description", {}).get("raw")
        # Get implementationHighlights directly as a list
        impl_highlights = details.get("implementationHighlights", []) # Default to empty list
        # Format subcategory connections
        subcat_slugs = details.get("technologySubcategorySlugs", [])
        # IMPORTANT: Verify TechnologySubcategoryWhereUniqueInput is the correct type!
        # It might need to be { where: { slug: s } } depending on Hygraph version/setup
        subcategory_connections = [{"slug": s} for s in subcat_slugs]
        # Prepare parentEngine value - wrap it in a list
        parent_engine_value = details.get("parentEngine")
        parent_engine_list = [parent_engine_value] if parent_engine_value else []

        variables = {
            "name": details["name"],
            "slug": slug,
            "parentEngine": parent_engine_list,
            # --- Adding optional fields back --- 
            "tagline": details.get("tagline"),
            "description": desc_raw, 
            "implementationHighlights": impl_highlights,
            "subcategoryConnections": subcategory_connections
        }
        # Remove keys with None/empty list values
        variables = {k: v for k, v in variables.items() if v is not None and v != []}

        # 3. Create the component
        component_id = None
        try:
            logging.info(f"  Creating component '{details['name']}' (Full Fields)...") # Updated log
            create_result = client.execute(CREATE_JEDI_COMPONENT_MUTATION, variable_values=variables)

            if create_result and create_result.get("createJediComponent"):
                component_id = create_result["createJediComponent"]["id"]
                logging.info(f"    Successfully created component '{details['name']}' with ID: {component_id}")
                created_count += 1
            else:
                 # Handle potential GraphQL errors in the response
                error_message = "Unknown error during creation."
                if isinstance(create_result, dict) and create_result.get('errors'):
                    error_message = create_result['errors'][0].get('message', error_message)
                logging.error(f"    Failed to create component '{details['name']}'. Error: {error_message}")
                logging.debug(f"    Full error details: {create_result.get('errors')}")
                failed_create_count += 1
                continue # Skip publishing if creation failed

        except Exception as e:
            logging.error(f"  Unexpected error creating component '{slug}': {e}")
            # Log more details if available
            if hasattr(e, 'errors'): logging.error(f"    GraphQL Errors: {e.errors}")
            if hasattr(e, 'response'): logging.error(f"    Response Content: {e.response.content}")
            failed_create_count += 1
            continue # Skip publishing if creation failed

        # 4. Publish the newly created component
        if component_id:
            try:
                logging.info(f"    Publishing component '{details['name']}' (ID: {component_id})...")
                publish_result = client.execute(PUBLISH_JEDI_COMPONENT_MUTATION, variable_values={"id": component_id})
                if publish_result and publish_result.get("publishJediComponent"):
                    logging.info(f"      Successfully published component '{details['name']}'.")
                    published_count +=1
                else:
                    logging.warning(f"      Failed to publish component '{details['name']}'. Response: {publish_result}")
                    failed_publish_count += 1
            except Exception as e:
                logging.error(f"    Error publishing component with ID '{component_id}': {e}")
                failed_publish_count += 1

    logging.info("Jedi Component population finished.")
    logging.info(f"Summary: Skipped={skipped_count}, Created={created_count}, Published={published_count}, CreateFailed={failed_create_count}, PublishFailed={failed_publish_count}")

if __name__ == "__main__":
    main() 