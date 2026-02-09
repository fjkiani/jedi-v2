#!/usr/bin/env python3
"""
Omni Agent Creation Script (The Mothership)

Role: Universal Agent Orchestrator & MCP Hub
Mission: Coordinating the federation of vertical AI agents.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

HYGRAPH_ENDPOINT = os.getenv('VITE_HYGRAPH_ENDPOINT')
HYGRAPH_TOKEN = os.getenv('VITE_HYGRAPH_TOKEN')

if not HYGRAPH_ENDPOINT or not HYGRAPH_TOKEN:
    print("Error: credentials missing")
    sys.exit(1)

def execute(query, variables=None):
    headers = {'Authorization': f'Bearer {HYGRAPH_TOKEN}'}
    resp = requests.post(HYGRAPH_ENDPOINT, headers=headers, json={'query': query, 'variables': variables or {}})
    if resp.status_code != 200: return None
    return resp.json().get('data')

def get_industry_id(slug):
    res = execute('query { industries(stage: PUBLISHED) { id slug } }')
    return next((i['id'] for i in res['industries'] if i['slug'] == slug), None)

def create_omni():
    print("🚀 Creating Omni Agent...")
    ind_id = get_industry_id("technology")
    
    components = [
        {
            "name": "MCP Server Registry",
            "description": "Dynamic tool discovery system",
            "details": "A decentralized registry of Model Context Protocol (MCP) servers. Allows agents to discover and bind tools (GitHub, Slack, PostgreSQL) at runtime without code changes.",
            "explanation": ["Tool Auto-Discovery", "Protocol Handshake", "Security Sandboxing"]
        },
        {
            "name": "Federated Model Router",
            "description": "Intelligent inference routing",
            "details": "Routes user queries to the optimal Large Language Model (LLM) based on complexity, cost, and latency requirements. Supports Claude 3.5, GPT-4o, and local Llama 3 models.",
            "explanation": ["Cost/Latency Optimization", "Model Fallback", "Token Usage Tracking"]
        },
        {
            "name": "Context Window Manager",
            "description": "Long-term memory optimization",
            "details": "Manages the context window by summarizing past interactions and retrieving relevant memories via RAG (Retrieval Augmented Generation). Prevents context overflow.",
            "explanation": ["Semantic Compression", "RAG Retrieval", "Session Persistence"]
        }
    ]

    flow = [
        {"step": "1", "description": "Intent Recognition", "details": "Omni analyzes the user request to determine intent and required tools."},
        {"step": "2", "description": "Tool Binding", "details": "Dynamically connects to relevant MCP servers (e.g., GitHub for code, Linear for tasks)."},
        {"step": "3", "description": "Orchestration", "details": "Decomposes the task into sub-tasks and assigns them to specialized agents."},
        {"step": "4", "description": "Execution", "details": "Agents execute actions and return results to the shared context."},
        {"step": "5", "description": "Synthesis", "details": "Omni synthesizes the final response and updates long-term memory."}
    ]

    mutation = """
    mutation CreateOmni($title: String!, $slug: String!, $desc: String!, $indId: ID!, $comps: [ComponentCreateInput!]!, $flow: [FlowStepCreateInput!]!) {
        createUseCase(data: {
            title: $title
            slug: $slug
            description: $desc
            capabilities: ["Model Context Protocol", "Multi-Agent Orchestration", "Universal API", "Tool Abstraction"]
            metrics: ["100+ Compatible Tools", "50ms Routing Latency", "Zero-Code Integration"]
            queries: ["Deploy the GitHub MCP server.", "Switch context to the 'Oncology' project.", "Route this query to the most cost-effective model.", "List all active tool connections."]
            industry: { connect: { id: $indId } }
            architecture: {
                create: {
                    description: "Omni uses a hub-and-spoke architecture where the central orchestrator manages a constellation of MCP servers and model endpoints."
                    components: { create: $comps }
                    flow: { create: $flow }
                }
            }
        }) { id title }
    }
    """

    vars = {
        "title": "Omni: The Agent Mothership",
        "slug": "omni-agent-mothership",
        "desc": "The central nervous system for vertical AI agents. Omni orchestrates tools, manages context windows, and routes complex queries across a federation of specialized models. Built on the Model Context Protocol (MCP), it serves as the universal adapter between AI logic and real-world infrastructure.",
        "indId": ind_id,
        "comps": components,
        "flow": flow
    }

    res = execute(mutation, vars)
    if res:
        print(f"✅ Created {res['createUseCase']['title']}")
        return res['createUseCase']['id']
    else:
        print("❌ Failed (Omni likely exists)")
        return None

if __name__ == "__main__":
    uid = create_omni()
    if uid:
        execute("mutation Pub($id: ID!) { publishUseCase(where: { id: $id }) { id } }", {"id": uid})
        print("✅ Published Omni")
