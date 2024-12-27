import { Icon } from '@/components/Icon';

export const SectionNavigation = ({ sections, selectedSection, onSectionChange }) => (
  <div className="flex flex-wrap gap-2">
    {sections.map((section) => (
      <button
        key={section.id}
        onClick={() => onSectionChange(section.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg 
          text-sm font-medium transition-colors duration-200
          ${selectedSection === section.id 
            ? 'bg-primary-1 text-n-1' 
            : 'text-n-3 hover:text-n-1 hover:bg-n-7'}`}
      >
        <Icon name={section.icon} className="w-5 h-5" />
        {section.label}
      </button>
    ))}
  </div>
); 