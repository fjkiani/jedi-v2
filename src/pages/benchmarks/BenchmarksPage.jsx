import SEO from '@/components/SEO';
import Section from '@/components/Section';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

/**
 * /benchmarks — Jedi Labs public performance numbers.
 * One source of truth for the metrics we cite everywhere else (Hero,
 * JediApplicationsPreview, About vision, sales conversations).
 *
 * Every number here is:
 *   - reproducible from the code in the fjkiani/jedi-labs GitHub org
 *   - measured on held-out validation or test data
 *   - live-inferrable from the linked Hugging Face Space
 *
 * If you change a number here, update the source in `src/data/benchmarks.js`
 * and the display consumers (about.js, JediPage) simultaneously.
 */

const SITE_URL = 'https://jedilabs.org';

const BENCHMARKS = [
  {
    id: 'medical-imaging-val-acc',
    domain: 'Medical Imaging',
    demo: 'Chest X-ray classifier',
    metric: 'Val accuracy',
    value: '0.9933',
    valueSuffix: '',
    description: 'PyTorch CNN trained with train/val split on chest X-ray classification. Peak validation accuracy across 15 epochs.',
    dataset: 'Chest X-ray public benchmark',
    sampleSize: null,
    architecture: 'PyTorch CNN + train/val split',
    hfSpace: 'https://huggingface.co/spaces/fjkiani/chest-xray',
    verified: '2026-06',
    featured: true,
  },
  {
    id: 'geospatial-val-iou',
    domain: 'Geospatial Segmentation',
    demo: 'Coastline land/water',
    metric: 'Best val IoU',
    value: '0.9999',
    valueSuffix: '',
    description: 'Semantic segmentation of coastline aerial imagery. Dual-axis train_loss + val_IoU tracking across 10 epochs, loss trajectory 0.09 → 0.001.',
    dataset: 'Coastline aerial segmentation corpus',
    sampleSize: null,
    architecture: 'U-Net variant with IoU-based loss',
    hfSpace: 'https://huggingface.co/spaces/fjkiani/coastline-segmentation',
    verified: '2026-06',
    featured: true,
  },
  {
    id: 'audio-macro-f1',
    domain: 'Audio Classification',
    demo: 'ESC-50 environmental audio',
    metric: 'Macro F1',
    value: '0.5666',
    valueSuffix: '',
    description: 'ESC-50 50-class environmental audio classification. Random Forest on 130-dimensional hand-engineered features. Test accuracy 0.6033. Per-class F1 sorted-bar diagnostics expose which of the 50 classes silently fail.',
    dataset: 'ESC-50',
    sampleSize: 2000,
    architecture: 'Random Forest + 130-dim audio features',
    hfSpace: 'https://huggingface.co/spaces/fjkiani/esc50-audio',
    verified: '2026-06',
    featured: true,
  },
  {
    id: 'audio-test-acc',
    domain: 'Audio Classification',
    demo: 'ESC-50 environmental audio',
    metric: 'Test accuracy',
    value: '0.6033',
    valueSuffix: '',
    description: 'ESC-50 test-set accuracy (paired with the Macro F1 above). Random Forest baseline, feature-engineered — chosen over a heavier neural model to demonstrate that per-class F1 diagnostics matter more than aggregate accuracy.',
    dataset: 'ESC-50',
    sampleSize: 2000,
    architecture: 'Random Forest + 130-dim audio features',
    hfSpace: 'https://huggingface.co/spaces/fjkiani/esc50-audio',
    verified: '2026-06',
    featured: false,
  },
  {
    id: 'video-zero-shot-latency',
    domain: 'Video Understanding',
    demo: 'CLIP scene classifier',
    metric: 'Cold-start inference',
    value: '~5s',
    valueSuffix: '',
    description: 'CLIP ViT-B/32 zero-shot classification across sampled video scenes. Real cold-start inference on Hugging Face Spaces — no pre-computed cache, no warmed-up endpoint. ~150 MB model download on cold start.',
    dataset: 'Sampled video scenes (zero-shot)',
    sampleSize: null,
    architecture: 'CLIP ViT-B/32 (frozen)',
    hfSpace: 'https://huggingface.co/spaces/fjkiani/clip-video-scenes',
    verified: '2026-06',
    featured: true,
  },
];

const METHODOLOGY_STEPS = [
  {
    name: 'Assemble',
    text: 'Pull the public validation/test cohort (e.g. ESC-50, chest X-ray, coastline imagery, sampled video). Freeze a versioned snapshot in the training repo. No proprietary data enters the public number.',
  },
  {
    name: 'Train',
    text: 'Run the training loop end-to-end with reproducible seed, published architecture, and checkpoint management. All code lives in the fjkiani GitHub org and the ai-training repo.',
  },
  {
    name: 'Evaluate',
    text: 'Compute the reported metric (accuracy / IoU / F1) against held-out validation or test data. Dual-axis loss curves and per-class F1 are logged for every training run to surface the failure modes.',
  },
  {
    name: 'Ship',
    text: 'Post the number here and on the corresponding Hugging Face Space with live inference. If the number moves, the Space moves. If the Space breaks, the number is retracted until it does not.',
  },
];

const BenchmarkCard = ({ benchmark, isDark }) => {
  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        isDark
          ? 'bg-n-7 border-n-6 hover:border-color-1/50'
          : 'bg-white border-n-3 hover:border-color-1/50 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`text-xs uppercase font-mono tracking-wider mb-1 ${isDark ? 'text-color-1' : 'text-color-1'}`}>
            {benchmark.domain}
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-n-1' : 'text-n-8'}`}>
            {benchmark.demo}
          </h3>
        </div>
        {benchmark.featured && (
          <FiCheckCircle className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-color-1' : 'text-color-1'}`} />
        )}
      </div>

      <div className="mb-4">
        <div className={`text-4xl font-bold font-mono ${isDark ? 'text-n-1' : 'text-n-8'}`}>
          {benchmark.value}
          <span className="text-sm font-normal ml-2">{benchmark.valueSuffix}</span>
        </div>
        <div className={`text-sm font-mono ${isDark ? 'text-n-4' : 'text-n-5'}`}>
          {benchmark.metric}
        </div>
      </div>

      <p className={`text-sm mb-4 ${isDark ? 'text-n-3' : 'text-n-6'}`}>
        {benchmark.description}
      </p>

      <div className={`grid grid-cols-2 gap-2 text-xs pb-4 border-b ${isDark ? 'border-n-6 text-n-4' : 'border-n-3 text-n-5'}`}>
        <div>
          <div className="font-mono uppercase mb-1 opacity-60">Dataset</div>
          <div>{benchmark.dataset}{benchmark.sampleSize ? ` (n=${benchmark.sampleSize.toLocaleString()})` : ''}</div>
        </div>
        <div>
          <div className="font-mono uppercase mb-1 opacity-60">Architecture</div>
          <div>{benchmark.architecture}</div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between text-xs">
        <a
          href={benchmark.hfSpace}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-mono transition-colors ${isDark ? 'text-color-1 hover:text-color-1/80' : 'text-color-1 hover:text-color-1/80'}`}
        >
          Live inference on Hugging Face <FiArrowRight className="w-3 h-3" />
        </a>
        <span className={`font-mono opacity-60 ${isDark ? 'text-n-4' : 'text-n-5'}`}>
          verified {benchmark.verified}
        </span>
      </div>
    </div>
  );
};

const BenchmarksPage = () => {
  const { isDarkMode } = useTheme();
  const D = isDarkMode;

  // Build Dataset JSON-LD
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Jedi Labs public benchmarks',
    description:
      'Public performance numbers for Jedi Labs shipped model demos across medical imaging, geospatial segmentation, audio classification, and video understanding. Every number is reproducible from the fjkiani GitHub org and live-inferrable from the linked Hugging Face Space.',
    url: `${SITE_URL}/benchmarks`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'Jedi Labs' },
    keywords: [
      'AI benchmarks',
      'chest X-ray classification',
      'coastline segmentation',
      'ESC-50 audio classification',
      'CLIP zero-shot video',
      'production AI evaluation',
      'held-out validation',
    ],
    measurementTechnique: 'Held-out validation / test accuracy, IoU, macro-F1, and cold-start inference latency',
    variableMeasured: BENCHMARKS.map((b) => ({
      '@type': 'PropertyValue',
      name: b.metric,
      value: b.value,
      description: `${b.description} Dataset: ${b.dataset}${b.sampleSize ? `, n=${b.sampleSize}` : ''}.`,
    })),
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/api/oracle.json` },
    ],
    dateModified: '2026-07-05',
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Jedi Labs publishes benchmark numbers',
    description: 'The four-step process by which every benchmark number on this page is produced and posted.',
    step: METHODOLOGY_STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Benchmarks', item: `${SITE_URL}/benchmarks` },
    ],
  };

  const featured = BENCHMARKS.filter((b) => b.featured);
  const secondary = BENCHMARKS.filter((b) => !b.featured);

  return (
    <>
      <SEO
        title="Benchmarks | Jedi Labs — Reproducible AI Performance Numbers"
        description="Every performance number Jedi Labs cites in one place. Val accuracy 0.9933 (chest X-ray), val IoU 0.9999 (coastline), Macro F1 0.5666 across 50 classes (ESC-50 audio), cold-start ~5s (CLIP zero-shot video). All reproducible from GitHub, all live on Hugging Face."
        path="/benchmarks"
        keywords="AI benchmarks, chest X-ray classifier, coastline segmentation, ESC-50, CLIP zero-shot, production AI evaluation, Hugging Face Spaces, Jedi Labs"
        ogImage="https://jedilabs.org/og/og-benchmarks.png"
        jsonLd={[datasetJsonLd, howToJsonLd, breadcrumbJsonLd]}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className={`text-xs font-mono uppercase tracking-widest mb-4 ${D ? 'text-color-1' : 'text-color-1'}`}>
              Public benchmarks
            </div>
            <h1 className={`h1 mb-6 tracking-tight ${D ? 'text-n-1' : 'text-n-8'}`}>
              Real metrics.
              <br />
              <span className="text-color-1">Not decks.</span>
            </h1>
            <p className={`body-1 max-w-2xl mx-auto ${D ? 'text-n-3' : 'text-n-6'}`}>
              Every performance number we cite on this site, in one place. All measured on
              held-out validation or test data. All reproducible from the code in the{' '}
              <a
                href="https://github.com/fjkiani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-color-1 hover:underline"
              >
                fjkiani GitHub org
              </a>
              . All live-inferrable on Hugging Face Spaces — cold-start, no cache.
            </p>
          </div>

          {/* Featured benchmarks */}
          <div className="mb-16">
            <h2 className={`text-xs font-mono uppercase tracking-widest mb-6 ${D ? 'text-n-4' : 'text-n-5'}`}>
              Headline metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((b) => (
                <BenchmarkCard key={b.id} benchmark={b} isDark={D} />
              ))}
            </div>
          </div>

          {/* Secondary metrics */}
          {secondary.length > 0 && (
            <div className="mb-16">
              <h2 className={`text-xs font-mono uppercase tracking-widest mb-6 ${D ? 'text-n-4' : 'text-n-5'}`}>
                Paired / supplementary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondary.map((b) => (
                  <BenchmarkCard key={b.id} benchmark={b} isDark={D} />
                ))}
              </div>
            </div>
          )}

          {/* Methodology */}
          <div className="mb-16">
            <h2 className={`h2 mb-6 ${D ? 'text-n-1' : 'text-n-8'}`}>
              How every number here got here
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {METHODOLOGY_STEPS.map((step, i) => (
                <div
                  key={step.name}
                  className={`p-5 rounded-xl border ${
                    D ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'
                  }`}
                >
                  <div className={`text-xs font-mono uppercase tracking-wider mb-2 ${D ? 'text-color-1' : 'text-color-1'}`}>
                    Step {i + 1}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${D ? 'text-n-1' : 'text-n-8'}`}>
                    {step.name}
                  </h3>
                  <p className={`text-sm ${D ? 'text-n-3' : 'text-n-6'}`}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Machine-readable footer */}
          <div
            className={`p-6 rounded-2xl border font-mono text-sm ${
              D ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-6'
            }`}
          >
            <div className={`text-xs uppercase tracking-widest mb-2 ${D ? 'text-color-1' : 'text-color-1'}`}>
              For crawlers, agents, and researchers
            </div>
            <p className="mb-3">
              These benchmarks are also available as machine-readable JSON at{' '}
              <a
                href="/api/oracle.json"
                className={D ? 'text-color-1 hover:underline' : 'text-color-1 hover:underline'}
              >
                /api/oracle.json
              </a>
              . Free to cite — Creative Commons BY 4.0. If you cite one of these numbers, cite this page as the source.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs">
              <Link to="/jedi" className={D ? 'text-color-1 hover:underline' : 'text-color-1 hover:underline'}>
                See the demos →
              </Link>
              <Link to="/methodology" className={D ? 'text-color-1 hover:underline' : 'text-color-1 hover:underline'}>
                Methodology →
              </Link>
              <a
                href="https://github.com/fjkiani"
                target="_blank"
                rel="noopener noreferrer"
                className={D ? 'text-color-1 hover:underline' : 'text-color-1 hover:underline'}
              >
                Training code on GitHub →
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default BenchmarksPage;
