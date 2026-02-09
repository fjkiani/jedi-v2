#!/usr/bin/env node

/**
 * LangChain Content Extraction & Hygraph Push
 * 
 * Extracts official LangChain docs content (recipes, code, use cases) and pushes
 * to Hygraph Technology.additonalDetails. Combines:
 * - Official quickstart code from python.langchain.com
 * - RAG agent tutorial concepts and snippets
 * - JEDI implementation details (Go Answer, CrisPRO, etc.)
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

async function makeRequest(query, variables = {}) {
    const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
            'gcms-stage': 'DRAFT'
        },
        body: JSON.stringify({ query, variables })
    });
    const result = await response.json();
    return result;
}

// Curated content from official LangChain docs (python.langchain.com)
// + JEDI implementation framing per enhancement strategy
const LANGCHAIN_ADDITIONAL_DETAILS = `
# LangChain: Official Recipes & JEDI Implementation

## Official Quickstart: Create an Agent (from python.langchain.com)

With under 10 lines of code, you can connect to OpenAI, Anthropic, Google, and more. LangChain provides a pre-built agent architecture and model integrations.

\`\`\`python
# pip install -qU langchain "langchain[anthropic]"
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
\`\`\`

## RAG Agent Tutorial: Build a Q&A Chatbot (from LangChain docs)

One of the most powerful applications: Retrieval Augmented Generation (RAG) for question-answering over specific source information.

**Key concepts:**
- **Indexing**: Load → Split → Store (document loaders, text splitters, vector stores)
- **Retrieval & Generation**: Retrieve relevant splits, pass to model for answer

\`\`\`python
# Install: pip install langchain langchain-text-splitters langchain-community bs4
import bs4
from langchain.agents import create_agent
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load and chunk documents
loader = WebBaseLoader(
    web_paths=("https://example.com/post/",),
    bs_kwargs=dict(parse_only=bs4.SoupStrainer(class_=("post-content", "post-title", "post-header"))),
)
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)

# Index
vector_store.add_documents(documents=all_splits)

# Construct retrieval tool
@tool(response_format="content_and_artifact")
def retrieve_context(query: str):
    """Retrieve information to help answer a query."""
    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\\n\\n".join((f"Source: {doc.metadata}\\nContent: {doc.page_content}" for doc in retrieved_docs))
    return serialized, retrieved_docs

tools = [retrieve_context]
agent = create_agent(model, tools, system_prompt="Use the tool to help answer user queries.")

# Query
for step in agent.stream({"messages": [{"role": "user", "content": "What is task decomposition?"}]}, stream_mode="values"):
    step["messages"][-1].pretty_print()
\`\`\`

## Core Benefits (from LangChain docs)

- **Standard model interface**: Swap providers seamlessly, avoid lock-in
- **Easy to use, highly flexible agent**: Simple agent in under 10 lines, or full context engineering
- **Built on LangGraph**: Durable execution, human-in-the-loop, persistence
- **Debug with LangSmith**: Trace execution, capture state transitions, runtime metrics

---

# JEDI Implementation: LangChain in Real Client Solutions

## Go Answer: 24/7 Voice AI Agents

**Client Challenge**: Small business needed 24/7 customer support but couldn't afford round-the-clock staff.

**JEDI Solution**:
- **JEDI Ensemble™ Integration**: LangChain orchestrates multiple AI models for voice processing
- **RetellAI Integration**: Seamless voice-to-text and text-to-voice conversion
- **Conversational Memory**: Persistent context across customer interactions
- **Multi-step Reasoning**: Complex customer queries handled through LangChain chains

**Technical Implementation**:
- LangChain LLM wrappers for ChatGPT and Claude integration
- Custom memory systems for customer context retention
- Tool integration for CRM and knowledge base access
- Chain composition for multi-step customer service workflows

**Measurable Results**:
- **80% faster response times** compared to human agents
- **60% improved customer satisfaction** scores
- **40% reduction in support costs** while maintaining quality
- **99.9% uptime** with automatic failover systems

## CrisPRO Oncology Co-Pilot: Clinical Decision Support

**Client Challenge**: Oncology practice needed AI assistance for clinical decision support and patient education.

**JEDI Solution**:
- **JEDI Rules™ Integration**: LangChain enforces clinical protocols and guidelines
- **Medical Knowledge Base**: RAG system with oncology literature and guidelines
- **Patient Education**: Conversational AI for explaining complex medical concepts
- **Clinical Workflow**: Multi-step reasoning for treatment recommendations

**Technical Implementation**:
- LangChain document loaders for medical literature
- Vector stores for semantic search of clinical guidelines
- Custom agents for different clinical scenarios
- Memory systems for patient history and preferences

**Measurable Results**:
- **40% faster diagnosis time** for complex cases
- **60% improved patient understanding** of treatment options
- **95% accuracy** in clinical guideline adherence
- **50% reduction** in time spent on routine clinical tasks

## JEDI Ensemble™: Multi-Model Orchestration

**How JEDI Uses LangChain**:
- **Model Selection**: Automatically chooses best AI model for each task
- **Chain Composition**: Builds complex workflows from simple components
- **Memory Management**: Maintains context across multiple interactions
- **Tool Integration**: Connects AI to business systems and databases

**Scalability**: Works for any conversational AI use case — from customer service to clinical support to educational coaching.

## Official Resources

- [LangChain Quickstart](https://python.langchain.com/docs/quickstart)
- [RAG Agent Tutorial](https://python.langchain.com/docs/tutorials/rag/)
- [Installation Guide](https://python.langchain.com/oss/python/langchain/install)
`;

async function main() {
    console.log('🚀 LangChain Extract & Push to Hygraph');
    console.log('======================================\n');

    if (!ENDPOINT || !TOKEN) {
        console.error('❌ Missing VITE_HYGRAPH_ENDPOINT or VITE_HYGRAPH_TOKEN in .env');
        process.exit(1);
    }

    // 1. Query LangChain technology by slug
    const queryTech = `
        query GetLangChainTechnology {
            technologyS(where: { slug: "langchain" }, first: 1) {
                id
                name
                slug
                additonalDetails
            }
        }
    `;

    const qResult = await makeRequest(queryTech);
    if (qResult.error) {
        console.error('❌ Query failed:', qResult.error);
        process.exit(1);
    }
    if (qResult.errors && qResult.errors.length) {
        console.error('❌ GraphQL errors:', qResult.errors);
        process.exit(1);
    }

    const technologies = qResult.data?.technologyS ?? [];
    if (technologies.length === 0) {
        console.error('❌ Technology with slug "langchain" not found in Hygraph');
        process.exit(1);
    }

    const tech = technologies[0];
    console.log(`📌 Found: ${tech.name} (id: ${tech.id})`);
    console.log(`   Current additonalDetails: ${tech.additonalDetails ? `${tech.additonalDetails.length} chars` : 'empty'}\n`);

    // 2. Update additonalDetails
    const updateMutation = `
        mutation UpdateTechnologyDetails($id: ID!, $additonalDetails: String!) {
            updateTechnology(
                where: { id: $id }
                data: { additonalDetails: $additonalDetails }
            ) {
                id
                name
                slug
                additonalDetails
            }
        }
    `;

    const uResult = await makeRequest(updateMutation, {
        id: tech.id,
        additonalDetails: LANGCHAIN_ADDITIONAL_DETAILS.trim()
    });

    if (uResult.error) {
        console.error('❌ Update failed:', uResult.error);
        process.exit(1);
    }
    if (uResult.errors && uResult.errors.length) {
        console.error('❌ GraphQL errors:', uResult.errors);
        process.exit(1);
    }

    console.log('✅ Successfully updated LangChain additonalDetails');
    console.log(`   Pushed ${LANGCHAIN_ADDITIONAL_DETAILS.trim().length} characters`);
    console.log('\n📋 Content includes:');
    console.log('   - Official quickstart code (create_agent)');
    console.log('   - RAG agent tutorial concepts and code');
    console.log('   - JEDI implementation: Go Answer, CrisPRO, JEDI Ensemble™');
    console.log('   - Links to python.langchain.com docs');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
