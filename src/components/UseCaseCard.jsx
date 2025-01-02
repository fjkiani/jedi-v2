import { Link } from 'react-router-dom';

const UseCaseCard = ({ useCase }) => {
  const {
    id,
    title,
    description,
    technologies,
    architecture
  } = useCase;

  return (
    <Link 
      to={`/use-case/${id}`}
      className="bg-n-7 rounded-xl p-6 hover:bg-n-6 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="h4 mb-2">{title}</h3>
        <div className="flex gap-2">
          {technologies?.slice(0, 1).map(tech => (
            <img 
              key={tech.id}
              src={tech.icon}
              alt={tech.name}
              className="w-8 h-8"
            />
          ))}
        </div>
      </div>
      <p className="text-n-3">{description}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {technologies?.map(tech => (
          <span 
            key={tech.id} 
            className="text-xs bg-n-6 rounded-full px-2 py-1"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default UseCaseCard; 