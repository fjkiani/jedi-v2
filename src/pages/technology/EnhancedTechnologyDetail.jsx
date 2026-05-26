import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiCode, FiLayers, FiZap, FiGrid } from 'react-icons/fi';
import Section from '@/components/Section';
import { RootSEO } from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { hygraphClient } from '@/lib/hygraph';
import { GET_TECHNOLOGY_BY_SLUG, GET_TECHNOLOGY_BY_CATEGORY } from '@/graphql/queries/technologies';
import ReactMarkdown from 'react-markdown';

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',             icon: FiGrid },
  { id: 'technical', label: 'Technical Details',    icon: FiCode },
  { id: 'usecases',  label: 'Use Cases',            icon: FiZap },
  { id: 'related',   label: 'Related Technologies', icon: FiLayers },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TechIcon = ({ icon, name, size = 'md' }) => {
  const sz = size === 'lg' ? 'w-16 h-16 text-3xl' : size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg';
  if (icon?.startsWith('http') || icon?.startsWith('/')) {
    return <img src={icon} alt={name} className={`${sz} object-contain rounded`} />;
  }
  return (
    <div className={`${sz} rounded-xl bg-white/10 flex items-center justify-center font-bold text-white`}>
      {icon || name?.[0] || '?'}
    </div>
  );
};

const UseCaseCard = ({ uc }) => (
  <Link
    to={`/use-cases/${uc.slug}`}
    className="group block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-yellow-400/40 hover:bg-white/8 transition-all"
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors leading-snug">
        {uc.title}
      </h4>
      <FiArrowRight className="shrink-0 mt-0.5 text-white/30 group-hover:text-yellow-400 transition-colors" />
    </div>
    {uc.resultsHeadline && (
      <p className="text-xs text-green-400 font-medium mb-2">{uc.resultsHeadline}</p>
    )}
    {uc.description && (
      <p className="text-xs text-white/50 line-clamp-2">{uc.description}</p>
    )}
    {uc.category && (
      <span className="mt-3 inline-block text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
        {uc.category.name}
      </span>
    )}
  </Link>
);

const RelatedTechCard = ({ tech: relTech }) => (
  <Link
    to={`/technology/${relTech.slug}`}
    className="group flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-white/8 transition-all"
  >
    <TechIcon icon={relTech.icon} name={relTech.name} size="sm" />
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors truncate">
        {relTech.name}
      </div>
      {relTech.description && (
        <div className="text-xs text-white/50 truncate">{relTech.description}</div>
      )}
    </div>
    <FiArrowRight className="shrink-0 text-white/30 group-hover:text-yellow-400 transition-colors" />
  </Link>
);

// ─── Parse Hygraph fields that may be comma-separated strings OR arrays ───────
// NOTE: regex uses \n as a string escape, NOT a literal newline, to avoid esbuild parse errors
const parseStringOrArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) { /* not JSON */ }
  // Split on comma+optional-space OR newline
  return val.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean);
};

// ─── Tab panels ───────────────────────────────────────────────────────────────
const OverviewPanel = ({ tech }) => {
  const features = parseStringOrArray(tech.features);
  const metricSentences = parseStringOrArray(tech.businessMetrics);

  return (
    <div className="space-y-8">
      {/* Description */}
      {tech.description && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">About</h3>
          <p className="text-white/80 leading-relaxed text-base">{tech.description}</p>
        </div>
      )}

      {/* Business metrics as bullet list */}
      {metricSentences.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Business Impact</h3>
          <ul className="space-y-2">
            {metricSentences.map((sentence, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/75">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {sentence}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Key Capabilities</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {features.length === 0 && !tech.description && !tech.businessMetrics && (
        <p className="text-white/40 italic">No overview content yet.</p>
      )}
    </div>
  );
};

const TechnicalPanel = ({ tech }) => {
  if (!tech.additonalDetails) {
    return (
      <div className="text-center py-16">
        <FiCode className="mx-auto text-4xl text-white/20 mb-4" />
        <p className="text-white/40">No technical documentation available yet.</p>
        <Link to="/contact" className="mt-4 inline-block text-sm text-yellow-400 hover:underline">
          Request technical deep-dive →
        </Link>
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-white prose-headings:font-semibold
      prose-p:text-white/75 prose-p:leading-relaxed
      prose-li:text-white/75
      prose-code:text-yellow-300 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
      prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
      prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-white">
      <ReactMarkdown>{tech.additonalDetails}</ReactMarkdown>
    </div>
  );
};

const UseCasesPanel = ({ useCases }) => {
  const list = Array.isArray(useCases) ? useCases : [];
  if (list.length === 0) {
    return (
      <div className="text-center py-16">
        <FiZap className="mx-auto text-4xl text-white/20 mb-4" />
        <p className="text-white/40 mb-2">No live deployments documented yet.</p>
        <Link to="/contact" className="inline-block text-sm text-yellow-400 hover:underline">
          Build a use case with this technology →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">{list.length} deployment{list.length !== 1 ? 's' : ''} using this technology</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((uc) => <UseCaseCard key={uc.id} uc={uc} />)}
      </div>
      <div className="pt-4">
        <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm text-yellow-400 hover:underline">
          Browse all use cases <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

const RelatedPanel = ({ related, currentSlug }) => {
  const filtered = Array.isArray(related) ? related.filter((r) => r.slug !== currentSlug) : [];

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <FiLayers className="mx-auto text-4xl text-white/20 mb-4" />
        <p className="text-white/40">No related technologies found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">{filtered.length} other technologies in this category</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((relTech) => <RelatedTechCard key={relTech.id} tech={relTech} />)}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const EnhancedTechnologyDetail = () => {
  const { slug } = useParams();
  const { theme } = useTheme();
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

        // category is an ARRAY — use [0].slug for the related fetch
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/40 animate-pulse">Loading technology…</div>
      </div>
    );
  }

  if (error || !tech) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">{error || 'Technology not found'}</p>
        <Link to="/technology" className="text-yellow-400 hover:underline text-sm">← Back to technologies</Link>
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

  return (
    <>
      <RootSEO
        title={`${tech.name} | JEDI Labs Technology`}
        description={tech.description || `${tech.name} — part of the JEDI Labs AI stack`}
      />

      <div className="min-h-screen bg-n-8 text-white">
        {/* ── HERO ── */}
        <div className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Link
              to={primaryCategory ? `/solutions/${primaryCategory.slug}` : '/technology'}
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <FiArrowLeft /> {primaryCategory ? `${primaryCategory.name} Solution` : 'All Technologies'}
            </Link>

            <div className="flex items-start gap-6">
              <TechIcon icon={tech.icon} name={tech.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tech.name}</h1>
                {tech.description && (
                  <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-4">{tech.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/solutions/${cat.slug}`}
                      className="inline-flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full hover:bg-yellow-400/20 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {Array.isArray(tech.subcategories) && tech.subcategories.map((sub) => (
                    <span key={sub.slug} className="text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full">
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
                  className="inline-flex items-center gap-2 text-sm border border-white/20 text-white/70 px-4 py-2 rounded-lg hover:border-white/40 hover:text-white transition-colors"
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
                          ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="shrink-0" />
                      <span className="flex-1">{tab.label}</span>
                      {tab.count !== null && tab.count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/10 text-white/40'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-white/10 mt-4">
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
                          ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                          : 'text-white/50 hover:text-white bg-white/5'
                      }`}
                    >
                      <Icon />
                      {tab.label}
                      {tab.count !== null && tab.count > 0 && (
                        <span className="text-xs bg-white/20 px-1.5 rounded-full">{tab.count}</span>
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
                  {activeTab === 'overview'  && <OverviewPanel tech={tech} />}
                  {activeTab === 'technical' && <TechnicalPanel tech={tech} />}
                  {activeTab === 'usecases'  && <UseCasesPanel useCases={useCases} />}
                  {activeTab === 'related'   && <RelatedPanel related={related} currentSlug={slug} />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        {primaryCategory && (
          <div className="border-t border-white/10 bg-white/3">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/50 mb-1">Part of the JEDI Labs stack</p>
                <h3 className="text-lg font-semibold text-white">
                  {tech.name} powers our{' '}
                  <Link to={`/solutions/${primaryCategory.slug}`} className="text-yellow-400 hover:underline">
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
                  className="inline-flex items-center gap-2 text-sm border border-white/20 text-white/70 px-5 py-2.5 rounded-lg hover:border-white/40 hover:text-white transition-colors"
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
