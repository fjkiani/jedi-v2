export const ProgressNav = ({ sections, activeSection, onSectionChange }) => (
  <div className="flex items-center justify-between px-4 sticky top-[120px] z-10 bg-n-8/80 backdrop-blur-sm py-2 rounded-lg border border-n-6">
    {sections.map((section, idx) => (
      <button
        key={idx}
        onClick={() => onSectionChange(idx)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all
          ${activeSection === idx ? 'bg-primary-1 text-white' : 'text-n-3 hover:text-white'}`}
      >
        <span className="text-lg">{section.icon}</span>
        <span className="text-sm font-medium">{section.title}</span>
      </button>
    ))}
  </div>
); 