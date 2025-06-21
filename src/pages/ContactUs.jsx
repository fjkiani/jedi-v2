import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import ContactCoPilot from '@/components/ContactCoPilot';
import { fadeIn, staggerContainer, zoomIn } from '@/utils/motion';
import { useTheme } from '@/context/ThemeContext';

const ContactUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [animateBackground, setAnimateBackground] = useState(false);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger background animation after a delay
    const timer = setTimeout(() => {
      setAnimateBackground(true);
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us | JediLabs - Start Your 100x Transformation Journey</title>
        <meta 
          name="description" 
          content="Get in touch with JediLabs to discuss how we can help your business achieve 100x growth. Let's transform your organization together."
        />
      </Helmet>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-1/20 to-primary-2/20 dark:from-primary-1/10 dark:to-primary-2/10"
            initial={{ 
              width: Math.random() * 80 + 40, 
              height: Math.random() * 80 + 40,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0
            }}
            animate={{ 
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), 
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ],
              opacity: [0, 0.2, 0]
            }}
            transition={{ 
              duration: Math.random() * 25 + 20, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mb-[4rem] flex items-center">
        <div className="container relative">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.75rem]"
          >
            <motion.h1 
              className={`h1 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Let's Transform Your Business Together
            </motion.h1>
            <motion.p 
              className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-6 max-w-3xl mx-auto`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Our AI consultant is here to understand your unique challenges and explore how JEDI Labs can drive exponential value for your business. Start the conversation below.
            </motion.p>
          </motion.div>
        </div>
      </Section>

      {/* Contact CoPilot Section */}
      <Section id="contact-copilot" className="pt-10 pb-20">
        <div className="container">
          <motion.div
            variants={zoomIn(0.3, 0.8)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-1/10 to-primary-2/10 rounded-3xl blur-2xl -z-10 transform rotate-1"></div>
            <ContactCoPilot />
          </motion.div>
        </div>
      </Section>

      {/* Contact Information */}
      <Section id="contact-info" className="py-20 bg-n-1/30 dark:bg-n-8/30">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Get In Touch</h2>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Prefer direct contact? Reach out to us through any of these channels.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            <motion.div 
              variants={fadeIn('up')}
              className={`text-center p-8 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-n-7/50 border-n-6 hover:bg-n-7' 
                  : 'bg-white/50 border-n-3 hover:bg-white'
              } transition-colors duration-300`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Email Us</h3>
              <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-3`}>
                Send us a message anytime
              </p>
              <a 
                href="mailto:jedi@jedilabs.org" 
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                jedi@jedilabs.org
              </a>
            </motion.div>

            <motion.div 
              variants={fadeIn('up')}
              className={`text-center p-8 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-n-7/50 border-n-6 hover:bg-n-7' 
                  : 'bg-white/50 border-n-3 hover:bg-white'
              } transition-colors duration-300`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Call Us</h3>
              <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-3`}>
                Speak with our team directly
              </p>
              <a 
                href="tel:+1-555-JEDI-LAB" 
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                +1 (347)684-2656
              </a>
            </motion.div>

            <motion.div 
              variants={fadeIn('up')}
              className={`text-center p-8 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-n-7/50 border-n-6 hover:bg-n-7' 
                  : 'bg-white/50 border-n-3 hover:bg-white'
              } transition-colors duration-300`}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Visit Us</h3>
              <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-3`}>
                Schedule an in-person meeting
              </p>
              <p className="text-purple-600 dark:text-purple-400 font-medium">
                Qahwah House<br />
                Brooklyn, NY
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default ContactUs; 