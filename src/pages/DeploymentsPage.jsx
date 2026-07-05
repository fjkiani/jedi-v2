import React, { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { motion } from "framer-motion";
import { hygraphClient } from "@/lib/hygraph";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Arrow from "../assets/svg/Arrow";
import ClipPath from "../assets/svg/ClipPath";
import { GradientLight } from "../components/design/Benefits";
import SEO from '@/components/SEO';

const GetAllUseCases = gql`
  query GetAllUseCases {
    useCaseS(stage: PUBLISHED, orderBy: publishedAt_DESC) {
      id
      title
      slug
      description
      industry {
        name
        slug
      }
      technologies(first: 3) {
        id
        name
        icon
      }
    }
  }
`;

const DeploymentsPage = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeployments = async () => {
            try {
                const data = await hygraphClient.request(GetAllUseCases);
                setDeployments(data.useCaseS || []);
            } catch (error) {
                console.error("Error fetching deployments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeployments();
    }, []);

    return (
        <>
            <SEO
              title="Live Deployments | Jedi Labs — Real Production AI"
              description="Four live deployments across medical imaging, geospatial segmentation, audio classification, and video understanding. Real evaluation curves, per-class F1, live inference — no PowerPoint."
              path="/deployments"
              keywords="production AI deployments, live inference, model serving, Hugging Face Spaces, real ML deployments, Jedi Labs"
              ogImage="https://jedilabs.org/og/og-technology.png"
            />
            <Section className="pt-[12rem] -mt-[5.25rem]" crosses>
                <div className="container relative">
                    <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
                        <h1 className="h1 mb-6">
                            Active <span className="text-color-1">Deployments</span>
                        </h1>
                        <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                            Mission logs and operational status from the field. Real-time data from Zeta's global operations.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[20rem]">
                            <div className="text-n-4 font-code animate-pulse">Establishing Secure Uplink...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                            {deployments.map((item) => (
                                <div
                                    className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                                    style={{
                                        backgroundImage: `url(/assets/benefits/card-1.svg)`, // Fallback or dynamic background
                                    }}
                                    key={item.id}
                                >
                                    <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                                        <div className="flex justify-between items-start mb-5">
                                            <h5 className="h5">{item.title}</h5>
                                            <span className="px-2 py-1 bg-color-1/10 rounded border border-color-1/20 text-[10px] font-bold text-color-1 uppercase tracking-wider">
                                                Active
                                            </span>
                                        </div>

                                        <p className="body-2 mb-6 text-n-3 text-sm line-clamp-4">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center mt-auto">
                                            <div className="flex items-center gap-2">
                                                {item.technologies?.map((tech) => (
                                                    <div key={tech.id} className="w-8 h-8 flex items-center justify-center bg-n-7 rounded-lg border border-n-6" title={tech.name}>
                                                        {tech.icon ? (
                                                            <img src={tech.icon} alt={tech.name} className="w-5 h-5 object-contain" />
                                                        ) : (
                                                            <div className="text-[10px]">{tech.name.substring(0, 2)}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="ml-auto flex items-center gap-2 cursor-pointer group">
                                                <span className="font-code text-xs font-bold text-n-1 uppercase tracking-wider group-hover:text-color-1 transition-colors">
                                                    Intel
                                                </span>
                                                <Arrow />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute inset-0.5 bg-n-8"
                                        style={{ clipPath: "url(#benefits)" }}
                                    >
                                        <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10 bg-color-1" />
                                    </div>

                                    <ClipPath />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>
        </>
    );
};

export default DeploymentsPage;
