import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { getAllSolutions } from '@/constants/solutions/index';

const NextGenAIStack = () => {
  const solutions = getAllSolutions();

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <div className="max-w-[43.75rem] mb-[6.5rem] md:mb-20 lg:mb-[6.5rem]">
          <h2 className="h2 mb-6">
            Next Generation AI Stack
          </h2>
          <p className="body-1 text-n-3">
            Explore our comprehensive suite of AI solutions designed to transform your business operations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link 
                to={`/solutions/${solution.id}`}
                className="block p-8 rounded-[2rem] bg-n-7 border border-n-6 
                         transition-colors hover:border-n-5"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="h4">{solution.title}</h3>
                  <Icon name="arrow-right" className="w-6 h-6 text-n-3 
                        transition-colors group-hover:text-primary-1" />
                </div>
                
                <p className="text-n-3 mb-8">
                  {solution.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-n-3">Key Features:</h4>
                  <ul className="space-y-3">
                    {solution.businessValue.capabilities.slice(0, 3).map((capability, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Icon name="check" className="w-5 h-5 text-primary-1 mt-1" />
                        <span className="text-n-3">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default NextGenAIStack; 