import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import IndustrySolutions from '../components/IndustrySolutions';
import IndustryHero from '../components/IndustryHero';
import { gql } from 'graphql-request';
import { hygraphClient, hygraphEndpoint } from '@/lib/hygraph';

// Define GraphQL Query - Fixed to match actual schema
const GetIndustryDetail = gql`
  query GetIndustryDetail($slugParam: String!) {
    industries(where: { slug: $slugParam }, stage: PUBLISHED, first: 1) {
      id
      name
      slug
      sections
    }
  }
`;

// Simple mapping for colors based on slug (reuse or adapt from IndustryOverview)
const colorMap = {
  'healthcare': 'from-blue-500 to-blue-700',
  'financial': 'from-green-500 to-green-700',
  'energy': 'from-orange-500 to-orange-700', // Example for energy
  'default': 'from-n-5 to-n-7' // Fallback color
};

const IndustryPage = () => {
  const { industryId } = useParams();
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`[IndustryPage] useEffect triggered. Param value (industryId): ${industryId}`);

    if (!industryId) {
      console.log("[IndustryPage] useEffect stopped: industryId param is missing.");
      setLoading(false);
      setError("Industry identifier not found in URL.");
      return;
    }

    const fetchIndustryDetail = async () => {
      setLoading(true);
      setError(null);
      setIndustry(null);
      console.log(`[IndustryPage] Fetching details using identifier: ${industryId}`);
      try {
        console.log(`[IndustryPage] Requesting from Endpoint: ${hygraphEndpoint}`);
        console.log(`[IndustryPage] Query: ${GetIndustryDetail}`);
        console.log(`[IndustryPage] Variables: ${JSON.stringify({ slugParam: industryId })}`);
        console.log("[IndustryPage] Attempting hygraphClient.request (using plural query, 'sections' relation)...");
        const data = await hygraphClient.request(GetIndustryDetail, { slugParam: industryId });
        console.log("[IndustryPage] Raw data received (plural):", data);

        if (!data || !data.industries || data.industries.length === 0) {
          console.warn(`[IndustryPage] Industry array empty or not found for identifier: ${industryId}`);
          throw new Error(`Industry with identifier "${industryId}" not found in Hygraph.`);
        }

        const industryData = data.industries[0];
        console.log("[IndustryPage] Setting industry state:", industryData);
        setIndustry(industryData);

      } catch (err) {
        console.error("[IndustryPage] Caught error during fetch:", err);
        setError(err.message || "Failed to load industry details.");
      } finally {
        console.log("[IndustryPage] Fetch attempt finished (finally block). Setting loading to false.");
        setLoading(false);
      }
    };

    fetchIndustryDetail();
  }, [industryId]);

  // Loading State
  if (loading) {
    console.log("[IndustryPage] Rendering Loading State");
    return (
      <div className="container pt-[8rem] text-center">
        <p className="h3">Loading industry details...</p>
      </div>
    );
  }

  // Error State / Not Found State
  if (error || !industry) {
    console.log(`[IndustryPage] Rendering Error/Not Found State. Has Error: ${!!error}, Error Message: ${error}, Has Industry: ${!!industry}`);
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center mb-6">{error ? "Error Loading Industry" : "Industry Not Found"}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="text-center">
          <Link to="/industries" className="button button-primary">
            Back to Industries
          </Link>
        </div>
      </div>
    );
  }

  // Determine background color
  const colorClass = colorMap[industryId] || colorMap['default'];
  console.log(`[IndustryPage] Rendering Industry Details for: ${industry.name}`);
  console.log("[IndustryPage] Industry data being passed down:", industry);

  return (
    <>
      {/* Hero Section with Industry Hero Component */}
      {console.log("[IndustryPage] Rendering IndustryHero...")}
      <IndustryHero
        industry={industry}
      />

      {/* Solutions Section */}
      <div className="mt-10">
        {console.log("[IndustryPage] Rendering IndustrySolutions...")}
        <IndustrySolutions
          industry={industry}
        />
      </div>

      {/* Background Gradient */}
      <div
        className={`fixed inset-0 bg-gradient-to-b ${colorClass}
          opacity-10 pointer-events-none z-0`}
      />
    </>
  );
};

export default IndustryPage;