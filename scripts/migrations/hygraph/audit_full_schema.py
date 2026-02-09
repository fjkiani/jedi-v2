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
client = Client(transport=transport, fetch_schema_from_transport=True)

def main():
    logging.info("Auditing Hygraph Schema and Content...")

    # 1. Introspection (Simplified)
    # We'll just look for specific types we care about based on previous findings
    types_to_check = ["UseCase", "Architecture", "JediComponent", "Technology", "Industry"]
    
    introspection_query = gql("""
    query IntrospectSchema {
      __schema {
        types {
          name
          kind
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
    """)

    try:
        schema_result = client.execute(introspection_query)
        all_types = schema_result['__schema']['types']
        
        found_types = {}
        for t in all_types:
            if t['name'] in types_to_check:
                found_types[t['name']] = t

        logging.info(f"Found {len(found_types)} of {len(types_to_check)} target types.")
        
        # 2. Content Audit
        # Fetch actual data for these types
        
        content_audit = {}
        
        if "UseCase" in found_types:
            use_cases_query = gql("""
            query GetUseCases {
                useCases(first: 10) {
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
            use_cases = client.execute(use_cases_query)
            content_audit["useCases"] = use_cases.get("useCases", [])
            
        if "JediComponent" in found_types:
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
            jedi_components = client.execute(jedi_query)
            content_audit["jediComponents"] = jedi_components.get("jediComponents", [])

        # Dump to file
        output = {
            "schema_summary": found_types,
            "content_sample": content_audit
        }
        
        with open("hygraph_audit_report.json", "w") as f:
            json.dump(output, f, indent=2)
            
        logging.info("Audit complete. Report saved to hygraph_audit_report.json")
        print(json.dumps(content_audit, indent=2))

    except Exception as e:
        logging.error(f"Error during audit: {e}")

if __name__ == "__main__":
    main()
