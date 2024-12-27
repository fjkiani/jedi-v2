export const generateDiscoveries = (useCaseId) => {
  // Generate discoveries based on use case ID
  const discoveryData = {
    "risk-assessment": {
      title: "Risk Model Performance",
      steps: [
        "Evaluated 5 ML model architectures",
        "Processed 2M historical transactions",
        "Implemented A/B testing framework"
      ],
      highlight: "✨ 96% Risk Assessment Accuracy",
      points: [
        "Reduced false positives by 45%",
        "Improved detection speed by 3x",
        "Enhanced regulatory compliance"
      ]
    },
    "trading-agent": {
      // Trading agent specific discoveries
    },
    "research-assistant": {
      // Research assistant specific discoveries
    }
  };

  return [discoveryData[useCaseId]].filter(Boolean);
};

export const generateValidation = (useCaseId) => {
  // Generate validation data based on use case ID
  const validationData = {
    "risk-assessment": {
      steps: [
        "Cross-validated with historical data",
        "Stress-tested with synthetic scenarios",
        "Validated against industry benchmarks"
      ],
      highlight: "✨ 92% Model Reliability",
      points: [
        "Tested across 10 market scenarios",
        "Validated by risk management teams",
        "Meets Basel III requirements"
      ]
    },
    // Add other use case validations...
  };

  return validationData[useCaseId];
}; 