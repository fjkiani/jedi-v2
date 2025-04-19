import os
import logging
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

# --- Industries to Ensure Exist ---
# REMOVED 'description', ADDED 'sections' with a default value
INDUSTRIES_DATA = [
    {"name": "Healthcare", "slug": "healthcare", "sections": ["Overview"]},
    {"name": "Financial Services", "slug": "financial-services", "sections": ["Overview"]},
    {"name": "Technology", "slug": "technology", "sections": ["Overview"]},
    {"name": "Retail", "slug": "retail", "sections": ["Overview"]},
    {"name": "Manufacturing", "slug": "manufacturing", "sections": ["Overview"]},
    {"name": "Energy", "slug": "energy", "sections": ["Overview"]},
    {"name": "Education", "slug": "education", "sections": ["Overview"]},
    {"name": "Media & Entertainment", "slug": "media-entertainment", "sections": ["Overview"]},
    {"name": "Telecommunications", "slug": "telecommunications", "sections": ["Overview"]},
    {"name": "Transportation & Logistics", "slug": "transportation-logistics", "sections": ["Overview"]},
    {"name": "Real Estate & Construction", "slug": "real-estate-construction", "sections": ["Overview"]},
    {"name": "Government & Public Sector", "slug": "government-public-sector", "sections": ["Overview"]},
    {"name": "Hospitality & Tourism", "slug": "hospitality-tourism", "sections": ["Overview"]},
]

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

# --- GraphQL Definitions ---
GET_INDUSTRY_BY_SLUG_QUERY = gql("""
  query GetIndustryBySlug($slug: String!) {
    industries(where: { slug: $slug }, stage: DRAFT) {
      id
      name
    }
  }
""")

CREATE_INDUSTRY_MUTATION = gql("""
  mutation CreateIndustry($name: String!, $slug: String!, $sections: [String!]!) {
    createIndustry(data: { name: $name, slug: $slug, sections: $sections }) {
      id
      name
      slug
      sections
    }
  }
""")

PUBLISH_INDUSTRY_MUTATION = gql("""
  mutation PublishIndustry($id: ID!) {
    publishIndustry(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
""")


# --- Main Logic ---
def main():
    logging.info("Starting industry migration script...")
    created_count = 0
    skipped_count = 0
    published_count = 0
    failed_create_count = 0
    failed_publish_count = 0

    for industry_data in INDUSTRIES_DATA:
        slug = industry_data["slug"]
        name = industry_data["name"]
        logging.info(f"Processing industry: '{name}' (slug: {slug})")

        # 1. Check if industry already exists in DRAFT stage
        try:
            existing = client.execute(GET_INDUSTRY_BY_SLUG_QUERY, variable_values={"slug": slug})
            if existing.get("industries") and len(existing["industries"]) > 0:
                logging.info(f"  Industry with slug '{slug}' already exists (ID: {existing['industries'][0]['id']}). Skipping creation.")
                skipped_count += 1
                continue # Move to the next industry
        except Exception as e:
            logging.error(f"  Error checking for existing industry '{slug}': {e}")
            continue

        # 2. Create industry if it doesn't exist
        try:
            logging.info(f"  Creating industry '{name}'...")
            create_result = client.execute(CREATE_INDUSTRY_MUTATION, variable_values=industry_data)
            if create_result and create_result.get("createIndustry"):
                created_id = create_result["createIndustry"]["id"]
                logging.info(f"    Successfully created industry '{name}' with ID: {created_id}")
                created_count += 1

                # 3. Publish the newly created industry
                try:
                    logging.info(f"    Publishing industry '{name}' (ID: {created_id})...")
                    publish_result = client.execute(PUBLISH_INDUSTRY_MUTATION, variable_values={"id": created_id})
                    if publish_result and publish_result.get("publishIndustry"):
                         logging.info(f"      Successfully published industry '{name}'.")
                         published_count +=1
                    else:
                         logging.warning(f"      Failed to publish industry '{name}'. Response: {publish_result}")
                         failed_publish_count += 1
                except Exception as e:
                    logging.error(f"    Error publishing industry with ID '{created_id}': {e}")
                    failed_publish_count += 1

            else:
                error_message = "Unknown error"
                if create_result and create_result.get('errors'):
                    error_message = create_result['errors'][0].get('message', error_message)
                elif isinstance(create_result, dict) and create_result.get('errors'):
                     error_message = create_result['errors'][0].get('message', error_message)
                logging.error(f"  Failed to create industry '{name}'. Error: {error_message}")
                failed_create_count += 1

        except Exception as e:
            logging.error(f"  Error creating industry '{slug}': {e}")
            failed_create_count += 1

    logging.info("Industry migration finished.")
    logging.info(f"Summary: Skipped={skipped_count}, Created={created_count}, Published={published_count}, CreateFailed={failed_create_count}, PublishFailed={failed_publish_count}")

if __name__ == "__main__":
    main()
