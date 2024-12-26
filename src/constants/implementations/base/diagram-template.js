export const createDiagram = ({
  title,
  description,
  nodes = [],  // Provide defaults for arrays
  connections = [],
  zones = [],
  deployment = null
}) => ({
  useCase: {
    title: title || "",
    description: description || "",
    businessValue: [],
    capabilities: [],
    examples: []
  },
  nodes: nodes?.map(node => ({  // Add null checks with optional chaining
    id: node.id || '',
    label: node.label || '',
    x: node.x || 0,
    y: node.y || 0,
    description: node.description || '',
    technologies: {
      main: node.technologies?.main || {},
      processing: node.technologies?.processing || {},
      storage: node.technologies?.storage || {},
      apis: node.technologies?.apis || {}
    },
    metrics: node.metrics || {},
    features: node.features || []
  })) || [],
  connections: connections?.map(conn => ({
    from: conn.from || '',
    to: conn.to || '',
    label: conn.label || '',
    type: conn.type || 'primary',
    protocol: conn.protocol || '',
    style: conn.style || '',
    dataFlow: {
      type: conn.dataFlow?.type || '',
      format: conn.dataFlow?.format || '',
      volume: conn.dataFlow?.volume || '',
      latency: conn.dataFlow?.latency || ''
    }
  })) || [],
  zones: zones?.map(zone => ({
    id: zone.id || '',
    label: zone.label || '',
    nodes: zone.nodes || [],
    security: zone.security || '',
    compliance: zone.compliance || []
  })) || [],
  deployment: deployment || {
    environments: [],
    infrastructure: {
      compute: [],
      storage: [],
      networking: [],
      security: []
    },
    monitoring: {
      metrics: [],
      logging: [],
      tracing: [],
      alerting: []
    }
  }
}); 