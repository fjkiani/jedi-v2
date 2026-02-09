
"""
Jedi Labs - Agent Manifest
This file contains the configuration data for all vertically integrated AI Agents.
Keep this file updated to register new agents into the ecosystem.
"""

AGENTS = [
    {
        "title": "CrisPRO Oncology Co-Pilot",
        "slug": "crispro-oncology-copilot",
        "industry_slug": "healthcare",
        "description": "Revolutionary AI-powered platform trans-forming cancer treatment by empowering clinicians and researchers.",
        "capabilities": ["Deep Data Synthesis", "Genomic Analysis", "CRISPR Design", "Digital Twins"],
        "metrics": ["95% Diagnostic Accuracy", "50% Faster R&D", "40% Cost Reduction"],
        "queries": ["Find trials matching this mutation.", "Design gRNA for EGFR exon 19.", "Simulate efficacy."],
        "architecture": {
            "description": "End-to-end oncology AI architecture.",
            "components": [
                {"name": "EMR Integration Hub", "description": "Unified interface for EMR data.", "details": "Securely fetches patient records via FHIR.", "explanation": ["FHIR", "HL7"]},
                {"name": "Genomic Analysis Engine", "description": "AI for variant effect prediction.", "details": "AlphaFold integration.", "explanation": ["VEP", "AlphaFold"]},
                {"name": "CRISPR Design Assistant", "description": "Automated gRNA optimization.", "details": "Predicts off-target effects.", "explanation": ["DeepCRISPR", "Cas9"]}
            ],
            "flow": [
                {"step": "1", "description": "Data Ingestion", "details": "Collect patient records."},
                {"step": "2", "description": "Genomic Analysis", "details": "Identify variants."},
                {"step": "3", "description": "Treatment Design", "details": "Generate therapy options."}
            ]
        }
    },
    {
        "title": "FrappeBot CRM Agent",
        "slug": "frappebot-crm-agent",
        "industry_slug": "financial-services",
        "description": "The Enterprise CRM Deployment Agent. Domesticates sales pipelines by automating lead ingestion.",
        "capabilities": ["Lead Automation", "WhatsApp API", "Pipeline Management", "Frappe Framework"],
        "metrics": ["40% Lead Velocity", "25% Conversion Rate", "10hr/week Saved"],
        "queries": ["Show pipeline for Q1.", "Draft follow-up for tech sector.", "Update Deal #402."],
        "architecture": {
            "description": "Modular CRM architecture.",
            "components": [
                {"name": "Lead Ingestion Pipeline", "description": "Multi-channel capture.", "details": "Ingests from WhatsApp/Email.", "explanation": ["WhatsApp API", "Email Parsing"]},
                {"name": "Frappe Framework Core", "description": "CRM Backbone.", "details": "Manages schema and API.", "explanation": ["Python/JS", "REST API"]},
                {"name": "Automated Outreach Engine", "description": "Follow-up scheduler.", "details": "Personalized sequences.", "explanation": ["Drip Campaigns", "Sentiment Analysis"]}
            ],
            "flow": [
                {"step": "1", "description": "Lead Capture", "details": "Lead enters via form."},
                {"step": "2", "description": "Enrichment", "details": "AI adds public data."},
                {"step": "3", "description": "Assignment", "details": "Routed to agent."}
            ]
        }
    },
    {
        "title": "Omni: The Agent Mothership",
        "slug": "omni-agent-mothership",
        "industry_slug": "technology",
        "description": "The central nervous system for vertical AI agents. Orchestrates tools and context.",
        "capabilities": ["Model Context Protocol", "Multi-Agent Orchestration", "Universal API"],
        "metrics": ["100+ Tools", "50ms Latency", "Zero-Code Integration"],
        "queries": ["Deploy GitHub MCP.", "Switch to 'Oncology' project.", "Route to cost-effective model."],
        "architecture": {
            "description": "Hub-and-spoke MCP architecture.",
            "components": [
                {"name": "MCP Server Registry", "description": "Tool discovery system.", "details": "Decentralized registry.", "explanation": ["Discovery", "Handshake"]},
                {"name": "Federated Model Router", "description": "Inference routing.", "details": "Routes to optimal LLM.", "explanation": ["Cost/Latency", "Fallback"]},
                {"name": "Context Window Manager", "description": "Memory optimization.", "details": "RAG-based memory.", "explanation": ["Compression", "Persistence"]}
            ],
            "flow": [
                {"step": "1", "description": "Intent Recognition", "details": "Analyze request."},
                {"step": "2", "description": "Tool Binding", "details": "Connect MCP servers."},
                {"step": "3", "description": "Orchestration", "details": "Assign sub-tasks."}
            ]
        }
    }
]
