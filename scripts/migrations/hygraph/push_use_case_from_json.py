#!/usr/bin/env python3
"""
Push a single use case from extracted page JSON (--input) to Hygraph.
Reuses the same client setup and mutation patterns as expand_use_cases.py.
Use after industries.py and populate_industry_details.py and populate_industry_applications.py.

Usage: python push_use_case_from_json.py --input path/to/hygraph_page_content_industry_solution.json
"""

import os
import sys
import json
import logging
from dotenv import load_dotenv
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

ENDPOINT = os.getenv("VITE_HYGRAPH_ENDPOINT")
TOKEN = os.getenv("VITE_HYGRAPH_TOKEN")
if not ENDPOINT or not TOKEN:
    logging.error("Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN")
    sys.exit(1)

transport = RequestsHTTPTransport(
    url=ENDPOINT,
    headers={"Authorization": f"Bearer {TOKEN}", "gcms-stage": "DRAFT"},
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=False)

GET_INDUSTRY_BY_SLUG = gql("""
  query GetIndustryBySlug($slug: String!) {
    industries(where: { slug: $slug }, stage: DRAFT, first: 1) {
      id
    }
  }
""")

GET_USE_CASE_BY_SLUG = gql("""
  query GetUseCaseBySlug($slug: String!) {
    useCaseS(where: { slug: $slug }, stage: DRAFT, first: 1) {
      id
    }
  }
""")

GET_APP_BY_TITLE = gql("""
  query GetAppByTitle($title: String!) {
    industryApplications(where: { applicationTitle: $title }, stage: DRAFT, first: 1) {
      id
    }
  }
""")

CREATE_USE_CASE = gql("""
  mutation CreateUseCase(
    $title: String!
    $slug: String!
    $description: String!
    $industryId: ID!
    $capabilities: [String!]!
    $queries: [String!]!
    $metrics: [String!]!
    $architectureDescription: String!
    $architectureComponents: [ComponentCreateInput!]!
    $architectureFlow: [FlowStepCreateInput!]!
  ) {
    createUseCase(data: {
      title: $title
      slug: $slug
      description: $description
      industry: { connect: { id: $industryId } }
      capabilities: $capabilities
      queries: $queries
      metrics: $metrics
      architecture: {
        create: {
          description: $architectureDescription
          components: { create: $architectureComponents }
          flow: { create: $architectureFlow }
        }
      }
    }) {
      id
      title
      slug
    }
  }
""")

UPDATE_USE_CASE_CONTENT = gql("""
  mutation UpdateUseCaseContent(
    $id: ID!
    $title: String
    $description: String
    $capabilities: [String!]
    $queries: [String!]
    $metrics: [String!]
    $implementation: Json
  ) {
    updateUseCase(where: { id: $id }, data: {
      title: $title
      description: $description
      capabilities: $capabilities
      queries: $queries
      metrics: $metrics
      implementation: $implementation
    }) {
      id
    }
  }
""")

UPDATE_USE_CASE_APP_LINK = gql("""
  mutation UpdateUseCaseAppLink($id: ID!, $industryApplicationIds: [IndustryApplicationWhereUniqueInput!]!) {
    updateUseCase(where: { id: $id }, data: { industryApplication: { set: $industryApplicationIds } }) {
      id
    }
  }
""")

PUBLISH_USE_CASE = gql("""
  mutation PublishUseCase($id: ID!) {
    publishUseCase(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
""")

def main():
    if "--input" not in sys.argv or sys.argv.index("--input") + 1 >= len(sys.argv):
        logging.error("Usage: python push_use_case_from_json.py --input <path-to-extracted.json>")
        sys.exit(1)
    path = sys.argv[sys.argv.index("--input") + 1]
    with open(path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    uc = payload.get("useCase") or {}
    industry_slug = payload.get("industrySlug") or (payload.get("industry") or {}).get("slug", "")
    solution_slug = uc.get("slug") or payload.get("solutionSlug", "")
    if not solution_slug or not industry_slug:
        logging.error("JSON must have industrySlug and useCase.slug (or solutionSlug)")
        sys.exit(1)

    # Industry ID
    ind_result = client.execute(GET_INDUSTRY_BY_SLUG, variable_values={"slug": industry_slug})
    if not ind_result.get("industries") or len(ind_result["industries"]) == 0:
        logging.error("Industry with slug '%s' not found. Run industries.py --input first.", industry_slug)
        sys.exit(1)
    industry_id = ind_result["industries"][0]["id"]

    # Architecture: use payload when present, else minimal scaffold
    arch = uc.get("architecture") or {}
    arch_desc = arch.get("description") or "Use case implementation."
    raw_components = arch.get("components") or []
    arch_components = [
        {
            "name": c.get("name", "Component"),
            "description": c.get("description", ""),
            "details": c.get("details", ""),
            "explanation": c.get("explanation") if isinstance(c.get("explanation"), list) else [str(c.get("explanation") or "")]
        }
        for c in raw_components
    ]
    if not arch_components:
        arch_components = [{"name": "Core", "description": "Primary component", "details": "Details", "explanation": ["Explanation"]}]
    raw_flow = arch.get("flow") or []
    arch_flow = [
        {"step": str(f.get("step", i + 1)), "description": f.get("description", ""), "details": f.get("details", "")}
        for i, f in enumerate(raw_flow)
    ]
    if not arch_flow:
        arch_flow = [{"step": "1", "description": "Step 1", "details": "Details"}]

    existing = client.execute(GET_USE_CASE_BY_SLUG, variable_values={"slug": solution_slug})
    if existing.get("useCaseS") and len(existing["useCaseS"]) > 0:
        use_case_id = existing["useCaseS"][0]["id"]
        logging.info("Use case exists: %s (id=%s). Updating.", uc.get("title"), use_case_id)
        impl = uc.get("implementation")
        if impl and not isinstance(impl, dict):
            impl = None
        client.execute(UPDATE_USE_CASE_CONTENT, variable_values={
            "id": use_case_id,
            "title": uc.get("title"),
            "description": uc.get("description"),
            "capabilities": uc.get("capabilities") or [],
            "queries": uc.get("queries") or [],
            "metrics": uc.get("metrics") or [],
            "implementation": impl,
        })
    else:
        caps = uc.get("capabilities")
        caps = caps if isinstance(caps, list) else ([] if not caps else [str(caps)])
        queries = uc.get("queries")
        queries = queries if isinstance(queries, list) else ([] if not queries else [str(queries)])
        metrics = uc.get("metrics")
        metrics = metrics if isinstance(metrics, list) else ([] if not metrics else [str(metrics)])
        create_result = client.execute(CREATE_USE_CASE, variable_values={
            "title": uc.get("title", ""),
            "slug": solution_slug,
            "description": uc.get("description", ""),
            "industryId": industry_id,
            "capabilities": caps,
            "queries": queries,
            "metrics": metrics,
            "architectureDescription": arch_desc,
            "architectureComponents": arch_components,
            "architectureFlow": arch_flow,
        })
        if not create_result or not create_result.get("createUseCase"):
            logging.error("Failed to create use case: %s", create_result)
            sys.exit(1)
        use_case_id = create_result["createUseCase"]["id"]
        logging.info("Created use case: %s (id=%s)", uc.get("title"), use_case_id)

    # Link to industry application if present
    app_title = None
    if payload.get("industry", {}).get("industryApplication"):
        app_title = payload["industry"]["industryApplication"][0].get("applicationTitle")
    if app_title:
        app_result = client.execute(GET_APP_BY_TITLE, variable_values={"title": app_title})
        if app_result.get("industryApplications") and len(app_result["industryApplications"]) > 0:
            app_id = app_result["industryApplications"][0]["id"]
            client.execute(UPDATE_USE_CASE_APP_LINK, variable_values={"id": use_case_id, "industryApplicationIds": [{"id": app_id}]})
            logging.info("Linked use case to industry application: %s", app_title)

    client.execute(PUBLISH_USE_CASE, variable_values={"id": use_case_id})
    logging.info("Published use case. URL: /industries/%s/solutions/%s", industry_slug, solution_slug)

if __name__ == "__main__":
    main()
