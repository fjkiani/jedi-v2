import { motion } from 'framer-motion';

const ContentCard = ({ title, description, details, technologies, explanation }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-n-1">{title}</h3>
        <p className="text-n-3">{description}</p>
      </div>

      {/* Technologies */}
      {technologies && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-primary-1 bg-opacity-10 text-primary-1"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Details */}
      {details && (
        <div className="p-4 rounded-lg bg-n-6">
          <p className="text-n-2">{details}</p>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <ul className="space-y-2">
          {explanation.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-n-3"
            >
              <span className="text-primary-1">•</span>
              {item}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentCard; 