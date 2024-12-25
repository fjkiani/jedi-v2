import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import ProcessingPipeline from './ProcessingPipeline';
import ResultsDashboard from './ResultsDashboard';

const FraudDetectionSimulator = ({ config }) => {
  const [step, setStep] = useState(0);
  const [transactionData, setTransactionData] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {config.steps.map((s, i) => (
          <div 
            key={s.id}
            className={`h-2 rounded-full flex-1 transition-colors ${
              i <= step ? 'bg-primary-1' : 'bg-n-6'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="p-6 rounded-xl bg-n-7">
        {step === 0 && (
          <TransactionForm 
            fields={config.steps[0].interactive.fields}
            onChange={setTransactionData}
            onSubmit={() => setStep(1)}
          />
        )}
        
        {step === 1 && (
          <ProcessingPipeline
            stages={config.steps[1].visualization.stages}
            data={transactionData}
            onComplete={(result) => {
              setSimulationResult(result);
              setStep(2);
            }}
          />
        )}
        
        {step === 2 && (
          <ResultsDashboard
            result={simulationResult}
            panels={config.steps[2].visualization.panels}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(Math.min(2, step + 1))}
          disabled={step === 2}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FraudDetectionSimulator;
