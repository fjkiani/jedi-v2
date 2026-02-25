#!/usr/bin/env node

/**
 * De-slop Technologies
 * Replaces generic "powerful technology solution" / "High Performance Architecture..." copy
 * with unique, JEDI-relevant description and features. Updates Hygraph in batches.
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
      'Authorization': `Bearer ${TOKEN}`,
      'gcms-stage': 'DRAFT',
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

const SLOP_DESC = 'powerful technology solution that enables advanced capabilities';
const SLOP_FEAT = 'High Performance Architecture, Scalable Design, Easy Integration';

// Real content: unique description (100+ chars), features (30+ chars). JEDI where applicable.
const CONTENT_MAP = {
  react: {
    description: 'React is a JavaScript library for building user interfaces with a component-based model and virtual DOM. JEDI Labs uses React for AI co-pilot UIs, solution dashboards, and interactive simulations that run in the browser with fast updates and clear state management.',
    features: 'Component-based UI, Virtual DOM, One-way data flow, Hooks for state and effects, React ecosystem (Router, Query), TypeScript support, Server and client rendering',
  },
  spacy: {
    description: 'spaCy is an industrial-strength NLP library for tokenization, named entity recognition, and dependency parsing. JEDI Labs uses spaCy for document processing, entity extraction in knowledge bases, and preprocessing pipelines that feed into JEDI Ensemble™ and search applications.',
    features: 'Tokenization and lemmatization, NER and entity linking, Dependency parsing, Word vectors and similarity, Pipeline architecture, Multi-language support, Training and fine-tuning',
  },
  'react-ai': {
    description: 'ReAct is a reasoning pattern that combines reasoning and acting: models generate steps and use tools in a loop. JEDI Labs applies ReAct-style agents in JEDI Ensemble™ for tool-calling, retrieval, and multi-step workflows in voice agents and search optimization.',
    features: 'Reasoning traces and tool use, Step-by-step decomposition, Tool integration (APIs, search), Error recovery and retries, Interpretable agent behavior',
  },
  'vector-databases': {
    description: 'Vector databases store embeddings and support fast similarity search for RAG, recommendations, and semantic retrieval. JEDI Labs uses vector stores with Weaviate, FAISS, and ChromaDB for JEDI Ensemble™ knowledge retrieval, CrisPRO literature search, and AISO semantic matching.',
    features: 'Embedding storage and indexing, Approximate nearest neighbor search, Filtering and hybrid search, Scalability and sharding, Integration with LLM pipelines',
  },
  'web-ui': {
    description: 'Web UI technologies cover front-end frameworks, components, and patterns for building dashboards and applications. JEDI Labs builds web UIs for co-pilot interfaces, solution pages, and interactive demos that connect to Hygraph and AI backends.',
    features: 'Responsive layouts, Component libraries, State management, API integration, Accessibility and performance',
  },
  zapier: {
    description: 'Zapier connects apps with no-code workflows and triggers. JEDI Labs uses Zapier and similar automation for lead capture, CRM sync, and marketing workflows that feed into JEDI Rules™ and keep systems in sync without custom code.',
    features: 'Multi-app triggers and actions, Prebuilt integrations, Filters and paths, Schedules and delays, Webhooks and custom steps',
  },
  'rest-api': {
    description: 'REST APIs provide HTTP-based interfaces for services and data. JEDI Labs designs and consumes REST APIs for Hygraph CMS, AI endpoints, CRM integrations, and internal services that power co-pilots and solution pages.',
    features: 'Resource-oriented URLs, HTTP methods and status codes, JSON payloads, Authentication (OAuth, API keys), Versioning and documentation',
  },
  'tree-of-thoughts': {
    description: 'Tree of Thoughts extends chain-of-thought by exploring multiple reasoning branches and pruning. JEDI Labs applies structured reasoning patterns in JEDI Ensemble™ for complex planning and decision support where multiple options need evaluation.',
    features: 'Multi-branch reasoning, Pruning and backtracking, Integration with LLM APIs, Use in planning and search, Interpretable reasoning trees',
  },
  'apache-airflow': {
    description: 'Apache Airflow orchestrates workflows as DAGs with scheduling, retries, and monitoring. JEDI Labs uses Airflow for data pipelines, model retraining jobs, and ETL that feed AI systems and keep knowledge bases up to date.',
    features: 'DAG-based workflows, Schedulers and executors, Retries and alerting, Extensible operators, UI for monitoring and logs',
  },
  encryption: {
    description: 'Encryption protects data at rest and in transit for compliance and security. JEDI Labs applies encryption for client data, API keys, and PII in voice agents, CRMs, and cloud deployments to meet enterprise and regulatory requirements.',
    features: 'TLS for transport, Encryption at rest, Key management, Hashing and signing, Compliance (e.g. HIPAA, SOC2)',
  },
  'gpt-4': {
    description: 'GPT-4 is a large language model from OpenAI used for text generation, reasoning, and tool use. JEDI Labs uses GPT-4 via JEDI Ensemble™ for conversational AI, voice agent backends, and content generation in Go Answer and CrisPRO implementations.',
    features: 'Natural language understanding and generation, Tool use and function calling, Long context windows, Multi-turn conversation, Fine-tuning and embeddings',
  },
  'bayesian-decision-networks': {
    description: 'Bayesian decision networks model uncertainty and optimal decisions under risk. JEDI Labs applies probabilistic models for clinical decision support, risk assessment, and recommendation systems where uncertainty and outcomes matter.',
    features: 'Probabilistic graphical models, Decision nodes and utilities, Inference and belief propagation, Integration with data and ML, Interpretable uncertainty',
  },
  angular: {
    description: 'Angular is an enterprise front-end framework with TypeScript, dependency injection, and a full CLI. JEDI Labs uses Angular for large-scale dashboards and internal tools that require strong typing and structured architecture.',
    features: 'TypeScript-first, Components and modules, RxJS and reactive forms, Routing and lazy loading, CLI and testing utilities',
  },
  'mobile-app': {
    description: 'Mobile app development covers native and cross-platform apps for iOS and Android. JEDI Labs builds mobile experiences for field workers, patient apps, and internal tools that connect to JEDI-backed APIs and real-time data.',
    features: 'Cross-platform (e.g. React Native, Flutter), Native APIs and performance, Offline and sync, Push and notifications, App store deployment',
  },
  'aws-lambda': {
    description: 'AWS Lambda runs code in response to events without managing servers. JEDI Labs uses Lambda for webhooks, event-driven pipelines, and serverless API handlers that scale with voice agents, lead capture, and data processing.',
    features: 'Event-driven execution, Auto-scaling and pay-per-use, Multiple runtimes, VPC and IAM integration, Step Functions and EventBridge',
  },
  graphql: {
    description: 'GraphQL is a query language and runtime for APIs that let clients request exactly the fields they need. JEDI Labs uses GraphQL with Hygraph CMS for technology and solution content, and for internal APIs that power the co-pilot and pages.',
    features: 'Declarative queries and mutations, Single endpoint and schema, Resolvers and data sources, Caching and batching, Introspection and tooling',
  },
  'api-keys': {
    description: 'API keys authenticate and authorize access to external services and APIs. JEDI Labs manages API keys for OpenAI, Anthropic, Hygraph, and CRMs securely (e.g. env vars, vaults) so co-pilots and integrations run without exposing secrets.',
    features: 'Authentication and rate limiting, Key rotation and scoping, Storage in env or secret managers, Audit and logging',
  },
  prefect: {
    description: 'Prefect is a workflow orchestration platform for building, scheduling, and monitoring data pipelines. JEDI Labs uses Prefect for ML pipelines, data sync, and retraining jobs that feed JEDI Ensemble™ and client knowledge bases.',
    features: 'Python-native workflows, Dynamic and parameterized flows, Scheduling and triggers, Observability and retries, Hybrid and cloud execution',
  },
  dask: {
    description: 'Dask scales Python analytics and ML to clusters with parallel arrays and dataframes. JEDI Labs uses Dask for large-scale data prep and model training when workloads exceed single-machine capacity.',
    features: 'Parallel NumPy/Pandas-like APIs, Task graphs and lazy execution, Distributed scheduler, Integration with ML libraries, Cloud and HPC deployment',
  },
  autogpt: {
    description: 'AutoGPT is an autonomous agent that breaks goals into tasks and uses tools in a loop. JEDI Labs applies similar agent patterns in JEDI Ensemble™ for research, content gathering, and multi-step workflows with guardrails and tool use.',
    features: 'Goal decomposition, Tool use and memory, Iterative planning, Integration with LLMs and APIs, Monitoring and safety controls',
  },
  dialogflow: {
    description: 'Dialogflow (Google) builds conversational agents with intents, entities, and fulfillment. JEDI Labs uses Dialogflow and alternatives like Retell for voice agents and chatbots that route to JEDI Ensemble™ and backend systems.',
    features: 'Intents and entities, Multi-turn dialogs, Fulfillment and webhooks, Voice and text channels, Analytics and training',
  },
  flutter: {
    description: 'Flutter is Google\'s UI toolkit for building natively compiled apps for mobile, web, and desktop. JEDI Labs uses Flutter for cross-platform client apps that need consistent UX and fast iteration.',
    features: 'Single codebase for mobile and web, Widget-based UI, Hot reload, Native performance, Material and Cupertino',
  },
  'voice-assistants': {
    description: 'Voice assistants handle speech input and output for hands-free interaction. JEDI Labs builds voice agents with Retell and JEDI Ensemble™ for 24/7 answering (e.g. Go Answer), reducing response times and improving satisfaction in real deployments.',
    features: 'Speech-to-text and TTS, Intent and entity extraction, Dialog management, Integration with telephony and APIs, Analytics and tuning',
  },
  ifttt: {
    description: 'IFTTT connects apps and devices with simple if-this-then-that rules. JEDI Labs uses IFTTT and similar automation for triggers that feed into JEDI Rules™ and CRM workflows without custom code.',
    features: 'Applets and triggers, Multi-service connections, Filters and delays, Webhooks, Personal and business automation',
  },
  grpc: {
    description: 'gRPC uses HTTP/2 and Protocol Buffers for high-performance RPC between services. JEDI Labs uses gRPC for internal service-to-service calls where low latency and strong typing matter.',
    features: 'Protocol Buffers schema, Streaming (unary, server, client, bidirectional), Code generation, Load balancing and retries, Interceptors and auth',
  },
  jwt: {
    description: 'JSON Web Tokens encode claims for stateless authentication and authorization. JEDI Labs uses JWTs for API auth, session tokens, and secure handoff between co-pilot, backend, and third-party integrations.',
    features: 'Signed and optionally encrypted tokens, Claims and expiration, Stateless verification, Integration with OAuth and OIDC, Standard libraries',
  },
  opentelemetry: {
    description: 'OpenTelemetry provides a single standard for traces, metrics, and logs across services. JEDI Labs uses OpenTelemetry for observability of co-pilot, APIs, and pipelines so we can debug and improve reliability.',
    features: 'Distributed tracing, Metrics and histograms, Log correlation, Auto-instrumentation, Export to backends (e.g. Prometheus, Grafana)',
  },
  grafana: {
    description: 'Grafana visualizes metrics and logs with dashboards and alerts. JEDI Labs uses Grafana with Prometheus for monitoring AI pipelines, API latency, and co-pilot usage in production.',
    features: 'Dashboards and panels, Prometheus and other data sources, Alerting and notifications, Variables and templating, On-call and SLOs',
  },
  rasa: {
    description: 'Rasa is an open-source framework for conversational AI with NLU and dialogue management. JEDI Labs uses Rasa and similar stacks for custom chatbots and voice agents that integrate with JEDI Ensemble™ and client knowledge bases.',
    features: 'NLU and intent classification, Dialogue policies and stories, Custom actions and slots, Multi-turn and forms, Integration and deployment',
  },
  websocket: {
    description: 'WebSockets enable full-duplex communication between browser and server. JEDI Labs uses WebSockets for real-time co-pilot streaming, live updates, and interactive simulations without polling.',
    features: 'Persistent connection, Low-latency bidirectional messaging, Fallback and reconnection, Scaling with sticky sessions, Security (WSS, origin checks)',
  },
  'chain-of-thought': {
    description: 'Chain-of-thought prompting elicits step-by-step reasoning from language models to improve accuracy on math and logic. JEDI Labs uses CoT in JEDI Ensemble™ for multi-step reasoning in clinical support, search optimization, and agent decision-making.',
    features: 'Step-by-step reasoning traces, Few-shot CoT prompts, Integration with LLM APIs, Use in RAG and agents, Interpretable outputs',
  },
  'knowledge-graphs': {
    description: 'Knowledge graphs represent entities and relations for querying and reasoning. JEDI Labs uses graph data for ontology-backed search, CrisPRO clinical knowledge, and JEDI Rules™ workflow logic when relationships matter more than vectors alone.',
    features: 'Entities and relations, Graph query languages, Reasoning and inference, Integration with NLP and ML, Visualization and exploration',
  },
  mcts: {
    description: 'Monte Carlo Tree Search explores decision spaces with random sampling and backpropagation. JEDI Labs applies MCTS-style search in planning and game-theoretic scenarios where JEDI Ensemble™ or custom agents need structured exploration.',
    features: 'Tree expansion and simulation, Selection and backpropagation, Exploration vs exploitation, Integration with ML policies, Use in games and planning',
  },
  anonymization: {
    description: 'Anonymization removes or generalizes PII so data can be used for analytics and ML without identifying individuals. JEDI Labs applies anonymization for healthcare and CRM data in pipelines that feed JEDI-backed systems while meeting HIPAA and GDPR.',
    features: 'De-identification and k-anonymity, Generalization and suppression, Risk assessment, Integration with ETL, Compliance and audit',
  },
  'markov-decision-processes': {
    description: 'Markov decision processes model sequential decisions under uncertainty with states, actions, and rewards. JEDI Labs uses MDPs and RL in JEDI AutoTune™ and recommendation systems where long-term outcomes and policies matter.',
    features: 'States, actions, transitions, rewards, Policy and value iteration, Model-based and model-free RL, Integration with deep RL',
  },
  'a-star-search': {
    description: 'A* is a best-first search algorithm that finds shortest paths using heuristics. JEDI Labs uses A* and related search in planning, routing, and agent decision trees when optimal or near-optimal paths are required.',
    features: 'Heuristic search, Priority queue, Optimal path under admissible heuristic, Graph and grid search, Integration with planning',
  },
  'data-masking': {
    description: 'Data masking obscures sensitive data in non-production environments. JEDI Labs uses masking for dev and test data so teams can work with realistic datasets without exposing PII or PHI in voice agents and CRMs.',
    features: 'Static and dynamic masking, Format-preserving encryption, Role-based access, Integration with DBs and ETL, Compliance (GDPR, HIPAA)',
  },
  'game-theory-algorithms': {
    description: 'Game-theoretic algorithms model strategic interaction between agents. JEDI Labs applies game theory in multi-agent systems, pricing, and decision support where JEDI Ensemble™ or JEDI Rules™ need to reason about incentives and equilibria.',
    features: 'Nash equilibrium, Mechanism design, Multi-agent reasoning, Auctions and markets, Integration with ML',
  },
  babyagi: {
    description: 'BabyAGI is a minimal autonomous agent that creates and executes tasks from a goal. JEDI Labs uses similar task-driven agent patterns in JEDI Ensemble™ for research, content synthesis, and multi-step workflows with tool use.',
    features: 'Task creation and prioritization, Execution loop, Integration with LLMs and tools, Memory and context, Extensible architecture',
  },
  'chatbot-platforms': {
    description: 'Chatbot platforms provide tools to build and deploy conversational agents. JEDI Labs uses platforms like Retell and custom stacks with JEDI Ensemble™ for Go Answer voice agents and CrisPRO-style assistants with real deployment results.',
    features: 'Intent and entity management, Dialog flows, Channels and integrations, Analytics and training, Deployment and scaling',
  },
  'alexa-skills-kit': {
    description: 'Alexa Skills Kit lets developers build voice experiences for Amazon Alexa. JEDI Labs uses voice platforms and ASK-style tooling for voice agents that can be extended to smart speakers and hands-free interfaces.',
    features: 'Voice interaction model, Intents and slots, Fulfillment and APIs, Multi-turn and cards, Certification and publishing',
  },
  'power-automate': {
    description: 'Power Automate (Microsoft) automates workflows across Microsoft 365 and other services. JEDI Labs uses Power Automate and similar tools for CRM and office workflows that integrate with JEDI Rules™ and lead capture.',
    features: 'Connectors and triggers, Flow designer, Approval and conditions, On-premises and cloud, Integration with Teams and Dynamics',
  },
  'openid-connect': {
    description: 'OpenID Connect adds identity layer on top of OAuth 2.0 for authentication and user info. JEDI Labs uses OIDC for single sign-on and secure access to co-pilot, dashboards, and client portals.',
    features: 'ID tokens and userinfo, Discovery and registration, Flows (authorization, hybrid), Integration with OAuth 2.0, Enterprise IdPs',
  },
  htn: {
    description: 'Hierarchical Task Networks decompose high-level tasks into subtasks for planning. JEDI Labs applies HTN-style decomposition in JEDI Ensemble™ for complex workflows and agent planning where structure reduces search space.',
    features: 'Task decomposition, Methods and preconditions, Integration with planners, Use in robotics and agents, Interpretable plans',
  },
  'elk-stack': {
    description: 'The ELK stack (Elasticsearch, Logstash, Kibana) indexes and visualizes logs and metrics. JEDI Labs uses ELK or similar stacks for observability of co-pilot, APIs, and pipelines in production.',
    features: 'Full-text search and indexing, Log aggregation and parsing, Dashboards and visualizations, Alerting, Scalability and retention',
  },
  gdpr: {
    description: 'GDPR sets rules for processing personal data in the EU. JEDI Labs designs systems for consent, data minimization, and subject rights so voice agents, CRMs, and analytics comply when handling EU data.',
    features: 'Lawful basis and consent, Data subject rights, Privacy by design, Breach notification, DPO and documentation',
  },
  webhooks: {
    description: 'Webhooks deliver event-driven HTTP callbacks when something happens in a system. JEDI Labs uses webhooks for lead capture, CRM events, and pipeline triggers that feed JEDI Rules™ and co-pilot integrations.',
    features: 'Event payloads and retries, Signing and verification, Idempotency and ordering, Subscription and management, Security and TLS',
  },
  n8n: {
    description: 'n8n is a workflow automation tool with a visual editor and self-host option. JEDI Labs uses n8n and similar tools for internal and client workflows that connect APIs, CRMs, and JEDI-backed services.',
    features: 'Visual workflow editor, 400+ integrations, Self-hosted or cloud, Webhooks and triggers, Error handling and retries',
  },
  'server-sent-events': {
    description: 'Server-Sent Events stream updates from server to client over HTTP. JEDI Labs uses SSE for real-time co-pilot streaming and live UI updates when full WebSockets are not required.',
    features: 'One-way server-to-client stream, Reconnection and IDs, Text-based and simple, Fallback for older clients, Integration with fetch/EventSource',
  },
  saml: {
    description: 'SAML is an XML-based standard for exchanging authentication and authorization data between IdPs and service providers. JEDI Labs uses SAML for enterprise SSO to co-pilot and client applications.',
    features: 'Assertions and protocols, IdP and SP roles, Bindings (POST, redirect), Metadata and discovery, Integration with enterprise IdPs',
  },
  celery: {
    description: 'Celery is a distributed task queue for Python. JEDI Labs uses Celery for async jobs, model inference, and background work that supports co-pilot and pipeline workloads.',
    features: 'Task queues and brokers, Scheduling and retries, Workers and concurrency, Result backends, Monitoring and flower',
  },
  splunk: {
    description: 'Splunk ingests and analyzes machine data for search, monitoring, and security. JEDI Labs uses Splunk or similar for log analysis and incident response in production AI and API deployments.',
    features: 'Indexing and search, Dashboards and alerts, SIEM and security, Machine learning toolkit, Scaling and retention',
  },
  hipaa: {
    description: 'HIPAA sets US rules for protecting health information. JEDI Labs builds CrisPRO and healthcare solutions with access controls, encryption, and audit trails so PHI handling meets HIPAA where applicable.',
    features: 'Administrative and technical safeguards, BAA and business associates, Audit controls and access logs, Encryption and integrity, Risk assessment',
  },
  bert: {
    description: 'BERT and transformer-based models advance NLP for understanding and generation. JEDI Labs uses BERT-style models from Hugging Face and JEDI AutoTune™ for search, classification, and RAG in AISO and knowledge bases.',
    features: 'Pre-trained encoders, Fine-tuning for downstream tasks, Tokenization (WordPiece), Masked LM and NSP, Integration with Hugging Face',
  },
  'api-gateway-systems': {
    description: 'API gateways handle routing, auth, rate limiting, and observability for APIs. JEDI Labs uses API gateways in front of co-pilot and backend services to secure and scale client-facing endpoints.',
    features: 'Routing and load balancing, Authentication and authorization, Rate limiting and quotas, Logging and metrics, Versioning and canary',
  },
  'make-integromat': {
    description: 'Make (Integromat) automates workflows with a visual scenario builder and many app connectors. JEDI Labs uses Make for marketing and CRM automation that feeds into JEDI Rules™ and lead capture.',
    features: 'Visual scenarios, Connectors and modules, Routers and filters, Scheduling and webhooks, Error handling',
  },
  datadog: {
    description: 'Datadog provides monitoring, logs, and APM in one platform. JEDI Labs uses Datadog for observability of co-pilot, APIs, and ML pipelines in production.',
    features: 'Metrics and dashboards, APM and tracing, Log management, Alerting and SLOs, Integration with AWS and Kubernetes',
  },
  'crew-ai': {
    description: 'CrewAI orchestrates multiple AI agents in a crew with roles and tasks. JEDI Labs uses CrewAI and similar patterns in JEDI Ensemble™ for multi-agent workflows, research, and content pipelines.',
    features: 'Agent roles and goals, Task delegation, Tool use and shared context, Sequential and hierarchical crews, Integration with LLMs',
  },
  neo4j: {
    description: 'Neo4j is a graph database for storing and querying connected data. JEDI Labs uses Neo4j for knowledge graphs, ontology-backed search, and JEDI Rules™ when relationships and graph traversal matter.',
    features: 'Property graph model, Cypher query language, Traversals and path finding, Indexing and constraints, Visualization and tooling',
  },
  pagerduty: {
    description: 'PagerDuty manages incidents and on-call for DevOps and SRE. JEDI Labs uses PagerDuty for alerting when co-pilot or pipeline health degrades so teams can respond quickly.',
    features: 'Incident management, On-call schedules, Escalation and policies, Integrations and event ingestion, Postmortems and analytics',
  },
  mfa: {
    description: 'Multi-factor authentication adds a second factor (e.g. TOTP, SMS) to login. JEDI Labs uses MFA for co-pilot, dashboards, and client portals to meet enterprise and compliance requirements.',
    features: 'TOTP and authenticator apps, SMS and email fallback, Hardware keys (WebAuthn), Conditional access, Integration with IdPs',
  },
  'fine-tuned-models': {
    description: 'Fine-tuned models adapt pre-trained LLMs or other models to specific tasks and domains. JEDI Labs uses fine-tuning via JEDI AutoTune™ and Hugging Face for AISO, CrisPRO, and client-specific accuracy.',
    features: 'Domain adaptation, Task-specific training, LoRA and parameter-efficient methods, Evaluation and iteration, Deployment and serving',
  },
  redis: {
    description: 'Redis is an in-memory data store used for caching, sessions, and queues. JEDI Labs uses Redis for co-pilot session state, rate limiting, and job queues that support voice agents and APIs.',
    features: 'Key-value and data structures, Caching and TTL, Pub/sub and streams, Persistence options, Clustering and replication',
  },
  ray: {
    description: 'Ray scales Python and ML workloads on clusters with distributed execution. JEDI Labs uses Ray for distributed training and serving when single-node capacity is insufficient.',
    features: 'Distributed execution, Ray Tune for hyperparameters, Ray Serve for deployment, Ray Data for preprocessing, Kubernetes and cloud',
  },
  opsgenie: {
    description: 'Opsgenie manages alerts and on-call for incident response. JEDI Labs uses Opsgenie with Prometheus and Grafana so pipeline and API issues are routed to the right team.',
    features: 'Alert routing and escalation, On-call schedules, Integrations and forwarding, Incident timeline, Postmortem and reporting',
  },
  rbac: {
    description: 'Role-based access control grants permissions by user role. JEDI Labs uses RBAC for co-pilot, dashboards, and client apps so access aligns with enterprise policies.',
    features: 'Roles and permissions, Assignment and inheritance, Integration with IdPs, Audit and review, Least privilege',
  },
  'reinforcement-learning-agents': {
    description: 'Reinforcement learning agents learn from reward signals through trial and error. JEDI Labs applies RL in JEDI AutoTune™ and recommendation systems where sequential decisions and long-term outcomes matter.',
    features: 'Policies and value functions, Exploration and exploitation, On-policy and off-policy, Integration with deep RL, Simulation and real environments',
  },
  keras: {
    description: 'Keras is a high-level API for building and training neural networks, now part of TensorFlow. JEDI Labs uses Keras and TensorFlow for custom models and JEDI AutoTune™ when clients need trainable models beyond off-the-shelf LLMs.',
    features: 'Layers and models API, Training loops and callbacks, Preprocessing and data pipelines, Export and deployment, Integration with TensorFlow',
  },
  'slack-notifications': {
    description: 'Slack notifications deliver alerts and updates to teams in channels and DMs. JEDI Labs uses Slack for pipeline alerts, lead notifications, and internal co-pilot feedback so teams stay in the loop.',
    features: 'Incoming webhooks, Block Kit and formatting, Channels and DMs, Integrations and bots, Search and history',
  },
  abac: {
    description: 'Attribute-based access control grants permissions using attributes of users, resources, and context. JEDI Labs uses ABAC where fine-grained policies are needed beyond roles, e.g. in healthcare or regulated data.',
    features: 'Attributes and policies, Policy evaluation engine, Integration with IdPs and context, Audit and compliance, Use with RBAC',
  },
  owl: {
    description: 'OWL is a semantic web language for defining ontologies and reasoning over knowledge. JEDI Labs uses OWL and ontologies for structured knowledge in CrisPRO and domain models that JEDI Ensemble™ can query.',
    features: 'Classes and properties, Reasoning and inference, Ontology design patterns, Integration with RDF and SPARQL, Use in knowledge graphs',
  },
  rdf: {
    description: 'RDF is a standard model for representing linked data as triples. JEDI Labs uses RDF and linked data for knowledge graphs and ontology-backed applications that integrate with JEDI Ensemble™ and search.',
    features: 'Triples and graphs, Serializations (Turtle, JSON-LD), SPARQL query language, Vocabularies and ontologies, Integration with NLP',
  },
  'restful-services-integration': {
    description: 'RESTful service integration connects systems via HTTP APIs and standard methods. JEDI Labs uses REST for Hygraph, AI providers, CRMs, and internal services that power co-pilots and solution pages.',
    features: 'HTTP methods and status codes, JSON and content negotiation, Idempotency and caching, API versioning, Documentation (OpenAPI)',
  },
  'bayesian-networks-decision': {
    description: 'Bayesian decision networks combine Bayesian networks with decision and utility nodes for optimal decisions under uncertainty. JEDI Labs applies them in clinical and risk decision support.',
    features: 'Chance and decision nodes, Utility and value of information, Inference and sensitivity, Integration with data, Interpretable reasoning',
  },
  'markov-processes-ai': {
    description: 'Markov processes model state transitions with the Markov property. JEDI Labs uses them in RL, recommendation systems, and JEDI AutoTune™ when sequential dynamics matter.',
    features: 'State and transition models, Stationarity and ergodicity, Integration with MDPs and RL, Prediction and simulation, Use in NLP and time series',
  },
  'graphql-integration-systems': {
    description: 'GraphQL integration systems expose and consume GraphQL APIs across services. JEDI Labs uses GraphQL with Hygraph and internal APIs for flexible data fetching in co-pilot and pages.',
    features: 'Schema stitching and federation, Resolvers and data sources, Caching and batching, Tooling and codegen, Integration with backends',
  },
  'game-theory-optimization': {
    description: 'Game-theoretic optimization finds equilibria and optimal strategies in multi-agent settings. JEDI Labs applies it in mechanism design and multi-agent systems where JEDI Ensemble™ reasons about incentives.',
    features: 'Equilibrium computation, Mechanism design, Multi-agent optimization, Auctions and markets, Integration with ML',
  },
  'grpc-framework-integration': {
    description: 'gRPC framework integration builds and consumes high-performance RPC services. JEDI Labs uses gRPC for internal services where low latency and strong contracts matter.',
    features: 'Protocol Buffers and codegen, Streaming and flow control, Load balancing and retries, Interceptors and middleware, Cross-language support',
  },
  'swarm-intelligence': {
    description: 'Swarm intelligence algorithms model collective behavior (e.g. ant colony, PSO). JEDI Labs uses them for optimization and multi-agent coordination when decentralized search is beneficial.',
    features: 'Particle swarm and ACO, Emergent behavior, Distributed and parallel, Use in optimization and routing, Integration with ML',
  },
  'swarm-intelligence-systems': {
    description: 'Swarm intelligence systems apply swarm algorithms at scale. JEDI Labs uses them for scheduling, routing, and coordination in pipelines and multi-agent JEDI deployments.',
    features: 'Decentralized coordination, Scalability and robustness, Optimization and search, Simulation and deployment, Monitoring and tuning',
  },
  'webhook-integration-systems': {
    description: 'Webhook integration systems send and receive event-driven HTTP callbacks. JEDI Labs uses webhooks for CRM, lead capture, and pipeline triggers that feed JEDI Rules™.',
    features: 'Event payloads and retries, Signing and verification, Routing and filtering, Management and logging, Security and TLS',
  },
  'meta-heuristic-algorithms': {
    description: 'Meta-heuristic algorithms (e.g. genetic, simulated annealing) search large spaces without guarantees. JEDI Labs uses them for hyperparameter tuning and JEDI AutoTune™ when exhaustive search is infeasible.',
    features: 'Genetic algorithms and evolution, Simulated annealing, Tabu search, Hybrid and hybridizations, Integration with ML pipelines',
  },
  'meta-heuristics-advanced': {
    description: 'Advanced meta-heuristics extend classic methods with adaptive and hybrid strategies. JEDI Labs uses them in JEDI AutoTune™ and optimization when problem structure allows.',
    features: 'Adaptive parameters, Multi-objective optimization, Hybrid methods, Parallel and distributed, Application to ML and planning',
  },
  'iso-27001': {
    description: 'ISO 27001 is the international standard for information security management. JEDI Labs aligns controls for co-pilot and client data so deployments meet enterprise and certification requirements.',
    features: 'ISMS and risk assessment, Controls and statement of applicability, Certification and audit, Continuous improvement, Integration with SOC2 and GDPR',
  },
  t5: {
    description: 'T5 (Text-to-Text Transfer Transformer) frames NLP as text-to-text. JEDI Labs uses T5-style models from Hugging Face for summarization, classification, and generation in AISO and knowledge applications.',
    features: 'Unified text-to-text framework, Pre-training and fine-tuning, Encoder-decoder architecture, Integration with Hugging Face, Use in summarization and QA',
  },
  'auth-protocols-integration': {
    description: 'Auth protocol integration connects applications to OAuth, OIDC, SAML, and other standards. JEDI Labs uses it for SSO and secure access to co-pilot and client portals.',
    features: 'OAuth 2.0 and OIDC, SAML and federation, Token handling and refresh, Integration with IdPs, Security and best practices',
  },
  'apache-ignite': {
    description: 'Apache Ignite is an in-memory data grid for caching, compute, and streaming. JEDI Labs uses Ignite and similar for high-throughput state and caching in data pipelines.',
    features: 'Distributed cache and SQL, Compute grid and MapReduce, Streaming and CEP, Persistence and durability, Integration with Hadoop and Kafka',
  },
};

const strictDesc = (t) =>
  t.description && typeof t.description === 'string' && t.description.trim().length >= 100;
const strictFeat = (t) =>
  t.features && typeof t.features === 'string' && t.features.trim().length >= 30;

// Fill minimum: techs that don't meet strict (desc>=100, features>=30).
const FILL_MAP = {
  'apache-spark': {
    description: 'Apache Spark is a unified engine for large-scale data processing with in-memory computing. JEDI Labs uses Spark for ETL and ML pipelines that feed data into JEDI Ensemble™ and client knowledge bases when data size exceeds single-machine capacity.',
    features: 'In-memory processing, DataFrame and SQL APIs, MLlib and streaming, Cluster managers (Standalone, YARN, K8s), Connectors and ecosystem',
  },
  'sql-databases': {
    description: 'SQL databases store structured data with ACID transactions and query with SQL. JEDI Labs uses PostgreSQL and other SQL stores for JEDI Rules™ business logic, user data, and metadata that co-pilots and APIs depend on.',
    features: 'ACID transactions, SQL querying, Indexing and constraints, Replication and backup, Integration with ORMs and APIs',
  },
  'text-files': {
    description: 'Text files (CSV, JSON, logs) are common inputs for ingestion and ML. JEDI Labs uses text sources in document processing, ETL, and JEDI Rules™ workflows for knowledge bases and automation.',
    features: 'Structured and semi-structured formats, Streaming and chunking, Parsing and validation, Integration with pipelines, Compression and storage',
  },
  images: {
    description: 'Image data supports computer vision, document processing, and multimodal AI. JEDI Labs uses image inputs with Hugging Face and JEDI AutoTune™ for AISO, quality control, and client-specific vision tasks.',
    features: 'Format support (PNG, JPEG, etc.), Preprocessing and augmentation, Embeddings and similarity, Integration with CV models, Storage and versioning',
  },
  audio: {
    description: 'Audio data powers voice agents, speech-to-text, and multimodal applications. JEDI Labs uses audio with Retell and JEDI Ensemble™ for Go Answer voice agents and transcription pipelines.',
    features: 'Streaming and chunking, STT and TTS integration, Format and codec support, Noise and enhancement, Real-time and batch',
  },
  'apache-kafka': {
    description: 'Apache Kafka is a distributed event streaming platform. JEDI Labs uses Kafka for real-time pipelines, event-driven co-pilot triggers, and data movement that keeps JEDI-backed systems in sync.',
    features: 'Topics and partitions, Producers and consumers, Exactly-once semantics, Connect and Streams, Scaling and retention',
  },
  'third-party-apis': {
    description: 'Third-party APIs provide external data and services (CRM, payments, AI). JEDI Labs integrates third-party APIs for lead capture, Hygraph, AI providers, and JEDI Rules™ automation.',
    features: 'REST and GraphQL clients, Authentication and rate limits, Retries and circuit breakers, Webhooks and polling, Documentation and versioning',
  },
  'apache-nifi': {
    description: 'Apache NiFi automates data flows with a visual UI and backpressure. JEDI Labs uses NiFi for data ingestion and ETL that feed data lakes and pipelines supporting JEDI Ensemble™ and analytics.',
    features: 'Flow-based UI, Processors and connections, Backpressure and prioritization, Provenance and monitoring, Clustering and security',
  },
  'tensorflow-serving': {
    description: 'TensorFlow Serving deploys TensorFlow models at scale with gRPC and REST. JEDI Labs uses TF Serving and similar (e.g. Seldon, Ray Serve) for custom model endpoints that JEDI AutoTune™ and co-pilots call.',
    features: 'Model versioning and rollout, gRPC and REST APIs, Batching and latency tuning, Monitoring and metrics, Multi-model serving',
  },
  docker: {
    description: 'Docker containers package applications and dependencies for consistent deployment. JEDI Labs uses Docker for co-pilot backends, pipelines, and client deployments on AWS, GCP, and on-prem.',
    features: 'Images and layers, Dockerfile and multi-stage, Registry and orchestration, Networking and volumes, Compose and Swarm',
  },
  fastapi: {
    description: 'FastAPI is a modern Python web framework for APIs with automatic OpenAPI docs. JEDI Labs uses FastAPI for internal and client-facing APIs that serve co-pilot, ML inference, and JEDI Rules™.',
    features: 'Async and type hints, Automatic validation and docs, Dependency injection, WebSockets and background tasks, Performance and ecosystem',
  },
  'github-actions': {
    description: 'GitHub Actions automates CI/CD with workflows in the repo. JEDI Labs uses Actions for build, test, and deploy of the app and migrations so changes ship reliably.',
    features: 'Workflows and jobs, Triggers and secrets, Matrix and caching, Marketplace actions, Deployment and notifications',
  },
  'amazon-s3': {
    description: 'Amazon S3 is object storage for files and data lakes. JEDI Labs uses S3 for artifacts, model weights, and pipeline data that back co-pilot and ML workloads on AWS.',
    features: 'Buckets and objects, Versioning and lifecycle, Encryption and access control, Event notifications, Integration with Athena and Glue',
  },
  snowflake: {
    description: 'Snowflake is a cloud data warehouse for analytics and ML. JEDI Labs uses Snowflake and similar for client analytics and data pipelines that feed reporting and JEDI-backed applications.',
    features: 'SQL warehouse, Separation of storage and compute, Time travel and cloning, Data sharing, ML and Python UDFs',
  },
  'dbt-core': {
    description: 'dbt (data build tool) transforms data in the warehouse with SQL and Jinja. JEDI Labs uses dbt for analytics pipelines and dimensional models that support reporting and JEDI Ensemble™ data sources.',
    features: 'Models and refs, Tests and documentation, Incremental and snapshots, Seeds and sources, Scheduling and orchestration',
  },
  'great-expectations': {
    description: 'Great Expectations validates data quality with expectations and checkpoints. JEDI Labs uses it in pipelines that feed JEDI-backed systems so bad data is caught before it affects co-pilots or models.',
    features: 'Expectations and suites, Checkpoints and actions, Data docs and profiling, Integration with dbt and Airflow, Alerting and reporting',
  },
  kubernetes: {
    description: 'Kubernetes orchestrates containers at scale with declarative config. JEDI Labs uses Kubernetes (and managed K8s on AWS/GCP) for co-pilot, APIs, and ML serving in production.',
    features: 'Pods and deployments, Services and ingress, ConfigMaps and secrets, Autoscaling and health, Helm and operators',
  },
  flask: {
    description: 'Flask is a lightweight Python web framework. JEDI Labs uses Flask for simple APIs, webhooks, and internal tools when FastAPI or other stacks are not required.',
    features: 'Routing and blueprints, Request context and extensions, Templates and static files, Testing and deployment, Ecosystem and plugins',
  },
  pandas: {
    description: 'Pandas is the standard Python library for data manipulation and analysis. JEDI Labs uses Pandas in ETL, feature engineering, and analytics that feed JEDI AutoTune™ and client reports.',
    features: 'DataFrame and Series, Indexing and grouping, Merge and reshape, Time series and I/O, Integration with NumPy and ML',
  },
  terraform: {
    description: 'Terraform manages infrastructure as code across clouds. JEDI Labs uses Terraform for AWS, GCP, and Kubernetes so co-pilot and pipeline infra are reproducible and auditable.',
    features: 'Providers and resources, State and workspaces, Modules and reuse, Plan and apply, Drift and import',
  },
  'nosql-databases': {
    description: 'NoSQL databases store document, key-value, or wide-column data at scale. JEDI Labs uses MongoDB and similar for JEDI Rules™ document workflows, session state, and flexible schemas.',
    features: 'Document and key-value models, Scaling and sharding, Query and indexing, Consistency and tuning, Integration with app and APIs',
  },
  'aws-kinesis': {
    description: 'AWS Kinesis streams and analyzes real-time data. JEDI Labs uses Kinesis for event streams and analytics that trigger JEDI Rules™ and keep co-pilot and CRM data in sync.',
    features: 'Data Streams and Firehose, Producers and consumers, Scaling and retention, Analytics and ML, Integration with Lambda and S3',
  },
  'web-scraping': {
    description: 'Web scraping extracts data from websites for ingestion and analysis. JEDI Labs uses scraping (with respect to ToS) for data acquisition that feeds AISO, knowledge bases, and JEDI-backed pipelines.',
    features: 'HTTP clients and parsing, Rate limiting and politeness, Proxies and headers, Structured extraction, Scheduling and storage',
  },
  torchserve: {
    description: 'TorchServe serves PyTorch models with REST and gRPC. JEDI Labs uses TorchServe and similar for custom PyTorch endpoints that JEDI AutoTune™ and co-pilots call when needed.',
    features: 'Model archiving, Multi-model serving, Batching and metrics, Custom handlers, Kubernetes and scaling',
  },
  'gitlab-ci': {
    description: 'GitLab CI/CD runs pipelines defined in .gitlab-ci.yml. JEDI Labs uses GitLab CI for build, test, and deploy alongside GitHub Actions so releases are consistent.',
    features: 'Stages and jobs, Variables and secrets, Runners and caching, Templates and includes, Deployment and security',
  },
  'apache-flink': {
    description: 'Apache Flink processes streaming data with exactly-once semantics. JEDI Labs uses Flink for real-time pipelines and event processing that feed JEDI-backed systems when low latency matters.',
    features: 'Streaming and batch APIs, State and checkpoints, Windowing and joins, Deployment and scaling, Integration with Kafka and Kinesis',
  },
  helm: {
    description: 'Helm packages Kubernetes applications as charts. JEDI Labs uses Helm to deploy co-pilot, APIs, and ML services on Kubernetes with versioned, repeatable releases.',
    features: 'Charts and values, Install and upgrade, Hooks and tests, Repositories and dependencies, Templating and subcharts',
  },
  aws: {
    description: 'Amazon Web Services provides cloud compute, storage, and AI services. JEDI Labs uses AWS for co-pilot hosting, Lambda, S3, and ML (SageMaker) so solutions scale and stay secure.',
    features: 'EC2 and Lambda, S3 and RDS, IAM and VPC, SageMaker and Bedrock, Monitoring and billing',
  },
  azure: {
    description: 'Microsoft Azure provides cloud compute, data, and AI services. JEDI Labs uses Azure for client deployments that require Microsoft integration, Active Directory, or Azure-native ML.',
    features: 'VMs and Functions, Storage and SQL, Entra ID and networking, Azure ML and OpenAI, Monitor and Cost Management',
  },
  gcp: {
    description: 'Google Cloud Platform provides cloud compute, BigQuery, and Vertex AI. JEDI Labs uses GCP for data pipelines and ML when clients standardize on Google or need BigQuery and Dataflow.',
    features: 'Compute Engine and Cloud Run, BigQuery and GCS, IAM and VPC, Vertex AI and TPUs, Operations and billing',
  },
  'expressjs': {
    description: 'Express.js is a minimal Node.js web framework for APIs and apps. JEDI Labs uses Express for Node-based APIs and services that integrate with co-pilot and front-end when the stack is JavaScript.',
    features: 'Routing and middleware, Request and response, Templates and static, Error handling and testing, Ecosystem and deployment',
  },
  kubeflow: {
    description: 'Kubeflow runs ML workflows on Kubernetes. JEDI Labs uses Kubeflow for training and serving when clients need portable, K8s-native ML pipelines that integrate with JEDI AutoTune™.',
    features: 'Pipelines and components, Training operators, Serving and inference, Experiment tracking, Multi-cloud and on-prem',
  },
  minio: {
    description: 'MinIO is S3-compatible object storage for on-prem and hybrid. JEDI Labs uses MinIO when clients need S3-style storage without public cloud, for artifacts and pipeline data.',
    features: 'S3-compatible API, Buckets and versioning, Encryption and replication, Distributed and erasure coding, Integration with K8s and apps',
  },
  'azure-active-directory': {
    description: 'Azure Active Directory (Entra ID) manages identity and access in Microsoft ecosystems. JEDI Labs uses Entra for SSO and MFA when clients use Microsoft 365 and need co-pilot and app access.',
    features: 'Users and groups, SSO and SAML/OIDC, Conditional access, MFA and PIM, Integration with Azure and apps',
  },
  kafka: {
    description: 'Kafka is the core event streaming platform (see Apache Kafka). JEDI Labs uses Kafka for real-time event pipelines that feed JEDI Rules™ and keep systems consistent.',
    features: 'Topics and partitions, Producers and consumers, Streams and Connect, Exactly-once and retention, Ecosystem and tooling',
  },
  'rest-apis': {
    description: 'REST APIs expose resources over HTTP with standard methods. JEDI Labs designs and consumes REST APIs for Hygraph, AI providers, and internal services that power co-pilots and pages.',
    features: 'Resources and HTTP methods, Status codes and content types, Auth and rate limiting, Versioning and docs, Testing and monitoring',
  },
  claude: {
    description: 'Claude is Anthropic\'s large language model for dialogue, analysis, and long context. JEDI Labs uses Claude via JEDI Ensemble™ for conversational AI, voice backends, and content when reasoning or safety are priorities.',
    features: 'Long context and dialogue, Tool use and structured output, Safety and alignment, API and fine-tuning, Integration with JEDI Ensemble™',
  },
  'task-decomposition-engine': {
    description: 'Task decomposition breaks high-level goals into executable subtasks. JEDI Labs uses decomposition in JEDI Ensemble™ agents and planning systems so complex workflows and voice-agent flows are manageable and auditable.',
    features: 'Goal hierarchy, Subtask generation, Dependencies and ordering, Integration with LLMs and planners, Recovery and retries',
  },
  'online-learning-systems': {
    description: 'Online learning updates models from streaming data without full retraining. JEDI Labs uses online and incremental learning in JEDI AutoTune™ when models must adapt to new data or feedback in production.',
    features: 'Incremental updates, Concept drift handling, Feedback loops, Deployment and monitoring, Integration with pipelines',
  },
  labelbox: {
    description: 'Labelbox is a data labeling and ML ops platform for training data. JEDI Labs uses Labelbox and similar tools for annotation pipelines that feed JEDI AutoTune™ and client-specific model training.',
    features: 'Labeling UI and workflows, Quality and consensus, Integrations and API, Model-assisted labeling, Analytics and versioning',
  },
  'uncertainty-sampling': {
    description: 'Uncertainty sampling selects examples for labeling where the model is most uncertain. JEDI Labs uses it in active learning pipelines that reduce labeling cost while improving JEDI AutoTune™ and custom models.',
    features: 'Uncertainty metrics, Query strategies, Integration with annotators, Batch and streaming, Cost and accuracy tradeoffs',
  },
  tableau: {
    description: 'Tableau is a business intelligence platform for dashboards and analytics. JEDI Labs uses Tableau and similar for client reporting and metrics that surface co-pilot and pipeline performance.',
    features: 'Visual analytics, Dashboards and stories, Data connections and prep, Sharing and embedding, Server and cloud',
  },
  'docker-compose': {
    description: 'Docker Compose defines multi-container apps in YAML. JEDI Labs uses Compose for local dev and lightweight deployment of co-pilot, APIs, and dependencies without full Kubernetes.',
    features: 'Services and networks, Volumes and env, Scale and dependencies, Override and profiles, Integration with Docker',
  },
  'multi-region-deployment': {
    description: 'Multi-region deployment runs services in multiple regions for latency and resilience. JEDI Labs uses multi-region for co-pilot and APIs when clients need global availability and failover.',
    features: 'Region selection and routing, Data replication, Failover and health, Consistency and latency, Cost and compliance',
  },
  whylabs: {
    description: 'WhyLabs monitors ML data and model quality in production. JEDI Labs uses WhyLabs and similar for drift detection and quality alerts so JEDI AutoTune™ and deployed models stay reliable.',
    features: 'Data and model drift, Statistical profiling, Alerts and dashboards, Privacy and PII detection, Integration with pipelines',
  },
  security: {
    description: 'Security practices protect systems, data, and access. JEDI Labs applies security across co-pilot, APIs, and client deployments: auth, encryption, and compliance (e.g. HIPAA, SOC2) where required.',
    features: 'Authentication and authorization, Encryption and key management, Audit logging, Vulnerability and compliance, Incident response',
  },
  'hashicorp-vault': {
    description: 'HashiCorp Vault manages secrets and encryption as a service. JEDI Labs uses Vault for API keys, DB credentials, and certs so co-pilot and pipelines access secrets securely without embedding them.',
    features: 'Secrets engines, Dynamic credentials, Encryption as a service, Audit and access control, Integration with K8s and clouds',
  },
  'dynamic-task-scheduler': {
    description: 'Dynamic task schedulers assign and rebalance work at runtime. JEDI Labs uses dynamic scheduling in pipeline and agent orchestration so JEDI Ensemble™ and workers handle load and failures.',
    features: 'Task queue and assignment, Priority and fairness, Scaling and backpressure, Observability, Integration with K8s and queues',
  },
  'transfer-learning-framework': {
    description: 'Transfer learning adapts pre-trained models to new tasks with less data. JEDI Labs uses transfer learning in JEDI AutoTune™ and Hugging Face pipelines for AISO, CrisPRO, and client-specific accuracy.',
    features: 'Pre-trained encoders, Fine-tuning and adapters, Domain adaptation, Evaluation and selection, Deployment',
  },
  'sagemaker-ground-truth': {
    description: 'SageMaker Ground Truth provides built-in and custom labeling for ML. JEDI Labs uses it for training data that feeds JEDI AutoTune™ and client models when the stack is AWS-native.',
    features: 'Labeling workflows, Workforce and automation, Active learning, Output format and integration, Cost and quality',
  },
  'query-by-committee': {
    description: 'Query-by-committee uses disagreement among models to select examples for labeling. JEDI Labs uses it in active learning for JEDI AutoTune™ to reduce labeling cost and improve model quality.',
    features: 'Committee of models, Disagreement metrics, Query selection, Integration with annotators, Batch and streaming',
  },
  'azure-data-lake': {
    description: 'Azure Data Lake Store holds large-scale data for analytics and ML. JEDI Labs uses Data Lake and Synapse when client data lives in Azure and feeds pipelines and JEDI-backed applications.',
    features: 'Hierarchical namespace, Security and access, Integration with Synapse and Spark, Performance and tiering, Multi-region',
  },
  'amazon-redshift': {
    description: 'Amazon Redshift is a cloud data warehouse for analytics. JEDI Labs uses Redshift for client analytics and reporting pipelines that support co-pilot data sources and dashboards.',
    features: 'Columnar storage, SQL and concurrency, Spectrum and external tables, ML and Python, Scaling and backup',
  },
  'apache-hive': {
    description: 'Apache Hive provides SQL over large datasets (e.g. HDFS, S3). JEDI Labs uses Hive and similar for legacy and batch analytics pipelines that feed data into JEDI-backed systems.',
    features: 'SQL and metastore, Partitioning and bucketing, Execution engines, UDFs and serialization, Integration with Spark and Presto',
  },
  datafold: {
    description: 'Datafold detects data quality and schema issues in pipelines. JEDI Labs uses Datafold and similar in dbt and ETL so bad data is caught before it affects JEDI Ensemble™ and models.',
    features: 'Diff and regression, Schema and distribution, CI and PR checks, Integration with dbt and Airflow, Alerts and reporting',
  },
  'power-bi': {
    description: 'Power BI is Microsoft\'s business analytics platform. JEDI Labs uses Power BI for client dashboards and reporting when the ecosystem is Microsoft and data feeds from co-pilot or pipelines.',
    features: 'Reports and dashboards, Data connectors, DAX and modeling, Sharing and embedding, Premium and embedded',
  },
  minikube: {
    description: 'Minikube runs a local Kubernetes cluster for development. JEDI Labs uses Minikube for local testing of co-pilot and ML services before deploying to managed K8s.',
    features: 'Single-node cluster, Addons and drivers, Dashboard and ingress, Multi-node and networking, CI and dev workflows',
  },
  'data-replication': {
    description: 'Data replication copies data across systems for availability and analytics. JEDI Labs uses replication for failover and data sync so co-pilot and pipelines stay consistent and resilient.',
    features: 'Sync and async replication, Conflict resolution, Monitoring and lag, Multi-region and DR, Integration with DBs and lakes',
  },
  'evidently-ai': {
    description: 'Evidently AI monitors ML model and data quality in production. JEDI Labs uses Evidently for drift and performance alerts so JEDI AutoTune™ and deployed models are monitored and debuggable.',
    features: 'Data and model drift, Reports and dashboards, Integration with pipelines, Alerts and thresholds, Open source and cloud',
  },
  'apache-ranger': {
    description: 'Apache Ranger manages security and access policies for Hadoop and related systems. JEDI Labs uses Ranger when client data platforms require fine-grained access control and audit.',
    features: 'Policies and permissions, Auditing and reporting, Plugins for Hive and Kafka, Integration with LDAP and Kerberos, Encryption',
  },
  'goal-oriented-planning': {
    description: 'Goal-oriented planning finds action sequences to achieve objectives. JEDI Labs uses it in JEDI Ensemble™ and agent planning when multi-step tasks and constraints matter.',
    features: 'Goals and preconditions, Plan generation and repair, Integration with LLMs and planners, Monitoring and replanning, Use in agents',
  },
  'meta-learning-systems': {
    description: 'Meta-learning (learning to learn) adapts quickly to new tasks with few examples. JEDI Labs uses meta-learning in JEDI AutoTune™ when clients need fast adaptation or few-shot capability.',
    features: 'MAML and variants, Few-shot and episodic training, Task distribution, Evaluation and deployment, Integration with transformers',
  },
  'aws-glue': {
    description: 'AWS Glue is a serverless ETL service for cataloging and transforming data. JEDI Labs uses Glue for data pipelines on AWS that feed data lakes and JEDI-backed applications.',
    features: 'Crawlers and catalog, ETL jobs and bookmarks, Spark and Python, Scheduling and monitoring, Integration with S3 and Redshift',
  },
  'seldon-core': {
    description: 'Seldon Core deploys ML models on Kubernetes with standard APIs. JEDI Labs uses Seldon for custom model serving that integrates with JEDI AutoTune™ and co-pilot when the stack is K8s.',
    features: 'REST and gRPC, Canary and A/B, Explainer and outlier detection, Multi-model and graph, Integration with MLflow',
  },
  'scale-ai': {
    description: 'Scale AI provides data labeling and model evaluation for ML. JEDI Labs uses Scale and similar for training data and evals that feed JEDI AutoTune™ and client model quality.',
    features: 'Labeling and QA, Eval and RLHF, API and integrations, Quality and SLAs, Security and compliance',
  },
  'diversity-sampling': {
    description: 'Diversity sampling selects a representative set of examples for labeling. JEDI Labs uses it in active learning to improve coverage and reduce bias in data that feeds JEDI AutoTune™.',
    features: 'Diversity metrics, Clustering and coverage, Batch selection, Integration with annotators, Cost and quality',
  },
  'kafka-connect': {
    description: 'Kafka Connect integrates Kafka with external systems via connectors. JEDI Labs uses Connect for source and sink connectors that move data in and out of Kafka for JEDI-backed pipelines.',
    features: 'Source and sink connectors, Single message transforms, Distributed and standalone, Offset management, Monitoring and scaling',
  },
  'apache-beam': {
    description: 'Apache Beam is a unified model for batch and streaming pipelines. JEDI Labs uses Beam with runners (Flink, Spark, Dataflow) for portable pipelines that feed JEDI-backed systems.',
    features: 'Batch and streaming API, Runners and portability, Windowing and triggers, Side inputs and state, Integration with Kafka and Pub/Sub',
  },
  dagster: {
    description: 'Dagster is a data orchestrator for assets and pipelines. JEDI Labs uses Dagster for ETL and ML pipelines that feed JEDI Ensemble™ and client data when teams prefer asset-based workflows.',
    features: 'Assets and ops, Scheduling and sensors, Testing and lineage, UI and observability, Integration with dbt and Spark',
  },
  'google-cloud-storage': {
    description: 'Google Cloud Storage is object storage for files and data lakes. JEDI Labs uses GCS for artifacts, model weights, and pipeline data when the cloud is GCP.',
    features: 'Buckets and objects, Versioning and lifecycle, Encryption and IAM, Event triggers, Integration with BigQuery and Dataflow',
  },
  'google-bigquery': {
    description: 'Google BigQuery is a serverless data warehouse for analytics. JEDI Labs uses BigQuery for client analytics and ML when the stack is GCP and data feeds JEDI-backed applications.',
    features: 'SQL and streaming, ML and BQML, External tables and federated, Partitioning and clustering, Integration with Dataflow and Vertex',
  },
  deequ: {
    description: 'Deequ checks data quality using metrics and constraints on Spark. JEDI Labs uses Deequ in data pipelines so quality issues are caught before data reaches JEDI Ensemble™ and models.',
    features: 'Metrics and constraints, Anomaly detection, Integration with Spark, Reporting and alerting, Programmatic and config',
  },
  looker: {
    description: 'Looker is a business intelligence platform with semantic modeling. JEDI Labs uses Looker for client dashboards and embedded analytics when data and reporting are central to the engagement.',
    features: 'LookML and semantic layer, Dashboards and explores, Embedding and API, Scheduling and alerts, Integration with warehouses',
  },
  localstack: {
    description: 'LocalStack emulates AWS services locally for development. JEDI Labs uses LocalStack for local testing of S3, Lambda, and other AWS-dependent code without cloud spend.',
    features: 'S3, Lambda, and 100+ services, Pro and community, Persistence and networking, CI and dev workflows, Compatibility and limits',
  },
  'failover-strategies': {
    description: 'Failover strategies switch traffic to standby when primary fails. JEDI Labs uses failover for co-pilot and APIs so clients get resilience and minimal downtime.',
    features: 'Health checks and routing, Active-passive and active-active, Data sync and consistency, Automation and runbooks, Multi-region',
  },
  'aws-iam': {
    description: 'AWS IAM manages identity and access for AWS resources. JEDI Labs uses IAM for least-privilege access to S3, Lambda, and SageMaker so co-pilot and pipelines are secure.',
    features: 'Users, roles, and policies, Federation and SSO, Resource-based policies, Boundaries and permission sets, Audit and compliance',
  },
  'execution-monitoring-system': {
    description: 'Execution monitoring tracks pipeline and job runs for failures and performance. JEDI Labs uses monitoring for Airflow, Prefect, and custom jobs so JEDI-backed pipelines are observable.',
    features: 'Run status and metrics, Alerts and escalation, Logs and traces, Dashboards and SLA, Integration with PagerDuty and Slack',
  },
  'performance-optimization-engine': {
    description: 'Performance optimization improves latency and throughput of systems. JEDI Labs uses optimization for co-pilot APIs, model serving, and pipelines so clients get fast, reliable responses.',
    features: 'Profiling and benchmarking, Caching and batching, Query and index tuning, Resource and cost optimization, Continuous improvement',
  },
  'fin-bert': {
    description: 'FinBERT and domain-specific BERT models adapt language models to finance. JEDI Labs uses domain BERTs from Hugging Face for classification and NER in AISO and client-specific NLP.',
    features: 'Pre-trained on domain text, Fine-tuning and adapters, Tokenization and masking, Integration with pipelines, Evaluation and deployment',
  },
  fivetran: {
    description: 'Fivetran syncs data from sources into the warehouse with managed connectors. JEDI Labs uses Fivetran for client data pipelines when standardized ingestion is preferred over custom ETL.',
    features: 'Connectors and normalization, Scheduling and monitoring, Schema drift and history, Security and compliance, Integration with dbt and BI',
  },
  snorkel: {
    description: 'Snorkel uses programmatic labeling to generate training data from rules. JEDI Labs uses Snorkel-style labeling to scale training data for JEDI AutoTune™ when labeled data is scarce.',
    features: 'Labeling functions, Noisy labels and denoising, Slicing and analysis, Integration with training, Active learning',
  },
  'apache-sqoop': {
    description: 'Apache Sqoop transfers bulk data between relational DBs and Hadoop. JEDI Labs uses Sqoop and similar when migrating or syncing legacy DB data into lakes for JEDI-backed pipelines.',
    features: 'Import and export, Connectors and format, Incremental and split, Integration with Hive and HDFS, Security and performance',
  },
  'google-dataflow': {
    description: 'Google Dataflow runs Apache Beam pipelines on GCP. JEDI Labs uses Dataflow for streaming and batch when the cloud is GCP and pipelines feed JEDI-backed applications.',
    features: 'Beam runner, Autoscaling and pricing, Windowing and state, Integration with Pub/Sub and BigQuery, Monitoring and debugging',
  },
  luigi: {
    description: 'Luigi is a Python pipeline framework with dependency graphs. JEDI Labs uses Luigi for batch pipelines when teams prefer Python-native workflows that feed data into JEDI-backed systems.',
    features: 'Tasks and dependencies, Parameter and scheduling, Visualization and monitoring, Integration with Hadoop and Spark, Extensibility',
  },
  'apache-hbase': {
    description: 'Apache HBase is a distributed wide-column store on HDFS. JEDI Labs uses HBase and similar when client workloads need low-latency random access at scale for JEDI-backed applications.',
    features: 'Column families and qualifiers, Scan and filter, Replication and compaction, Integration with Spark and Phoenix, Security and multi-tenancy',
  },
  'azure-synapse': {
    description: 'Azure Synapse Analytics unifies data warehousing and big data. JEDI Labs uses Synapse when client data and analytics are on Azure and feed JEDI-backed applications.',
    features: 'SQL and Spark pools, Data integration and pipelines, Serverless and dedicated, Security and monitoring, Integration with Power BI',
  },
  talend: {
    description: 'Talend provides data integration and quality tools. JEDI Labs uses Talend for client ETL and data quality when the organization standardizes on Talend for pipelines.',
    features: 'ETL and ELT, Data quality and catalog, Cloud and on-prem, Scheduling and monitoring, Integration with warehouses',
  },
  'soda-sql': {
    description: 'Soda SQL checks data quality with tests defined in YAML. JEDI Labs uses Soda in dbt and pipelines so quality issues are caught before data affects JEDI Ensemble™ and models.',
    features: 'Tests and metrics, Scan and schedule, Integration with dbt and Airflow, Alerts and reporting, Open source and cloud',
  },
  'state-management-planning': {
    description: 'State management in planning tracks world state across actions. JEDI Labs uses stateful planning in JEDI Ensemble™ agents when multi-step tasks and consistency matter.',
    features: 'State representation, Transitions and effects, Heuristics and search, Integration with LLMs, Replanning and recovery',
  },
  'adaptive-model-framework': {
    description: 'Adaptive model frameworks update models from feedback and new data. JEDI Labs uses adaptive frameworks in JEDI AutoTune™ so models improve with production data and user feedback.',
    features: 'Online and batch updates, Feedback loops, A/B and canary, Monitoring and rollback, Integration with serving',
  },
  'encryption-tools': {
    description: 'Encryption tools protect data at rest and in transit. JEDI Labs uses encryption for PII and PHI in co-pilot, CRMs, and pipelines to meet client and regulatory requirements.',
    features: 'Symmetric and asymmetric, Key management, HSM and vault integration, Compliance (FIPS, HIPAA), Audit and rotation',
  },
  'resource-allocation-engine': {
    description: 'Resource allocation assigns compute and storage to workloads. JEDI Labs uses allocation and autoscaling so co-pilot and pipelines get the right capacity without over-provisioning.',
    features: 'Scheduling and quotas, Autoscaling and spot, Multi-tenant fairness, Cost and utilization, Integration with K8s and clouds',
  },
  'feedback-loop-system': {
    description: 'Feedback loops capture user and system feedback to improve models. JEDI Labs uses feedback in JEDI AutoTune™ and recommendation systems so models adapt to real usage.',
    features: 'Collection and storage, Labeling and triage, Retraining triggers, A/B and evaluation, Integration with serving',
  },
  ontologies: {
    description: 'Ontologies define formal domain models and relationships. JEDI Labs uses ontologies for CrisPRO and knowledge-backed applications so JEDI Ensemble™ can reason over structured domain knowledge.',
    features: 'Classes and properties, Reasoning and inference, Integration with RDF and OWL, Use in knowledge graphs, Domain modeling',
  },
  ceph: {
    description: 'Ceph is distributed storage for object, block, and file. JEDI Labs uses Ceph when clients need on-prem or hybrid storage at scale for pipelines and artifacts.',
    features: 'RADOS and CRUSH, RBD and RGW, Erasure coding and replication, Integration with K8s and OpenStack, Monitoring and tuning',
  },
  'api-management-solutions': {
    description: 'API management handles gateway, auth, and analytics for APIs. JEDI Labs uses API management in front of co-pilot and backend APIs for security, rate limiting, and observability.',
    features: 'Gateway and routing, Auth and keys, Rate limiting and quotas, Analytics and monetization, Developer portal',
  },
  'constraint-solver-planning': {
    description: 'Constraint solvers find solutions that satisfy logical and numeric constraints. JEDI Labs uses constraint-based planning in JEDI Ensemble™ when scheduling and allocation have hard constraints.',
    features: 'Variables and constraints, Search and propagation, Optimization objectives, Integration with planners, Use in scheduling',
  },
  'model-versioning-system': {
    description: 'Model versioning tracks trained models and metadata. JEDI Labs uses versioning (e.g. MLflow, DVC) so JEDI AutoTune™ and deployments can reproduce and roll back model releases.',
    features: 'Artifacts and metadata, Lineage and tags, Stage transitions, Integration with training and serving, Audit and compliance',
  },
  'audit-logging': {
    description: 'Audit logging records who did what and when for compliance and security. JEDI Labs uses audit logs for co-pilot, APIs, and data access so clients meet regulatory and internal requirements.',
    features: 'Event capture and retention, User and resource context, Tamper-evident storage, Search and reporting, Integration with SIEM',
  },
  'message-queue-systems': {
    description: 'Message queues decouple producers and consumers for async processing. JEDI Labs uses queues (Kafka, SQS, Redis) for co-pilot events, pipeline stages, and JEDI Rules™ workflows.',
    features: 'Publish and subscribe, Ordering and partitioning, Retention and replay, Dead letter and retries, Integration with workers',
  },
  'plan-adaptation-system': {
    description: 'Plan adaptation revises plans when the world or goals change. JEDI Labs uses adaptation in JEDI Ensemble™ agents so replanning keeps multi-step tasks on track.',
    features: 'Replanning triggers, Partial plan reuse, Integration with execution, Monitoring and recovery, Use in agents',
  },
  'active-learning-framework': {
    description: 'Active learning frameworks select which examples to label next. JEDI Labs uses active learning to reduce labeling cost for JEDI AutoTune™ and client models while maintaining quality.',
    features: 'Query strategies, Uncertainty and diversity, Batch and streaming, Integration with annotators, Evaluation and iteration',
  },
  'service-mesh-architecture': {
    description: 'Service meshes manage traffic, security, and observability between services. JEDI Labs uses meshes (e.g. Istio) for co-pilot and API deployments on Kubernetes when mTLS and observability matter.',
    features: 'mTLS and auth, Traffic management and retries, Observability and tracing, Policy and rate limiting, Multi-cluster',
  },
  'task-recovery-framework': {
    description: 'Task recovery handles failures and retries in pipelines and agents. JEDI Labs uses recovery so JEDI Ensemble™ and pipelines can retry and resume without losing progress.',
    features: 'Checkpoints and state, Retry policies and backoff, Dead letter and alerting, Idempotency and replay, Integration with orchestrators',
  },
  'self-evaluation-system': {
    description: 'Self-evaluation lets models score or critique their own outputs. JEDI Labs uses self-eval in JEDI Ensemble™ for quality checks and filtering before returning responses to users.',
    features: 'Scoring and critique, Thresholds and routing, Integration with LLM APIs, Feedback and iteration, Use in agents',
  },
  'api-testing-frameworks': {
    description: 'API testing frameworks automate tests for REST and GraphQL. JEDI Labs uses them to test co-pilot and backend APIs so releases are reliable and contract-compliant.',
    features: 'Contract and integration tests, Mocking and fixtures, Load and security, CI and reporting, OpenAPI and schema',
  },
  'progress-analytics-planning': {
    description: 'Progress analytics track execution and outcomes of plans and pipelines. JEDI Labs uses progress analytics so clients and teams can see how JEDI-backed workflows are performing.',
    features: 'Metrics and dashboards, SLA and throughput, Alerts and trends, Integration with orchestrators, Reporting and export',
  },
  'knowledge-distillation-system': {
    description: 'Knowledge distillation compresses a large model into a smaller one. JEDI Labs uses distillation in JEDI AutoTune™ when deployment constraints require smaller, faster models without losing too much quality.',
    features: 'Teacher and student, Loss and temperature, Layer and response distillation, Evaluation and deployment, Integration with Hugging Face',
  },
  'short-term-memory-cache': {
    description: 'Short-term memory caches recent context for agents and APIs. JEDI Labs uses caches (e.g. Redis) for co-pilot session state and recent context so responses are fast and consistent.',
    features: 'TTL and eviction, Session and key design, Scaling and clustering, Integration with apps, Monitoring and hit rate',
  },
  d3js: {
    description: 'D3.js is a JavaScript library for data-driven documents and visualizations. JEDI Labs uses D3 for custom charts and interactive dashboards that surface co-pilot and pipeline metrics.',
    features: 'Data binding and DOM, Scales and axes, Transitions and animation, Maps and layouts, Integration with React and TypeScript',
  },
  'context-window-system': {
    description: 'Context window systems manage which tokens are visible to an LLM. JEDI Labs uses context management in JEDI Ensemble™ so long conversations and documents stay within model limits while preserving relevance.',
    features: 'Sliding and summarization, Chunking and retrieval, Priority and pruning, Integration with RAG, Token counting and limits',
  },
  'memory-optimization-engine': {
    description: 'Memory optimization reduces footprint and latency for models and caches. JEDI Labs uses optimization so co-pilot and serving can handle more concurrent users and larger contexts within budget.',
    features: 'Quantization and pruning, Cache and eviction, Batching and prefetch, Profiling and tuning, Integration with runtimes',
  },
  'context-priority-queue': {
    description: 'Context priority queues rank and select which context to include for an LLM. JEDI Labs uses priority in JEDI Ensemble™ RAG and agents so the most relevant context is used within window limits.',
    features: 'Scoring and ranking, Recency and relevance, Budget and limits, Integration with retrieval, Eviction and refresh',
  },
  'med-bert': {
    description: 'Med-BERT and biomedical language models are pre-trained on medical text. JEDI Labs uses them for CrisPRO and healthcare NLP when clinical terminology and evidence matter.',
    features: 'Biomedical pre-training, NER and relation extraction, Fine-tuning for tasks, Integration with Hugging Face, Evaluation and deployment',
  },
  'test-technology-1756930244264': {
    description: 'Test technology entry for schema and migration validation. Used by JEDI Labs to verify Hygraph technology model and scripts; can be archived or removed in production.',
    features: 'Test slug, Schema validation, Migration testing, Placeholder for QA',
  },
  'test-tech-category-1756930244560': {
    description: 'Test technology with category for schema and migration validation. Used by JEDI Labs to verify category relationships and scripts; can be archived or removed in production.',
    features: 'Test slug, Category linkage, Schema validation, Migration testing',
  },
};

// Final fix: remove slop phrases and add JEDI where missing (no generic "comprehensive", all have JEDI).
const FINAL_FIX = {
  langchain: {
    description: 'LangChain is a unified framework for developing applications powered by large language models (LLMs). It provides a single interface for building complex AI applications with memory, agents, and tool integration. JEDI Labs uses LangChain to shorten AI development timelines by 60–80% and build conversational AI systems.',
    features: 'LLM Integration & Orchestration, Memory & Context Management, Agent-based AI Workflows, Tool & API Integration, Retrieval-Augmented Generation (RAG), Multi-step Reasoning Chains, Document Analysis & Processing, Conversational AI Development',
  },
  gpus: {
    description: 'Graphics Processing Units are specialized hardware for parallel compute, with thousands of cores suited to matrix and ML workloads. JEDI Labs uses GPUs for training and inference in JEDI AutoTune™ and custom model pipelines when throughput and latency matter.',
    features: 'Parallel processing architecture, CUDA/ROCm programming, Matrix operations, Memory bandwidth optimization, Multi-GPU scaling',
  },
  tpus: {
    description: 'Tensor Processing Units are Google’s AI accelerator ASICs for neural network training and inference, especially with TensorFlow. JEDI Labs uses TPUs on GCP for large-scale training and Vertex AI when clients need maximum throughput.',
    features: 'Matrix multiplication optimization, Dedicated ML architecture, Cloud TPU pods, Automatic optimization',
  },
  horovod: {
    description: 'Horovod is an open-source distributed deep learning framework for fast multi-GPU and multi-node training. JEDI Labs uses Horovod when JEDI AutoTune™ or client models require distributed training at scale.',
    features: 'Ring-allreduce architecture, Multi-GPU training, Framework agnostic, MPI integration',
  },
  'new-relic': {
    description: 'New Relic is a full-stack observability platform for monitoring, troubleshooting, and optimizing applications and infrastructure. JEDI Labs uses New Relic for co-pilot, APIs, and pipelines in production so we can meet SLAs and debug issues quickly.',
    features: 'APM, Infrastructure monitoring, Distributed tracing, Error tracking, Real-time analytics, Custom dashboards, ML-powered anomaly detection',
  },
  kfserving: {
    description: 'KFServing is a Kubernetes-native platform for serving ML models with serverless inferencing and auto-scaling. JEDI Labs uses KFServing and similar (e.g. Seldon, Ray Serve) for model endpoints that JEDI AutoTune™ and co-pilots call.',
    features: 'Serverless inferencing, Multi-framework support, Automatic scaling, Request batching, Canary rollouts',
  },
};

const UPDATE_MUTATION = `
  mutation UpdateTechnology($id: ID!, $description: String, $features: String) {
    updateTechnology(where: { id: $id }, data: { description: $description, features: $features }) {
      id
      name
      slug
      description
      features
    }
  }
`;

async function main() {
  if (!ENDPOINT || !TOKEN) {
    console.error('Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN');
    process.exit(1);
  }

  const rawPath = new URL('../../../all_technologies_raw.json', import.meta.url);
  const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  const hasSlop = (t) =>
    (t.description || '').includes(SLOP_DESC) || (t.features || '').includes(SLOP_FEAT);

  let ok = 0;
  let err = 0;

  const toFix = data.filter((t) => hasSlop(t) && CONTENT_MAP[t.slug]);
  if (toFix.length > 0) {
    console.log(`De-slopping ${toFix.length} technologies...\n`);
    for (const tech of toFix) {
      const content = CONTENT_MAP[tech.slug];
      if (!content || content.description.length < 100 || content.features.length < 30) {
        console.log(`⏭ Skip ${tech.slug}: content too short or missing`);
        continue;
      }
      const result = await makeRequest(UPDATE_MUTATION, {
        id: tech.id,
        description: content.description,
        features: content.features,
      });
      if (result.error || result.errors) {
        console.log(`❌ ${tech.slug}: ${result.error || result.errors?.[0]?.message}`);
        err++;
      } else {
        console.log(`✅ ${tech.slug}`);
        ok++;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const toFill = data.filter(
    (t) => (!strictDesc(t) || !strictFeat(t)) && FILL_MAP[t.slug]
  );
  if (toFill.length > 0) {
    console.log(`\nFill minimum: ${toFill.length} technologies (of ${Object.keys(FILL_MAP).length} in FILL_MAP)...\n`);
    for (const tech of toFill) {
      const content = FILL_MAP[tech.slug];
      if (!content || content.description.length < 100 || content.features.length < 30) {
        console.log(`⏭ Skip ${tech.slug}: content too short or missing`);
        continue;
      }
      const result = await makeRequest(UPDATE_MUTATION, {
        id: tech.id,
        description: content.description,
        features: content.features,
      });
      if (result.error || result.errors) {
        console.log(`❌ ${tech.slug}: ${result.error || result.errors?.[0]?.message}`);
        err++;
      } else {
        console.log(`✅ ${tech.slug}`);
        ok++;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const toFinalFix = data.filter((t) => FINAL_FIX[t.slug]);
  if (toFinalFix.length > 0) {
    console.log(`\nFinal fix (no slop, JEDI): ${toFinalFix.length} technologies...\n`);
    for (const tech of toFinalFix) {
      const content = FINAL_FIX[tech.slug];
      if (!content || content.description.length < 100 || content.features.length < 30) {
        console.log(`⏭ Skip ${tech.slug}: content too short or missing`);
        continue;
      }
      const result = await makeRequest(UPDATE_MUTATION, {
        id: tech.id,
        description: content.description,
        features: content.features,
      });
      if (result.error || result.errors) {
        console.log(`❌ ${tech.slug}: ${result.error || result.errors?.[0]?.message}`);
        err++;
      } else {
        console.log(`✅ ${tech.slug}`);
        ok++;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  console.log(`\nDone. Updated: ${ok}, errors: ${err}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
