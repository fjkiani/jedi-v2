import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TechBadge } from '../shared/TechBadge';
import { getSolutionBySlug } from '../../../constants/solutions';
import { Icon } from '../../Icon';
import { getIconForCategory } from '../../../constants/categoryIcons';

export const DeploymentView = ({ diagram }) => {
  const solution = getSolutionBySlug(diagram.id);
  const techStack = solution?.techStack || {};
  
  // Extract deployment-related nodes from the diagram
  const deploymentNodes = diagram.nodes.filter(node => 
    node.technologies && Object.keys(node.technologies).length > 0
  );

  // Transform nodes into categories
  const categories = {};

  // Process each deployment node
  deploymentNodes.forEach(node => {
    Object.entries(node.technologies).forEach(([category, tools]) => {
      if (!categories[category]) {
        categories[category] = {
          title: category.charAt(0).toUpperCase() + category.slice(1),
          icon: getIconForCategory(category),
          items: []
        };
      }

      const items = typeof tools === 'object' && !Array.isArray(tools)
        ? createItems(tools, node.description, techStack)
        : Array.isArray(tools)
          ? tools.map(tool => createItem(tool, node.description, techStack))
          : [];

      categories[category].items.push(...items);
    });
  });

  const [activeCategory, setActiveCategory] = useState(Object.keys(categories)[0] || '');

  if (Object.keys(categories).length === 0) {
    return (
      <div className="text-center text-n-3 py-8">
        <p>No deployment information available in the architecture diagram.</p>
        <p className="text-sm mt-2">Check the node configuration in your diagram data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Tab Navigation */}
      <div className="flex items-center justify-between border-b border-n-6 pb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {Object.entries(categories).map(([key, { title, icon }]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeCategory === key 
                  ? 'bg-primary-1 text-white' 
                  : 'bg-n-6 text-n-3 hover:bg-n-5'
              }`}
            >
              <Icon name={icon} className="w-4 h-4" />
              <span>{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories[activeCategory]?.items.map((item, index) => (
            <TechBadge
              key={`${item.name}-${index}`}
              {...item}
              delay={index * 0.05}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions
const createItem = (name, description, techStack) => {
  const techInfo = Object.values(techStack).find(category => 
    category[name]
  )?.[name];

  return {
    name,
    icon: techInfo?.icon || 
      `https://cdn.simpleicons.org/${name.toLowerCase().replace(/[/\s]+/g, '')}`,
    description: techInfo?.description || description
  };
};

const createItems = (techObj, nodeDescription, techStack) => {
  return Object.entries(techObj).map(([name, description]) => 
    createItem(name, typeof description === 'string' ? description : nodeDescription, techStack)
  );
};

export default DeploymentView; 