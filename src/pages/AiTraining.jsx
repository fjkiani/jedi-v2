import { useState } from "react";
import { motion } from "framer-motion";
import Section from "../components/Section";
import Heading from "../components/Heading";
import DomainShowcase from "../components/AiTraining/DomainShowcase";
import { aiTrainingDomains } from "../constants/aiTraining";

const AiTraining = () => {
  const [activeDomain, setActiveDomain] = useState("all");

  const filteredDomains =
    activeDomain === "all"
      ? aiTrainingDomains
      : aiTrainingDomains.filter((d) => d.id === activeDomain);

  return (
    <>
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Hero */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="h1 mb-6">
                AI Training{" "}
                <span className="text-color-1">Pipelines</span>
              </h1>
              <p className="body-1 text-n-4 max-w-3xl mx-auto">
                Four domain-specific data preprocessing pipelines — medical imaging,
                geospatial, audio, and video — each with a trained demo model and
                interactive Gradio interface. Built from open-source foundations,
                tested, and deployed.
              </p>
            </motion.div>
          </div>

          {/* Domain filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 lg:mb-20">
            <button
              onClick={() => setActiveDomain("all")}
              className={`px-4 py-2 rounded-full text-sm font-code transition-colors ${
                activeDomain === "all"
                  ? "bg-color-1 text-n-8"
                  : "bg-n-7 text-n-3 hover:text-n-1 border border-n-6"
              }`}
            >
              All Domains
            </button>
            {aiTrainingDomains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`px-4 py-2 rounded-full text-sm font-code transition-colors flex items-center gap-2 ${
                  activeDomain === domain.id
                    ? "bg-color-1 text-n-8"
                    : "bg-n-7 text-n-3 hover:text-n-1 border border-n-6"
                }`}
              >
                <span>{domain.icon}</span>
                {domain.title}
              </button>
            ))}
          </div>

          {/* Domain showcases */}
          <div className="max-w-5xl mx-auto">
            {filteredDomains.map((domain, i) => (
              <DomainShowcase key={domain.id} domain={domain} index={i} />
            ))}
          </div>

          {/* Architecture overview */}
          <div className="max-w-4xl mx-auto mt-20 lg:mt-32">
            <Heading
              tag="Architecture"
              title="Shared pipeline architecture"
              text="All four domains follow the same pattern: raw input → preprocessing → ML-ready output → model → demo."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "📥", label: "Ingest", desc: "Domain-specific loaders (DICOM, GeoTIFF, WAV, MP4)" },
                { icon: "⚙️", label: "Preprocess", desc: "Normalize, resample, tile, extract features" },
                { icon: "🧠", label: "Model", desc: "U-Net, Random Forest, or CLIP zero-shot" },
                { icon: "🖥️", label: "Demo", desc: "Gradio web interface, deployable to HF Spaces" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-n-7/50 border border-n-6 text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="text-n-1 font-code text-sm mb-2">{item.label}</h4>
                  <p className="text-n-4 text-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Repo CTA */}
          <div className="max-w-2xl mx-auto mt-20 lg:mt-32 text-center">
            <Heading
              tag="Open Source"
              title="Full source code on GitHub"
              text="All pipelines are MIT-licensed and built on open-source foundations."
            />
            <a
              href="https://github.com/fjkiani/ai-training"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-color-1 text-n-8 font-code font-semibold hover:bg-color-1/90 transition-colors"
            >
              View Repository →
            </a>
          </div>
        </div>
      </Section>
    </>
  );
};

export default AiTraining;
