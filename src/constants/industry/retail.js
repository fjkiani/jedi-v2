export const retail = {
  id: 'retail',
  title: "Retail & E-commerce",
  icon: "cart",
  color: "from-[#9C27B0] to-[#4A148C]",
  heroImage: "/images/industries/retail-hero.jpg",
  description: "Transform retail operations with AI-powered inventory management, customer analytics, and personalized experiences.",
  solutions: [
    {
      id: "inventory-optimization",
      title: "Inventory Optimization",
      description: "AI-powered inventory and supply chain management",
      fullDescription: "Optimize inventory levels and supply chain operations using advanced AI algorithms and predictive analytics.",
      metrics: [
        { label: "Stock Accuracy", value: "99%" },
        { label: "Cost Reduction", value: "35%" },
        { label: "Stockout Prevention", value: "95%" }
      ],
      technologies: [
        "Demand Forecasting",
        "Supply Chain ML",
        "Real-time Analytics"
      ],
      benefits: [
        "Optimized stock levels",
        "Reduced carrying costs",
        "Improved cash flow",
        "Better customer satisfaction"
      ],
      caseStudies: [
        {
          title: "Retail Chain Optimization",
          description: "How AI reduced inventory costs by 35%",
          metrics: ["35% cost reduction", "99% stock accuracy", "Zero stockouts"],
          link: "/case-studies/retail-optimization"
        }
      ]
    }
  ]
};
