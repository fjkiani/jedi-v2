import { motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

const InteractiveTimeline = ({ experiences, portfolioAssets }) => {
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

  // Get portfolio assets for a specific work experience
  const getPortfolioAssetsForExperience = (experienceId) => {
    if (!portfolioAssets) return [];
    return portfolioAssets.filter(asset => 
      asset.workExperience?.some(exp => exp.id === experienceId)
    );
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-[80%] top-0 bottom-0 w-px bg-n-3/30 dark:bg-n-6/30 hidden md:block" />
      
      {/* Timeline Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {sortedExperiences.map((experience, index) => {
          const experienceAssets = getPortfolioAssetsForExperience(experience.id);
          
          return (
            <div key={index} className="relative mb-16 last:mb-0 flex">
              {/* Main Content (80%) */}
              <div className="w-[80%] relative">
                {/* Timeline Dot */}
                <div className="absolute right-[-6px] top-6 w-2 h-2 rounded-full bg-color-1 hidden md:block" />
                
                <TimelineCard
                  experience={experience}
                  side="left"
                />
              </div>

              {/* Portfolio Assets (20%) */}
              {experienceAssets.length > 0 && (
                <div className="w-[20%] pl-8 pt-6">
                  {experienceAssets.map((asset, assetIndex) => (
                    <motion.div
                      key={assetIndex}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0, transition: { delay: 0.3 } }
                      }}
                      className="group relative overflow-hidden rounded-2xl bg-n-1 dark:bg-n-6 mb-4 last:mb-0"
                    >
                      {/* Image */}
                      {asset.image?.url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={asset.image.url} 
                            alt={asset.title || 'Portfolio Asset'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        {asset.title && (
                          <h3 className="text-base font-semibold text-white mb-2">{asset.title}</h3>
                        )}
                        {asset.description?.html && (
                          <div 
                            className="text-xs text-white/80 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            dangerouslySetInnerHTML={{ __html: asset.description.html }}
                          />
                        )}
                        {asset.projectUrl && (
                          <a 
                            href={asset.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-white hover:text-color-1 transition-colors"
                          >
                            View Project
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
