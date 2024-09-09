import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { layout, styles } from '../../../styles';
import FeatureCard from './FeatureCard';

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const SecondSection = ({ featureData }) => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const words = featureData ? Object.keys(featureData) : [];
  const intervalRef = useRef(null);

  const handleWordClick = (index) => {
    setActiveWordIndex(index);
    clearInterval(intervalRef.current); // Clear existing interval
    intervalRef.current = startInterval(); // Restart the interval
  };

  const startInterval = () => setInterval(() => {
    setActiveWordIndex(prevIndex => (prevIndex + 1) % words.length);
  }, 10000); // Control the transition speed here

  useEffect(() => {
    intervalRef.current = startInterval(); // Start the interval on mount
    return () => clearInterval(intervalRef.current); // Clear interval on unmount
  }, [words.length]); // Add words.length as a dependency

  const renderContent = () => {
    const activeWord = words[activeWordIndex];
    const { features, title, paragraph } = featureData[activeWord];

    return (
      <motion.section
        id="features"
        className={layout.section}
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <motion.div
          className={layout.sectionInfo}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <h2 className={styles.heading2}>{title}</h2>
          <p className={`${styles.paragraph} max-w-[470px] mt-5`}>{paragraph}</p>
        </motion.div>
        <motion.div
          className={`${layout.sectionImg} flex-col`}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} {...feature} index={index} />
          ))}
        </motion.div>
      </motion.section>
    );
  };

  return (
    <div className="pt-40 flex flex-col lg:flex-row items-center justify-center lg:space-x-10 bg-black">
      <div className="w-full lg:w-2/3 text-center lg:text-left px-6 mb-6">
        <h1 className="text-1xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-snug">
          {words.map((word, index) => (
            <motion.span
              key={word}
              onClick={() => handleWordClick(index)}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { opacity: index === activeWordIndex ? 1 : 0.5 },
                hidden: { opacity: 0 },
                hover: { scale: 1.1, transition: { duration: 0.2 } },
                tap: { scale: 0.95, transition: { duration: 0.2 } }
              }}
              whileHover="hover"
              whileTap="tap"
              style={{
                cursor: 'pointer',
                fontWeight: index === activeWordIndex ? 'bold' : 'normal',
                marginRight: '10px'
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        {renderContent()}
      </div>
      <div className="technology__pagination-dots">
        {(viewAll ? words : words.slice(0, 3)).map((word, index) => (
          <div
            key={index}
            className={`technology__pagination-dots__dot ${index === activeWordIndex ? 'technology__pagination-dots__dot--active' : ''}`}
            data-name={word}
            onClick={() => handleWordClick(index)}
          >
            {index + 1}
          </div>
        ))}
        {!viewAll && (
          <div className="technology__pagination-dots__view-all" onClick={() => setViewAll(true)}>
            View All
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondSection;
