/**
 * ArchitectureDiagram — Layered system architecture visualization.
 *
 * Replaces the old TechStoryTopology component-list grid with a proper
 * layered flow diagram: Data Layer → Intelligence Layer → Application Layer.
 *
 * Technologies are assigned to layers by keyword matching against name/category.
 * Each tech chip links to /technology/:slug.
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
  FiCode,
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
      'postgres', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'snowflake', 'bigquery', 'redshift', 'databricks', 's3', 'gcs', 'azure',
      'kafka', 'kinesis', 'airflow', 'dbt', 'spark', 'hadoop', 'flink',
      'neo4j', 'pinecone', 'weaviate', 'chroma', 'qdrant', 'milvus',
      'sqlite', 'dynamodb', 'cassandra', 'influx', 'timescale',
      'data', 'database', 'storage', 'warehouse', 'lake', 'pipeline',
      'etl', 'elt', 'ingestion', 'vector', 'graph',
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence Layer',
    sublabel: 'Models · Agents · Reasoning',
    icon: FiCpu,
    color: 'yellow',
    keywords: [
      'openai', 'gpt', 'claude', 'anthropic', 'gemini', 'llama', 'mistral',
      'bert', 'hugging', 'huggingface', 'transformers', 'spacy', 'nltk',
      'langchain', 'langgraph', 'llamaindex', 'autogpt', 'babyagi',
      'tensorflow', 'pytorch', 'keras', 'scikit', 'sklearn', 'xgboost',
      'openai-functions', 'function', 'agent', 'rag', 'embedding',
      'ml', 'ai', 'nlp', 'nlu', 'llm', 'model', 'neural', 'inference',
      'classification', 'detection', 'prediction', 'generation',
      'dialogflow', 'rasa', 'wit', 'lex',
    ],
  },
  {
    id: 'application',
    label: 'Application Layer',
    sublabel: 'APIs · Orchestration · Delivery',
    icon: FiLayers,
    color: 'green',
    keywords: [
      'react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'tailwind',
      'fastapi', 'flask', 'django', 'express', 'node', 'graphql', 'rest',
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'helm',
      'aws', 'gcp', 'azure', 'netlify', 'vercel', 'cloudflare',
      'github', 'gitlab', 'ci', 'cd', 'devops', 'mlops',
      'stripe', 'twilio', 'sendgrid', 'auth0', 'okta',
      'api', 'webhook', 'integration', 'orchestration', 'workflow',
      'frontend', 'backend', 'microservice', 'serverless',
    ],
  },
];

const LAYER_STYLES = {
  blue: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    labelBg: 'bg-blue-500/10',
    labelText: 'text-blue-400',
    labelBorder: 'border-blue-500/20',
    chipBorder: 'border-blue-500/20 hover:border-blue-400/50',
    chipBg: 'bg-blue-500/5 hover:bg-blue-500/10',
    iconColor: 'text-blue-400',
    connectorColor: 'bg-blue-400/20',
  },
  yellow: {
    border: 'border-yellow-400/30',
    bg: 'bg-yellow-400/5',
    labelBg: 'bg-yellow-400/10',
    labelText: 'text-yellow-400',
    labelBorder: 'border-yellow-400/20',
    chipBorder: 'border-yellow-400/20 hover:border-yellow-400/50',
    chipBg: 'bg-yellow-400/5 hover:bg-yellow-400/10',
    iconColor: 'text-yellow-400',
    connectorColor: 'bg-yellow-400/20',
  },
  green: {
    border: 'border-green-400/30',
    bg: 'bg-green-400/5',
    labelBg: 'bg-green-400/10',
    labelText: 'text-green-400',
    labelBorder: 'border-green-400/20',
    chipBorder: 'border-green-400/20 hover:border-green-400/50',
    chipBg: 'bg-green-400/5 hover:bg-green-400/10',
    iconColor: 'text-green-400',
    connectorColor: 'bg-green-400/20',
  },
};

// ─── Assign a technology to a layer ──────────────────────────────────────────

const assignLayer = (techName, techCategory) => {
  const searchText = `${techName} ${techCategory || ''}`.toLowerCase();

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

  return bestLayer || 'intelligence'; // default to intelligence layer
};

// ─── Tech chip ────────────────────────────────────────────────────────────────

const TechChip = ({ techName, details, layerColor }) => {
  const styles = LAYER_STYLES[layerColor];
  const Wrapper = details.slug ? Link : 'div';
  const wrapperProps = details.slug ? { to: `/technology/${details.slug}` } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${styles.chipBorder} ${styles.chipBg}`}
    >
      {details.icon ? (
        <img
          src={details.icon}
          alt={techName}
          className="w-5 h-5 object-contain shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${styles.labelBg} ${styles.labelText}`}>
          {techName[0] || '?'}
        </div>
      )}
      <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors truncate max-w-[120px]">
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

const LayerRow = ({ layer, techs, index, total }) => {
  const styles = LAYER_STYLES[layer.color];
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
            <div className="text-xs text-white/35 font-mono">{layer.sublabel}</div>
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
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-white/25 font-mono py-2">
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
            <div className="w-px h-4 bg-white/15" />
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white/20" />
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
      <div className="text-center py-16 text-white/30 font-mono text-sm">
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
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
            System Architecture · {totalTechs} components · 3 layers
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
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
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-white/20"
      >
        <span className="flex items-center gap-2">
          <span className="w-3 h-px bg-blue-400/40" />
          Data Layer
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-px bg-yellow-400/40" />
          Intelligence Layer
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-px bg-green-400/40" />
          Application Layer
        </span>
      </motion.div>
    </div>
  );
};

export default TechStoryTopology;
