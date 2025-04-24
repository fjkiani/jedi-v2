import React from 'react';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import CaseStudies from '@/components/CaseStudies'; // Import the component we just modified
import SEO from '@/components/SEO'; // Import SEO component

const UseCasesPage = () => {
  return (
    <>
      <SEO
        title="AI Use Cases & Success Stories"
        description="Explore real-world examples of how Jedi Labs' AI solutions drive transformation across various industries. See our success stories and discover potential applications for your business."
        // Add other SEO props as needed (keywords, image, etc.)
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          {/* Optional: Add a main heading for the page if CaseStudies doesn't have one */}
          {/*
          <Heading
            className="md:max-w-md lg:max-w-2xl mb-12 lg:mb-20"
            title="Explore Our AI Use Cases"
          />
          */}

          {/* Render the CaseStudies component which fetches and displays the cards */}
          <CaseStudies />

        </div>
      </Section>
    </>
  );
};

export default UseCasesPage; 