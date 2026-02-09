
import { useState, useEffect } from 'react';
import Section from "../components/Section";
import Heading from "../components/Heading";
import TechStoryTopology from "../components/solutions/TechStoryTopology";
import { getAllTechnologies } from "../utils/techAggregation";
import { request } from 'graphql-request';
import { GET_ALL_CATEGORIES_WITH_TECHS } from '../graphql/queries/solutions';

const InfrastructurePage = () => {
    // Initial load from hardcoded data as skeletons/fallback
    const [techStack, setTechStack] = useState(getAllTechnologies());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT;
            if (!endpoint) return;

            setLoading(true);
            try {
                const { categories } = await request(endpoint, GET_ALL_CATEGORIES_WITH_TECHS);

                if (categories && categories.length > 0) {
                    // Transform Hygraph categories into TechStoryTopology format
                    const dynamicStack = {};

                    categories.forEach(cat => {
                        // Skip empty categories
                        if (!cat.technologies || cat.technologies.length === 0) return;

                        const techs = {};
                        cat.technologies.forEach(tech => {
                            techs[tech.name] = {
                                icon: tech.icon?.url, // Hygraph returns object { url }
                                slug: tech.slug
                            };
                        });

                        dynamicStack[cat.name] = techs;
                    });

                    setTechStack(dynamicStack);
                }
            } catch (error) {
                console.error("Failed to fetch dynamic infrastructure:", error);
                // Keep fallback on error
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
                <div className="container relative">
                    <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
                        <h1 className="h1 mb-6">
                            Neural <span className="text-color-1">Infrastructure</span>
                        </h1>
                        <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                            The nervous system of the Zeta Enterprise. A living, breathing network of intelligence aggregated from all {Object.keys(techStack).length} active system domains.
                        </p>
                    </div>

                    <div className="relative max-w-7xl mx-auto xl:mb-24">
                        <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                            <div className="relative bg-n-8 rounded-[1rem] overflow-hidden">
                                <div className="bg-n-8 rounded-[1rem] p-8 md:p-14">
                                    <TechStoryTopology techStack={techStack} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="overflow-hidden">
                <div className="container md:pb-10">
                    <Heading tag="Architecture" title="Core Systems" />

                    <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
                        {/* Card 1 */}
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Swarm Intelligence</h4>
                                <p className="body-2 text-n-4">Decentralized agent coordination protocols ensuring 99.9% uptime and adaptive problem solving.</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Neural Pipelines</h4>
                                <p className="body-2 text-n-4">Real-time data ingestion and processing at the speed of thought.</p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-6">
                            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                                <h4 className="h4 mb-4">Global Edge Network</h4>
                                <p className="body-2 text-n-4">Deployed across 7 continents to minimize latency and maximize redundancy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default InfrastructurePage;
