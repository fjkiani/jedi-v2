type BenchmarkSource = {
    name: string;
    url: string;
    date: string;
    methodology?: string;
  }
  
  type BenchmarkMetric = {
    value: number;
    unit: string;
    context: string;
    sources: BenchmarkSource[];
    lastUpdated: string;
  }
  
  type ModelBenchmarks = {
    performance: {
      latency: BenchmarkMetric;
      throughput: BenchmarkMetric;
      maxContext: BenchmarkMetric;
    };
    costs: {
      inputCost: BenchmarkMetric;
      outputCost: BenchmarkMetric;
      finetuningCost: BenchmarkMetric;
    };
    quality: {
      accuracy: BenchmarkMetric;
      consistency: BenchmarkMetric;
      hallucination: BenchmarkMetric;
    };
    limits: {
      rateLimit: BenchmarkMetric;
      batchSize: BenchmarkMetric;
      concurrency: BenchmarkMetric;
    };
  }