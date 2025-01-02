import { useState, useEffect } from 'react';
import { openAIService } from '@/services/openAIService';
import { technologyService } from '@/services/technologyService';
import AIResponse from '@/components/response/AIResponse';

const UseCaseDemo = ({ useCase }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    const loadTechnologies = async () => {
      if (useCase.components) {
        const techs = await technologyService.getTechnologiesForUseCase(useCase.components);
        setTechnologies(techs);
      }
    };

    loadTechnologies();
  }, [useCase]);

  const runDemo = async (sampleQuery) => {
    setLoading(true);
    try {
      const response = await openAIService.generateResponse(
        useCase,
        sampleQuery
      );
      setResponse(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-n-1">Try the Use Case</h3>
        <div className="space-y-3">
          {useCase.exampleQueries?.samples.map((sample, index) => (
            <button
              key={index}
              onClick={() => runDemo(sample)}
              className="w-full text-left p-3 rounded-lg bg-n-8 border border-n-6 
                       hover:border-primary-1 transition-colors duration-200"
            >
              <p className="text-n-1">{sample}</p>
            </button>
          ))}
        </div>
      </div>

      {technologies.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-n-1 mb-3">Technology Stack</h4>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <a
                key={tech.id}
                href={tech.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 rounded-lg bg-n-7 border border-n-6 
                         hover:border-primary-1 transition-colors duration-200"
                title={`${tech.description}\n\nPrimary Use: ${tech.primaryUses[0]}`}
              >
                {tech.icon && (
                  <img
                    src={tech.icon.url}
                    alt={tech.name}
                    className="w-6 h-6 mr-2"
                  />
                )}
                <span className="text-sm text-n-1">{tech.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1" />
        </div>
      )}

      {response && <AIResponse response={response} />}
    </div>
  );
};

export default UseCaseDemo; 