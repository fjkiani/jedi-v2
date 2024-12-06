import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

const UseCasesList = ({ useCases, selectedUseCase }) => {
  if (!useCases || useCases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-n-3">No use cases available for this technology.</p>
      </div>
    );
  }

  const displayedUseCases = selectedUseCase
    ? useCases.filter(useCase => useCase.type === selectedUseCase)
    : useCases;

  return (
    <div className="space-y-12">
      {displayedUseCases.map((useCase, index) => (
        <motion.div 
          key={useCase.type || index}
          id={useCase.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-n-7 rounded-xl p-8 border border-n-6"
        >
          <h2 className="h3 mb-6">{useCase.title}</h2>
          
          <div className="space-y-8">
            {/* Overview */}
            <div>
              <h3 className="h4 mb-4">Overview</h3>
              <p className="text-n-3">{useCase.implementation?.overview}</p>
            </div>

            {/* Tech Stack */}
            {useCase.implementation?.techStack && (
              <div>
                <h3 className="h4 mb-4">Implementation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(useCase.implementation.techStack).map(([techId, details]) => (
                    <div key={techId} className="bg-n-6 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-2">{techId}</h4>
                      <p className="text-n-3 mb-4">{details.role}</p>
                      {details.features && (
                        <ul className="space-y-2">
                          {details.features.map((feature, i) => (
                            <li key={i} className="text-sm text-n-4 flex items-center gap-2">
                              <Icon name="check" className="w-4 h-4 text-primary-1" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {useCase.implementation?.benefits && (
              <div>
                <h3 className="h4 mb-4">Benefits</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {useCase.implementation.benefits.map((benefit, i) => (
                    <div key={i} className="bg-n-6 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Icon 
                          name={typeof benefit === 'object' ? benefit.icon : 'check'} 
                          className="w-5 h-5 text-primary-1" 
                        />
                        <div>
                          {typeof benefit === 'object' ? (
                            <>
                              <h4 className="font-semibold text-white">{benefit.title}</h4>
                              <p className="text-n-3 text-sm">{benefit.description}</p>
                            </>
                          ) : (
                            <span className="text-n-2">{benefit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Applications */}
            {useCase.implementation?.industryApplications && (
              <div>
                <h3 className="h4 mb-4">Industry Applications</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(useCase.implementation.industryApplications).map(([industry, details]) => (
                    <div key={industry} className="bg-n-6 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2 capitalize">{industry}</h4>
                      <p className="text-n-3 mb-2">{details.useCase}</p>
                      <p className="text-primary-1 text-sm">{details.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UseCasesList; 