import React from 'react';
import SEO from '@/components/SEO';

const TERMS = [
  { term: 'Train/Val Split', definition: 'Partitioning of labeled data into a training subset (used to fit model parameters) and a validation subset (held out to measure generalization). Reported per-benchmark to avoid leakage.' },
  { term: 'Held-out Validation', definition: 'Data the model never sees during training, used to compute unbiased performance metrics. A prerequisite for any claim about production readiness.' },
  { term: 'Val Accuracy', definition: 'Fraction of held-out validation samples the model classifies correctly. Peak val accuracy of 0.9933 on the chest X-ray benchmark uses this metric.' },
  { term: 'Val IoU', definition: 'Intersection-over-Union on the validation set for segmentation tasks. The coastline U-Net benchmark reports best val IoU 0.9999 with training loss trajectory 0.09 → 0.001 over 10 epochs.' },
  { term: 'Macro F1', definition: 'Unweighted mean of per-class F1 scores. Measures balanced performance across all classes rather than favoring majority classes. The ESC-50 audio benchmark reports macro F1 0.5666 across 50 environmental sound classes.' },
  { term: 'Per-class F1', definition: 'F1 score (harmonic mean of precision and recall) computed independently for each label. Surfaces failure modes on rare classes that macro/micro averages hide.' },
  { term: 'Dual-axis Loss/IoU Chart', definition: 'A training-curve plot with two y-axes — training loss on one, validation metric (accuracy, IoU, F1) on the other. Lets a reader see convergence and generalization on the same time axis.' },
  { term: 'Epoch', definition: 'One full pass over the training dataset. Benchmarks report epoch counts (e.g., 10 epochs for the coastline U-Net) so readers can gauge training cost.' },
  { term: 'Epoch Collapse', definition: 'Symptom in which training loss keeps dropping but validation metric plateaus or degrades. Indicates overfit; the model is memorizing training data rather than learning generalizable features.' },
  { term: 'Cold-start Inference', definition: 'Latency of the first prediction after a model is loaded into memory. The CLIP ViT-B/32 zero-shot video benchmark reports ~5 s cold-start on a ~150 MB model.' },
  { term: 'Zero-shot', definition: 'Making predictions for classes or tasks the model was not explicitly trained on, using natural-language prompts or embedding similarity. Enabled by foundation models like CLIP.' },
  { term: 'Transfer Learning', definition: 'Reusing a model pre-trained on a large general corpus as the starting point for a smaller task-specific dataset. Cuts training data and compute requirements substantially.' },
  { term: 'Foundation Model', definition: 'A large model trained on broad data (CLIP, Whisper, LLaMA) that serves as a starting point for many downstream tasks via fine-tuning, prompting, or embeddings.' },
  { term: 'MLOps', definition: 'Practices and tooling for taking a trained model to production — versioning, packaging, deployment, monitoring, and iteration. What separates a notebook from a shipped product.' },
  { term: 'HF Space', definition: 'A Hugging Face Space — a hosted live demo of a model with a public URL. Jedi Labs benchmarks each link to their corresponding HF Space so results are live-inferrable, not just claimed.' },
  { term: 'PyTorch', definition: 'Open-source deep learning framework used for the imaging CNN and geospatial U-Net benchmarks. Provides tensors, autograd, and neural network primitives.' },
  { term: 'CNN (Convolutional Neural Network)', definition: 'Neural network architecture that uses convolutional layers to learn spatial feature hierarchies from images. Baseline for the chest X-ray benchmark.' },
  { term: 'U-Net', definition: 'Encoder-decoder segmentation architecture with skip connections. Used for the coastline segmentation benchmark that reaches best val IoU 0.9999.' },
  { term: 'CLIP', definition: 'Contrastive Language-Image Pretraining — OpenAI foundation model that embeds text and images into a shared vector space, enabling zero-shot classification via cosine similarity to label prompts.' },
  { term: 'ViT (Vision Transformer)', definition: 'Transformer architecture applied to images by treating patches as tokens. The video benchmark uses CLIP ViT-B/32 (base model, 32-pixel patches, ~150 MB).' },
  { term: 'Reproducibility', definition: 'The ability for a third party to recreate reported numbers from published code, data, and hyperparameters. Every Jedi Labs benchmark is reproducible from the fjkiani GitHub org.' },
  { term: 'Production AI', definition: 'AI systems that operate reliably on live traffic — with monitoring, error budgets, and rollback paths — rather than research prototypes. The distinction Jedi Labs optimizes for.' },
  { term: 'Random Forest', definition: 'Classical ensemble of decision trees. Used as the classifier over 130-dim engineered audio features on the ESC-50 benchmark (test accuracy 0.6033).' },
  { term: 'Feature Engineering', definition: 'Hand-crafting input representations (MFCCs, spectral rolloff, zero-crossing rate for audio) rather than letting the model learn them from raw data. Cheaper to train, easier to debug.' },
  { term: 'JSON-LD', definition: 'JSON for Linked Data — a schema.org-based structured-data format embedded in HTML that lets crawlers and AI understand entities, datasets, and how-tos on a page.' },
  { term: 'Dataset Schema (schema.org)', definition: 'Structured-data type for describing datasets — name, license, creator, variableMeasured. Emitted by /benchmarks so external systems can cite the numbers.' },
  { term: 'HowTo Schema (schema.org)', definition: 'Structured-data type for step-by-step methodologies. Emitted alongside Dataset on /benchmarks so the training recipe is machine-readable.' },
  { term: 'Prerender', definition: 'Build-time execution of the SPA in a headless browser to emit fully-rendered HTML for each route. Required for SEO and AI crawlers that do not execute JavaScript.' },
];

const glossaryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Jedi Labs Production AI Glossary',
  description: 'Definitions of AI, machine learning, and MLOps terms as Jedi Labs uses them on the benchmarks and methodology pages.',
  hasDefinedTerm: TERMS.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': `https://jedilabs.org/glossary#${t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: t.term,
    description: t.definition,
    inDefinedTermSet: 'https://jedilabs.org/glossary',
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jedilabs.org/' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://jedilabs.org/glossary' },
  ],
};

const GlossaryPage = () => {
  return (
    <>
      <SEO
        title="Glossary | Jedi Labs — Production AI Terminology Defined"
        description="Definitions of the AI, machine learning, and MLOps terms Jedi Labs uses when reporting benchmarks. Val IoU, macro F1, epoch collapse, cold-start inference, zero-shot, transfer learning, and more."
        path="/glossary"
        ogImage="https://jedilabs.org/og/og-glossary.png"
        keywords="AI glossary, machine learning terminology, val IoU, macro F1, epoch collapse, cold-start inference, zero-shot learning, transfer learning, MLOps definitions, production AI vocabulary"
        jsonLd={[glossaryJsonLd, breadcrumbJsonLd]}
      />
      <main className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <header className="mb-12">
            <p className="text-sm uppercase tracking-widest text-primary-main mb-3">Reference</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Production AI Glossary</h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              How Jedi Labs uses the technical terms that appear across our benchmarks, methodology, and demo pages.
              If a number on <a href="/benchmarks" className="text-primary-main underline">/benchmarks</a> uses a term,
              its exact meaning is here.
            </p>
          </header>

          <dl className="space-y-8">
            {TERMS.map((t) => (
              <div
                key={t.term}
                id={t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                className="border-l-2 border-primary-main/30 pl-6 hover:border-primary-main transition-colors"
              >
                <dt className="text-xl font-semibold text-white mb-2">{t.term}</dt>
                <dd className="text-gray-300 leading-relaxed">{t.definition}</dd>
              </div>
            ))}
          </dl>

          <footer className="mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500">
            <p>
              Every metric mentioned here appears in a public number on{' '}
              <a href="/benchmarks" className="text-primary-main underline">/benchmarks</a>{' '}
              and machine-readably in{' '}
              <a href="/api/oracle.json" className="text-primary-main underline">/api/oracle.json</a>.
              Terminology corrections welcome at{' '}
              <a href="mailto:hello@jedilabs.org" className="text-primary-main underline">hello@jedilabs.org</a>.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default GlossaryPage;
