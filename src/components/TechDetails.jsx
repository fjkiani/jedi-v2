import { useParams, Link } from 'react-router-dom';
import { techStackMapper } from '../constants/techStackMapper';

const TechDetails = () => {
  const { techId } = useParams();
  const tech = Object.values(techStackMapper).find(t => t.id === techId);

  if (!tech) return <div>Technology not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <img src={tech.image} alt={tech.name} className="w-16 h-16" />
        <h1 className="text-3xl font-bold">{tech.name}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Solutions</h2>
        <div className="grid gap-4">
          {tech.solutions.map((solution) => (
            <Link 
              key={solution.slug}
              to={`/solutions/${solution.slug}`}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium">{solution.title}</h3>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-600">Use Cases:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {solution.useCases.map((useCase) => (
                    <li key={useCase}>{useCase}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Industries</h2>
        <div className="flex gap-2 flex-wrap">
          {tech.industries.map((industry) => (
            <span 
              key={industry}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechDetails; 