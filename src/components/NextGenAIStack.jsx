/**
 * NextGenAIStack — "How We Build" pipeline narrative.
 *
 * Replaces the bland card grid with a 3-stage horizontal pipeline:
 *   Stage 1: Understand  (Data Engineering, NLP/NLU)
 *   Stage 2: Build       (AI Agents, ML)
 *   Stage 3: Deploy      (Automation, Security)
 *
 * Each stage shows category chips linking to /solutions/:slug.
 * Footer strip bridges to /jedi (live products).
 *
 * Data: GET_ALL_SOLUTIONS (same query as before — no new Hygraph call).
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Heading from "./Heading";
import Section from "./Section";
import { useTheme } from "@/context/ThemeContext";
import { hygraphClient } from "@/lib/hygraph";
import { GET_ALL_SOLUTIONS } from "@/graphql/queries/solutions";
import { FiArrowRight, FiDatabase, FiCpu, FiZap } from "react-icons/fi";

// ─── Static pipeline stage config ────────────────────────────────────────────
// Maps category slugs to one of 3 pipeline stages.
const STAGE_CONFIG = [
  {
    id: "understand",
    label: "01 / Understand",
    title: "Ingest & Reason",
    description: "We connect to your data sources, parse unstructured content, and build semantic understanding of your domain.",
    icon: FiDatabase,
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
    dotColor: "bg-blue-400",
    slugs: ["data-engineering", "nlp-nlu"],
    stat: { value: "221", label: "Technologies" },
  },
  {
    id: "build",
    label: "02 / Build",
    title: "Agent & Model Layer",
    description: "Autonomous agents orchestrate multi-step workflows. ML models learn from your specific context and improve continuously.",
    icon: FiCpu,
    color: "from-violet-500/20 to-violet-500/5",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-400",
    dotColor: "bg-violet-400",
    slugs: ["ai-agents", "ml"],
    stat: { value: "6", label: "Live Use Cases" },
  },
  {
    id: "deploy",
    label: "03 / Deploy",
    title: "Automate & Secure",
    description: "Production-grade pipelines with enterprise security. Continuous monitoring, automated remediation, zero-downtime rollouts.",
    icon: FiZap,
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    slugs: ["automation", "security"],
    stat: { value: "3", label: "Products Shipped" },
  },
];

// ─── Connector arrow between stages ──────────────────────────────────────────
const StageConnector = ({ isDarkMode }) => (
  <div className="hidden lg:flex items-center justify-center flex-shrink-0 w-12">
    <div className={`flex flex-col items-center gap-1 ${isDarkMode ? "text-n-5" : "text-n-4"}`}>
      <div className={`w-8 h-px ${isDarkMode ? "bg-n-5" : "bg-n-4"}`} />
      <FiArrowRight className="w-4 h-4 -mt-2.5 ml-4" />
    </div>
  </div>
);

// ─── Single pipeline stage card ───────────────────────────────────────────────
const StageCard = ({ stage, categories, index, isDarkMode }) => {
  const Icon = stage.icon;
  // Filter categories that belong to this stage
  const stageCats = categories.filter((c) => stage.slugs.includes(c.slug));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="flex-1 min-w-0"
    >
      <div
        className={`h-full rounded-2xl border bg-gradient-to-b p-6 flex flex-col gap-5 transition-all duration-300
          ${stage.color} ${stage.borderColor}
          ${isDarkMode ? "hover:bg-n-7/60" : "hover:shadow-lg hover:bg-white/80"}`}
      >
        {/* Stage label + icon */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono uppercase tracking-widest ${stage.accentColor}`}>
            {stage.label}
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDarkMode ? "bg-n-7" : "bg-white/70"}`}>
            <Icon className={`w-5 h-5 ${stage.accentColor}`} />
          </div>
        </div>

        {/* Title + description */}
        <div>
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-n-1" : "text-n-8"}`}>
            {stage.title}
          </h3>
          <p className={`text-sm leading-relaxed ${isDarkMode ? "text-n-4" : "text-n-5"}`}>
            {stage.description}
          </p>
        </div>

        {/* Category chips */}
        {stageCats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {stageCats.map((cat) => (
              <Link
                key={cat.id}
                to={`/solutions/${cat.slug}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200
                  ${isDarkMode
                    ? "bg-n-7 border-n-6 text-n-3 hover:border-primary-1 hover:text-primary-1"
                    : "bg-white border-n-3 text-n-6 hover:border-primary-1 hover:text-primary-1 shadow-sm"
                  }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Stat */}
        <div className={`pt-4 border-t flex items-center gap-3
          ${isDarkMode ? "border-n-6/40" : "border-n-3/60"}`}>
          <div className={`w-2 h-2 rounded-full ${stage.dotColor} animate-pulse`} />
          <span className={`text-xl font-bold font-mono ${isDarkMode ? "text-n-1" : "text-n-8"}`}>
            {stage.stat.value}
          </span>
          <span className={`text-xs uppercase tracking-wider ${isDarkMode ? "text-n-4" : "text-n-5"}`}>
            {stage.stat.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const NextGenAIStack = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hygraphClient
      .request(GET_ALL_SOLUTIONS)
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("NextGenAIStack fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Section className="overflow-hidden">
        <div className="container relative z-2 text-center py-20">
          <div className="inline-flex items-center gap-2 text-primary-1 animate-pulse">
            <span className="w-2 h-2 bg-primary-1 rounded-full" />
            <span className="font-mono text-sm tracking-widest uppercase">Loading Stack...</span>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden" id="next-gen-ai">
      <div className="container relative z-2">

        {/* ── Section header ── */}
        <div className="flex flex-col items-center mb-12 lg:mb-16">
          <div className="tagline mb-4 flex items-center gap-2">
            <span className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-n-3" : "bg-n-6"}`} />
            <span className="text-xs font-code uppercase tracking-widest text-n-4">How We Build</span>
            <span className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-n-3" : "bg-n-6"}`} />
          </div>
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center"
            title="The JEDI AI Stack"
          />
          <p className={`mt-4 text-center max-w-xl text-sm leading-relaxed
            ${isDarkMode ? "text-n-4" : "text-n-5"}`}>
            Every deployment follows the same three-stage pipeline — from raw data to autonomous production systems.
          </p>
        </div>

        {/* ── Pipeline stages ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 lg:gap-0">
          {STAGE_CONFIG.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <StageCard
                stage={stage}
                categories={categories}
                index={i}
                isDarkMode={isDarkMode}
              />
              {i < STAGE_CONFIG.length - 1 && (
                <StageConnector isDarkMode={isDarkMode} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Footer bridge to /jedi ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className={`mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl border
            ${isDarkMode
              ? "bg-n-8/60 border-n-6"
              : "bg-white border-n-3 shadow-sm"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {["bg-blue-400", "bg-violet-400", "bg-emerald-400"].map((c, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
              ))}
            </div>
            <span className={`text-sm ${isDarkMode ? "text-n-3" : "text-n-6"}`}>
              This stack powers <span className="font-bold text-primary-1">3 live products</span> across healthcare, oncology, and CRM.
            </span>
          </div>
          <Link
            to="/jedi"
            className={`flex items-center gap-2 text-sm font-bold whitespace-nowrap transition-colors
              ${isDarkMode
                ? "text-n-1 hover:text-primary-1"
                : "text-n-8 hover:text-primary-1"
              }`}
          >
            See the products <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Decorative background glow */}
        <div className="absolute inset-0 -z-1 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-primary-1/10 to-transparent blur-[100px]" />
        </div>
      </div>
    </Section>
  );
};

export default NextGenAIStack;
