/**
 * Enhanced JEDI Page - Interactive showcase with tabbed interface
 * 
 * This page showcases JEDI components with:
 * - Tabbed interface for organized content
 * - Co-pilot integration for AI exploration
 * - Interactive architecture diagrams
 * - Technology showcase with links
 * - Implementation timeline
 * - Success metrics and real implementations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Section from '../components/Section';
import { 
  JediComponentCard,
  JediComparisonTable,
  JediImplementationCard,
  ALL_JEDI_COMPONENTS,
  getAllJediImplementations
} from '../components/jedi';
import {
  JediTabbedInterface,
  JediArchitectureDiagram,
  JediMetricsCard,
  JediTechnologyBadge,
  JediImplementationTimeline,
  JediQueryInterface
} from '../components/jedi/enhanced';
import { Helmet } from 'react-helmet-async';
import { 
  FiCpu, FiSettings, FiZap, FiUsers, FiTrendingUp, 
  FiCheckCircle, FiPlay, FiArrowRight, FiStar 
} from 'react-icons/fi';

const JediPageEnhanced = () => {
  const { isDarkMode } = useTheme();
  const [selectedComponent, setSelectedComponent] = useState(ALL_JEDI_COMPONENTS[0]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const allImplementations = getAllJediImplementations();
  const componentImplementations = allImplementations.filter(impl => 
    impl.componentId === selectedComponent?.id
  );

  // Suggested queries for co-pilot integration
  const suggestedQueries = [
    "How do JEDI components work together?",
    "Show me real client success stories",
    "What's the ROI of JEDI implementation?",
    "How does JEDI compare to other AI solutions?",
    "What industries benefit most from JEDI?",
    "How quickly can we implement JEDI?"
  ];

  // Technology stack used by JEDI components
  const jediTechnologies = [
    { id: 'openai', name: 'OpenAI GPT', slug: 'openai-gpt', icon: '/assets/stack/openai.png' },
    { id: 'anthropic', name: 'Anthropic Claude', slug: 'anthropic-claude', icon: '/assets/stack/anthropic.png' },
    { id: 'langchain', name: 'LangChain', slug: 'langchain', icon: '/assets/stack/langchain.png' },
    { id: 'weaviate', name: 'Weaviate', slug: 'weaviate', icon: '/assets/stack/weaviate.png' },
    { id: 'huggingface', name: 'Hugging Face', slug: 'hugging-face', icon: '/assets/stack/huggingface.png' },
    { id: 'postgresql', name: 'PostgreSQL', slug: 'postgresql', icon: '/assets/stack/postgresql.png' },
    { id: 'mongodb', name: 'MongoDB', slug: 'mongodb', icon: '/assets/stack/mongodb.png' },
    { id: 'docker', name: 'Docker', slug: 'docker', icon: '/assets/stack/docker.png' }
  ];

  // Implementation phases
  const implementationPhases = [
    {
      title: "Discovery & Planning",
      duration: "1-2 weeks",
      description: "Understand your business needs and design the optimal JEDI solution",
      deliverables: [
        "Business requirements analysis",
        "Technical architecture design",
        "Implementation roadmap",
        "Success metrics definition"
      ],
      technologies: ["JEDI Ensemble", "JEDI Rules", "JEDI AutoTune"],
      successMetrics: [
        { label: "Requirements Clarity", value: "100%" },
        { label: "Architecture Approval", value: "95%" }
      ]
    },
    {
      title: "Development & Integration",
      duration: "2-4 weeks",
      description: "Build and integrate JEDI components with your existing systems",
      deliverables: [
        "JEDI component configuration",
        "API integrations",
        "Data pipeline setup",
        "Security implementation"
      ],
      technologies: ["OpenAI", "LangChain", "Weaviate", "PostgreSQL"],
      successMetrics: [
        { label: "Integration Success", value: "98%" },
        { label: "Performance Target", value: "95%" }
      ]
    },
    {
      title: "Testing & Optimization",
      duration: "1-2 weeks",
      description: "Comprehensive testing and performance optimization",
      deliverables: [
        "End-to-end testing",
        "Performance optimization",
        "Security audit",
        "User acceptance testing"
      ],
      technologies: ["JEDI AutoTune", "Docker", "Monitoring Tools"],
      successMetrics: [
        { label: "Test Coverage", value: "95%" },
        { label: "Performance Improvement", value: "40%" }
      ]
    },
    {
      title: "Deployment & Launch",
      duration: "1 week",
      description: "Deploy to production and launch with your team",
      deliverables: [
        "Production deployment",
        "Team training",
        "Documentation delivery",
        "Go-live support"
      ],
      technologies: ["Kubernetes", "Monitoring", "Backup Systems"],
      successMetrics: [
        { label: "Deployment Success", value: "100%" },
        { label: "Team Adoption", value: "90%" }
      ]
    },
    {
      title: "Monitoring & Optimization",
      duration: "Ongoing",
      description: "Continuous monitoring and optimization for peak performance",
      deliverables: [
        "Performance monitoring",
        "Continuous optimization",
        "Regular updates",
        "24/7 support"
      ],
      technologies: ["JEDI AutoTune", "Analytics", "Support Tools"],
      successMetrics: [
        { label: "Uptime", value: "99.9%" },
        { label: "Client Satisfaction", value: "98%" }
      ]
    }
  ];

  // Success metrics
  const successMetrics = [
    { label: "Client Success Rate", value: "95%", icon: "success", trend: 5 },
    { label: "Average ROI", value: "300%", icon: "revenue", trend: 15 },
    { label: "Implementation Speed", value: "4x faster", icon: "speed", trend: 20 },
    { label: "Client Satisfaction", value: "98%", icon: "users", trend: 3 }
  ];

  // Tab content
  const tabs = [
    {
      name: "Overview",
      icon: FiCpu,
      content: (
        <div className="space-y-8">
          {/* What is JEDI */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' 
              : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              What is JEDI?
            </h3>
            <p className={`text-base mb-4 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              JEDI (Just Enough Data Intelligence) is a comprehensive AI platform that combines three powerful components 
              to solve any business problem without requiring technical expertise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ALL_JEDI_COMPONENTS.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-n-6 border-n-5 hover:border-primary-1/50' 
                      : 'bg-n-2 border-n-3 hover:border-primary-1/50'
                  } transition-all hover:shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {component.id === 'jedi-ensemble' && <FiCpu className="text-purple-500 text-xl" />}
                    {component.id === 'jedi-rules' && <FiSettings className="text-green-500 text-xl" />}
                    {component.id === 'jedi-automate' && <FiZap className="text-orange-500 text-xl" />}
                    <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {component.name}
                    </h4>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {component.tagline}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <JediMetricsCard
            title="JEDI Success Metrics"
            metrics={successMetrics}
            variant="success"
          />

          {/* Technology Stack */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-n-7 to-n-8 border-n-6' 
              : 'bg-gradient-to-br from-n-1 to-n-2 border-n-3'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Technology Stack
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              JEDI is built on enterprise-grade technologies that ensure reliability, scalability, and security.
            </p>
            <JediTechnologyBadge
              technologies={jediTechnologies}
              variant="outline"
              size="md"
            />
          </div>
        </div>
      )
    },
    {
      name: "How It Works",
      icon: FiSettings,
      content: (
        <div className="space-y-8">
          <JediArchitectureDiagram 
            showDetails={true}
            interactive={true}
          />
        </div>
      )
    },
    {
      name: "Success Stories",
      icon: FiUsers,
      content: (
        <div className="space-y-8">
          {/* Filter Options */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-primary-1 text-white'
                : 'bg-primary-1 text-white'
            }`}>
              All Stories ({allImplementations.length})
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-n-6 text-n-2 hover:bg-n-5'
                : 'bg-n-2 text-n-7 hover:bg-n-3'
            }`}>
              Healthcare (3)
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-n-6 text-n-2 hover:bg-n-5'
                : 'bg-n-2 text-n-7 hover:bg-n-3'
            }`}>
              Financial Services (2)
            </button>
            <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-n-6 text-n-2 hover:bg-n-5'
                : 'bg-n-2 text-n-7 hover:bg-n-3'
            }`}>
              Technology (4)
            </button>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {allImplementations.slice(0, 6).map((implementation, index) => (
              <motion.div
                key={implementation.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JediImplementationCard
                  implementation={implementation}
                  variant="detailed"
                  showTechnicalDetails={true}
                  showBusinessImpact={true}
                  showScalability={true}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: "Getting Started",
      icon: FiPlay,
      content: (
        <div className="space-y-8">
          <JediImplementationTimeline
            phases={implementationPhases}
            variant="detailed"
            interactive={true}
          />
        </div>
      )
    },
    {
      name: "Explore with AI",
      icon: FiTrendingUp,
      content: (
        <JediQueryInterface
          queries={suggestedQueries.map((query, index) => ({
            id: index,
            text: query,
            type: 'general',
            category: 'exploration',
            description: 'Get AI-powered insights about JEDI capabilities'
          }))}
          categories={[
            { key: 'exploration', name: 'General Exploration' },
            { key: 'implementation', name: 'Implementation' },
            { key: 'success', name: 'Success Stories' },
            { key: 'comparison', name: 'Comparisons' }
          ]}
          onQuerySelect={setSelectedQuery}
          variant="grid"
        />
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>JEDI AI Components - Smart AI Solutions | JEDI Labs</title>
        <meta name="description" content="Explore JEDI's three powerful AI components: Ensemble, Rules, and Automate. See how they solve real business problems with measurable results." />
        <meta name="keywords" content="JEDI, AI components, Ensemble, Rules, Automate, business automation, AI solutions" />
      </Helmet>

      <div className="min-h-screen theme-bg-primary">
        {/* Enhanced Hero Section */}
        <Section className="pt-32 pb-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <FiStar className="text-primary-1 text-2xl" />
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                  Enterprise AI Platform
                </span>
              </div>
              <h1 className="h1 mb-6 theme-text-primary">
                JEDI AI Components
              </h1>
              <p className="h3 mb-4 theme-text-secondary">
                Three powerful AI components that work together to solve any business problem
              </p>
              <p className="body-1 theme-text-secondary mb-8 max-w-3xl mx-auto">
                No technical expertise required - just tell us what you need and we handle the rest. 
                See how our JEDI components have helped businesses achieve real, measurable results.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
                  <div className="text-2xl font-bold text-primary-1">95%</div>
                  <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Success Rate</div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
                  <div className="text-2xl font-bold text-primary-1">300%</div>
                  <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Average ROI</div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
                  <div className="text-2xl font-bold text-primary-1">50+</div>
                  <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Happy Clients</div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
                  <div className="text-2xl font-bold text-primary-1">4x</div>
                  <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>Faster Implementation</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-primary flex items-center gap-2">
                  <FiPlay className="w-4 h-4" />
                  Get Started
                </Link>
                <Link to="/solutions" className="btn-secondary flex items-center gap-2">
                  <FiArrowRight className="w-4 h-4" />
                  View All Solutions
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Tabbed Interface */}
        <Section className="py-20">
          <div className="container">
            <JediTabbedInterface
              tabs={tabs}
              suggestedQueries={suggestedQueries}
              onQuerySelect={setSelectedQuery}
              showCoPilot={true}
            />
          </div>
        </Section>

        {/* Call to Action */}
        <Section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center bg-gradient-to-r from-primary-1 to-purple-600 rounded-2xl p-12 text-white"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90 text-white">
                See how our JEDI components can solve your specific business challenges 
                with real, measurable results. No technical expertise required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-white text-primary-1 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Schedule Consultation
                </Link>
                <Link
                  to="/solutions"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-1 transition-colors"
                >
                  View All Solutions
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default JediPageEnhanced;
