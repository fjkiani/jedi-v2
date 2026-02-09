import os
import json
import logging
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

logging.basicConfig(level=logging.INFO)
load_dotenv()

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")

transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={"Authorization": f"Bearer {TOKEN}"},
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

def main():
    logging.info("Listing all types in schema...")
    
    # Standard introspection query to get type names
    query = gql("""
    query GetTypes {
      __schema {
        types {
          name
          kind
        }
      }
    }
    """)
    
    try:
        result = client.execute(query)
        types = [t['name'] for t in result['__schema']['types'] if not t['name'].startswith('__') and t['kind'] == 'OBJECT']
        print(json.dumps(types, indent=2))
    except Exception as e:
        logging.error(f"Error: {e}")

if __name__ == "__main__":
    main()
