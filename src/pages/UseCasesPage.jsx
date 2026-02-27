import React from 'react';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import CaseStudies from '@/components/CaseStudies'; // Import the component we just modified
import SEO from '@/components/SEO'; // Import SEO component

const UseCasesPage = () => {
  return (
    <>
      <SEO
        title="Use Cases | JEDI Labs — Agentic AI Implementations"
        description="Real use cases: CrisPRO Oncology, AI voice operations, fraud detection, personalized learning. Production co-pilots built for SMBs across Healthcare, Finance, Education."
        path="/use-cases"
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