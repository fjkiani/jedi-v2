import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const ResponseVisualizer = ({ response }) => {
  const { metadata, actions, relatedQueries } = response;

  return (
    <div className="space-y-4">
      {/* Metadata Display */}
      <div className="flex items-center justify-between text-sm text-n-3">
        <div className="flex items-center space-x-4">
          <span>Confidence: {metadata.confidence}%</span>
          <span>Processing Time: {metadata.processingTime}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          {actions.map(action => (
            <motion.button
              key={action.type}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 rounded-full bg-n-7 text-n-1 text-xs"
              onClick={() => handleAction(action)}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Related Queries */}
      <div className="flex flex-wrap gap-2">
        {relatedQueries.map((query, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 rounded-full bg-primary-1 bg-opacity-10 text-primary-1 text-xs"
            onClick={() => handleRelatedQuery(query)}
          >
            {query}
          </motion.button>
        ))}
      </div>
    </div>
  );
}; 