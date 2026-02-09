import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from './Icon';

import { useTheme } from '@/context/ThemeContext';

const UseCaseCard = ({ useCase, onQueryClick, onClick }) => {
  const { isDarkMode } = useTheme();
  const {
    title,
    queries,
    technologies,
  } = useCase;

  return (
    <div
      className={`rounded-xl p-6 border transition-all h-full cursor-pointer group hover:shadow-lg ${isDarkMode
        ? 'bg-n-7 border-n-6 hover:border-primary-1'
        : 'bg-white border-gray-200 hover:border-primary-1'}`}
      onClick={onClick}
    >
      <h3 className={`h4 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h3>

      <div className="mb-6">
        <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Sample Queries</h4>
        <ul className="space-y-2">
          {queries?.slice(0, 2).map((query, index) => (
            <li
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQueryClick?.(query);
              }}
              className={`flex items-start gap-3 cursor-pointer rounded-lg p-2 transition-colors group/item ${isDarkMode ? 'hover:bg-n-6' : 'hover:bg-gray-50'}`}
            >
              <Icon name="arrow-right" className="w-4 h-4 text-primary-1 mt-1 flex-shrink-0 group-hover/item:translate-x-1 transition-transform" />
              <span className={`text-sm ${isDarkMode ? 'text-n-3 group-hover/item:text-n-1' : 'text-n-6 group-hover/item:text-n-8'}`}>{query}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {technologies?.map((tech) => (
            <span
              key={tech.slug}
              className={`px-3 py-1 rounded-full text-xs font-mono border flex items-center gap-2 ${isDarkMode
                ? 'bg-n-6 text-n-1 border-n-5'
                : 'bg-gray-50 text-n-6 border-gray-200 shadow-sm'}`}
            >
              {tech.icon && (
                tech.icon.startsWith('http') ? (
                  <img src={tech.icon} alt="" className="w-4 h-4 object-contain" />
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