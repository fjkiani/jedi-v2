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
    logging.info("Introspecting Mutation fields...")
    
    query = gql("""
    query GetMutationFields {
      __schema {
        mutationType {
          fields {
            name
          }
        }
      }
    }
    """)
    
    try:
        result = client.execute(query)
        fields = [f['name'] for f in result['__schema']['mutationType']['fields']]
        print(json.dumps(fields, indent=2))
    except Exception as e:
        logging.error(f"Error: {e}")

if __name__ == "__main__":
    main()
