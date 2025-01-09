import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillTooltip = ({ skill, visible, x, y }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        style={{ 
          position: 'fixed',
          left: x,
          top: y,
          transform: 'translate(-50%, -100%)',
          zIndex: 50
        }}
        className="
          pointer-events-none
          px-4 py-2 mb-2
          bg-n-7 dark:bg-n-1
          text-white dark:text-n-7
          text-sm rounded-lg
          shadow-lg
        "
      >
        <div className="max-w-xs">
          <p className="font-medium mb-1">{skill.name}</p>
          {skill.description && (
            <p className="text-xs opacity-80">{skill.description}</p>
          )}
        </div>
        <div 
          className="
            absolute bottom-0 left-1/2 
            w-3 h-3 
            bg-n-7 dark:bg-n-1
            transform translate-y-1/2 rotate-45 -translate-x-1/2
          "
        />
      </motion.div>
    )}
  </AnimatePresence>
);

const TimelineSkills = ({ skills }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (skill, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setHoveredSkill(skill);
  };

  return (
    <div className="relative">
      <h4 className="text-sm font-semibold mb-3">Technologies & Skills</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={(e) => handleMouseEnter(skill, e)}
            onMouseLeave={() => setHoveredSkill(null)}
            className={`
              flex items-center gap-2 
              px-3 py-1 
              rounded-full
              text-sm
              cursor-help
              transition-colors duration-200
              ${skill.category?.name === hoveredSkill?.category?.name
                ? 'bg-color-1 text-white'
                : 'bg-n-2 dark:bg-n-7 text-n-4 hover:text-n-6 dark:hover:text-n-1'
              }
            `}
          >
            {skill.icon && (
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-4 h-4 object-contain"
              />
            )}
            <span>{skill.name}</span>
          </motion.div>
        ))}
      </div>

      <SkillTooltip
        skill={hoveredSkill}
        visible={!!hoveredSkill}
        x={tooltipPosition.x}
        y={tooltipPosition.y}
      />
    </div>
  );
};

export default TimelineSkills; 