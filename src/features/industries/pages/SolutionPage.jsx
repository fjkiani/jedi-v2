import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { industriesList } from '@/constants/industry';

const SolutionPage = () => {
  const { industryId, solutionId } = useParams();
  const industry = industriesList[industryId];
  const solution = industry?.solutions.find(s => s.id === solutionId);

  if (!industry || !solution) {
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center">Solution Not Found</h1>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="overflow-hidden pt-[8rem]">
        <div className="container relative">
          {/* Breadcrumb */}
          <div className="text-n-3 mb-6 flex items-center gap-2">
            <Link to="/industries" className="hover:text-n-1">Industries</Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <Link to={`/industries/${industryId}`} className="hover:text-n-1">
              {industry.title}
            </Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <span className="text-n-1">{solution.title}</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[45rem]"
            >
              <h1 className="h1 mb-6 inline-block bg-clip-text text-transparent 
                bg-gradient-to-r from-primary-1 to-primary-2">
                {solution.title}
              </h1>
              <p className="body-1 text-n-3 mb-8">
                {solution.fullDescription}
              </p>
            </motion.div>
          </div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12"
          >
            {solution.metrics.map((metric, index) => (
              <div key={index} className="p-6 rounded-2xl bg-n-7 border border-n-6">
                <div className="h4 mb-2 text-primary-1">{metric.value}</div>
                <div className="text-n-3">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Technologies Section */}
      <Section>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="h3 mb-10">Technologies Used</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-n-7 border border-n-6 flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-1" />
                  <span className="text-n-1">{tech}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Case Studies Section */}
      {solution.caseStudies && (
        <Section>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="h3 mb-10">Case Studies</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {solution.caseStudies.map((caseStudy, index) => (
                  <Link
                    key={index}
                    to={caseStudy.link}
                    className="group p-6 rounded-2xl bg-n-7 border border-n-6 hover:border-primary-1 transition-colors"
                  >
                    <h4 className="h4 mb-4">{caseStudy.title}</h4>
                    <p className="body-2 text-n-3 mb-6">{caseStudy.description}</p>
                    <div className="flex flex-wrap gap-4">
                      {caseStudy.metrics.map((metric, i) => (
                        <span
                          key={i}
                          className="px-4 py-1 rounded-full bg-n-6 text-n-3 text-sm"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl" />
        <div className="absolute bottom-0 right-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-2/30 to-transparent blur-xl" />
      </div>
    </>
  );
};

export default SolutionPage;
