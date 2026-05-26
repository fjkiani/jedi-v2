/**
 * TechStoryTopology — Layered system architecture visualization.
 *
 * Technologies are assigned to layers by keyword matching against name/category.
 * Each tech chip links to /technology/:slug.
 * Supports both dark and light mode via useTheme().
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  FiDatabase,
  FiCpu,
  FiLayers,
  FiZap,
  FiArrowRight,
  FiServer,
  FiActivity,
} from 'react-icons/fi';

// ─── Layer definitions ────────────────────────────────────────────────────────

const LAYERS = [
  {
    id: 'data',
    label: 'Data Layer',
    sublabel: 'Ingestion · Storage · Pipelines',
    icon: FiDatabase,
    color: 'blue',
    keywords: [
      // Databases
      'postgres', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'snowflake', 'bigquery', 'redshift', 'databricks', 's3', 'gcs', 'azure',
      'neo4j', 'pinecone', 'weaviate', 'chroma', 'qdrant', 'milvus',
      'sqlite', 'dynamodb', 'cassandra', 'influx', 'timescale', 'nosql',
      // Streaming / pipelines
      'kafka', 'kinesis', 'airflow', 'dbt', 'spark', 'hadoop', 'flink',
      'rabbitmq', 'pulsar', 'nats', 'celery',
      // Category keywords (Hygraph subcategory names)
      'data', 'database', 'storage', 'warehouse', 'lake', 'pipeline',
      'etl', 'elt', 'ingestion', 'vector', 'graph', 'caching', 'cache',
      'orchestration', 'transformation', 'quality', 'compliance',
      'staging', 'production', 'disaster', 'recovery',
      // Hygraph category slugs / names
      'data-engineering', 'data engineering',
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence Layer',
    sublabel: 'Models · Agents · Reasoning',
    icon: FiCpu,
    color: 'yellow',
    keywords: [
      // LLMs / foundation models
      'openai', 'gpt', 'claude', 'anthropic', 'gemini', 'llama', 'mistral',
      'bert', 'hugging', 'huggingface', 'transformers', 'spacy', 'nltk',
      'finbert', 'fin-bert', 'rasa', 'dialogflow', 'wit', 'lex',
      // Agent frameworks
      'langchain', 'langgraph', 'llamaindex', 'autogpt', 'crewai', 'autogen',
      'semantic kernel', 'haystack', 'dspy',
      // ML frameworks
      'tensorflow', 'pytorch', 'keras', 'scikit', 'sklearn', 'xgboost',
      'lightgbm', 'catboost', 'onnx', 'triton',
      // Concepts
      'agent', 'rag', 'embedding', 'reasoning', 'memory', 'tool',
      'ml', 'ai', 'nlp', 'nlu', 'llm', 'model', 'neural', 'inference',
      'classification', 'detection', 'prediction', 'generation',
      'function', 'protocol', 'interface', 'framework',
      // Hygraph category slugs / names
      'ai-agents', 'ai agents', 'ai-ml', 'ai ml', 'ml', 'automation',
      'continuous-learning', 'continuous learning',
      'agent core', 'reasoning', 'memory', 'interfaces', 'frameworks',
      'tool integration', 'protocols', 'vector databases',
    ],
  },
  {
    id: 'application',
    label: 'Application Layer',
    sublabel: 'APIs · Orchestration · Delivery',
    icon: FiLayers,
    color: 'green',
    keywords: [
      // Frontend
      'react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'tailwind',
      // Backend / APIs
      'fastapi', 'flask', 'django', 'express', 'node', 'graphql', 'rest',
      'grpc', 'websocket', 'webhook',
      // DevOps / infra
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'helm',
      'aws', 'gcp', 'netlify', 'vercel', 'cloudflare',
      'github', 'gitlab', 'ci', 'cd', 'devops', 'mlops',
      // Monitoring / observability
      'prometheus', 'grafana', 'datadog', 'sentry', 'newrelic',
      'monitoring', 'alerting', 'logging', 'tracing',
      // SaaS integrations
      'stripe', 'twilio', 'sendgrid', 'auth0', 'okta',
      // Concepts
      'api', 'integration', 'workflow', 'deployment',
      'frontend', 'backend', 'microservice', 'serverless',
      // Hygraph category slugs / names
      'security', 'visualization', 'analytics', 'dev environment',
      'ml monitoring', 'feedback loop', 'data labeling', 'active learning',
      'model serving', 'inference api', 'ci/cd',
    ],
  },
];

// ─── Assign a technology to a layer ──────────────────────────────────────────

const assignLayer = (techName, categoryName) => {
  const searchText = `${techName} ${categoryName || ''}`.toLowerCase();

  let bestLayer = null;
  let bestScore = 0;

  for (const layer of LAYERS) {
    const score = layer.keywords.reduce(
      (acc, kw) => acc + (searchText.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestLayer = layer.id;
    }
  }

  // Default: if category name contains 'data', go data; if 'agent'/'ml'/'ai', go intelligence; else application
  if (!bestLayer || bestScore === 0) {
    const cat = (categoryName || '').toLowerCase();
    if (cat.includes('data')) return 'data';
    if (cat.includes('agent') || cat.includes('ml') || cat.includes('ai') || cat.includes('model')) return 'intelligence';
    return 'application';
  }

  return bestLayer;
};

// ─── Resolve icon URL (handles broken Hygraph icon fields) ───────────────────

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

// ─── Theme-aware layer styles ─────────────────────────────────────────────────

const getLayerStyles = (color, isDark) => {
  const styles = {
    blue: {
      border:       isDark ? 'border-blue-500/30'  : 'border-blue-400/40',
      bg:           isDark ? 'bg-blue-500/5'        : 'bg-blue-50',
      labelBg:      isDark ? 'bg-blue-500/10'       : 'bg-blue-100',
      labelText:    isDark ? 'text-blue-400'         : 'text-blue-600',
      labelBorder:  isDark ? 'border-blue-500/20'   : 'border-blue-300',
      chipBorder:   isDark ? 'border-blue-500/20 hover:border-blue-400/50' : 'border-blue-200 hover:border-blue-400',
      chipBg:       isDark ? 'bg-blue-500/5 hover:bg-blue-500/10'          : 'bg-white hover:bg-blue-50',
      iconColor:    isDark ? 'text-blue-400'         : 'text-blue-500',
      sublabel:     isDark ? 'text-white/35'         : 'text-gray-400',
      chipText:     isDark ? 'text-white/70 group-hover:text-white'        : 'text-gray-700 group-hover:text-blue-700',
      emptyText:    isDark ? 'text-white/25'         : 'text-gray-300',
    },
    yellow: {
      border:       isDark ? 'border-yellow-400/30' : 'border-yellow-400/50',
      bg:           isDark ? 'bg-yellow-400/5'       : 'bg-yellow-50',
      labelBg:      isDark ? 'bg-yellow-400/10'      : 'bg-yellow-100',
      labelText:    isDark ? 'text-yellow-400'        : 'text-yellow-600',
      labelBorder:  isDark ? 'border-yellow-400/20'  : 'border-yellow-300',
      chipBorder:   isDark ? 'border-yellow-400/20 hover:border-yellow-400/50' : 'border-yellow-200 hover:border-yellow-400',
      chipBg:       isDark ? 'bg-yellow-400/5 hover:bg-yellow-400/10'          : 'bg-white hover:bg-yellow-50',
      iconColor:    isDark ? 'text-yellow-400'        : 'text-yellow-500',
      sublabel:     isDark ? 'text-white/35'          : 'text-gray-400',
      chipText:     isDark ? 'text-white/70 group-hover:text-white'            : 'text-gray-700 group-hover:text-yellow-700',
      emptyText:    isDark ? 'text-white/25'          : 'text-gray-300',
    },
    green: {
      border:       isDark ? 'border-green-400/30'  : 'border-green-400/40',
      bg:           isDark ? 'bg-green-400/5'        : 'bg-green-50',
      labelBg:      isDark ? 'bg-green-400/10'       : 'bg-green-100',
      labelText:    isDark ? 'text-green-400'         : 'text-green-600',
      labelBorder:  isDark ? 'border-green-400/20'   : 'border-green-300',
      chipBorder:   isDark ? 'border-green-400/20 hover:border-green-400/50' : 'border-green-200 hover:border-green-400',
      chipBg:       isDark ? 'bg-green-400/5 hover:bg-green-400/10'          : 'bg-white hover:bg-green-50',
      iconColor:    isDark ? 'text-green-400'         : 'text-green-500',
      sublabel:     isDark ? 'text-white/35'          : 'text-gray-400',
      chipText:     isDark ? 'text-white/70 group-hover:text-white'          : 'text-gray-700 group-hover:text-green-700',
      emptyText:    isDark ? 'text-white/25'          : 'text-gray-300',
    },
  };
  return styles[color];
};

// ─── Tech chip ────────────────────────────────────────────────────────────────

const TechChip = ({ techName, details, layerColor, isDark }) => {
  const styles = getLayerStyles(layerColor, isDark);
  const Wrapper = details.slug ? Link : 'div';
  const wrapperProps = details.slug ? { to: `/technology/${details.slug}` } : {};
  const resolvedIcon = resolveIconUrl(details.icon, details.slug);

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${styles.chipBorder} ${styles.chipBg}`}
    >
      {resolvedIcon ? (
        <img
          src={resolvedIcon}
          alt={techName}
          className="w-5 h-5 object-contain shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${styles.labelBg} ${styles.labelText}`}>
          {techName[0] || '?'}
        </div>
      )}
      <span className={`text-xs font-mono transition-colors truncate max-w-[120px] ${styles.chipText}`}>
        {techName}
      </span>
      {details.slug && (
        <FiArrowRight
          size={10}
          className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${styles.labelText}`}
        />
      )}
    </Wrapper>
  );
};

// ─── Layer row ────────────────────────────────────────────────────────────────

const LayerRow = ({ layer, techs, index, total, isDark }) => {
  const styles = getLayerStyles(layer.color, isDark);
  const Icon = layer.icon;
  const isLast = index === total - 1;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.4, delay: index * 0.12 }}
        className={`rounded-2xl border ${styles.border} ${styles.bg} overflow-hidden`}
      >
        {/* Layer header */}
        <div className={`flex items-center gap-4 px-6 py-4 border-b ${styles.border}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.labelBg} border ${styles.labelBorder}`}>
            <Icon size={18} className={styles.iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-bold ${styles.labelText}`}>{layer.label}</div>
            <div className={`text-xs font-mono ${styles.sublabel}`}>{layer.sublabel}</div>
          </div>
          <div className={`text-xs font-mono px-2.5 py-1 rounded-full border ${styles.labelBorder} ${styles.labelBg} ${styles.labelText}`}>
            {techs.length} {techs.length === 1 ? 'component' : 'components'}
          </div>
        </div>

        {/* Tech chips */}
        <div className="p-5">
          {techs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {techs.map(([name, details]) => (
                <TechChip
                  key={name}
                  techName={name}
                  details={details}
                  layerColor={layer.color}
                  isDark={isDark}
                />
              ))}
            </div>
          ) : (
            <div className={`flex items-center gap-2 text-xs font-mono py-2 ${styles.emptyText}`}>
              <FiZap size={12} />
              <span>No components assigned to this layer</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Connector arrow between layers */}
      {!isLast && (
        <div className="flex justify-center my-3 relative z-10">
          <div className="flex flex-col items-center gap-0.5">
            <div className={`w-px h-4 ${isDark ? 'bg-white/15' : 'bg-gray-300'}`} />
            <div className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${isDark ? 'border-t-white/20' : 'border-t-gray-300'}`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const TechStoryTopology = ({ techStack }) => {
  const { isDarkMode } = useTheme();

  // Assign each technology to a layer
  const layerMap = useMemo(() => {
    const map = { data: [], intelligence: [], application: [] };

    Object.entries(techStack || {}).forEach(([categoryName, techs]) => {
      Object.entries(techs || {}).forEach(([techName, details]) => {
        const layerId = assignLayer(techName, categoryName);
        map[layerId].push([techName, details]);
      });
    });

    return map;
  }, [techStack]);

  const totalTechs = Object.values(layerMap).reduce((acc, arr) => acc + arr.length, 0);

  if (totalTechs === 0) {
    return (
      <div className={`text-center py-16 font-mono text-sm ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
        <FiServer className="mx-auto mb-4 text-3xl" />
        <p>Architecture diagram loading…</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* System header */}
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
            System Architecture · {totalTechs} components · 3 layers
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
          <LayerRow
            key={layer.id}
            layer={layer}
            techs={layerMap[layer.id]}
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
        transition={{ delay: 0.5 }}
        className={`mt-8 flex items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-3 h-px ${isDarkMode ? 'bg-blue-400/40' : 'bg-blue-400'}`} />
          Data Layer
        </span>
        <span className="flex items-center gap-2">
          <span className={`w-3 h-px ${isDarkMode ? 'bg-yellow-400/40' : 'bg-yellow-400'}`} />
          Intelligence Layer
        </span>
        <span className="flex items-center gap-2">
          <span className={`w-3 h-px ${isDarkMode ? 'bg-green-400/40' : 'bg-green-400'}`} />
          Application Layer
        </span>
      </motion.div>
    </div>
  );
};

export default TechStoryTopology;
