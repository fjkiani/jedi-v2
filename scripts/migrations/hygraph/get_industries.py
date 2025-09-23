import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

HYGRAPH_ENDPOINT = os.getenv('VITE_HYGRAPH_ENDPOINT')
HYGRAPH_TOKEN = os.getenv('VITE_HYGRAPH_TOKEN')

def get_all_industries():
    query = "query GetIndustries { industries { id name slug } }"
    headers = {'Authorization': f'Bearer {HYGRAPH_TOKEN}', 'Content-Type': 'application/json'}
    try:
        response = requests.post(HYGRAPH_ENDPOINT, headers=headers, json={'query': query})
        response.raise_for_status()
        result = response.json()
        if 'errors' in result:
            print(f"GraphQL Errors: {json.dumps(result['errors'], indent=2)}")
            return
        
        print(json.dumps(result.get('data', {}).get('industries', []), indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"HTTP Error: {e}")

if __name__ == "__main__":
    get_all_industries()

