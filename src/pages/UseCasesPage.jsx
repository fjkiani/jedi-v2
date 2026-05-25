import React from 'react';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import CaseStudies from '@/components/CaseStudies';

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
          <CaseStudies />
        </div>
      </Section>
    </>
  );
};

export default UseCasesPage;
