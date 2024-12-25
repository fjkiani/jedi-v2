export const createDiagram = ({
  title,
  description,
  nodes,
  connections,
  zones,
  deployment = null
}) => ({
  useCase: {
    title,
    description,
    businessValue: [],
    capabilities: [],
    examples: []
  },
  nodes: nodes.map(node => ({
    id: node.id,
    label: node.label,
    x: node.x,
    y: node.y,
    description: node.description,
    technologies: {
      // Group technologies by category
      main: {},
      processing: {},
      storage: {},
      apis: {}
    },
    metrics: {},
    features: []
  })),
  connections: connections.map(conn => ({
    from: conn.from,
    to: conn.to,
    label: conn.label,
    type: conn.type || 'primary', // primary, secondary, or monitoring
    protocol: conn.protocol,
    style: conn.style,
    dataFlow: {
      type: '',
      format: '',
      volume: '',
      latency: ''
    }
  })),
  zones: zones.map(zone => ({
    id: zone.id,
    label: zone.label,
    nodes: zone.nodes,
    security: zone.security,
    compliance: zone.compliance || []
  })),
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