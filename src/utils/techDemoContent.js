/**
 * techDemoContent.js
 *
 * Generates consistent, contextual demo content for any technology
 * from its existing Hygraph metadata (name, description, features,
 * category, subcategories). No Hygraph writes required.
 *
 * Exports:
 *   generateTechQuestions(tech)    → string[4]
 *   generateTechCodeSnippet(tech)  → { language, title, description, code }
 *   generateTechFlowSteps(tech)    → { step: string, description: string }[]
 *   buildSyntheticUseCase(tech)    → useCase-shaped object for openAIService
 *   isSlop(additonalDetails)       → boolean
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const parseStringOrArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) { /* not JSON */ }
  return val.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean);
};

export const isSlop = (text) => {
  if (!text) return true;
  if (text.length < 400) return true;
  if (/^What it is:/m.test(text)) return true;
  if (/^How it works:/m.test(text)) return true;
  return false;
};

const getName = (tech) => tech?.name || 'This technology';
const getSlug = (tech) => tech?.slug || '';
const getCatName = (tech) => tech?.category?.[0]?.name || '';
const getSubName = (tech) => tech?.subcategories?.[0]?.name || '';

// ─── Question templates keyed by subcategory name ─────────────────────────────

const QUESTION_TEMPLATES = {
  // AI Agents
  'Agent Core': (t) => [
    `How does ${getName(t)} orchestrate multi-step agent workflows?`,
    `Show me a production agent with tool use and memory`,
    `How does ${getName(t)} handle failures and retries mid-chain?`,
    `What's the latency profile for real-time agent responses?`,
  ],
  'Reasoning': (t) => [
    `How does ${getName(t)} implement chain-of-thought reasoning?`,
    `Show me a ReAct loop with tool calls`,
    `How does ${getName(t)} handle ambiguous or conflicting inputs?`,
    `What reasoning patterns work best for multi-hop questions?`,
  ],
  'Memory': (t) => [
    `How does ${getName(t)} persist context across sessions?`,
    `Show me a long-term memory setup with retrieval`,
    `How does ${getName(t)} handle memory eviction and prioritization?`,
    `What's the tradeoff between short-term and long-term memory?`,
  ],
  'Vector Databases': (t) => [
    `How does ${getName(t)} handle high-dimensional similarity search?`,
    `Show me an end-to-end RAG pipeline with ${getName(t)}`,
    `How does ${getName(t)} scale to billions of vectors?`,
    `What indexing strategy gives the best recall/latency tradeoff?`,
  ],
  'Tool Integration': (t) => [
    `How does ${getName(t)} connect agents to external APIs?`,
    `Show me a tool definition with error handling`,
    `How does ${getName(t)} handle rate limits and retries?`,
    `What's the pattern for chaining multiple tool calls?`,
  ],
  'Protocols': (t) => [
    `How does ${getName(t)} handle authentication and authorization?`,
    `Show me a streaming response implementation`,
    `How does ${getName(t)} manage connection pooling at scale?`,
    `What's the error handling pattern for network failures?`,
  ],
  'Frameworks': (t) => [
    `How does ${getName(t)} integrate with AI backends?`,
    `Show me a component with real-time AI streaming`,
    `How does ${getName(t)} handle state management for AI responses?`,
    `What's the pattern for optimistic UI updates with AI?`,
  ],
  'Interfaces': (t) => [
    `How does ${getName(t)} handle multi-turn conversations?`,
    `Show me a voice interface with fallback to text`,
    `How does ${getName(t)} manage session state across channels?`,
    `What's the latency budget for real-time voice responses?`,
  ],
  'Caching': (t) => [
    `How does ${getName(t)} cache LLM responses to cut costs?`,
    `Show me a semantic cache with TTL and invalidation`,
    `How does ${getName(t)} handle cache warming for cold starts?`,
    `What's the hit rate for production AI response caching?`,
  ],
  'Databases': (t) => [
    `How does ${getName(t)} handle schema evolution without downtime?`,
    `Show me a connection pool setup for high-concurrency AI workloads`,
    `How does ${getName(t)} integrate with vector search?`,
    `What's the query pattern for agent state persistence?`,
  ],

  // Data Engineering
  'data ingestion': (t) => [
    `How does ${getName(t)} handle schema-on-read for unstructured data?`,
    `Show me a fault-tolerant ingestion pipeline with dead-letter queues`,
    `How does ${getName(t)} scale to millions of events per second?`,
    `What's the exactly-once delivery guarantee pattern?`,
  ],
  'Ingestion': (t) => [
    `How does ${getName(t)} handle schema-on-read for unstructured data?`,
    `Show me a fault-tolerant ingestion pipeline with dead-letter queues`,
    `How does ${getName(t)} scale to millions of events per second?`,
    `What's the exactly-once delivery guarantee pattern?`,
  ],
  'Orchestration': (t) => [
    `How does ${getName(t)} handle DAG dependencies and retries?`,
    `Show me a production pipeline with SLA monitoring`,
    `How does ${getName(t)} manage backfills for historical data?`,
    `What's the pattern for dynamic task generation?`,
  ],
  'Storage': (t) => [
    `How does ${getName(t)} handle petabyte-scale data efficiently?`,
    `Show me a lifecycle policy for hot/warm/cold data tiers`,
    `How does ${getName(t)} ensure durability and consistency?`,
    `What's the cost optimization pattern for infrequent access?`,
  ],
  'Data Warehousing': (t) => [
    `How does ${getName(t)} separate compute from storage for cost control?`,
    `Show me a dbt model running on ${getName(t)}`,
    `How does ${getName(t)} handle concurrent query workloads?`,
    `What's the time travel and cloning pattern for data recovery?`,
  ],
  'Warehousing': (t) => [
    `How does ${getName(t)} separate compute from storage for cost control?`,
    `Show me a dbt model running on ${getName(t)}`,
    `How does ${getName(t)} handle concurrent query workloads?`,
    `What's the time travel and cloning pattern for data recovery?`,
  ],
  'Transformation': (t) => [
    `How does ${getName(t)} handle incremental vs full-refresh models?`,
    `Show me a data lineage setup with tests`,
    `How does ${getName(t)} manage dependencies across models?`,
    `What's the pattern for slowly changing dimensions?`,
  ],
  'Data Quality': (t) => [
    `How does ${getName(t)} catch data drift before it hits production?`,
    `Show me a test suite for a critical business metric`,
    `How does ${getName(t)} integrate into CI/CD pipelines?`,
    `What's the alerting pattern for quality failures?`,
  ],
  'Quality': (t) => [
    `How does ${getName(t)} catch data drift before it hits production?`,
    `Show me a test suite for a critical business metric`,
    `How does ${getName(t)} integrate into CI/CD pipelines?`,
    `What's the alerting pattern for quality failures?`,
  ],
  'Visualization': (t) => [
    `How does ${getName(t)} handle real-time dashboard updates?`,
    `Show me an embedded analytics setup`,
    `How does ${getName(t)} manage row-level security for multi-tenant data?`,
    `What's the pattern for AI-generated chart recommendations?`,
  ],
  'Security': (t) => [
    `How does ${getName(t)} enforce column-level access control?`,
    `Show me a data masking setup for PII fields`,
    `How does ${getName(t)} audit data access for compliance?`,
    `What's the encryption pattern for data at rest and in transit?`,
  ],

  // AI/ML
  'Model Training': (t) => [
    `How does ${getName(t)} handle distributed training across GPUs?`,
    `Show me a fine-tuning pipeline with checkpointing`,
    `How does ${getName(t)} manage hyperparameter search at scale?`,
    `What's the pattern for resuming interrupted training runs?`,
  ],
  'Model Serving': (t) => [
    `How does ${getName(t)} handle model versioning and A/B testing?`,
    `Show me a canary deployment with automatic rollback`,
    `How does ${getName(t)} scale inference under variable load?`,
    `What's the latency SLA pattern for real-time serving?`,
  ],
  'Inference API': (t) => [
    `How does ${getName(t)} handle batching for throughput optimization?`,
    `Show me a streaming inference endpoint`,
    `How does ${getName(t)} manage model warm-up and cold starts?`,
    `What's the pattern for multi-model routing?`,
  ],
  'Monitoring & Logging': (t) => [
    `How does ${getName(t)} detect model drift in production?`,
    `Show me a dashboard for tracking prediction quality over time`,
    `How does ${getName(t)} correlate model metrics with business KPIs?`,
    `What's the alerting pattern for sudden accuracy drops?`,
  ],
  'ML Monitoring': (t) => [
    `How does ${getName(t)} detect feature drift vs concept drift?`,
    `Show me a statistical test for distribution shift`,
    `How does ${getName(t)} trigger retraining automatically?`,
    `What's the baseline comparison pattern for model degradation?`,
  ],
  'Feedback Loop': (t) => [
    `How does ${getName(t)} close the loop from prediction to label?`,
    `Show me a human-in-the-loop annotation workflow`,
    `How does ${getName(t)} handle label noise and disagreement?`,
    `What's the active learning trigger pattern?`,
  ],
  'Data Labeling': (t) => [
    `How does ${getName(t)} handle consensus across multiple annotators?`,
    `Show me a programmatic labeling setup with weak supervision`,
    `How does ${getName(t)} prioritize samples for labeling?`,
    `What's the quality control pattern for label accuracy?`,
  ],
  'Active Learning': (t) => [
    `How does ${getName(t)} select the most informative samples?`,
    `Show me an uncertainty sampling loop with model retraining`,
    `How does ${getName(t)} balance exploration vs exploitation?`,
    `What's the stopping criterion for active learning?`,
  ],
  'Data Processing': (t) => [
    `How does ${getName(t)} handle streaming vs batch processing?`,
    `Show me a fault-tolerant processing pipeline`,
    `How does ${getName(t)} scale to petabyte workloads?`,
    `What's the windowing pattern for time-series aggregation?`,
  ],
  'Analytics Environment': (t) => [
    `How does ${getName(t)} handle collaborative notebook workflows?`,
    `Show me a reproducible experiment setup`,
    `How does ${getName(t)} manage compute resources for large datasets?`,
    `What's the pattern for sharing results across teams?`,
  ],

  // Automation / Continuous Learning
  'Distributed Computing': (t) => [
    `How does ${getName(t)} distribute work across a cluster?`,
    `Show me a parallel hyperparameter search`,
    `How does ${getName(t)} handle node failures mid-job?`,
    `What's the scheduling pattern for heterogeneous workloads?`,
  ],
  'Alerting': (t) => [
    `How does ${getName(t)} route alerts to the right on-call team?`,
    `Show me an escalation policy with deduplication`,
    `How does ${getName(t)} integrate with incident management?`,
    `What's the pattern for alert fatigue reduction?`,
  ],
  'Deployment': (t) => [
    `How does ${getName(t)} handle zero-downtime deployments?`,
    `Show me a blue-green deployment with health checks`,
    `How does ${getName(t)} manage rollbacks automatically?`,
    `What's the pattern for canary releases with traffic splitting?`,
  ],

  // System Integration
  'RESTful Services': (t) => [
    `How does ${getName(t)} handle versioning and backward compatibility?`,
    `Show me a rate-limited API with retry logic`,
    `How does ${getName(t)} manage authentication across services?`,
    `What's the pattern for idempotent POST requests?`,
  ],
  'Authentication': (t) => [
    `How does ${getName(t)} handle token refresh and revocation?`,
    `Show me a JWT validation middleware`,
    `How does ${getName(t)} integrate with enterprise SSO?`,
    `What's the pattern for service-to-service authentication?`,
  ],
  'Authorization': (t) => [
    `How does ${getName(t)} implement attribute-based access control?`,
    `Show me a policy enforcement point setup`,
    `How does ${getName(t)} handle dynamic permissions?`,
    `What's the pattern for multi-tenant authorization?`,
  ],
  'Compliance': (t) => [
    `How does ${getName(t)} enforce data residency requirements?`,
    `Show me a GDPR-compliant data deletion workflow`,
    `How does ${getName(t)} generate audit trails for regulators?`,
    `What's the pattern for consent management?`,
  ],
  'Data Protection': (t) => [
    `How does ${getName(t)} handle encryption key rotation?`,
    `Show me a field-level encryption setup for PII`,
    `How does ${getName(t)} implement data masking for non-prod environments?`,
    `What's the pattern for secure data sharing across teams?`,
  ],
  'Ontologies': (t) => [
    `How does ${getName(t)} represent domain knowledge for AI reasoning?`,
    `Show me a knowledge graph query for entity relationships`,
    `How does ${getName(t)} handle ontology versioning and evolution?`,
    `What's the pattern for linking ontologies to vector embeddings?`,
  ],
};

// ─── Category-level fallback questions ────────────────────────────────────────

const CATEGORY_QUESTIONS = {
  'AI Agents': (t) => [
    `How does ${getName(t)} fit into a multi-agent architecture?`,
    `Show me a production deployment pattern for ${getName(t)}`,
    `How does ${getName(t)} handle context and state management?`,
    `What's the integration pattern with a multi-model routing layer?`,
  ],
  'Data Engineering': (t) => [
    `How does ${getName(t)} fit into a modern data stack?`,
    `Show me a production pipeline using ${getName(t)}`,
    `How does ${getName(t)} handle failures and data quality?`,
    `What's the scaling pattern for enterprise workloads?`,
  ],
  'AI/ML': (t) => [
    `How does ${getName(t)} accelerate model development?`,
    `Show me a production ML workflow with ${getName(t)}`,
    `How does ${getName(t)} handle model versioning and reproducibility?`,
    `What's the monitoring pattern for production models?`,
  ],
  'Machine-Learning': (t) => [
    `How does ${getName(t)} fit into the ML lifecycle?`,
    `Show me a training and serving pipeline with ${getName(t)}`,
    `How does ${getName(t)} handle distributed workloads?`,
    `What's the observability pattern for ML systems?`,
  ],
  'Automation': (t) => [
    `How does ${getName(t)} automate complex multi-step workflows?`,
    `Show me a production automation with error handling`,
    `How does ${getName(t)} integrate with existing systems?`,
    `What's the monitoring pattern for automated pipelines?`,
  ],
  'Continuous Learning': (t) => [
    `How does ${getName(t)} enable models to improve over time?`,
    `Show me a feedback loop from production to retraining`,
    `How does ${getName(t)} handle distribution shift?`,
    `What's the pattern for safe continuous learning?`,
  ],
  'Frontend Development': (t) => [
    `How does ${getName(t)} integrate with AI backends?`,
    `Show me a real-time AI streaming UI component`,
    `How does ${getName(t)} handle loading and error states for AI?`,
    `What's the pattern for optimistic updates with AI responses?`,
  ],
  'Security': (t) => [
    `How does ${getName(t)} protect sensitive AI workloads?`,
    `Show me a zero-trust setup for AI APIs`,
    `How does ${getName(t)} handle compliance requirements?`,
    `What's the audit pattern for AI system access?`,
  ],
};

// ─── Generic fallback questions ───────────────────────────────────────────────

const genericQuestions = (t) => {
  const features = parseStringOrArray(t.features).slice(0, 2);
  return [
    `How does ${getName(t)} work in a production AI system?`,
    features[0] ? `Show me ${features[0].toLowerCase()} in action` : `Show me a quickstart example`,
    `How does ${getName(t)} integrate with the JEDI stack?`,
    features[1] ? `What's the pattern for ${features[1].toLowerCase()}?` : `What are the key performance characteristics?`,
  ];
};

export const generateTechQuestions = (tech) => {
  const sub = getSubName(tech);
  const cat = getCatName(tech);
  if (QUESTION_TEMPLATES[sub]) return QUESTION_TEMPLATES[sub](tech);
  if (CATEGORY_QUESTIONS[cat]) return CATEGORY_QUESTIONS[cat](tech);
  return genericQuestions(tech);
};

// ─── Code snippet templates ───────────────────────────────────────────────────

const CODE_TEMPLATES = {
  'Agent Core': (t) => ({
    language: 'python',
    title: `${getName(t)} — Agent Quickstart`,
    description: `Create a production-ready agent with tool use, memory, and streaming in under 20 lines.`,
    code: `from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic
from langgraph.prebuilt import create_react_agent

# Define tools your agent can use
@tool
def search_knowledge_base(query: str) -> str:
    """Search the JEDI knowledge base for relevant information."""
    # Connect to your vector store
    results = vector_store.similarity_search(query, k=3)
    return "\\n".join([doc.page_content for doc in results])

@tool  
def get_client_data(client_id: str) -> dict:
    """Retrieve client data from CRM."""
    return crm_client.get(client_id)

# Initialize ${getName(t)} agent
model = ChatAnthropic(model="claude-3-5-sonnet-20241022")
agent = create_react_agent(
    model=model,
    tools=[search_knowledge_base, get_client_data],
    state_modifier="You are a JEDI AI assistant. Use tools to answer accurately."
)

# Stream responses for real-time UX
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "What are the latest insights for client ABC?"}]},
    stream_mode="values"
):
    chunk["messages"][-1].pretty_print()`,
  }),

  'Reasoning': (t) => ({
    language: 'python',
    title: `${getName(t)} — Chain-of-Thought Implementation`,
    description: `Implement structured reasoning with step-by-step verification for complex decision support.`,
    code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from pydantic import BaseModel, Field

class ReasoningStep(BaseModel):
    thought: str = Field(description="Current reasoning step")
    action: str = Field(description="Action to take based on thought")
    observation: str = Field(description="Result of the action")

class FinalAnswer(BaseModel):
    reasoning_chain: list[ReasoningStep]
    conclusion: str = Field(description="Final answer with confidence")
    confidence: float = Field(ge=0, le=1)

# ${getName(t)} prompt with structured output
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a ${getName(t)} reasoning engine.
    Think step by step. For each step:
    1. State your current thought
    2. Decide what action to take  
    3. Observe the result
    Continue until you reach a confident conclusion."""),
    ("human", "{question}")
])

model = ChatAnthropic(model="claude-3-5-sonnet-20241022")
chain = prompt | model.with_structured_output(FinalAnswer)

result = chain.invoke({
    "question": "Should we recommend treatment protocol A or B for this patient profile?"
})

print(f"Confidence: {result.confidence:.0%}")
for step in result.reasoning_chain:
    print(f"→ {step.thought}")
print(f"Conclusion: {result.conclusion}")`,
  }),

  'Memory': (t) => ({
    language: 'python',
    title: `${getName(t)} — Persistent Agent Memory`,
    description: `Implement long-term memory that persists across sessions using vector storage and structured recall.`,
    code: `from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
import uuid

# ${getName(t)}: Vector-backed long-term memory
embeddings = OpenAIEmbeddings()
long_term_memory = Chroma(
    collection_name="agent_memory",
    embedding_function=embeddings,
    persist_directory="./memory_store"
)

def remember(content: str, metadata: dict = {}):
    """Store a memory with semantic indexing."""
    long_term_memory.add_texts(
        texts=[content],
        metadatas=[{"timestamp": datetime.now().isoformat(), **metadata}]
    )

def recall(query: str, k: int = 3) -> list[str]:
    """Retrieve relevant memories by semantic similarity."""
    docs = long_term_memory.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]

# Short-term memory via LangGraph checkpointing
checkpointer = MemorySaver()
agent = create_react_agent(model, tools, checkpointer=checkpointer)

# Each thread_id maintains its own conversation history
thread_id = str(uuid.uuid4())
config = {"configurable": {"thread_id": thread_id}}

# Memory persists across invocations
response1 = agent.invoke({"messages": [HumanMessage("My name is Sarah")]}, config)
response2 = agent.invoke({"messages": [HumanMessage("What's my name?")]}, config)
# Agent correctly recalls: "Your name is Sarah"`,
  }),

  'Vector Databases': (t) => ({
    language: 'python',
    title: `${getName(t)} — Production RAG Pipeline`,
    description: `Build a retrieval-augmented generation system with semantic search, reranking, and streaming.`,
    code: `from langchain_community.vectorstores import ${getName(t).replace(/\s+/g, '')}
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Initialize ${getName(t)} with OpenAI embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vector_store = ${getName(t).replace(/\s+/g, '')}(
    embedding_function=embeddings,
    collection_name="jedi_knowledge_base",
    # Production: use managed ${getName(t)} instance
)

# Index documents with smart chunking
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200,
    separators=["\\n\\n", "\\n", ". ", " "]
)

def index_documents(docs):
    chunks = splitter.split_documents(docs)
    vector_store.add_documents(chunks)
    print(f"Indexed {len(chunks)} chunks from {len(docs)} documents")

# Build RAG chain with streaming
retriever = vector_store.as_retriever(
    search_type="mmr",  # Maximal Marginal Relevance for diversity
    search_kwargs={"k": 6, "fetch_k": 20}
)

rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | ChatPromptTemplate.from_template(
        "Answer based on context:\\n{context}\\n\\nQuestion: {question}"
    )
    | ChatOpenAI(model="gpt-4o", streaming=True)
    | StrOutputParser()
)

# Stream the response
for chunk in rag_chain.stream("What are JEDI's AI agent capabilities?"):
    print(chunk, end="", flush=True)`,
  }),

  'Tool Integration': (t) => ({
    language: 'python',
    title: `${getName(t)} — Agent Tool Definitions`,
    description: `Define typed, validated tools that agents can call with automatic error handling and retry logic.`,
    code: `from langchain_core.tools import tool, StructuredTool
from pydantic import BaseModel, Field
from typing import Optional
import httpx

# ${getName(t)}: Typed tool with validation
class CRMQueryInput(BaseModel):
    client_id: str = Field(description="Client identifier")
    fields: list[str] = Field(default=["name", "status", "last_contact"])

@tool(args_schema=CRMQueryInput)
def query_crm(client_id: str, fields: list[str]) -> dict:
    """Query the CRM system for client information.
    Use this when you need current client data, status, or history."""
    response = httpx.get(
        f"https://api.crm.internal/clients/{client_id}",
        params={"fields": ",".join(fields)},
        headers={"Authorization": f"Bearer {CRM_TOKEN}"},
        timeout=5.0
    )
    response.raise_for_status()
    return response.json()

# Tool with retry logic for unreliable external APIs
from tenacity import retry, stop_after_attempt, wait_exponential

@tool
@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def fetch_market_data(symbol: str, period: str = "1d") -> dict:
    """Fetch real-time market data. Retries automatically on failure."""
    return market_api.get_quote(symbol, period=period)

# Register tools with agent
tools = [query_crm, fetch_market_data]
agent = create_react_agent(model, tools)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Get the latest data for client C-123"}]
})`,
  }),

  'Protocols': (t) => ({
    language: 'python',
    title: `${getName(t)} — API Communication Patterns`,
    description: `Implement robust API communication with authentication, streaming, and error handling.`,
    code: `import httpx
import asyncio
from typing import AsyncIterator

# ${getName(t)}: Async streaming client
class JEDIAPIClient:
    def __init__(self, base_url: str, api_key: str):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=httpx.Timeout(30.0, connect=5.0)
        )
    
    async def stream_completion(
        self, 
        prompt: str,
        model: str = "claude-3-5-sonnet"
    ) -> AsyncIterator[str]:
        """Stream AI completions token by token."""
        async with self.client.stream(
            "POST", "/v1/completions",
            json={"prompt": prompt, "model": model, "stream": True}
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = json.loads(line[6:])
                    if token := data.get("token"):
                        yield token

    async def batch_embed(self, texts: list[str]) -> list[list[float]]:
        """Batch embedding with automatic chunking."""
        BATCH_SIZE = 100
        all_embeddings = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i:i + BATCH_SIZE]
            response = await self.client.post(
                "/v1/embeddings",
                json={"texts": batch, "model": "text-embedding-3-large"}
            )
            all_embeddings.extend(response.json()["embeddings"])
        return all_embeddings

# Usage
async def main():
    client = JEDIAPIClient("https://api.jedilabs.org", API_KEY)
    async for token in client.stream_completion("Analyze this patient case..."):
        print(token, end="", flush=True)

asyncio.run(main())`,
  }),

  'Frameworks': (t) => ({
    language: 'jsx',
    title: `${getName(t)} — AI-Powered Component`,
    description: `Build a real-time AI interface component with streaming, error boundaries, and optimistic updates.`,
    code: `import { useState, useCallback, useRef } from 'react';

// ${getName(t)}: AI streaming hook
function useAIStream(endpoint) {
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const stream = useCallback(async (prompt) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    
    setIsStreaming(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortRef.current.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setResponse(prev => prev + chunk);
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setIsStreaming(false);
    }
  }, [endpoint]);

  return { response, isStreaming, error, stream };
}

// AI Chat Component
export function JEDIAssistant({ systemPrompt }) {
  const [input, setInput] = useState('');
  const { response, isStreaming, stream } = useAIStream('/api/ai/stream');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap">
        {response || <span className="text-gray-400">Ask anything...</span>}
        {isStreaming && <span className="animate-pulse">▊</span>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); stream(input); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your query..."
          className="w-full p-3 border-t"
        />
      </form>
    </div>
  );
}`,
  }),

  'Interfaces': (t) => ({
    language: 'javascript',
    title: `${getName(t)} — Conversational Interface`,
    description: `Build a multi-channel AI interface supporting chat, voice, and mobile with unified session state.`,
    code: `// ${getName(t)}: Unified conversation interface
class JEDIConversationInterface {
  constructor(config) {
    this.sessionId = crypto.randomUUID();
    this.history = [];
    this.config = {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 2048,
      systemPrompt: config.systemPrompt,
      ...config
    };
  }

  async send(message, channel = 'text') {
    // Normalize input across channels (text, voice transcript, mobile)
    const normalized = this.normalizeInput(message, channel);
    
    this.history.push({ role: 'user', content: normalized });

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: this.history,
        system: this.config.systemPrompt,
        session_id: this.sessionId,
      })
    });

    const { content, usage } = await response.json();
    this.history.push({ role: 'assistant', content });

    // Route response back to appropriate channel
    return this.formatForChannel(content, channel);
  }

  normalizeInput(input, channel) {
    if (channel === 'voice') return input.transcript;
    if (channel === 'mobile') return input.text || input.message;
    return input;
  }

  formatForChannel(content, channel) {
    if (channel === 'voice') return { ssml: this.toSSML(content), text: content };
    return { text: content, markdown: content };
  }
}

// Usage across channels
const assistant = new JEDIConversationInterface({
  systemPrompt: "You are a JEDI AI assistant for healthcare professionals."
});

// Text channel
const textReply = await assistant.send("What's the protocol for patient X?", 'text');

// Voice channel (from Retell/Twilio)
const voiceReply = await assistant.send({ transcript: "What medications?" }, 'voice');`,
  }),

  'Caching': (t) => ({
    language: 'python',
    title: `${getName(t)} — Semantic AI Response Cache`,
    description: `Cut LLM costs by 60%+ with semantic caching — cache by meaning, not exact string match.`,
    code: `import redis
import hashlib
import json
import numpy as np
from openai import OpenAI

# ${getName(t)}: Semantic cache for LLM responses
class SemanticCache:
    def __init__(self, redis_url: str, similarity_threshold: float = 0.92):
        self.redis = redis.from_url(redis_url)
        self.openai = OpenAI()
        self.threshold = similarity_threshold
        self.TTL = 3600 * 24  # 24 hours
    
    def _embed(self, text: str) -> list[float]:
        response = self.openai.embeddings.create(
            input=text, model="text-embedding-3-small"
        )
        return response.data[0].embedding
    
    def _cosine_similarity(self, a: list, b: list) -> float:
        a, b = np.array(a), np.array(b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
    
    def get(self, query: str) -> str | None:
        """Find semantically similar cached response."""
        query_embedding = self._embed(query)
        
        # Check all cached embeddings for semantic match
        for key in self.redis.scan_iter("cache:embedding:*"):
            cached_embedding = json.loads(self.redis.get(key))
            similarity = self._cosine_similarity(query_embedding, cached_embedding)
            
            if similarity >= self.threshold:
                cache_key = key.decode().replace("embedding:", "response:")
                cached_response = self.redis.get(cache_key)
                if cached_response:
                    print(f"Cache HIT (similarity: {similarity:.3f})")
                    return cached_response.decode()
        return None
    
    def set(self, query: str, response: str):
        """Cache response with semantic embedding."""
        embedding = self._embed(query)
        cache_id = hashlib.md5(query.encode()).hexdigest()
        
        self.redis.setex(f"cache:embedding:{cache_id}", self.TTL, json.dumps(embedding))
        self.redis.setex(f"cache:response:{cache_id}", self.TTL, response)

# Usage: wrap any LLM call
cache = SemanticCache("redis://localhost:6379")

def cached_llm_call(prompt: str) -> str:
    if cached := cache.get(prompt):
        return cached  # ~1ms, $0 cost
    
    response = openai.chat.completions.create(
        model="gpt-4o", messages=[{"role": "user", "content": prompt}]
    ).choices[0].message.content
    
    cache.set(prompt, response)
    return response  # ~800ms, $0.01`,
  }),

  'Databases': (t) => ({
    language: 'python',
    title: `${getName(t)} — AI Application Data Layer`,
    description: `Production database setup for AI applications with connection pooling, async queries, and vector search.`,
    code: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import String, JSON, DateTime, func
from pgvector.sqlalchemy import Vector
import asyncio

# ${getName(t)}: Async database with vector search support
engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/${getSlug(t).replace(/-/g, '_')}",
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,  # Detect stale connections
)

class Base(DeclarativeBase):
    pass

# AI conversation storage with vector embeddings
class Conversation(Base):
    __tablename__ = "conversations"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(36), index=True)
    user_message: Mapped[str]
    ai_response: Mapped[str]
    embedding: Mapped[list[float]] = mapped_column(Vector(1536))  # OpenAI dims
    metadata: Mapped[dict] = mapped_column(JSON, default={})
    created_at: Mapped[DateTime] = mapped_column(server_default=func.now())

async def semantic_search(query_embedding: list[float], limit: int = 5):
    """Find semantically similar past conversations."""
    async with AsyncSession(engine) as session:
        # pgvector cosine similarity search
        result = await session.execute(
            select(Conversation)
            .order_by(Conversation.embedding.cosine_distance(query_embedding))
            .limit(limit)
        )
        return result.scalars().all()

async def save_conversation(session_id: str, user_msg: str, ai_response: str, embedding: list):
    async with AsyncSession(engine) as session:
        conv = Conversation(
            session_id=session_id,
            user_message=user_msg,
            ai_response=ai_response,
            embedding=embedding,
        )
        session.add(conv)
        await session.commit()`,
  }),

  'Orchestration': (t) => ({
    language: 'python',
    title: `${getName(t)} — ML Pipeline Orchestration`,
    description: `Production-grade ML pipeline with dependency management, retries, SLA monitoring, and backfill support.`,
    code: `from airflow.decorators import dag, task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from datetime import datetime, timedelta
import pandas as pd

# ${getName(t)}: ML training pipeline DAG
@dag(
    dag_id="jedi_ml_training_pipeline",
    schedule="0 2 * * *",  # Daily at 2 AM
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args={
        "retries": 3,
        "retry_delay": timedelta(minutes=5),
        "retry_exponential_backoff": True,
        "email_on_failure": True,
        "email": ["ml-team@jedilabs.org"],
    },
    tags=["ml", "training", "production"],
)
def ml_training_pipeline():
    
    @task(pool="data_extraction", pool_slots=2)
    def extract_training_data(ds=None) -> str:
        """Extract labeled data for the training window."""
        hook = PostgresHook(postgres_conn_id="jedi_prod")
        df = hook.get_pandas_df(
            f"SELECT * FROM labeled_events WHERE date = '{ds}'"
        )
        path = f"/tmp/training_data_{ds}.parquet"
        df.to_parquet(path)
        return path

    @task
    def validate_data_quality(data_path: str) -> str:
        """Run Great Expectations suite before training."""
        import great_expectations as gx
        context = gx.get_context()
        result = context.run_checkpoint("training_data_checkpoint")
        if not result.success:
            raise ValueError(f"Data quality check failed: {result}")
        return data_path

    @task(executor_config={"KubernetesExecutor": {"request_memory": "8Gi", "request_cpu": "4"}})
    def train_model(data_path: str) -> str:
        """Train model on validated data."""
        import mlflow
        with mlflow.start_run():
            # Training logic here
            model_uri = mlflow.sklearn.log_model(model, "model").model_uri
        return model_uri

    @task
    def deploy_if_better(model_uri: str):
        """Deploy only if new model beats production baseline."""
        new_score = evaluate_model(model_uri)
        prod_score = get_production_score()
        if new_score > prod_score * 1.02:  # 2% improvement threshold
            deploy_to_production(model_uri)

    data = extract_training_data()
    validated = validate_data_quality(data)
    model = train_model(validated)
    deploy_if_better(model)

ml_training_pipeline()`,
  }),

  'Transformation': (t) => ({
    language: 'sql',
    title: `${getName(t)} — Analytics Transformation`,
    description: `Production dbt models with incremental loading, data quality tests, and lineage documentation.`,
    code: `-- ${getName(t)}: Incremental model for AI training features
-- models/marts/ml_features/user_behavior_features.sql

{{
  config(
    materialized='incremental',
    unique_key='user_id || date',
    incremental_strategy='merge',
    on_schema_change='sync_all_columns',
    tags=['ml_features', 'daily'],
    meta={
      'owner': 'ml-team@jedilabs.org',
      'sla': '06:00 UTC'
    }
  )
}}

WITH raw_events AS (
  SELECT * FROM {{ ref('stg_events') }}
  {% if is_incremental() %}
    WHERE event_date >= (SELECT MAX(date) - INTERVAL '3 days' FROM {{ this }})
  {% endif %}
),

session_features AS (
  SELECT
    user_id,
    event_date AS date,
    COUNT(DISTINCT session_id)                    AS sessions_count,
    AVG(session_duration_seconds)                 AS avg_session_duration,
    SUM(CASE WHEN event_type = 'ai_query' THEN 1 END) AS ai_queries,
    SUM(CASE WHEN event_type = 'conversion' THEN 1 END) AS conversions,
    -- Rolling 7-day features for ML
    AVG(COUNT(*)) OVER (
      PARTITION BY user_id 
      ORDER BY event_date 
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7d_avg_events
  FROM raw_events
  GROUP BY user_id, event_date
)

SELECT * FROM session_features

-- schema.yml tests
-- - not_null: [user_id, date]
-- - unique: [user_id, date]  
-- - accepted_range: {column: avg_session_duration, min_value: 0, max_value: 86400}`,
  }),

  'Data Warehousing': (t) => ({
    language: 'sql',
    title: `${getName(t)} — Enterprise Data Warehouse`,
    description: `Production warehouse patterns: virtual warehouses, time travel, data sharing, and ML integration.`,
    code: `-- ${getName(t)}: Production warehouse setup for AI workloads

-- 1. Separate compute for different workloads
CREATE WAREHOUSE IF NOT EXISTS ml_training_wh
  WAREHOUSE_SIZE = 'X-LARGE'
  AUTO_SUSPEND = 300
  AUTO_RESUME = TRUE
  COMMENT = 'Used for ML feature engineering and model training';

CREATE WAREHOUSE IF NOT EXISTS api_serving_wh
  WAREHOUSE_SIZE = 'SMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  MAX_CLUSTER_COUNT = 5  -- Multi-cluster for concurrent API queries
  SCALING_POLICY = 'ECONOMY';

-- 2. ML feature store table with time travel
CREATE TABLE IF NOT EXISTS ml_features.user_embeddings (
  user_id VARCHAR(36) NOT NULL,
  embedding ARRAY,           -- 1536-dim OpenAI embedding
  feature_version INT,
  computed_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  metadata VARIANT           -- Flexible JSON for feature metadata
)
CLUSTER BY (computed_at::DATE)  -- Micro-partition optimization
DATA_RETENTION_TIME_IN_DAYS = 90;  -- 90-day time travel

-- 3. Query with time travel for model reproducibility
SELECT * FROM ml_features.user_embeddings
AT (TIMESTAMP => '2024-01-15 00:00:00'::TIMESTAMP_NTZ)
WHERE feature_version = 3;

-- 4. Secure data sharing for cross-team ML
CREATE SHARE jedi_ml_features_share;
GRANT USAGE ON DATABASE ml_features TO SHARE jedi_ml_features_share;
GRANT SELECT ON TABLE ml_features.user_embeddings TO SHARE jedi_ml_features_share;

-- 5. Python UDF for in-warehouse ML inference
CREATE OR REPLACE FUNCTION predict_churn(features ARRAY)
RETURNS FLOAT
LANGUAGE PYTHON
RUNTIME_VERSION = '3.11'
PACKAGES = ('scikit-learn', 'numpy')
HANDLER = 'predict'
AS $$
import numpy as np
import pickle

def predict(features):
    model = pickle.loads(open('/tmp/churn_model.pkl', 'rb').read())
    return float(model.predict_proba([features])[0][1])
$$;`,
  }),

  'data ingestion': (t) => ({
    language: 'python',
    title: `${getName(t)} — High-Throughput Data Ingestion`,
    description: `Production ingestion pipeline with exactly-once semantics, schema evolution, and dead-letter queues.`,
    code: `from confluent_kafka import Consumer, Producer, KafkaError
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroDeserializer
import json

# ${getName(t)}: Production Kafka consumer with schema registry
schema_registry = SchemaRegistryClient({"url": "http://schema-registry:8081"})
avro_deserializer = AvroDeserializer(schema_registry)

consumer = Consumer({
    "bootstrap.servers": "kafka:9092",
    "group.id": "jedi-ml-pipeline",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,  # Manual commit for exactly-once
    "max.poll.interval.ms": 300000,
})

dead_letter_producer = Producer({"bootstrap.servers": "kafka:9092"})

def process_batch(messages: list) -> bool:
    """Process a batch of messages with transactional guarantees."""
    try:
        records = [avro_deserializer(msg.value(), None) for msg in messages]
        
        # Validate schema
        validated = [r for r in records if validate_schema(r)]
        
        # Write to feature store
        feature_store.batch_upsert(validated)
        
        # Commit offsets only after successful write
        consumer.commit(asynchronous=False)
        return True
        
    except Exception as e:
        # Route failed messages to dead-letter topic
        for msg in messages:
            dead_letter_producer.produce(
                "jedi.events.dlq",
                key=msg.key(),
                value=msg.value(),
                headers={"error": str(e), "original_topic": msg.topic()}
            )
        dead_letter_producer.flush()
        return False

consumer.subscribe(["jedi.events.raw", "jedi.events.enriched"])

BATCH_SIZE = 500
batch = []

while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None:
        continue
    if msg.error():
        if msg.error().code() != KafkaError._PARTITION_EOF:
            raise KafkaException(msg.error())
        continue
    
    batch.append(msg)
    if len(batch) >= BATCH_SIZE:
        process_batch(batch)
        batch = []`,
  }),

  'Storage': (t) => ({
    language: 'python',
    title: `${getName(t)} — Intelligent Data Storage`,
    description: `Production storage with lifecycle policies, versioning, and ML dataset management.`,
    code: `import boto3
from botocore.config import Config
import json

# ${getName(t)}: Production S3 storage for ML datasets
s3 = boto3.client(
    's3',
    config=Config(
        retries={'max_attempts': 3, 'mode': 'adaptive'},
        max_pool_connections=50
    )
)

# Lifecycle policy: hot → warm → cold → archive
lifecycle_config = {
    "Rules": [
        {
            "ID": "ml-dataset-lifecycle",
            "Status": "Enabled",
            "Filter": {"Prefix": "datasets/"},
            "Transitions": [
                {"Days": 30, "StorageClass": "STANDARD_IA"},   # Warm
                {"Days": 90, "StorageClass": "GLACIER_IR"},    # Cold
                {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}, # Archive
            ],
            "NoncurrentVersionTransitions": [
                {"NoncurrentDays": 7, "StorageClass": "GLACIER_IR"}
            ],
            "NoncurrentVersionExpiration": {"NoncurrentDays": 90}
        }
    ]
}

s3.put_bucket_lifecycle_configuration(
    Bucket="jedi-ml-datasets",
    LifecycleConfiguration=lifecycle_config
)

# Versioned dataset upload with metadata
def upload_dataset(local_path: str, dataset_name: str, version: str, metadata: dict):
    key = f"datasets/{dataset_name}/v{version}/data.parquet"
    
    s3.upload_file(
        local_path, "jedi-ml-datasets", key,
        ExtraArgs={
            "Metadata": {
                "version": version,
                "rows": str(metadata.get("rows", 0)),
                "schema_hash": metadata.get("schema_hash", ""),
                "created_by": "jedi-pipeline",
            },
            "ServerSideEncryption": "aws:kms",
            "StorageClass": "INTELLIGENT_TIERING",
        }
    )
    
    # Register in dataset catalog
    catalog.register_dataset(dataset_name, version, f"s3://jedi-ml-datasets/{key}")
    return f"s3://jedi-ml-datasets/{key}"`,
  }),

  'Data Quality': (t) => ({
    language: 'python',
    title: `${getName(t)} — Data Quality Enforcement`,
    description: `Automated data quality checks integrated into CI/CD with alerting and lineage tracking.`,
    code: `import great_expectations as gx
from great_expectations.core.batch import RuntimeBatchRequest
import pandas as pd

# ${getName(t)}: Production data quality suite
context = gx.get_context()

# Define expectations for ML training data
suite = context.add_expectation_suite("ml_training_data_suite")

validator = context.get_validator(
    batch_request=RuntimeBatchRequest(
        datasource_name="postgres_prod",
        data_connector_name="default_runtime_data_connector",
        data_asset_name="labeled_events",
        runtime_parameters={"query": "SELECT * FROM labeled_events WHERE date = CURRENT_DATE"},
        batch_identifiers={"default_identifier_name": "daily_batch"},
    ),
    expectation_suite_name="ml_training_data_suite",
)

# Critical expectations — pipeline fails if these break
validator.expect_column_values_to_not_be_null("user_id")
validator.expect_column_values_to_not_be_null("label")
validator.expect_column_values_to_be_in_set("label", [0, 1])
validator.expect_column_values_to_be_between("confidence_score", 0.0, 1.0)

# Statistical expectations — alert if these drift
validator.expect_column_mean_to_be_between("session_duration", 60, 3600)
validator.expect_column_proportion_of_unique_values_to_be_between("user_id", 0.8, 1.0)

# Class balance check (critical for ML fairness)
validator.expect_column_pair_values_to_be_equal(
    "label", "expected_label",
    mostly=0.95  # Allow 5% label noise
)

validator.save_expectation_suite()

# Run in CI/CD — fails build on critical violations
checkpoint = context.add_or_update_checkpoint(
    name="daily_training_data_checkpoint",
    validations=[{
        "batch_request": batch_request,
        "expectation_suite_name": "ml_training_data_suite",
    }],
    action_list=[
        {"name": "store_validation_result", "action": {"class_name": "StoreValidationResultAction"}},
        {"name": "send_slack_notification", "action": {
            "class_name": "SlackNotificationAction",
            "slack_webhook": SLACK_WEBHOOK,
            "notify_on": "failure",
        }},
    ]
)

result = checkpoint.run()
assert result.success, f"Data quality failed: {result}"`,
  }),

  'Model Training': (t) => ({
    language: 'python',
    title: `${getName(t)} — Production Model Training`,
    description: `Distributed training with experiment tracking, checkpointing, and automatic hyperparameter optimization.`,
    code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import mlflow
import mlflow.pytorch
from torch.cuda.amp import GradScaler, autocast

# ${getName(t)}: Production training loop with MLflow tracking
class JEDIModelTrainer:
    def __init__(self, model: nn.Module, config: dict):
        self.model = model
        self.config = config
        self.scaler = GradScaler()  # Mixed precision training
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
    
    def train(self, train_loader: DataLoader, val_loader: DataLoader):
        optimizer = torch.optim.AdamW(
            self.model.parameters(),
            lr=self.config["lr"],
            weight_decay=self.config["weight_decay"]
        )
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
            optimizer, T_max=self.config["epochs"]
        )
        
        with mlflow.start_run():
            mlflow.log_params(self.config)
            
            best_val_loss = float('inf')
            
            for epoch in range(self.config["epochs"]):
                # Training step with mixed precision
                self.model.train()
                train_loss = 0
                
                for batch in train_loader:
                    inputs, labels = batch[0].to(self.device), batch[1].to(self.device)
                    
                    with autocast():  # FP16 forward pass
                        outputs = self.model(inputs)
                        loss = nn.CrossEntropyLoss()(outputs, labels)
                    
                    self.scaler.scale(loss).backward()
                    self.scaler.unscale_(optimizer)
                    torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
                    self.scaler.step(optimizer)
                    self.scaler.update()
                    optimizer.zero_grad()
                    train_loss += loss.item()
                
                # Validation
                val_loss, val_acc = self.evaluate(val_loader)
                scheduler.step()
                
                mlflow.log_metrics({
                    "train_loss": train_loss / len(train_loader),
                    "val_loss": val_loss,
                    "val_accuracy": val_acc,
                    "lr": scheduler.get_last_lr()[0],
                }, step=epoch)
                
                # Save best checkpoint
                if val_loss < best_val_loss:
                    best_val_loss = val_loss
                    mlflow.pytorch.log_model(self.model, "best_model")
                    torch.save(self.model.state_dict(), "checkpoints/best.pt")
                    
            return mlflow.active_run().info.run_id`,
  }),

  'Model Serving': (t) => ({
    language: 'python',
    title: `${getName(t)} — Production Model Serving`,
    description: `High-throughput model serving with batching, A/B testing, canary deployments, and automatic rollback.`,
    code: `from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import mlflow.pyfunc
import asyncio
from collections import defaultdict
import time

# ${getName(t)}: Production serving with dynamic batching
app = FastAPI()

class PredictionRequest(BaseModel):
    inputs: list[list[float]]
    model_version: str = "production"

class BatchAccumulator:
    """Accumulate requests and process in batches for throughput."""
    def __init__(self, max_batch_size=64, max_wait_ms=50):
        self.queue = asyncio.Queue()
        self.max_batch = max_batch_size
        self.max_wait = max_wait_ms / 1000
    
    async def add(self, request_id: str, inputs: list) -> list:
        future = asyncio.Future()
        await self.queue.put((request_id, inputs, future))
        return await future

# Load models for A/B testing
models = {
    "production": mlflow.pyfunc.load_model("models:/jedi-classifier/Production"),
    "candidate": mlflow.pyfunc.load_model("models:/jedi-classifier/Staging"),
}

# Traffic split: 90% production, 10% candidate
TRAFFIC_SPLIT = {"production": 0.9, "candidate": 0.1}

@app.post("/predict")
async def predict(request: PredictionRequest):
    import random
    
    # Route to model based on traffic split
    model_key = random.choices(
        list(TRAFFIC_SPLIT.keys()),
        weights=list(TRAFFIC_SPLIT.values())
    )[0]
    
    model = models[model_key]
    
    start = time.perf_counter()
    predictions = model.predict(request.inputs)
    latency_ms = (time.perf_counter() - start) * 1000
    
    # Log for A/B analysis
    metrics_store.record(model_key, latency_ms, len(request.inputs))
    
    return {
        "predictions": predictions.tolist(),
        "model_version": model_key,
        "latency_ms": round(latency_ms, 2),
    }`,
  }),

  'Inference API': (t) => ({
    language: 'python',
    title: `${getName(t)} — OpenAI-Compatible Inference API`,
    description: `Drop-in OpenAI-compatible API for serving any model with streaming, function calling, and rate limiting.`,
    code: `from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
import time

# ${getName(t)}: OpenAI-compatible inference endpoint
app = FastAPI(title="JEDI Inference API")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: list[ChatMessage]
    stream: bool = False
    max_tokens: int = 2048
    temperature: float = 0.7
    functions: list[dict] | None = None

async def stream_response(model_output: str, model: str):
    """Stream tokens in OpenAI SSE format."""
    words = model_output.split()
    for i, word in enumerate(words):
        chunk = {
            "id": f"chatcmpl-{int(time.time())}",
            "object": "chat.completion.chunk",
            "model": model,
            "choices": [{
                "index": 0,
                "delta": {"content": word + (" " if i < len(words)-1 else "")},
                "finish_reason": None if i < len(words)-1 else "stop"
            }]
        }
        yield f"data: {json.dumps(chunk)}\\n\\n"
        await asyncio.sleep(0.02)  # Simulate token generation
    yield "data: [DONE]\\n\\n"

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    # Route to appropriate model backend
    if request.model.startswith("jedi-"):
        response = await jedi_model.generate(request.messages, request.temperature)
    elif request.model.startswith("claude"):
        response = await anthropic_client.generate(request.messages)
    else:
        raise HTTPException(400, f"Unknown model: {request.model}")
    
    if request.stream:
        return StreamingResponse(
            stream_response(response, request.model),
            media_type="text/event-stream"
        )
    
    return {
        "id": f"chatcmpl-{int(time.time())}",
        "object": "chat.completion",
        "model": request.model,
        "choices": [{"index": 0, "message": {"role": "assistant", "content": response}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 100, "completion_tokens": len(response.split()), "total_tokens": 100 + len(response.split())}
    }`,
  }),

  'Monitoring & Logging': (t) => ({
    language: 'python',
    title: `${getName(t)} — ML Observability Stack`,
    description: `Full-stack observability for AI systems: metrics, traces, logs, and model performance dashboards.`,
    code: `from prometheus_client import Counter, Histogram, Gauge, start_http_server
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import structlog

# ${getName(t)}: Unified observability for AI workloads
# Prometheus metrics
PREDICTION_LATENCY = Histogram(
    "jedi_prediction_latency_seconds",
    "Model inference latency",
    ["model_name", "model_version"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)
PREDICTION_REQUESTS = Counter(
    "jedi_prediction_requests_total",
    "Total prediction requests",
    ["model_name", "status"]
)
MODEL_ACCURACY = Gauge(
    "jedi_model_accuracy",
    "Current model accuracy on validation set",
    ["model_name"]
)

# OpenTelemetry distributed tracing
provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint="http://jaeger:4317")))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("jedi.ml.inference")

# Structured logging
log = structlog.get_logger()

def instrumented_predict(model_name: str, inputs: list) -> dict:
    with tracer.start_as_current_span("model.predict") as span:
        span.set_attribute("model.name", model_name)
        span.set_attribute("input.count", len(inputs))
        
        with PREDICTION_LATENCY.labels(model_name, "v1").time():
            try:
                result = model.predict(inputs)
                PREDICTION_REQUESTS.labels(model_name, "success").inc()
                
                log.info("prediction_complete",
                    model=model_name,
                    input_count=len(inputs),
                    confidence=float(result.max())
                )
                return {"predictions": result.tolist(), "status": "ok"}
                
            except Exception as e:
                PREDICTION_REQUESTS.labels(model_name, "error").inc()
                span.record_exception(e)
                log.error("prediction_failed", model=model_name, error=str(e))
                raise

start_http_server(8000)  # Prometheus scrape endpoint`,
  }),

  'ML Monitoring': (t) => ({
    language: 'python',
    title: `${getName(t)} — Model Drift Detection`,
    description: `Automated drift detection with statistical tests, alerting, and automatic retraining triggers.`,
    code: `from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, ClassificationPreset
from evidently.metrics import *
import pandas as pd
import numpy as np
from scipy import stats

# ${getName(t)}: Production drift monitoring
class DriftMonitor:
    def __init__(self, reference_data: pd.DataFrame, threshold: float = 0.05):
        self.reference = reference_data
        self.threshold = threshold
        self.alert_history = []
    
    def check_feature_drift(self, current_data: pd.DataFrame) -> dict:
        """Statistical drift detection using KS test and PSI."""
        drift_results = {}
        
        for column in self.reference.select_dtypes(include=[np.number]).columns:
            ref_vals = self.reference[column].dropna()
            cur_vals = current_data[column].dropna()
            
            # Kolmogorov-Smirnov test
            ks_stat, ks_pvalue = stats.ks_2samp(ref_vals, cur_vals)
            
            # Population Stability Index
            psi = self._calculate_psi(ref_vals, cur_vals)
            
            drift_results[column] = {
                "ks_statistic": round(ks_stat, 4),
                "ks_pvalue": round(ks_pvalue, 4),
                "psi": round(psi, 4),
                "drifted": ks_pvalue < self.threshold or psi > 0.2,
                "severity": "high" if psi > 0.25 else "medium" if psi > 0.1 else "low"
            }
        
        return drift_results
    
    def generate_report(self, current_data: pd.DataFrame, predictions: pd.DataFrame):
        """Full Evidently report with drift + performance."""
        report = Report(metrics=[
            DataDriftPreset(),
            ClassificationPreset(),
            DataQualityPreset(),
        ])
        report.run(reference_data=self.reference, current_data=current_data)
        report.save_html("drift_report.html")
        
        # Trigger retraining if drift detected
        drift_score = report.as_dict()["metrics"][0]["result"]["drift_share"]
        if drift_score > 0.3:
            self._trigger_retraining(drift_score)
        
        return report
    
    def _trigger_retraining(self, drift_score: float):
        """Automatically trigger retraining pipeline."""
        airflow_client.trigger_dag(
            "jedi_ml_training_pipeline",
            conf={"trigger_reason": "drift", "drift_score": drift_score}
        )
        slack_alert(f"🚨 Model drift detected ({drift_score:.0%}). Retraining triggered.")`,
  }),

  'Distributed Computing': (t) => ({
    language: 'python',
    title: `${getName(t)} — Distributed ML Workloads`,
    description: `Scale ML training and inference across clusters with automatic resource management and fault tolerance.`,
    code: `import ray
from ray import tune
from ray.train.torch import TorchTrainer
from ray.train import ScalingConfig, RunConfig
import torch

# ${getName(t)}: Distributed hyperparameter search + training
ray.init(address="auto")  # Connect to Ray cluster

# Distributed hyperparameter optimization
def train_func(config):
    """Training function executed on each worker."""
    model = build_model(config["hidden_size"], config["dropout"])
    optimizer = torch.optim.Adam(model.parameters(), lr=config["lr"])
    
    train_loader = get_distributed_dataloader(config["batch_size"])
    
    for epoch in range(config["epochs"]):
        loss = train_epoch(model, optimizer, train_loader)
        tune.report(loss=loss, epoch=epoch)

# Search space
search_space = {
    "lr": tune.loguniform(1e-4, 1e-1),
    "hidden_size": tune.choice([128, 256, 512, 1024]),
    "dropout": tune.uniform(0.1, 0.5),
    "batch_size": tune.choice([32, 64, 128]),
    "epochs": 20,
}

# Run distributed search across 8 GPUs
tuner = tune.Tuner(
    tune.with_resources(train_func, resources={"gpu": 1, "cpu": 4}),
    param_space=search_space,
    tune_config=tune.TuneConfig(
        metric="loss",
        mode="min",
        num_samples=50,
        scheduler=tune.schedulers.ASHAScheduler(
            max_t=20, grace_period=5, reduction_factor=2
        ),
    ),
    run_config=RunConfig(
        name="jedi_hparam_search",
        storage_path="s3://jedi-ml-experiments/ray",
        checkpoint_config=tune.CheckpointConfig(checkpoint_frequency=5),
    )
)

results = tuner.fit()
best_config = results.get_best_result("loss", "min").config
print(f"Best config: {best_config}")`,
  }),

  'Alerting': (t) => ({
    language: 'python',
    title: `${getName(t)} — Intelligent Alert Routing`,
    description: `Smart alerting with deduplication, escalation policies, and ML-powered noise reduction.`,
    code: `import httpx
import asyncio
from dataclasses import dataclass
from enum import Enum

class Severity(Enum):
    P1 = "critical"   # Page immediately, 24/7
    P2 = "high"       # Page during business hours
    P3 = "medium"     # Slack notification
    P4 = "low"        # Email digest

@dataclass
class Alert:
    title: str
    description: str
    severity: Severity
    service: str
    metric_value: float
    threshold: float

# ${getName(t)}: Smart alert router with deduplication
class AlertRouter:
    def __init__(self):
        self.active_alerts = {}  # Deduplication store
        self.escalation_timers = {}
    
    async def route(self, alert: Alert):
        # Deduplicate: suppress if same alert fired in last 5 minutes
        alert_key = f"{alert.service}:{alert.title}"
        if alert_key in self.active_alerts:
            print(f"Suppressed duplicate: {alert_key}")
            return
        
        self.active_alerts[alert_key] = alert
        
        # Route by severity
        if alert.severity == Severity.P1:
            await asyncio.gather(
                self.page_oncall(alert),
                self.notify_slack(alert, channel="#incidents"),
                self.create_incident(alert),
            )
            # Auto-escalate if not acknowledged in 5 minutes
            self.escalation_timers[alert_key] = asyncio.create_task(
                self.escalate_if_unacknowledged(alert, timeout=300)
            )
        
        elif alert.severity == Severity.P2:
            await self.notify_slack(alert, channel="#alerts")
        
        elif alert.severity == Severity.P3:
            await self.notify_slack(alert, channel="#monitoring")
    
    async def page_oncall(self, alert: Alert):
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://api.pagerduty.com/incidents",
                headers={"Authorization": f"Token token={PD_TOKEN}"},
                json={
                    "incident": {
                        "type": "incident",
                        "title": f"[{alert.severity.value.upper()}] {alert.title}",
                        "service": {"id": PD_SERVICE_ID, "type": "service_reference"},
                        "body": {"type": "incident_body", "details": alert.description},
                        "urgency": "high" if alert.severity == Severity.P1 else "low",
                    }
                }
            )

router = AlertRouter()

# Example: ML model accuracy drop alert
await router.route(Alert(
    title="Model accuracy below threshold",
    description=f"Churn model accuracy dropped to 87% (threshold: 92%)",
    severity=Severity.P2,
    service="jedi-ml-serving",
    metric_value=0.87,
    threshold=0.92,
))`,
  }),

  'Compliance': (t) => ({
    language: 'python',
    title: `${getName(t)} — Regulatory Compliance Automation`,
    description: `Automated GDPR/HIPAA compliance with consent management, data lineage, and audit trails.`,
    code: `from datetime import datetime, timedelta
from typing import Literal
import hashlib
import json

# ${getName(t)}: GDPR-compliant data handling for AI systems
class ComplianceManager:
    def __init__(self, db, audit_log):
        self.db = db
        self.audit = audit_log
    
    # ── Consent Management ──────────────────────────────────────────
    def record_consent(self, user_id: str, purposes: list[str], version: str):
        """Record granular consent with immutable audit trail."""
        consent = {
            "user_id": user_id,
            "purposes": purposes,  # ["analytics", "ai_training", "personalization"]
            "version": version,
            "timestamp": datetime.utcnow().isoformat(),
            "ip_hash": hashlib.sha256(request.remote_addr.encode()).hexdigest(),
        }
        self.db.consents.insert(consent)
        self.audit.log("consent_recorded", user_id, consent)
    
    def check_consent(self, user_id: str, purpose: str) -> bool:
        """Verify active consent before processing data."""
        consent = self.db.consents.find_one(
            {"user_id": user_id, "purposes": purpose},
            sort=[("timestamp", -1)]
        )
        return consent is not None and consent.get("withdrawn_at") is None
    
    # ── Right to Erasure (GDPR Article 17) ─────────────────────────
    async def process_deletion_request(self, user_id: str):
        """Complete data deletion across all systems within 30 days."""
        deletion_id = f"del_{user_id}_{int(datetime.utcnow().timestamp())}"
        
        tasks = [
            self.delete_from_postgres(user_id),
            self.delete_from_vector_store(user_id),
            self.delete_from_ml_training_data(user_id),
            self.delete_from_backups(user_id),  # Scheduled
            self.notify_data_processors(user_id),  # Third parties
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Immutable deletion record (keep for compliance proof)
        self.audit.log("data_deleted", user_id, {
            "deletion_id": deletion_id,
            "completed_at": datetime.utcnow().isoformat(),
            "systems_cleared": [t.__name__ for t, r in zip(tasks, results) if not isinstance(r, Exception)],
        })
        
        return deletion_id
    
    # ── Data Minimization ───────────────────────────────────────────
    def anonymize_for_analytics(self, record: dict) -> dict:
        """Remove PII while preserving analytical value."""
        PII_FIELDS = ["name", "email", "phone", "address", "ssn", "dob"]
        return {
            k: hashlib.sha256(str(v).encode()).hexdigest()[:8] if k in PII_FIELDS else v
            for k, v in record.items()
        }`,
  }),

  'Security': (t) => ({
    language: 'python',
    title: `${getName(t)} — Zero-Trust AI Security`,
    description: `Implement zero-trust security for AI APIs with JWT validation, RBAC, and audit logging.`,
    code: `from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from functools import wraps
import structlog

# ${getName(t)}: Zero-trust security for AI endpoints
app = FastAPI()
security = HTTPBearer()
log = structlog.get_logger()

SECRET_KEY = "your-secret-key"  # Use AWS Secrets Manager in production
ALGORITHM = "RS256"

class Permission:
    READ_PREDICTIONS = "predictions:read"
    WRITE_PREDICTIONS = "predictions:write"
    ADMIN_MODELS = "models:admin"
    READ_PHI = "phi:read"  # HIPAA: Protected Health Information

def create_access_token(user_id: str, roles: list[str], expires_delta: timedelta = timedelta(hours=1)):
    """Create short-lived JWT with role claims."""
    payload = {
        "sub": user_id,
        "roles": roles,
        "permissions": get_permissions_for_roles(roles),
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + expires_delta,
        "jti": str(uuid.uuid4()),  # Unique token ID for revocation
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def require_permission(permission: str):
    """Decorator for permission-based access control."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, credentials: HTTPAuthorizationCredentials = Security(security), **kwargs):
            try:
                payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
                
                # Check token revocation list
                if await token_revoked(payload["jti"]):
                    raise HTTPException(401, "Token revoked")
                
                if permission not in payload.get("permissions", []):
                    log.warning("unauthorized_access",
                        user=payload["sub"], required=permission,
                        has=payload.get("permissions", [])
                    )
                    raise HTTPException(403, f"Missing permission: {permission}")
                
                # Audit log every access to sensitive endpoints
                log.info("api_access", user=payload["sub"], permission=permission,
                         endpoint=func.__name__)
                
                return await func(*args, user=payload, **kwargs)
                
            except JWTError as e:
                raise HTTPException(401, f"Invalid token: {e}")
        return wrapper
    return decorator

@app.post("/v1/predict")
@require_permission(Permission.WRITE_PREDICTIONS)
async def predict(request: PredictionRequest, user: dict):
    return await model.predict(request.inputs)

@app.get("/v1/patient/{patient_id}/predictions")
@require_permission(Permission.READ_PHI)
async def get_patient_predictions(patient_id: str, user: dict):
    # HIPAA: Log PHI access
    hipaa_audit.log(user["sub"], patient_id, "read_predictions")
    return await db.get_predictions(patient_id)`,
  }),

  'Data Protection': (t) => ({
    language: 'python',
    title: `${getName(t)} — Field-Level Encryption & Masking`,
    description: `Protect PII and sensitive data with field-level encryption, tokenization, and dynamic masking.`,
    code: `from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import re

# ${getName(t)}: Field-level encryption for AI training data
class DataProtectionManager:
    def __init__(self, master_key: bytes):
        # Derive encryption key from master key
        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=b"jedi-salt", iterations=100000)
        key = base64.urlsafe_b64encode(kdf.derive(master_key))
        self.cipher = Fernet(key)
        
        # PII detection patterns
        self.PII_PATTERNS = {
            "ssn": re.compile(r"\\b\\d{3}-\\d{2}-\\d{4}\\b"),
            "email": re.compile(r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"),
            "phone": re.compile(r"\\b(\\+1)?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b"),
            "credit_card": re.compile(r"\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b"),
        }
    
    def encrypt_field(self, value: str) -> str:
        """Encrypt a sensitive field value."""
        return self.cipher.encrypt(value.encode()).decode()
    
    def decrypt_field(self, encrypted: str) -> str:
        """Decrypt a field (requires appropriate permissions)."""
        return self.cipher.decrypt(encrypted.encode()).decode()
    
    def mask_for_display(self, value: str, field_type: str) -> str:
        """Dynamic masking based on user role."""
        masks = {
            "ssn": lambda v: f"***-**-{v[-4:]}",
            "email": lambda v: f"{v[0]}***@{v.split('@')[1]}",
            "phone": lambda v: f"***-***-{v[-4:]}",
            "credit_card": lambda v: f"****-****-****-{v[-4:]}",
        }
        return masks.get(field_type, lambda v: "***")(value)
    
    def scan_and_protect(self, text: str) -> tuple[str, list[dict]]:
        """Scan text for PII and replace with tokens."""
        findings = []
        protected = text
        
        for pii_type, pattern in self.PII_PATTERNS.items():
            for match in pattern.finditer(text):
                token = f"[{pii_type.upper()}_REDACTED]"
                protected = protected.replace(match.group(), token)
                findings.append({"type": pii_type, "position": match.start()})
        
        return protected, findings

# Usage: protect data before AI training
protector = DataProtectionManager(master_key=os.environ["ENCRYPTION_KEY"].encode())

# Scan LLM inputs for accidental PII
user_input = "My SSN is 123-45-6789 and email is john@example.com"
safe_input, findings = protector.scan_and_protect(user_input)
print(f"Protected: {safe_input}")
# Output: "My SSN is [SSN_REDACTED] and email is [EMAIL_REDACTED]"`,
  }),

  'Ontologies': (t) => ({
    language: 'python',
    title: `${getName(t)} — Knowledge Graph for AI Reasoning`,
    description: `Build structured domain knowledge that AI agents can query for accurate, explainable reasoning.`,
    code: `from rdflib import Graph, Namespace, URIRef, Literal
from rdflib.namespace import RDF, RDFS, OWL
from SPARQLWrapper import SPARQLWrapper, JSON
import json

# ${getName(t)}: Domain ontology for AI-powered clinical reasoning
JEDI = Namespace("https://ontology.jedilabs.org/")
MED = Namespace("https://ontology.jedilabs.org/medical/")

# Build ontology
g = Graph()
g.bind("jedi", JEDI)
g.bind("med", MED)

# Define classes
g.add((MED.Drug, RDF.type, OWL.Class))
g.add((MED.Condition, RDF.type, OWL.Class))
g.add((MED.Contraindication, RDF.type, OWL.Class))

# Define properties
g.add((MED.contraindicatedWith, RDF.type, OWL.ObjectProperty))
g.add((MED.contraindicatedWith, RDFS.domain, MED.Drug))
g.add((MED.contraindicatedWith, RDFS.range, MED.Condition))

# Add domain knowledge
warfarin = MED.Warfarin
g.add((warfarin, RDF.type, MED.Drug))
g.add((warfarin, RDFS.label, Literal("Warfarin")))
g.add((warfarin, MED.contraindicatedWith, MED.ActiveBleeding))
g.add((warfarin, MED.contraindicatedWith, MED.PregnancyFirstTrimester))

# SPARQL query for AI agent reasoning
def check_contraindications(drug_name: str, patient_conditions: list[str]) -> list[str]:
    """Query ontology to find contraindications for a patient."""
    sparql_query = f"""
    PREFIX med: <https://ontology.jedilabs.org/medical/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?condition ?warning WHERE {{
        ?drug rdfs:label "{drug_name}" .
        ?drug med:contraindicatedWith ?condition .
        ?condition rdfs:label ?warning .
        FILTER(?warning IN ({', '.join(f'"{c}"' for c in patient_conditions)}))
    }}
    """
    results = g.query(sparql_query)
    return [str(row.warning) for row in results]

# AI agent uses ontology for safe recommendations
contraindications = check_contraindications("Warfarin", ["Active Bleeding", "Hypertension"])
if contraindications:
    print(f"⚠️ Contraindicated: {', '.join(contraindications)}")`,
  }),
};

// ─── Generic fallback code template ──────────────────────────────────────────

const genericCodeTemplate = (t) => {
  const name = getName(t);
  const slug = getSlug(t);
  const features = parseStringOrArray(t.features).slice(0, 3);
  const installName = slug.replace(/-/g, '_').toLowerCase();

  return {
    language: 'python',
    title: `${name} — Quickstart`,
    description: `Get started with ${name} in a JEDI AI pipeline. ${t.description || ''}`,
    code: `# Install: pip install ${installName}
# ${name}: ${t.description || 'Core component in the JEDI AI stack'}

import ${installName.replace(/[^a-z0-9_]/g, '_')}

# Initialize ${name}
client = ${installName.replace(/[^a-z0-9_]/g, '_')}.Client(
    api_key=os.environ["${name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY"]
)

${features.length > 0 ? `# Key capabilities:
${features.map(f => `# - ${f}`).join('\n')}

` : ''}# Basic usage
result = client.process(
    input_data={"query": "Analyze this for JEDI AI pipeline"},
    config={"mode": "production", "timeout": 30}
)

print(f"Result: {result}")
print(f"Status: {result.status}")`,
  };
};

export const generateTechCodeSnippet = (tech) => {
  const sub = getSubName(tech);
  const cat = getCatName(tech);

  // Try subcategory template first
  if (CODE_TEMPLATES[sub]) return CODE_TEMPLATES[sub](tech);

  // Category-level fallbacks
  const catFallbacks = {
    'AI Agents': CODE_TEMPLATES['Agent Core'],
    'Data Engineering': CODE_TEMPLATES['data ingestion'],
    'AI/ML': CODE_TEMPLATES['Model Training'],
    'Machine-Learning': CODE_TEMPLATES['Model Serving'],
    'Automation': CODE_TEMPLATES['Orchestration'],
    'Continuous Learning': CODE_TEMPLATES['ML Monitoring'],
    'Frontend Development': CODE_TEMPLATES['Frameworks'],
    'Security': CODE_TEMPLATES['Security'],
    'System Integration': CODE_TEMPLATES['Protocols'],
  };

  if (catFallbacks[cat]) return catFallbacks[cat](tech);
  return genericCodeTemplate(tech);
};

// ─── Flow step generation ─────────────────────────────────────────────────────

const FLOW_TEMPLATES = {
  'Agent Core': [
    { step: 'Input Processing', description: 'Parse and validate user input, extract intent and entities' },
    { step: 'Reasoning', description: 'Agent plans the approach using chain-of-thought' },
    { step: 'Tool Execution', description: 'Call external tools, APIs, or databases as needed' },
    { step: 'Memory Update', description: 'Store relevant context for future interactions' },
    { step: 'Response Generation', description: 'Synthesize results into a coherent, grounded response' },
  ],
  'Reasoning': [
    { step: 'Problem Decomposition', description: 'Break complex question into tractable sub-problems' },
    { step: 'Evidence Gathering', description: 'Retrieve relevant facts and context' },
    { step: 'Step-by-Step Analysis', description: 'Apply chain-of-thought reasoning across sub-problems' },
    { step: 'Verification', description: 'Check reasoning for consistency and factual accuracy' },
    { step: 'Conclusion', description: 'Synthesize a confident, explainable answer' },
  ],
  'Vector Databases': [
    { step: 'Document Ingestion', description: 'Load and chunk source documents' },
    { step: 'Embedding Generation', description: 'Convert text to high-dimensional vectors' },
    { step: 'Index Storage', description: 'Store vectors with metadata in the vector database' },
    { step: 'Similarity Search', description: 'Find semantically relevant chunks for the query' },
    { step: 'Context Assembly', description: 'Rank and assemble retrieved context for the LLM' },
  ],
  'data ingestion': [
    { step: 'Source Connection', description: 'Establish authenticated connection to data source' },
    { step: 'Schema Detection', description: 'Infer or validate schema against registry' },
    { step: 'Data Extraction', description: 'Pull records with incremental or full-load strategy' },
    { step: 'Validation', description: 'Check data quality and completeness' },
    { step: 'Load to Destination', description: 'Write to target with exactly-once guarantees' },
  ],
  'Orchestration': [
    { step: 'DAG Parsing', description: 'Parse pipeline definition and resolve dependencies' },
    { step: 'Task Scheduling', description: 'Schedule tasks based on dependencies and resources' },
    { step: 'Execution', description: 'Run tasks with retry logic and timeout handling' },
    { step: 'Monitoring', description: 'Track progress, SLAs, and resource utilization' },
    { step: 'Alerting', description: 'Notify on failures, SLA breaches, or anomalies' },
  ],
  'Model Training': [
    { step: 'Data Loading', description: 'Load and preprocess training dataset' },
    { step: 'Model Initialization', description: 'Initialize architecture with pretrained weights' },
    { step: 'Forward Pass', description: 'Compute predictions and loss' },
    { step: 'Backpropagation', description: 'Compute gradients and update weights' },
    { step: 'Validation & Checkpoint', description: 'Evaluate on held-out set and save best model' },
  ],
  'Model Serving': [
    { step: 'Request Received', description: 'Validate and authenticate incoming prediction request' },
    { step: 'Preprocessing', description: 'Transform input to model-expected format' },
    { step: 'Model Inference', description: 'Run forward pass with batching optimization' },
    { step: 'Postprocessing', description: 'Convert model output to API response format' },
    { step: 'Logging & Metrics', description: 'Record latency, throughput, and prediction for monitoring' },
  ],
};

const genericFlowSteps = (tech) => {
  const features = parseStringOrArray(tech.features).slice(0, 5);
  if (features.length >= 3) {
    return features.map((f, i) => ({
      step: f.split(' ').slice(0, 3).join(' '),
      description: f,
    }));
  }
  return [
    { step: 'Initialization', description: `Configure ${getName(tech)} for your environment` },
    { step: 'Data Input', description: 'Receive and validate input data' },
    { step: 'Processing', description: `Apply ${getName(tech)} core logic` },
    { step: 'Integration', description: 'Connect results to downstream systems' },
    { step: 'Output', description: 'Deliver processed results with monitoring' },
  ];
};

export const generateTechFlowSteps = (tech) => {
  const sub = getSubName(tech);
  if (FLOW_TEMPLATES[sub]) return FLOW_TEMPLATES[sub];
  return genericFlowSteps(tech);
};

// ─── Build synthetic useCase object for openAIService ────────────────────────

export const buildSyntheticUseCase = (tech) => {
  const features = parseStringOrArray(tech.features);
  const metrics = parseStringOrArray(tech.businessMetrics);
  const flowSteps = generateTechFlowSteps(tech);
  const questions = generateTechQuestions(tech);

  return {
    title: tech.name,
    description: tech.description || `${tech.name} — part of the JEDI AI stack`,
    capabilities: features,
    queries: questions,
    technologies: [{ name: tech.name, slug: tech.slug, icon: tech.icon }],
    metrics: metrics,
    architecture: {
      description: tech.description || '',
      flow: flowSteps.map((s, i) => ({
        step: i + 1,
        description: s.description,
        details: s.step,
      })),
      components: features.slice(0, 3).map((f) => ({
        name: f.split(' ').slice(0, 3).join(' '),
        description: f,
        details: '',
      })),
    },
    implementation: {
      confidence: '94%',
      dataPoints: '10K+',
      processingTime: '<200ms',
      features: features.slice(0, 4).map((f) => ({ name: f, description: f })),
    },
  };
};
