import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';
import { BenchmarkComparison } from '@/components/BenchmarkComparison';
import { getBenchmarkCategories } from '@/utils/benchmarkUtils';

const TechnologyComparison = () => {
  const location = useLocation();
  const initialTechId = location.state?.selectedTech;
  
  // Get all available technologies
  const availableTechnologies = Object.values(aiMlTechStack);
  
  // State for selected technologies and metrics
  const [selectedTechs, setSelectedTechs] = useState(() => {
    if (initialTechId) {
      const initialTech = availableTechnologies.find(t => t.id === initialTechId);
      return initialTech ? [initialTech] : [];
    }
    return [];
  });

  // Initialize with common metrics if a technology is pre-selected
  const [selectedMetrics, setSelectedMetrics] = useState(() => {
    if (selectedTechs.length > 0) {
      const metrics = getBenchmarkCategories([selectedTechs[0]]);
      return Object.fromEntries(
        Object.entries(metrics).map(([category, metricList]) => [
          category,
          metricList.slice(0, 3) // Start with first 3 metrics of each category
        ])
      );
    }
    return {};
  });

  // Get available metrics based on selected technologies
  const availableMetrics = getBenchmarkCategories(selectedTechs);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Technology Comparison</h2>
      
      {/* Technology Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Technologies to Compare</h3>
        <div className="flex flex-wrap gap-2">
          {availableTechnologies.map(tech => (
            <button
              key={tech.id}
              onClick={() => {
                setSelectedTechs(prev => 
                  prev.find(t => t.id === tech.id)
                    ? prev.filter(t => t.id !== tech.id)
                    : [...prev, tech]
                );
              }}
              className={`px-4 py-2 rounded ${
                selectedTechs.find(t => t.id === tech.id)
                  ? 'bg-primary-1 text-white' 
                  : 'bg-n-6 text-n-1'
              }`}
            >
              {tech.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selection */}
      {selectedTechs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Metrics</h3>
          {Object.entries(availableMetrics).map(([category, metrics]) => (
            <div key={category} className="mb-4">
              <h4 className="font-medium mb-2 capitalize">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.map(metric => (
                  <button
                    key={metric}
                    onClick={() => {
                      setSelectedMetrics(prev => ({
                        ...prev,
                        [category]: prev[category]?.includes(metric)
                          ? prev[category].filter(m => m !== metric)
                          : [...(prev[category] || []), metric]
                      }));
                    }}
                    className={`px-3 py-1 rounded ${
                      selectedMetrics[category]?.includes(metric)
                        ? 'bg-primary-1 text-white'
                        : 'bg-n-6 text-n-1'
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Display */}
      {selectedTechs.length > 0 && Object.keys(selectedMetrics).length > 0 && (
        <BenchmarkComparison
          technologies={selectedTechs}
          selectedMetrics={selectedMetrics}
        />
      )}
    </div>
  );
};

export default TechnologyComparison; 