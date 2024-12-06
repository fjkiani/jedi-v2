import { techStackMapper } from '../constants/techStackMapper';
import { useNavigate } from 'react-router-dom';

const TechStackTest = () => {
  const navigate = useNavigate();

  const handleTechClick = (techName) => {
    const tech = techStackMapper[techName];
    console.log('Clicked:', techName, tech);
    if (tech && tech.solutions.length > 0) {
      const path = `/solutions/${tech.solutions[0].slug}`;
      console.log('Navigating to:', path);
      navigate(path);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-6">Tech Stack Test</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(techStackMapper).map(([name, tech]) => (
          <div 
            key={tech.id}
            onClick={() => handleTechClick(name)}
            className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
          >
            <img 
              src={tech.image} 
              alt={name} 
              className="w-16 h-16 object-contain mb-2" 
            />
            <p className="text-sm font-medium">{tech.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tech.solutions.length} solution(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackTest; 