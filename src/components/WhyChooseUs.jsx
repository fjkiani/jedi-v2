/**
 * WhyChooseUs — "Our Products" section on homepage.
 *
 * Shows the 3 live JEDI Labs applications as a proper product showcase grid.
 * Each card includes: thumbnail, title, category, description, use-case pills
 * (matched by category slug overlap), and a CTA.
 *
 * Replaces the previous Swiper carousel with a clean 3-column grid.
 */

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FiCpu, FiArrowRight, FiExternalLink, FiLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { hygraphClient } from '@/lib/hygraph';
import { GET_APPLICATIONS } from '@/graphql/queries/applications';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import { motion } from 'framer-motion';

// ─── Use-case pill ────────────────────────────────────────────────────────────
const UseCasePill = ({ uc, isDarkMode }) => (
  <Link
    to={`/use-cases/${uc.slug}`}
    onClick={(e) => e.stopPropagation()}
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all duration-200
      ${isDarkMode
        ? 'bg-primary-1/10 border-primary-1/30 text-primary-1 hover:bg-primary-1/20'
        : 'bg-primary-1/10 border-primary-1/30 text-primary-1 hover:bg-primary-1/20'
      }`}
  >
    <FiLink className="w-2 h-2 flex-shrink-0" />
    {uc.title.length > 28 ? uc.title.slice(0, 28) + '…' : uc.title}
  </Link>
);

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard = ({ app, index, matchedUseCases, isDarkMode }) => {
  const hasExternalUrl = !!app.applicationUrl?.trim();
  const hasCaseStudy = !!app.caseStudy?.slug;
  const href = hasExternalUrl
    ? app.applicationUrl
    : hasCaseStudy
      ? `/case-studies/${app.caseStudy.slug}`
      : '/jedi';
  const isExternal = !!hasExternalUrl;
  const thumbnailUrl = app.featuredImage?.url;

  const cardInner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300
        ${isDarkMode
          ? 'bg-n-8/80 border-n-6 hover:border-primary-1/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]'
          : 'bg-white border-n-3 hover:border-primary-1/40 hover:shadow-xl'
        }`}
    >
      {/* Thumbnail */}
      <div className={`aspect-video overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-n-7' : 'bg-n-2'}`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={app.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiCpu className={`w-12 h-12 ${isDarkMode ? 'text-n-5' : 'text-n-4'}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Category tag */}
        {app.categories?.[0]?.name && (
          <span className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            {app.categories[0].name}
          </span>
        )}

        {/* Title */}
        <h3 className={`text-lg font-bold mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          {app.title}
        </h3>

        {/* Description */}
        {app.description && (
          <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            {app.description}
          </p>
        )}

        {/* Use-case pills */}
        {matchedUseCases.length > 0 && (
          <div className="mb-4">
            <p className={`text-[9px] font-mono uppercase tracking-widest mb-1.5 ${isDarkMode ? 'text-n-5' : 'text-n-5'}`}>
              Use Cases Powered
            </p>
            <div className="flex flex-wrap gap-1">
              {matchedUseCases.map((uc) => (
                <UseCasePill key={uc.id} uc={uc} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={`mt-auto pt-4 border-t flex items-center justify-between
          ${isDarkMode ? 'border-n-6/40' : 'border-n-3/60'}`}>
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary-1 transition-colors
            ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {isExternal ? (
              <><FiExternalLink className="w-3 h-3" /> Visit App</>
            ) : href === '/jedi' ? (
              <><FiArrowRight className="w-3 h-3" /> View Registry</>
            ) : (
              <><FiArrowRight className="w-3 h-3" /> Case Study</>
            )}
          </span>
          <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200
            ${isDarkMode
              ? 'border-n-6 group-hover:border-primary-1 group-hover:bg-primary-1 text-n-3 group-hover:text-white'
              : 'border-n-3 group-hover:border-primary-1 group-hover:bg-primary-1 text-n-6 group-hover:text-white'
            }`}>
            {isExternal ? <FiExternalLink className="w-3 h-3" /> : <FiArrowRight className="w-3 h-3" />}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardInner}
      </a>
    );
  }
  return (
    <Link to={href} className="block h-full">
      {cardInner}
    </Link>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const WhyChooseUs = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [appData, ucData] = await Promise.all([
          hygraphClient.request(GET_APPLICATIONS, { stage: 'PUBLISHED' }),
          hygraphClient.request(GET_USE_CASES),
        ]);
        const list = appData?.projects12 || appData?.projects || [];
        setApplications(list.slice(0, 6));
        setUseCases(ucData?.useCaseS || []);
      } catch (e) {
        console.error('WhyChooseUs: Failed to load', e);
        setApplications([]);
        setUseCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Match use cases to an app by category slug overlap
  const getMatchedUseCases = (app) => {
    if (!Array.isArray(app.categories) || app.categories.length === 0) return [];
    const appSlugs = new Set(app.categories.map((c) => c.slug));
    return useCases
      .filter((uc) => uc.category?.slug && appSlugs.has(uc.category.slug))
      .slice(0, 2);
  };

  return (
    <section className={`py-16 lg:py-20 relative ${className}`} id="our-products">
      <div className="container relative z-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-n-4' : 'bg-n-5'}`} />
              Production Systems
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Our Products
            </h2>
            <p className={`mt-2 text-sm max-w-md ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              3 live AI systems built on the JEDI stack — each solving a real enterprise problem.
            </p>
          </div>
          <Link
            to="/jedi"
            className={`shrink-0 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-1' : 'text-n-6 hover:text-primary-1'}`}
          >
            Full registry <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl border animate-pulse h-80 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-2 border-n-3'}`} />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border ${isDarkMode ? 'border-n-6 text-n-4' : 'border-n-3 text-n-5'}`}>
            No applications to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {applications.map((app, index) => (
              <ProductCard
                key={app.id}
                app={app}
                index={index}
                matchedUseCases={getMatchedUseCases(app)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseUs;
