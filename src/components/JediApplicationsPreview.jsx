/**
 * LiveDeploymentsSection — Homepage section showing real use-case deployments.
 * Fetches published use cases from Hygraph and renders them as large, compelling cards.
 * Each card routes to /use-cases/:slug.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { hygraphClient } from '@/lib/hygraph';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import SparkCurve from './live-deployments/SparkCurve';
import {
  FiArrowRight,
  FiZap,
  FiCheckCircle,
  FiActivity,
  FiCpu,
} from 'react-icons/fi';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseMetrics = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.slice(0, 3).map((m) => (typeof m === 'string' ? m : m.label || String(m)));
  if (typeof raw === 'string') {
    return raw.split(/\n|,/).map((s) => s.trim()).filter(Boolean).slice(0, 3);
  }
  return [];
};

const TechIcon = ({ tech }) => {
  const icon = tech?.icon;
  const name = tech?.name || '';
  if (icon?.startsWith('http') || icon?.startsWith('/')) {
    return (
      <img
        src={icon}
        alt={name}
        title={name}
        className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
      />
    );
  }
  return (
    <div
      title={name}
      className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60"
    >
      {name[0] || '?'}
    </div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/10 bg-white/3 p-7 animate-pulse">
    <div className="flex items-start justify-between mb-5">
      <div className="h-4 w-24 bg-white/10 rounded" />
      <div className="h-5 w-14 bg-white/10 rounded-full" />
    </div>
    <div className="h-7 w-3/4 bg-white/10 rounded mb-3" />
    <div className="h-4 w-full bg-white/10 rounded mb-2" />
    <div className="h-4 w-2/3 bg-white/10 rounded mb-6" />
    <div className="space-y-2 mb-6">
      {[1, 2, 3].map((i) => <div key={i} className="h-3 w-full bg-white/10 rounded" />)}
    </div>
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => <div key={i} className="w-6 h-6 rounded bg-white/10" />)}
    </div>
  </div>
);

// ─── Deployment card ──────────────────────────────────────────────────────────
const DeploymentCard = ({ uc, index }) => {
  const metrics = parseMetrics(uc.metrics);
  const techs = Array.isArray(uc.technologies) ? uc.technologies.slice(0, 6) : [];
  const category = uc.category?.name || uc.industry?.name || 'AI Deployment';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={uc.applicationUrl || `/use-cases/${uc.slug}`}
        target={uc.applicationUrl ? "_blank" : undefined}
        rel={uc.applicationUrl ? "noopener noreferrer" : undefined}
        className="group block h-full rounded-2xl border border-white/10 bg-white/3 hover:bg-white/6 hover:border-yellow-400/30 transition-all duration-300 overflow-hidden"
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-yellow-400/0 via-yellow-400/60 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-7">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40">
              {category}
            </span>
            <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors leading-snug mb-2">
            {uc.title}
          </h3>

          {/* Results headline — the value prop */}
          {uc.resultsHeadline && (
            <p className="text-sm text-green-400 font-medium mb-3 leading-snug">
              {uc.resultsHeadline}
            </p>
          )}

          {/* Description */}
          {uc.description && (
            <p className="text-sm text-white/55 leading-relaxed mb-5 line-clamp-2">
              {uc.description}
            </p>
          )}

          {/* Outcome metrics */}
          {metrics.length > 0 && (
            <div className="space-y-2 mb-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <FiCheckCircle className="shrink-0 mt-0.5 text-yellow-400/70" size={12} />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          )}

          {/* Inline training curve — reads real metrics.json from ai-training repo */}
          <SparkCurve implementation={uc.implementation} />

          {/* Footer: tech icons + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/8">
            {techs.length > 0 ? (
              <div className="flex items-center gap-2">
                {techs.map((t, i) => <TechIcon key={i} tech={t} />)}
                {uc.technologies?.length > 6 && (
                  <span className="text-xs text-white/30 font-mono">+{uc.technologies.length - 6}</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-white/30 font-mono">
                <FiCpu size={12} />
                <span>AI Stack</span>
              </div>
            )}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View Deployment <FiArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────
const JediApplicationsPreview = () => {
  const { isDarkMode } = useTheme();
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hygraphClient
      .request(GET_USE_CASES)
      .then((data) => {
        const list = data?.useCaseS || data?.useCases || [];
        setUseCases(Array.isArray(list) ? list : []);
      })
      .catch(() => setUseCases([]))
      .finally(() => setLoading(false));
  }, []);

  // Hygraph is the single source of truth for Live Deployments. Show top-4 by updatedAt.
  const displayCases = useCases.slice(0, 4);

  return (
    <section
      id="live-deployments"
      className="relative py-20 lg:py-28 overflow-hidden bg-n-8"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow-400/70 mb-4">
              <FiActivity size={12} />
              <span>Production Systems</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Live Deployments
            </h2>
            <p className="mt-3 text-white/50 text-base max-w-xl leading-relaxed">
              Four production model demos with real per-epoch curves, train/val splits, and live inference. Every card links to a public Hugging Face Space.
            </p>
          </div>

          <Link
            to="/use-cases"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-xl transition-all"
          >
            All Deployments <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayCases.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {displayCases.map((uc, i) => (
              <DeploymentCard key={uc.id} uc={uc} index={i} />
            ))}
          </div>
        ) : (
          /* Fallback if Hygraph returns nothing */
          <div className="text-center py-20 text-white/30 font-mono text-sm">
            <FiZap className="mx-auto mb-4 text-3xl" />
            <p>Deployments loading…</p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/use-cases"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors"
          >
            <FiZap size={16} />
            Explore All Deployments
          </Link>
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:text-white transition-all"
          >
            View Solutions Stack <FiArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Bridge strip: use cases → live products */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-3 text-sm text-white/40"
        >
          <span className="w-8 h-px bg-white/20" />
          <span>
            These deployments power the{' '}
            <Link
              to="/jedi"
              className="text-primary-1 font-semibold hover:text-primary-1/80 transition-colors"
            >
              full applications registry
            </Link>
            {' '}— every model in one place
          </span>
          <Link
            to="/jedi"
            className="inline-flex items-center gap-1 text-primary-1 hover:text-primary-1/80 transition-colors font-semibold"
          >
            <FiArrowRight size={14} />
          </Link>
          <span className="w-8 h-px bg-white/20" />
        </motion.div>
      </div>
    </section>
  );
};

export default JediApplicationsPreview;
