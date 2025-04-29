import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';

const GetHomepageApplications = gql`
  query GetHomepageApplications {
    industryApplications(stage: PUBLISHED, first: 6, orderBy: applicationTitle_ASC) {
      id
      applicationTitle
      tagline
      keyCapabilities
    }
  }
`;

const SolutionsNavigator = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetHomepageApplications);
        setApplications(data.industryApplications || []);
      } catch (err) {
        console.error("Error fetching homepage applications:", err);
        setError("Failed to load solutions.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    let currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
          observer.unobserve(currentRef);
      } else {
         observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || loading || error || applications.length === 0) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollProgress = rect.height > 0 ? (window.innerHeight - rect.top) / rect.height : 0;

      const index = Math.min(
        Math.max(0, Math.floor(scrollProgress * applications.length)),
        applications.length - 1
      );

      if (index >= 0 && index < applications.length) {
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, applications.length, loading, error]);

  if (loading) {
    return <section className="relative bg-[#13151a] h-[100vh] flex items-center justify-center text-n-4">Loading Solutions...</section>;
  }
  if (error) {
     return <section className="relative bg-[#13151a] h-[100vh] flex items-center justify-center text-red-500">{error}</section>;
  }
  if (applications.length === 0) {
    return <section className="relative bg-[#13151a] h-[50vh] flex items-center justify-center text-n-4">No solutions to display.</section>;
  }

  return (
    <section 
      ref={sectionRef}
      className="relative bg-[#13151a]" 
      style={{ height: `${applications.length * 100}vh` }}
    >
      {isInView && (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {applications[activeIndex] && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="container mx-auto px-6 pointer-events-auto"
              >
                <div className="max-w-4xl">
                  <motion.h2 
                    className="text-[64px] md:text-[80px] font-bold mb-4 text-n-1"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {applications[activeIndex].applicationTitle}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-400 text-xl md:text-2xl mb-8"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {applications[activeIndex].tagline || 'Innovative AI solutions by JediLabs.'}
                  </motion.p>

                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {applications[activeIndex].keyCapabilities?.map((capability, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary-1"></div>
                        <p className="text-gray-300">{capability}</p>
                      </motion.div>
                    ))}
                    {!applications[activeIndex].keyCapabilities || applications[activeIndex].keyCapabilities.length === 0 && (
                       <p className="text-gray-400 italic">Key capabilities information coming soon.</p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isInView && applications.length > 0 && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 pointer-events-auto">
          {applications.map((_, index) => (
            <div
              key={index}
              className={`w-2 rounded-full transition-all duration-300 cursor-pointer
                ${index === activeIndex ? 'h-8 bg-white' : 'h-2 bg-gray-500'}`}
              onClick={() => {
                const section = sectionRef.current;
                 if (!section || applications.length === 0) return;

                 const sectionTop = section.offsetTop;
                 const sectionHeight = section.offsetHeight || window.innerHeight * applications.length;
                 const scrollPosition = sectionTop + (sectionHeight * (index / applications.length));

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