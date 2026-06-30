/**
 * Jedi Labs content for the expanded /jedi page.
 *
 * Source of truth for: industry playbooks, capability matrix, technology spine,
 * and the portfolio anchor ribbon. Every "In our portfolio" callout is anchored
 * to an actual demonstrated number from /workspace/ai-training (mirrored in
 * aiTrainingDetails.js), so claims can be audited end-to-end.
 *
 * Convention: business framing uses "typical ranges" ("Companies typically..."),
 * with an explicit portfolioAnchor referencing real demo metrics so a skeptical
 * reader can distinguish marketing framing from evidence.
 */
import {
  FiActivity,
  FiCpu,
  FiDatabase,
  FiFilm,
  FiGlobe,
  FiHeadphones,
  FiHeart,
  FiLayers,
  FiLink,
  FiMonitor,
  FiServer,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

// ─── Industry playbooks ──────────────────────────────────────────────────────
// Each playbook pairs a portfolio domain with the businesses that have the same
// problem shape. Anchored to a working artifact on jedilabs.org/ai-training.
export const industryPlaybooks = [
  {
    id: "healthcare",
    title: "Healthcare & Imaging",
    icon: FiHeart,
    color: "from-blue-500 to-cyan-500",
    audiences: "Imaging clinics · Telerad providers · Medical-AI startups",
    problem:
      "Medical images arrive as DICOM with embedded metadata, vendor-specific encodings, and inconsistent geometry. Hand-rolled preprocessing is brittle, slow, and a common silent source of model drift.",
    capability:
      "End-to-end DICOM/NIfTI pipelines feeding production classifiers — preprocessing that actually survives multi-modality data.",
    workflow:
      "Bulk DICOM ingest → photometric + geometric normalization → routing model → reviewer queue / EMR write-back",
    typicalImpact:
      "Companies typically cut radiograph triage time from minutes per case to under 5 seconds — and remove a class of silent failures from inconsistent preprocessing.",
    portfolioAnchor: {
      label: "In our portfolio",
      detail:
        "MONAI U-Net classifier on MedNIST hits 99.3% validation accuracy in 5 epochs of CPU training. Live demo classifies 6 radiograph classes (AbdomenCT, BreastMRI, CXR, ChestCT, Hand, HeadCT) in ~1 second per image.",
      href: "/ai-training/medical",
      cta: "See the build",
    },
    blogSlug: "medical-dicom-to-classification",
  },
  {
    id: "climate",
    title: "Climate & Earth Observation",
    icon: FiGlobe,
    color: "from-green-500 to-emerald-500",
    audiences: "Insurance · Agritech · Disaster response · Sustainability",
    problem:
      "Satellite imagery arrives as gigabyte GeoTIFFs across multiple coordinate systems and resolutions. Most projects stall on tile alignment, CRS reprojection, and rasterizing vector labels.",
    capability:
      "Geospatial pipelines that turn raw scenes into model-ready tiles with aligned masks — and segment them with production U-Nets.",
    workflow:
      "Tile satellite scenes → reproject to common CRS → segment features → emit vector outputs into GIS / dashboards",
    typicalImpact:
      "Companies typically convert weeks of manual analyst review per region into hours of automated tiling and segmentation — making continuous monitoring economically feasible.",
    portfolioAnchor: {
      label: "In our portfolio",
      detail:
        "U-Net with a ResNet18 encoder, trained on synthetic land/water tiles, converges to ~100% IoU within 5 epochs. Live demo segments a coastline tile into 49.9% land / 50.1% water in ~1 second.",
      href: "/ai-training/geospatial",
      cta: "See the build",
    },
    blogSlug: "geospatial-geotiff-to-segmentation",
  },
  {
    id: "customer-ops",
    title: "Customer & Field Operations",
    icon: FiHeadphones,
    color: "from-purple-500 to-pink-500",
    audiences: "Call centers · Field operations · Security & surveillance",
    problem:
      "Raw audio is high-dimensional and vendor-locked. Manual review and tagging cap how many calls or environments a team can actually monitor — most never get reviewed.",
    capability:
      "Feature-engineering + classification pipelines that ingest raw audio (any common format) and route it to the right downstream action.",
    workflow:
      "Capture audio stream → extract spectral + cepstral features → classify / tag / alert → push to ops dashboard or ticketing",
    typicalImpact:
      "Companies typically expand audio coverage from <5% of streams reviewed to 100% — and surface anomalies in seconds instead of next-day batch reports.",
    portfolioAnchor: {
      label: "In our portfolio",
      detail:
        "Random Forest classifier on a 130-dim MFCC + chroma + spectral feature vector hits 60.3% test accuracy across 50 ESC-50 environmental classes (random chance: 2%). Trained in seconds on CPU; interpretable feature importances.",
      href: "/ai-training/audio",
      cta: "See the build",
    },
    blogSlug: "audio-features-to-rf-classifier",
  },
  {
    id: "media",
    title: "Media & Content Intelligence",
    icon: FiFilm,
    color: "from-orange-500 to-red-500",
    audiences: "Streaming · Post-production · Advertising · Brand safety",
    problem:
      "Video libraries are searchable by title, not by content. Tagging every scene by hand is impossible at scale, and labeled training data is expensive — most archives stay opaque.",
    capability:
      "Zero-shot video understanding — segment, sample, dedupe, and tag scenes without training data.",
    workflow:
      "Detect scenes → sample keyframes → deduplicate → zero-shot tag with CLIP → write to searchable index",
    typicalImpact:
      "Companies typically unlock a back catalog of 10,000+ hours for semantic search in a single deployment — no labeled training data required.",
    portfolioAnchor: {
      label: "In our portfolio",
      detail:
        "PySceneDetect + pHash dedup + CLIP ViT-Base-Patch32 zero-shot tagging. No training. Live demo segments a 4-scene clip and tags each keyframe with confidence (landscape 40.8%, text 31.9%, sky 97.7%, text 55.5%).",
      href: "/ai-training/video",
      cta: "See the build",
    },
    blogSlug: "video-zero-shot-tagging-with-clip",
  },
];

// ─── Capability matrix ───────────────────────────────────────────────────────
// What Jedi Labs builds, top-to-bottom. Synthesized from the portfolio's actual
// practice (the ai-training repo is the reference implementation).
export const capabilityMatrix = [
  {
    capability: "Data Pipelines",
    icon: FiDatabase,
    includes:
      "Format-specific ingestion (DICOM, GeoTIFF, audio, video), schema validation, deterministic preprocessing, train/val/test splitting, sample tracking",
    timeline: "1–3 weeks",
    landing: "Versioned `pipeline.py` modules + unit tests; replays the same way every time, in CI and in production.",
  },
  {
    capability: "Domain-Specific Models",
    icon: FiCpu,
    includes:
      "Architecture selection per modality (CNN, U-Net, Random Forest, transformer, zero-shot), training loops, checkpointing, metrics logging",
    timeline: "2–6 weeks",
    landing: "Trained checkpoints + `metrics.json` per run. Reproducible from the same data + seed.",
  },
  {
    capability: "Production Deployment",
    icon: FiServer,
    includes:
      "Container builds, model serving (Gradio / FastAPI / Streamlit), HuggingFace Spaces, cloud deployment (Vercel, Render, AWS), versioned releases",
    timeline: "1–2 weeks",
    landing: "Public URL or private endpoint. Reproducible builds. The model your team trained is the model your customers hit.",
  },
  {
    capability: "Integration Layer",
    icon: FiLink,
    includes:
      "API wrappers, auth (OAuth, API keys, JWT), webhooks, queue workers, batch jobs, downstream system connectors (Slack, Notion, Salesforce, GIS, EMR)",
    timeline: "2–4 weeks",
    landing: "Calls into your existing systems with the same SLAs and observability as the rest of your stack.",
  },
  {
    capability: "Monitoring & Iteration",
    icon: FiActivity,
    includes:
      "Inference logging, drift detection, golden-set regression tests, model cards, on-call runbooks, periodic retraining schedule",
    timeline: "Ongoing",
    landing: "Visibility into how the model behaves in the wild — and a defined process for catching when it stops working.",
  },
];

// ─── Technology spine ────────────────────────────────────────────────────────
// The actual stack used across the portfolio, grouped by pipeline layer.
// Each tile explains WHY the tool — not just lists names.
export const technologySpine = [
  {
    layer: "Ingest",
    icon: FiLayers,
    tools: [
      { name: "pydicom + SimpleITK", role: "DICOM and NIfTI medical I/O with battle-tested geometric primitives." },
      { name: "rasterio + geopandas", role: "GeoTIFF windowed reads, CRS reprojection, vector-to-raster rasterization." },
      { name: "librosa", role: "Audio loading with format-agnostic resampling and feature extraction primitives." },
      { name: "OpenCV + PySceneDetect", role: "Video decode, scene boundary detection, keyframe sampling." },
    ],
  },
  {
    layer: "Process",
    icon: FiSettings,
    tools: [
      { name: "NumPy + SciPy", role: "The lingua franca of array math; every other tool above eventually returns to it." },
      { name: "scikit-learn", role: "Classical ML primitives, feature engineering, train/val/test splitting." },
      { name: "MONAI transforms", role: "Medical-imaging-specific preprocessing — HU windowing, spacing normalization." },
      { name: "Shapely", role: "Geometric operations for spatial labels and tile boundary handling." },
    ],
  },
  {
    layer: "Model",
    icon: FiCpu,
    tools: [
      { name: "PyTorch", role: "Default deep learning framework — full control of training loops and architectures." },
      { name: "segmentation-models-pytorch", role: "Pretrained encoders + U-Net/FPN decoders for segmentation." },
      { name: "MONAI networks", role: "Medical-imaging architectures that don't reinvent the radiology wheel." },
      { name: "CLIP (transformers)", role: "Zero-shot classification when labels are expensive or non-existent." },
    ],
  },
  {
    layer: "Serve",
    icon: FiMonitor,
    tools: [
      { name: "Gradio", role: "Fast interactive demos — exactly what HuggingFace Spaces wants, with API endpoints built in." },
      { name: "FastAPI", role: "Production API layer when latency + auth + observability matter more than UI." },
      { name: "HuggingFace Spaces", role: "Free-tier demo hosting that integrates with HF model hub and the broader ML community." },
      { name: "Vercel", role: "Static + edge deployment for the marketing site and embedded demo iframes." },
    ],
  },
  {
    layer: "Observe",
    icon: FiActivity,
    tools: [
      { name: "metrics.json + JSON logs", role: "Versioned per-run metrics that travel with the checkpoint." },
      { name: "pytest", role: "Unit tests on preprocessing — the layer most likely to silently break." },
      { name: "MultiQC-style reports", role: "Aggregated quality control across batch jobs (when relevant)." },
      { name: "Lightweight drift hooks", role: "Distribution checks on inputs and outputs vs. training-time baselines." },
    ],
  },
];

// ─── Portfolio anchor ribbon ─────────────────────────────────────────────────
// Single horizontal strip with 4 anchors. Reinforces that every claim above
// is backed by a working artifact someone can actually try.
export const portfolioAnchors = [
  {
    id: "medical",
    title: "Medical Imaging",
    metric: "99.3% val acc · MedNIST",
    href: "/ai-training/medical",
    icon: FiHeart,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "geospatial",
    title: "Geospatial",
    metric: "~100% IoU · land/water",
    href: "/ai-training/geospatial",
    icon: FiGlobe,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "audio",
    title: "Audio",
    metric: "60.3% on ESC-50 · 2% chance",
    href: "/ai-training/audio",
    icon: FiHeadphones,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "video",
    title: "Video",
    metric: "Zero-shot · 4 scenes detected",
    href: "/ai-training/video",
    icon: FiFilm,
    color: "from-orange-500 to-red-500",
  },
];
