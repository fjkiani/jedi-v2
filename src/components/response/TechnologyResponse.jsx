import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Icon } from '@/components/Icon';

const TechnologyResponse = ({ response }) => {
  const renderContent = (subsection) => {
    if (subsection.type === "reactflow") {
      return (
        <div className="h-[400px] bg-n-7 rounded-lg p-4">
          <ReactFlow 
            nodes={subsection.content.nodes}
            edges={subsection.content.edges}
            fitView
            className="react-flow-dark"
          >
            <Background color="#4b5563" gap={16} />
            <Controls className="react-flow-controls" />
            <MiniMap className="react-flow-minimap" />
          </ReactFlow>
        </div>
      );
    }

    // Handle regular content
    if (Array.isArray(subsection.content)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsection.content.map((item, idx) => (
            <div key={idx} className="p-4 bg-n-7 rounded-lg border border-n-6 hover:border-primary-1 transition-colors">
              <div className="whitespace-pre-wrap text-n-3">
                {typeof item === 'string' ? (
                  item
                ) : (
                  <>
                    {item.name && (
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon && <span className="text-xl">{item.icon}</span>}
                        <div className="font-medium text-white">{item.name}</div>
                      </div>
                    )}
                    {item.description && (
                      <div className="text-n-3 mb-2">{item.description}</div>
                    )}
                    {item.value && (
                      <div className="text-lg font-medium text-primary-1 mt-1">
                        {item.value}
                      </div>
                    )}
                    {item.details && Array.isArray(item.details) && item.details.length > 0 && (
                      <div className="space-y-1 text-n-3 opacity-70">
                        {item.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start">
                            <span className="mr-2">🔹</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center gap-1 px-2 py-1 bg-n-6 rounded text-xs">
                            <span>{tech.icon}</span>
                            <span className="text-primary-1">{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="p-4 bg-n-7 rounded-lg border border-n-6">
        <div className="whitespace-pre-wrap text-n-3">{subsection.content}</div>
      </div>
    );
  };

  return (
    <div className="bg-n-8 rounded-xl border border-n-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-n-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary-1 animate-pulse" />
            <h3 className="text-lg font-semibold text-n-1">
              {response.header?.title || 'AI Analysis'}
            </h3>
          </div>
          <div className="text-xs text-n-3">
            Powered by Technology AI
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
                  {renderContent(subsection)}
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