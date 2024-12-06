const BenchmarkComparison = ({ technologies, selectedMetrics }) => {
  return (
    <div className="space-y-6">
      {Object.entries(selectedMetrics).map(([category, metrics]) => (
        <div key={category} className="bg-n-8 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric} className="relative">
                <div className="flex justify-between mb-2">
                  <span className="text-n-3">{metric}</span>
                  <span className="text-primary-1">
                    {technologies[0].benchmarks[category][metric].value}
                    {technologies[0].benchmarks[category][metric].unit}
                  </span>
                </div>
                <div className="h-2 bg-n-6 rounded-full">
                  {technologies.map((tech, i) => (
                    <div
                      key={tech.id}
                      className="absolute h-2 bg-primary-1 rounded-full"
                      style={{
                        width: `${calculatePercentage(tech, category, metric)}%`,
                        opacity: 1 - (i * 0.2)
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 