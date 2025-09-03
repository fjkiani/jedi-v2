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

  // Startup-focused value propositions with clear benefits
  const valuePropositions = [
    {
      category: "Startup Success",
      icon: "🚀",
      title: "Launch Faster, Scale Smarter",
      description: "Turn your startup idea into a successful business with AI tools that give you enterprise-level capabilities from day one.",
      realMetrics: [
        { benefit: "Faster Product Launch", result: "3x quicker time to market", context: "AI-powered development tools", icon: "⚡" },
        { benefit: "Better Customer Insights", result: "40% higher conversion rates", context: "Smart analytics and personalization", icon: "📊" },
        { benefit: "Automated Operations", result: "60% less manual work", context: "AI handles routine tasks", icon: "🤖" },
        { benefit: "Competitive Advantage", result: "Stand out from competitors", context: "Advanced AI capabilities", icon: "🏆" }
      ],
      seoKeywords: ["startup AI tools", "launch faster", "startup success", "AI for small business"]
    },
    {
      category: "AI Made Simple",
      icon: "🧠",
      title: "No AI Expertise Required",
      description: "We handle the complex AI technology so you can focus on building your business. No PhD in machine learning needed.",
      realMetrics: [
        { tool: "Smart Chatbots", capability: "24/7 customer support", benefit: "Never miss a lead", icon: "💬" },
        { tool: "Predictive Analytics", capability: "Forecast trends", benefit: "Make better decisions", icon: "🔮" },
        { tool: "Automated Marketing", capability: "Personalized campaigns", benefit: "Higher engagement", icon: "📧" },
        { tool: "Data Analysis", capability: "Understand your customers", benefit: "Grow your revenue", icon: "📈" }
      ],
      seoKeywords: ["simple AI", "no-code AI", "AI for beginners", "easy AI tools"]
    },
    {
      category: "Cost Effective",
      icon: "💰",
      title: "Startup-Friendly Pricing",
      description: "Get enterprise-level AI capabilities without enterprise-level costs. Pay only for what you use as you grow.",
      realMetrics: [
        { cost: "Setup Cost", amount: "From $1000", context: "Milestone payments", icon: "💰" },
        { cost: "Support Cost", amount: "Starting at $100", context: "Scale as you grow", icon: "📅" },
        { cost: "ROI Timeline", amount: "2-3 months", context: "See results quickly", icon: "⏰" },
        { cost: "Support Included", amount: "Always free", context: "We're here to help", icon: "🤝" }
      ],
      seoKeywords: ["affordable AI", "startup pricing", "cost-effective AI", "budget-friendly AI"]
    },
    {
      category: "Quick Setup",
      icon: "⚡",
      title: "Get Started in Days, Not Months",
      description: "Our streamlined process gets your AI tools up and running quickly so you can start seeing results immediately.",
      realMetrics: [
        { step: "Initial Setup", time: "1-2 days", deliverable: "AI tools configured", icon: "🛠️" },
        { step: "Data Integration", time: "2-3 days", deliverable: "Your data connected", icon: "🔗" },
        { step: "Training & Testing", time: "3-5 days", deliverable: "AI learning your business", icon: "🎓" },
        { step: "Go Live", time: "1 week total", deliverable: "AI working for you", icon: "🎉" }
      ],
      seoKeywords: ["quick AI setup", "fast implementation", "rapid deployment", "quick results"]
    },
    {
      category: "Growth Support",
      icon: "📈",
      title: "Grow With You",
      description: "As your startup grows, our AI solutions scale with you. No need to rebuild or start over as you expand.",
      realMetrics: [
        { stage: "Early Stage", support: "Basic AI tools", benefit: "Get started quickly", icon: "🌱" },
        { stage: "Growth Phase", support: "Advanced features", benefit: "Handle more customers", icon: "📊" },
        { stage: "Scale Up", support: "Enterprise features", benefit: "Compete with big players", icon: "🚀" },
        { stage: "Success", support: "Custom solutions", benefit: "Stay ahead of competition", icon: "🏆" }
      ],
      seoKeywords: ["scalable AI", "grow with AI", "startup scaling", "AI growth support"]
    },
    {
      category: "Expert Guidance",
      icon: "🎯",
      title: "Your AI Success Partner",
      description: "We're not just selling software - we're your partners in success. Get expert guidance every step of the way.",
      realMetrics: [
        { support: "Dedicated Success Manager", value: "Personal guidance", context: "Someone who knows your business", icon: "👥" },
        { support: "Training & Education", value: "Free workshops", context: "Learn how to maximize AI", icon: "🎓" },
        { support: "24/7 Support", value: "Always available", context: "Get help when you need it", icon: "🆘" },
        { support: "Success Reviews", value: "Monthly check-ins", context: "Ensure you're getting results", icon: "📅" }
      ],
      seoKeywords: ["AI support", "startup guidance", "AI mentorship", "success partnership"]
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
    "name": "JEDI Labs AI Tools for Startups",
    "provider": {
      "@type": "Organization",
      "name": "JEDI Labs",
      "url": "https://jedilabs.org",
      "logo": "https://jedilabs.org/logo.png"
    },
    "description": "AI tools and solutions designed specifically for startups and small businesses. Launch faster, scale smarter with no technical expertise required.",
    "serviceType": "Startup AI Solutions",
    "areaServed": "Global",
    "audience": {
      "@type": "Audience",
      "audienceType": "Startups and Small Businesses"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Startup AI Tools",
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
    "offers": {
      "@type": "Offer",
      "price": "99",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "99",
        "priceCurrency": "USD",
        "billingIncrement": "1",
        "unitCode": "MON"
      }
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
        <title>Why Choose JEDI Labs | AI Tools for Startups & Small Business Success</title>
        <meta 
          name="description" 
          content="Launch your startup faster with AI tools that actually work. No technical expertise needed - get 3x faster time to market, 40% higher conversion rates, and startup-friendly pricing from $99/month." 
        />
        <meta 
          name="keywords" 
          content="AI for startups, startup AI tools, small business AI, no-code AI, affordable AI, startup success, AI launch faster, business AI solutions" 
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
              Turn your startup idea into a successful business with <strong>AI tools that actually work</strong>. 
              No technical expertise needed - we handle the complex stuff so you can focus on <strong>building and growing your business</strong>.
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
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Why Startups Choose Us</h2>
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
                            {metric.benefit && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.benefit}
                                </div>
                                <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.result}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.context}
                                </div>
                              </>
                            )}
                            {metric.tool && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.tool}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.capability}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.benefit}
                                </div>
                              </>
                            )}
                            {metric.cost && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.cost}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.amount}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.context}
                                </div>
                              </>
                            )}
                            {metric.step && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.step}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.time}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.deliverable}
                                </div>
                              </>
                            )}
                            {metric.stage && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.stage}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                                  {metric.support}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                                  {metric.benefit}
                                </div>
                              </>
                            )}
                            {metric.support && (
                              <>
                                <div className={`font-semibold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {metric.support}
                                </div>
                                <div className={`font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
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
                Ready to launch your startup with AI?
              </span>
            </div>
            <p className={`mt-3 text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Join successful startups who chose JEDI Labs to build and grow their business
            </p>
          </motion.footer>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;