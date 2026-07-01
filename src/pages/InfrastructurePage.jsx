import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from "../components/Section";
import SEO from '@/components/SEO';
import { PAGE_META } from '@/constants/seo';
import Heading from "../components/Heading";
import PageBottomCTA from "../components/PageBottomCTA";
import TechStoryTopology from "../components/solutions/TechStoryTopology";
import { hygraphClient } from '@/lib/hygraph';
import { GET_ALL_CATEGORIES_WITH_TECHS } from '../graphql/queries/solutions';

const InfrastructurePage = () => {
    const [techStack, setTechStack] = useState({});
    const [loading, setLoading] = useState(true);
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        const fetchInfrastructure = async () => {
            setLoading(true);
            try {
                // GET_ALL_CATEGORIES_WITH_TECHS now returns categories + technologyS separately
                // because Category has no direct technologies relation in Hygraph
                const data = await hygraphClient.request(GET_ALL_CATEGORIES_WITH_TECHS);
                const categories = data?.categories || [];
                const allTechs = data?.technologyS || [];

                if (allTechs.length > 0) {
                    // Group technologies by their category name
                    const dynamicStack = {};

                    allTechs.forEach(tech => {
                        const techCats = tech.category || [];
                        if (techCats.length === 0) {
                            // Uncategorised — put in "Other"
                            if (!dynamicStack['Other']) dynamicStack['Other'] = {};
                            dynamicStack['Other'][tech.name] = {
                                icon: tech.icon, // icon is a plain String URL on Technology
                                slug: tech.slug,
                            };
                            return;
                        }
                        // A tech can belong to multiple categories — add to each
                        techCats.forEach(cat => {
                            if (!dynamicStack[cat.name]) dynamicStack[cat.name] = {};
                            dynamicStack[cat.name][tech.name] = {
                                icon: tech.icon,
                                slug: tech.slug,
                            };
                        });
                    });

                    // Remove empty categories
                    Object.keys(dynamicStack).forEach(k => {
                        if (Object.keys(dynamicStack[k]).length === 0) delete dynamicStack[k];
                    });

                    setTechStack(dynamicStack);
                    setCategoryCount(Object.keys(dynamicStack).length);
                }
            } catch (error) {
                console.error("Failed to fetch infrastructure from Hygraph:", error);
                // Show empty state rather than stale hardcoded data
                setTechStack({});
            } finally {
                setLoading(false);
            }
        };

        fetchInfrastructure();
    }, []);

    const domainCount = categoryCount || Object.keys(techStack).length;

    return (
        <>
            <SEO title={PAGE_META.infrastructure.title} description={PAGE_META.infrastructure.description} path="/infrastructure" />
            <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
                <div className="container relative">
                    <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
                        <h1 className="h1 mb-6">
                            Neural <span className="text-color-1">Infrastructure</span>
                        </h1>
                        <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                            {loading
                                ? 'Loading active system domains…'
                                : domainCount > 0
                                    ? `The nervous system of JEDI Labs. A living network of intelligence across ${domainCount} active system domains.`
                                    : 'The nervous system of JEDI Labs — our full technology stack.'}
                        </p>
                    </div>

                    <div className="relative max-w-7xl mx-auto xl:mb-24">
                        {loading ? (
                            <div className="flex items-center justify-center py-24 text-n-4">
                                Loading infrastructure…
                            </div>
                        ) : Object.keys(techStack).length > 0 ? (
                            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                                <div className="relative bg-n-8 rounded-[1rem] overflow-hidden">
                                    <div className="bg-n-8 rounded-[1rem] p-8 md:p-14">
                                        <TechStoryTopology techStack={techStack} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-n-4">
                                No infrastructure data available yet.
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            <Section className="overflow-hidden">
                <div className="container md:pb-10">
                    <Heading tag="Architecture" title="Core Systems" />

                    <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Swarm Intelligence</h4>
                                <p className="body-2 text-n-4">Decentralized agent coordination protocols ensuring 99.9% uptime and adaptive problem solving.</p>
                            </div>
                        </div>
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Neural Pipelines</h4>
                                <p className="body-2 text-n-4">Real-time data ingestion and processing at the speed of thought.</p>
                            </div>
                        </div>
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Global Edge Network</h4>
                                <p className="body-2 text-n-4">Deployed across 7 continents to minimize latency and maximize redundancy.</p>
                            </div>
                        </div>
                    </div>

                    {/* Cross-link to use cases */}
                    <div className="mt-16 text-center">
                        <p className="body-2 text-n-4 mb-4">See this infrastructure in action</p>
                        <Link
                            to="/use-cases"
                            className="button button-primary"
                        >
                            Explore Use Cases
                        </Link>
                    </div>
                </div>
            </Section>

            <PageBottomCTA
                eyebrow="Deploy on your stack"
                title="Same architecture, your infrastructure"
                description="Cloud, VPC, on-prem — the same evaluation harness and deployment pattern ships to your environment."
                primary={{ label: 'Talk to Engineering', href: '/contact?inquiry=infrastructure' }}
                secondary={{ label: 'Explore the Stack', href: '/technology' }}
            />
        </>
    );
};

export default InfrastructurePage;
