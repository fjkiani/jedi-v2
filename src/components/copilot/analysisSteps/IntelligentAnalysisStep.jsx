import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiCpu, FiZap, FiTarget, FiCheckCircle, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

const IntelligentAnalysisStep = ({ 
  useCaseData, 
  isAnalyzing, 
  progress, 
  onComplete,
  analysisType 
}) => {
  const { isDarkMode } = useTheme();
  const [currentInsight, setCurrentInsight] = useState(null);
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate contextual insights based on analysis type and data
  const generateInsights = () => {
    const solutionName = useCaseData?.title || 'AI Solution';
    const industryName = useCaseData?.industry?.name || 'your industry';
    
    const insightTemplates = {
      architecture: [
        {
          type: 'discovery',
          icon: FiCpu,
          title: 'System Architecture Discovered',
          content: `Identified ${useCaseData?.architecture?.components?.length || 0} core components in ${solutionName} architecture`,
          details: 'Analyzing component relationships and data flow patterns...',
          confidence: 95
        },
        {
          type: 'pattern',
          icon: FiZap,
          title: 'Integration Pattern Detected',
          content: 'Microservices architecture with event-driven communication',
          details: 'This pattern ensures scalability and maintainability for enterprise deployment',
          confidence: 88
        },
        {
          type: 'recommendation',
          icon: FiTarget,
          title: 'Optimization Opportunity',
          content: 'Consider implementing caching layer for improved performance',
          details: 'Based on data flow analysis, this could reduce response times by 40%',
          confidence: 92
        }
      ],
      technology: [
        {
          type: 'discovery',
          icon: FiCpu,
          title: 'Technology Stack Analyzed',
          content: `Evaluated ${useCaseData?.technologies?.length || 0} technologies across multiple categories`,
          details: 'All technologies are production-ready and industry-standard',
          confidence: 97
        },
        {
          type: 'pattern',
          icon: FiZap,
          title: 'AI/ML Stack Identified',
          content: 'Modern AI stack with LangChain, Hugging Face, and vector databases',
          details: 'This combination provides optimal performance for conversational AI applications',
          confidence: 94
        },
        {
          type: 'recommendation',
          icon: FiTarget,
          title: 'Technology Recommendation',
          content: 'Consider adding monitoring tools for production deployment',
          details: 'Prometheus + Grafana would provide comprehensive observability',
          confidence: 89
        }
      ],
      metrics: [
        {
          type: 'discovery',
          icon: FiCpu,
          title: 'Success Metrics Identified',
          content: `Found ${useCaseData?.metrics?.length || 0} key performance indicators`,
          details: 'Metrics are aligned with industry best practices and business objectives',
          confidence: 96
        },
        {
          type: 'pattern',
          icon: FiTrendingUp,
          title: 'Performance Trend Detected',
          content: 'Expected 60-80% improvement in operational efficiency',
          details: 'Based on similar implementations in the healthcare industry',
          confidence: 91
        },
        {
          type: 'recommendation',
          icon: FiTarget,
          title: 'Measurement Strategy',
          content: 'Implement real-time monitoring dashboard for continuous tracking',
          details: 'This will enable proactive optimization and ROI measurement',
          confidence: 93
        }
      ],
      implementation: [
        {
          type: 'discovery',
          icon: FiCpu,
          title: 'Implementation Path Mapped',
          content: `Identified ${useCaseData?.architecture?.flow?.length || 0}-step implementation process`,
          details: 'Each step is optimized for minimal risk and maximum success probability',
          confidence: 94
        },
        {
          type: 'pattern',
          icon: FiZap,
          title: 'Deployment Strategy Detected',
          content: 'Phased rollout approach with pilot testing and gradual scaling',
          details: 'This approach minimizes risk while ensuring smooth adoption',
          confidence: 90
        },
        {
          type: 'recommendation',
          icon: FiTarget,
          title: 'Implementation Recommendation',
          content: 'Start with core functionality and expand iteratively',
          details: 'This approach delivers value early while building stakeholder confidence',
          confidence: 87
        }
      ]
    };

    return insightTemplates[analysisType] || [];
  };

  // Progressive insight generation
  useEffect(() => {
    if (!isAnalyzing) return;

    const availableInsights = generateInsights();
    let currentIndex = 0;

    const generateNextInsight = () => {
      if (currentIndex < availableInsights.length) {
        setIsGenerating(true);
        
        // Simulate thinking time
        setTimeout(() => {
          const insight = availableInsights[currentIndex];
          setCurrentInsight(insight);
          
          // Add to insights list after a delay
          setTimeout(() => {
            setInsights(prev => [...prev, insight]);
            setCurrentInsight(null);
            setIsGenerating(false);
            currentIndex++;
            
            if (currentIndex < availableInsights.length) {
              setTimeout(generateNextInsight, 1500);
            } else {
              onComplete?.();
            }
          }, 2000);
        }, 800 + Math.random() * 1200);
      }
    };

    generateNextInsight();
  }, [isAnalyzing, analysisType, onComplete]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'discovery': return FiCpu;
      case 'pattern': return FiZap;
      case 'recommendation': return FiTarget;
      default: return FiCheckCircle;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'discovery': return 'text-blue-400';
      case 'pattern': return 'text-purple-400';
      case 'recommendation': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-4">
      {/* Analysis Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}>
            <FiCpu className={`w-5 h-5 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`} />
          </div>
          <div>
            <h4 className={`font-semibold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              JEDI Co-Pilot Analysis
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              {analysisType === 'architecture' && 'Analyzing system architecture and component relationships...'}
              {analysisType === 'technology' && 'Evaluating technology stack and tool compatibility...'}
              {analysisType === 'metrics' && 'Processing success metrics and performance indicators...'}
              {analysisType === 'implementation' && 'Reviewing implementation strategy and deployment process...'}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-full h-1 rounded-full ${isDarkMode ? 'bg-n-6' : 'bg-n-2'}`}>
            <motion.div
              className="h-1 bg-primary-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>

      {/* Current Insight Generation */}
      {isGenerating && currentInsight && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-primary-1/5 border-primary-1/30' : 'bg-primary-1/5 border-primary-1/20'
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-4 h-4 border-2 border-primary-1 border-t-transparent rounded-full animate-spin" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
              Generating insight...
            </span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Analyzing data patterns and generating recommendations...
          </p>
        </motion.div>
      )}

      {/* Generated Insights - Limited to First 3 */}
      <div className="space-y-3">
        {insights.slice(0, 3).map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const iconColor = getInsightColor(insight.type);
          const confidenceColor = getConfidenceColor(insight.confidence);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-n-6' : 'bg-n-2'}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className={`font-medium text-sm ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                      {insight.title}
                    </h6>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${confidenceColor}`}>
                        {insight.confidence}%
                      </span>
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                    {insight.content}
                  </p>
                  
                  <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                    {insight.details}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Show More Indicator */}
        {insights.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-3 rounded-lg border text-center ${
              isDarkMode ? 'bg-n-6 border-n-5' : 'bg-n-2 border-n-3'
            }`}
          >
            <p className={`text-sm font-medium ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
              +{insights.length - 3} more insights available
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Launch full simulation to see all insights
            </p>
          </motion.div>
        )}
      </div>

      {/* Analysis Complete */}
      {!isAnalyzing && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                Analysis Complete
              </h4>
              <p className={`text-xs ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Generated {insights.length} insights with {Math.round(insights.reduce((acc, insight) => acc + insight.confidence, 0) / insights.length)}% average confidence
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IntelligentAnalysisStep;


