import { useParams } from 'react-router-dom';
import { aiMlTechStack } from '../../constants/techCategories/aiMlTechStack';

const TechDetail = () => {
  const { techId } = useParams();
  const tech = Object.values(aiMlTechStack).find(t => t.id === techId);

  if (!tech) return <div>Technology not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Tech Header */}
      <div className="flex items-center gap-6 mb-8">
        <img 
          src={tech.image} 
          alt={tech.name} 
          className="w-20 h-20 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold">{tech.name}</h1>
          <p className="text-gray-600">{tech.description}</p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-8">
        {tech.useCases.map((useCase, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{useCase.title}</h2>
            <p className="text-gray-600 mb-6">{useCase.description}</p>

            {/* Architecture */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Architecture Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {useCase.architecture.components.map((component, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">{component.name}</h4>
                    <p className="text-sm text-gray-600">{component.role}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {component.tech.map((t, j) => (
                        <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Implementation Steps</h3>
              <ul className="space-y-2">
                {useCase.implementation.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="font-medium mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(useCase.implementation.metrics).map(([key, value]) => (
                  <div key={key} className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium capitalize">{key}</h4>
                    <p className="text-green-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechDetail; 