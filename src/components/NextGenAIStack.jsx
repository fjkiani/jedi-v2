import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { Link } from 'react-router-dom';
import { Icon } from "./Icon";
import { useTheme } from "@/context/ThemeContext";
import { hygraphClient } from "@/lib/hygraph";
import { GET_ALL_SOLUTIONS } from "@/graphql/queries/solutions";
import { motion } from "framer-motion";

const NextGenAIStack = () => {
  const { isDarkMode } = useTheme();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await hygraphClient.request(GET_ALL_SOLUTIONS);
        setSolutions(data.categories || []);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <Section className="overflow-hidden">
        <div className="container relative z-2 text-center py-20">
          <div className="inline-flex items-center gap-2 text-primary-1 animate-pulse">
            <span className="w-2 h-2 bg-primary-1 rounded-full" />
            <span className="font-mono text-sm tracking-widest uppercase">Initializing Zeta Deck...</span>
          </div>
        </div>
      </Section>
    );
  }

  // Fallback if no data
  if (solutions.length === 0) return null;

  return (
    <Section className="overflow-hidden" id="next-gen-ai">
      <div className="container relative z-2">
        <div className="flex flex-col items-center mb-12 lg:mb-20">
          <div className="tagline mb-4 flex items-center gap-2">
            <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-n-3' : 'bg-n-6'}`}></span>
            <span className="text-xs font-code uppercase tracking-widest text-n-4">System Capabilities</span>
            <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-n-3' : 'bg-n-6'}`}></span>
          </div>
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center"
            title="Next Gen AI Stack"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => {
            const moduleCount = solution.technologies?.length || 0;

            return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group h-full cursor-pointer`}
              >
                <Link to={`/solutions/${solution.slug}`} className="block h-full">
                  <div className={`h-full p-6 rounded-[20px] border transition-all duration-300 relative overflow-hidden flex flex-col
                    ${isDarkMode
                      ? 'bg-n-8/50 border-n-6 hover:border-primary-1/50 hover:bg-n-8'
                      : 'bg-white border-n-3 hover:border-primary-1/50 hover:bg-white hover:shadow-xl'
                    }`}
                  >
                    {/* Header: Icon & Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
                        ${isDarkMode ? 'bg-n-7 group-hover:bg-primary-1/20' : 'bg-n-2 group-hover:bg-primary-1/10'}`}>
                        <Icon
                          name={solution.icon || 'cpu'}
                          className={`w-6 h-6 transition-colors duration-300 ${isDarkMode ? 'text-n-1' : 'text-n-8'} group-hover:text-primary-1`}
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Status</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-n-8'}`}>ONLINE</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-8 flex-grow">
                      <h4 className={`h4 mb-3 transition-colors duration-300 group-hover:text-primary-1`}>
                        {solution.name}
                      </h4>
                      <p className={`body-2 text-sm line-clamp-3 ${isDarkMode ? 'text-n-4 group-hover:text-n-3' : 'text-n-6 group-hover:text-n-5'}`}>
                        {solution.description}
                      </p>
                    </div>

                    {/* Footer: Metrics & Action */}
                    <div className="pt-6 mt-auto border-t border-n-6/10 flex items-center justify-between group-hover:border-primary-1/20 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-0.5">Modules</span>
                        <span className="text-sm font-bold">{moduleCount > 0 ? moduleCount : 'Core'}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300
                        ${isDarkMode
                          ? 'border-n-6 text-n-1 group-hover:border-primary-1 group-hover:bg-primary-1'
                          : 'border-n-3 text-n-8 group-hover:border-primary-1 group-hover:bg-primary-1 group-hover:text-white'
                        }`}>
                        <Arrow className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Holographic Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-1/0 via-primary-1/0 to-primary-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 -z-1 pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary-1/10 to-transparent blur-[100px]" />
        </div>
      </div>

      {/* Global Style to hide scrollbar if used */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Section>
  );
};

export default NextGenAIStack;