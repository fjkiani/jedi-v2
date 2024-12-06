import { Icon } from '@/components/Icon';

const TechHeader = ({ config }) => {
  if (!config) return null;

  return (
    <div className="bg-n-8 rounded-2xl p-8 mb-12">
      {/* Header Section */}
      <div className="flex items-center gap-6 mb-6">
        {config.icon && (
          <img 
            src={config.icon} 
            alt={config.name} 
            className="w-16 h-16 object-contain"
          />
        )}
        <div>
          <h1 className="h1 mb-2">{config.name}</h1>
          <p className="text-n-3">{config.description}</p>
        </div>
      </div>

      {/* Expertise Section - Only render if expertise exists */}
      {config.expertise && config.expertise.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-n-7 rounded-xl p-6">
            <h3 className="font-semibold mb-4">JediLabs Expertise</h3>
            <ul className="space-y-2">
              {config.expertise.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-primary-1" />
                  <span className="text-n-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info Cards - Optional */}
          {config.additionalInfo && (
            <>
              <div className="bg-n-7 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Integration Capabilities</h3>
                <ul className="space-y-2">
                  {config.additionalInfo.integration?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="check" className="w-4 h-4 text-primary-1" />
                      <span className="text-n-3">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-n-7 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Enterprise Features</h3>
                <ul className="space-y-2">
                  {config.additionalInfo.enterprise?.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="check" className="w-4 h-4 text-primary-1" />
                      <span className="text-n-3">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TechHeader; 