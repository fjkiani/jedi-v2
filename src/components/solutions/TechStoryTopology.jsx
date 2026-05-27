/**
 * TechStoryTopology — "How It Works" architecture visualization.
 *
 * Primary path: renders subcategories from Hygraph (techSubcategories prop),
 * grouped into 3 architecture layers. Each subcategory shows its description
 * and a row of technology chips.
 *
 * Fallback path: if no subcategories, falls back to keyword-based chip grouping
 * from the legacy techStack prop.
 *
 * Supports dark and light mode via useTheme().
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FiDatabase,
  FiCpu,
  FiLayers,
  FiZap,
  FiArrowRight,
  FiServer,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

// ─── Layer definitions ────────────────────────────────────────────────────────

const LAYERS = [
  {
    id: 'data',
    label: 'Data Layer',
    sublabel: 'How your data is collected, stored, and prepared',
    icon: FiDatabase,
    color: 'blue',
    // Subcategory name keywords that map to this layer
    keywords: [
      'ingestion', 'storage', 'warehouse', 'orchestration', 'transformation',
      'quality', 'compliance', 'staging', 'production', 'disaster', 'recovery',
      'caching', 'cache', 'database', 'databases', 'vector database', 'vector databases',
      'data', 'etl', 'elt', 'pipeline', 'lake', 'analytics',
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence Layer',
    sublabel: 'How your system reasons, learns, and makes decisions',
    icon: FiCpu,
    color: 'yellow',
    keywords: [
      'agent', 'agent core', 'reasoning', 'memory', 'framework', 'frameworks',
      'model', 'training', 'inference', 'embedding', 'rag', 'llm',
      'ml', 'ai', 'nlp', 'tool integration', 'protocols', 'protocol',
      'continuous', 'learning', 'feedback', 'labeling', 'active',
    ],
  },
  {
    id: 'application',
    label: 'Application Layer',
    sublabel: 'How your users interact and how the system is delivered',
    icon: FiLayers,
    color: 'green',
    keywords: [
      'interface', 'interfaces', 'deployment', 'serving', 'api', 'monitoring',
      'visualization', 'analytics', 'security', 'dev environment', 'devops',
      'frontend', 'backend', 'ci/cd', 'cicd', 'alerting', 'observability',
    ],
  },
];

// ─── Layer color tokens (dark + light) ───────────────────────────────────────

const LAYER_TOKENS = {
  blue: {
    dark: {
      sectionBorder: 'border-blue-500/25',
      sectionBg:     'bg-blue-500/5',
      headerBorder:  'border-blue-500/20',
      iconBg:        'bg-blue-500/15',
      iconText:      'text-blue-400',
      label:         'text-blue-400',
      sublabel:      'text-blue-400/60',
      countBg:       'bg-blue-500/10 border-blue-500/20 text-blue-400',
      cardBorder:    'border-blue-500/15 hover:border-blue-400/40',
      cardBg:        'bg-blue-500/5 hover:bg-blue-500/10',
      subName:       'text-blue-300',
      subDesc:       'text-white/55',
      chipBorder:    'border-blue-500/20 hover:border-blue-400/50',
      chipBg:        'bg-blue-500/8 hover:bg-blue-500/15',
      chipText:      'text-white/70 group-hover:text-white',
      chipArrow:     'text-blue-400',
      overflow:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
      connector:     'bg-blue-400/20',
      connectorTip:  'border-t-blue-400/20',
      legendBar:     'bg-blue-400/40',
    },
    light: {
      sectionBorder: 'border-blue-200',
      sectionBg:     'bg-blue-50/60',
      legendBar:     'bg-blue-400',
      headerBorder:  'border-blue-100',
      iconBg:        'bg-blue-100',
      iconText:      'text-blue-600',
      label:         'text-blue-700',
      sublabel:      'text-blue-500/70',
      countBg:       'bg-blue-100 border-blue-200 text-blue-600',
      cardBorder:    'border-blue-100 hover:border-blue-300',
      cardBg:        'bg-white hover:bg-blue-50',
      subName:       'text-blue-700',
      subDesc:       'text-gray-500',
      chipBorder:    'border-blue-200 hover:border-blue-400',
      chipBg:        'bg-white hover:bg-blue-50',
      chipText:      'text-gray-700 group-hover:text-blue-700',
      chipArrow:     'text-blue-500',
      overflow:      'bg-blue-50 text-blue-600 border-blue-200',
      connector:     'bg-blue-200',
      connectorTip:  'border-t-blue-200',
    },
  },
  yellow: {
    dark: {
      sectionBorder: 'border-yellow-400/25',
      sectionBg:     'bg-yellow-400/5',
      headerBorder:  'border-yellow-400/20',
      iconBg:        'bg-yellow-400/15',
      iconText:      'text-yellow-400',
      label:         'text-yellow-400',
      sublabel:      'text-yellow-400/60',
      countBg:       'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
      cardBorder:    'border-yellow-400/15 hover:border-yellow-400/40',
      cardBg:        'bg-yellow-400/5 hover:bg-yellow-400/10',
      subName:       'text-yellow-300',
      subDesc:       'text-white/55',
      chipBorder:    'border-yellow-400/20 hover:border-yellow-400/50',
      chipBg:        'bg-yellow-400/10 hover:bg-yellow-400/20',
      chipText:      'text-white/70 group-hover:text-white',
      chipArrow:     'text-yellow-400',
      overflow:      'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      connector:     'bg-yellow-400/20',
      connectorTip:  'border-t-yellow-400/20',
      legendBar:     'bg-yellow-400/40',
    },
    light: {
      sectionBorder: 'border-yellow-300',
      sectionBg:     'bg-yellow-50/60',
      legendBar:     'bg-yellow-400',
      headerBorder:  'border-yellow-100',
      iconBg:        'bg-yellow-100',
      iconText:      'text-yellow-600',
      label:         'text-yellow-700',
      sublabel:      'text-yellow-600/70',
      countBg:       'bg-yellow-100 border-yellow-200 text-yellow-700',
      cardBorder:    'border-yellow-200 hover:border-yellow-400',
      cardBg:        'bg-white hover:bg-yellow-50',
      subName:       'text-yellow-700',
      subDesc:       'text-gray-500',
      chipBorder:    'border-yellow-200 hover:border-yellow-400',
      chipBg:        'bg-white hover:bg-yellow-50',
      chipText:      'text-gray-700 group-hover:text-yellow-700',
      chipArrow:     'text-yellow-600',
      overflow:      'bg-yellow-50 text-yellow-700 border-yellow-200',
      connector:     'bg-yellow-200',
      connectorTip:  'border-t-yellow-200',
    },
  },
  green: {
    dark: {
      sectionBorder: 'border-green-400/25',
      sectionBg:     'bg-green-400/5',
      headerBorder:  'border-green-400/20',
      iconBg:        'bg-green-400/15',
      iconText:      'text-green-400',
      label:         'text-green-400',
      sublabel:      'text-green-400/60',
      countBg:       'bg-green-400/10 border-green-400/20 text-green-400',
      cardBorder:    'border-green-400/15 hover:border-green-400/40',
      cardBg:        'bg-green-400/5 hover:bg-green-400/10',
      subName:       'text-green-300',
      subDesc:       'text-white/55',
      chipBorder:    'border-green-400/20 hover:border-green-400/50',
      chipBg:        'bg-green-400/10 hover:bg-green-400/20',
      chipText:      'text-white/70 group-hover:text-white',
      chipArrow:     'text-green-400',
      overflow:      'bg-green-400/10 text-green-400 border-green-400/20',
      connector:     'bg-green-400/20',
      connectorTip:  'border-t-green-400/20',
      legendBar:     'bg-green-400/40',
    },
    light: {
      sectionBorder: 'border-green-200',
      sectionBg:     'bg-green-50/60',
      legendBar:     'bg-green-400',
      headerBorder:  'border-green-100',
      iconBg:        'bg-green-100',
      iconText:      'text-green-600',
      label:         'text-green-700',
      sublabel:      'text-green-600/70',
      countBg:       'bg-green-100 border-green-200 text-green-700',
      cardBorder:    'border-green-200 hover:border-green-400',
      cardBg:        'bg-white hover:bg-green-50',
      subName:       'text-green-700',
      subDesc:       'text-gray-500',
      chipBorder:    'border-green-200 hover:border-green-400',
      chipBg:        'bg-white hover:bg-green-50',
      chipText:      'text-gray-700 group-hover:text-green-700',
      chipArrow:     'text-green-600',
      overflow:      'bg-green-50 text-green-700 border-green-200',
      connector:     'bg-green-200',
      connectorTip:  'border-t-green-200',
    },
  },
};

const tok = (color, isDark) => LAYER_TOKENS[color][isDark ? 'dark' : 'light'];

// ─── Assign a subcategory to a layer by name keyword matching ─────────────────

const assignSubcategoryLayer = (subcategoryName) => {
  const name = subcategoryName.toLowerCase();
  let bestLayer = null;
  let bestScore = 0;

  for (const layer of LAYERS) {
    const score = layer.keywords.reduce(
      (acc, kw) => acc + (name.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestLayer = layer.id;
    }
  }

  if (!bestLayer || bestScore === 0) {
    // Fallback heuristics
    if (name.includes('data') || name.includes('store') || name.includes('base')) return 'data';
    if (name.includes('agent') || name.includes('model') || name.includes('ai') || name.includes('ml')) return 'intelligence';
    return 'application';
  }

  return bestLayer;
};

// ─── Legacy: assign a technology to a layer by name + category keyword ────────

const assignTechLayer = (techName, categoryName) => {
  const text = `${techName} ${categoryName || ''}`.toLowerCase();
  const allKeywords = {
    data: ['postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'snowflake', 'bigquery',
           'redshift', 'databricks', 'kafka', 'kinesis', 'airflow', 'dbt', 'spark', 'hadoop',
           'neo4j', 'pinecone', 'weaviate', 'chroma', 'qdrant', 'milvus', 'sqlite', 'dynamodb',
           'cassandra', 'nosql', 'data', 'database', 'storage', 'warehouse', 'lake', 'pipeline',
           'etl', 'elt', 'ingestion', 'vector', 'graph', 'caching', 'cache', 'orchestration',
           'transformation', 'quality', 'compliance', 'staging', 'production', 'disaster', 'recovery',
           'data-engineering', 'data engineering'],
    intelligence: ['openai', 'gpt', 'claude', 'anthropic', 'gemini', 'llama', 'mistral', 'bert',
                   'hugging', 'transformers', 'spacy', 'nltk', 'langchain', 'langgraph', 'llamaindex',
                   'autogpt', 'crewai', 'autogen', 'tensorflow', 'pytorch', 'keras', 'scikit', 'sklearn',
                   'xgboost', 'agent', 'rag', 'embedding', 'reasoning', 'memory', 'tool', 'ml', 'ai',
                   'nlp', 'llm', 'model', 'neural', 'inference', 'rasa', 'dialogflow',
                   'ai-agents', 'ai agents', 'ai-ml', 'ai ml', 'automation', 'continuous-learning'],
    application: ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'tailwind', 'fastapi', 'flask',
                  'django', 'express', 'node', 'graphql', 'rest', 'docker', 'kubernetes', 'k8s',
                  'terraform', 'ansible', 'helm', 'aws', 'gcp', 'netlify', 'vercel', 'cloudflare',
                  'github', 'gitlab', 'ci', 'cd', 'devops', 'mlops', 'prometheus', 'grafana',
                  'monitoring', 'alerting', 'api', 'integration', 'workflow', 'deployment',
                  'frontend', 'backend', 'microservice', 'serverless', 'security', 'visualization'],
  };

  let bestLayer = 'intelligence';
  let bestScore = 0;
  for (const [layerId, keywords] of Object.entries(allKeywords)) {
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; bestLayer = layerId; }
  }
  return bestLayer;
};

// ─── Icon resolver ────────────────────────────────────────────────────────────

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
  const rawSlug = (slug || '').toLowerCase().replace(/\s+/g, '-');
  if (rawSlug in ICON_SLUG_OVERRIDES) {
    const override = ICON_SLUG_OVERRIDES[rawSlug];
    return override ? `https://cdn.simpleicons.org/${override}` : null;
  }
  if (rawSlug) return `https://cdn.simpleicons.org/${rawSlug}`;
  return null;
};

// ─── Tech chip (compact) ──────────────────────────────────────────────────────

const TechChip = ({ name, slug, icon, t }) => {
  const resolvedIcon = resolveIconUrl(icon, slug);
  const Wrapper = slug ? Link : 'span';
  const props = slug ? { to: `/technology/${slug}` } : {};

  return (
    <Wrapper
      {...props}
      className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${t.chipBorder} ${t.chipBg}`}
    >
      {resolvedIcon ? (
        <img src={resolvedIcon} alt={name} className="w-4 h-4 object-contain shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
      ) : (
        <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${t.iconBg} ${t.iconText}`}>
          {name?.[0] || '?'}
        </span>
      )}
      <span className={`transition-colors ${t.chipText}`}>{name}</span>
      {slug && <FiArrowRight size={9} className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${t.chipArrow}`} />}
    </Wrapper>
  );
};

// ─── Subcategory mini-card ────────────────────────────────────────────────────

const CHIPS_VISIBLE = 5;

const SubcategoryCard = ({ sub, t }) => {
  const [expanded, setExpanded] = useState(false);
  const techs = Array.isArray(sub.technology) ? sub.technology : [];
  const visible = expanded ? techs : techs.slice(0, CHIPS_VISIBLE);
  const overflow = techs.length - CHIPS_VISIBLE;

  return (
    <div className={`rounded-xl border p-4 transition-all ${t.cardBorder} ${t.cardBg} shadow-sm`}>
      {/* Subcategory name */}
      <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${t.subName}`}>
        {sub.name}
      </p>

      {/* Description — the narrative */}
      {sub.description && (
        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${t.subDesc}`}>
          {sub.description}
        </p>
      )}

      {/* Tech chips */}
      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visible.map((tech) => (
            <TechChip key={tech.slug || tech.name} name={tech.name} slug={tech.slug} icon={tech.icon} t={t} />
          ))}
          {!expanded && overflow > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${t.overflow}`}
            >
              +{overflow} more <FiChevronDown size={10} />
            </button>
          )}
          {expanded && overflow > 0 && (
            <button
              onClick={() => setExpanded(false)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${t.overflow}`}
            >
              Show less <FiChevronUp size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Layer section ────────────────────────────────────────────────────────────

const LayerSection = ({ layer, subcategories, index, total, isDark }) => {
  const t = tok(layer.color, isDark);
  const Icon = layer.icon;
  const isLast = index === total - 1;
  const totalTechs = subcategories.reduce((acc, s) => acc + (s.technology?.length || 0), 0);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.1 }}
        className={`rounded-2xl border overflow-hidden ${t.sectionBorder} ${t.sectionBg}`}
      >
        {/* Layer header */}
        <div className={`flex items-center gap-4 px-6 py-5 border-b ${t.headerBorder}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.iconBg}`}>
            <Icon size={20} className={t.iconText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-base font-bold ${t.label}`}>{layer.label}</div>
            <div className={`text-xs mt-0.5 ${t.sublabel}`}>{layer.sublabel}</div>
          </div>
          <div className={`text-xs font-mono px-3 py-1 rounded-full border shrink-0 ${t.countBg}`}>
            {subcategories.length} {subcategories.length === 1 ? 'component' : 'components'} · {totalTechs} techs
          </div>
        </div>

        {/* Subcategory grid */}
        <div className="p-5">
          {subcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {subcategories.map((sub) => (
                <SubcategoryCard key={sub.slug || sub.name} sub={sub} t={t} />
              ))}
            </div>
          ) : (
            <div className={`flex items-center gap-2 text-xs font-mono py-3 ${t.subDesc}`}>
              <FiZap size={12} />
              <span>No components assigned to this layer</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Connector arrow */}
      {!isLast && (
        <div className="flex justify-center my-4">
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-px h-5 ${t.connector}`} />
            <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${t.connectorTip}`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const TechStoryTopology = ({ techSubcategories = [], techStack = {} }) => {
  const { isDarkMode } = useTheme();

  // ── Primary path: subcategory-driven ──────────────────────────────────────
  const subcategoryLayerMap = useMemo(() => {
    if (!techSubcategories.length) return null;

    const map = { data: [], intelligence: [], application: [] };
    techSubcategories.forEach((sub) => {
      const layerId = assignSubcategoryLayer(sub.name);
      map[layerId].push(sub);
    });
    return map;
  }, [techSubcategories]);

  // ── Fallback path: legacy techStack keyword grouping ──────────────────────
  const legacyLayerMap = useMemo(() => {
    if (subcategoryLayerMap) return null; // not needed
    const map = { data: [], intelligence: [], application: [] };
    Object.entries(techStack || {}).forEach(([categoryName, techs]) => {
      Object.entries(techs || {}).forEach(([techName, details]) => {
        const layerId = assignTechLayer(techName, categoryName);
        // Wrap as a pseudo-subcategory for unified rendering
        const existing = map[layerId].find((s) => s.name === categoryName);
        if (existing) {
          existing.technology.push({ name: techName, slug: details.slug, icon: details.icon });
        } else {
          map[layerId].push({ name: categoryName, slug: categoryName, description: null, technology: [{ name: techName, slug: details.slug, icon: details.icon }] });
        }
      });
    });
    return map;
  }, [techStack, subcategoryLayerMap]);

  const layerMap = subcategoryLayerMap || legacyLayerMap || { data: [], intelligence: [], application: [] };
  const totalSubcats = Object.values(layerMap).reduce((acc, arr) => acc + arr.length, 0);
  const totalTechs = Object.values(layerMap).reduce(
    (acc, arr) => acc + arr.reduce((a, s) => a + (s.technology?.length || 0), 0),
    0
  );

  if (totalSubcats === 0 && totalTechs === 0) {
    return (
      <div className={`text-center py-20 rounded-2xl border ${isDarkMode ? 'border-n-6 text-n-4' : 'border-gray-200 text-gray-400'}`}>
        <FiServer className="mx-auto mb-4 text-3xl opacity-40" />
        <p className="text-sm font-mono">Architecture diagram loading…</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* System status bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <span className="w-2 h-2 rounded-full bg-blue-400/60" />
          </div>
          <span className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
            {totalSubcats} components · {totalTechs} technologies · 3 layers
          </span>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-300'}`}>
          <FiActivity size={10} />
          <span>All Systems Operational</span>
        </div>
      </motion.div>

      {/* Layer stack */}
      <div className="space-y-0">
        {LAYERS.map((layer, i) => (
          <LayerSection
            key={layer.id}
            layer={layer}
            subcategories={layerMap[layer.id]}
            index={i}
            total={LAYERS.length}
            isDark={isDarkMode}
          />
        ))}
      </div>

      {/* Footer legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className={`mt-8 flex items-center justify-center gap-8 text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}
      >
        {LAYERS.map((layer) => {
          const t = tok(layer.color, isDarkMode);
          return (
            <span key={layer.id} className="flex items-center gap-2">
              <span className={`w-3 h-px ${t.legendBar}`} />
              {layer.label}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TechStoryTopology;
