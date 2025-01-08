export const jediArchitecture = {
  title: "J.E.D.I Architecture",
  description: "Our core principles in action",
  nodes: [
    // Core Principles
    {
      id: "justice",
      label: "Justice",
      x: 300,
      y: 100,
      description: "Ethical AI & Fair Systems"
    },
    {
      id: "equity",
      label: "Equity",
      x: 700,
      y: 100,
      description: "Equal Access & Opportunity"
    },
    {
      id: "diversity",
      label: "Diversity",
      x: 300,
      y: 300,
      description: "Inclusive Innovation"
    },
    {
      id: "inclusion",
      label: "Inclusion",
      x: 700,
      y: 300,
      description: "Universal Solutions"
    }
  ],
  connections: [
    // Core Connections
    {
      from: "justice",
      to: "equity",
      label: "Fair Access"
    },
    {
      from: "equity",
      to: "inclusion",
      label: "Equal Opportunity"
    },
    {
      from: "inclusion",
      to: "diversity",
      label: "Diverse Perspectives"
    },
    {
      from: "diversity",
      to: "justice",
      label: "Ethical Innovation"
    }
  ]
}; 