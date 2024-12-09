import { Link } from 'react-router-dom';
import { solutions } from '@/constants/solutions';
import Section from '@/components/Section';

const SolutionsOverview = () => {
  return (
    <Section>
      <div className="container">
        <h1 className="h1 mb-12">AI Solutions</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <Link
              key={solution.id}
              to={`/solutions/${solution.slug}`}
              className="bg-n-7 rounded-xl p-6 border border-n-6 
                       hover:border-primary-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={solution.icon} 
                  alt={solution.title}
                  className="w-12 h-12"
                />
                <h2 className="h3">{solution.title}</h2>
              </div>
              <p className="text-n-3">{solution.description}</p>
              
              {solution.businessValue?.useCases?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-n-6">
                  <h3 className="text-sm font-medium text-n-3 mb-2">
                    Use Cases:
                  </h3>
                  <ul className="space-y-1">
                    {solution.businessValue.useCases.slice(0, 3).map((useCase, index) => (
                      <li key={index} className="text-n-4 text-sm">
                        • {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default SolutionsOverview; 