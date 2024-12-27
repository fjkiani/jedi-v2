import { motion } from 'framer-motion';

export const MetricsTab = ({ metrics }) => (
  <div className="grid grid-cols-2 gap-6">
    {metrics.items.map((metric, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-6 rounded-xl bg-n-7 border border-n-6"
      >
        <div className="text-2xl font-bold text-primary-1 mb-2">
          {metric.value}
        </div>
        <div className="text-n-1 font-medium mb-1">{metric.label}</div>
        <div className="text-sm text-n-3">{metric.description}</div>
        {metric.details && (
          <div className="mt-2 text-xs text-n-4">{metric.details}</div>
        )}
      </motion.div>
    ))}
  </div>
); 