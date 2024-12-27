import { motion } from 'framer-motion';

export const ComponentCard = ({ data }) => (
  <motion.div
    className="bg-n-7 rounded-lg p-6 hover:bg-n-6 transition-colors"
    whileHover={{ scale: 1.02 }}
  >
    <h3 className="text-lg font-medium text-white mb-2">{data.title}</h3>
    <p className="text-n-3 mb-4">{data.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {data.tags.map((tag, idx) => (
        <span key={idx} className="px-2 py-1 bg-n-6 rounded text-xs text-primary-1">
          {tag}
        </span>
      ))}
    </div>
    <div className="text-n-2 mb-4">{data.metrics}</div>
    <div className="space-y-1">
      {data.steps.map((step, idx) => (
        <div key={idx} className="text-n-3 flex items-start">
          <span className="mr-2">•</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export const Timeline = ({ steps }) => (
  <div className="space-y-4">
    {steps.map((step, idx) => (
      <motion.div
        key={idx}
        className="flex items-start space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1 }}
      >
        <div className="flex-shrink-0 w-8 h-8 bg-n-6 rounded-full flex items-center justify-center text-white">
          {idx + 1}
        </div>
        <div>
          <h4 className="text-white font-medium">{step.title}</h4>
          <p className="text-n-3 mt-1">{step.description}</p>
          <p className="text-n-4 mt-1 text-sm">{step.details}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export const TransactionDemo = ({ transactions }) => (
  <div className="space-y-4">
    {transactions.map((tx, idx) => (
      <motion.div
        key={tx.id}
        className="bg-n-7 rounded-lg p-4 hover:bg-n-6 transition-colors"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-white font-medium">{tx.merchant}</h4>
            <p className="text-n-3 text-sm">{tx.location}</p>
          </div>
          <div className="text-right">
            <span className="text-white font-medium">${tx.amount}</span>
            <p className="text-n-3 text-sm">{tx.type}</p>
          </div>
        </div>
        <div className="mt-2 text-n-4 text-sm">{tx.context}</div>
      </motion.div>
    ))}
  </div>
);

export const RiskFactors = ({ factors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {factors.map((factor, idx) => (
      <motion.div
        key={idx}
        className="bg-n-7 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.1 }}
      >
        <h4 className="text-white font-medium mb-2">{factor.name}</h4>
        <p className="text-n-3">{factor.description}</p>
      </motion.div>
    ))}
  </div>
);

export const MetricsDisplay = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {metrics.map((metric, idx) => (
      <motion.div
        key={idx}
        className="bg-n-7 rounded-lg p-6 text-center"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
      >
        <h4 className="text-n-3 mb-2">{metric.label}</h4>
        <div className="text-2xl font-bold text-primary-1 mb-2">{metric.value}</div>
        <p className="text-n-3 text-sm">{metric.description}</p>
        <p className="text-n-4 text-xs mt-2">{metric.details}</p>
      </motion.div>
    ))}
  </div>
); 