import { Icon } from '@/components/Icon';

export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="border-b border-n-6 p-4">
    <div className="flex gap-2">
      {Object.values(tabs).map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg 
            text-sm font-medium transition-colors duration-200
            ${activeTab === tab.id 
              ? 'bg-primary-1 text-n-1' 
              : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
        >
          <Icon name={tab.icon} className="w-5 h-5" />
          {tab.id}
        </button>
      ))}
    </div>
  </div>
); 