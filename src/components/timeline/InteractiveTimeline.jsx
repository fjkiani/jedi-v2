import { motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

const InteractiveTimeline = ({ experiences }) => {
  // Sort experiences by date
  const sortedExperiences = [...experiences]
    .filter(exp => exp.startDate)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  if (!sortedExperiences.length) {
    return (
      <div className="text-center py-8 text-n-4">
        No work experience entries found.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Track */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-n-3/30 dark:bg-n-6/30" />
      
      {/* Timeline Content */}
      <div className="relative">
        {sortedExperiences.map((experience, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
          >
            {/* Timeline Node */}
            <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4">
              <div className="w-full h-full rounded-full bg-color-1 shadow-lg shadow-color-1/30" />
              <div className="absolute -inset-2 rounded-full border-2 border-color-1/30" />
            </div>

            {/* Connector Line */}
            {index < sortedExperiences.length - 1 && (
              <div className="absolute left-1/2 top-12 bottom-0 -translate-x-1/2 w-px bg-color-1/20" />
            )}

            {/* Experience Card */}
            <div className="py-8">
              <TimelineCard
                experience={experience}
                active={true}
                side={index % 2 === 0 ? 'right' : 'left'}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTimeline; 