import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import Heading from "../components/Heading";
import PageBottomCTA from "../components/PageBottomCTA";
import { aiTrainingDetails } from "../constants/aiTrainingDetails";
import { useTheme } from "../context/ThemeContext";
import SEO from '@/components/SEO';

const AiTraining = () => {
  const { isDarkMode } = useTheme();

  // Theme tokens — mirrors the pattern from CaseStudies.jsx / FeaturedApplications.jsx
  const t = {
    headingText: isDarkMode ? "text-n-1" : "text-n-8",
    bodyText: isDarkMode ? "text-n-4" : "text-n-5",
    mutedText: isDarkMode ? "text-n-4" : "text-n-6",
    cardBg: isDarkMode ? "bg-n-7/50" : "bg-n-1",
    cardBgHover: isDarkMode ? "group-hover:bg-n-7/70" : "group-hover:bg-n-2/60",
    cardBorder: isDarkMode ? "border-n-6" : "border-n-3",
    dividerBorder: isDarkMode ? "border-n-6" : "border-n-3",
  };

  return (
    <>
      <SEO
        title="AI Training | Jedi Labs — Production Model Fine-Tuning"
        description="Production AI training programs across medical imaging, geospatial segmentation, audio classification, and video understanding. Real training curves, per-class F1, and reproducible experiments."
        path="/ai-training"
        keywords="AI training, model fine-tuning, PyTorch training, production ML, evaluation curves, transfer learning, Jedi Labs"
        ogImage="https://jedilabs.org/og/og-technology.png"
      />
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Hero */}
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className={`h1 mb-6 ${t.headingText}`}>
                AI Training{" "}
                <span className="text-color-1">Pipelines</span>
              </h1>
              <p className={`body-1 max-w-3xl mx-auto ${t.bodyText}`}>
                Four domain-specific data preprocessing pipelines — medical imaging,
                geospatial, audio, and video — each with a trained demo model and
                interactive Gradio interface. Built from open-source foundations,
                tested, and deployed.
              </p>
            </motion.div>
          </div>

          {/* Domain cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
            {aiTrainingDetails.map((domain, i) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/ai-training/${domain.id}`}
                  className="block group h-full"
                >
                  <div className={`h-full p-6 rounded-2xl ${t.cardBg} border ${t.cardBorder} hover:border-color-1/40 transition-all duration-300 ${t.cardBgHover}`}>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl`}
                      >
                        {domain.icon}
                      </div>
                      <div>
                        <h3 className={`h3 ${t.headingText} group-hover:text-color-1 transition-colors`}>
                          {domain.title}
                        </h3>
                        <p className="text-color-1 text-sm font-code">{domain.tagline}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`body-2 mb-6 line-clamp-2 ${t.bodyText}`}>
                      {domain.description}
                    </p>

                    {/* Key metric + link */}
                    <div className={`flex items-center justify-between pt-4 border-t ${t.dividerBorder}`}>
                      <div className="flex gap-4">
                        {domain.metrics.slice(0, 2).map((m, j) => (
                          <div key={j}>
                            <span className="text-color-1 font-bold text-lg">{m.value}</span>
                            <span className={`text-xs ml-1 ${t.bodyText}`}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-color-1 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View case study →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
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
                  className={`p-5 rounded-2xl border text-center ${t.cardBg} ${t.cardBorder}`}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className={`font-code text-sm mb-2 ${t.headingText}`}>{item.label}</h4>
                  <p className={`text-xs ${t.bodyText}`}>{item.desc}</p>
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

      <PageBottomCTA
        eyebrow="Bring this into your stack"
        title="From open pipelines to your production models"
        description="Every domain above is a working blueprint — training loop, evaluation harness, deployment script. Same shape scales to your data."
        primary={{ label: 'Talk to Engineering', href: '/contact?inquiry=training' }}
        secondary={{ label: 'See live HF deployments', href: '/#live-deployments' }}
      />
    </>
  );
};

export default AiTraining;
