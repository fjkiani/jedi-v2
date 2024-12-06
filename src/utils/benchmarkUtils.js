export const getBenchmarkCategories = (technologies) => {
  // Dynamically get all benchmark categories and metrics from the tech stack
  const categories = new Set();
  const metrics = {};

  technologies.forEach(tech => {
    if (tech.benchmarks) {
      Object.keys(tech.benchmarks).forEach(category => {
        categories.add(category);
        if (!metrics[category]) {
          metrics[category] = new Set();
        }
        
        // Get all metrics for this category
        Object.keys(tech.benchmarks[category]).forEach(metric => {
          metrics[category].add(metric);
        });
      });
    }
  });

  // Convert Sets to Arrays
  return Object.fromEntries(
    Array.from(categories).map(category => [
      category,
      Array.from(metrics[category])
    ])
  );
}; 