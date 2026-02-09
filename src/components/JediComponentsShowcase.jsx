import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { JediComponentCard } from './jedi';
import { getAgents } from '../services/agents';
import Button from './Button';
import { RingLoader } from 'react-spinners';
import { useTheme } from '@/context/ThemeContext';

const JediComponentsShowcase = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  return (
    <Section
      className="py-20 theme-bg-secondary"
      crosses
      id="jedi-showcase"
    >
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 rounded-full bg-n-7 border border-n-6 mb-4"
          >
            <span className="text-xs font-bold tracking-wider uppercase text-color-1">
              Active Duty
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h2 mb-6 theme-text-primary"
          >
            Agent Registry: Active Units
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-1 theme-text-secondary"
          >
            Deployed vertical super-intelligence units specialized for high-complexity domains.
            From oncology to enterprise operations, our agents don't just chat—they execute.
          </motion.p>
        </div>

        {/* Component Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={60} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {agents.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <JediComponentCard
                  component={unit}
                  variant="compact"
                  showCapabilities={true}
                  showProblem={false} // We focus on the agent itself
                  showUserExperience={false}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button href="/jedi" white>
            Access Full Registry
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};

export default JediComponentsShowcase;
