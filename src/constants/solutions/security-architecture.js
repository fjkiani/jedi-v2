export const securityArchitecture = {
  title: "Security Architecture",
  description: "Our comprehensive approach to protecting data and systems",
  nodes: [
    // Security Core Layer
    {
      id: "encryption",
      label: "Encryption Core",
      x: 300,
      y: 50,
      description: "End-to-end data protection"
    },
    {
      id: "access_control",
      label: "Access Control",
      x: 700,
      y: 50,
      description: "Identity and permissions"
    },
    // Privacy Layer
    {
      id: "data_privacy",
      label: "Data Privacy",
      x: 100,
      y: 200,
      description: "Privacy by design"
    },
    {
      id: "compliance",
      label: "Compliance",
      x: 500,
      y: 200,
      description: "Regulatory standards"
    },
    {
      id: "audit",
      label: "Audit System",
      x: 900,
      y: 200,
      description: "Security monitoring"
    },
    // Implementation Layer
    {
      id: "secure_dev",
      label: "Secure Development",
      x: 300,
      y: 350,
      description: "Security in code"
    },
    {
      id: "secure_ops",
      label: "Secure Operations",
      x: 700,
      y: 350,
      description: "Security in deployment"
    }
  ],
  connections: [
    // Core Security Flow
    {
      from: "encryption",
      to: "access_control",
      label: "Secure Channel"
    },
    {
      from: "data_privacy",
      to: "compliance",
      label: "Privacy Rules"
    },
    {
      from: "compliance",
      to: "audit",
      label: "Compliance Checks"
    },
    {
      from: "secure_dev",
      to: "secure_ops",
      label: "Secure Pipeline"
    },
    // Cross-layer Connections
    {
      from: "encryption",
      to: "data_privacy",
      label: "Data Protection"
    },
    {
      from: "access_control",
      to: "audit",
      label: "Access Logs"
    },
    {
      from: "compliance",
      to: "secure_dev",
      label: "Security Standards"
    },
    {
      from: "secure_ops",
      to: "audit",
      label: "Operations Monitoring"
    }
  ]
}; 