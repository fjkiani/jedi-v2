#!/usr/bin/env node

/**
 * Enhance TechnologySubcategory entries in Hygraph
 * Fills description, features, additonalDetails for all subcategories. No slop; JEDI where relevant.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

async function makeRequest(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      'gcms-stage': 'DRAFT',
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

const CONTENT = {
  'agent-core': {
    description: 'Agent Core covers frameworks and patterns for building AI agents that reason and use tools. JEDI Labs uses agent-core technologies (e.g. LangChain, ReAct) in JEDI Ensemble™ for voice agents, search optimization, and multi-step workflows.',
    features: 'LLM orchestration, Tool use and function calling, Reasoning patterns (ReAct, CoT), Memory and context, Multi-step planning',
    additonalDetails: 'JEDI applies agent-core patterns in Go Answer voice agents and CrisPRO-style assistants. Technologies in this subcategory power JEDI Ensemble™ orchestration and tool-augmented responses.',
  },
  alerting: {
    description: 'Alerting covers systems that notify teams when metrics or health thresholds are breached. JEDI Labs uses alerting (e.g. PagerDuty, Prometheus alerts) for co-pilot and pipeline reliability so issues are caught quickly.',
    features: 'Threshold and anomaly alerts, Escalation and on-call, Integration with monitoring, Notification channels, SLO-based alerting',
    additonalDetails: 'Alerting is used for ML pipeline and API health so JEDI-backed services meet SLAs and incidents are handled promptly.',
  },
  'analytics-environment': {
    description: 'Analytics Environment covers platforms and tools for data analysis and BI. JEDI Labs uses analytics environments for client reporting and for metrics that feed JEDI AutoTune™ and co-pilot dashboards.',
    features: 'Query and reporting, Dashboards and visualizations, Data exploration, Collaboration and sharing, Integration with warehouses',
    additonalDetails: 'JEDI uses analytics to surface pipeline and model performance and to support client reporting tied to JEDI deployments.',
  },
  'api-data-sources': {
    description: 'API Data Sources are external APIs and services that supply data for pipelines and applications. JEDI Labs integrates API data sources for CRMs, Hygraph, AI providers, and JEDI Rules™ automation.',
    features: 'REST and GraphQL clients, Authentication and rate limits, Webhooks and polling, Data normalization, Error handling and retries',
    additonalDetails: 'API data sources feed lead capture, content, and triggers that keep JEDI-backed systems and co-pilots up to date.',
  },
  authentication: {
    description: 'Authentication covers identity and access control for users and services. JEDI Labs uses authentication (OAuth, OIDC, SAML) for co-pilot, dashboards, and client portals so access is secure and auditable.',
    features: 'SSO and federation, MFA and conditional access, Token and session management, Integration with IdPs, Audit logging',
    additonalDetails: 'Authentication ensures co-pilot and client apps meet enterprise and compliance requirements (e.g. SOC2, HIPAA where applicable).',
  },
  'inference-backend': {
    description: 'Inference Backend covers services and infrastructure for running ML model inference at scale. JEDI Labs uses inference backends (e.g. Ray Serve, Seldon) for custom models that JEDI AutoTune™ and co-pilots call.',
    features: 'Model serving APIs, Batching and autoscaling, Multi-model and versioning, Latency and throughput tuning, GPU and accelerator support',
    additonalDetails: 'JEDI deploys inference backends for client-specific and JEDI AutoTune™ models when off-the-shelf LLM APIs are not sufficient.',
  },
  caching: {
    description: 'Caching covers in-memory and distributed caches for performance and state. JEDI Labs uses caching (e.g. Redis) for co-pilot session state, rate limiting, and pipeline intermediates so responses are fast and costs are controlled.',
    features: 'Key-value and structures, TTL and eviction, Clustering and replication, Integration with apps and APIs, Metrics and hit rates',
    additonalDetails: 'Caching supports JEDI-backed APIs and voice agents by reducing latency and load on databases and external services.',
  },
  'data-ingestion': {
    description: 'Data Ingestion covers tools and pipelines that collect and land data from sources. JEDI Labs uses ingestion (e.g. NiFi, Fivetran) for data that feeds JEDI Ensemble™ knowledge bases and client analytics.',
    features: 'Connectors and adapters, Scheduling and triggers, Schema handling, Error and dead-letter handling, Monitoring and lineage',
    additonalDetails: 'Ingestion pipelines keep JEDI-backed data lakes and knowledge bases current for RAG and analytics.',
  },
  'data-processing': {
    description: 'Data Processing covers batch and streaming transformation of data. JEDI Labs uses data processing (Spark, Flink, Beam) for ETL and feature pipelines that feed JEDI AutoTune™ and client models.',
    features: 'Batch and streaming, Transformation and aggregation, Windowing and state, Scaling and partitioning, Integration with storage',
    additonalDetails: 'Processing pipelines prepare and clean data so JEDI-backed models and co-pilots have reliable inputs.',
  },
  'data-quality': {
    description: 'Data Quality covers validation, testing, and monitoring of data in pipelines. JEDI Labs uses data quality tools (e.g. Great Expectations, Soda) so bad data is caught before it affects JEDI Ensemble™ and models.',
    features: 'Expectations and assertions, Profiling and drift, Checkpoints and alerts, Integration with dbt and Airflow, Reporting and docs',
    additonalDetails: 'Quality checks are applied in pipelines that feed JEDI-backed systems to maintain trust in data and model outputs.',
  },
  'data-sources': {
    description: 'Data Sources covers the types and systems that supply data for AI/ML and analytics. JEDI Labs uses structured, unstructured, and streaming sources for JEDI Ensemble™, CrisPRO, and client pipelines.',
    features: 'Databases and warehouses, Files and object storage, APIs and streams, Schema and catalog, Access and security',
    additonalDetails: 'JEDI connects diverse data sources to knowledge bases, RAG, and analytics that power co-pilots and recommendations.',
  },
  'data-warehousing': {
    description: 'Data Warehousing covers centralized stores for analytics and reporting. JEDI Labs uses warehouses (Snowflake, BigQuery, Redshift) for client analytics and for data that feeds JEDI-backed applications and reporting.',
    features: 'SQL and semantic layer, Partitioning and clustering, Time travel and cloning, ML and UDFs, Integration with BI and pipelines',
    additonalDetails: 'Warehouses support reporting and analytics tied to JEDI deployments and client success metrics.',
  },
  databases: {
    description: 'Databases covers relational, document, and specialized stores for application and pipeline data. JEDI Labs uses PostgreSQL, MongoDB, and others for JEDI Rules™, session state, and metadata that co-pilots and APIs depend on.',
    features: 'ACID and consistency, Query and indexing, Replication and backup, Scaling and sharding, Integration with ORMs and APIs',
    additonalDetails: 'JEDI uses databases for business logic, user data, and pipeline state so solutions are reliable and auditable.',
  },
  'data-deployment': {
    description: 'Data Deployment covers releasing and operating data and ML assets in production. JEDI Labs uses deployment practices and tooling so pipelines and models that feed JEDI-backed systems are versioned and repeatable.',
    features: 'CI/CD for data and models, Environment promotion, Rollback and versioning, Configuration and secrets, Monitoring and health',
    additonalDetails: 'Deployment ensures JEDI pipelines and model endpoints ship safely and stay available for co-pilots and clients.',
  },
  frameworks: {
    description: 'Frameworks covers front-end and application frameworks used to build UIs and services. JEDI Labs uses React, Angular, and others for co-pilot UIs, solution pages, and client dashboards.',
    features: 'Components and state, Routing and data fetching, Testing and tooling, Performance and accessibility, Ecosystem and plugins',
    additonalDetails: 'Frameworks power the web and mobile surfaces that connect users to JEDI co-pilots and solutions.',
  },
  'inference-api': {
    description: 'Inference API covers programmatic access to ML model inference. JEDI Labs uses inference APIs (OpenAI, Anthropic, custom endpoints) via JEDI Ensemble™ for conversational AI, embeddings, and client-specific models.',
    features: 'REST and gRPC, Batching and streaming, Authentication and quotas, Versioning and A/B, Latency and cost optimization',
    additonalDetails: 'Inference APIs are the backbone of JEDI Ensemble™ model selection and co-pilot responses.',
  },
  interfaces: {
    description: 'Interfaces covers user-facing channels and patterns for interacting with AI and systems. JEDI Labs builds chat, voice, and dashboard interfaces that connect users to JEDI co-pilots and solutions.',
    features: 'Chat and voice, Forms and wizards, Dashboards and visualizations, Accessibility and i18n, Real-time and streaming',
    additonalDetails: 'Interfaces are how users experience JEDI Ensemble™ and JEDI Rules™ in co-pilots and client applications.',
  },
  memory: {
    description: 'Memory covers systems and patterns for persisting and retrieving context for agents and applications. JEDI Labs uses memory (vector stores, caches, session state) so co-pilots and agents maintain context across turns.',
    features: 'Short- and long-term context, Vector and semantic retrieval, Session and user scope, Eviction and prioritization, Integration with LLMs',
    additonalDetails: 'Memory enables JEDI Ensemble™ and voice agents to deliver coherent, context-aware responses.',
  },
  'ml-monitoring': {
    description: 'ML Monitoring covers observability for models in production: performance, drift, and quality. JEDI Labs uses ML monitoring (WhyLabs, Evidently, custom) so JEDI AutoTune™ and deployed models stay reliable and actionable.',
    features: 'Data and model drift, Accuracy and latency metrics, A/B and canary, Alerts and retraining triggers, Integration with pipelines',
    additonalDetails: 'ML monitoring ensures JEDI-backed models meet quality and SLA expectations and degrade gracefully when needed.',
  },
  'model-serving': {
    description: 'Model Serving covers deploying and scaling ML models behind APIs. JEDI Labs uses model serving (TorchServe, Seldon, Ray Serve) for custom models that JEDI AutoTune™ and co-pilots call when needed.',
    features: 'REST and gRPC endpoints, Versioning and rollout, Batching and autoscaling, Multi-framework support, Monitoring and metrics',
    additonalDetails: 'Model serving is used for client-specific and fine-tuned models that complement JEDI Ensemble™ LLM orchestration.',
  },
  'model-training': {
    description: 'Model Training covers training and fine-tuning ML models. JEDI Labs uses training pipelines and frameworks (PyTorch, TensorFlow, Hugging Face) for JEDI AutoTune™ and client-specific models.',
    features: 'Distributed and GPU training, Hyperparameter tuning, Experiment tracking, Reproducibility and versioning, Integration with data',
    additonalDetails: 'Training produces models that JEDI AutoTune™ optimizes and that power custom use cases beyond off-the-shelf LLMs.',
  },
  'monitoring-logging': {
    description: 'Monitoring & Logging covers observability for infrastructure, applications, and pipelines. JEDI Labs uses monitoring and logging (Prometheus, Grafana, OpenTelemetry) for co-pilot, APIs, and pipelines in production.',
    features: 'Metrics and dashboards, Log aggregation and search, Tracing and correlation, Alerting and SLOs, Integration with on-call',
    additonalDetails: 'Observability ensures JEDI-backed services are debuggable and meet reliability targets for clients.',
  },
  ontologies: {
    description: 'Ontologies cover formal domain models and taxonomies for knowledge and reasoning. JEDI Labs uses ontologies for CrisPRO and knowledge-backed applications so JEDI Ensemble™ can reason over structured domain knowledge.',
    features: 'Classes and properties, Reasoning and inference, RDF and OWL, Integration with knowledge graphs, Domain modeling',
    additonalDetails: 'Ontologies support structured knowledge in healthcare and other domains where JEDI solutions are deployed.',
  },
  'data-orchestration': {
    description: 'Data Orchestration covers scheduling and coordinating pipelines and workflows. JEDI Labs uses orchestration (Airflow, Prefect, Dagster) for ETL and ML pipelines that feed JEDI Ensemble™ and client data.',
    features: 'DAGs and dependencies, Scheduling and triggers, Retries and alerting, Visibility and lineage, Integration with storage and APIs',
    additonalDetails: 'Orchestration keeps JEDI-backed data and model pipelines running reliably and on schedule.',
  },
  protocols: {
    description: 'Protocols cover standards for communication and auth between systems. JEDI Labs uses HTTP, gRPC, OAuth, and other protocols so co-pilot, APIs, and integrations are interoperable and secure.',
    features: 'REST and GraphQL, gRPC and WebSocket, OAuth and OIDC, API design and versioning, Security and compliance',
    additonalDetails: 'Protocols underpin how JEDI co-pilots and client systems exchange data and calls securely.',
  },
  reasoning: {
    description: 'Reasoning covers patterns and methods for step-by-step and structured reasoning in AI. JEDI Labs uses reasoning (chain-of-thought, ReAct, tree-of-thought) in JEDI Ensemble™ for complex planning and decision support.',
    features: 'Chain-of-thought and ReAct, Multi-step decomposition, Tool use and verification, Interpretable traces, Integration with LLMs',
    additonalDetails: 'Reasoning improves quality and explainability of JEDI Ensemble™ outputs in voice agents and search optimization.',
  },
  security: {
    description: 'Security covers tools and practices for protecting data, access, and infrastructure. JEDI Labs applies security (Vault, IAM, encryption) across co-pilot, APIs, and client deployments to meet enterprise and compliance needs.',
    features: 'Secrets management, Access control and RBAC, Encryption and audit, Compliance (SOC2, HIPAA), Incident response',
    additonalDetails: 'Security is applied to all JEDI-backed systems so client data and access are protected.',
  },
  'data-storage': {
    description: 'Data Storage covers object, block, and file storage for pipelines and applications. JEDI Labs uses S3, GCS, and similar for artifacts, model weights, and pipeline data that back co-pilot and ML workloads.',
    features: 'Object and block storage, Versioning and lifecycle, Encryption and access, Integration with compute and analytics, Cost and tiering',
    additonalDetails: 'Storage holds the data and artifacts that JEDI pipelines and model serving depend on.',
  },
  'streaming-data': {
    description: 'Streaming Data covers event streams and real-time data pipelines. JEDI Labs uses Kafka, Kinesis, and similar for event-driven co-pilot triggers and data movement that keep JEDI-backed systems in sync.',
    features: 'Topics and partitions, Producers and consumers, Exactly-once and retention, Connect and Streams, Scaling and monitoring',
    additonalDetails: 'Streaming supports real-time pipelines and events that feed JEDI Rules™ and co-pilot integrations.',
  },
  'structured-data': {
    description: 'Structured Data covers relational and tabular data sources and stores. JEDI Labs uses SQL databases and structured sources for JEDI Rules™ business logic, metadata, and analytics that co-pilots and APIs use.',
    features: 'ACID and schema, SQL and indexing, Replication and backup, Integration with ETL and BI, Performance and scaling',
    additonalDetails: 'Structured data backs transactional and reporting use cases for JEDI solutions and client systems.',
  },
  'tool-integration': {
    description: 'Tool Integration covers connecting agents and applications to external tools and APIs. JEDI Labs uses tool integration in JEDI Ensemble™ so agents can call APIs, search, and execute actions in voice and chat flows.',
    features: 'Tool definitions and schemas, Execution and error handling, Auth and rate limits, Caching and idempotency, Observability',
    additonalDetails: 'Tool integration enables JEDI Ensemble™ agents to perform actions and retrieve live data for users.',
  },
  'data-transformation': {
    description: 'Data Transformation covers transforming and preparing data for analytics and ML. JEDI Labs uses dbt, Spark, and similar for pipelines that produce clean data for JEDI AutoTune™ and client models.',
    features: 'SQL and code-based transforms, Incremental and snapshots, Testing and docs, Scheduling and lineage, Integration with warehouses',
    additonalDetails: 'Transformation pipelines feed JEDI-backed analytics and model training with reliable, curated data.',
  },
  'unstructured-data': {
    description: 'Unstructured Data covers text, images, and other non-tabular sources. JEDI Labs uses unstructured data (documents, logs, media) for RAG, knowledge bases, and JEDI Ensemble™ applications like CrisPRO and AISO.',
    features: 'Parsing and chunking, Embeddings and indexing, Search and retrieval, Multi-modal handling, Integration with LLMs',
    additonalDetails: 'Unstructured data powers JEDI knowledge retrieval and content understanding across voice and search use cases.',
  },
  'vector-database': {
    description: 'Vector Databases store embeddings and support similarity search for RAG and recommendations. JEDI Labs uses Weaviate, FAISS, ChromaDB, and similar for JEDI Ensemble™ knowledge retrieval, CrisPRO literature search, and AISO.',
    features: 'Embedding storage and indexing, Approximate nearest neighbor, Filtering and hybrid search, Scaling and sharding, Integration with LLM pipelines',
    additonalDetails: 'Vector databases are central to JEDI Ensemble™ RAG and semantic search in co-pilots and client applications.',
  },
};

const UPDATE_MUTATION = `
  mutation UpdateTechnologySubcategory($id: ID!, $description: String, $features: String, $additonalDetails: String) {
    updateTechnologySubcategory(
      where: { id: $id }
      data: { description: $description, features: $features, additonalDetails: $additonalDetails }
    ) {
      id
      name
      slug
      description
      features
      additonalDetails
    }
  }
`;

async function main() {
  if (!ENDPOINT || !TOKEN) {
    console.error('Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN');
    process.exit(1);
  }

  const rawPath = new URL('../../../all_subcategories_raw.json', import.meta.url);
  const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  console.log(`Enhancing ${data.length} subcategories...\n`);

  let ok = 0;
  let err = 0;

  for (const sub of data) {
    const content = CONTENT[sub.slug];
    if (!content || !content.description || content.description.length < 50) {
      console.log(`⏭ Skip ${sub.slug}: no content or description too short`);
      continue;
    }

    const result = await makeRequest(UPDATE_MUTATION, {
      id: sub.id,
      description: content.description,
      features: content.features || '',
      additonalDetails: content.additonalDetails || '',
    });

    if (result.error || result.errors) {
      console.log(`❌ ${sub.slug}: ${result.error || result.errors?.[0]?.message}`);
      err++;
    } else {
      console.log(`✅ ${sub.slug}`);
      ok++;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. Updated: ${ok}, errors: ${err}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
