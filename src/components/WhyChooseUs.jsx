import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { logo } from '../assets';
import { Helmet } from 'react-helmet-async';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const WhyChooseUs = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const [activeMetric, setActiveMetric] = useState(0);

  // Scroll animations
  const headerAnimation = useScrollAnimation({ animationType: 'fadeIn', delay: 0 });
  const contentAnimation = useScrollAnimation({ animationType: 'slideInUp', delay: 300 });
  const footerAnimation = useScrollAnimation({ animationType: 'fadeInScale', delay: 600 });

  // Real industry metrics and value propositions with consistent icons
  const valuePropositions = [
    {
      category: "Proven Results",
      icon: "📈",
      title: "Measurable Business Impact",
      description: "Our AI solutions deliver quantifiable results across industries with documented ROI.",
      realMetrics: [
        { industry: "Healthcare", result: "40% reduction in diagnostic time", context: "Medical imaging analysis", icon: "🏥" },
        { industry: "Financial Services", result: "99.7% fraud detection accuracy", context: "Real-time transaction monitoring", icon: "🏦" },
        { industry: "Manufacturing", result: "70% reduction in equipment downtime", context: "Predictive maintenance systems", icon: "🏭" },
        { industry: "Retail", result: "35% inventory cost reduction", context: "AI-powered demand forecasting", icon: "🛒" }
      ],
      seoKeywords: ["AI ROI", "measurable AI results", "AI business impact", "proven AI solutions"]
    },
    {
      category: "Technical Excellence",
      icon: "⚡",
      title: "JEDI AI Platform Architecture",
      description: "Our JEDI™ platform combines multiple AI engines for superior performance.",
      realMetrics: [
        { component: "JEDI Ensemble™", capability: "Multi-model AI fusion", performance: "99.9% accuracy", icon: "🧠" },
        { component: "JEDI Rules™", capability: "Intelligent decision orchestration", performance: "<100ms response", icon: "⚙️" },
        { component: "JEDI AutoTune™", capability: "Self-optimizing algorithms", performance: "Continuous learning", icon: "🔧" },
        { component: "ProteinBind™", capability: "Molecular interaction prediction", performance: "Drug discovery acceleration", icon: "🧬" }
      ],
      seoKeywords: ["JEDI AI platform", "proprietary AI technology", "AI ensemble methods", "custom AI architecture"]
    },
    {
      category: "Industry Specialization",
      icon: "🎯",
      title: "Deep Domain Expertise",
      description: "We understand your industry's unique challenges, regulations, and compliance requirements.",
      realMetrics: [
        { domain: "Healthcare", expertise: "HIPAA compliance", specialization: "Clinical decision support", icon: "🏥" },
        { domain: "Financial Services", expertise: "SOC 2 certified", specialization: "Real-time fraud prevention", icon: "🏦" },
        { domain: "Education", expertise: "FERPA compliant", specialization: "Personalized learning paths", icon: "🎓" },
        { domain: "Manufacturing", expertise: "IoT integration", specialization: "Predictive maintenance", icon: "🏭" }
      ],
      seoKeywords: ["industry-specific AI", "AI compliance", "domain expertise", "specialized AI solutions"]
    },
    {
      category: "Implementation Speed",
      icon: "🚀",
      title: "Rapid Time-to-Value",
      description: "Get results in weeks, not years, with our battle-tested implementation methodology.",
      realMetrics: [
        { phase: "Discovery & Design", duration: "2-3 weeks", deliverable: "Technical architecture", icon: "🔍" },
        { phase: "MVP Development", duration: "4-6 weeks", deliverable: "Working prototype", icon: "🛠️" },
        { phase: "Production Deployment", duration: "2-4 weeks", deliverable: "Live system", icon: "🌐" },
        { phase: "Optimization & Scale", duration: "Ongoing", deliverable: "Performance improvements", icon: "📊" }
      ],
      seoKeywords: ["fast AI implementation", "rapid AI deployment", "quick AI results", "AI time to market"]
    },
    {
      category: "Security & Compliance",
      icon: "🛡️",
      title: "Enterprise-Grade Security",
      description: "Your data stays protected with bank-level security and industry compliance standards.",
      realMetrics: [
        { standard: "SOC 2 Type II", status: "Certified", scope: "Data processing & storage", icon: "✅" },
        { standard: "HIPAA", status: "Compliant", scope: "Healthcare data handling", icon: "🏥" },
        { standard: "GDPR", status: "Compliant", scope: "EU data protection", icon: "🇪🇺" },
        { standard: "ISO 27001", status: "Aligned", scope: "Information security management", icon: "🔒" }
      ],
      seoKeywords: ["secure AI", "compliant AI solutions", "enterprise AI security", "data protection AI"]
    },
    {
      category: "Partnership Approach",
      icon: "🤝",
      title: "Long-Term Success Partnership",
      description: "We're invested in your success with ongoing support, training, and optimization.",
      realMetrics: [
        { metric: "Client Retention Rate", value: "95%", context: "Multi-year partnerships", icon: "📈" },
        { metric: "Support Response Time", value: "<2 hours", context: "Critical issues", icon: "⏱️" },
        { metric: "Training Programs", value: "100+", context: "Team enablement sessions", icon: "🎓" },
        { metric: "Success Reviews", value: "Monthly", context: "Performance optimization", icon: "📅" }
      ],
      seoKeywords: ["AI partnership", "AI support", "AI training", "long-term AI success"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const activeProposition = valuePropositions[activeMetric];

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "JEDI Labs AI Solutions",
    "provider": {
      "@type": "Organization",
      "name": "JEDI Labs",
      "url": "https://jedilabs.org",
      "logo": "https://jedilabs.org/logo.png"
    },
    "description": "Enterprise AI solutions with proven business impact, rapid implementation, and industry-specific expertise",
    "serviceType": "Artificial Intelligence Solutions",
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Solutions",
      "itemListElement": valuePropositions.map((prop, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": prop.title,
          "description": prop.description,
          "category": prop.category
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50",
      "bestRating": "5"
    }
  };

  return (
    <>
      <Helmet>
        <title>Why Choose JEDI Labs | Enterprise AI Solutions with Proven Results</title>
        <meta 
          name="description" 
          content="Discover why businesses choose JEDI Labs for AI solutions. Proven results with 40% faster diagnostics, 99.7% fraud detection accuracy, and rapid 2-3 week implementation." 
        />
        <meta 
          name="keywords" 
          content="JEDI Labs AI, enterprise AI solutions, proven AI results, rapid AI implementation, AI business impact, JEDI platform, AI compliance, industry-specific AI" 
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <section className={`py-16 lg:py-20 ${className}`} id="why-choose-jedi-labs">
        <div className="container mx-auto px-4">
          {/* SEO-Optimized Header */}
          <motion.header
            ref={headerAnimation.ref}
            className={`text-center mb-12 ${headerAnimation.animationClasses}`}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <img src={logo} alt="JEDI Labs AI Solutions Logo" className="w-6 h-6 brightness-0 invert" />
              </div>
              <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-starjedi">jedi labs?</span>
              </h1>
            </div>
            <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
              We deliver <strong>proven AI solutions</strong> with measurable business impact across industries. 
              Our proprietary <strong>JEDI™ platform</strong> and deep domain expertise ensure rapid implementation 
              and long-term success for your AI initiatives.
            </p>
          </motion.header>

          {/* Interactive Value Propositions Grid */}
          <div ref={contentAnimation.ref} className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 ${contentAnimation.animationClasses}`}>
            {/* Navigation Tabs */}
            <motion.nav
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-1"
              role="tablist"
              aria-label="JEDI Labs value propositions"
            >
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Our Differentiators</h2>
              <div className="space-y-2">
                {valuePropositions.map((prop, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => setActiveMetric(index)}
                    role="tab"
                    aria-selected={activeMetric === index}
                    aria-controls={`panel-${index}`}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      activeMetric === index
                        ? `bg-gradient-to-r ${isDarkMode ? 'from-purple-900/20 to-pink-900/20 border-2 border-purple-700' : 'from-purple-50 to-pink-50 border-2 border-purple-200'}`
                        : `border transition-colors ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-purple-700' : 'bg-white border-n-3 hover:border-purple-200'}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                        activeMetric === index
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : isDarkMode ? 'bg-n-6' : 'bg-n-2'
                      }`}>
                        <span className={activeMetric === index ? 'grayscale-0' : 'grayscale'}>
                          {prop.icon}
                        </span>
                      </div>
                      <div>
                        <div className={`font-medium text-sm uppercase tracking-wide ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                          {prop.category}
                        </div>
                        <div className={`font-semibold text-base ${
                          activeMetric === index 
                            ? isDarkMode ? 'text-purple-300' : 'text-purple-700'
                            : isDarkMode ? 'text-n-1' : 'text-n-8'
                        }`}>
                          {prop.title}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.nav>

            {/* Active Proposition Details */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeMetric}
                  id={`panel-${activeMetric}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeMetric}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl p-6 border shadow-lg ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-n-8 to-n-7 border-n-6' 
                      : 'bg-gradient-to-br from-white to-n-1 border-n-3'
                  }`}
                >
                  {/* Header */}
                  <header className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                      {activeProposition.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-medium uppercase tracking-wide ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {activeProposition.category}
                      </div>
                      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {activeProposition.title}
                      </h3>
                    </div>
                  </header>

                  <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                    {activeProposition.description}
                  </p>

                  {/* Real Metrics Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeProposition.realMetrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-lg p-3 border ${
                          isDarkMode ? 'bg-n-6 border-n-5' : 'bg-white border-n-3'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">{metric.icon}</span>
                          <div className="flex-1">
                            {/* Dynamic content based on metric structure */}
                            {metric.industry && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.industry}
                                </div>
                                <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.result}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.context}
                                </div>
                              </>
                            )}
                            {metric.component && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.component}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.capability}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.performance}
                                </div>
                              </>
                            )}
                            {metric.domain && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.domain}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.expertise}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.specialization}
                                </div>
                              </>
                            )}
                            {metric.phase && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.phase}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.duration}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.deliverable}
                                </div>
                              </>
                            )}
                            {metric.standard && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.standard}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.status}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.scope}
                                </div>
                              </>
                            )}
                            {metric.metric && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.metric}
                                </div>
                                <div className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.value}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.context}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          {/* SEO-Optimized Bottom CTA */}
          <motion.footer
            ref={footerAnimation.ref}
            className={`text-center ${footerAnimation.animationClasses}`}
          >
            <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-full border ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700' 
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
            }`}>
              <img src={logo} alt="JEDI Labs AI Platform Logo" className="w-6 h-6" />
              <span className={`font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                Ready to experience measurable AI results?
              </span>
            </div>
            <p className={`mt-3 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Join industry leaders who trust JEDI Labs for enterprise AI solutions
            </p>
          </motion.footer>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;