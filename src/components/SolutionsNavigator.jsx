import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SolutionsNavigator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  
  const solutions = [
    {
      id: 1,
      title: "Clinical Analysis",
      description: "AI-powered clinical insights and diagnostics",
      details: {
        benefits: [
          "Real-time data processing and analysis",
          "Advanced pattern recognition in medical data",
          "Predictive health analytics",
          "Automated diagnostic assistance",
          "Enhanced patient outcome tracking"
        ],
      }
    },
    {
      id: 2,
      title: "Patient Education",
      description: "Interactive AI learning platforms",
      details: {
        benefits: [
          "Personalized learning pathways",
          "Real-time progress tracking",
          "Interactive 3D visualizations",
          "Multi-language support",
          "Adaptive content delivery"
        ],
      }
    },
    {
      id: 3,
      title: "Claim Automation",
      description: "Intelligent processing systems",
      details: {
        benefits: [
          "Automated claim verification",
          "Fraud detection algorithms",
          "Real-time processing updates",
          "Smart document analysis",
          "Compliance checking"
        ],
      }
    },
    {
      id: 4,
      title: "Insurance Review",
      description: "Smart verification tools",
      details: {
        benefits: [
          "Automated policy matching",
          "Risk assessment AI",
          "Coverage optimization",
          "Instant eligibility checks",
          "Predictive cost analysis"
        ],
      }
    },
    {
      id: 5,
      title: "Predictive Analytics",
      description: "Future-focused insights engine",
      details: {
        benefits: [
          "Trend forecasting",
          "Risk prediction models",
          "Resource optimization",
          "Market analysis",
          "Strategic planning assistance"
        ],
      }
    },
    {
      id: 6,
      title: "Data Integration",
      description: "Seamless system connectivity",
      details: {
        benefits: [
          "Multi-source data harmonization",
          "Real-time synchronization",
          "Secure data pipelines",
          "Legacy system integration",
          "Cloud optimization"
        ],
      }
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust this value as needed
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (rect.height);
      const index = Math.min(
        Math.floor(scrollProgress * solutions.length),
        solutions.length - 1
      );
      
      if (index >= 0 && index < solutions.length) {
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, solutions.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-[#13151a]" 
      style={{ height: `${solutions.length * 100}vh` }}
    >
      {isInView && (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="container mx-auto px-6"
            >
              <div className="max-w-4xl">
                <motion.h2 
                  className="text-[64px] md:text-[80px] font-bold mb-4"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {solutions[activeIndex].title}
                </motion.h2>
                
                <motion.p 
                  className="text-gray-400 text-xl md:text-2xl mb-8"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {solutions[activeIndex].description}
                </motion.p>

                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {solutions[activeIndex].details.benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <p className="text-gray-300">{benefit}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Progress Indicators - only show when section is in view */}
      {isInView && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
          {solutions.map((_, index) => (
            <div
              key={index}
              className={`w-2 rounded-full transition-all duration-300 cursor-pointer
                ${index === activeIndex ? 'h-8 bg-white' : 'h-2 bg-gray-500'}`}
              onClick={() => {
                const section = sectionRef.current;
                if (!section) return;
                
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const scrollPosition = sectionTop + (sectionHeight * (index / solutions.length));
                
                window.scrollTo({
                  top: scrollPosition,
                  behavior: 'smooth'
                });
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SolutionsNavigator;