import { motion } from 'framer-motion';

export const Header = ({ model, icon, title, query, responseId, timestamp, capabilities }) => (
  <div className="bg-n-8 rounded-lg p-6 sticky top-4 z-10 border border-n-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div>
          <h4 className="text-white font-medium">JediLabs AI Analysis</h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-n-3">Powered by</span>
            <span className="text-xs text-primary-1">{model.name}</span>
            <span className="text-xs text-n-3">|</span>
            <span className="text-xs text-n-3">{model.version}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs text-n-3 block">Response ID: {responseId}</span>
        <span className="text-xs text-n-3 block mt-1">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-medium text-white">{title}</h2>
    </div>
    
    <p className="text-n-3 mt-2">Analyzing: "{query}"</p>
    
    <div className="flex flex-wrap gap-2 mt-4">
      {capabilities.map((capability, idx) => (
        <span key={idx} className="px-2 py-1 bg-n-7 rounded-full text-xs text-n-3">
          {capability}
        </span>
      ))}
    </div>
  </div>
); 