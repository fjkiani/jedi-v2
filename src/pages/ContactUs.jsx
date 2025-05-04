import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import Contact from '@/components/Contact';
import { fadeIn, staggerContainer, zoomIn } from '@/utils/motion';
import Button from '@/components/Button';
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechVision Inc.",
      quote: "JediLabs transformed our business operations completely. We've seen a 300% increase in efficiency!"
    },
    {
      name: "Michael Chen",
      company: "GrowthForce",
      quote: "The AI solutions implemented by JediLabs helped us scale beyond our wildest expectations."
    },
    {
      name: "Priya Patel",
      company: "Innovate Partners",
      quote: "Working with JediLabs was the best decision we made this year. Truly revolutionary results."
    }
  ];

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
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-1/30 to-primary-2/30 dark:from-primary-1/20 dark:to-primary-2/20"
            initial={{ 
              width: Math.random() * 100 + 50, 
              height: Math.random() * 100 + 50,
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              x: [
                Math.random() * window.innerWidth, 
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight, 
                Math.random() * window.innerHeight
              ],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 20 + 15, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <Section className="pt-[12rem] -mb-[8.25rem] flex items-center">
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
              Get in Touch
            </motion.h1>
            <motion.p 
              className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-6 max-w-3xl mx-auto`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              We're here to answer your questions, discuss your challenges, and explore how Jedi Labs' AI solutions can drive value for your business. Reach out and let's start the conversation.
            </motion.p>
            
          </motion.div>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section id="contact-form" className="pt-10 pb-20">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            {/* <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Let's Connect</h2>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-8`}>
              Fill out the form below and our team will get back to you within 24 hours.
              We're excited to learn about your business challenges and how we can help.
            </p> */}
          </motion.div>
          
          <motion.div
            variants={zoomIn(0.5, 0.8)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-1/20 to-primary-2/20 rounded-3xl blur-xl -z-10 transform -rotate-1"></div>
            <Contact />
          </motion.div>
        </div>
      </Section>

      {/* Testimonials Section
      <Section id="testimonials" className="py-20 bg-n-1/50 dark:bg-n-8/50">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>What Our Clients Say</h2>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Don't just take our word for it. Here's what businesses have achieved with JediLabs.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={fadeIn('up')}
                className="relative flex flex-col p-8 rounded-3xl bg-n-2 dark:bg-n-7 hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
                <p className={`italic ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-6`}>"{testimonial.quote}"</p>
                <div className="mt-auto">
                  <p className={`font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{testimonial.name}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section> */}

      {/* Office Locations */}
      {/* <Section className="py-20">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Our Office</h2>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Visit us when in New York or connect with us virtually from anywhere in the world.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            <div className="md:col-start-2 relative flex flex-col items-center text-center p-8 rounded-3xl bg-n-2 dark:bg-n-7 overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary-1/10 to-primary-2/10 -z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>New York</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-1 to-primary-2 mx-auto mb-6"></div>
                <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-6`}>
                  Brooklyn, NY<br />
                  &nbsp;
                </p>
                <div className="space-y-3">
                  <p className={`text-sm ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>jedi@jedilabs.org</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-1 to-primary-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={`mt-16 p-8 rounded-3xl bg-n-2 dark:bg-n-7 text-center`}
          >
            <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Global Reach</h3>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-6`}>
              While our physical office is in New York, we work with clients worldwide through our virtual collaboration tools.
              No matter where you are, we can help transform your business.
            </p>
            <Button href="#contact-form">Schedule a Virtual Meeting</Button>
          </motion.div>
        </div>
      </Section> */}

      {/* FAQ Section */}
      <Section className="py-20 bg-n-1/50 dark:bg-n-8/50">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[50rem] mx-auto text-center mb-[3.75rem]"
          >
            <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Frequently Asked Questions</h2>
            <p className={`body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Got questions? We've got answers. If you don't see what you're looking for, reach out to us.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 max-w-[62rem] mx-auto"
          >
            {[
              {
                q: "What does '100x transformation' mean?",
                a: "It means achieving exponential rather than incremental growth. We help businesses transform their operations, technology, and strategy to achieve results that are orders of magnitude better than their current state."
              },
              {
                q: "How long does a typical transformation take?",
                a: "Every business is different, but most of our clients see significant results within 3-6 months, with full transformation typically taking 12-18 months."
              },
              {
                q: "Do you work with startups or only established businesses?",
                a: "We work with businesses at all stages, from startups to enterprise organizations. Our approach is tailored to your specific needs and growth stage."
              },
              {
                q: "What industries do you specialize in?",
                a: "We have experience across multiple industries including technology, finance, healthcare, retail, and manufacturing. Our methodologies are adaptable to various business models."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up')}
                className={`p-6 rounded-2xl bg-white dark:bg-n-7 shadow-sm`}
              >
                <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{faq.q}</h4>
                <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button href="#contact-form">Ask Us Anything</Button>
          </motion.div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className="py-20">
        <div className="container">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative z-1 max-w-[62rem] mx-auto text-center p-10 rounded-3xl bg-gradient-to-r from-primary-1/10 to-primary-2/10 dark:from-primary-1/20 dark:to-primary-2/20"
          >
            <h2 className={`h2 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Ready to Transform Your Business?</h2>
            <p className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'} mb-8 max-w-[40rem] mx-auto`}>
              Join the businesses that have achieved extraordinary results with JediLabs. 
              Your 100x journey starts with a conversation.
            </p>
            <Button href="#contact-form" size="lg">Get Started Today</Button>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default ContactUs; 