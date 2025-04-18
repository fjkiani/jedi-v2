import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { TabsRoot, TabsList, TabTrigger, TabsContent, TabPanel } from '@/components/ui/Tabs';
import SolutionDetail from '../components/SolutionDetail.jsx';
import SolutionSidebar from '../components/SolutionSidebar.jsx';
import Heading from '@/components/Heading';
// import Breadcrumbs from '@/components/Breadcrumbs'; // Comment out missing component import
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';

const GetUseCaseDetail = gql`
  query GetUseCaseDetail($slug: String!) {
    useCase(where: { slug: $slug }, stage: PUBLISHED) {
      id
      title
      slug
      description
      capabilities
      metrics
      implementation # JSON field
      industry {
        name
        slug
      }
      technologies(first: 10) {
        id
        name
        slug
        icon 
      }
      architecture {
        id
        description
        components(orderBy: name_ASC) {
          id
          name
          description
          details
          explanation
        }
        flow(orderBy: step_ASC) {
          id
          step
          description
          details
        }
      }
    }
  }
`;

const SolutionPage = () => {
  const { industryId, solutionId } = useParams();
  const navigate = useNavigate();
  const [useCaseData, setUseCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!solutionId) {
        setError("Solution ID (slug) is missing from URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const variables = { slug: solutionId };
        const data = await hygraphClient.request(GetUseCaseDetail, variables);

        if (data && data.useCase) {
          setUseCaseData(data.useCase);
        } else {
          setError(`Solution with slug "${solutionId}" not found.`);
        }
      } catch (err) {
        console.error("Error fetching solution details:", err);
        setError("Failed to load solution details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [solutionId]);

  if (loading) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center">Loading solution details...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center text-red-500">
          Error: {error}
          <button onClick={() => navigate('/industries')} className="mt-4 btn">
            Go back to Industries
          </button>
        </div>
      </Section>
    );
  }

  if (!useCaseData) {
    return (
      <Section className="pt-12">
        <div className="container mx-auto text-center">
          Solution not found.
          <button onClick={() => navigate('/industries')} className="btn">
            Go back to Industries
          </button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={`${useCaseData.title} - ${useCaseData.industry?.name || 'Industry'} | Jedi Labs`}
        description={useCaseData.description || `Learn about ${useCaseData.title} solutions for the ${useCaseData.industry?.name || 'relevant'} industry.`}
        ogUrl={`https://www.jedilabs.org/industries/${useCaseData.industry?.slug}/${useCaseData.slug}`}
      />

      <Section className="pt-12 -mt-10 lg:-mt-15 xl:-mt-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/industries/${useCaseData.industry?.slug || industryId}`)}
              className="flex items-center text-sm font-medium text-n-3 hover:text-primary-1 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {useCaseData.industry?.name || 'Industry'}
            </button>
          </div>

          <Heading
            className="text-center md:text-left mb-2"
            title={useCaseData.title}
          />
          <p className="body-1 text-n-3 mb-8 text-center md:text-left">
            {useCaseData.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
            <div className="lg:col-span-2">
              <SolutionDetail useCase={useCaseData} />
            </div>

            <div className="lg:col-span-1">
              <SolutionSidebar useCase={useCaseData} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default SolutionPage;
