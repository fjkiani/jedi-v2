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
    hidden: { opacity: 0, x: side === 'right' ? 20 : -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
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
        relative w-full md:w-[calc(50%-1rem)] 
        ${side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}
        p-4 rounded-2xl
        bg-n-1 dark:bg-n-6 
        shadow-xl shadow-n-1/5 dark:shadow-none
        hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300
      `}
    >
      {/* Title & Company with Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          {/* Company Icon */}
          {experience.companyIcon?.url && (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-n-2 dark:bg-n-7">
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
            <h3 className="text-lg font-semibold">{experience.title}</h3>
            <div className="flex items-center gap-2">
              {experience.companyUrl ? (
                <a 
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-n-4 hover:text-color-1 transition-colors"
                >
                  {experience.company}
                </a>
              ) : (
                <p className="text-base text-n-4">{experience.company}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-n-4 whitespace-nowrap">
            {new Date(experience.startDate).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })} - {
              experience.endDate 
                ? new Date(experience.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })
                : 'Present'
            }
          </span>
          {!experience.endDate && (
            <div className="px-2 py-0.5 text-xs font-medium text-color-1 bg-color-1/10 rounded-full">
              Current
            </div>
          )}
        </div>
      </div>
      
      {/* Location */}
      {experience.location && (
        <div className="flex items-center gap-2 mb-3 text-n-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-sm">{experience.location}</span>
        </div>
      )}

      {/* Description */}
      {experience.description?.html && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="prose dark:prose-invert max-w-none mb-4 text-sm [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-1 [&>p]:mb-2"
          dangerouslySetInnerHTML={{ __html: experience.description.html }}
        />
      )}

      {/* Technologies */}
      {experience.skills?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-n-4">Technologies & Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {experience.skills.map((skill, index) => {
              if (!skill?.name) return null;

              const route = getTechnologyRoute(skill);
              const isBaseRoute = route === '/technology';

              return (
                <Link
                  key={index}
                  to={route}
                  className="flex items-center gap-1.5 px-2 py-0.5 text-xs rounded-full bg-n-2 dark:bg-n-7 hover:bg-color-1 hover:text-white transition-colors group cursor-pointer"
                >
                  {skill.icon && (
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="w-3 h-3 object-contain group-hover:brightness-200"
                    />
                  )}
                  <span>{skill.name}{isBaseRoute && ' →'}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Highlights */}
      {experience.highlights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-3 rounded-xl bg-n-2/50 dark:bg-n-7/50"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-n-4 mb-2">Key Achievements</h4>
          <p className="text-sm text-n-4">{experience.highlights}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TimelineCard;
