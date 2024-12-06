import { aiMlTechStack } from '../../constants/techCategories/aiMlTechStack';

const TechStackTest = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">AI/ML Tech Stack Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(aiMlTechStack).map(([key, tech]) => (
          <div key={tech.id} className="border rounded-lg p-6">
            {/* Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={tech.image} 
                alt={tech.name} 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-bold">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.category}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{tech.description}</p>

            {/* Primary Uses */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.primaryUses.map((use, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  {use}
                </span>
              ))}
            </div>

            {/* Use Cases Preview */}
            <div>
              <h4 className="font-medium text-sm mb-2">Use Cases:</h4>
              <ul className="text-sm text-gray-600">
                {tech.useCases.map((useCase, index) => (
                  <li key={index}>• {useCase.title}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackTest; 