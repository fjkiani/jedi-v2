import { motion } from "framer-motion";
import PipelineDiagram from "./PipelineDiagram";
import MetricCard from "./MetricCard";
import CodeSnippet from "./CodeSnippet";
import DemoEmbed from "./DemoEmbed";

const DomainShowcase = ({ domain, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-20 lg:mb-32"
    >
      {/* Domain header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl`}
        >
          {domain.icon}
        </div>
        <div>
          <h3 className="h3 text-n-1">{domain.title}</h3>
          <p className="text-color-1 text-sm font-code">{domain.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className="body-2 text-n-4 mb-8 max-w-3xl">{domain.description}</p>

      {/* Two-column layout: pipeline + code */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Pipeline */}
        <div>
          <h4 className="text-n-1 font-code text-sm uppercase tracking-wider mb-2">
            Pipeline
          </h4>
          <PipelineDiagram steps={domain.pipeline} color={domain.color} />
        </div>

        {/* Code */}
        <div>
          <h4 className="text-n-1 font-code text-sm uppercase tracking-wider mb-2">
            Quickstart
          </h4>
          <CodeSnippet code={domain.codeSnippet} />
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <h4 className="text-n-1 font-code text-sm uppercase tracking-wider mb-3">
          Metrics
        </h4>
        <div className="flex flex-wrap gap-3">
          {domain.metrics.map((m, i) => (
            <MetricCard key={i} label={m.label} value={m.value} />
          ))}
        </div>
      </div>

      {/* Tech stack badges */}
      <div className="mb-8">
        <h4 className="text-n-1 font-code text-sm uppercase tracking-wider mb-3">
          Tech Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {domain.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-code bg-n-7 border border-n-6 text-n-3"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* I/O summary */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-n-7/50 border border-n-6">
          <span className="text-xs text-n-4 uppercase tracking-wider">Input</span>
          <p className="text-n-2 text-sm mt-1">{domain.inputType}</p>
        </div>
        <div className="p-4 rounded-xl bg-n-7/50 border border-n-6">
          <span className="text-xs text-n-4 uppercase tracking-wider">Output</span>
          <p className="text-n-2 text-sm mt-1">{domain.outputType}</p>
        </div>
      </div>

      {/* Live demo */}
      <div>
        <h4 className="text-n-1 font-code text-sm uppercase tracking-wider mb-3">
          Live Demo
        </h4>
        <DemoEmbed url={domain.demoUrl} title={domain.title} repoUrl={domain.repoUrl} />
      </div>

      {/* Repo link */}
      <div className="mt-6">
        <a
          href={domain.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-color-1 hover:text-color-1/80 text-sm font-medium transition-colors"
        >
          View {domain.title} source on GitHub →
        </a>
      </div>
    </motion.div>
  );
};

export default DomainShowcase;
