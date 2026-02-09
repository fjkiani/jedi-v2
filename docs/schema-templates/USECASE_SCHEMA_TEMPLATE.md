# UseCase Schema Content Template

Use this template when creating or updating UseCase entries in Hygraph (e.g. AI-Powered Research Assistant).

---

## Required Fields

### Title
*Descriptive use case name*
```
Example: AI-Powered Research Assistant
```

### Slug
*URL-friendly identifier*
```
Example: ai-powered-research-assistant
```

### Description
*1–2 sentence overview*
```
Example: Enterprise-grade research automation that transforms how organizations handle academic and business research.
```

### Queries
*Demo prompts for Terminal/Test tab (one per line)*
```
Analyze 100+ research papers to extract key methodologies and findings
Compare methodologies across the top 5 papers on [topic]
Generate a literature review for [research question]
```

### Capabilities
*List of capabilities (one per line)*
```
Real-time processing of academic papers and research documents
Deep semantic understanding of research methodologies and results
Cross-paper analysis and contradiction detection
Citation network analysis and impact tracking
Automated literature review generation
```

---

## Story Fields

### Client Challenge
*The real problem – pain points, constraints*
```markdown
Researchers spend weeks manually reviewing hundreds of papers. Key connections and contradictions are missed. Literature reviews take months. No single system connects insights across papers.
```

### Before State
*How things worked before*
```markdown
- Manual keyword search across databases
- Copy-paste into spreadsheets
- No automated extraction of methodologies
- Literature reviews: 4–6 weeks typical
```

### JEDI Approach
*How JEDI solves it – methodology*
```markdown
We built a semantic layer that ingests papers, maps citation networks, and surfaces methodology patterns. Researchers query in natural language instead of keyword search. The system learns from each query to improve recommendations.
```

### Outcomes
*What changed – behavioral shifts*
```markdown
- Researchers query in plain English
- Cross-paper insights surface automatically
- Literature reviews generated in days, not weeks
- Novel connections discovered that manual review missed
```

### Results Headline
*One-line impact*
```
Example: 80% research time reduction, 95% relevant paper discovery
```

### Results Narrative
*Story around the metrics*
```markdown
One institution cut literature review from 6 weeks to 4 days. Methodology extraction accuracy reached 93%. Citation network accuracy: 99%.
```

---

## Terminal / Test Tab

### Query Examples (JSON)
*Structured example inputs/outputs*
```json
{
  "examples": [
    {
      "input": "Compare methodologies across the top 5 papers on transformer architectures",
      "output": "Found 5 papers. Key methodologies: attention mechanisms, pre-training strategies..."
    }
  ]
}
```

### Test Scenarios
*Scenarios users can try*
```markdown
**Try this:** Ask for methodology comparison across 3 papers on your research topic.

**Try this:** Request a literature review outline for a specific question.
```

---

## Architecture & Tech

### Architecture Narrative
*High-level explanation of how the system is built*
```markdown
Ingestion pipeline → Embedding layer → Vector store → Query engine → Response synthesis. Components: Document parser, semantic encoder, knowledge graph builder.
```

### Technology Narrative
*Why these technologies*
```markdown
Weaviate for semantic search. LangChain for orchestration. Hugging Face for embeddings. PostgreSQL for structured metadata.
```

### Implementation Timeline
*Duration*
```
Example: 8–12 weeks
```

### Prerequisites
*Data, integrations, access needed*
```markdown
- Academic database API access (e.g. Semantic Scholar)
- Secure research data storage
- High-performance compute for embeddings
```

### Risks & Mitigations
*Risks and how to address*
```markdown
**Risk:** Citation data gaps. **Mitigation:** Multi-source ingestion with conflict resolution.
```

### Capability Narrative
*Context for capabilities – why each matters*
```markdown
Cross-paper analysis surfaces contradictions that manual review often misses. Citation network analysis reveals impact and influence patterns.
```

### Before/After Comparison (JSON)
```json
{
  "before": "4–6 weeks for literature review",
  "after": "4 days",
  "metric": "Literature review time"
}
```

---

## Media

### Hero Image
*Upload cover image*

### Demo Video URL
*YouTube or Vimeo URL*
```
Example: https://www.youtube.com/watch?v=xxxxx
```

### PDF Deck
*Upload presentation or spec PDF*

---

## Relations

- **Industry** – Link industry (e.g. Education)
- **Architecture** – Link Architecture (description, components, flow)
- **Technologies** – Link Technology entries
- **Category** – Link Category (e.g. AI Agents)
- **Industry Application** – Link industry applications
