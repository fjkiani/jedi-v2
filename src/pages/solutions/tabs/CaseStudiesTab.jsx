import React from 'react';
import { motion } from 'framer-motion';

const CaseStudiesTab = ({ solution }) => {
  return (
    <div className="space-y-12">
      {solution.caseStudies?.map((study, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="p-6 rounded-2xl bg-n-7 border border-n-6"
        >
          <h3 className="h4 mb-4">{study.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-n-3 mb-4">{study.description}</p>
              <ul className="space-y-2">
                {study.results.map((result, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-color-1 mr-2" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img 
                src={study.image} 
                alt={study.title}
                className="rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CaseStudiesTab; 