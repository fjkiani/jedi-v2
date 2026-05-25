import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hygraphClient } from '@/lib/hygraph';
import { GET_USE_CASE_BY_SLUG } from '@/graphql/queries/useCases';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { fadeIn } from '@/utils/motion';
import {
  FiArrowLeft,
  FiCpu,
  FiCheckCircle,
  FiBarChart2,
  FiLayers,
  FiZap,
  FiExternalLink,
  FiFileText,
  FiPlay,
} from 'react-icons/fi';
import parse from 'html-react-parser';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RichSection = ({ title, html, icon: Icon, isDarkMode }) => {
  if (!html || html === '<p></p>') return null;
  return (
    <div className="mb-8">
      <h3 className={`flex items-center gap-2 h5 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {Icon && <Icon size={18} className="text-color-1 shrink-0" />}
        {title}
      </h3>
      <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-5'}`}>
        {parse(html)}
      </div>
    </div>
  );
};

const MetricPill = ({ text, isDarkMode }) => (
  <div className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${isDarkMode ? 'bg-n-7 border border-n-6 text-n-2' : 'bg-n-1 border border-n-3 text-n-7'}`}>
    <FiCheckCircle className="text-color-1 shrink-0 mt-0.5" size={15} />
    <span>{text}</span>
  </div>
);

const TechPill = ({ tech, isDarkMode }) => (
  <Link
    to={`/technology/${tech.slug}`}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors
      ${isDarkMode
        ? 'bg-n-6 text-n-3 hover:bg-n-5 hover:text-n-1'
        : 'bg-n-2 text-n-6 hover:bg-n-3 hover:text-n-8'}`}
    title={tech.name}
  >
    {tech.icon && (
      <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />
    )}
    <span>{tech.name}</span>
  </Link>
);

// ─── Main component ───────────────────────────────────────────────────────────

const UseCaseDetailPage = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    hygraphClient
      .request(GET_USE_CASE_BY_SLUG, { slug })
      .then((data) => {
        setUseCase(data?.useCase || null);
      })
      .catch((err) => {
        console.error('Error fetching use case:', err);
        setError('Failed to load this use case.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <div className={`text-center py-24 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Loading use case…
          </div>
        </div>
      </Section>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !useCase) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <Link to="/use-cases" className={`inline-flex items-center gap-2 mb-8 text-sm ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'}`}>
            <FiArrowLeft size={16} /> Back to Use Cases
          </Link>
          <div className={`text-center py-16 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-5'}`}>
            {error || 'Use case not found.'}
          </div>
        </div>
      </Section>
    );
  }

  const {
    title, description, industry, category, technologies = [],
    queries = [], capabilities = [], metrics = [],
    clientChallenge, jediApproach, outcomes,
    resultsHeadline, resultsNarrative,
    architectureNarrative, technologyNarrative, capabilityNarrative,
    architecture, implementation,
    caseStudy, demoVideoUrl, applicationUrl, pdfDeck,
    heroImage, thumbnail,
  } = useCase;

  const heroUrl = heroImage?.url || thumbnail?.url;

  return (
    <>
      <SEO
        title={`${title} | JEDI Labs`}
        description={description?.slice(0, 160) || `${title} — JEDI Labs use case`}
        path={`/use-cases/${slug}`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container">

          {/* ── Breadcrumb ─────────────────────────────────────────────── */}
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="mb-8">
            <Link
              to="/use-cases"
              className={`inline-flex items-center gap-2 text-sm ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'} transition-colors`}
            >
              <FiArrowLeft size={16} /> Back to Use Cases
            </Link>
          </motion.div>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <motion.div variants={fadeIn('up')} initial="hidden" animate="show" className="mb-12">
            {heroUrl && (
              <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
                <img src={heroUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {industry && (
                <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'}`}>
                  {industry.name}
                </span>
              )}
              {category && (
                <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${isDarkMode ? 'bg-color-1/20 text-color-1' : 'bg-primary-1/10 text-primary-1'}`}>
                  {category.name}
                </span>
              )}
            </div>

            <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h1>

            {description && (
              <p className={`body-1 max-w-3xl ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{description}</p>
            )}

            {/* Action links */}
            <div className="flex flex-wrap gap-3 mt-6">
              {applicationUrl && (
                <a href={applicationUrl} target="_blank" rel="noopener noreferrer"
                  className="button button-primary inline-flex items-center gap-2">
                  <FiExternalLink size={16} /> Live Demo
                </a>
              )}
              {demoVideoUrl && (
                <a href={demoVideoUrl} target="_blank" rel="noopener noreferrer"
                  className={`button inline-flex items-center gap-2 ${isDarkMode ? 'button-secondary' : 'button-secondary'}`}>
                  <FiPlay size={16} /> Watch Demo
                </a>
              )}
              {pdfDeck?.url && (
                <a href={pdfDeck.url} target="_blank" rel="noopener noreferrer"
                  className={`button inline-flex items-center gap-2 ${isDarkMode ? 'button-secondary' : 'button-secondary'}`}>
                  <FiFileText size={16} /> PDF Deck
                </a>
              )}
            </div>
          </motion.div>

          {/* ── Two-column layout ──────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: narrative content */}
            <div className="lg:col-span-2 space-y-2">

              <RichSection title="The Challenge" html={clientChallenge?.html} icon={FiLayers} isDarkMode={isDarkMode} />
              <RichSection title="The JEDI Approach" html={jediApproach?.html} icon={FiZap} isDarkMode={isDarkMode} />
              <RichSection title="Outcomes" html={outcomes?.html} icon={FiCheckCircle} isDarkMode={isDarkMode} />
              <RichSection title="Architecture" html={architectureNarrative?.html} icon={FiLayers} isDarkMode={isDarkMode} />
              <RichSection title="Technology Stack" html={technologyNarrative?.html} icon={FiCpu} isDarkMode={isDarkMode} />
              <RichSection title="Capabilities" html={capabilityNarrative?.html} icon={FiZap} isDarkMode={isDarkMode} />

              {/* Results headline */}
              {resultsHeadline && (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-color-1/30' : 'bg-primary-1/5 border-primary-1/20'} mb-8`}>
                  <h3 className={`h5 mb-2 ${isDarkMode ? 'text-color-1' : 'text-primary-1'}`}>Results</h3>
                  <p className={`body-1 font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{resultsHeadline}</p>
                  {resultsNarrative?.html && (
                    <div className={`mt-3 prose prose-sm max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-5'}`}>
                      {parse(resultsNarrative.html)}
                    </div>
                  )}
                </div>
              )}

              {/* Architecture flow */}
              {architecture?.flow?.length > 0 && (
                <div className="mb-8">
                  <h3 className={`h5 mb-4 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiLayers size={18} className="text-color-1" /> How It Works
                  </h3>
                  <div className="space-y-3">
                    {architecture.flow.map((step, i) => (
                      <div key={step.id || i} className={`flex gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-n-1 border border-n-3'}`}>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-color-1/20 text-color-1' : 'bg-primary-1/10 text-primary-1'}`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{step.step}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{step.description}</p>
                          {step.details && (
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>{step.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample queries */}
              {queries.length > 0 && (
                <div className="mb-8">
                  <h3 className={`h5 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Sample Queries</h3>
                  <div className="space-y-2">
                    {queries.map((q, i) => (
                      <div key={i} className={`px-4 py-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-n-7 border border-n-6 text-n-3' : 'bg-n-1 border border-n-3 text-n-6'}`}>
                        "{q}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <div className="space-y-8">

              {/* Metrics */}
              {metrics.length > 0 && (
                <div>
                  <h3 className={`h6 mb-3 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiBarChart2 size={16} className="text-color-1" /> Key Metrics
                  </h3>
                  <div className="space-y-2">
                    {metrics.map((m, i) => <MetricPill key={i} text={m} isDarkMode={isDarkMode} />)}
                  </div>
                </div>
              )}

              {/* Capabilities */}
              {capabilities.length > 0 && (
                <div>
                  <h3 className={`h6 mb-3 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiZap size={16} className="text-color-1" /> Capabilities
                  </h3>
                  <ul className="space-y-2">
                    {capabilities.map((cap, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                        <FiCheckCircle className="text-color-1 shrink-0 mt-0.5" size={14} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {technologies.length > 0 && (
                <div>
                  <h3 className={`h6 mb-3 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiCpu size={16} className="text-color-1" /> Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <TechPill key={tech.id} tech={tech} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture components */}
              {architecture?.components?.length > 0 && (
                <div>
                  <h3 className={`h6 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>System Components</h3>
                  <div className="space-y-3">
                    {architecture.components.map((comp, i) => (
                      <div key={comp.id || i} className={`p-3 rounded-xl ${isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-n-1 border border-n-3'}`}>
                        <p className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{comp.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>{comp.description}</p>
                        {comp.details && (
                          <p className={`text-xs mt-1 italic ${isDarkMode ? 'text-n-5' : 'text-n-5'}`}>{comp.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related case study */}
              {caseStudy && (
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-color-1/30' : 'bg-primary-1/5 border-primary-1/20'}`}>
                  <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${isDarkMode ? 'text-color-1' : 'text-primary-1'}`}>
                    Related Case Study
                  </p>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{caseStudy.title}</h4>
                  {caseStudy.clientName && (
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{caseStudy.clientName}</p>
                  )}
                  {caseStudy.excerpt && (
                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{caseStudy.excerpt}</p>
                  )}
                  <Link
                    to={`/case-studies/${caseStudy.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-color-1 hover:underline"
                  >
                    Read full case study →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom CTA ─────────────────────────────────────────────── */}
          <div className={`mt-16 p-8 rounded-2xl text-center border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
            <h3 className={`h4 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Ready to deploy this for your organization?</h3>
            <p className={`body-2 mb-6 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              JEDI Labs builds production-grade autonomous systems. Let's talk about your use case.
            </p>
            <Link to="/contact" className="button button-primary">
              Start a Conversation
            </Link>
          </div>

        </div>
      </Section>
    </>
  );
};

export default UseCaseDetailPage;
