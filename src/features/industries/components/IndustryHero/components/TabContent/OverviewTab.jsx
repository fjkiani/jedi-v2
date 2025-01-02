import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import AIResponse from '@/components/response/AIResponse';

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
            className="text-left p-4 rounded-lg bg-n-8 border border-n-6 
              hover:border-primary-1 transition-colors duration-200"
          >
            <p className="text-n-1">{sample}</p>
          </button>
        ))}
      </div>

      {useCaseState.loading && (
        <div className="mt-6 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
        </div>
      )}

      {useCaseState.result && !useCaseState.loading && (
        <div className="mt-6">
          <AIResponse response={useCaseState.result} variant="industry" />
        </div>
      )}
    </div>
  )
);

const ValueCardsSection = ({ useCaseData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {useCaseData?.valueProposition?.map((value, index) => (
      <div 
        key={index}
        className="bg-n-8 rounded-xl p-6 border border-n-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Icon name={value.icon} className="w-6 h-6 text-primary-1" />
          <h4 className="text-lg font-semibold text-n-1">{value.title}</h4>
        </div>
        <p className="text-n-3">{value.description}</p>
      </div>
    ))}
  </div>
);

const ResponseDisplay = ({ result }) => (
  result && (
    <div className="mt-6">
      <AIResponse response={result} variant="industry" />
    </div>
  )
); 