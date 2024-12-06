import { techStackMapper } from '../constants/techStackMapper';
import { useNavigate } from 'react-router-dom';

const TechStack = () => {
  const navigate = useNavigate();

  const handleTechClick = (techName) => {
    const tech = techStackMapper[techName];
    if (tech && tech.solutions.length > 0) {
      // For testing, navigate to first solution
      navigate(`/solutions/${tech.solutions[0].slug}`);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(techStackMapper).map(([name, tech]) => (
        <div 
          key={tech.id}
          onClick={() => handleTechClick(name)}
          className="cursor-pointer hover:scale-105 transition-transform"
        >
          <img src={tech.image} alt={name} className="w-12 h-12" />
          <p>{tech.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TechStack; 