import { useEffect, useState } from 'react';
import { useParams, Routes, Route, Outlet, useLocation } from 'react-router-dom'; // Check imports
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
// ... other potential imports like Section, Heading, Tabs, etc.

// Query to get Technology details by slug
const GetTechnologyBySlug = gql`
  query GetTechnologyBySlug($slug: String!) {
    technologies(where: { slug: $slug }, stage: PUBLISHED, first: 1) {
      id
      name
      description
      logo { url }
      # Potentially fetch related Use Cases here if needed for the main tech page?
      # useCases { id title slug industry { slug } }
    }
  }
`;

// --- Hypothetical Component for the Use Case Tab View ---
// This component would render the /technology/:slug/use-case/:useCaseSlug content
const TechnologyUseCaseDetail = () => {
  const { slug: techSlug, useCaseSlug } = useParams(); // Get both slugs
  const [useCaseData, setUseCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Query to get specific Use Case data (needs architecture, implementation, metrics)
  const GetUseCaseDetailsForTechPage = gql`
    query GetUseCaseDetailsForTechPage($slug: String!) {
      useCases(where: { slug: $slug }, stage: PUBLISHED, first: 1) {
        id
        title
        description # Maybe needed for context?
        metrics
        implementation
        architecture {
          flow {
            step
            description
            details
          }
        }
        # Maybe link back to technology for verification?
        # technologies(where: { slug: $techSlug }) { id }
      }
    }
  `;

  useEffect(() => {
    const fetchUseCase = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[TechnologyUseCaseDetail] Fetching use case: ${useCaseSlug}`);
        // Note: This query doesn't filter by techSlug, relies on slug uniqueness
        const data = await hygraphClient.request(GetUseCaseDetailsForTechPage, { slug: useCaseSlug });
        console.log("[TechnologyUseCaseDetail] Raw data:", data);
        if (data.useCases && data.useCases.length > 0) {
          setUseCaseData(data.useCases[0]);
        } else {
          setUseCaseData(null);
        }
      } catch (err) {
        console.error("Error fetching use case details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (useCaseSlug) {
      fetchUseCase();
    }
  }, [useCaseSlug]); // Dependency on useCaseSlug

  if (loading) return <div>Loading Use Case Details...</div>;
  if (error) return <div>Error loading details.</div>;
  if (!useCaseData) return <div>Use Case not found.</div>;

  // --- Tab Layout Implementation ---
  return (
    <div className="mt-8">
      <Heading tag="h2" className="h3 mb-4">{useCaseData.title} - Details</Heading>
      {/* Assume a Tab component exists */}
      {/* <TabsComponent>
        <Tab title="Architecture">
          {useCaseData.architecture?.flow?.map(step => ( ... render flow ... ))}
        </Tab>
        <Tab title="Implementation">
          <pre><code>{JSON.stringify(useCaseData.implementation, null, 2)}</code></pre>
        </Tab>
        <Tab title="Benefits">
          <ul>{useCaseData.metrics?.map(metric => <li>{metric}</li>)}</ul>
        </Tab>
      </TabsComponent> */}
      <div className="text-n-4">(Tab implementation would be here, rendering architecture, implementation, metrics)</div>
    </div>
  );
};


// --- Main TechnologyPage Component ---
const TechnologyPage = () => {
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Needed to check if we are on a nested route

  useEffect(() => {
    // Fetch main technology data only if not on a nested use-case route?
    // Or maybe always fetch it for context.
    const fetchTechnology = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[TechnologyPage] Fetching technology: ${slug}`);
        const data = await hygraphClient.request(GetTechnologyBySlug, { slug });
        if (data.technologies && data.technologies.length > 0) {
          setTechnology(data.technologies[0]);
        } else {
          setTechnology(null);
        }
      } catch (err) {
        console.error("Error fetching technology:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchTechnology();
    }
  }, [slug]);

  if (loading && !location.pathname.includes('/use-case/')) {
     // Show loading only for the main tech page, not nested
    return <div>Loading Technology Page...</div>;
  }
  if (error) return <div>Error loading technology page.</div>;
  if (!technology && !location.pathname.includes('/use-case/')) {
     // Show not found only for the main tech page
     return <div>Technology not found.</div>;
  }

  // --- Render Main Technology Info OR Nested Route ---
  return (
    <Section className="pt-[12rem] -mt-[5.25rem]">
      <div className="container">
        {/* Display main technology info only if NOT on a nested route */}
        {!location.pathname.includes('/use-case/') && technology && (
          <>
            <Heading className="h1 mb-6">{technology.name}</Heading>
            <img src={technology.logo?.url} alt={technology.name} className="w-16 h-16 mb-4" />
            <p className="body-1 text-n-2">{technology.description}</p>
            {/* Maybe list related use cases here? */}
            <Heading tag="h2" className="h4 mt-8 mb-4">Related Use Cases</Heading>
            {/* Link to /technology/:slug/use-case/:useCaseSlug */}
            {/* Example: <Link to={`/technology/${slug}/use-case/some-use-case-slug`}>Some Use Case</Link> */}
          </>
        )}

        {/* --- Nested Routes Definition --- */}
        {/* This Outlet renders the matched nested route component */}
        <Outlet />

      </div>
    </Section>
  );
};


// --- Nested Route Setup (Potentially in App.jsx or here) ---
// If the routing is defined within TechnologyPage, it might look like this conceptually,
// although the actual implementation in App.jsx is preferred.
// This is just to illustrate the concept if it were nested here.
/*
function TechnologyRoutes() {
  return (
    <Routes>
      <Route path="/technology/:slug" element={<TechnologyPage />}> // Parent route with Outlet
        <Route path="use-case/:useCaseSlug" element={<TechnologyUseCaseDetail />} /> // Nested route
      </Route>
    </Routes>
  );
}
*/

// However, based on the provided App.jsx, this nesting isn't explicitly defined there.
// It's more likely the route /technology/:slug/use-case/:useCaseSlug was defined previously
// and might have been removed or is in a different routing setup file.

export default TechnologyPage; // Export the main page component 