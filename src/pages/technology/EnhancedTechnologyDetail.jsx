import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiCode, FiLayers, FiZap, FiGrid } from 'react-icons/fi';
import { RootSEO } from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { hygraphClient } from '@/lib/hygraph';
import { GET_TECHNOLOGY_BY_SLUG, GET_TECHNOLOGY_BY_CATEGORY } from '@/graphql/queries/technologies';
import ReactMarkdown from 'react-markdown';
import TechDemoPanel from '@/components/technology/TechDemoPanel';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',             icon: FiGrid },
  { id: 'technical', label: 'Technical Details',    icon: FiCode },
  { id: 'usecases',  label: 'Use Cases',            icon: FiZap },
  { id: 'related',   label: 'Related Technologies', icon: FiLayers },
];

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const ICON_SLUG_OVERRIDES = {
  'kafka':           'apachekafka',
  'rasa':            'rasa',
  'fin-bert':        null,
  'ontologies':      null,
  'd3js':            'd3dotjs',
  'nosql-databases': 'mongodb',
};

const resolveIconUrl = (icon, slug) => {
  if (!icon && !slug) return null;
  if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('/'))) return icon;
  const rawSlug = slug || '';
  if (rawSlug in ICON_SLUG_OVERRIDES) {
    const override = ICON_SLUG_OVERRIDES[rawSlug];
    return override ? `https://cdn.simpleicons.org/${override}` : null;
  }
  if (rawSlug) return `https://cdn.simpleicons.org/${rawSlug}`;
  return null;
};

const TechIcon = ({ icon, name, slug, size = 'md', isDark = true }) => {
  const sz = size === 'lg' ? 'w-16 h-16 text-3xl' : size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg';
  const resolvedUrl = resolveIconUrl(icon, slug);
  if (resolvedUrl) {
    return <img src={resolvedUrl} alt={name} className={`${sz} object-contain rounded`} />;
  }
  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-primary-1/10 text-primary-1'}`}>
      {name?.[0] || '?'}
    </div>
  );
};

// ─── Parse Hygraph fields that may be comma-separated strings OR arrays ───────
const parseStringOrArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) { /* not JSON */ }
  return val.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean);
};

// ─── Sub-cards ────────────────────────────────────────────────────────────────
const UseCaseCard = ({ uc, isDark }) => (
  <Link
    to={`/use-cases/${uc.slug}`}
    className={`group block rounded-xl p-5 border transition-all ${
      isDark
        ? 'bg-white/5 border-white/10 hover:border-yellow-400/40 hover:bg-white/8'
        : 'bg-white border-gray-200 hover:border-yellow-400/60 hover:shadow-md shadow-sm'
    }`}
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <h4 className={`text-sm font-semibold leading-snug group-hover:text-yellow-500 transition-colors ${isDark ? 'text-white' : 'text-n-8'}`}>
        {uc.title}
      </h4>
      <FiArrowRight className={`shrink-0 mt-0.5 transition-colors group-hover:text-yellow-500 ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
    </div>
    {uc.resultsHeadline && (
      <p className="text-xs text-green-500 font-medium mb-2">{uc.resultsHeadline}</p>
    )}
    {uc.description && (
      <p className={`text-xs line-clamp-2 ${isDark ? 'text-white/50' : 'text-n-5'}`}>{uc.description}</p>
    )}
    {uc.category && (
      <span className={`mt-3 inline-block text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-n-5'}`}>
        {uc.category.name}
      </span>
    )}
  </Link>
);

const RelatedTechCard = ({ tech: relTech, isDark }) => (
  <Link
    to={`/technology/${relTech.slug}`}
    className={`group flex items-center gap-3 rounded-xl p-4 border transition-all ${
      isDark
        ? 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/8'
        : 'bg-white border-gray-200 hover:border-primary-1/40 hover:shadow-md shadow-sm'
    }`}
  >
    <TechIcon icon={relTech.icon} name={relTech.name} slug={relTech.slug} size="sm" isDark={isDark} />
    <div className="flex-1 min-w-0">
      <div className={`text-sm font-medium truncate group-hover:text-yellow-500 transition-colors ${isDark ? 'text-white' : 'text-n-8'}`}>
        {relTech.name}
      </div>
      {relTech.description && (
        <div className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-n-5'}`}>{relTech.description}</div>
      )}
    </div>
    <FiArrowRight className={`shrink-0 transition-colors group-hover:text-yellow-500 ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
  </Link>
);

// ─── Tab panels ───────────────────────────────────────────────────────────────
const OverviewPanel = ({ tech, isDark }) => {
  const features = parseStringOrArray(tech.features);
  const metricSentences = parseStringOrArray(tech.businessMetrics);

  return (
    <div className="space-y-8">
      {tech.description && (
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/50' : 'text-n-5'}`}>About</h3>
          <p className={`leading-relaxed text-base ${isDark ? 'text-white/80' : 'text-n-6'}`}>{tech.description}</p>
        </div>
      )}

      {metricSentences.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/50' : 'text-n-5'}`}>Business Impact</h3>
          <ul className="space-y-2">
            {metricSentences.map((sentence, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${isDark ? 'text-white/75' : 'text-n-6'}`}>
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {sentence}
              </li>
            ))}
          </ul>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/50' : 'text-n-5'}`}>Key Capabilities</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {features.map((f, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/70' : 'text-n-6'}`}>
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {features.length === 0 && !tech.description && !tech.businessMetrics && (
        <p className={`italic ${isDark ? 'text-white/40' : 'text-n-4'}`}>No overview content yet.</p>
      )}
    </div>
  );
};

const TechnicalPanel = ({ tech, isDark }) => {
  if (!tech.additonalDetails) {
    return (
      <div className="text-center py-16">
        <FiCode className={`mx-auto text-4xl mb-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
        <p className={isDark ? 'text-white/40' : 'text-n-4'}>No technical documentation available yet.</p>
        <Link to="/contact" className="mt-4 inline-block text-sm text-yellow-500 hover:underline">
          Request technical deep-dive →
        </Link>
      </div>
    );
  }

  return (
    <div className={`prose prose-sm max-w-none
      ${isDark
        ? 'prose-invert prose-headings:text-white prose-p:text-white/75 prose-li:text-white/75 prose-code:text-yellow-300 prose-code:bg-white/10 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-a:text-yellow-400 prose-strong:text-white'
        : 'prose-headings:text-n-8 prose-p:text-n-6 prose-li:text-n-6 prose-code:text-primary-1 prose-code:bg-primary-1/10 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-a:text-primary-1 prose-strong:text-n-8'
      }
      prose-headings:font-semibold prose-code:px-1 prose-code:rounded prose-a:no-underline hover:prose-a:underline`}
    >
      <ReactMarkdown>{tech.additonalDetails}</ReactMarkdown>
    </div>
  );
};

const UseCasesPanel = ({ useCases, isDark }) => {
  const list = Array.isArray(useCases) ? useCases : [];
  if (list.length === 0) {
    return (
      <div className="text-center py-16">
        <FiZap className={`mx-auto text-4xl mb-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
        <p className={`mb-2 ${isDark ? 'text-white/40' : 'text-n-4'}`}>No live deployments documented yet.</p>
        <Link to="/contact" className="inline-block text-sm text-yellow-500 hover:underline">
          Build a use case with this technology →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-n-4'}`}>{list.length} deployment{list.length !== 1 ? 's' : ''} using this technology</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((uc) => <UseCaseCard key={uc.id} uc={uc} isDark={isDark} />)}
      </div>
      <div className="pt-4">
        <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm text-yellow-500 hover:underline">
          Browse all use cases <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

const RelatedPanel = ({ related, currentSlug, isDark }) => {
  const filtered = Array.isArray(related) ? related.filter((r) => r.slug !== currentSlug) : [];

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <FiLayers className={`mx-auto text-4xl mb-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
        <p className={isDark ? 'text-white/40' : 'text-n-4'}>No related technologies found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-n-4'}`}>{filtered.length} other technologies in this category</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((relTech) => <RelatedTechCard key={relTech.id} tech={relTech} isDark={isDark} />)}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const EnhancedTechnologyDetail = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  const [tech, setTech] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setActiveTab('overview');

    hygraphClient
      .request(GET_TECHNOLOGY_BY_SLUG, { slug })
      .then(async (data) => {
        const fetchedTech = data?.technology;
        if (!fetchedTech) {
          setError('Technology not found');
          setLoading(false);
          return;
        }
        setTech(fetchedTech);

        const catArr = Array.isArray(fetchedTech.category) ? fetchedTech.category : [];
        const primaryCatSlug = catArr[0]?.slug;
        if (primaryCatSlug) {
          try {
            const rel = await hygraphClient.request(GET_TECHNOLOGY_BY_CATEGORY, { slug: primaryCatSlug });
            setRelated(Array.isArray(rel?.technologyS) ? rel.technologyS : []);
          } catch (_) { /* non-fatal */ }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load technology');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-n-8' : 'bg-gray-50'}`}>
        <div className={`animate-pulse ${isDarkMode ? 'text-white/40' : 'text-n-4'}`}>Loading technology…</div>
      </div>
    );
  }

  if (error || !tech) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDarkMode ? 'bg-n-8' : 'bg-gray-50'}`}>
        <p className={isDarkMode ? 'text-white/60' : 'text-n-5'}>{error || 'Technology not found'}</p>
        <Link to="/technology" className="text-yellow-500 hover:underline text-sm">← Back to technologies</Link>
      </div>
    );
  }

  const useCases = Array.isArray(tech.useCases) ? tech.useCases : [];
  const categories = Array.isArray(tech.category) ? tech.category : tech.category ? [tech.category] : [];
  const primaryCategory = categories[0] || null;

  const tabsWithCounts = TABS.map((tab) => ({
    ...tab,
    count: tab.id === 'usecases' ? useCases.length
         : tab.id === 'related'  ? related.filter((r) => r.slug !== slug).length
         : null,
  }));

  // Shared theme shorthands
  const D = isDarkMode;

  return (
    <>
      <RootSEO
        title={`${tech.name} | JEDI Labs Technology`}
        description={tech.description || `${tech.name} — part of the JEDI Labs AI stack`}
      />

      <div className={`min-h-screen ${D ? 'bg-n-8 text-white' : 'bg-gray-50 text-n-8'}`}>

        {/* ── HERO ── */}
        <div className={`border-b ${D ? 'border-white/10 bg-gradient-to-b from-white/5 to-transparent' : 'border-gray-200 bg-white'}`}>
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
              to={primaryCategory ? `/solutions/${primaryCategory.slug}` : '/technology'}
              className={`inline-flex items-center gap-2 text-sm transition-colors mb-8 ${D ? 'text-white/40 hover:text-white/70' : 'text-n-4 hover:text-n-7'}`}
            >
              <FiArrowLeft /> {primaryCategory ? `${primaryCategory.name} Solution` : 'All Technologies'}
            </Link>

            <div className="flex items-start gap-6">
              <TechIcon icon={tech.icon} name={tech.name} slug={tech.slug} size="lg" isDark={D} />
              <div className="flex-1 min-w-0">
                <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${D ? 'text-white' : 'text-n-8'}`}>{tech.name}</h1>
                {tech.description && (
                  <p className={`text-base leading-relaxed max-w-2xl mb-4 ${D ? 'text-white/60' : 'text-n-5'}`}>{tech.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/solutions/${cat.slug}`}
                      className="inline-flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 px-3 py-1 rounded-full hover:bg-yellow-400/20 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {Array.isArray(tech.subcategories) && tech.subcategories.map((sub) => (
                    <span key={sub.slug} className={`text-xs px-3 py-1 rounded-full ${D ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-n-5'}`}>
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-2 shrink-0">
                {primaryCategory && (
                  <Link
                    to={`/solutions/${primaryCategory.slug}`}
                    className="inline-flex items-center gap-2 text-sm bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    View Solution <FiArrowRight />
                  </Link>
                )}
                <Link
                  to="/contact"
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors ${D ? 'border-white/20 text-white/70 hover:border-white/40 hover:text-white' : 'border-gray-300 text-n-5 hover:border-gray-400 hover:text-n-7'}`}
                >
                  Deploy This <FiExternalLink />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex gap-8">

            {/* Left rail — sticky tab nav (desktop) */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-24 space-y-1">
                {tabsWithCounts.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                        active
                          ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/20'
                          : D
                            ? 'text-white/50 hover:text-white hover:bg-white/5'
                            : 'text-n-5 hover:text-n-8 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="shrink-0" />
                      <span className="flex-1">{tab.label}</span>
                      {tab.count !== null && tab.count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          active
                            ? 'bg-yellow-400/20 text-yellow-500'
                            : D ? 'bg-white/10 text-white/40' : 'bg-gray-200 text-n-5'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className={`pt-4 border-t mt-4 ${D ? 'border-white/10' : 'border-gray-200'}`}>
                  <Link
                    to="/contact"
                    className="block text-center text-xs bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    Deploy This Stack
                  </Link>
                </div>
              </div>
            </aside>

            {/* Mobile tab bar */}
            <div className="lg:hidden w-full mb-6">
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {tabsWithCounts.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/20'
                          : D
                            ? 'text-white/50 hover:text-white bg-white/5'
                            : 'text-n-5 hover:text-n-8 bg-gray-100'
                      }`}
                    >
                      <Icon />
                      {tab.label}
                      {tab.count !== null && tab.count > 0 && (
                        <span className={`text-xs px-1.5 rounded-full ${D ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeTab === 'overview'  && <OverviewPanel  tech={tech}                              isDark={D} />}
                  {activeTab === 'technical' && <TechDemoPanel  tech={tech}                              isDark={D} />}
                  {activeTab === 'usecases'  && <UseCasesPanel  useCases={useCases}                      isDark={D} />}
                  {activeTab === 'related'   && <RelatedPanel   related={related} currentSlug={slug}     isDark={D} />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        {primaryCategory && (
          <div className={`border-t ${D ? 'border-white/10 bg-white/3' : 'border-gray-200 bg-white'}`}>
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className={`text-sm mb-1 ${D ? 'text-white/50' : 'text-n-4'}`}>Part of the JEDI Labs stack</p>
                <h3 className={`text-lg font-semibold ${D ? 'text-white' : 'text-n-8'}`}>
                  {tech.name} powers our{' '}
                  <Link to={`/solutions/${primaryCategory.slug}`} className="text-yellow-500 hover:underline">
                    {primaryCategory.name} Solution
                  </Link>
                </h3>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/solutions/${primaryCategory.slug}`}
                  className="inline-flex items-center gap-2 text-sm bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  View Full Solution <FiArrowRight />
                </Link>
                <Link
                  to="/explore"
                  className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg border transition-colors ${D ? 'border-white/20 text-white/70 hover:border-white/40 hover:text-white' : 'border-gray-300 text-n-5 hover:border-gray-400 hover:text-n-7'}`}
                >
                  Explore Stack <FiGrid />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedTechnologyDetail;
