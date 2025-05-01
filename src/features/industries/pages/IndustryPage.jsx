import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient, hygraphEndpoint } from '@/lib/hygraph';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { RichText } from '@graphcms/rich-text-react-renderer';
import ApplicationDisplay from '../components/ApplicationDisplay';
import { useTheme } from '@/context/ThemeContext';
import { RingLoader } from 'react-spinners';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/Heading';
import SEO from '@/components/SEO';
import Button from '@/components/Button';
import CallToAction from '@/components/CallToAction';
import { FiCheckCircle } from 'react-icons/fi';

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
        technology { # Assuming 'technology' is the API ID of the relation
          id
          name
          slug
          icon # Fetch the whole icon object if available, or adjust as needed
        }
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

// --- Helpers for Rendering Overview Sections (Updated Styling) ---
const renderRichTextSection = (title, content, isDarkMode) => { // Pass isDarkMode
  if (!content?.raw) return null;
  return (
    // Added shadow-md for depth, increased padding consistency
    <div className={`p-6 md:p-8 rounded-2xl border mb-10 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} shadow-md`}> 
      <h3 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h3> {/* Use h3 for better hierarchy */}
      <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert text-n-3' : 'text-n-6'}`}>
        <RichText content={content.raw} />
      </div>
    </div>
  );
};

const renderListSection = (title, items, icon = FiCheckCircle, isDarkMode) => { // Pass isDarkMode
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return (
    // Added shadow-md for depth, increased padding consistency
    <div className={`p-6 md:p-8 rounded-2xl border mb-10 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'} shadow-md`}>
      <h3 className={`h3 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{title}</h3> {/* Use h3 and consistent margin */}
      <ul className={`space-y-4`}> {/* Increased spacing */}
        {items.map((item, index) => (
          <li key={index} className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'text-n-3 hover:bg-n-6/50' : 'text-n-6 hover:bg-n-2'} transition-colors`}> {/* Add hover effect */}
             {React.createElement(icon, { className: `w-5 h-5 text-primary-1 mt-1 flex-shrink-0` })} {/* Consistent icon size/margin */}
            <span className="body-1">{item}</span> {/* Use body-1 for slightly larger text */}
          </li>
        ))}
      </ul>
    </div>
  );
};

const IndustryPage = () => {
  const { industryId } = useParams();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [industryData, setIndustryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.log(`[IndustryPage] Fetching details using slug: ${industryId}`);
      try {
        console.log(`[IndustryPage] Requesting from Endpoint: ${hygraphEndpoint}`);
        console.log(`[IndustryPage] Query: ${GET_INDUSTRY_DETAIL_WITH_APPLICATIONS}`);
        console.log(`[IndustryPage] Variables: ${JSON.stringify({ slug: industryId })}`);
        console.log("[IndustryPage] Attempting hygraphClient.request...");
        const data = await hygraphClient.request(GET_INDUSTRY_DETAIL_WITH_APPLICATIONS, { slug: industryId });
        console.log("[IndustryPage] Raw data received:", data);

        if (!data || !data.industries || data.industries.length === 0) { // Check length
          console.warn(`[IndustryPage] Industry not found for slug: ${industryId}`);
          throw new Error(`Industry with slug "${industryId}" not found in Hygraph.`);
        }

        const fetchedIndustryData = data.industries[0];
        console.log("[IndustryPage] Setting industry state:", fetchedIndustryData);
        setIndustryData(fetchedIndustryData);

      } catch (err) {
        console.error("[IndustryPage] Caught error during fetch:", err);
        setError(err.message || "Failed to load industry details.");
      } finally {
        console.log("[IndustryPage] Fetch attempt finished. Setting loading to false.");
        setLoading(false);
      }
    };

    if (industryId) {
      fetchIndustryData();
    } else {
       console.log("[IndustryPage] useEffect stopped: industryId param is missing.");
       setLoading(false);
       setError("Industry slug not found in URL.");
    }
  }, [industryId]);

  // Loading State
  if (loading) {
    console.log("[IndustryPage] Rendering Loading State");
    return (
      <div className="container pt-[8rem] text-center">
        <RingLoader color={isDarkMode ? "#FFFFFF" : "#000000"} size={60} />
        <p className={`h3 mt-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading industry details...</p>
      </div>
    );
  }

  // Error State / Not Found State
  if (error || !industryData) {
    console.log(`[IndustryPage] Rendering Error/Not Found State. Has Error: ${!!error}, Error Message: ${error}, Has Industry: ${!!industryData}`);
    return (
      <div className="container pt-[8rem]">
        <h1 className={`h1 text-center mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{error ? "Error Loading Industry" : "Industry Not Found"}</h1>
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

  // Prepare the context data to pass down
  const industryContextData = {
    fullDescription: industryData.fullDescription,
    benefits: industryData.benefits,
    capabilities: industryData.capabilities,
  };

  return (
    <>
      <SEO
        title={`${industryData.name} Solutions | Jedi Labs`}
        description={industryData.description || `Explore Jedi Labs solutions for the ${industryData.name} industry.`}
        ogUrl={`https://www.jedilabs.org/industries/${industryData.slug}`}
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Back Button */}
          <Link 
            to="/industries" 
            className={`flex items-center mb-6 text-sm font-medium transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-1' : 'text-n-5 hover:text-primary-1'}`}>
            <ArrowLeft size={16} className="mr-1" />
            Back to Industries
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-24">
            <Heading 
              tag={industryData.name} 
              title={`Solutions for ${industryData.name}`} 
            />
             {industryData.description && (
              <p className={`body-1 max-w-3xl mx-auto mt-4 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                {industryData.description}
              </p>
             )}
          </div>

          {/* Applications Section - Now the main content after Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 md:space-y-16" // Spacing between applications
          > 
            {/* REMOVE direct rendering of overview sections */}
            {/* {renderRichTextSection("Industry Context", industryData.fullDescription, isDarkMode)}  */}
            {/* {renderListSection("Key Benefits", industryData.benefits, FiCheckCircle, isDarkMode)} */}
            {/* {renderListSection("Core Capabilities Addressed", industryData.capabilities, FiCheckCircle, isDarkMode)} */}

            {/* Keep the heading for the applications section */}
            {/* <h2 className={`h2 text-center mb-10 md:mb-14 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Our Approach in {industryData.name}
            </h2> */}

            {/* Loop through applications and pass context data */}
            {industryData.industryApplication && industryData.industryApplication.length > 0 ? (
              industryData.industryApplication.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="mb-12 md:mb-16" // Keep spacing between applications
                  id={`application-${app.id}`} // Add ID for linking
                >
                  {/* Pass industryContextData as a prop */}
                  <ApplicationDisplay 
                    application={app} 
                    industryContextData={industryContextData} 
                  />
                </motion.div>
              ))
            ) : (
              <p className={`text-center p-6 rounded-lg border ${isDarkMode ? 'border-n-6 bg-n-7 text-n-4' : 'border-n-3 bg-n-1 text-n-5'}`}>
                Specific applications for {industryData.name} are being detailed. Check back soon!
              </p>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="mt-20 md:mt-28"
           >
            <CallToAction
              title={`Advance Your ${industryData.name} Operations?`}
              description={`Let's explore how Jedi Labs' AI solutions can specifically address your challenges in the ${industryData.name} sector.`}
              buttonText="Request Consultation"
              buttonLink="/contact"
              buttonStyle="primary"
            />
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default IndustryPage;