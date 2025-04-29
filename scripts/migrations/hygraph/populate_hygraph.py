import os
import json
import logging
from pathlib import Path
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from graphql import GraphQLError

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")
DATA_DIR = Path("data/technologies") # Use pathlib for better path handling

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

client = Client(transport=transport, fetch_schema_from_transport=False) # Set to True if schema introspection is needed

# --- GraphQL Definitions ---

# Query to get Technology ID from slug
GET_TECH_ID_QUERY = gql("""
  query GetTechnologyId($slug: String!) {
    technologyS(where: { slug: $slug }, stage: DRAFT) {
      id
    }
  }
""")

# Mutation to update top-level business metrics (assumes businessMetrics is String!)
UPDATE_TECH_METRICS_MUTATION = gql("""
  mutation AddBusinessMetrics($techId: ID!, $metricsString: String!) {
    updateTechnology(
      where: { id: $techId }
      data: { businessMetrics: $metricsString }
    ) {
      id
      businessMetrics
    }
  }
""")

# Mutation to add a Use Case with nested Architecture, Components, Flow
# Note: This assumes your Hygraph schema matches this structure exactly. Adjust if needed.
# It returns the ID and title of the created use case.
ADD_USE_CASE_MUTATION = gql("""
  mutation AddUseCaseDeep(
    $techId: ID!
    $title: String!
    $description: String!
    $industryId: ID # Optional: Connect by ID
    $queries: [String!]!
    $capabilities: [String!]!
    $architectureData: ArchitectureCreateInput!
  ) {
    updateTechnology(
      where: { id: $techId }
      data: {
        useCases: {
          create: [
            {
              title: $title
              description: $description
              industry: { connect: { id: $industryId } } # Connect if ID provided
              queries: $queries
              capabilities: $capabilities
              architecture: { create: $architectureData }
            }
          ]
        }
      }
    ) {
      id # Tech ID
      useCases(last: 1) { # Get the most recently created use case
        id
        title
      }
    }
  }
""")

# Mutation to update Use Case details (implementation JSON, metrics list)
UPDATE_USE_CASE_DETAILS_MUTATION = gql("""
  mutation AddUseCaseDetails($useCaseId: ID!, $implementationData: Json!, $metricsList: [String!]!) {
    updateUseCase(
      where: { id: $useCaseId }
      data: {
        implementation: $implementationData,
        metrics: $metricsList
      }
    ) {
      id
      title
      implementation
      metrics
    }
  }
""")


# --- Helper Functions ---
def run_query(query, variables=None):
    """Executes a GraphQL query and returns the result."""
    try:
        logging.debug(f"Running query with variables: {variables}")
        result = client.execute(query, variable_values=variables)
        logging.debug(f"Query result: {result}")
        return result
    except Exception as e: # Catch broader exceptions including network errors
        logging.error(f"Error executing query: {e}")
        if hasattr(e, 'response') and hasattr(e.response, 'json'):
             logging.error(f"Response body: {e.response.json()}")
        elif hasattr(e, 'errors'):
             logging.error(f"GraphQL Errors: {e.errors}")
        return None # Indicate failure

def run_mutation(mutation, variables=None):
    """Executes a GraphQL mutation and returns the result."""
    try:
        logging.debug(f"Running mutation with variables: {variables}")
        result = client.execute(mutation, variable_values=variables)
        logging.debug(f"Mutation result: {result}")
        return result
    except Exception as e: # Catch broader exceptions
        logging.error(f"Error executing mutation: {e}")
        if hasattr(e, 'response') and hasattr(e.response, 'json'):
             logging.error(f"Response body: {e.response.json()}")
        elif hasattr(e, 'errors'):
             logging.error(f"GraphQL Errors: {e.errors}")
        return None # Indicate failure

# --- Main Processing Logic ---
def process_technology_file(filepath):
    """Processes a single technology JSON file."""
    logging.info(f"Processing {filepath.name}...")
    try:
        with open(filepath, 'r') as f:
            tech_data = json.load(f)
    except json.JSONDecodeError:
        logging.error(f"Invalid JSON in {filepath.name}. Skipping.")
        return
    except Exception as e:
        logging.error(f"Error reading {filepath.name}: {e}. Skipping.")
        return

    # 1. Get Technology ID
    tech_slug = tech_data.get("technologySlug")
    if not tech_slug:
        logging.warning(f"Missing 'technologySlug' in {filepath.name}. Skipping.")
        return

    tech_id_result = run_query(GET_TECH_ID_QUERY, {"slug": tech_slug})
    if not tech_id_result or not tech_id_result.get('technologyS') or not tech_id_result['technologyS'][0].get('id'):
        logging.error(f"Could not find Technology ID for slug '{tech_slug}' in Hygraph (DRAFT stage). Skipping.")
        return
    tech_id = tech_id_result['technologyS'][0]['id']
    logging.info(f"  Found Technology ID: {tech_id} for slug: {tech_slug}")

    # 2. Update Top-Level Business Metrics (if present)
    if "businessMetrics" in tech_data and tech_data["businessMetrics"]:
        logging.info(f"  Updating business metrics for {tech_slug}...")
        metrics_result = run_mutation(UPDATE_TECH_METRICS_MUTATION, {
            "techId": tech_id,
            "metricsString": tech_data["businessMetrics"]
        })
        if metrics_result:
            logging.info(f"    Successfully updated business metrics.")
        else:
            logging.warning(f"    Failed to update business metrics.")

    # 3. Process Use Cases
    for uc_index, uc_data in enumerate(tech_data.get("useCases", [])):
        logging.info(f"  Processing Use Case #{uc_index + 1}: '{uc_data.get('title', 'N/A')}'")

        # --- Prepare Architecture Data ---
        # This needs careful mapping from your JSON structure to the Hygraph input type
        # TechnologyuseCasesArchitectureCreateInput!
        arch_input = uc_data.get("architecture", {})
        components_create = [
            {
                "name": comp.get("name"),
                "description": comp.get("description"),
                "details": comp.get("details"),
                # Ensure 'explanation' is a list of strings, handle if missing/null
                "explanation": [str(exp) for exp in comp.get("explanation", []) if exp is not None]
            } for comp in arch_input.get("components", [])
        ]
        flow_create = [
            {
                "step": step.get("step"),
                "description": step.get("description"),
                "details": step.get("details")
            } for step in arch_input.get("flow", [])
        ]
        architecture_data = {
            "description": arch_input.get("description"),
            "components": {"create": components_create},
            "flow": {"create": flow_create}
        }

        # --- Prepare Variables for AddUseCaseDeep ---
        add_uc_vars = {
            "techId": tech_id,
            "title": uc_data.get("title"),
            "description": uc_data.get("description"),
            "industryId": uc_data.get("industryId"), # Will be null if missing in JSON
            "queries": uc_data.get("queries", []),
            "capabilities": uc_data.get("capabilities", []),
            "architectureData": architecture_data
        }
        # Filter out None values for optional fields if necessary for your schema strictness
        add_uc_vars = {k: v for k, v in add_uc_vars.items() if v is not None}


        # --- Execute AddUseCaseDeep Mutation ---
        logging.info(f"    Creating use case and nested architecture...")
        add_uc_result = run_mutation(ADD_USE_CASE_MUTATION, add_uc_vars)

        if not add_uc_result or not add_uc_result.get('updateTechnology') or not add_uc_result['updateTechnology'].get('useCases'):
            logging.error(f"    Failed to create use case '{uc_data.get('title')}'. Check mutation response/logs.")
            continue # Skip to next use case

        # --- Extract Created Use Case ID ---
        # Assumes the mutation returns the *last* created use case
        created_uc_list = add_uc_result['updateTechnology']['useCases']
        if not created_uc_list:
             logging.error(f"    Mutation succeeded but no use case ID returned for '{uc_data.get('title')}'.")
             continue
        created_uc_id = created_uc_list[0].get('id')
        created_uc_title = created_uc_list[0].get('title') # For confirmation log
        logging.info(f"    Successfully created Use Case '{created_uc_title}' with ID: {created_uc_id}")


        # --- Update Use Case Details (Implementation, Metrics) ---
        implementation_data = uc_data.get("implementation", {})
        metrics_list = uc_data.get("metrics", [])

        if implementation_data or metrics_list:
             logging.info(f"    Updating details for Use Case ID: {created_uc_id}")
             details_vars = {
                 "useCaseId": created_uc_id,
                 "implementationData": implementation_data, # Send empty dict if missing
                 "metricsList": metrics_list # Send empty list if missing
             }
             details_result = run_mutation(UPDATE_USE_CASE_DETAILS_MUTATION, details_vars)
             if details_result:
                 logging.info(f"      Successfully updated details.")
             else:
                 logging.warning(f"      Failed to update details.")
        else:
             logging.info(f"    No implementation or metrics data found in JSON for this use case.")


def main():
    """Main function to iterate through files and process them."""
    logging.info("Starting Hygraph population script...")
    if not DATA_DIR.is_dir():
        logging.error(f"Data directory not found: {DATA_DIR}")
        return

    for filepath in DATA_DIR.glob("*.json"):
        process_technology_file(filepath)

    logging.info("Script finished.")

if __name__ == "__main__":
    main()