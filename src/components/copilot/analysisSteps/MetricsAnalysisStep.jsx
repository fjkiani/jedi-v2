import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiTrendingUp, FiTarget, FiBarChart, FiCheckCircle, FiZap } from 'react-icons/fi';
import ProgressiveReveal from '../ui/ProgressiveReveal';
import HighlightingCard from '../ui/HighlightingCard';

const MetricsAnalysisStep = ({ 
  useCaseData, 
  isAnalyzing, 
  progress, 
  onComplete 
}) => {
  const { isDarkMode } = useTheme();
  const [revealedMetrics, setRevealedMetrics] = useState(new Set());
  const [currentMetric, setCurrentMetric] = useState(null);

  const metrics = useCaseData?.metrics || [];
  const implementation = useCaseData?.implementation;

  // Progressive reveal of metrics based on analysis progress
  useEffect(() => {
    if (!isAnalyzing || metrics.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealedMetrics(prev => {
        const newRevealed = new Set(prev);
        const nextIndex = newRevealed.size;
        
        if (nextIndex < metrics.length) {
          newRevealed.add(nextIndex);
          setCurrentMetric(metrics[nextIndex]);
          
          // Auto-clear current metric after 2 seconds
          setTimeout(() => setCurrentMetric(null), 2000);
        } else {
          clearInterval(revealInterval);
          onComplete?.();
        }
        
        return newRevealed;
      });
    }, 1000);

    return () => clearInterval(revealInterval);
  }, [isAnalyzing, metrics, onComplete]);

  const getMetricIcon = (metricName) => {
    const name = metricName.toLowerCase();
    if (name.includes('accuracy') || name.includes('precision') || name.includes('recall')) return FiTarget;
    if (name.includes('speed') || name.includes('time') || name.includes('latency')) return FiZap;
    if (name.includes('cost') || name.includes('efficiency') || name.includes('roi')) return FiTrendingUp;
    return FiBarChart;
  };

  const getMetricCategory = (metricName) => {
    const name = metricName.toLowerCase();
    if (name.includes('accuracy') || name.includes('precision') || name.includes('recall') || name.includes('quality')) return 'Quality';
    if (name.includes('speed') || name.includes('time') || name.includes('latency') || name.includes('performance')) return 'Performance';
    if (name.includes('cost') || name.includes('efficiency') || name.includes('roi') || name.includes('savings')) return 'Efficiency';
    if (name.includes('adoption') || name.includes('usage') || name.includes('engagement')) return 'Adoption';
    return 'General';
  };

  const getMetricStatus = (index) => {
    if (revealedMetrics.has(index)) {
      if (currentMetric === metrics[index]) return 'highlighted';
      return 'revealed';
    }
    return 'hidden';
  };

  const getContextualMetricDescription = (metricName, solutionName, industryName) => {
    const name = metricName.toLowerCase();
    
    if (name.includes('accuracy')) {
      return `Measures the precision of ${solutionName} predictions in ${industryName} scenarios`;
    } else if (name.includes('speed') || name.includes('time')) {
      return `Tracks response time improvements for ${solutionName} operations`;
    } else if (name.includes('cost')) {
      return `Quantifies cost savings achieved through ${solutionName} implementation`;
    } else if (name.includes('adoption')) {
      return `Measures user adoption and engagement rates for ${solutionName}`;
    } else if (name.includes('efficiency')) {
      return `Evaluates operational efficiency gains from ${solutionName}`;
    }
    
    return `Key performance indicator for ${solutionName} success in ${industryName}`;
  };

  if (metrics.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        <FiBarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No metrics data available for analysis.</p>
      </div>
    );
  }

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric, index) => {
    const category = getMetricCategory(metric);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name: metric, originalIndex: index });
    return acc;
  }, {});

  const solutionName = useCaseData?.title || 'AI Solution';
  const industryName = useCaseData?.industry?.name || 'your industry';

  return (
    <div className="space-y-4">
      {/* Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiBarChart className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Success Metrics Analysis
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Evaluating {metrics.length} key performance indicators across {Object.keys(groupedMetrics).length} categories
        </p>
      </motion.div>

      {/* Metrics Categories */}
      {Object.entries(groupedMetrics).map(([category, metricList]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h5 className={`font-medium text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
            {category} ({metricList.filter(metric => revealedMetrics.has(metric.originalIndex)).length}/{metricList.length})
          </h5>
          
          <div className="space-y-2">
            {metricList.map((metric) => {
              const Icon = getMetricIcon(metric.name);
              const status = getMetricStatus(metric.originalIndex);
              
              return (
                <HighlightingCard
                  key={metric.originalIndex}
                  isHighlighted={status === 'highlighted'}
                  isRevealed={status === 'revealed'}
                  className={`p-3 rounded-lg border transition-all duration-500 ${
                    status === 'hidden' 
                      ? 'opacity-0 transform translate-y-2' 
                      : status === 'highlighted'
                      ? `${isDarkMode ? 'bg-primary-1/10 border-primary-1/50' : 'bg-primary-1/5 border-primary-1/30'} shadow-lg scale-105`
                      : `${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      status === 'highlighted' 
                        ? 'bg-primary-1/20' 
                        : isDarkMode ? 'bg-n-6' : 'bg-n-2'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        status === 'highlighted' 
                          ? 'text-primary-1' 
                          : isDarkMode ? 'text-n-3' : 'text-n-5'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h6 className={`font-medium text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                          {metric.name}
                        </h6>
                        {status === 'revealed' && (
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                        {getContextualMetricDescription(metric.name, solutionName, industryName)}
                      </p>
                    </div>
                  </div>
                </HighlightingCard>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Implementation Context */}
      {implementation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <FiTarget className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Implementation Context
            </h4>
          </div>
          
          {implementation.requirements && (
            <div className="mb-3">
              <h6 className={`font-medium text-sm mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                Key Requirements
              </h6>
              <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {implementation.requirements.slice(0, 3).map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-1 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {implementation.success_metrics && (
            <div>
              <h6 className={`font-medium text-sm mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                Success Criteria
              </h6>
              <p className={`text-xs ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                {implementation.success_metrics}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FiCheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Metrics Analysis Complete
          </h4>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
          Successfully analyzed {metrics.length} KPIs across {Object.keys(groupedMetrics).length} categories. 
          All metrics are aligned with {solutionName} objectives and {industryName} industry standards.
        </p>
      </motion.div>
    </div>
  );
};

export default MetricsAnalysisStep;



