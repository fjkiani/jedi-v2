import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph'; // Assuming client is exported
import Section from '@/components/Section';
import IndustrySolutionCard from './IndustrySolutionCard';
// Removed imports: useMemo, getTechConfig, constants/registry

// Define the GraphQL query to fetch UseCases for a specific Industry slug
const GetUseCasesForIndustry = gql`
  query GetUseCasesForIndustry($industrySlug: String!) {
    useCaseS(where: { industry: { slug: $industrySlug } }, stage: PUBLISHED) {
      id
      title
      slug
      description
      # Add other fields needed by IndustrySolutionCard later, e.g., icon { url }
    }
  }
`;

const IndustrySolutions = ({ industry }) => {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!industry?.slug) {
      console.log("[IndustrySolutions] useEffect skipped: industry slug not available.");
      setLoading(false);
      // Optionally set an error or leave empty
      return;
    }

    const fetchUseCases = async () => {
      setLoading(true);
      setError(null);
      setUseCases([]);
      console.log(`[IndustrySolutions] Fetching use cases for industry slug: ${industry.slug}`);
      try {
        const data = await hygraphClient.request(GetUseCasesForIndustry, {
          industrySlug: industry.slug,
        });
        console.log("[IndustrySolutions] Raw use case data received:", data);

        if (!data || !data.useCaseS || data.useCaseS.length === 0) {
          console.warn(`[IndustrySolutions] No use cases found (or data.useCaseS is empty) for industry: ${industry.slug}`);
          setUseCases([]); // Set empty array if none found or key missing
        } else {
          console.log("[IndustrySolutions] Setting useCases state with:", data.useCaseS);
          setUseCases(data.useCaseS);
        }
      } catch (err) {
        console.error("[IndustrySolutions] Error fetching use cases:", err);
        setError("Failed to load solutions for this industry.");
      } finally {
        setLoading(false);
        console.log("[IndustrySolutions] Fetch attempt finished.");
      }
    };

    fetchUseCases();
  }, [industry?.slug]); // Depend on industry.slug

  // Removed useMemo hook (solutionRelationships)

  if (loading) {
    return (
      <div className="container text-center py-10">
        <p className="text-n-3">Loading solutions...</p>
        {/* Optional: Add a spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!useCases || useCases.length === 0) {
    return (
      <div className="container text-center py-10">
        <p className="text-n-3">No specific solutions found for this industry yet.</p>
      </div>
    );
  }

  // Render fetched use cases
  return (
    <div className="container relative pb-10"> {/* Added pb-10 for spacing */}
      <h2 className="h2 text-center mb-8">Industry Solutions & Use Cases</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {useCases.map((useCase, index) => (
          <IndustrySolutionCard
            key={useCase.id}
            // Pass simplified props based on fetched useCase data
            // Note: IndustrySolutionCard will need refactoring to accept these props
            title={useCase.title}
            description={useCase.description}
            industrySlug={industry.slug} // For linking
            useCaseSlug={useCase.slug}   // For linking
            // Pass index for potential animation delays if needed
            index={index}
            // Remove old props: solution={solution}, industry={industry}, relationships={...}
          />
        ))}
      </div>

      {/* Keep the background gradient if desired */}
      <div className="absolute top-0 right-0 w-[70%] h-[70%]
        bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none -z-1" />
    </div>
  );
};

export default IndustrySolutions;