import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const JediTechnologyBadge = ({ 
  technology,
  variant = 'default',
  size = 'md',
  showIcon = true,
  className = "",
  onClick = null
}) => {
  const { isDarkMode } = useTheme();

  // Add null check for technology
  if (!technology) {
    return null;
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      case 'xl':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 hover:scale-105';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-primary-1 text-white hover:bg-primary-2'
            : 'bg-primary-1 text-white hover:bg-primary-2'
        }`;
      case 'secondary':
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-n-6 text-n-2 hover:bg-n-5 border border-n-5'
            : 'bg-n-2 text-n-7 hover:bg-n-3 border border-n-3'
        }`;
      case 'outline':
        return `${baseStyles} ${
          isDarkMode
            ? 'border border-n-5 text-n-2 hover:bg-n-6 hover:border-primary-1'
            : 'border border-n-3 text-n-7 hover:bg-n-2 hover:border-primary-1'
        }`;
      case 'gradient':
        return `${baseStyles} bg-gradient-to-r from-primary-1 to-purple-600 text-white hover:from-primary-2 hover:to-purple-700`;
      case 'success':
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
        }`;
      case 'warning':
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
            : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
        }`;
      case 'info':
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
        }`;
      default:
        return `${baseStyles} ${
          isDarkMode
            ? 'bg-n-6 text-n-2 hover:bg-primary-1 hover:text-white'
            : 'bg-n-2 text-n-7 hover:bg-primary-1 hover:text-white'
        }`;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      case 'xl':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  const content = (
    <>
      {showIcon && technology.icon && (
        <img 
          src={technology.icon} 
          alt={technology.name || 'Technology'}
          className={`${getIconSize()} rounded-sm`}
        />
      )}
      <span>{technology.name || 'Unknown Technology'}</span>
    </>
  );

  const badgeClasses = `${getVariantStyles()} ${getSizeStyles()} ${className}`;

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={badgeClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {content}
      </motion.button>
    );
  }

  if (technology.slug) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={`/technology/${technology.slug}`}
          className={badgeClasses}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.span
      className={badgeClasses}
      whileHover={{ scale: 1.05 }}
    >
      {content}
    </motion.span>
  );
};

// Technology Grid Component
export const JediTechnologyGrid = ({ 
  technologies = [],
  variant = 'default',
  size = 'md',
  columns = 'auto',
  className = "",
  onTechnologyClick = null
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      case 6:
        return 'grid-cols-6';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    }
  };

  // Filter out undefined/null technologies
  const validTechnologies = technologies.filter(tech => tech && tech.id);

  return (
    <div className={`grid ${getGridCols()} gap-3 ${className}`}>
      {validTechnologies.map((tech, index) => (
        <JediTechnologyBadge
          key={tech.id || index}
          technology={tech}
          variant={variant}
          size={size}
          onClick={onTechnologyClick ? () => onTechnologyClick(tech) : null}
        />
      ))}
    </div>
  );
};

// Technology Categories Component
export const JediTechnologyCategories = ({ 
  categories = [],
  className = "",
  onCategoryClick = null
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`space-y-4 ${className}`}>
      {categories.map((category, index) => (
        <div key={category.name || index}>
          <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
            {category.name || 'Unnamed Category'}
          </h4>
          <JediTechnologyGrid
            technologies={category.technologies || []}
            variant="outline"
            size="sm"
            onTechnologyClick={onCategoryClick}
          />
        </div>
      ))}
    </div>
  );
};

export default JediTechnologyBadge;
