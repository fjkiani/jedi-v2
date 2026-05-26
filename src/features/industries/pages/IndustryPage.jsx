/**
 * IndustryPage — /industries/:industryId
 *
 * v3 redesign:
 * - Always renders: stats strip (statisticsJson), feature cards (keyFeaturesJson),
 *   capabilities grid, benefits checklist — all 8 industries have this data
 * - industryApplication block rendered when present (Healthcare only)
 * - Use-case cross-links rendered when available
 * - Full white mode support throughout
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from '@/components/Section';
import { useTheme } from '@/context/ThemeContext';
import SEO from '@/components/SEO';
import ApplicationDisplay from '../components/ApplicationDisplay';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiZap,
  FiBarChart2,
  FiLayers,
  FiArrowRight,
} from 'react-icons/fi';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const GET_INDUSTRY = gql`
  query GetIndustry($slug: String!) {
    industries(where: { slug: $slug }, stage: PUBLISHED, first: 1) {
      id name slug description
      fullDescription { raw }
      benefits
      capabilities
      keyFeaturesJson
      statisticsJson
      industryApplication {
        id applicationTitle tagline
        industryChallenge { raw }
        jediApproach { raw }
        keyCapabilities
        expectedResults
        jediComponent { id name slug icon { url } }
        technology { id name slug icon }
      }
    }
  }
`;

const GET_USE_CASES_FOR_INDUSTRY = gql`
  query GetUseCasesForIndustry($industrySlug: String!) {
    useCaseS(where: { industry: { slug: $industrySlug } }, stage: PUBLISHED) {
      id title slug description metrics
    }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ stat, isDarkMode }) => (
  <div className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}>
    <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-color-1' : 'text-primary-1'}`}>
      {stat.value}
    </div>
    <div className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
      {stat.label}
    </div>
    {stat.description && (
      <div className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{stat.description}</div>
    )}
  </div>
);

const FeatureCard = ({ feature, isDarkMode }) => (
  <div className={`p-6 rounded-2xl border h-full ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/40' : 'bg-white border-n-3 hover:border-primary-1/40 shadow-sm'} transition-colors`}>
    {feature.icon && (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}>
        {feature.icon}
      </div>
    )}
    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{feature.title}</h4>
    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{feature.description}</p>
    {feature.benefit && (
      <div className={`mt-3 text-xs font-mono px-2 py-1 rounded-full inline-block ${isDarkMode ? 'bg-color-1/20 text-color-1' : 'bg-primary-1/10 text-primary-1'}`}>
        {feature.benefit}
      </div>
    )}
  </div>
);

const UseCaseCard = ({ uc, isDarkMode }) => (
  <Link
    to={`/use-cases/${uc.slug}`}
    className={`block p-5 rounded-xl border transition-all duration-200 group
      ${isDarkMode
        ? 'bg-n-7 border-n-6 hover:border-primary-1/50 hover:bg-n-6/50'
        : 'bg-white border-n-3 hover:border-primary-1/50 shadow-sm hover:shadow-md'}`}
  >
    <h4 className={`font-semibold mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
      {uc.title}
    </h4>
    {uc.description && (
      <p className={`text-sm line-clamp-2 mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{uc.description}</p>
    )}
    <span className={`text-xs font-mono flex items-center gap-1 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>
      Explore <FiArrowRight size={12} />
    </span>
  </Link>
);

// ─── Main component ───────────────────────────────────────────────────────────

const IndustryPage = () => {
  const { industryId } = useParams();
  const { isDarkMode } = useTheme();
  const [industryData, setIndustryData] = useState(null);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!industryId) {
      setLoading(false);
      setError('Industry not found.');
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      hygraphClient.request(GET_INDUSTRY, { slug: industryId }),
      hygraphClient.request(GET_USE_CASES_FOR_INDUSTRY, { industrySlug: industryId })
        .catch(() => ({ useCaseS: [] })),
    ])
      .then(([industryResult, ucResult]) => {
        if (!industryResult?.industries?.length) {
          throw new Error(`Industry "${industryId}" not found.`);
        }
        setIndustryData(industryResult.industries[0]);
        setUseCases(ucResult?.useCaseS || []);
      })
      .catch((err) => setError(err.message || 'Failed to load industry.'))
      .finally(() => setLoading(false));
  }, [industryId]);

  if (loading) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container text-center py-24">
          <div className={`text-sm font-mono ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading…</div>
        </div>
      </Section>
    );
  }

  if (error || !industryData) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <Link to="/industries" className={`inline-flex items-center gap-2 mb-8 text-sm ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'}`}>
            <FiArrowLeft size={16} /> Back to Industries
          </Link>
          <div className={`text-center py-16 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6 text-n-3' : 'bg-n-1 border-n-3 text-n-5'}`}>
            {error || 'Industry not found.'}
          </div>
        </div>
      </Section>
    );
  }

  const {
    name, description, benefits = [], capabilities = [],
    keyFeaturesJson, statisticsJson, industryApplication = [],
  } = industryData;

  // Parse JSON fields safely
  let stats = [];
  let features = [];
  try { stats = Array.isArray(statisticsJson) ? statisticsJson : JSON.parse(statisticsJson || '[]'); } catch {}
  try { features = Array.isArray(keyFeaturesJson) ? keyFeaturesJson : JSON.parse(keyFeaturesJson || '[]'); } catch {}

  const hasApp = industryApplication && industryApplication.length > 0;

  return (
    <>
      <SEO
        title={`${name} AI Solutions | JEDI Labs`}
        description={description || `JEDI Labs autonomous AI solutions for the ${name} industry.`}
        path={`/industries/${industryId}`}
      />

      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container">

          {/* ── Breadcrumb ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link
              to="/industries"
              className={`inline-flex items-center gap-2 text-sm transition-colors ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'}`}
            >
              <FiArrowLeft size={16} /> Back to Industries
            </Link>
          </motion.div>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-14 text-center max-w-3xl mx-auto"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-4 ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'}`}>
              Industry Solutions
            </div>
            <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{name}</h1>
            {description && (
              <p className={`body-1 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{description}</p>
            )}
          </motion.div>

          {/* ── Stats strip ────────────────────────────────────────────── */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-14"
            >
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
                {stats.slice(0, 4).map((stat, i) => (
                  <StatCard key={i} stat={stat} isDarkMode={isDarkMode} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Key Features grid ──────────────────────────────────────── */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-14"
            >
              <h2 className={`h4 mb-6 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                <FiZap size={20} className="text-color-1" /> Key Capabilities
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((feat, i) => (
                  <FeatureCard key={i} feature={feat} isDarkMode={isDarkMode} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Two-column: Capabilities + Benefits ────────────────────── */}
          {(capabilities.length > 0 || benefits.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 mb-14"
            >
              {capabilities.length > 0 && (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}>
                  <h3 className={`h5 mb-5 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiLayers size={18} className="text-color-1" /> Core Capabilities
                  </h3>
                  <ul className="space-y-3">
                    {capabilities.map((cap, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                        <FiCheckCircle className="text-color-1 shrink-0 mt-0.5" size={14} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benefits.length > 0 && (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}>
                  <h3 className={`h5 mb-5 flex items-center gap-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    <FiBarChart2 size={18} className="text-color-1" /> Business Benefits
                  </h3>
                  <ul className="space-y-3">
                    {benefits.map((b, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                        <FiCheckCircle className="text-color-1 shrink-0 mt-0.5" size={14} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Industry Application block (Healthcare only) ────────────── */}
          {hasApp && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-14 space-y-12"
            >
              <h2 className={`h4 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                JEDI Labs in {name}
              </h2>
              {industryApplication.map((app) => (
                <ApplicationDisplay
                  key={app.id}
                  application={app}
                  industryContextData={{
                    fullDescription: industryData.fullDescription,
                    benefits,
                    capabilities,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* ── Related Use Cases ──────────────────────────────────────── */}
          {useCases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-14"
            >
              <h2 className={`h4 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Related Use Cases
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {useCases.map((uc) => (
                  <UseCaseCard key={uc.id} uc={uc} isDarkMode={isDarkMode} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── CTA ────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`mt-8 p-8 rounded-2xl text-center border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3 shadow-sm'}`}
          >
            <h3 className={`h4 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Ready to transform your {name} operations?
            </h3>
            <p className={`body-2 mb-6 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              JEDI Labs builds production-grade autonomous AI systems. Let's discuss your specific challenges.
            </p>
            <Link to="/contact" className="button button-primary">
              Request a Consultation
            </Link>
          </motion.div>

        </div>
      </Section>
    </>
  );
};

export default IndustryPage;
