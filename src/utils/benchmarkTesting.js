export const runBenchmarkTests = async (provider, config) => {
  const results = {
    latency: [],
    throughput: [],
    accuracy: []
  };

  // Latency Test
  const latencyTest = async () => {
    const startTime = performance.now();
    await provider.makeRequest(config.testPrompt);
    return performance.now() - startTime;
  };

  // Throughput Test
  const throughputTest = async () => {
    const requests = Array(100).fill(config.testPrompt);
    const startTime = performance.now();
    await Promise.all(requests.map(r => provider.makeRequest(r)));
    return (requests.length / (performance.now() - startTime)) * 1000;
  };

  // Accuracy Test
  const accuracyTest = async () => {
    const responses = await Promise.all(
      config.testCases.map(tc => provider.makeRequest(tc.prompt))
    );
    return responses.filter((r, i) => 
      r.match(config.testCases[i].expectedPattern)
    ).length / responses.length;
  };

  // Run tests
  results.latency = await runTestSuite(latencyTest, config.iterations);
  results.throughput = await runTestSuite(throughputTest, config.iterations);
  results.accuracy = await runTestSuite(accuracyTest, config.iterations);

  return results;
}; 