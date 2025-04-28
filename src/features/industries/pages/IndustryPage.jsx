import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient, hygraphEndpoint } from '@/lib/hygraph';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import IndustryHero from '../components/IndustryHero';
import { TabsRoot, TabsList, TabTrigger, TabsContent, TabPanel } from '@/components/ui/Tabs';
import { RichText } from '@graphcms/rich-text-react-renderer';
import OverviewTab from './tabs/OverviewTab';
import IndustryApplicationCard from '../components/IndustryApplicationCard';

// Define GraphQL Query - Fixed to match actual schema and use plural form
const GET_INDUSTRY_DETAIL_WITH_APPLICATIONS = gql`
  query GetIndustryDetailWithApplications($slug: String!) {
    # Use plural 'industries' and 'first: 1' to query by non-unique slug
    industries(where: { slug: $slug }, stage: PUBLISHED, first: 1) {
      id
      name
      slug
      description
      fullDescription { raw }
      benefits
      capabilities
      keyFeaturesJson
      statisticsJson
      # Fetch its related IndustryApplications using the CORRECT API ID
      industryApplication {
        id
        applicationTitle
        tagline
        industryChallenge {
          raw # Fetch raw structure for the renderer
        }
        jediApproach {
          raw # Fetch raw structure for the renderer
        }
        keyCapabilities
        expectedResults
        # Fetch linked JediComponents with more details
        jediComponent { # Use the correct API ID from your schema
          id
          name
          slug
          icon { url }
        }
        # Optionally fetch linked technologies or use cases if needed later
        # technology { id name slug }
        # useCase { id title slug }
      }
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
  const [industryData, setIndustryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log(`[IndustryPage] useEffect triggered. Param value (industryId): ${industryId}`);

    if (!industryId) {
      console.log("[IndustryPage] useEffect stopped: industryId param is missing.");
      setLoading(false);
      setError("Industry slug not found in URL.");
      return;
    }

    const fetchIndustryData = async () => {
      setLoading(true);
      setError(null);
      setIndustryData(null);
      console.log(`[IndustryPage] Fetching details using identifier: ${industryId}`);
      try {
        console.log(`[IndustryPage] Requesting from Endpoint: ${hygraphEndpoint}`);
        console.log(`[IndustryPage] Query: ${GET_INDUSTRY_DETAIL_WITH_APPLICATIONS}`);
        console.log(`[IndustryPage] Variables: ${JSON.stringify({ slug: industryId })}`);
        console.log("[IndustryPage] Attempting hygraphClient.request (fetching 'sections' as simple array)...");
        const data = await hygraphClient.request(GET_INDUSTRY_DETAIL_WITH_APPLICATIONS, { slug: industryId });
        console.log("[IndustryPage] Raw data received (plural):", data);

        if (!data || !data.industries) {
          console.warn(`[IndustryPage] Industry not found for identifier: ${industryId}`);
          throw new Error(`Industry with identifier "${industryId}" not found in Hygraph.`);
        }

        const industryData = data.industries[0];
        console.log("[IndustryPage] Setting industry state:", industryData);
        setIndustryData(industryData);

      } catch (err) {
        console.error("[IndustryPage] Caught error during fetch:", err);
        setError(err.message || "Failed to load industry details.");
      } finally {
        console.log("[IndustryPage] Fetch attempt finished (finally block). Setting loading to false.");
        setLoading(false);
      }
    };

    fetchIndustryData();
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
  if (error || !industryData) {
    console.log(`[IndustryPage] Rendering Error/Not Found State. Has Error: ${!!error}, Error Message: ${error}, Has Industry: ${!!industryData}`);
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
  console.log(`[IndustryPage] Rendering Industry Details for: ${industryData.name}`);
  console.log("[IndustryPage] Industry data being passed down:", industryData);

  return (
    <>
      {/* Hero Section: Pass name and description */}
      {console.log("[IndustryPage] Rendering IndustryHero...")}
      <IndustryHero
        industryName={industryData.name}
        industryDescription={industryData.description || ""}
      />

      {/* Main Content Section using Tabs */}
      <Section className="mt-10">
        <div className="container">
          <TabsRoot value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList>
              <TabTrigger value="overview">Overview</TabTrigger>
              <TabTrigger value="approach">Our Approach</TabTrigger>
            </TabsList>

            <TabsContent>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel value="overview">
                    <OverviewTab industryData={industryData} />
                  </TabPanel>

                  <TabPanel value="approach">
                    <div className="space-y-12">
                      {console.log("[IndustryPage] Approach Tab - Rendering IndustryApplicationCards...")}
                      {industryData.industryApplication && industryData.industryApplication.length > 0 ? (
                        industryData.industryApplication.map((app) => (
                          <IndustryApplicationCard key={app.id} application={app} />
                        ))
                      ) : (
                        <p className="text-center text-n-4 py-8">No specific applications detailed for this industry yet.</p>
                      )}
                    </div>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </TabsRoot>
        </div>
      </Section>

      {/* Background Gradient */}
      <div
        className={`fixed inset-0 bg-gradient-to-b ${colorClass}
          opacity-10 pointer-events-none z-0`}
      />
    </>
  );
};

export default IndustryPage;