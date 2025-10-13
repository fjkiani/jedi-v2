import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { 
  FiTrendingUp, FiUsers, FiZap, FiCheckCircle, 
  FiClock, FiDollarSign, FiTarget, FiBarChart 
} from 'react-icons/fi';

const JediMetricsCard = ({ 
  title,
  metrics = [],
  variant = 'default',
  className = "",
  animated = true 
}) => {
  const { isDarkMode } = useTheme();

  const getIcon = (type) => {
    const iconMap = {
      performance: FiTrendingUp,
      users: FiUsers,
      speed: FiZap,
      accuracy: FiCheckCircle,
      time: FiClock,
      revenue: FiDollarSign,
      target: FiTarget,
      growth: FiBarChart,
      default: FiTrendingUp
    };
    return iconMap[type] || iconMap.default;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          gradient: isDarkMode 
            ? 'from-green-900/30 to-emerald-900/30' 
            : 'from-green-50 to-emerald-50',
          border: isDarkMode 
            ? 'border-green-500/50' 
            : 'border-green-200',
          icon: 'text-green-500',
          accent: 'text-green-600'
        };
      case 'warning':
        return {
          gradient: isDarkMode 
            ? 'from-orange-900/30 to-yellow-900/30' 
            : 'from-orange-50 to-yellow-50',
          border: isDarkMode 
            ? 'border-orange-500/50' 
            : 'border-orange-200',
          icon: 'text-orange-500',
          accent: 'text-orange-600'
        };
      case 'info':
        return {
          gradient: isDarkMode 
            ? 'from-blue-900/30 to-cyan-900/30' 
            : 'from-blue-50 to-cyan-50',
          border: isDarkMode 
            ? 'border-blue-500/50' 
            : 'border-blue-200',
          icon: 'text-blue-500',
          accent: 'text-blue-600'
        };
      case 'purple':
        return {
          gradient: isDarkMode 
            ? 'from-purple-900/30 to-violet-900/30' 
            : 'from-purple-50 to-violet-50',
          border: isDarkMode 
            ? 'border-purple-500/50' 
            : 'border-purple-200',
          icon: 'text-purple-500',
          accent: 'text-purple-600'
        };
      default:
        return {
          gradient: isDarkMode 
            ? 'from-n-7 to-n-8' 
            : 'from-n-1 to-n-2',
          border: isDarkMode 
            ? 'border-n-6' 
            : 'border-n-3',
          icon: 'text-primary-1',
          accent: 'text-primary-1'
        };
    }
  };

  const styles = getVariantStyles();

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={animated ? { delay: index * 0.1 } : {}}
            className={`p-4 rounded-lg border transition-all hover:shadow-lg ${
              isDarkMode 
                ? 'bg-n-7 border-n-6 hover:border-primary-1/50' 
                : 'bg-n-1 border-n-3 hover:border-primary-1/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.icon && React.createElement(getIcon(metric.icon), { 
                  className: `w-4 h-4 ${styles.icon}` 
                })}
                <span className={`text-sm font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                  {metric.label}
                </span>
              </div>
              {metric.trend && (
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  <FiTrendingUp className={`w-3 h-3 ${
                    metric.trend > 0 ? 'rotate-0' : 'rotate-180'
                  }`} />
                  {Math.abs(metric.trend)}%
                </div>
              )}
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              {metric.value}
            </div>
            {metric.description && (
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                {metric.description}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      className={`p-6 rounded-xl border bg-gradient-to-br ${styles.gradient} ${styles.border} ${className}`}
    >
      {title && (
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={animated ? { opacity: 0, scale: 0.9 } : false}
            animate={animated ? { opacity: 1, scale: 1 } : false}
            transition={animated ? { delay: index * 0.1 } : {}}
            className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-n-6/50' : 'bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {metric.icon && React.createElement(getIcon(metric.icon), { 
                className: `w-5 h-5 ${styles.icon}` 
              })}
              <span className={`text-sm font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                {metric.label}
              </span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              {metric.value}
            </div>
            {metric.description && (
              <div className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {metric.description}
              </div>
            )}
            {metric.trend && (
              <div className={`flex items-center gap-1 text-xs mt-2 ${
                metric.trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <FiTrendingUp className={`w-3 h-3 ${
                  metric.trend > 0 ? 'rotate-0' : 'rotate-180'
                }`} />
                <span>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}% from last month
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default JediMetricsCard;

