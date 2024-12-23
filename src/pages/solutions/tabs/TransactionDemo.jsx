import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

const TransactionDemo = ({ transactions, onAnalyze }) => {
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (transaction) => {
    setIsAnalyzing(true);
    setActiveTransaction(transaction);

    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const riskScore = Math.random();
    const analysisResult = {
      transaction,
      riskScore,
      status: riskScore > 0.7 ? 'HIGH_RISK' : riskScore > 0.3 ? 'MEDIUM_RISK' : 'LOW_RISK',
      patterns: ['Amount analysis', 'Location check', 'Merchant verification'],
      timestamp: new Date().toISOString()
    };
    
    setIsAnalyzing(false);
    onAnalyze?.(analysisResult);
    return analysisResult;
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <div key={index} className="p-4 rounded-lg bg-n-7">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-n-1 mb-1">{transaction.merchant}</h4>
              <p className="text-sm text-n-3">{transaction.location}</p>
            </div>
            <div className="text-right">
              <div className="text-xl text-primary-1">${transaction.amount}</div>
              <div className="text-sm text-n-3">{transaction.type}</div>
            </div>
          </div>
          
          <button
            onClick={() => handleAnalyze(transaction)}
            disabled={isAnalyzing}
            className="button button-primary w-full"
          >
            {isAnalyzing && activeTransaction?.id === transaction.id 
              ? 'Analyzing...' 
              : 'Analyze Transaction'
            }
          </button>

          {activeTransaction?.id === transaction.id && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded bg-n-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon name="shield-check" className="w-5 h-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-n-3">Risk Score</div>
                  <div className="text-lg font-medium">
                    {(Math.random() * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-n-3">Processing Time</div>
                  <div className="text-lg font-medium">98ms</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionDemo;