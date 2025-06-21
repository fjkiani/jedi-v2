import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { check, logo } from '@/assets';
import { collabContent } from "../constants";
import Button from '@/components/Button';
import Section from '@/components/Section';
import { LeftCurve, RightCurve } from "./design/Collaboration";
import LeadCaptureModal from './copilot/LeadCaptureModal';
import { contactFormService } from '../services/contactFormService';
import { technologyService } from '../services/technologyService';
import { useTheme } from '@/context/ThemeContext';
// import { StarsCanvas} from "../components/canvas";

// Define animation variants outside the component
const revealItems = () => ({
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
});

const Collaboration = () => {
  const { isDarkMode } = useTheme();
  const [visibleItems, setVisibleItems] = useState([]);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [loadingTech, setLoadingTech] = useState(true);
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  useEffect(() => {
    const revealItemsSequence = () => {
      collabContent.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems((prevItems) => [...prevItems, index]);
        }, index * 300);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealItemsSequence();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('#collaboration-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch random technologies from Hygraph
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoadingTech(true);
        const randomTechs = await technologyService.getRandomTechnologies(6);
        console.log('Fetched technologies from Hygraph:', randomTechs);
        setTechnologies(randomTechs);
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setTechnologies([]);
      } finally {
        setLoadingTech(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Auto-cycle through technologies
  useEffect(() => {
    if (technologies.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveTechIndex((prev) => (prev + 1) % technologies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [technologies.length]);

  const handleStartJourney = () => {
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const enrichedFormData = {
        ...formData,
        leadSource: 'AI Co-Pilot Collaboration Section',
        context: 'User interested in starting their AI engineering journey',
        captureType: 'collaboration_start_journey',
        technologies: technologies.map(t => t.name).join(', ')
      };

      await contactFormService.submitLead(enrichedFormData);
      setShowLeadModal(false);
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  };

  const handleTechClick = (index) => {
    setActiveTechIndex(index);
  };

  return (
    <Section className={`relative overflow-hidden ${isDarkMode ? 'bg-n-8/90' : 'bg-white/90'} backdrop-blur-sm`} crosses id="collaboration-section">
      <div className="container relative">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <img src={logo} alt="JEDI AI" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Co-Pilot Engineering
            </span>
          </div>
          <h2 className="h2 mb-6">You Imagine, We Engineer.</h2>
          <p className={`body-1 text-n-4 max-w-3xl mx-auto ${isDarkMode ? '' : 'text-gray-600'}`}>
            Our AI co-pilot transforms your ideas into production-ready solutions using cutting-edge technologies and intelligent automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Capabilities */}
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {collabContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={revealItems()}
                  className={`group p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-n-7/30 border-n-6/50 hover:border-purple-500/30 hover:bg-n-7/50' 
                      : 'bg-white/50 border-gray-200/50 hover:border-purple-300/50 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <img 
                        src={check} 
                        width={20} 
                        height={20} 
                        alt="check"
                        className={`filter ${isDarkMode ? 'brightness-150' : 'brightness-100'}`}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className={`h6 mb-2 group-hover:text-purple-400 transition-colors ${
                        isDarkMode ? 'text-n-1' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      {item.text && (
                        <p className={`body-2 leading-relaxed ${
                          isDarkMode ? 'text-n-4' : 'text-gray-600'
                        }`}>
                          {item.text}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button onClick={handleStartJourney} className="w-full sm:w-auto">
                🚀 Start Your AI Journey
              </Button>
            </motion.div>
          </div>

          {/* Right Side - Technology Showcase */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              
              {/* Central AI Hub */}
              <div className="relative flex justify-center mb-12">
                <motion.div 
                  className="relative w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.4)",
                      "0 0 40px rgba(236, 72, 153, 0.6)",
                      "0 0 20px rgba(168, 85, 247, 0.4)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden ${
                    isDarkMode ? 'bg-n-8' : 'bg-white'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
                    <motion.img
                      src={logo}
                      width={48}
                      height={48}
                      alt="JEDI AI Co-Pilot"
                      className="relative z-10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Technology Grid */}
              {loadingTech ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : technologies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      <Link
                        to={`/technology/${tech.slug}`}
                        className={`block p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                          activeTechIndex === index
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/25'
                            : isDarkMode 
                              ? 'bg-n-7/30 border-n-6/50 hover:border-purple-500/30 hover:bg-n-7/50'
                              : 'bg-white/50 border-gray-200/50 hover:border-purple-300/50 hover:bg-white/80'
                        }`}
                        onMouseEnter={() => handleTechClick(index)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="flex flex-col items-center text-center space-y-3"
                        >
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            activeTechIndex === index 
                              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' 
                              : isDarkMode ? 'bg-n-6/50' : 'bg-gray-100/50'
                          }`}>
                            {tech.icon?.url ? (
                              <img
                                className={`w-10 h-10 object-contain filter ${isDarkMode ? 'brightness-150' : 'brightness-100'}`}
                                alt={tech.name}
                                src={tech.icon.url}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                              style={{ display: tech.icon?.url ? 'none' : 'flex' }}
                            >
                              {tech.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${
                              isDarkMode ? 'text-n-1' : 'text-gray-900'
                            }`}>
                              {tech.name}
                            </h4>
                            <p className={`text-lg leading-relaxed ${
                              isDarkMode ? 'text-n-4' : 'text-gray-600'
                            }`}>
                              {tech.description || tech.category}
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Active indicator */}
                        {activeTechIndex === index && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={isDarkMode ? 'text-n-4' : 'text-gray-600'}>
                    No technologies available at the moment.
                  </p>
                </div>
              )}

              {/* Technology Details */}
              <AnimatePresence mode="wait">
                {technologies.length > 0 && (
                  <motion.div
                    key={activeTechIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`text-center p-6 backdrop-blur-sm rounded-2xl border ${
                      isDarkMode 
                        ? 'bg-n-7/20 border-n-6/30' 
                        : 'bg-white/20 border-gray-200/30'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-purple-400">
                        {technologies[activeTechIndex]?.name}
                      </h3>
                      <Link
                        to={`/technology/${technologies[activeTechIndex]?.slug}`}
                        className="text-lg text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Learn More →
                      </Link>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-gray-600'}`}>
                      {technologies[activeTechIndex]?.description || `Advanced ${technologies[activeTechIndex]?.category} solutions tailored to your needs`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        contextData={{
          leadSource: 'AI Co-Pilot Collaboration Section',
          context: 'User interested in starting their AI engineering journey',
          technologies: technologies.map(t => t.name).join(', ')
        }}
        onSubmit={handleLeadSubmit}
      />

      {/* <StarsCanvas/> */}
    </Section>
  );
};

export default Collaboration;
