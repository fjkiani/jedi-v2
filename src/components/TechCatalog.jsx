import { useNavigate } from 'react-router-dom';
import { techStackMapper } from '../constants/techStackMapper';

const TechCatalog = () => {
  const navigate = useNavigate();
  
  // Group technologies by category
  const techByCategory = Object.values(techStackMapper).reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {});

  return (
    <div className="p-8">
      {Object.entries(techByCategory).map(([category, technologies]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                onClick={() => navigate(`/tech/${tech.id}`)}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  <img src={tech.image} alt={tech.name} className="w-12 h-12" />
                  <h3 className="ml-3 font-medium">{tech.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tech.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.primaryUses.map((use, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechCatalog; 