import os
import json
import logging
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv() # Load .env file from the current working directory or parent directories

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logging.error("Hygraph configuration missing in .env file (VITE_HYGRAPH_ENDPOINT, VITE_HYGRAPH_TOKEN)")
    exit(1)

# --- GraphQL Client Setup ---
# Note: We are NOT setting gcms-stage header here,
# relying on the stage specified in the query itself.
transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={
        "Authorization": f"Bearer {TOKEN}"
    },
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

# --- GraphQL Query ---
GET_DATA_QUERY = gql("""
  query GetExistingTechAndIndustries {
    technologies(stage: PUBLISHED, first: 200) {
      id
      name
      slug
    }
    industries(stage: PUBLISHED, first: 100) {
      id
      name
      slug
    }
  }
""")

# --- Main Execution ---
def main():
    logging.info("Querying Hygraph for PUBLISHED Technologies and Industries...")
    try:
        result = client.execute(GET_DATA_QUERY)

        if result:
            logging.info("Query successful. Data:")
            # Pretty print the JSON result
            print(json.dumps(result, indent=2))

            # Optional: Extract maps for easier reference
            tech_map = {t['slug']: t['id'] for t in result.get('technologies', [])}
            industry_map = {i['slug']: i['id'] for i in result.get('industries', [])}

            if tech_map:
                logging.info("\n--- Technology Slug to ID Map ---")
                print(json.dumps(tech_map, indent=2))
            else:
                logging.info("\n--- No published technologies found ---")

            if industry_map:
                logging.info("\n--- Industry Slug to ID Map ---")
                print(json.dumps(industry_map, indent=2))
            else:
                 logging.info("\n--- No published industries found ---")


        else:
            logging.error("Query execution returned no result.")

    except Exception as e:
        logging.error(f"An error occurred during query execution: {e}")
        if hasattr(e, 'errors'):
             logging.error(f"GraphQL Errors: {e.errors}")

if __name__ == "__main__":
    main() 