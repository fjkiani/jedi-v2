/**
 * Static fallback jobs when Hygraph is unavailable
 */
export const FALLBACK_JOBS = [
  {
    id: 'static-1',
    title: 'Senior AI Solutions Engineer',
    slug: 'senior-ai-solutions-engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    excerpt:
      'Ship production AI systems for Healthcare, Finance, and Education. Work with LLM orchestration, MCP, and custom trained models.',
    requirements: [
      '5+ years experience with Python, Node.js',
      'Experience with LLMs (OpenAI, Claude, Gemini)',
      'Cloud platforms (AWS, GCP)',
      'Strong communication skills',
    ],
  },
  {
    id: 'static-2',
    title: 'Applied AI Engineer (Voice & Security)',
    slug: 'applied-ai-engineer-voice-security',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    excerpt:
      'Design and deploy voice agents, identity layers, and MCP-based security tooling for enterprise AI.',
    requirements: [
      'Experience with RetellAI, voice APIs',
      'OAuth 2.0, RBAC, Zero-Trust architecture',
      'MCP (Model Context Protocol)',
      'HIPAA/SOC2 awareness',
    ],
  },
  {
    id: 'static-3',
    title: 'AI Search Optimization Consultant',
    slug: 'ai-search-optimization-consultant',
    department: 'Solutions',
    location: 'Remote (US)',
    type: 'Contract / Full-time',
    excerpt:
      'Help consulting firms increase organic traffic and lead quality with AI search optimization (AISO).',
    requirements: [
      'SEO/GEO experience',
      'Hugging Face, custom models',
      'Analytics and reporting',
      'Client-facing skills',
    ],
  },
];
