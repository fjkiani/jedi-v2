export const aboutContent = {
  meta: {
    title: "About | Jedi Labs — Team, Vision, and Production AI Mission",
    description: "Jedi Labs builds, evaluates, and deploys production AI for frontier-model teams and enterprises. Meet the team and see our production model demos with real evaluation curves."
  },

  hero: {
    highlightText: "We solve what AI fails.",
    title: "About Jedi Labs",
    description: "We are not a consulting firm. We are the engineering team you call when your model passes evaluation and dies in production — or when you need someone to build the deployment, the evaluation harness, and the failure-mode catalogue from scratch. Four production demos. Two GitHub orgs shipping continuously. Real metrics, not decks.",
    stats: [
      { value: "4", label: "Production Model Demos" },
      { value: "2", label: "GitHub Orgs Shipping" },
      { value: "Real", label: "Metrics, Not Decks" }
    ]
  },

  vision: {
    title: "The Jedi Approach",
    description: "AI ships with a training accuracy number and a demo GIF. Production ships without either. We close that gap: evaluation harnesses that surface epoch-4 collapses, dual-axis loss/IoU curves that expose overfit, per-class F1 that shows which classes silently fail, and deployment pipelines that measure what we ship.",
    image: "/images/about/vision.webp",
    imageAlt: "Jedi Labs — evaluation curves and production deployment",
    highlights: [
      {
        id: "deploy",
        text: "Deploy — FastAPI, Docker, HF Spaces, live inference",
        icon: {
          path: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
          viewBox: "0 0 24 24"
        }
      },
      {
        id: "train",
        text: "Train — PyTorch loops, checkpoints, reproducible splits",
        icon: {
          path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
          viewBox: "0 0 24 24"
        }
      },
      {
        id: "evaluate",
        text: "Evaluate — train/val curves, per-class F1, failure modes",
        icon: {
          path: "M3 3v18h18 M8 17l4-8 4 4 4-6",
          viewBox: "0 0 24 24"
        }
      },
      {
        id: "benchmark",
        text: "Benchmark — dual-axis metrics, zero-shot classifiers, published deep-dives",
        icon: {
          path: "M3 12l4-8h10l4 8-9 9-9-9z M12 4v17",
          viewBox: "0 0 24 24"
        }
      }
    ]
  },

  values: {
    title: "What We Deliver",
    subtitle: "Every capability below has a live artifact you can inspect.",
    items: [
      {
        title: "Deploy",
        description: "Production FastAPI scaffolds, Docker + HF Spaces deployment, live inference endpoints. See it: /ai-training.",
        icon: { path: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", viewBox: "0 0 24 24" }
      },
      {
        title: "Train",
        description: "PyTorch training loops, reproducible train/val/test splits, checkpoint management, multi-domain (medical, geospatial, audio, video). See it: ai-training GitHub.",
        icon: { path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4", viewBox: "0 0 24 24" }
      },
      {
        title: "Evaluate",
        description: "Train/val loss & accuracy curves, epoch-collapse detection, dual-axis loss/IoU, per-class F1, sorted-bar diagnostics across 50-class problems. See it: /jedi.",
        icon: { path: "M3 3v18h18 M8 17l4-8 4 4 4-6", viewBox: "0 0 24 24" }
      },
      {
        title: "Benchmark",
        description: "Zero-shot classifiers (CLIP), baseline lift measurements, published evaluation deep-dives. See it: /blog.",
        icon: { path: "M3 12l4-8h10l4 8-9 9-9-9z M12 4v17", viewBox: "0 0 24 24" }
      }
    ]
  },

  expertise: {
    title: "Where We Ship",
    subtitle: "Four production demos across four modalities. Real inference, not screenshots.",
    areas: [
      {
        title: "Medical Imaging",
        description: "Chest X-ray classification with catastrophic-forgetting analysis. Epoch-4 validation collapse from 0.99 → 0.76 is visible in the training curve.",
        features: [
          "PyTorch CNN + train/val split",
          "Val accuracy peak: 0.9933",
          "Live inference on HF Spaces"
        ]
      },
      {
        title: "Geospatial Segmentation",
        description: "Coastline land/water segmentation with dual-axis train_loss + val_IoU tracking. Loss decreases 0.09 → 0.001 over 10 epochs.",
        features: [
          "IoU-based evaluation",
          "Best val IoU: 0.9999",
          "Dual-axis metric tracking"
        ]
      },
      {
        title: "Audio Classification",
        description: "50-class ESC-50 classifier with hand-crafted features (MFCC + chroma + contrast + tonnetz + mel). 30× lift over 2% random baseline.",
        features: [
          "Test accuracy: 0.6033",
          "Macro F1: 0.5666 across 50 classes",
          "Random Forest + 130-dim features"
        ]
      },
      {
        title: "Video Understanding",
        description: "CLIP ViT-B/32 zero-shot classification across sampled scenes. Real cold-start inference on HF Spaces, no pre-computed cache.",
        features: [
          "Zero-shot: no fine-tuning",
          "~150MB model, ~5s cold start",
          "Per-scene top-3 probabilities"
        ]
      }
    ]
  },

  team: {
    title: "The Team",
    subtitle: "Engineers who ship production models — not slide decks.",
    comingSoon: {
      icon: { path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", viewBox: "0 0 24 24" },
      text: "Meet the team"
    }
  }
};
