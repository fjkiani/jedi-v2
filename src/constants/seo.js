/**
 * Central SEO constants for Jedi Labs
 * Use across Helmet components, meta tags, and structured data.
 */

export const SITE_URL = 'https://jedilabs.org';

export const DEFAULT_META = {
  title: 'Jedi Labs — We solve what AI fails',
  description: 'Production-grade deployment, training, evaluation, and benchmarking for frontier-model teams and enterprise AI. Four shipped demos with real evaluation curves, per-class F1, and live inference. No PowerPoint.',
  keywords: 'model evaluation, production AI, model deployment, ML benchmarking, LLM evaluation, computer vision, medical imaging, geospatial segmentation, audio classification, CLIP zero-shot, PyTorch, Hugging Face Spaces, MLOps, model failure modes',
  ogImage: `${SITE_URL}/og-image.jpg`,
  twitterImage: `${SITE_URL}/twitter-image.jpg`,
};

export const PAGE_META = {
  jedi: {
    title: 'Demos | Jedi Labs — Production Model Evaluations',
    description: 'Four production model demos with real evaluation curves: chest X-ray classification, coastline segmentation, ESC-50 audio, CLIP video zero-shot. Live inference on Hugging Face Spaces.',
  },
  useCases: {
    title: 'Use Cases | Jedi Labs — Production AI Implementations',
    description: 'Real production use cases across medical imaging, geospatial segmentation, audio classification, and video understanding. Every case backed by real metrics.',
  },
  caseStudies: {
    title: 'Case Studies | Jedi Labs — Production AI Results',
    description: 'Case studies from real production deployments. Evaluation curves, failure modes, per-class F1, and live inference — not screenshots.',
  },
  infrastructure: {
    title: 'Platform | Jedi Labs — Deployment & Evaluation Stack',
    description: 'The Jedi Labs platform: FastAPI scaffolds, Docker, Hugging Face Spaces, PyTorch training loops, and evaluation harnesses. Modular deployment for production AI.',
  },
  solutions: {
    title: 'Solutions | Jedi Labs — AI Deployment, Training, Evaluation',
    description: 'AI solutions across the model lifecycle: deployment, training, evaluation, benchmarking. Multi-model routing, data pipelines, and production ML.',
  },
  industries: {
    title: 'Industries | Jedi Labs — Medical, Geospatial, Audio, Video',
    description: 'Multi-domain production AI: medical imaging, geospatial segmentation, audio classification, video understanding. Real metrics per domain.',
  },
  technology: {
    title: 'Technology | Jedi Labs — PyTorch, HF Spaces, CLIP, MLOps',
    description: 'Our technology stack: PyTorch training loops, Hugging Face Spaces deployment, CLIP zero-shot, FastAPI, evaluation harnesses. Production ML tooling.',
  },
  about: {
    title: 'About | Jedi Labs — We solve what AI fails',
    description: 'Jedi Labs builds, evaluates, and deploys production AI for frontier-model teams and enterprises. Four shipped demos. Two GitHub orgs. Real metrics, not decks.',
  },
  contact: {
    title: 'Contact | Jedi Labs — Talk to Engineering',
    description: 'Talk to Jedi Labs engineering about production model deployment, training, evaluation, and benchmarking. Frontier-model teams and enterprise AI.',
  },
  blog: {
    title: 'Research | Jedi Labs — Evaluation Deep-Dives',
    description: 'Evaluation deep-dives, failure-mode analyses, training-curve postmortems, and benchmarks from real production deployments.',
  },
};
