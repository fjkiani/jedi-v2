import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Section from '@/components/Section';
import { JEDI_METHODOLOGY_STEPS } from '@/constants/methodology';
import { FiArrowRight, FiArrowLeft, FiCpu, FiLayers, FiActivity } from 'react-icons/fi';
import Button from '@/components/Button';
import { hygraphClient } from '@/lib/hygraph';
import { GET_TECHNOLOGIES_BY_SLUGS } from '@/graphql/queries/technologies';

const MethodologyDetail = () => {
    const { slug } = useParams();
    const { isDarkMode } = useTheme();
    const [technologies, setTechnologies] = useState([]);
    const [, setLoading] = useState(false);

    const stepIndex = JEDI_METHODOLOGY_STEPS.findIndex(s => s.slug === slug);
    const step = JEDI_METHODOLOGY_STEPS[stepIndex];
    const IconComponent = step?.icon || FiCpu;

    // Slug mapping: methodology slugs may differ from Hygraph
    const SLUG_ALIASES = {
        'tensorflow-serving': 'tensorflow',
        'hygraph-cms': 'hygraph'
    };

    useEffect(() => {
        const fetchTech = async () => {
            setLoading(true);
            try {
                const involvedSlugs = step.involvedTech?.map(t => t.slug) || [];
                const moduleSlugs = step.technicalModules?.flatMap(m => m.techSlugs || []) || [];
                const rawSlugs = [...new Set([...involvedSlugs, ...moduleSlugs])];
                const allSlugs = rawSlugs.map(s => SLUG_ALIASES[s] || s);

                if (allSlugs.length > 0) {
                    const data = await hygraphClient.request(GET_TECHNOLOGIES_BY_SLUGS, { slugs: allSlugs }, { skipCache: true });
                    const techs = data.technologyS || data.technologies || [];
                    setTechnologies(techs);
                }
            } catch (error) {
                console.error("Failed to fetch methodology technologies:", error);
            } finally {
                setLoading(false);
            }
        };

        if (step) {
            fetchTech();
        }
    }, [step]);

    if (!step) {
        return (
            <Section className="text-center pt-[10rem]">
                <h2 className="h2">Phase Not Found</h2>
                <Button className="mt-4" href="/">Return to Command</Button>
            </Section>
        );
    }

    // Hardcoded fallbacks to ensure UI isn't empty if Hygraph technical slugs don't match
    const FALLBACK_TECH_DATA = {
        'react': { name: 'React', description: 'Frontend library for building user interfaces.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        'figma': { name: 'Figma', description: 'Collaborative interface design tool.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        'python': { name: 'Python', description: 'High-level programming language for general-purpose programming.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        'openai': { name: 'OpenAI', description: 'AI research and deployment company.', icon: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg' },
        'tensorflow': { name: 'TensorFlow', description: 'End-to-end open source platform for machine learning.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        'aws': { name: 'AWS', description: 'Amazon Web Services cloud computing platform.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
        'docker': { name: 'Docker', description: 'Platform for developing, shipping, and running applications.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        'kubernetes': { name: 'Kubernetes', description: 'Container orchestration system.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
        'postgresql': { name: 'PostgreSQL', description: 'Open source relational database.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        'hygraph-cms': { name: 'Hygraph', description: 'Federated Content Platform.', icon: 'https://media.graphassets.com/UKIGK4rATaOrfrIqU4v8' },
        'next-js': { name: 'Next.js', description: 'The React Framework for the Web.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        'tailwindcss': { name: 'Tailwind CSS', description: 'A utility-first CSS framework.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        'langchain': { name: 'LangChain', description: 'Framework for developing applications powered by LLMs.', icon: 'https://user-images.githubusercontent.com/120556209/224647970-dcc2a677-2da2-466d-8e4d-7756f7e90956.png' },
        'pinecone': { name: 'Pinecone', description: 'Vector database for machine learning.', icon: 'https://cdn.worldvectorlogo.com/logos/pinecone.svg' },
        'huggingface': { name: 'Hugging Face', description: 'AI community and platform.', icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' },
        'nodejs': { name: 'Node.js', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        'kafka': { name: 'Kafka', description: 'Distributed event streaming platform.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
        'airflow': { name: 'Airflow', description: 'Platform to programmatically author, schedule and monitor workflows.', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/de/AirflowLogo.png' },
        'langsmith': { name: 'LangSmith', description: 'Developer platform for debugging, testing, evaluating, and monitoring chains.', icon: 'https://pbs.twimg.com/profile_images/1691515234975252480/z0_s3e0j_400x400.jpg' },
        'arize': { name: 'Arize', description: 'ML observability platform.', icon: 'https://mma.prnewswire.com/media/1329188/Arize_AI_Logo.jpg?p=facebook' },
        'keda': { name: 'KEDA', description: 'Kubernetes-based Event Driven Autoscaling.', icon: 'https://raw.githubusercontent.com/kedacore/keda/main/images/keda-logo-transparent.png' },
        'prometheus': { name: 'Prometheus', description: 'Monitoring system and time series database.', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' }
    };

    const nextStep = JEDI_METHODOLOGY_STEPS[stepIndex + 1];
    const prevStep = JEDI_METHODOLOGY_STEPS[stepIndex - 1];

    // Resolve icon URL: Hygraph returns icon as string; fallback uses string; some schemas use { url }
    const getIconUrl = (tech) => {
        if (!tech) return null;
        if (typeof tech.icon === 'string') return tech.icon;
        return tech.icon?.url;
    };

    // Merge fetched technologies with fallbacks (match by slug or alias)
    const displayTechnologies = step.involvedTech?.map(t => {
        const hygraphSlug = SLUG_ALIASES[t.slug] || t.slug;
        const fetched = technologies.find(ft => ft.slug === t.slug || ft.slug === hygraphSlug);
        const fallback = FALLBACK_TECH_DATA[t.slug];
        if (fetched) return { ...fetched, _iconUrl: getIconUrl(fetched) };
        if (fallback) return { ...t, ...fallback, _iconUrl: fallback.icon };
        return { ...t, _iconUrl: null };
    }) || [];

    return (
        <div className={`min-h-screen pt-[4.75rem] lg:pt-[5.25rem] ${isDarkMode ? 'bg-n-8 text-n-1' : 'bg-gray-50 text-n-8'}`}>

            {/* Hero Section */}
            <Section className="relative -mt-[5.25rem]" crosses>
                <div className="container relative z-10 pt-20">
                    <Link to="/" className="text-xs font-mono uppercase tracking-widest mb-6 inline-flex items-center gap-2 hover:text-primary-1 transition-colors opacity-60 hover:opacity-100">
                        <FiArrowLeft /> Back to Command
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Left Column: Title & Context */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 text-xs font-bold font-mono border rounded uppercase tracking-wider text-primary-1 border-primary-1/50 bg-primary-1/10">
                                    Phase {step.number}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold font-mono border rounded uppercase tracking-wider ${isDarkMode ? 'bg-n-7 border-n-6 text-n-4' : 'bg-white border-gray-200 text-n-6'}`}>
                                    Status: {step.status}
                                </span>
                            </div>

                            <h1 className="h1 mb-6 font-mono uppercase leading-tight">
                                {step.title} <span className="text-n-4 block text-3xl mt-2 normal-case font-sans font-light">{step.subtitle}</span>
                            </h1>

                            <p className="body-1 text-n-3 max-w-2xl mb-8 leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* Right Column: Icon & Visual */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
                            <div className={`w-64 h-64 rounded-full border border-dashed flex items-center justify-center relative ${isDarkMode ? 'border-n-6 bg-n-8/50' : 'border-n-3 bg-white'}`}>
                                <div className="absolute inset-0 rounded-full border border-primary-1/20 animate-spin-slow"></div>
                                <step.icon className="w-24 h-24 text-primary-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Core Content Grid */}
            <Section className="py-10 overflow-hidden" crosses>
                <div className="container min-w-0">
                    <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">

                        {/* Protocol Column */}
                        <div className="lg:col-span-7 min-w-0">
                            <h3 className="h4 mb-8 font-mono uppercase flex items-center gap-3">
                                <FiActivity className="text-primary-1" /> Operational Protocols
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                                {step.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-6 rounded-2xl border transition-all hover:border-primary-1/50 ${isDarkMode ? 'bg-n-7/40 border-n-6' : 'bg-white border-gray-200 shadow-sm'}`}
                                    >
                                        <div className="w-8 h-8 rounded bg-primary-1/10 text-primary-1 flex items-center justify-center mb-4">
                                            <span className="font-mono text-xs font-bold">0{i + 1}</span>
                                        </div>
                                        <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>{feature}</h4>
                                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                                            Standard operating procedure for {feature.toLowerCase()} ensures optimal system integrity and performance.
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Technical Deep Dive Modules */}
                            {step.technicalModules && (
                                <>
                                    <h3 className="h4 mb-8 font-mono uppercase flex items-center gap-3">
                                        <FiLayers className="text-primary-1" /> Technical Deep Dive
                                    </h3>
                                    <div className="space-y-6">
                                        {step.technicalModules.map((module, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className={`p-6 rounded-2xl border relative overflow-hidden group ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-gray-50 border-gray-200'}`}
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <IconComponent className="w-24 h-24" />
                                                </div>
                                                <h4 className={`text-xl font-bold mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{module.title}</h4>
                                                <p className={`text-sm mb-4 max-w-lg ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>{module.description}</p>
                                                <div className="flex flex-wrap gap-4">
                                                    {module.techSlugs?.map((techSlug, tIdx) => {
                                                        const hygraphSlug = SLUG_ALIASES[techSlug] || techSlug;
                                                        const fetched = technologies.find(ft => ft.slug === techSlug || ft.slug === hygraphSlug);
                                                        const fallback = FALLBACK_TECH_DATA[techSlug];
                                                        const techData = fetched || (fallback ? { ...fallback, slug: techSlug } : { name: techSlug });
                                                        const iconUrl = getIconUrl(fetched) || fallback?.icon;

                                                        const TechWrapper = techData.slug ? Link : 'div';
                                                        const wrapperProps = techData.slug ? { to: `/technology/${techData.slug}` } : {};
                                                        return (
                                                            <TechWrapper key={tIdx} {...wrapperProps} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${techData.slug ? 'cursor-pointer hover:border-primary-1' : ''} ${isDarkMode ? 'bg-n-7 border-n-6 hover:bg-n-6' : 'bg-white border-n-3 hover:border-primary-1/50'}`}>
                                                                {iconUrl ? (
                                                                    <img src={iconUrl} alt={techData.name} className="w-6 h-6 object-contain" />
                                                                ) : (
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'}`}>
                                                                        {techData.name?.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className={`text-sm font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{techData.name}</div>
                                                                </div>
                                                            </TechWrapper>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Intelligence Column */}
                        <div className="lg:col-span-5 min-w-0">
                            <h3 className="h4 mb-8 font-mono uppercase flex items-center gap-3">
                                <FiCpu className="text-primary-1" /> Applications
                            </h3>
                            <div className={`rounded-3xl border p-6 lg:sticky lg:top-24 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-white border-gray-200'}`}>
                                <div className="space-y-4">
                                    {(technologies.length > 0 ? technologies : displayTechnologies).map((tech, i) => (
                                        tech.slug ? (
                                            <Link
                                                key={tech.id || i}
                                                to={`/technology/${tech.slug}`}
                                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:border-primary-1 group ${isDarkMode ? 'bg-n-7/50 border-n-6 hover:bg-n-7' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'}`}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-white p-2 shrink-0 flex items-center justify-center border border-n-3">
                                                    {(tech._iconUrl || getIconUrl(tech)) ? (
                                                        <img src={tech._iconUrl || getIconUrl(tech)} alt={tech.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <FiLayers className="text-n-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`font-bold mb-1 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-white' : 'text-n-8'}`}>
                                                        {tech.name}
                                                    </div>
                                                    <p className="text-xs text-n-4 line-clamp-2">
                                                        {tech.description || "Core system component."}
                                                    </p>
                                                </div>
                                                <FiArrowRight className="ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary-1" />
                                            </Link>
                                        ) : (
                                            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border opacity-70 ${isDarkMode ? 'border-n-6' : 'border-gray-200'}`}>
                                                {(tech._iconUrl || getIconUrl(tech)) ? (
                                                    <img src={tech._iconUrl || getIconUrl(tech)} alt={tech.name} className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <FiCpu className="text-n-4" />
                                                )}
                                                <span className="text-sm font-mono">{tech.name} {!tech.slug ? '(Loading/Offline)' : ''}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-24 pt-8 border-t border-n-6/50">
                        {prevStep ? (
                            <Link to={`/methodology/${prevStep.slug}`} className="flex items-center gap-4 text-left group">
                                <div className="w-14 h-14 rounded-full border border-n-6 flex items-center justify-center group-hover:border-primary-1 group-hover:text-primary-1 transition-all">
                                    <FiArrowLeft size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-n-4 uppercase font-mono tracking-wider">Previous</div>
                                    <div className="text-lg font-bold group-hover:text-primary-1 transition-colors">{prevStep.title}</div>
                                </div>
                            </Link>
                        ) : <div />}

                        {nextStep ? (
                            <Link to={`/methodology/${nextStep.slug}`} className="flex items-center gap-4 text-right group">
                                <div>
                                    <div className="text-xs text-n-4 uppercase font-mono tracking-wider">Next</div>
                                    <div className="text-lg font-bold group-hover:text-primary-1 transition-colors">{nextStep.title}</div>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-n-6 flex items-center justify-center group-hover:border-primary-1 group-hover:text-primary-1 transition-all">
                                    <FiArrowRight size={24} />
                                </div>
                            </Link>
                        ) : <div />}
                    </div>

                </div>
            </Section>
        </div>
    );
};

export default MethodologyDetail;
