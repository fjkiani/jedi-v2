#!/usr/bin/env python3
"""
FrappeBot CRM Agent Creation Script

Role: Enterprise CRM Deployment Agent
Mission: Automating global trade workflows with intelligent CRM deployment.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Hygraph Configuration
HYGRAPH_ENDPOINT = os.getenv('VITE_HYGRAPH_ENDPOINT')
HYGRAPH_TOKEN = os.getenv('VITE_HYGRAPH_TOKEN')

if not HYGRAPH_ENDPOINT or not HYGRAPH_TOKEN:
    print("Error: VITE_HYGRAPH_ENDPOINT and VITE_HYGRAPH_TOKEN environment variables must be set")
    sys.exit(1)

def execute_graphql_query(query, variables=None):
    headers = {
        'Authorization': f'Bearer {HYGRAPH_TOKEN}',
        'Content-Type': 'application/json'
    }
    payload = {'query': query, 'variables': variables or {}}
    response = requests.post(HYGRAPH_ENDPOINT, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"HTTP Error {response.status_code}: {response.text}")
        return None
    result = response.json()
    if 'errors' in result:
        print(f"GraphQL Errors: {json.dumps(result['errors'], indent=2)}")
        return None
    return result.get('data')

def get_industry_id_by_slug(slug):
    query = """
    query GetIndustries {
        industries(stage: PUBLISHED) {
            id
            slug
        }
    }
    """
    result = execute_graphql_query(query)
    if not result or 'industries' not in result:
        return None
    for industry in result['industries']:
        if industry['slug'] == slug:
            return industry['id']
    return None

def create_frappebot():
    print("🚀 Creating FrappeBot Agent...")
    
    industry_id = get_industry_id_by_slug("financial-services") # Closest match for Enterprise/CRM
    if not industry_id:
        print("❌ Industry not found")
        return None

    # Architecture Components
    components_data = [
        {
            "name": "Lead Ingestion Pipeline",
            "description": "Multi-channel lead capture system",
            "details": "Automatically ingests leads from WhatsApp, Email, Web Forms, and LinkedIn. Uses NLP to parse unstructured text and populate CRM fields.",
            "explanation": ["WhatsApp API Integration", "Email Parsing", "Duplicate Detection"]
        },
        {
            "name": "Frappe Framework Core",
            "description": "The backbone of the CRM system",
            "details": "Built on the robust Frappe Framework, ensuring scalability and extensibility. Manages the database schema, API generation, and user permissions.",
            "explanation": ["Python/JS Stack", "MariaDB/Postgres Support", "REST API Automation"]
        },
        {
            "name": "Automated Outreach Engine",
            "description": "Intelligent follow-up scheduler",
            "details": "Schedules and executes follow-up sequences via Email and WhatsApp based on lead status and engagement. Uses AI to personalize messages.",
            "explanation": ["Drip Campaigns", "Sentiment Analysis", "Optimal Time Prediction"]
        },
        {
            "name": "Deal Flow Orchestrator",
            "description": "Pipeline management automation",
            "details": "Moves deals through stages automatically based on predefined triggers (e.g., contract signed, payment received). Triggers webhooks to external systems.",
            "explanation": ["Stage Transition Logic", "SLA Monitoring", "Webhook Dispatcher"]
        }
    ]

    # Workflow Steps
    flow_steps = [
        {"step": "1", "description": "Lead Capture", "details": "Lead enters system via WhatsApp or Web Form."},
        {"step": "2", "description": "Enrichment & Scoring", "details": "AI enriches profile with public data and scores intent."},
        {"step": "3", "description": "Assignment", "details": "Lead routed to best available agent based on territory/score."},
        {"step": "4", "description": "Nurturing", "details": "Automated sequence offering value (whitepapers, demos)."},
        {"step": "5", "description": "Conversion", "details": "Meeting booked; Deal created in Pipeline."}
    ]

    mutation = """
    mutation CreateFrappeBot($title: String!, $slug: String!, $description: String!, $industryId: ID!, $components: [ComponentCreateInput!]!, $flow: [FlowStepCreateInput!]!) {
        createUseCase(data: {
            title: $title
            slug: $slug
            description: $description
            capabilities: ["Lead Automation", "WhatsApp Business API", "Pipeline Management", "Frappe Framework"]
            metrics: ["40% Increase in Lead Velocity", "25% Higher Conversion Rate", "10hr/week Saved per Agent"]
            queries: ["Show me the lead pipeline for Q1.", "Which leads have not been contacted in 3 days?", "Draft a follow-up email for the tech sector.", "Update the status of Deal #402 to 'Closed Won'."]
            industry: { connect: { id: $industryId } }
            architecture: {
                create: {
                    description: "FrappeBot is built on a modular architecture designed for high-throughput CRM operations."
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
        "title": "FrappeBot CRM Agent",
        "slug": "frappebot-crm-agent", # Unique slug
        "description": "The Enterprise CRM Deployment Agent. FrappeBot domesticates the chaos of sales pipelines by automating lead ingestion, qualification, and routing. Built on the industrial-strength Frappe Framework, it transforms static contact lists into a dynamic, revenue-generating engine.",
        "industryId": industry_id,
        "components": components_data,
        "flow": flow_steps
    }

    result = execute_graphql_query(mutation, variables)
    if result:
        print(f"✅ Created {result['createUseCase']['title']}")
        return result['createUseCase']['id']
    else:
        print("❌ Create failed (likely exists)")
        return None

def main():
    use_case_id = create_frappebot()
    if use_case_id:
        # Publish
        publish_mutation = "mutation Pub($id: ID!) { publishUseCase(where: { id: $id }) { id } }"
        execute_graphql_query(publish_mutation, {"id": use_case_id})
        print("✅ Published FrappeBot")

if __name__ == "__main__":
    main()
