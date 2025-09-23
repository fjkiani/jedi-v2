#!/usr/bin/env python3
"""
Use Case Creation Skeleton Script

This script provides a template for creating a new, comprehensive use case in Hygraph.
Another LLM can be prompted to fill in the # TODO: sections with specific details
for any given industry and use case.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Set the target industry slug for CRM/voice integration
INDUSTRY_SLUG = "technology" 

# Add the project root to Python path for utility imports
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
sys.path.insert(0, project_root)

# Hygraph Configuration from environment variables
HYGRAPH_ENDPOINT = os.getenv('VITE_HYGRAPH_ENDPOINT')
HYGRAPH_TOKEN = os.getenv('VITE_HYGRAPH_TOKEN')

if not HYGRAPH_ENDPOINT or not HYGRAPH_TOKEN:
    print("Error: VITE_HYGRAPH_ENDPOINT and VITE_HYGRAPH_TOKEN environment variables must be set.")
    sys.exit(1)

# --- GraphQL Helper Functions (No changes needed here) ---

def execute_graphql_query(query, variables=None):
    """Execute a GraphQL query against Hygraph"""
    headers = {'Authorization': f'Bearer {HYGRAPH_TOKEN}', 'Content-Type': 'application/json'}
    payload = {'query': query, 'variables': variables or {}}
    
    try:
        response = requests.post(HYGRAPH_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        if 'errors' in result:
            print(f"GraphQL Errors: {json.dumps(result['errors'], indent=2)}")
            return None
        return result.get('data')
    except requests.exceptions.RequestException as e:
        print(f"HTTP Error: {e}")
        return None

def get_industry_id_by_slug(slug):
    """Get industry ID by its URL slug"""
    query = """
    query GetIndustries($slug: String!) {
        industries(where: {slug: $slug}, first: 1) {
            id
            name
        }
    }
    """
    result = execute_graphql_query(query, {"slug": slug})
    if result and result.get('industries') and len(result['industries']) > 0:
        industry = result['industries'][0]
        print(f"✅ Found industry '{industry['name']}' (ID: {industry['id']})")
        return industry['id']
    print(f"❌ Industry not found for slug: {slug}")
    return None

# --- Main Use Case Creation Logic ---

def create_new_use_case():
    """
    Creates the new use case with all its nested data.
    The LLM should fill in the # TODO: sections below.
    """
    
    print(f"🚀 Starting creation for new use case in industry: '{INDUSTRY_SLUG}'...")
    
    industry_id = get_industry_id_by_slug(INDUSTRY_SLUG)
    if not industry_id:
        print(f"❌ Cannot create use case: Industry '{INDUSTRY_SLUG}' not found.")
        return None

    # Technical architecture components for Voice MVP integration
    components_data = [
        {
            "name": "CRM Twilio Integration",
            "description": "Existing production-ready Twilio infrastructure for voice calls and call logging.",
            "details": "Leverages existing twilio_handler.py, CRM Call Log DocType, and webhook handlers. Extended with initiate_outbound_call() and vapi_webhook() endpoints.",
            "explanation": [
                "Production-ready voice infrastructure already exists",
                "Handles call initiation, status updates, and recording management",
                "Integrated with CRM data models and user permissions"
            ]
        },
        {
            "name": "Farfalle Voice Orchestration",
            "description": "FastAPI server that orchestrates voice operations through CRM APIs.",
            "details": "Minimal 193-line server with voice endpoints. Uses CrmClient for authentication and calls existing CRM Twilio endpoints. No duplicate data storage.",
            "explanation": [
                "Thin orchestration layer over existing CRM infrastructure",
                "Provides REST API for voice operations and analytics",
                "Handles authentication and session management with CRM"
            ]
        },
        {
            "name": "Voice Dashboard UI",
            "description": "Vue.js dashboard component integrated into CRM SPA for voice operations monitoring.",
            "details": "678-line Vue component with real-time monitoring, safety controls, analytics display, and debug console. Fetches data through Farfalle endpoints.",
            "explanation": [
                "Real-time voice operations monitoring and control",
                "Safety features including sandbox mode and whitelisted numbers",
                "Integrated directly into existing CRM interface"
            ]
        },
        {
            "name": "Vapi AI Integration",
            "description": "AI voice agent integration for intelligent call handling and transcript processing.",
            "details": "Webhook handler that processes Vapi events, creates FCRM Notes with transcripts, and generates follow-up ToDo tasks. Links to existing CRM Call Log entries.",
            "explanation": [
                "AI-powered call handling and conversation management",
                "Automatic transcript processing and note creation",
                "Intelligent follow-up task generation"
            ]
        }
    ]

    # Voice MVP implementation workflow steps
    flow_steps = [
        {
            "step": "1",
            "description": "Voice Call Initiation",
            "details": "User requests call through Farfalle chat or CRM interface. Farfalle orchestrates call via CRM Twilio API using existing infrastructure. Call is logged in CRM Call Log DocType."
        },
        {
            "step": "2", 
            "description": "AI Agent Processing",
            "details": "Vapi AI agent handles the call conversation. Real-time transcript chunks are processed and buffered. AI provides intelligent responses based on call context and CRM data."
        },
        {
            "step": "3",
            "description": "Call Completion & Logging",
            "details": "Twilio webhooks update call status in CRM. Vapi webhooks create FCRM Notes with call summaries and transcripts. Follow-up ToDo tasks are automatically generated."
        },
        {
            "step": "4",
            "description": "Dashboard Monitoring",
            "details": "Voice Dashboard displays real-time call analytics, active calls, and system health. Safety controls prevent unauthorized calls. Debug console provides operational insights."
        }
    ]

    # The GraphQL mutation for creating the use case and its nested architecture.
    # No changes are needed here; this is the template for the operation.
    create_use_case_mutation = """
    mutation CreateNewUseCase(
        $title: String!, $slug: String!, $description: String!,
        $capabilities: [String!]!, $queries: [String!]!, $metrics: [String!]!,
        $industryId: ID!, $architectureDescription: String!,
        $architectureComponents: [ComponentCreateInput!]!, $architectureFlow: [FlowStepCreateInput!]!,
        $implementation: Json
    ) {
        createUseCase(data: {
            title: $title, slug: $slug, description: $description,
            capabilities: $capabilities, queries: $queries, metrics: $metrics,
            industry: { connect: { id: $industryId } },
            architecture: { create: {
                description: $architectureDescription,
                components: { create: $architectureComponents },
                flow: { create: $architectureFlow }
            }},
            implementation: $implementation
        }) { id, title, slug }
    }
    """
    
    # TODO: Fill in all the data for the GraphQL mutation variables.
    # This is the main content that will be displayed on the use case page.
    graphql_data = {
        "title": "Your Use Case Title Here",
        "slug": "your-use-case-slug-here", # should be lowercase and hyphenated
        "description": "A comprehensive, engaging paragraph describing the problem this use case solves and the value it provides.",
        
        "capabilities": [
            "Core capability or feature 1",
            "Core capability or feature 2",
            "Core capability or feature 3",
        ],
        
        "queries": [
            "A sample question a user might ask the co-pilot.",
            "Another sample question.",
        ],
        
        "metrics": [
            "Success Metric 1: A quantifiable result (e.g., '40% reduction in processing time').",
            "Success Metric 2: Another quantifiable result.",
        ],

        # TODO: Provide implementation details as a structured JSON object.
        # This can include requirements, success metrics, and integration points.
        "implementation": {
            "requirements": [
                "Data Source: Access to real-time transaction data stream.",
                "Technical Stack: Kafka, Spark, and a Python-based ML framework.",
                "Team: 1 Data Scientist, 1 Data Engineer."
            ],
            "success_metrics": [
                "Achieve 99.5% fraud detection accuracy.",
                "Reduce false positives by 70%.",
                "Maintain sub-100ms response time for predictions."
            ],
            "integration_points": [
                "Connects to payment gateway API.",
                "Integrates with customer notification service (email/SMS).",
                "Feeds results into a case management system."
            ]
        },
        
        "industryId": industry_id,
        
        "architectureDescription": "A high-level summary of the technical architecture, explaining how the components work together to deliver the solution.",
        "architectureComponents": components_data,
        "architectureFlow": flow_steps
    }
    
    print(f"✅ Data prepared for '{graphql_data['title']}'. Executing mutation...")
    result = execute_graphql_query(create_use_case_mutation, graphql_data)
    
    if result and result.get('createUseCase'):
        use_case = result['createUseCase']
        print(f"✅ Successfully created use case: {use_case['title']} (ID: {use_case['id']})")
        return use_case['id']
    else:
        print("❌ Failed to create use case.")
        return None

def connect_technologies(use_case_id):
    """Connects a list of technologies to the newly created use case."""
    
    # TODO: Provide a list of technology slugs relevant to this use case.
    # These slugs must already exist in your Hygraph 'Technology' model.
    technology_slugs = [
        "your-tech-slug-1",
        "your-tech-slug-2",
        "your-tech-slug-3",
    ]

    if not technology_slugs or "your-tech-slug-1" in technology_slugs:
        print("🟡 Skipping technology connection (no slugs provided).")
        return True

    print(f"🔧 Connecting {len(technology_slugs)} technologies...")

    connect_mutation = """
    mutation ConnectTechnologies($useCaseId: ID!, $slugs: [String!]!) {
        updateUseCase(
            where: { id: $useCaseId }
            data: { technologies: { connect: { where: { slug_in: $slugs } } } }
        ) { id, technologies { name } }
    }
    """
    
    variables = {"useCaseId": use_case_id, "slugs": technology_slugs}
    result = execute_graphql_query(connect_mutation, variables)

    if result and result.get('updateUseCase'):
        connected_count = len(result['updateUseCase']['technologies'])
        print(f"✅ Successfully connected {connected_count} technologies.")
        return True
    else:
        print("❌ Failed to connect technologies.")
        return False

def publish_entity(entity_id, entity_type):
    """Publishes a Hygraph entity (e.g., UseCase) to make it live."""
    
    # Correctly format the entity type for the mutation (e.g., "useCase" -> "UseCase")
    entity_type_capitalized = entity_type[0].upper() + entity_type[1:]
    
    print(f"📢 Publishing {entity_type_capitalized} (ID: {entity_id})...")
    
    publish_mutation = f"""
    mutation PublishEntity($id: ID!) {{
        publish{entity_type_capitalized}(where: {{ id: $id }}) {{
            id
        }}
    }}
    """
    
    result = execute_graphql_query(publish_mutation, {"id": entity_id})
    
    if result and result.get(f'publish{entity_type_capitalized}'):
        print(f"✅ {entity_type_capitalized} published successfully.")
        return True
    else:
        print(f"❌ Failed to publish {entity_type_capitalized}.")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🚀 JEDI Use Case Creation Skeleton Script 🚀")
    print("=" * 60)
    
    try:
        # Step 1: Create the use case with its architecture
        use_case_id = create_new_use_case()
        if not use_case_id:
            return False

        # Step 2: Connect the associated technologies
        tech_success = connect_technologies(use_case_id)
        if not tech_success:
            print("⚠️ Could not connect technologies. Please check slugs and try again.")
            
        # Step 3: Publish the use case to make it live
        publish_success = publish_entity(use_case_id, "useCase")
        
        print("\n" + "=" * 60)
        if publish_success:
            print("🎉 New Use Case Created and Published Successfully! 🎉")
        else:
            print("⚠️ Use case was created but failed to publish. Please publish manually in Hygraph.")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
