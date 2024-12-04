import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Link } from 'react-router-dom';
import Arrow from '../assets/svg/Arrow';

const caseStudies = [
  {
    title: "AI-Powered Customer Service",
    client: "Fortune 500 Retailer",
    metrics: [
      { value: "45%", label: "reduction in response time" },
      { value: "92%", label: "customer satisfaction" },
      { value: "$2.4M", label: "annual savings" }
    ],
    image: "/images/case-studies/retail.jpg",
    slug: "retail-customer-service",
    color: "blue"
  },
  // Add more case studies
];

const CaseStudies = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="h2 mb-4 inline-block bg-clip-text text-transparent 
            bg-gradient-to-r from-primary-1 to-n-1">
            Success Stories
          </h2>
          <p className="body-1 text-n-3 md:max-w-md lg:max-w-2xl mx-auto">
            See how we've helped organizations achieve extraordinary results
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.7,
                ease: "easeOut"
              }}
            >
              <Link 
                to={`/case-studies/${study.slug}`}
                className="group block relative rounded-3xl overflow-hidden"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-[400px] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-n-8/95 to-n-8/75 
                      mix-blend-multiply group-hover:from-n-8/90 group-hover:to-n-8/70 
                      transition-colors duration-700" />
                    <img 
                      src={study.image} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col">
                  <motion.div 
                    className="mb-auto"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="h4 mb-4 text-n-1">{study.title}</h3>
                    <p className="text-n-3">{study.client}</p>
                  </motion.div>

                  <div>
                    <div className="mb-8 space-y-4">
                      {study.metrics.map((metric, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-baseline gap-4"
                        >
                          <span className="text-2xl font-bold text-primary-1">
                            {metric.value}
                          </span>
                          <span className="text-n-3">{metric.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-n-1">
                      <motion.span 
                        className="font-bold relative"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        READ CASE STUDY
                        <span className="absolute left-0 right-0 bottom-0 h-px bg-primary-1 
                          transform origin-left scale-x-0 transition-transform duration-500 
                          group-hover:scale-x-100" />
                      </motion.span>
                      <Arrow className="transition-transform duration-300 
                        group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default CaseStudies; 