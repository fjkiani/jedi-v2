import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { teamService } from '@/services/teamService';

const TimelineCard = ({ experience, side = 'right' }) => {
  const [availableTechnologies, setAvailableTechnologies] = useState([]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      const technologies = await teamService.getAllTechnologies();
      setAvailableTechnologies(technologies);
    };

    fetchTechnologies();
  }, []);

  const fadeIn = {
    hidden: { 
      opacity: 0,
      x: side === 'right' ? 20 : -20,
      y: 20
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.3
      }
    }
  };

  // Helper function to check if a technology exists
  const getTechnologyRoute = (skill) => {
    if (!skill?.name || !skill?.slug) return '/technology';
    return `/technology/${skill.slug}`;
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`
        relative w-full max-w-[800px]
        p-6 rounded-2xl
        bg-n-1 dark:bg-n-6 
        shadow-xl shadow-n-1/5 dark:shadow-none
        hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300
      `}
    >
      {/* Title & Company with Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Company Icon */}
          {experience.companyIcon?.url && (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-n-2 dark:bg-n-7">
              {experience.companyUrl ? (
                <a 
                  href={experience.companyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img 
                    src={experience.companyIcon.url} 
                    alt={experience.company}
                    className="w-full h-full object-contain p-1"
                  />
                </a>
              ) : (
                <img 
                  src={experience.companyIcon.url} 
                  alt={experience.company}
                  className="w-full h-full object-contain p-1"
                />
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-n-6 dark:text-n-1">{experience.title}</h3>
            <p className="text-base text-n-4">{experience.company}</p>
          </div>
        </div>

        <div className="text-sm text-n-4 flex items-center gap-2">
          {experience.location && (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{experience.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {experience.description?.html && (
        <div 
          className="prose dark:prose-invert max-w-none mb-4 text-n-4"
          dangerouslySetInnerHTML={{ __html: experience.description.html }}
        />
      )}

      {/* Highlights */}
      {experience.highlights && (
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-n-6 dark:text-n-1">Key Achievements:</h4>
          <div className="text-n-4">
            {Array.isArray(experience.highlights) ? (
              <ul className="list-disc list-inside space-y-1">
                {experience.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            ) : (
              <p>{experience.highlights}</p>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {experience.skills && experience.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-n-2 dark:bg-n-7 text-n-4"
            >
              {skill.icon && (
                <img 
                  src={skill.icon} 
                  alt={skill.name || skill.title} 
                  className="w-4 h-4 object-contain"
                />
              )}
              <span>{skill.name || skill.title}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TimelineCard;
