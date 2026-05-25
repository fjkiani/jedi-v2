import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import SEO from '@/components/SEO';
import { JEDI_METHODOLOGY_STEPS } from '@/constants/methodology';
import { useTheme } from '@/context/ThemeContext';

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
            text="Four phases that transform manual workflows into autonomous agentic systems."
            className="mb-16 text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {JEDI_METHODOLOGY_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/methodology/${step.slug}`}
                    className={`group block rounded-2xl p-8 border transition-all hover:border-primary-1/50 ${
                      isDarkMode
                        ? 'bg-n-7 border-n-6 hover:bg-n-6'
                        : 'bg-white border-n-3 hover:shadow-md'
                    }`}
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
};

export default MethodologyPage;
