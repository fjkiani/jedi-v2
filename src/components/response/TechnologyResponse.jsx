import { motion } from 'framer-motion';

const TechnologyResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-n-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary-1 animate-pulse" />
            <h3 className="text-lg font-semibold text-n-1">
              {response.header?.title || response.title || 'AI Analysis'}
            </h3>
          </div>
          <div className="text-xs text-n-3">
            Powered by Industry AI
          </div>
        </div>
        {response.header?.query && (
          <p className="text-n-3 mt-2">{response.header.query}</p>
        )}
      </div>

      {/* Content */}
      <div className="divide-y divide-n-6">
        {response.sections?.map((section, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl text-primary-1">{section.icon}</span>
              <h4 className="text-lg font-semibold text-n-1">{section.title}</h4>
            </div>

            <div className="space-y-6">
              {section.description && (
                <div className="p-4 rounded-lg bg-n-7 border border-n-6">
                  <p className="text-n-3">{section.description}</p>
                </div>
              )}

              {section.subsections?.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h5 className="text-lg font-medium text-white mb-3">{subsection.title}</h5>
                  {Array.isArray(subsection.content) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subsection.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 bg-n-7 rounded-lg border border-n-6 hover:border-primary-1 transition-colors">
                          <div className="whitespace-pre-wrap text-n-3">
                            {typeof item === 'string' ? (
                              item
                            ) : (
                              <>
                                {item.name && <div className="font-medium text-white mb-2">{item.name}</div>}
                                {item.description && <div className="mb-2">{item.description}</div>}
                                {item.details && Array.isArray(item.details) && (
                                  <ul className="list-disc list-inside space-y-1">
                                    {item.details.map((detail, detailIndex) => (
                                      <li key={detailIndex}>{detail}</li>
                                    ))}
                                  </ul>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-n-7 rounded-lg border border-n-6">
                      <div className="whitespace-pre-wrap text-n-3">{subsection.content}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {response.footer && (
        <div className="border-t border-n-6 p-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4">
              {response.footer.metrics && (
                <>
                  <div>
                    <p className="text-sm text-n-3">Confidence</p>
                    <p className="text-white">{response.footer.metrics.confidence}</p>
                  </div>
                  <div>
                    <p className="text-sm text-n-3">Data Points</p>
                    <p className="text-white">{response.footer.metrics.dataPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-n-3">Processing Time</p>
                    <p className="text-white">{response.footer.metrics.processingTime}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {response.footer.certifications?.map((cert, index) => (
                <span key={index} className="px-2 py-1 bg-n-7 rounded text-sm text-n-1">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyResponse; 