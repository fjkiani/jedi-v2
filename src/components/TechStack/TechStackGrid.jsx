import { useNavigate } from 'react-router-dom';
import { aiMlTechStack } from '../../constants/techCategories/aiMlTechStack';

const TechStackGrid = () => {
  const navigate = useNavigate();

  const handleTechClick = (techId) => {
    navigate(`/technology/${techId}`);
  };

  // Debug log to check the data
  console.log('Tech Stack Data:', aiMlTechStack);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(aiMlTechStack).map((tech) => (
          <div
            key={tech?.id || 'unknown'}
            onClick={() => tech?.id && handleTechClick(tech.id)}
            className="border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
          >
            {/* Tech Header */}
            <div className="flex items-center gap-4 mb-4">
              {tech?.image && (
                <img 
                  src={tech.image} 
                  alt={tech?.name || 'Technology'} 
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{tech?.name || 'Unknown Technology'}</h3>
                <p className="text-sm text-gray-600">{tech?.category || 'Uncategorized'}</p>
              </div>
            </div>

            {/* Description */}
            {tech?.description && (
              <p className="text-gray-700 mb-4">{tech.description}</p>
            )}

            {/* Primary Uses */}
            {tech?.primaryUses && tech.primaryUses.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tech.primaryUses.map((use, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Use Cases Preview */}
            {tech?.useCases && tech.useCases.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Use Cases:</h4>
                <ul className="space-y-1">
                  {tech.useCases.map((useCase, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {useCase.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackGrid; 