// Configuration for different response types
export const responseTypeConfig = {
  CRISPR: {
    sections: ['analysis', 'discoveries', 'validation', 'timeline'],
    icons: {
      analysis: '🧬',
      discoveries: '🔬',
      validation: '✅',
      timeline: '📅'
    },
    visualTypes: {
      analysis: 'tree',
      discoveries: 'metrics',
      validation: 'chart',
      timeline: 'timeline'
    }
  },
  QUANTUM: {
    // ... similar structure for quantum computing
  },
  // Add more response types as needed
};

// Generic parser for response sections
export const parseResponseSection = (response, type = 'default') => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  // If response already has sections, return them directly
  if (response.sections) {
    return response.sections.map(section => ({
      ...section,
      type: section.type || 'process',
      fullWidth: section.fullWidth || section.title?.toLowerCase().includes('major')
    }));
  }

  // For legacy or different response formats
  const sections = [];
  
  // Handle header section if present
  if (response.header) {
    sections.push({
      icon: response.header.icon || '🔍',
      title: response.header.title || 'Analysis',
      type: 'process',
      items: [response.header.query],
      fullWidth: true
    });
  }

  // Handle content sections
  if (response.content) {
    response.content.forEach(item => {
      sections.push({
        icon: item.icon || '📊',
        title: item.title,
        type: item.type || 'process',
        items: item.items || [],
        result: item.result,
        details: item.details || [],
        fullWidth: item.fullWidth || false
      });
    });
  }

  // Handle discoveries if present
  if (response.discoveries) {
    sections.push({
      icon: '🔬',
      title: 'Key Discoveries',
      type: 'breakthrough',
      items: response.discoveries.map(d => d.title),
      fullWidth: true
    });
  }

  return sections;
}; 