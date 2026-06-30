/**
 * APPLICATIONS REGISTRY (formerly Intelligence Unit Registry)
 *
 * Hygraph-driven page for JEDI Labs applications.
 * Each application can link to an external URL or a case study.
 *
 * v2: Each app card now shows matching use-case pills (matched by category slug overlap),
 *     linking to /use-cases/:slug. Use cases are fetched in parallel with apps.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Section from '../components/Section';
import { hygraphClient } from '@/lib/hygraph';
import { GET_APPLICATIONS } from '@/graphql/queries/applications';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import {
  FiCpu, FiActivity, FiServer, FiShield, FiArrowRight, FiLock, FiCrosshair, FiExternalLink, FiLink,
  FiZap, FiTrendingUp, FiUsers, FiClock, FiDollarSign, FiCheckCircle
} from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status = "ONLINE" }) => {
  const colors = {
    ONLINE: "bg-green-500/20 text-green-400 border-green-500/50",
    TRAINING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    DEPLOYED: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    OFFLINE: "bg-red-500/20 text-red-400 border-red-500/50"
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono border rounded ${colors[status] || colors.ONLINE} flex items-center gap-1.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {status}
    </span>
  );
};

// ─── Use-case pill ────────────────────────────────────────────────────────────
const UseCasePill = ({ uc }) => (
  <Link
    to={`/use-cases/${uc.slug}`}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
      bg-primary-1/10 border border-primary-1/30 text-primary-1
      hover:bg-primary-1/20 hover:border-primary-1/60 transition-all duration-200 whitespace-nowrap"
    onClick={(e) => e.stopPropagation()}
  >
    <FiLink className="w-2.5 h-2.5 flex-shrink-0" />
    {uc.title}
  </Link>
);

// ─── Application card ─────────────────────────────────────────────────────────
const ApplicationCard = ({ app, index, matchedUseCases }) => {
  const hasExternalUrl = !!app.applicationUrl?.trim();
  const hasCaseStudy = !!app.caseStudy?.slug;

  const href = hasExternalUrl
    ? app.applicationUrl
    : hasCaseStudy
      ? `/case-studies/${app.caseStudy.slug}`
      : null;

  const isExternal = !!hasExternalUrl;
  const thumbnailUrl = app.featuredImage?.url || app.thumbnail?.url || app.thumbnail;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#0a0a0a] border border-n-6 hover:border-primary-1 transition-all duration-300 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] flex flex-col h-full"
    >
      {/* HUD Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>

      {/* Thumbnail or placeholder */}
      <div className="aspect-video bg-n-8 overflow-hidden flex-shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-mono text-n-5">JEDI</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="px-2 py-1 bg-n-8 rounded border border-n-7 text-[10px] text-n-4 font-mono">
            UNIT-{String(index + 1).padStart(3, '0')}
          </div>
          <StatusBadge status="ONLINE" />
        </div>

        <h3 className="text-xl font-bold text-n-1 mb-1 font-mono group-hover:text-primary-1 transition-colors">
          {app.title}
        </h3>
        {app.categories?.[0]?.name && (
          <p className="text-xs text-primary-2 mb-4 font-mono uppercase tracking-wider">
            {app.categories[0].name}
          </p>
        )}

        <p className="text-sm text-n-3 mb-4 line-clamp-2">
          {app.description || ''}
        </p>

        {/* ── Use-case pills ── */}
        {matchedUseCases.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-n-5 mb-2 flex items-center gap-1.5">
              <FiLink className="w-3 h-3" /> Use Cases Powered
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchedUseCases.map((uc) => (
                <UseCasePill key={uc.id} uc={uc} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-n-7">
          {href ? (
            <span className="flex items-center gap-2 text-xs font-bold text-n-1 group-hover:text-primary-1 transition-colors uppercase tracking-wide">
              {isExternal ? (
                <>
                  Visit Application <FiExternalLink className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Case Study <FiArrowRight />
                </>
              )}
            </span>
          ) : (
            <span className="text-xs text-n-4 font-mono uppercase">No link configured</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return isExternal ? (
      <a
        key={app.id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        aria-label={`Open ${app.title}`}
      >
        {cardContent}
      </a>
    ) : (
      <Link key={app.id} to={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return <div key={app.id} className="h-full">{cardContent}</div>;
};

// ─── System log animation ─────────────────────────────────────────────────────
const SystemLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const sequence = [
      "Initializing JEDI Core...",
      "Connecting to Neural Uplink...",
      "Fetching Applications...",
      "Verifying Security Clearance...",
      "Access Granted: COMMANDER LEVEL",
      "Loading Registry...",
      "System Ready."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} > ${sequence[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs text-green-500/80 bg-black/90 p-4 border border-green-500/20 rounded-lg h-32 overflow-hidden relative font-code">
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
      </div>
      {logs.map((log, i) => (
        <div key={i} className="mb-1">{log}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const JediPage = () => {
  const { isDarkMode } = useTheme();

  const t = {
    pageBg: isDarkMode ? "bg-n-8" : "bg-n-1",
    pageText: isDarkMode ? "text-n-1" : "text-n-8",
    headingText: isDarkMode ? "text-n-1" : "text-n-8",
    subheadText: isDarkMode ? "text-n-2" : "text-n-7",
    bodyText: isDarkMode ? "text-n-4" : "text-n-5",
    mutedText: isDarkMode ? "text-n-4" : "text-n-6",
    semiText: isDarkMode ? "text-n-3" : "text-n-6",
    weakText: isDarkMode ? "text-n-5" : "text-n-5",
    cardBg: isDarkMode ? "bg-n-7/50" : "bg-n-1",
    cardBorder: isDarkMode ? "border-n-6" : "border-n-3",
    cardBorderHover: "hover:border-primary-1/30",
    ctaBorder: isDarkMode ? "border-n-6" : "border-n-3",
    ctaText: isDarkMode ? "text-n-2" : "text-n-7",
    dividerBorder: isDarkMode ? "border-n-6" : "border-n-3",
    gridLines: isDarkMode
      ? "[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
      : "[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]",
  };

  const [applications, setApplications] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch apps and use cases in parallel
        const [appData, ucData] = await Promise.all([
          hygraphClient.request(GET_APPLICATIONS, { stage: 'PUBLISHED' }),
          hygraphClient.request(GET_USE_CASES),
        ]);

        const list = appData?.projects12 || appData?.projects || [];
        setApplications(list);
        setUseCases(ucData?.useCaseS || []);
      } catch (e) {
        console.error('Failed to load applications', e);
        setError('Failed to load applications.');
        setApplications([]);
        setUseCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /**
   * Match use cases to an app by category slug overlap.
   * app.categories[*].slug ∩ useCase.category.slug
   */
  const getMatchedUseCases = (app) => {
    if (!Array.isArray(app.categories) || app.categories.length === 0) return [];
    const appSlugs = new Set(app.categories.map((c) => c.slug));
    return useCases
      .filter((uc) => uc.category?.slug && appSlugs.has(uc.category.slug))
      .slice(0, 3); // cap at 3 pills
  };

  return (
    <>
      <Helmet>
        <title>Jedi Labs — AI Systems That Solve Real Business Problems</title>
        <meta name="description" content="Jedi Labs builds and deploys production AI applications that automate workflows, reduce costs, and unlock knowledge. From data pipelines to intelligent agents — AI that ships." />
        <meta property="og:url" content="https://jedilabs.org/jedi" />
        <link rel="canonical" href="https://jedilabs.org/jedi" />
      </Helmet>

      <div className={`min-h-screen ${t.pageBg} ${t.pageText} pt-[8rem] pb-20 relative overflow-hidden`}>

        {/* Background Grid */}
        <div
          className={
            isDarkMode
              ? "absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
              : "absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
          }
        ></div>

        <Section className="relative z-10" crosses>
          <div className="container">

            {/* ── Business Value Proposition ── */}
            <div className="max-w-4xl mx-auto text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center justify-center gap-2 text-primary-1 font-mono text-sm mb-4">
                  <FiZap className="animate-pulse" />
                  <span>JEDI LABS — AI THAT SHIPS</span>
                </div>
                <h1 className={`h1 font-bold ${t.headingText} mb-6`}>
                  We build AI systems that{" "}
                  <span className="text-primary-1">solve real business problems</span>
                </h1>
                <p className={`body-1 ${t.bodyText} max-w-3xl mx-auto`}>
                  Jedi Labs turns AI from a buzzword into a bottom-line result. We design, build,
                  and deploy production AI applications — from data pipelines to intelligent agents —
                  that integrate with your existing systems and deliver measurable outcomes.
                </p>
              </motion.div>
            </div>

            {/* ── What We Solve ── */}
            <div className="max-w-5xl mx-auto mb-20">
              <h2 className={`text-center ${t.headingText} font-code text-sm uppercase tracking-wider mb-10`}>
                What We Solve For Businesses
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: FiClock,
                    title: "Slow, Manual Workflows",
                    problem: "Teams waste hours on repetitive tasks — document processing, data entry, customer triage, report generation.",
                    solution: "We deploy AI agents that automate these workflows end-to-end, reducing processing time from hours to seconds while improving accuracy.",
                    metric: "60-100x faster",
                  },
                  {
                    icon: FiDollarSign,
                    title: "High Operational Costs",
                    problem: "Scaling operations means hiring more people. Customer support, data analysis, and content creation all grow linearly with headcount.",
                    solution: "AI systems handle 80-90% of routine work at a fraction of the cost, letting your team focus on high-value tasks that actually require human judgment.",
                    metric: "50-90% cost reduction",
                  },
                  {
                    icon: FiUsers,
                    title: "Knowledge Locked in Silos",
                    problem: "Critical business knowledge lives in documents, databases, and employees' heads. Finding the right information takes too long.",
                    solution: "We build RAG systems and knowledge graphs that unify your data into a searchable, queryable intelligence layer — accessible by humans and AI agents alike.",
                    metric: "Instant knowledge access",
                  },
                  {
                    icon: FiTrendingUp,
                    title: "Decisions Without Data",
                    problem: "Business leaders make decisions on intuition because extracting insights from raw data takes too long or requires technical teams.",
                    solution: "Our analytics pipelines and AI co-pilots surface real-time insights, predictions, and recommendations — so decisions are grounded in data, not guesswork.",
                    metric: "Data-driven decisions",
                  },
                  {
                    icon: FiCpu,
                    title: "AI Projects That Never Ship",
                    problem: "Companies invest in AI initiatives that stall in proof-of-concept limbo — models work in notebooks but never reach production.",
                    solution: "We build for production from day one: proper data pipelines, model deployment, monitoring, and integration with your existing infrastructure. We ship working software, not demos.",
                    metric: "Production-ready AI",
                  },
                  {
                    icon: FiShield,
                    title: "Data Security & Compliance",
                    problem: "AI initiatives raise valid concerns about data privacy, regulatory compliance, and security — especially in healthcare and finance.",
                    solution: "Our systems are built with security by design: on-premise deployment options, data encryption, audit trails, and compliance with HIPAA, SOC 2, and GDPR requirements.",
                    metric: "Enterprise-grade security",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`p-6 rounded-2xl ${t.cardBg} border ${t.cardBorder} hover:border-primary-1/30 transition-colors`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary-1/10 rounded-lg text-primary-1">
                          <Icon size={20} />
                        </div>
                        <h3 className={`${t.headingText} font-bold text-sm`}>{item.title}</h3>
                      </div>
                      <p className={`${t.bodyText} text-xs mb-2`}>
                        <span className={`${t.semiText} font-semibold`}>The problem: </span>
                        {item.problem}
                      </p>
                      <p className={`${t.bodyText} text-xs mb-4`}>
                        <span className="text-primary-1 font-semibold">Our solution: </span>
                        {item.solution}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1 text-xs font-mono">
                        <FiCheckCircle className="w-3 h-3" />
                        {item.metric}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── How We Help ── */}
            <div className="max-w-4xl mx-auto mb-20">
              <h2 className={`text-center ${t.headingText} font-code text-sm uppercase tracking-wider mb-10`}>
                How Jedi Labs Engages
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: "01",
                    title: "Discover",
                    desc: "We audit your workflows, data, and bottlenecks to identify where AI delivers the highest ROI. You get a prioritized roadmap with clear success metrics — not a generic AI pitch.",
                    duration: "1-2 weeks",
                  },
                  {
                    step: "02",
                    title: "Build",
                    desc: "We design and build the AI system end-to-end: data pipelines, model training, deployment infrastructure, and integration with your existing tools. Working software in weeks, not quarters.",
                    duration: "4-8 weeks",
                  },
                  {
                    step: "03",
                    title: "Scale",
                    desc: "We deploy to production, monitor performance, and iterate based on real usage. The system integrates with your team's workflow and scales as your needs grow — no science projects.",
                    duration: "Ongoing",
                  },
                ].map((phase, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative p-6 rounded-2xl ${t.cardBg} border ${t.cardBorder}`}
                  >
                    <div className="text-primary-1 font-mono text-3xl font-bold mb-3 opacity-50">
                      {phase.step}
                    </div>
                    <h3 className={`${t.headingText} font-bold text-lg mb-2`}>{phase.title}</h3>
                    <p className={`${t.bodyText} text-sm mb-4`}>{phase.desc}</p>
                    <span className={`text-xs font-mono ${t.weakText} uppercase tracking-wider`}>
                      {phase.duration}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="max-w-2xl mx-auto text-center mb-20">
              <h2 className={`h2 ${t.headingText} mb-4`}>Ready to turn AI into outcomes?</h2>
              <p className={`${t.bodyText} mb-8`}>
                Tell us about your workflow. We'll show you exactly where AI can deliver measurable impact —
                with a concrete plan, timeline, and ROI estimate.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/contact" white>Book a Discovery Call</Button>
                <Link
                  to="/case-studies"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${t.ctaBorder} ${t.ctaText} font-code text-sm hover:border-primary-1/40 transition-colors`}
                >
                  See Case Studies <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* ── Dark HUD Island (preserves terminal aesthetic across themes) ── */}
            <div className={isDarkMode ? "" : "bg-n-8 text-n-1 rounded-3xl px-6 sm:px-8 py-10 -mx-4 sm:-mx-8 mt-8 shadow-2xl"}>
            {/* ── Divider ── */}
            <div className="border-t border-n-6 pt-12 mb-8">
              <div className="flex items-center gap-2 text-primary-1 font-mono text-sm mb-2">
                <FiShield className="animate-pulse" />
                <span>APPLICATIONS REGISTRY</span>
              </div>
              <p className="text-n-4 text-sm max-w-2xl">
                Below are deployed JEDI Labs applications — production AI systems built on the JEDI stack.
                Each links to its use case architecture.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {[
                { label: "ACTIVE APPS", value: applications.length || "0", icon: FiCpu },
                { label: "SYSTEM LOAD", value: "12%", icon: FiActivity },
                { label: "GLOBAL UPTIME", value: "99.99%", icon: FiServer },
                { label: "SECURITY LEVEL", value: "ALPHA", icon: FiLock },
              ].map((stat, i) => (
                <div key={i} className="bg-n-7/50 border border-n-6 p-4 rounded-lg flex items-center gap-4">
                  <div className="p-2 bg-n-6 rounded text-primary-1">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-n-4 font-mono tracking-wider">{stat.label}</div>
                    <div className="text-xl font-bold font-mono">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
                <FiCpu /> DEPLOYED APPLICATIONS
              </h2>
              <Link
                to="/use-cases"
                className="text-xs font-mono text-n-4 hover:text-primary-1 flex items-center gap-1.5 transition-colors"
              >
                Browse all use cases <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {error && (
              <div className="py-12 text-center text-n-4 font-mono">
                {error}
              </div>
            )}

            {loading ? (
              <div className="h-96 flex items-center justify-center font-mono text-primary-1 animate-pulse">
                LOADING REGISTRY DATA...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {applications.map((app, index) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    index={index}
                    matchedUseCases={getMatchedUseCases(app)}
                  />
                ))}

                {/* Placeholder for "New Application" */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border border-dashed border-n-6 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-n-5 transition-colors group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-n-7 flex items-center justify-center text-n-4 mb-4 group-hover:bg-n-6 group-hover:text-primary-1 transition-colors">
                    <FiCrosshair size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-n-3 mb-2">Commission New Application</h3>
                  <p className="text-sm text-n-4 mb-6 max-w-xs">
                    Initiate a new agent build tailored to your specific enterprise requirements.
                  </p>
                  <Button href="/contact" white small>INITIALIZE BUILD</Button>
                </motion.div>
              </div>
            )}

            </div>
            {/* ── /Dark HUD Island ── */}
          </div>
        </Section>
      </div>
    </>
  );
};

export default JediPage;
