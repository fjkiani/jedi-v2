import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import PageBottomCTA from '@/components/PageBottomCTA';
import SEO from '@/components/SEO';
import { JEDI_METHODOLOGY_STEPS } from '@/constants/methodology';
import { useTheme } from '@/context/ThemeContext';

// ─── Per-step live examples (use case slugs + tech slugs) ────────────────────
const STEP_EXAMPLES = {
  architect: {
    useCases: [
      { slug: 'ai-powered-research-assistant', title: 'AI Research Assistant' },
      { slug: 'healthcare-receptionist-clinical-operations', title: 'Healthcare Receptionist AI' },
    ],
    techs: [
      { slug: 'react', name: 'React' },
      { slug: 'langchain', name: 'LangChain' },
      { slug: 'figma', name: 'Figma' },
    ],
  },
  forge: {
    useCases: [
      { slug: 'gitlab-mlops-automation', title: 'GitLab MLOps Automation' },
      { slug: 'ai-powered-research-assistant', title: 'AI Research Assistant' },
    ],
    techs: [
      { slug: 'python', name: 'Python' },
      { slug: 'openai', name: 'OpenAI' },
      { slug: 'langchain', name: 'LangChain' },
    ],
  },
  awaken: {
    useCases: [
      { slug: 'ai-voice-operations-crm', title: 'Voice Operations CRM' },
      { slug: '24-7-voice-ai-customer-service', title: '24/7 Voice AI' },
    ],
    techs: [
      { slug: 'aws', name: 'AWS' },
      { slug: 'docker', name: 'Docker' },
      { slug: 'kubernetes', name: 'Kubernetes' },
    ],
  },
  evolve: {
    useCases: [
      { slug: 'gitlab-mlops-automation', title: 'GitLab MLOps Automation' },
      { slug: 'healthcare-receptionist-clinical-operations', title: 'Healthcare Receptionist AI' },
    ],
    techs: [
      { slug: 'mlflow', name: 'MLflow' },
      { slug: 'postgresql', name: 'PostgreSQL' },
    ],
  },
};

const MethodologyPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <SEO
        title="Methodology | JEDI Labs — How We Build Autonomous AI"
        description="The JEDI Labs methodology: Architect, Forge, Awaken, Evolve. Four phases that transform manual workflows into autonomous agentic systems."
        path="/methodology"
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <Heading
            title="The JEDI Methodology"
            as="h1"
            text="Four phases that transform manual workflows into autonomous agentic systems."
            className="mb-16 text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {JEDI_METHODOLOGY_STEPS.map((step, index) => {
              const Icon = step.icon;
              const examples = STEP_EXAMPLES[step.slug] || {};

              return (
                <motion.div
                  key={step.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`rounded-2xl border transition-all ${
                    isDarkMode
                      ? 'bg-n-7 border-n-6'
                      : 'bg-white border-n-3'
                  }`}>
                    {/* Main card — links to detail page */}
                    <Link
                      to={`/methodology/${step.slug}`}
                      className={`group block p-8 rounded-t-2xl hover:bg-white/5 transition-all`}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                          isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'
                        }`}>
                          {Icon && <Icon size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-mono uppercase tracking-widest ${
                              isDarkMode ? 'text-n-4' : 'text-n-5'
                            }`}>
                              Phase {step.number}
                            </span>
                            {step.status && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                                isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-5'
                              }`}>
                                {step.status}
                              </span>
                            )}
                          </div>
                          <h2 className={`h4 mb-1 group-hover:text-primary-1 transition-colors ${
                            isDarkMode ? 'text-n-1' : 'text-n-8'
                          }`}>
                            {step.title}
                          </h2>
                          <p className={`text-sm font-medium mb-3 ${
                            isDarkMode ? 'text-primary-1' : 'text-primary-1'
                          }`}>
                            {step.subtitle}
                          </p>
                          <p className={`text-sm line-clamp-3 ${
                            isDarkMode ? 'text-n-3' : 'text-n-5'
                          }`}>
                            {step.description}
                          </p>
                          {step.features?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {step.features.slice(0, 3).map(f => (
                                <span
                                  key={f}
                                  className={`text-xs px-2 py-1 rounded-md font-mono ${
                                    isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-5'
                                  }`}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Live examples strip */}
                    {(examples.useCases?.length > 0 || examples.techs?.length > 0) && (
                      <div className={`px-8 pb-6 pt-0 border-t ${
                        isDarkMode ? 'border-n-6' : 'border-n-3'
                      }`}>
                        <p className={`text-xs font-semibold uppercase tracking-widest mt-4 mb-3 ${
                          isDarkMode ? 'text-n-4' : 'text-n-5'
                        }`}>
                          Live Examples
                        </p>

                        {/* Use case links */}
                        {examples.useCases?.length > 0 && (
                          <div className="flex flex-col gap-1.5 mb-3">
                            {examples.useCases.map(uc => (
                              <Link
                                key={uc.slug}
                                to={`/use-cases/${uc.slug}`}
                                className={`group/uc flex items-center gap-2 text-xs transition-colors ${
                                  isDarkMode
                                    ? 'text-n-3 hover:text-primary-1'
                                    : 'text-n-5 hover:text-primary-1'
                                }`}
                              >
                                <FiZap className="shrink-0 text-yellow-400" />
                                {uc.title}
                                <FiArrowRight className="opacity-0 group-hover/uc:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Tech badges */}
                        {examples.techs?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {examples.techs.map(t => (
                              <Link
                                key={t.slug}
                                to={`/technology/${t.slug}`}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                  isDarkMode
                                    ? 'border-n-5 text-n-4 hover:border-primary-1/50 hover:text-primary-1'
                                    : 'border-n-3 text-n-5 hover:border-primary-1/50 hover:text-primary-1'
                                }`}
                              >
                                {t.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              See the methodology in action across our full use case library
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/use-cases"
                className="inline-flex items-center gap-2 text-sm bg-primary-1 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-1/90 transition-colors"
              >
                Browse Use Cases <FiArrowRight />
              </Link>
              <Link
                to="/explore"
                className={`inline-flex items-center gap-2 text-sm border font-semibold px-6 py-3 rounded-xl transition-colors ${
                  isDarkMode
                    ? 'border-n-5 text-n-3 hover:border-n-4 hover:text-n-1'
                    : 'border-n-3 text-n-5 hover:border-n-4 hover:text-n-8'
                }`}
              >
                Explore the Stack
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <PageBottomCTA
        eyebrow="Apply the methodology"
        title="Ship a working system, not a slide deck"
        description="Every engagement runs this 4-step loop end-to-end — Architect, Forge, Deploy, Evolve. Start with a scoped Discovery call."
        primary={{ label: 'Start Discovery', href: '/contact?inquiry=methodology' }}
        secondary={{ label: 'See pricing tiers', href: '/pricing' }}
      />
    </>
  );
};

export default MethodologyPage;
