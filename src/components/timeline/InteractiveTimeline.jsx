import { motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

const InteractiveTimeline = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;

  // Sort experiences by startDate in descending order
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB - dateA;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px bg-n-3/30 dark:bg-n-6/30 hidden md:block" />
      
      {/* Timeline Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {sortedExperiences.map((experience, index) => (
          <div key={index} className="relative mb-16 last:mb-0">
            {/* Timeline Dot */}
            <div className="absolute left-[calc(50%-0.25rem)] top-6 w-2 h-2 rounded-full bg-color-1 hidden md:block" />
            
            <TimelineCard
              experience={experience}
              side={index % 2 === 0 ? 'left' : 'right'}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
