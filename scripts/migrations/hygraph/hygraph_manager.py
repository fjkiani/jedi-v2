import os
import json
import logging
import requests
from dotenv import load_dotenv

# Setup Logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class HygraphManager:
    def __init__(self):
        load_dotenv()
        self.endpoint = os.getenv('VITE_HYGRAPH_ENDPOINT')
        self.token = os.getenv('VITE_HYGRAPH_TOKEN')
        
        if not self.endpoint or not self.token:
            raise EnvironmentError("❌ Missing Hygraph credentials (.env)")
            
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def execute(self, query, variables=None):
        """Executes a raw GraphQL query."""
        try:
            response = requests.post(
                self.endpoint, 
                headers=self.headers, 
                json={'query': query, 'variables': variables or {}}
            )
            response.raise_for_status()
            result = response.json()
            
            if 'errors' in result:
                logger.error(f"GraphQL Error: {json.dumps(result['errors'], indent=2)}")
                return None
            
            return result.get('data')
        except requests.exceptions.RequestException as e:
            logger.error(f"Network Error: {e}")
            return None

    def get_industry_id(self, slug):
        """Fetches Industry ID by slug."""
        query = """
        query GetIndustry($slug: String!) {
            industries(where: {slug: $slug}, stage: PUBLISHED) {
                id
            }
        }
        """
        data = self.execute(query, {'slug': slug})
        if data and data['industries']:
            return data['industries'][0]['id']
        logger.warning(f"⚠️ Industry '{slug}' not found.")
        return None

    def get_use_case_by_slug(self, slug):
        """Checks if a UseCase exists."""
        query = """
        query GetUseCase($slug: String!) {
            useCase(where: {slug: $slug}) {
                id
                title
            }
        }
        """
        data = self.execute(query, {'slug': slug})
        return data.get('useCase')

    def publish_use_case(self, use_case_id):
        """Publishes a UseCase to make it live."""
        mutation = """
        mutation Publish($id: ID!) {
            publishUseCase(where: { id: $id }) {
                id
                stage
            }
        }
        """
        data = self.execute(mutation, {'id': use_case_id})
        if data:
            logger.info(f"✅ Published Use Case {use_case_id}")
            return True
        return False

    def create_or_update_agent(self, agent_data):
        """
        Main method to sync an Agent (UseCase).
        Currently implements 'Create if not exists', skipping update to avoid complex nested mutations.
        """
        slug = agent_data['slug']
        existing = self.get_use_case_by_slug(slug)
        
        if existing:
            logger.info(f"⚠️ Agent '{agent_data['title']}' ({slug}) already exists. Skipping creation.")
            # In a V2, we would implement an update_use_case mutation here.
            return existing['id']

        industry_id = self.get_industry_id(agent_data['industry_slug'])
        if not industry_id:
            logger.error(f"Cannot create '{agent_data['title']}': Invalid Industry.")
            return None

        logger.info(f"🚀 Creating Agent: {agent_data['title']}...")

        mutation = """
        mutation CreateAgent(
            $title: String!, 
            $slug: String!, 
            $description: String!, 
            $industryId: ID!, 
            $capabilities: [String!]!,
            $metrics: [String!]!,
            $queries: [String!]!,
            $archDesc: String!,
            $components: [ComponentCreateInput!]!, 
            $flow: [FlowStepCreateInput!]!
        ) {
            createUseCase(data: {
                title: $title
                slug: $slug
                description: $description
                capabilities: $capabilities
                metrics: $metrics
                queries: $queries
                industry: { connect: { id: $industryId } }
                architecture: {
                    create: {
                        description: $archDesc
                        components: { create: $components }
                        flow: { create: $flow }
                    }
                }
            }) {
                id
                title
            }
        }
        """
        
        variables = {
            "title": agent_data['title'],
            "slug": slug,
            "description": agent_data['description'],
            "industryId": industry_id,
            "capabilities": agent_data.get('capabilities', []),
            "metrics": agent_data.get('metrics', []),
            "queries": agent_data.get('queries', []),
            "archDesc": agent_data['architecture']['description'],
            "components": agent_data['architecture']['components'],
            "flow": agent_data['architecture']['flow']
        }

        result = self.execute(mutation, variables)
        if result and 'createUseCase' in result:
            use_case_id = result['createUseCase']['id']
            logger.info(f"✅ Created Agent '{agent_data['title']}'")
            self.publish_use_case(use_case_id)
            return use_case_id
        
        logger.error(f"❌ Failed to create '{agent_data['title']}'")
        return None
