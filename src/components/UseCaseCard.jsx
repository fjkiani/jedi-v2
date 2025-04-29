import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from './Icon';

const UseCaseCard = ({ useCase, onQueryClick, onClick }) => {
  const {
    title,
    queries,
    technologies,
  } = useCase;

  return (
    <div 
      className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-primary-1 transition-all h-full cursor-pointer"
      onClick={onClick}
    >
      <h2 className="h4 mb-6 text-n-1">{title}</h2>
      
      <div className="mb-6">
        <h3 className="text-n-1 font-semibold mb-3">Sample Queries</h3>
        <ul className="space-y-2">
          {queries?.slice(0, 2).map((query, index) => (
            <li 
              key={index} 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQueryClick?.(query);
              }}
              className="flex items-start gap-3 cursor-pointer hover:bg-n-6 rounded-lg p-2 transition-colors group"
            >
              <Icon name="arrow-right" className="w-4 h-4 text-primary-1 mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              <span className="text-n-3 group-hover:text-n-1">{query}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-n-1 font-semibold mb-3">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {technologies?.map((tech) => (
            <span
              key={tech.slug}
              className="bg-n-6 text-n-1 px-3 py-1 rounded-full text-sm border border-n-5 flex items-center gap-2"
            >
              {tech.icon && (
                tech.icon.startsWith('http') ? (
                  <img src={tech.icon} alt="" className="w-4 h-4" />
                ) : (
                  <Icon name={tech.icon} className="w-4 h-4 text-primary-1" />
                )
              )}
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

UseCaseCard.propTypes = {
  useCase: PropTypes.shape({
    title: PropTypes.string.isRequired,
    queries: PropTypes.arrayOf(PropTypes.string),
    technologies: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        icon: PropTypes.string,
      })
    ),
  }).isRequired,
  onQueryClick: PropTypes.func,
  onClick: PropTypes.func,
};

export default UseCaseCard; 