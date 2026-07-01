import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Section from "../components/Section";
import PipelineDiagram from "../components/AiTraining/PipelineDiagram";
import MetricCard from "../components/AiTraining/MetricCard";
import CodeSnippet from "../components/AiTraining/CodeSnippet";
import DemoEmbed from "../components/AiTraining/DemoEmbed";
import PageBottomCTA from "../components/PageBottomCTA";
import { aiTrainingDetails } from "../constants/aiTrainingDetails";
import { useTheme } from "../context/ThemeContext";

const AiTrainingDomain = () => {
  const { domainId } = useParams();
  const domain = aiTrainingDetails.find((d) => d.id === domainId);
  const [showTechnical, setShowTechnical] = useState(false);
  const { isDarkMode } = useTheme();

  // Theme tokens — same mapping as AiTraining.jsx & CaseStudies.jsx
  const t = {
    headingText: isDarkMode ? "text-n-1" : "text-n-8",
    subheadText: isDarkMode ? "text-n-2" : "text-n-7",
    leadText: isDarkMode ? "text-n-3" : "text-n-6",
    bodyText: isDarkMode ? "text-n-4" : "text-n-5",
    mutedText: isDarkMode ? "text-n-4" : "text-n-6",
    cardBg: isDarkMode ? "bg-n-7/50" : "bg-n-1",
    cardBgSubtle: isDarkMode ? "bg-n-7/30" : "bg-n-2/50",
    cardBorder: isDarkMode ? "border-n-6" : "border-n-3",
    cardBorderSoft: isDarkMode ? "border-n-6/50" : "border-n-3/60",
    tableHeaderBg: isDarkMode ? "bg-n-7/50" : "bg-n-2/60",
    badgeBg: isDarkMode ? "bg-n-6 text-n-3" : "bg-n-3/50 text-n-7",
    dividerBorder: isDarkMode ? "border-n-6" : "border-n-3",
  };

  if (!domain) {
    return (
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container text-center">
          <h1 className={`h2 mb-4 ${t.headingText}`}>Domain not found</h1>
          <p className={`mb-6 ${t.bodyText}`}>"{domainId}" is not a valid AI training domain.</p>
          <Link to="/ai-training" className="text-color-1 hover:text-color-1/80 text-sm font-medium">
            ← Back to AI Training
          </Link>
        </div>
      </Section>
    );
  }

  // Find next/prev domains for navigation
  const currentIndex = aiTrainingDetails.findIndex((d) => d.id === domainId);
  const prevDomain = currentIndex > 0 ? aiTrainingDetails[currentIndex - 1] : null;
  const nextDomain = currentIndex < aiTrainingDetails.length - 1 ? aiTrainingDetails[currentIndex + 1] : null;

  return (
    <>
      <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
        <div className="container relative">

          {/* ── 1. Hero ── */}
          <div className="max-w-4xl mx-auto mb-12">
            <Link
              to="/ai-training"
              className={`inline-flex items-center gap-2 text-sm font-code hover:text-color-1 transition-colors mb-8 ${t.bodyText}`}
            >
              ← Back to AI Training
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-3xl`}
                >
                  {domain.icon}
                </div>
                <div>
                  <h1 className={`h1 ${t.headingText}`}>{domain.title}</h1>
                  <p className="text-color-1 text-sm font-code mt-1">{domain.tagline}</p>
                </div>
              </div>
              <p className={`body-1 max-w-3xl ${t.bodyText}`}>{domain.description}</p>
            </motion.div>
          </div>

          {/* ── 2. Problem & Approach ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className={`font-code text-sm uppercase tracking-wider mb-4 ${t.headingText}`}>
                  The Problem
                </h2>
                <p className={`body-2 mb-4 leading-relaxed ${t.leadText}`}>
                  {domain.problem.lead}
                </p>
                <ul className="space-y-2">
                  {domain.problem.points.map((point, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm leading-relaxed ${t.bodyText}`}>
                      <span className="text-color-1 mt-1.5 flex-shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className={`font-code text-sm uppercase tracking-wider mb-4 ${t.headingText}`}>
                  The Approach
                </h2>
                <p className={`body-2 mb-4 leading-relaxed ${t.leadText}`}>
                  {domain.approach.lead}
                </p>
                <ul className="space-y-2">
                  {domain.approach.points.map((point, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm leading-relaxed ${t.bodyText}`}>
                      <span className="text-color-1 mt-1.5 flex-shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* ── 3. Live Demo ── */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className={`font-code text-sm uppercase tracking-wider mb-4 ${t.headingText}`}>
              Demo & Results
            </h2>
            <DemoEmbed
              url={domain.demoUrl}
              title={domain.title}
              repoUrl={domain.repoUrl}
              resultImages={domain.resultImages}
              demoPaused={domain.demoPaused}
            />
          </div>

          {/* ── 4. Results & Metrics ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className={`font-code text-sm uppercase tracking-wider mb-4 ${t.headingText}`}>
              Results & Metrics
            </h2>

            {/* Metric cards */}
            <div className="flex flex-wrap gap-3 mb-8">
              {domain.metrics.map((m, i) => (
                <MetricCard key={i} label={m.label} value={m.value} />
              ))}
            </div>

            {/* Training history */}
            {domain.trainingHistory && domain.trainingHistory.length > 0 && (
              <div className={`rounded-xl border ${t.cardBorder} ${t.cardBg} overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${t.cardBorder}`}>
                  <span className={`font-code text-sm ${t.headingText}`}>Training History</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b ${t.cardBorder}`}>
                        {domain.trainingHistory[0].epoch !== undefined && (
                          <>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Epoch</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Train Loss</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Train Acc</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Val Loss</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Val Acc/IoU</th>
                          </>
                        )}
                        {domain.trainingHistory[0].note && (
                          <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Notes</th>
                        )}
                        {domain.trainingHistory[0].train_samples && (
                          <>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Train</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Val</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Test</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Val Acc</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Test Acc</th>
                          </>
                        )}
                        {domain.trainingHistory[0].model && (
                          <>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Model</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Parameters</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Pretrained On</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {domain.trainingHistory.map((row, i) => (
                        <tr key={i} className={`border-b ${t.cardBorderSoft} last:border-0`}>
                          {row.epoch !== undefined && (
                            <>
                              <td className={`px-4 py-2 font-code ${t.subheadText}`}>{row.epoch}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.train_loss}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.train_acc}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.val_loss}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.val_acc || row.val_iou}</td>
                            </>
                          )}
                          {row.note && (
                            <td className={`px-4 py-3 ${t.leadText}`} colSpan={5}>{row.note}</td>
                          )}
                          {row.train_samples && (
                            <>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.train_samples}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.val_samples}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.test_samples}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.val_acc}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.test_acc}</td>
                            </>
                          )}
                          {row.model && (
                            <>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.model}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.parameters}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{row.pretrained_on}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ── 5. Pipeline Architecture ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className={`font-code text-sm uppercase tracking-wider mb-4 ${t.headingText}`}>
              Pipeline Architecture
            </h2>
            <PipelineDiagram steps={domain.pipeline} color={domain.color} />
          </div>

          {/* ── 6. Technical Details (expandable) ── */}
          <div className="max-w-4xl mx-auto mb-16">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl ${t.cardBg} border ${t.cardBorder} hover:border-color-1/40 transition-colors`}
            >
              <span className={`font-code text-sm uppercase tracking-wider ${t.headingText}`}>
                Technical Details
              </span>
              <span className={`text-sm ${t.bodyText}`}>
                {showTechnical ? "▲ Hide" : "▼ Show"}
              </span>
            </button>

            {showTechnical && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-8"
              >
                {/* Model Architecture */}
                {domain.modelArchitecture && (
                  <div className={`rounded-xl border ${t.cardBorder} ${t.cardBgSubtle} p-6`}>
                    <h3 className={`font-code text-sm mb-4 ${t.headingText}`}>Model Architecture</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Object.entries(domain.modelArchitecture).map(([key, value]) => (
                        <div key={key}>
                          <span className={`text-xs uppercase tracking-wider capitalize ${t.bodyText}`}>
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                          </span>
                          <p className={`text-sm mt-1 ${t.subheadText}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Walkthrough */}
                {domain.technicalDetails?.codeSnippets?.map((snippet, i) => (
                  <div key={i}>
                    <h3 className={`font-code text-sm mb-2 ${t.headingText}`}>{snippet.title}</h3>
                    <CodeSnippet code={snippet.code} />
                  </div>
                ))}

                {/* Dependencies */}
                {domain.technicalDetails?.dependencies && (
                  <div>
                    <h3 className={`font-code text-sm mb-3 ${t.headingText}`}>Dependencies</h3>
                    <div className={`rounded-xl border ${t.cardBorder} overflow-hidden`}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`border-b ${t.cardBorder} ${t.tableHeaderBg}`}>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Package</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Version</th>
                            <th className={`px-4 py-2 text-left font-code ${t.bodyText}`}>Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {domain.technicalDetails.dependencies.map((dep, i) => (
                            <tr key={i} className={`border-b ${t.cardBorderSoft} last:border-0`}>
                              <td className={`px-4 py-2 font-code ${t.subheadText}`}>{dep.name}</td>
                              <td className={`px-4 py-2 font-code ${t.leadText}`}>{dep.version}</td>
                              <td className={`px-4 py-2 ${t.leadText}`}>{dep.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Training Config */}
                {domain.technicalDetails?.trainingConfig && (
                  <div>
                    <h3 className={`font-code text-sm mb-3 ${t.headingText}`}>Training Configuration</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(domain.technicalDetails.trainingConfig).map(([key, value]) => (
                        <div key={key} className={`p-3 rounded-lg border ${t.cardBg} ${t.cardBorder}`}>
                          <span className={`text-xs uppercase tracking-wider capitalize ${t.bodyText}`}>
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                          </span>
                          <p className={`text-sm mt-1 ${t.subheadText}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open Source Credits */}
                {domain.credits && domain.credits.length > 0 && (
                  <div>
                    <h3 className={`font-code text-sm mb-3 ${t.headingText}`}>Open Source Credits</h3>
                    <div className="space-y-2">
                      {domain.credits.map((credit, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${t.cardBg} ${t.cardBorder}`}>
                          <div>
                            <a
                              href={credit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm font-code hover:text-color-1 transition-colors ${t.subheadText}`}
                            >
                              {credit.name}
                            </a>
                            <p className={`text-xs mt-0.5 ${t.bodyText}`}>{credit.usage}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-code ${t.badgeBg}`}>
                            {credit.license}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* ── 7. Links & Navigation ── */}
          <div className="max-w-4xl mx-auto">
            {/* Repo + HF links */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href={domain.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-color-1 text-n-8 font-code font-semibold text-sm hover:bg-color-1/90 transition-colors"
              >
                View Source Code →
              </a>
              <a
                href={domain.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-code text-sm hover:border-color-1/40 transition-colors ${t.cardBorder} ${t.subheadText}`}
              >
                Open Live Demo ↗
              </a>
            </div>

            {/* Prev/Next navigation */}
            <div className={`flex items-center justify-between pt-8 border-t ${t.dividerBorder}`}>
              {prevDomain ? (
                <Link
                  to={`/ai-training/${prevDomain.id}`}
                  className="flex items-center gap-3 group"
                >
                  <span className={`text-sm ${t.bodyText}`}>←</span>
                  <div>
                    <span className={`text-xs uppercase tracking-wider ${t.bodyText}`}>Previous</span>
                    <p className={`text-sm group-hover:text-color-1 transition-colors ${t.subheadText}`}>
                      {prevDomain.icon} {prevDomain.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextDomain ? (
                <Link
                  to={`/ai-training/${nextDomain.id}`}
                  className="flex items-center gap-3 group text-right"
                >
                  <div>
                    <span className={`text-xs uppercase tracking-wider ${t.bodyText}`}>Next</span>
                    <p className={`text-sm group-hover:text-color-1 transition-colors ${t.subheadText}`}>
                      {nextDomain.title} {nextDomain.icon}
                    </p>
                  </div>
                  <span className={`text-sm ${t.bodyText}`}>→</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </Section>

      <PageBottomCTA
        eyebrow={`Ship a ${domain?.title || 'domain'} model`}
        title="Bring this pipeline to your data"
        description="Same training loop, same evaluation harness, same deployment pattern — adapted to your dataset and your infra."
        primary={{ label: 'Scope an engagement', href: `/contact?inquiry=training-${domainId}` }}
        secondary={{ label: 'View the code', href: `https://github.com/fjkiani/ai-training/tree/main/domains/${domainId}` }}
      />
    </>
  );
};

export default AiTrainingDomain;
