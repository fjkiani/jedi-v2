/**
 * PageBottomCTA — dense, per-page-context CTA for long-form pages.
 *
 * Not a marketing block. This is the "what should you do next" answer at the end
 * of a page — primary + secondary paths, honest framing, no fake urgency.
 *
 * Usage:
 *   <PageBottomCTA
 *     eyebrow="Ready to ship?"
 *     title="Take one of these to production"
 *     description="Every model above is live on Hugging Face."
 *     primary={{ label: 'Talk to Engineering', href: '/contact?inquiry=deployment' }}
 *     secondary={{ label: 'See the Training repo', href: 'https://github.com/fjkiani/ai-training' }}
 *   />
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

const isExternal = (href = '') => /^https?:\/\//.test(href) || href.startsWith('mailto:');

const CTAButton = ({ target, variant, isDarkMode }) => {
  if (!target) return null;
  const external = isExternal(target.href);
  const Icon = external ? FiExternalLink : FiArrowRight;

  const primaryCls = 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors';
  const secondaryCls = isDarkMode
    ? 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-white/75 font-semibold text-sm hover:border-white/35 hover:text-white transition-all'
    : 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-n-3 text-n-7 font-semibold text-sm hover:border-n-8 hover:text-n-8 transition-all';

  const className = variant === 'primary' ? primaryCls : secondaryCls;

  if (external) {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={className}>
        {target.label} <Icon size={14} />
      </a>
    );
  }
  return (
    <Link to={target.href} className={className}>
      {target.label} <Icon size={14} />
    </Link>
  );
};

const PageBottomCTA = ({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  variant = 'dark', // 'dark' | 'panel'
}) => {
  const { isDarkMode } = useTheme();

  // Panel variant = subtle bordered card matching page background.
  // Dark variant = full-bleed dark section with yellow accent (default).
  const isPanel = variant === 'panel';

  return (
    <section
      className={`relative py-16 lg:py-20 overflow-hidden ${
        isPanel ? '' : (isDarkMode ? 'bg-n-8' : 'bg-n-8')
      }`}
    >
      {!isPanel && (
        <>
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        </>
      )}

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className={`max-w-3xl mx-auto text-center ${
            isPanel ? `rounded-2xl border p-10 ${isDarkMode ? 'bg-n-7 border-white/10' : 'bg-white border-n-3 shadow-sm'}` : ''
          }`}
        >
          {eyebrow && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-5
              bg-yellow-400/10 text-yellow-400 border border-yellow-400/20`}>
              {eyebrow}
            </div>
          )}
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4 ${
            isPanel && !isDarkMode ? 'text-n-8' : 'text-white'
          }`}>
            {title}
          </h2>
          {description && (
            <p className={`text-base leading-relaxed mb-8 ${
              isPanel && !isDarkMode ? 'text-n-6' : 'text-white/55'
            }`}>
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CTAButton target={primary} variant="primary" isDarkMode={isDarkMode} />
            <CTAButton target={secondary} variant="secondary" isDarkMode={isDarkMode} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PageBottomCTA;
