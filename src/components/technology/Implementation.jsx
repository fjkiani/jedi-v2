import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { openAIService } from '@/services/openAIService';
import AIResponse from '@/components/response/AIResponse';

const Implementation = ({ tech, useCases, showDemo, customClassName }) => {
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Tech implementation:', tech);
  console.log('Available use cases:', useCases);

  const handleUseCaseClick = async (useCase) => {
    console.log('Selected useCase:', useCase);
    setIsLoading(true);
    setSelectedUseCase(useCase);

    try {
      if (tech?.exampleQueries?.samples) {
        const sampleQuery = tech.exampleQueries.samples[0];
        console.log('Using sample query:', sampleQuery);

        const response = await openAIService.generateResponse(
          tech,
          sampleQuery
        );
        
        console.log('Response:', response);
        setAiResponse(response);
      } else {
        console.log('No example queries found in implementation:', tech);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={customClassName || "grid md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {useCases?.map((useCase, index) => (
          <div 
            key={index}
            onClick={() => handleUseCaseClick(useCase)}
            className="bg-n-7 rounded-xl p-6 border border-n-6 cursor-pointer
                      transition-all duration-300 hover:border-primary-1"
          >
            <h4 className="font-semibold text-white mb-2">{useCase}</h4>
            <div className="flex items-center gap-2 text-sm text-primary-1">
              <span>Analyze with AI</span>
              <Icon name="arrow-right" className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {(isLoading || aiResponse) && (
        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
            </div>
          ) : aiResponse && (
            <div className="bg-n-6 p-6 rounded-lg border border-n-5">
              <h3 className="h4 mb-4">AI Analysis: {selectedUseCase}</h3>
              <AIResponse response={aiResponse} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Implementation; 