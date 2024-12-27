import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import AIResponse from '@/components/response/AIResponse';

const LoadingState = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-1"></div>
      <span className="ml-3 text-n-3">Generating response...</span>
    </div>
  );
};

const ResponseDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-6">
      <AIResponse response={result} />
    </div>
  );
};

export const OverviewTab = ({ 
  useCaseData, 
  queries, 
  runIndustryDemo,
  useCaseState 
}) => (
  <div className="space-y-8">
    {/* Title and Description */}
    <div className="text-center">
      <h2 className="h2 mb-4">{useCaseData?.title || 'Fraud Detection'}</h2>
      <p className="text-n-3 text-lg">{useCaseData?.description}</p>
    </div>

    {/* Sample Queries Section */}
    <QuerySection 
      queries={queries}
      runIndustryDemo={runIndustryDemo}
      useCaseState={useCaseState}
    />

    {/* Value Cards Section */}
    <ValueCardsSection useCaseData={useCaseData} />
  </div>
);

const QuerySection = ({ queries, runIndustryDemo, useCaseState }) => (
  queries.length > 0 && (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6">
      <h3 className="text-xl font-semibold mb-4">Try Example Queries</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {queries.map((sample, index) => (
          <button
            key={index}
            onClick={() => runIndustryDemo(sample)}
            disabled={useCaseState.loading}
            className={`text-left p-4 rounded-lg bg-n-8 border border-n-6 
              ${useCaseState.loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-1'} 
              transition-colors duration-200`}
          >
            <p className="text-n-1">{sample}</p>
          </button>
        ))}
      </div>

      <LoadingState loading={useCaseState.loading} />
      <ResponseDisplay result={useCaseState.result} />
    </div>
  )
);

const ValueCardsSection = ({ useCaseData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {useCaseData?.valueCards?.map((card, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-n-7 rounded-xl p-6 border border-n-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Icon name={card.icon} className="w-6 h-6 text-primary-1" />
          <h4 className="text-lg font-semibold">{card.title}</h4>
        </div>
        <p className="text-n-3">{card.description}</p>
      </motion.div>
    ))}
  </div>
); 