# Use Case Plan: Cancer Research (Healthcare)

## Overview

**Working title:** AI-Assisted Cancer Literature & Evidence Synthesis  
**Slug (candidate):** `cancer-literature-evidence-synthesis` or `ai-cancer-research-synthesis`  
**Industry:** Healthcare (`industrySlug: "healthcare"`)  
**Category (Hygraph):** AI Agents (same as Research Assistant) – agent-driven RAG and tool use.

**One-line pitch:** Research and clinical teams are overwhelmed by the volume of oncology literature. We built an AI system that ingests papers and guidelines, answers natural-language questions with citations, surfaces evidence by biomarker or regimen, and helps draft structured literature reviews—so teams spend less time searching and more time on hypothesis and care.

---

## Problem Statement (for description)

- **Volume:** Thousands of oncology papers and guidelines publish every year; no one can read everything.
- **Fragmentation:** Evidence is spread across PubMed, trial registries, institutional repos, and guidelines; manual synthesis is slow and error-prone.
- **Stakeholders:** Academic labs, hospital research units, and life-sciences teams need to stay current, support grant writing, and align with standards (e.g. NCCN, ESMO) without hiring a full-time literature team.

This use case focuses on **research and evidence synthesis**, not on direct clinical decision support (that’s CrisPRO). It’s the “research assistant” pattern applied to cancer/oncology.

---

## Capabilities (bullet list for UI)

1. Ingest and index oncology literature (papers, guidelines, trial summaries) from configurable sources.
2. Answer natural-language questions with cited, relevant excerpts (RAG over your corpus).
3. Surface evidence by biomarker, cancer type, regimen, or outcome so researchers can compare and contrast.
4. Generate structured literature-review drafts (sections, key findings, gaps) to accelerate grant and manuscript writing.
5. Track and summarize new papers matching saved topics or queries so teams stay current.
6. Keep citations and provenance so every claim can be traced to a source (important for compliance and rigor).

---

## Suggested Queries (for “Ask the Co-Pilot” / demo)

- What’s the latest evidence for [biomarker X] in [cancer type Y]?
- Summarize guideline recommendations for first-line treatment of [cancer type].
- Which trials in the last 2 years reported outcomes for [regimen or target]?
- Draft a short “state of the evidence” section for [topic] with citations.
- How do [guideline A] and [guideline B] differ on [specific question]?

---

## Metrics (things you’d actually measure)

- Time from “question” to “draft answer with citations” (e.g. minutes vs. days of manual search).
- Number of papers or guidelines indexed and searchable.
- User-reported relevance/helpfulness of answers (e.g. survey or thumbs up/down).
- Citation accuracy: % of model-generated citations that match real sources in the corpus.
- Usage of “literature review draft” and “evidence by biomarker/regimen” features (adoption).

No invented percentages; keep as directional goals (e.g. “reduce time to first draft,” “improve citation accuracy over baseline”).

---

## Architecture (high level)

**Description (for Hygraph):**  
A research-oriented RAG pipeline: documents (PDFs, abstracts, guideline HTML) are chunked and embedded; a vector store supports semantic search. An agent (e.g. LangChain) receives the user question, retrieves top-k chunks (and optionally metadata filters like cancer type or year), and generates an answer with inline citations. Optional: a “literature review” mode that runs multiple queries and assembles sections. Pipeline can run in your VPC or a compliant cloud; data can stay on-prem or in a single-tenant environment.

**Components (4–5):**

1. **Document ingestion & chunking**  
   - Description: Ingest papers, guidelines, and trial summaries; chunk by section or paragraph; extract metadata (title, authors, year, cancer type, biomarker if present).  
   - Details: Support PDF, HTML, and optionally PubMed/API. Chunking strategy (e.g. semantic or section-based) affects retrieval quality.  
   - Explanation: Single place where “raw literature” becomes “searchable units with metadata”; quality here drives downstream answer quality.

2. **Embedding & vector store**  
   - Description: Embed chunks with a clinical/biological embedding model (or general-purpose) and store in a vector DB (e.g. Weaviate) with metadata filters.  
   - Details: Index supports filter by cancer type, year, source type (trial vs. guideline vs. review).  
   - Explanation: Enables fast semantic search and filtered retrieval so answers stay on-topic and up-to-date.

3. **Retrieval & citation layer**  
   - Description: Given a question, retrieve top-k chunks (and optional metadata filters); return chunks with source IDs and snippets for citation.  
   - Details: Can use hybrid (keyword + vector) or reranking to improve precision.  
   - Explanation: Ensures every claim in the answer can be tied to a specific document and passage.

4. **Question-answering agent**  
   - Description: Agent (e.g. LangChain) takes the question and retrieved chunks, generates an answer with inline citations, and optionally structures output (e.g. “Evidence for/against,” “Gaps”).  
   - Details: System prompt enforces “only use provided context,” “cite source ID for each claim,” and “if not in context, say so.”  
   - Explanation: One orchestration layer for both ad-hoc Q&A and structured tasks (e.g. draft literature review sections).

5. **(Optional) Alerts & saved topics**  
   - Description: Save topics or queries; periodically run ingestion for new papers and notify when new evidence matches.  
   - Details: Can be a separate job or part of the same platform; depends on scope.  
   - Explanation: Keeps research teams current without manual monitoring.

**Flow (5 steps):**

1. **Ingest** – New documents added to the pipeline; chunked and enriched with metadata.  
2. **Index** – Chunks embedded and written to the vector store with metadata.  
3. **Query** – User asks a question (and optionally applies filters).  
4. **Retrieve** – Vector + optional keyword/rerank returns ranked chunks with citations.  
5. **Answer** – Agent produces an answer with inline citations and optional structured sections.

---

## Implementation (for Hygraph JSON)

**Requirements:**

- Curated list of sources (e.g. PubMed, institutional repos, guideline URLs) or API keys where needed.
- Document storage (e.g. S3 or equivalent) and a secure environment for embedding and inference.
- Optional: SSO or identity provider for access control; audit logging for who asked what.

**Success metrics:**

- Time to first useful answer (target: minutes).
- Citation accuracy and user satisfaction (e.g. surveys).
- Number of papers/sources indexed and freshness (e.g. monthly update).

**Integration points:**

- Document storage (S3, SharePoint, or similar).
- PubMed / PMC or other APIs for automated ingestion.
- Vector DB (Weaviate, Pinecone, or equivalent).
- LLM API (OpenAI, Anthropic, or Azure) with BAA if in scope for healthcare.

---

## Technologies to link in Hygraph (after create)

- **LangChain** – agent orchestration, tools, chains.
- **Weaviate** (or other vector DB) – semantic search and metadata filtering.
- **GPT-4 / Claude** – generation and citation-aware prompts.
- **Hugging Face** (optional) – embedding models or domain-specific NER.
- **Knowledge Graphs** (optional) – if you add entity extraction and relationship storage for biomarkers, drugs, trials.

---

## Differentiation from other use cases

| Use case | Focus | This one |
|----------|--------|----------|
| **CrisPRO Oncology Co-Pilot** | Clinical decision support, trial matching, care pathway | **Cancer research** = literature & evidence synthesis, grant/manuscript support, staying current |
| **AI-Powered Research Assistant (Education)** | General academic/business research | **Same pattern**, domain = cancer/oncology, healthcare compliance and citation rigor |

---

## Next steps

1. **Copy this into a JSON** in `scripts/migrations/hygraph/extracted/` (e.g. `use_case_cancer_research_synthesis.json`) using the same shape as `use_case_24_7_voice_ai_langchain.json`: `industrySlug`, `useCase` with `title`, `slug`, `description`, `capabilities`, `queries`, `metrics`, `architecture` (description + components + flow), `implementation` (requirements, success_metrics, integration_points).
2. **Confirm slug** with team: e.g. `cancer-literature-evidence-synthesis` or `ai-cancer-research-synthesis`.
3. **Run push script:** `python push_use_case_from_json.py --input scripts/migrations/hygraph/extracted/use_case_cancer_research_synthesis.json`
4. **In Hygraph:** Link the use case to the **Healthcare** industry and to technologies (LangChain, Weaviate, etc.); publish UseCase, Architecture, Components, FlowSteps, and set implementation JSON as done for the telecom use case.
5. **Optional:** Add a link from the Healthcare industry page or from CrisPRO (“For research and literature synthesis, see [Cancer Literature & Evidence Synthesis]”).

---

## File reference

- Template JSON shape: `scripts/migrations/hygraph/extracted/use_case_24_7_voice_ai_langchain.json`
- Push script: `scripts/migrations/hygraph/push_use_case_from_json.py`
- Industry solution page (URL): `/industries/healthcare/<use-case-slug>`
