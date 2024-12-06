import { Link } from 'react-router-dom';
import { aiMlTechStack } from '@/constants/techCategories/aiMlTechStack';

const UseCaseCard = ({ useCase, solutionId }) => {
  // Find the technology that implements this use case
  const technology = Object.values(aiMlTechStack).find(tech => 
    tech.useCases.some(uc => uc.title === useCase.title)
  );

  if (!technology) {
    console.warn(`No technology found for use case: ${useCase.title}`);
    return null;
  }

  return (
    <Link 
      to={`/technology/${technology.id}?useCase=${useCase.title.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-n-7 rounded-xl p-6 hover:bg-n-6 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="h4 mb-2">{useCase.title}</h3>
        <div className="flex gap-2">
          <img 
            src={technology.image} 
            alt={technology.name}
            className="w-8 h-8"
          />
        </div>
      </div>
      <p className="text-n-3">{useCase.description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {useCase.architecture?.components.map(component => 
          component.tech.map((tech, index) => (
            <span key={index} className="text-xs bg-n-6 rounded-full px-2 py-1">
              {tech}
            </span>
          ))
        )}
      </div>
    </Link>
  );
};

export default UseCaseCard; 