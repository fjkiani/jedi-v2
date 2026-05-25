import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiZap, FiCpu, FiLayers, FiExternalLink,
  FiChevronLeft, FiBarChart2, FiBook, FiArrowRight,
} from 'react-icons/fi';
import Section from '@/components/Section';
import { RootSEO } from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { hygraphClient } from '@/lib/hygraph';
import { GET_TECHNOLOGY_BY_SLUG } from '@/graphql/queries/technologies';
import { fadeIn } from '@/utils/motion';
import parse from 'html-react-parser';

// ─── Sub-components ───────────────────────────────────────────────────────────

const FeatureList = ({ text, isDarkMode }) => {
  if (!text) return null;
  // Features stored as newline-separated or comma-separated string
  const items = text
    .split(/\n|•|·/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
          <FiCheckCircle className="text-color-1 shrink-0 mt-0.5" size={14} />
          {item}
        </li>
      ))}
    </ul>
  );
};

const UseCaseCard = ({ useCase, isDarkMode }) => (
  <Link
    to={`/use-cases/${useCase.slug}`}
    className={`block p-5 rounded-xl border transition-all group
      ${isDarkMode
        ? 'bg-n-7 border-n-6 hover:border-color-1/50'
        : 'bg-white border-n-3 hover:border-primary-1/50'}`}
  >
    <div className="flex flex-wrap gap-2 mb-2">
      {useCase.industry && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-6'}`}>
          {useCase.industry.name}
        </span>
      )}
      {useCase.category && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-color-1/20 text-color-1' : 'bg-primary-1/10 text-primary-1'}`}>
          {useCase.category.name}
        </span>
      )}
    </div>
    <h4 className={`font-semibold mb-1 group-hover:text-color-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
      {useCase.title}
    </h4>
    {useCase.resultsHeadline && (
      <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{useCase.resultsHeadline}</p>
    )}
    {!useCase.resultsHeadline && useCase.description && (
      <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{useCase.description}</p>
    )}
  </Link>
);

const CaseStudyCard = ({ study, isDarkMode }) => (
  <Link
    to={`/case-studies/${study.slug}`}
    className={`block p-5 rounded-xl border transition-all group
      ${isDarkMode
        ? 'bg-n-7 border-n-6 hover:border-color-1/50'
        : 'bg-white border-n-3 hover:border-primary-1/50'}`}
  >
    {study.coverImageUrl && (
      <img src={study.coverImageUrl} alt={study.title} className="w-full h-32 object-cover rounded-lg mb-3" />
    )}
    <h4 className={`font-semibold mb-1 group-hover:text-color-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
      {study.title}
    </h4>
    {study.clientName && (
      <p className={`text-xs mb-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{study.clientName}</p>
    )}
    {study.excerpt && (
      <p className={`text-xs line-clamp-3 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{study.excerpt}</p>
    )}
  </Link>
);

// ─── Main component ───────────────────────────────────────────────────────────

const EnhancedTechnologyDetail = () => {
  const { isDarkMode } = useTheme();
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    hygraphClient
      .request(GET_TECHNOLOGY_BY_SLUG, { slug })
      .then((data) => {
        setTechnology(data?.technology || null);
      })
      .catch((err) => {
        console.error('Error fetching technology:', err);
        setError('Failed to load technology details.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <div className={`text-center py-24 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Loading technology…
          </div>
        </div>
      </Section>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (error || !technology) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <Link to="/technology" className={`inline-flex items-center gap-2 mb-8 text-sm ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'}`}>
            <FiChevronLeft size={16} /> Back to Technologies
          </Link>
          <div className={`text-center py-16 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-5'}`}>
            {error || `Technology "${slug}" not found in Hygraph.`}
          </div>
        </div>
      </Section>
    );
  }

  const {
    name, description, icon, features, additonalDetails, businessMetrics,
    category = [], subcategories = [],
    useCases = [], caseStudies = [],
  } = technology;

  const primaryCategory = category[0];
  const relatedUseCases = useCases;

  return (
    <>
      <RootSEO
        title={`${name} | JEDI Labs Technology`}
        description={description?.slice(0, 160) || `${name} — part of the JEDI Labs technology stack`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container">

          {/* ── Breadcrumb ─────────────────────────────────────────────── */}
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="mb-8">
            <nav className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              <Link to="/" className="hover:text-color-1 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/technology" className="hover:text-color-1 transition-colors">Technologies</Link>
              <span>/</span>
              <span className={isDarkMode ? 'text-n-1' : 'text-n-8'}>{name}</span>
            </nav>
          </motion.div>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="mb-12">
            <div className="flex items-start gap-6 mb-6">
              {icon && (
                <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center p-3 ${isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-n-1 border border-n-3'}`}>
                  <img src={icon} alt={name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {category.map((cat) => (
                    <span key={cat.id} className={`text-xs px-3 py-1 rounded-full font-mono uppercase tracking-wider ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'}`}>
                      {cat.name}
                    </span>
                  ))}
                  {subcategories.map((sub) => (
                    <span key={sub.id} className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-color-1/20 text-color-1' : 'bg-primary-1/10 text-primary-1'}`}>
                      {sub.name}
                    </span>
                  ))}
                </div>
                <h1 className={`h1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{name}</h1>
              </div>
            </div>

            {description && (
              <p className={`body-1 max-w-3xl ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{description}</p>
            )}
          </motion.div>

          {/* ── Two-column layout ──────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Features */}
              {features && (
                <div>
                  <h2 className={`h4 mb-4 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiZap size={20} className="text-color-1" /> Key Features
                  </h2>
                  <FeatureList text={features} isDarkMode={isDarkMode} />
                </div>
              )}

              {/* Additional details */}
              {additonalDetails && (
                <div>
                  <h2 className={`h4 mb-4 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiBook size={20} className="text-color-1" /> Technical Details
                  </h2>
                  <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-5'}`}>
                    {additonalDetails}
                  </div>
                </div>
              )}

              {/* Use cases that use this technology */}
              {relatedUseCases.length > 0 && (
                <div>
                  <h2 className={`h4 mb-4 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiLayers size={20} className="text-color-1" /> Used In These Use Cases
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedUseCases.map((uc) => (
                      <UseCaseCard key={uc.id} useCase={uc} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/use-cases"
                      className={`inline-flex items-center gap-1 text-sm text-color-1 hover:underline`}
                    >
                      View all use cases <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Case studies */}
              {caseStudies.length > 0 && (
                <div>
                  <h2 className={`h4 mb-4 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiBarChart2 size={20} className="text-color-1" /> Case Studies
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {caseStudies.map((study) => (
                      <CaseStudyCard key={study.id} study={study} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right: sidebar */}
            <div className="space-y-8">

              {/* Business metrics */}
              {businessMetrics && (
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                  <h3 className={`h6 mb-3 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiBarChart2 size={16} className="text-color-1" /> Business Impact
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{businessMetrics}</p>
                </div>
              )}

              {/* Category info */}
              {primaryCategory && (
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                  <h3 className={`h6 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Category</h3>
                  <Link
                    to={`/solutions/${primaryCategory.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-color-1 hover:underline"
                  >
                    {primaryCategory.name} <FiArrowRight size={14} />
                  </Link>
                  {subcategories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {subcategories.map((sub) => (
                        <span key={sub.id} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-6'}`}>
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state for use cases */}
              {relatedUseCases.length === 0 && (
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
                  <h3 className={`h6 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Use Cases</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                    No use cases linked yet.
                  </p>
                  <Link to="/use-cases" className="inline-flex items-center gap-1 text-sm text-color-1 hover:underline mt-2">
                    Browse all use cases <FiArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* CTA */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-color-1/30' : 'bg-primary-1/5 border-primary-1/20'}`}>
                <h3 className={`h6 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Deploy This Stack</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  JEDI Labs integrates {name} into production-grade autonomous systems.
                </p>
                <Link to="/contact" className="button button-primary w-full text-center text-sm">
                  Start a Conversation
                </Link>
              </div>

            </div>
          </div>

        </div>
      </Section>
    </>
  );
};

export default EnhancedTechnologyDetail;
