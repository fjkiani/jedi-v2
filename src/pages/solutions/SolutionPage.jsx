import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { GET_TECHNOLOGY_BY_CATEGORY } from '@/graphql/queries/technologies';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiperNavStyles = `
  .solution-use-cases-swiper .swiper-button-prev,
  .solution-use-cases-swiper .swiper-button-next {
    color: SWIPER_NAV_COLOR;
    width: 28px; height: 28px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.2s;
    top: calc(50% - 14px);
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
    background-color: SWIPER_BULLET_INACTIVE;
    opacity: 0.7;
  }
  .solution-use-cases-swiper .swiper-pagination-bullet-active {
    background-color: SWIPER_BULLET_ACTIVE;
    opacity: 1;
  }
`;

const SolutionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [solution, setSolution] = useState(null);
  const [useCases, setUseCases] = useState([]);
  const [strategyIntel, setStrategyIntel] = useState(null);
  const [simulationSource, setSimulationSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const themeAwareSwiperNavStyles = swiperNavStyles
    .replace('SWIPER_NAV_COLOR', isDarkMode ? '#FFFFFF' : '#000000')
    .replace('SWIPER_BULLET_ACTIVE', isDarkMode ? '#8E55EA' : '#6C2BD9')
    .replace('SWIPER_BULLET_INACTIVE', isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)');

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setStrategyIntel(null);
        setSimulationSource(null);
        setSolution(null);

        // Try exact slug first, then strip common suffixes
        let targetSlug = slug;
        let solutionData = await hygraphClient.request(GET_SOLUTION_BY_SLUG, { slug: targetSlug });

        if (
          (!solutionData.categories || solutionData.categories.length === 0) &&
          targetSlug.includes('-solutions')
        ) {
          targetSlug = targetSlug.replace('-solutions', '');
          solutionData = await hygraphClient.request(GET_SOLUTION_BY_SLUG, { slug: targetSlug });
        }

        const fetchedCategory = solutionData?.categories?.[0] ?? null;
        const relatedUseCases = solutionData?.relatedUseCases ?? [];

        if (!fetchedCategory) {
          setError('not_found');
          setLoading(false);
          return;
        }

        // Build tech stack map from related use cases' technologies
        const techStackMap = {};
        relatedUseCases.forEach(uc => {
          (uc.technologies || []).forEach(tech => {
            const subcat = 'Technologies';
            if (!techStackMap[subcat]) techStackMap[subcat] = {};
            techStackMap[subcat][tech.name] = {
              icon: tech.icon,
              category: subcat,
              slug: tech.slug,
            };
          });
        });

        // FIX BUG-03: If no tech stack from use cases, fetch category technologies directly
        let finalTechStack = Object.keys(techStackMap).length > 0 ? techStackMap : null;
        if (!finalTechStack) {
          try {
            const catTechData = await hygraphClient.request(GET_TECHNOLOGY_BY_CATEGORY, { slug: targetSlug });
            const catTechs = catTechData?.technologyS || [];
            if (catTechs.length > 0) {
              // Group by category name for topology display
              catTechs.forEach(tech => {
                const catName = tech.category?.[0]?.name || 'Technologies';
                if (!techStackMap[catName]) techStackMap[catName] = {};
                techStackMap[catName][tech.name] = {
                  icon: tech.icon,
                  category: catName,
                  slug: tech.slug,
                };
              });
              finalTechStack = techStackMap;
            }
          } catch (catErr) {
            console.warn('[SolutionPage] Could not fetch category technologies:', catErr);
          }
        }

        // FIX BUG-01: industryApplication returns [] (empty array) which is truthy.
        // Must check length > 0, not just truthiness.
        const soulSource = relatedUseCases.find(uc => {
          const ia = uc.industryApplication;
          return Array.isArray(ia) ? ia.length > 0 : !!ia;
        });
        if (soulSource) {
          const ia = Array.isArray(soulSource.industryApplication)
            ? soulSource.industryApplication[0]
            : soulSource.industryApplication;
          if (ia) {
            setStrategyIntel({
              ...ia,
              sourceTitle: soulSource.title,
            });
          }
        }

        // Build simulation source from first use case that has architecture
        const simSource = relatedUseCases.find(uc => uc.architecture);
        if (simSource) {
          setSimulationSource({
            title: simSource.title,
            slug: simSource.slug,
            description: simSource.description,
            architecture: simSource.architecture,
            metrics: simSource.metrics,
            capabilities: simSource.capabilities,
            queries: Array.isArray(simSource.queries) ? simSource.queries : [],
            implementation: simSource.implementation || null,
          });
        }

        setSolution({
          id: fetchedCategory.id,
          title: fetchedCategory.name,
          slug: fetchedCategory.slug,
          description: fetchedCategory.description,
          tagline: fetchedCategory.tagline,
          problemStatement: fetchedCategory.problemStatement,
          valueProposition: fetchedCategory.valueProposition,
          technologyNarrative: fetchedCategory.technologyNarrative,
          keyOutcomes: fetchedCategory.keyOutcomes,
          heroImage: fetchedCategory.heroImage,
          techStack: finalTechStack,
        });

        // Fetch all use cases for the carousel
        const useCaseData = await hygraphClient.request(GET_USE_CASES);
        // FIX BUG-01: Guard against non-array response
        const fetchedUseCases = useCaseData.useCaseS || useCaseData.useCases || [];
        setUseCases(Array.isArray(fetchedUseCases) ? fetchedUseCases : []);
      } catch (err) {
        console.error('[SolutionPage] Error fetching data:', err);
        setError('fetch_error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleUseCaseClick = (useCase) => {
    if (useCase?.slug) navigate(`/use-cases/${useCase.slug}`);
  };

  const handleQueryClick = (useCase) => {
    if (useCase?.slug) navigate(`/use-cases/${useCase.slug}?tab=architecture`);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className={`h-20 w-20 rounded-2xl mx-auto ${isDarkMode ? 'bg-n-7' : 'bg-n-3'}`} />
            <div className={`h-10 rounded-xl mx-auto w-2/3 ${isDarkMode ? 'bg-n-7' : 'bg-n-3'}`} />
            <div className={`h-6 rounded-xl mx-auto w-1/2 ${isDarkMode ? 'bg-n-7' : 'bg-n-3'}`} />
            <div className={`h-4 rounded-xl mx-auto w-3/4 ${isDarkMode ? 'bg-n-7' : 'bg-n-3'}`} />
          </div>
        </div>
      </Section>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (error === 'not_found' || !solution) {
    return (
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container max-w-2xl mx-auto text-center">
          <h1 className="h1 mb-4">Solution not found</h1>
          <p className={`body-1 mb-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            This solution page is not available yet. Return to the solutions list to explore what's live.
          </p>
          <Button href="/solutions" white>Return to Solutions</Button>
        </div>
      </Section>
    );
  }

  // ── Fetch error ───────────────────────────────────────────────────────────
  if (error === 'fetch_error') {
    return (
      <Section className="pt-[12rem] -mt-[5.25rem]">
        <div className="container max-w-2xl mx-auto text-center">
          <h1 className="h1 mb-4">Unable to load</h1>
          <p className={`body-1 mb-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            There was a problem fetching this solution. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} white>Retry</Button>
        </div>
      </Section>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden ${isDarkMode ? 'bg-n-8' : 'bg-gray-50'}`}>

      {/* Hero */}
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${isDarkMode ? 'bg-n-7' : 'bg-white shadow-lg'}`}>
              <Icon name="brain" className="w-10 h-10 text-primary-1" />
            </div>
            <h1 className="h1 mb-3 text-n-8 dark:text-n-1">{solution.title}</h1>
            {solution.tagline && (
              <p className="text-xl md:text-2xl font-semibold mb-6 bg-gradient-to-r from-primary-1 to-primary-2 bg-clip-text text-transparent">
                {solution.tagline}
              </p>
            )}
            <div className="flex justify-center mb-6">
              <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-mono uppercase tracking-widest px-3 sm:px-4 py-2.5 rounded-lg ${isDarkMode ? 'bg-n-7/80 border border-n-6 text-primary-1' : 'bg-white/90 border border-n-3 text-primary-1 shadow-sm'}`}>
                <span>Status: <span className="text-green-500 animate-pulse font-semibold">ONLINE</span></span>
              </div>
            </div>
            {solution.description && (
              <p className="body-1 max-w-3xl mx-auto mb-8 text-n-5 dark:text-n-3">
                {solution.description}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact">Init Sequence</Button>
              <Button href="#architecture" white>View Topology</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem + Value Proposition */}
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
                  <div className={`body-2 space-y-3 prose prose-sm max-w-none ${isDarkMode ? 'text-n-3 prose-invert' : 'text-n-6'}`}>
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
                  <div className={`body-2 space-y-3 prose prose-sm max-w-none ${isDarkMode ? 'text-n-3 prose-invert' : 'text-n-6'}`}>
                    {parse(solution.valueProposition.html)}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Strategic Intel */}
      {strategyIntel && (
        <Section className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
          <div className="container">
            <Heading title="Strategic Analysis" text="Operational Constraints & Tactical Response." className="mb-12 text-center" />
            <ZetaStrategyBrief industryApp={strategyIntel} />
          </div>
        </Section>
      )}

      {/* Live Simulation */}
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
              <div className={`body-2 prose prose-lg max-w-none ${isDarkMode ? 'text-n-3 prose-invert prose-strong:text-n-1' : 'text-n-6'}`}>
                {parse(solution.technologyNarrative.html)}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Architecture / Topology */}
      <Section id="architecture" className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
        <div className="container">
          <Heading title="System Architecture" text="Active operational topology." className="mb-12 text-center" />
          {solution.techStack && Object.keys(solution.techStack).length > 0 ? (
            <TechStoryTopology techStack={solution.techStack} />
          ) : (
            <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'border-n-6 text-n-4' : 'border-n-3 text-n-5'}`}>
              <p className="body-2 mb-4">Architecture diagram coming soon.</p>
              <Link to="/technology" className="text-primary-1 hover:underline text-sm font-mono">
                Browse full technology stack →
              </Link>
            </div>
          )}
        </div>
      </Section>

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
              <div className={`body-2 prose prose-lg max-w-none ${isDarkMode ? 'text-n-3 prose-invert prose-strong:text-primary-1' : 'text-n-6 prose-strong:text-primary-1'}`}>
                {parse(solution.keyOutcomes.html)}
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Use Cases Carousel */}
      <Section className={isDarkMode ? 'bg-n-7' : 'bg-gray-50'}>
        <div className="container">
          <Heading title="Proven Use Cases" text="Real-world applications driving value." className="mb-12 text-center" />
          {useCases.length > 0 ? (
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
            <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'border-n-6 text-n-4' : 'border-n-3 text-n-5'}`}>
              <p className="body-2">No use cases currently active for this sector.</p>
            </div>
          )}
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <div className="container">
          <div className={`p-10 rounded-3xl text-center relative overflow-hidden ${isDarkMode ? 'bg-n-7' : 'bg-primary-1 text-white'}`}>
            <div className="relative z-10">
              <h2 className="h2 mb-4 text-white">Ready to Transform?</h2>
              <p className="body-1 max-w-2xl mx-auto mb-8 opacity-80 text-white">
                Deploy this solution within your infrastructure today.
              </p>
              <Button href="/contact" white={!isDarkMode}>Start Deployment</Button>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-[10rem]" />
            </div>
          </div>
        </div>
      </Section>

      <style>{themeAwareSwiperNavStyles}</style>
    </div>
  );
};

export default SolutionPage;
