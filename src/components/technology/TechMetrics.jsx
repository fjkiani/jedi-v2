import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

const TechMetrics = ({ config }) => {
  // Early return if no metrics or capabilities
  if (!config?.metrics && !config?.capabilities && !config?.integrations) {
    return null;
  }

  // Icon mapping for different metric types
  const iconMap = {
    performance: "activity",
    accuracy: "check-circle",
    scalability: "trending-up",
    security: "shield",
    reliability: "activity",
    responseTime: "clock",
    uptime: "activity",
    // Add more mappings as needed
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 bg-n-8 rounded-2xl p-8"
    >
      {/* Performance Metrics */}
      {config.metrics && (
        <>
          <h2 className="h3 mb-6">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(config.metrics).map(([key, value]) => (
              <div key={key} className="bg-n-7 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-n-6 flex items-center justify-center">
                    <Icon 
                      name={iconMap[key] || 'bar-chart'} 
                      className="w-6 h-6 text-primary-1" 
                    />
                  </div>
                  <h3 className="font-semibold text-n-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                </div>
                <p className="text-primary-1 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Enterprise Capabilities & Integration Success */}
      {(config.capabilities || config.integrations) && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {config.capabilities && (
            <div className="bg-n-7 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Enterprise Capabilities</h3>
              <ul className="space-y-3">
                {config.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Icon name="check" className="w-5 h-5 text-primary-1" />
                    <span className="text-n-3">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {config.integrations && (
            <div className="bg-n-7 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Integration Success</h3>
              <ul className="space-y-3">
                {config.integrations.map((integration, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Icon name="check" className="w-5 h-5 text-primary-1" />
                    <span className="text-n-3">{integration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TechMetrics; 