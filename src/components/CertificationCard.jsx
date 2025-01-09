import { motion } from 'framer-motion';

const CertificationCard = ({ certification }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-n-1 dark:bg-n-6 hover:bg-n-2 dark:hover:bg-n-5 transition-colors"
    >
      <a
        href={certification.credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6"
      >
        <div className="flex items-center gap-4">
          {/* Certificate Image */}
          {certification.image?.url && (
            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-n-2 dark:bg-n-7">
              <img 
                src={certification.image.url} 
                alt={certification.name} 
                className="w-full h-full object-contain p-2"
              />
            </div>
          )}

          {/* Certificate Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-2 text-n-6 dark:text-n-1">
              {certification.name}
            </h3>
            {certification.description?.raw && (
              <p className="text-sm text-n-4 line-clamp-2">
                {typeof certification.description.raw === 'string' 
                  ? JSON.parse(certification.description.raw).children[0].children[0].text
                  : certification.description.raw.children[0].children[0].text
                }
              </p>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="flex-shrink-0 text-n-4 group-hover:text-color-1 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default CertificationCard; 