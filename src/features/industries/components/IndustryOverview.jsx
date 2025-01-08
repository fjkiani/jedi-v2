import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { industriesList } from '@/constants/industry';

const IndustryOverview = () => {
  // Filter active and coming soon industries
  const activeIndustries = industriesList.filter(industry => 
    ['financial', 'healthcare'].includes(industry.id)
  );

  const comingSoonIndustries = [
    {
      id: 'manufacturing',
      title: 'Education',
      description: 'Knowledge Graphs solutions powered by AI Agents',
      icon: 'tool',
      color: 'from-[#FF6B6B] to-[#FF8E8E]',
      comingSoon: true
    },
    {
      id: 'retail',
      title: 'Retail & E-commerce',
      description: 'AI-driven retail optimization and customer experience',
      icon: 'chart',
      color: 'from-[#4ECDC4] to-[#6EE7E7]',
      comingSoon: true
    }
    
  ];

  const allIndustries = [...activeIndustries, ...comingSoonIndustries];

  return (
    <Section className="relative overflow-hidden bg-n-8/90 backdrop-blur-sm">
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="h2 mb-4">Industries We Transform</h2>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Discover how our AI solutions revolutionize different industries
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-2">
          {allIndustries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {industry.comingSoon ? (
                // Coming Soon Card
                <div className="block p-6 rounded-2xl bg-n-7 border border-n-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${industry.color} 
                    flex items-center justify-center opacity-60`}>
                    <Icon name={industry.icon} className="w-6 h-6 text-n-1" />
                  </div>

                  {/* Title */}
                  <h4 className="h4 mb-2 opacity-60">{industry.title}</h4>
                  
                  {/* Description */}
                  <p className="body-2 text-n-3 mb-4 line-clamp-2 opacity-60">
                    {industry.description}
                  </p>

                  {/* Coming Soon Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-1/10 border border-primary-1/20">
                    <span className="text-sm font-medium text-primary-1">Coming Soon</span>
                  </div>
                </div>
              ) : (
                // Active Industry Card
                <Link 
                  to={`/industries/${industry.id}`}
                  className="group block p-6 rounded-2xl bg-n-7 border border-n-6 
                    hover:border-primary-1 transition-colors duration-300"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${industry.color} 
                    flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                    <Icon name={industry.icon} className="w-6 h-6 text-n-1" />
                  </div>

                  {/* Title */}
                  <h4 className="h4 mb-2">{industry.title}</h4>
                  
                  {/* Description */}
                  <p className="body-2 text-n-3 mb-4 line-clamp-2">
                    {industry.description}
                  </p>

                  {/* Key Solutions */}
                  <div className="space-y-2">
                    {industry.solutions?.slice(0, 2).map((solution, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-1" />
                        <span className="text-sm text-n-3">{solution.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More */}
                  <div className="mt-4 flex items-center gap-2 text-primary-1">
                    <span className="text-sm font-medium">Learn More</span>
                    <Icon name="arrow-right" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 relative z-2"
        >
          <Link 
            to="/industries"
            className="button button-primary"
          >
            View All Industries
          </Link>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/20 to-transparent blur-lg pointer-events-none" />
      </div>
    </Section>
  );
};

export default IndustryOverview; 