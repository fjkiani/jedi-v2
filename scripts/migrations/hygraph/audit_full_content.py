import os
import json
import logging
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

if not ENDPOINT or not TOKEN:
    logging.error("Hygraph configuration missing in .env file (VITE_HYGRAPH_ENDPOINT, VITE_HYGRAPH_TOKEN)")
    exit(1)

transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={"Authorization": f"Bearer {TOKEN}"},
    verify=True,
    retries=3,
)
# Disable automatic schema fetching to avoid introspection errors
client = Client(transport=transport, fetch_schema_from_transport=False)

def main():
    logging.info("Auditing Hygraph Content (Direct Query)...")

    results = {}

    # 1. Check UseCases (where the "Agents" live)
    try:
        use_cases_query = gql("""
        query GetUseCases {
            useCaseS(first: 10) {
                id
                title
                slug
                description
                capabilities
                metrics
                architecture {
                    description
                    components {
                        name
                        description
                    }
                    flow {
                        step
                        description
                    }
                }
            }
        }
        """)
        logging.info("Fetching UseCases (useCaseS)...")
        uc_result = client.execute(use_cases_query)
        results["useCases"] = uc_result.get("useCaseS", [])
        logging.info(f"Found {len(results['useCases'])} UseCases.")
    except Exception as e:
        logging.error(f"Failed to fetch UseCases: {e}")

    # 2. Check JediComponents (The core engines)
    try:
        jedi_query = gql("""
        query GetJediComponents {
            jediComponents(first: 10) {
                id
                name
                slug
                tagline
                parentEngine
            }
        }
        """)
        logging.info("Fetching JediComponents...")
        jc_result = client.execute(jedi_query)
        results["jediComponents"] = jc_result.get("jediComponents", [])
        logging.info(f"Found {len(results['jediComponents'])} JediComponents.")
    except Exception as e:
         logging.error(f"Failed to fetch JediComponents: {e}")

    # 3. Check Industries (Context)
    try:
        ind_query = gql("""
        query GetIndustries {
            industries(first: 10) {
                id
                name
                slug
                # solutions { title }  # Removing solutions for now as it failed
            }
        }
        """)
        logging.info("Fetching Industries...")
        ind_result = client.execute(ind_query)
        results["industries"] = ind_result.get("industries", [])
        logging.info(f"Found {len(results['industries'])} Industries.")
    except Exception as e:
        logging.error(f"Failed to fetch Industries: {e}")

    # Output results
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
