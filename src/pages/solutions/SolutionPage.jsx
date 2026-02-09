import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSolutionBySlug, getAllSolutions } from '@/constants/solutions';
import { aiAgentsSolution } from '@/constants/solutions/ai-agents';
import { aiMlSolution } from '@/constants/solutions/ai-ml';
import { dataEngineeringSolution } from '@/constants/solutions/data-engineering';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import SolutionArchitecture from '@/components/solutions/SolutionArchitecture';
import TechStoryTopology from '@/components/solutions/TechStoryTopology';
import ZetaStrategyBrief from '@/components/solutions/ZetaStrategyBrief';
import ZetaSimulation from '@/components/solutions/ZetaSimulation';
import 'reactflow/dist/style.css';
import { hygraphClient } from '@/lib/hygraph';
import UseCaseCard from '@/components/UseCaseCard';
import parse from 'html-react-parser';
import { FiAlertTriangle, FiAward, FiCode } from 'react-icons/fi';
import Heading from '@/components/Heading';
import { GET_SOLUTION_BY_SLUG } from '@/graphql/queries/solutions';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Static fallback for ai-ml when Hygraph returns empty doctrine fields (e.g. different project)
const AI_ML_DOCTRINE_FALLBACK = {
  tagline: 'Predictive Power at Scale',
  problemStatement: { html: '<p><strong>Pattern Blindness:</strong> Subtle trends lost in noise.<br/><strong>Manual Toil:</strong> High-value staff wasting time on low-value classification tasks.<br/><strong>Reactive Strategy:</strong> Making decisions based on what happened, not what will happen.</p>' },
  valueProposition: { html: '<p><strong>Forecast Precision:</strong> Predict demand, churn, and risk with high confidence.<br/><strong>Cognitive Automation:</strong> Systems that see (Computer Vision) and read (NLP) like humans.<br/><strong>Continuous Improvement:</strong> Models that get smarter with every data point ingested.</p>' },
  technologyNarrative: { html: '<p>We deploy state-of-the-art models using <strong>TensorFlow</strong> and <strong>PyTorch</strong>. Our ML Ops pipeline, built on <strong>Kubeflow</strong> and <strong>MLflow</strong>, ensures that models are not just experiments but reliable, versioned, and monitored production assets.</p>' },
  keyOutcomes: { html: '<p><strong>98.5%</strong> classification accuracy on unstructured text.<br/><strong>50x</strong> faster processing than human review.<br/><strong>Auto-scaling</strong> inference infrastructure handling 10k+ RPM.</p>' }
};

const swiperNavStyles = `
  .solution-use-cases-swiper .swiper-button-prev,
  .solution-use-cases-swiper .swiper-button-next {
    color: var(--swiper-navigation-color, inherit);
    width: 28px; height: 28px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.2s;
    top: calc(50% - 14px); /* Adjust vertical position */
  }
  .solution-use-cases-swiper .swiper-button-prev:hover,
  .solution-use-cases-swiper .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .solution-use-cases-swiper .swiper-button-prev::after,
  .solution-use-cases-swiper .swiper-button-next::after {
    font-size: 12px; font-weight: bold;
  }
  .solution-use-cases-swiper .swiper-button-prev { left: 8px; }
  .solution-use-cases-swiper .swiper-button-next { right: 8px; }
  .solution-use-cases-swiper .swiper-pagination-bullet {
    background-color: var(--swiper-pagination-bullet-inactive-color, #ccc);
    opacity: 0.7;
  }
  .solution-use-cases-swiper .swiper-pagination-bullet-active {
    background-color: var(--swiper-pagination-color, #007aff);
    opacity: 1;
  }
`;

const SolutionPage = () => {
  const { slug } = useParams();
  // Initial state (doctrine fallback for ai-ml so tagline/Problem/ValueProp show immediately): merge doctrine fallback for ai-ml so tagline/Problem/ValueProp/etc show immediately
  const staticSolution = getSolutionBySlug(slug);
  const initialSolution = slug?.includes('ai-ml')
    ? { ...staticSolution, ...AI_ML_DOCTRINE_FALLBACK }
    : staticSolution;
  const [solution, setSolution] = useState(initialSolution);
  const navigate = useNavigate();
  const [useCases, setUseCases] = useState([]);
  const [strategyIntel, setStrategyIntel] = useState(null);
  const [simulationSource, setSimulationSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { isDarkMode } = useTheme();

  const themeAwareSwiperNavStyles = swiperNavStyles.replace(
    'var(--swiper-navigation-color, inherit)',
    isDarkMode ? '#FFFFFF' : '#000000'
  ).replace(
    'var(--swiper-pagination-color, #007aff)',
    isDarkMode ? '#8E55EA' : '#6C2BD9'
  ).replace(
    'var(--swiper-pagination-bullet-inactive-color, #ccc)',
    isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setStrategyIntel(null);
        setSimulationSource(null);

        let targetSlug = slug;

        // --- 1. Fetch Dynamic Solution Data (Categories & Technologies) ---
        try {
          console.log(`[SolutionPage] Fetching solution data for slug: ${targetSlug}`);
          // Initial attempt with exact slug
          let solutionData = await hygraphClient.request(GET_SOLUTION_BY_SLUG, { slug: targetSlug }, { skipCache: true });

          // If exact match fails (e.g. ai-ml-solutions vs ai-ml), try simpler slug
          if ((!solutionData.categories || solutionData.categories.length === 0) && targetSlug.includes('-solutions')) {
            targetSlug = targetSlug.replace('-solutions', '');
            console.log(`[SolutionPage] Retrying with slug: ${targetSlug}`);
            solutionData = await hygraphClient.request(GET_SOLUTION_BY_SLUG, { slug: targetSlug }, { skipCache: true });
          }

          if (solutionData.categories && solutionData.categories.length > 0) {
            const fetchedCategory = solutionData.categories[0];
            const fetchedTechnologies = solutionData.technologies || [];

            const relatedCases = solutionData.relatedUseCases || [];

            // EXTRACT SOUL: Find the first UseCase with a valid IndustryApplication
            const soulSource = relatedCases.find(uc => uc.industryApplication);

            if (soulSource) {
              console.log("[SolutionPage] Strategy Intel Found:", soulSource.industryApplication.applicationTitle);
              setStrategyIntel({
                ...soulSource.industryApplication,
                sourceTitle: soulSource.title
              });
            }



            console.log("[SolutionPage] Hygraph Data Found:", {
              category: fetchedCategory,
              techCount: fetchedTechnologies.length,
              relatedCasesCount: relatedCases.length
            });

            // Transform Flat Technologies into Tech Stack Map (Grouped by Subcategory)
            let techStackMap = {};

            if (slug === 'ai-agents') {
              console.log("[SolutionPage] AI Agents detected: Using Hardcoded Tech Stack.");
              // FLATTEN static tech stack: { category: { TechName: { ... } } }
              Object.values(aiAgentsSolution.techStack).forEach(group => {
                Object.entries(group).forEach(([techName, details]) => {
                  const subcat = details.category || 'General';
                  if (!techStackMap[subcat]) techStackMap[subcat] = {};
                  techStackMap[subcat][techName] = {
                    icon: details.icon,
                    category: subcat
                  };
                });
              });
            } else {
              fetchedTechnologies.forEach(tech => {
                if (tech.subcategories && tech.subcategories.length > 0) {
                  tech.subcategories.forEach(sub => {
                    if (!techStackMap[sub.name]) {
                      techStackMap[sub.name] = {};
                    }
                    techStackMap[sub.name][tech.name] = {
                      icon: tech.icon,
                      category: sub.name,
                      slug: tech.slug
                    };
                  });
                } else {
                  const fallbackCat = "General Technology";
                  if (!techStackMap[fallbackCat]) techStackMap[fallbackCat] = {};
                  techStackMap[fallbackCat][tech.name] = {
                    icon: tech.icon,
                    category: "Technology",
                    slug: tech.slug
                  };
                }
              });
            }

            // Use doctrine fallback for ai-ml when Hygraph fields are empty (e.g. different project)
            const doctrineFallback = (slug?.includes('ai-ml')) ? AI_ML_DOCTRINE_FALLBACK : {};
            const tagline = fetchedCategory.tagline || doctrineFallback.tagline;
            const problemStatement = fetchedCategory.problemStatement?.html ? fetchedCategory.problemStatement : doctrineFallback.problemStatement;
            const valueProposition = fetchedCategory.valueProposition?.html ? fetchedCategory.valueProposition : doctrineFallback.valueProposition;
            const technologyNarrative = fetchedCategory.technologyNarrative?.html ? fetchedCategory.technologyNarrative : doctrineFallback.technologyNarrative;
            const keyOutcomes = fetchedCategory.keyOutcomes?.html ? fetchedCategory.keyOutcomes : doctrineFallback.keyOutcomes;

            setSolution(prev => ({
              ...prev,
              title: (slug === 'ai-agents') ? aiAgentsSolution.title : (fetchedCategory.name || prev?.title),
              description: (slug === 'ai-agents') ? aiAgentsSolution.description : (fetchedCategory.description || prev?.description),
              techStack: Object.keys(techStackMap).length > 0 ? techStackMap : prev?.techStack,
              id: fetchedCategory.id,
              tagline,
              problemStatement,
              valueProposition,
              technologyNarrative,
              keyOutcomes,
              heroImage: fetchedCategory.heroImage
            }));

            // OVERRIDE STRATEGY INTEL for AI Agents (Moved specific override here)
            if (slug === 'ai-agents') {
              setStrategyIntel({
                applicationTitle: "Enterprise AI Agent Ecosystem",
                industryChallenge: { html: "<p>Businesses struggle with fragmentation, scalable autonomy, and cross-system orchestration.</p>" },
                jediApproach: { html: "<p>Deploy autonomous multi-agent systems that unify tools, execute complex workflows, and self-optimize.</p>" },
                keyCapabilities: aiAgentsSolution.businessValue.capabilities,
                expectedResults: aiAgentsSolution.businessValue.metrics,
                sourceTitle: aiAgentsSolution.title
              });
            }

          } else {
            console.warn("[SolutionPage] No matching Category found in Hygraph for slug:", slug);
            // Apply doctrine fallback when no category (e.g. ai-ml with empty Hygraph)
            if (slug?.includes('ai-ml')) {
              setSolution(prev => ({
                ...prev,
                ...AI_ML_DOCTRINE_FALLBACK
              }));
            }
          }

        } catch (solErr) {
          console.warn("[SolutionPage] Failed to fetch dynamic solution data:", solErr);
        }

        // --- FALLBACK: FORCE SIMULATIONS IF MISSING (Independent of Hygraph) ---
        // We use a local variable to determine if we need to set it, checking state might be stale in same render cycle, 
        // but since we are in a useEffect, we can rely on the fact that if we haven't set it yet (or want to overwrite), we do it now.
        // Actually, checking "simulationSource" state here works if it wasn't set in this render cycle, but we just tried to set it above.
        // Better to check if we *should* have it.

        let fallbackSim = null;

        if (slug === 'ai-agents') {
          console.log("[SolutionPage] AI Agents: Ensuring Hardcoded Simulation.", aiAgentsSolution); // Added log
          fallbackSim = {
            // ... rest of object
            // ...

            title: "Enterprise AI Agent Ecosystem",
            description: "Deploy autonomous multi-agent systems that unify tools, execute complex workflows, and self-optimize.",
            architecture: {
              flow: aiAgentsSolution.architecture.nodes
                .sort((a, b) => a.x - b.x)
                .map(node => ({
                  step: node.label,
                  description: node.description,
                  details: node.technologies ? Object.keys(node.technologies).join(', ') : ''
                })),
              components: aiAgentsSolution.architecture.nodes.map(node => ({
                name: node.label,
                description: node.description,
                details: node.technologies ? JSON.stringify(node.technologies) : ''
              }))
            },
            metrics: aiAgentsSolution.businessValue.metrics,
            capabilities: aiAgentsSolution.businessValue.capabilities,
            implementation: {
              queries: aiAgentsSolution.businessValue.useCases
            }
          };
        } else if (slug.includes('ai-ml')) {
          console.log("[SolutionPage] AI/ML: Ensuring Hardcoded Simulation.");
          fallbackSim = {
            title: "Enterprise AI/ML Pipeline",
            description: "Automated document processing and predictive analytics workflow.",
            architecture: {
              flow: aiMlSolution.architecture.nodes.sort((a, b) => a.x - b.x).map(n => ({ step: n.label, description: n.description })),
              components: aiMlSolution.architecture.nodes.map(n => ({ name: n.label, description: n.description }))
            },
            metrics: aiMlSolution.businessValue.metrics,
            capabilities: aiMlSolution.businessValue.capabilities,
            implementation: { queries: aiMlSolution.businessValue.useCases }
          };
          // Ensure Strategy Intel if missing
          if (!strategyIntel) {
            setStrategyIntel({
              applicationTitle: "Intelligent Automation Suite",
              industryChallenge: { html: "<p>Manual data processing is slow, error-prone, and unscalable.</p>" },
              jediApproach: { html: "<p>Deploy custom AI models to automate workflows and extract insights at scale.</p>" },
              keyCapabilities: aiMlSolution.businessValue.capabilities,
              expectedResults: aiMlSolution.businessValue.metrics,
              sourceTitle: aiMlSolution.title
            });
          }
        } else if (slug.includes('data-engineering')) {
          console.log("[SolutionPage] Data Engineering: Ensuring Hardcoded Simulation.");
          fallbackSim = {
            title: "Real-time Data Pipeline",
            description: "End-to-end data ingestion, processing, and analytics workflow.",
            architecture: {
              flow: dataEngineeringSolution.architecture.nodes.sort((a, b) => a.x - b.x).map(n => ({ step: n.label, description: n.description })),
              components: dataEngineeringSolution.architecture.nodes.map(n => ({ name: n.label, description: n.description }))
            },
            metrics: dataEngineeringSolution.businessValue.metrics,
            capabilities: dataEngineeringSolution.businessValue.capabilities,
            implementation: { queries: dataEngineeringSolution.businessValue.useCases }
          };
          // Ensure Strategy Intel if missing
          if (!strategyIntel) {
            setStrategyIntel({
              applicationTitle: "Enterprise Data Fabric",
              industryChallenge: { html: "<p>Siloed data prevents real-time decision making and operational visibility.</p>" },
              jediApproach: { html: "<p>Unify data streams into a single source of truth with automated ETL/ELT pipelines.</p>" },
              keyCapabilities: dataEngineeringSolution.businessValue.capabilities,
              expectedResults: dataEngineeringSolution.businessValue.metrics,
              sourceTitle: dataEngineeringSolution.title
            });
          }
        }

        // Apply fallback if no dynamic source was found
        setSimulationSource(prev => prev || fallbackSim);


        // --- 2. Fetch Use Cases ---
        console.log('[SolutionPage] Fetching ALL use cases...');
        const useCaseData = await hygraphClient.request(GET_USE_CASES);
        const fetchedUseCases = useCaseData.useCases || useCaseData.useCaseS || [];
        setUseCases(fetchedUseCases);

      } catch (err) {
        console.error('[SolutionPage] Error fetching data:', err);
        setError('Error loading content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleUseCaseClick = (useCase) => {
    if (useCase?.industry?.slug && useCase.slug) {
      navigate(`/industries/${useCase.industry.slug}/${useCase.slug}`);
    }
  };

  const handleQueryClick = (useCase) => {
    if (useCase?.industry?.slug && useCase.slug) {
      navigate(`/industries/${useCase.industry.slug}/${useCase.slug}?tab=architecture`);
    }
  };

  if (!solution) {
    const availableSolutions = getAllSolutions();
    return (
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container max-w-2xl mx-auto text-center">
          <h1 className="h1 mb-2">Solution not found</h1>
          <p className={`body-1 mb-6 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            This solution page is not available. Choose one below or return to the solutions list.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {availableSolutions.map((s) => (
              <Button key={s.id} href={`/solutions/${s.slug}`} as={Link}>
                {s.title}
              </Button>
            ))}
          </div>
          <Button href="/solutions" white>Return to Solutions</Button>
        </div>
      </Section>
    );
  }

  // --- ZETA LOGIC: Metrics Calculation ---
  const activeModules = solution?.techStack
    ? Object.values(solution.techStack).reduce((acc, sub) => acc + Object.keys(sub).length, 0)
    : 0;

  // Client-side filtering as fallback until schema is fixed
  const deployedUseCases = useCases.filter(uc =>
    uc.tags?.includes(slug) || uc.title?.toLowerCase().includes(slug?.replace(/-/g, ' '))
  ).length;

  return (
    <div className={`pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden ${isDarkMode ? 'bg-n-8' : 'bg-gray-50'}`}>

      {/* Hero Section */}
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${isDarkMode ? 'bg-n-7' : 'bg-white shadow-lg'}`}>
              <Icon name={solution.icon} className="w-10 h-10 text-primary-1" />
            </div>
            <h1 className="h1 mb-3 text-n-8 dark:text-n-1">
              {solution.title}
            </h1>
            {solution.tagline && (
              <p className={`text-xl md:text-2xl font-semibold mb-6 bg-gradient-to-r from-primary-1 to-primary-2 bg-clip-text text-transparent`}>
                {solution.tagline}
              </p>
            )}
            {/* --- ZETA SYSTEM MONITOR --- */}
            <div className="flex justify-center mb-6 overflow-x-auto scrollbar-hide">
              <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-mono uppercase tracking-widest px-3 sm:px-4 py-2.5 rounded-lg shrink-0 ${isDarkMode ? 'bg-n-7/80 border border-n-6 text-primary-1' : 'bg-white/90 border border-n-3 text-primary-1 shadow-sm'}`}>
                <span>Modules: {activeModules}</span>
                <span className="text-n-5 hidden sm:inline">|</span>
                <span>Deployments: {deployedUseCases > 0 ? deployedUseCases : 'GLOBAL'}</span>
                <span className="text-n-5 hidden sm:inline">|</span>
                <span>Status: <span className="text-green-500 animate-pulse font-semibold">ONLINE</span></span>
              </div>
            </div>
            <p className="body-1 max-w-3xl mx-auto mb-8 text-n-5 dark:text-n-3">
              {solution.description || "Transform your business with our cutting-edge technology solutions."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact">Init Sequence</Button>
              <Button href="#architecture" white>View Topology</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* The Problem + Value Proposition (Category Doctrine) */}
      {(solution.problemStatement?.html || solution.valueProposition?.html) && (
        <Section className={isDarkMode ? 'bg-n-8' : 'bg-white'}>
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
              {solution.problemStatement?.html && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl p-8 border ${isDarkMode ? 'bg-n-7/50 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                      <FiAlertTriangle size={20} />
                    </div>
                    <h2 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>The Problem</h2>
                  </div>
                  <div className={`body-2 space-y-3 prose prose-sm max-w-none ${isDarkMode ? 'text-n-3 prose-invert' : 'text-n-6 prose-n-8'}`}>
                    {parse(solution.problemStatement.html)}
                  </div>
                </motion.div>
              )}
              {solution.valueProposition?.html && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl p-8 border ${isDarkMode ? 'bg-n-7/50 border-primary-1/30' : 'bg-white border-primary-1/30 shadow-sm'}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                      <FiAward size={20} />
                    </div>
                    <h2 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Why It Matters</h2>
                  </div>
                  <div className={`body-2 space-y-3 prose prose-sm max-w-none ${isDarkMode ? 'text-n-3 prose-invert' : 'text-n-6 prose-n-8'}`}>
                    {parse(solution.valueProposition.html)}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* STRATEGIC INTEL (The Soul) */}
      {strategyIntel && (
        <Section className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
          <div className="container">
            <Heading title="Strategic Analysis" text="Operational Constraints & Tactical Response." className="mb-12 text-center" />
            <ZetaStrategyBrief industryApp={strategyIntel} />
          </div>
        </Section>
      )}

      {/* INTERACTIVE SIMULATION (The Demo - Calibrated Feature) */}
      {simulationSource && (
        <Section className={isDarkMode ? 'bg-n-8' : 'bg-white'} id="simulation">
          <div className="container">
            <Heading title="Live Simulation" text="Execute scenarios in a secure sandbox environment." className="mb-12 text-center" />
            <ZetaSimulation useCase={simulationSource} />
          </div>
        </Section>
      )}

      {/* Technology Narrative */}
      {solution.technologyNarrative?.html && (
        <Section className={isDarkMode ? 'bg-n-8' : 'bg-white'}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-10 border ${isDarkMode ? 'bg-n-7/50 border-n-6' : 'bg-white border-n-3 shadow-sm'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-1'}`}>
                  <FiCode size={20} />
                </div>
                <h2 className={`h4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Technology Stack</h2>
              </div>
              <div className={`body-2 prose prose-lg max-w-none ${isDarkMode ? 'text-n-3 prose-invert prose-strong:text-n-1' : 'text-n-6 prose-n-8'}`}>
                {parse(solution.technologyNarrative.html)}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Architecture / Topology Deep Dive */}
      {slug !== 'ai-agents' && (
        <Section id="architecture" className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
          <div className="container">
            <Heading title="System Architecture" text="Active operational topology." className="mb-12 text-center" />

            {/* If we have a robust Tech Stack, show the TechStoryTopology (Scroll Visualizer) */}
            {solution.techStack && Object.keys(solution.techStack).length > 0 ? (
              <TechStoryTopology techStack={solution.techStack} />
            ) : (
              solution.architecture && (
                <SolutionArchitecture architecture={solution.architecture} solutionId={solution.id} />
              )
            )}
          </div>
        </Section>
      )}

      {/* Key Outcomes */}
      {solution.keyOutcomes?.html && (
        <Section className={isDarkMode ? 'bg-n-8' : 'bg-white'}>
          <div className="container">
            <Heading title="Key Outcomes" text="Typical results our solutions deliver." className="mb-10 text-center" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-10 border ${isDarkMode ? 'bg-n-7/50 border-primary-1/30' : 'bg-white border-primary-1/20 shadow-sm'}`}
            >
              <div className={`body-2 prose prose-lg max-w-none ${isDarkMode ? 'text-n-3 prose-invert prose-strong:text-primary-1' : 'text-n-6 prose-n-8 prose-strong:text-primary-1'}`}>
                {parse(solution.keyOutcomes.html)}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Dynamic Use Cases */}
      <Section className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
        <div className="container">
          <Heading title="Proven Use Cases" text="Real-world applications driving value." className="mb-12 text-center" />

          {loading ? (
            <div className="text-center py-20">Loading intelligence...</div>
          ) : useCases.length > 0 ? (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="solution-use-cases-swiper !pb-14"
              >
                {useCases.map((useCase) => (
                  <SwiperSlide key={useCase.id} className="h-auto">
                    <UseCaseCard
                      useCase={useCase}
                      onQueryClick={() => handleQueryClick(useCase)}
                      onClick={() => handleUseCaseClick(useCase)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="text-center py-10 opacity-50">No use cases currently active for this sector.</div>
          )}
        </div>
      </Section>



      {/* Call to Action */}
      <Section className="!pt-0">
        <div className="container">
          <div className={`p-10 rounded-3xl text-center relative overflow-hidden ${isDarkMode ? 'bg-n-7' : 'bg-primary-1 text-white'}`}>
            <div className="relative z-10">
              <h2 className={`h2 mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>Ready to Transform?</h2>
              <p className="body-1 max-w-2xl mx-auto mb-8 opacity-80">
                Deploy this solution within your infrastructure today.
              </p>
              <Button href="/contact" white={!isDarkMode}>Start Deployment</Button>
            </div>

            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-[10rem]"></div>
            </div>
          </div>
        </div>
      </Section>

      <style>{themeAwareSwiperNavStyles}</style>
    </div>
  );
};

export default SolutionPage;