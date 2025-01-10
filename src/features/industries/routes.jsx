import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IndustriesOverview from './pages/IndustriesOverview';
import IndustryPage from './pages/IndustryPage';
import SolutionPage from './pages/SolutionPage';
import PageTransition from '@/components/transitions/PageTransition';
import CaseStudies from '@/components/CaseStudies';
import Contact from '@/components/Contact';
import WhyChooseUs from '@/components/WhyChooseUs';

const IndustryRoutes = () => {
  return (
    <Routes>
      {/* Overview page */}
      <Route 
        path="/" 
        element={
          <PageTransition>
            <IndustriesOverview />
            <WhyChooseUs />
            {/* <CaseStudies /> */}
            <Contact />
          </PageTransition>
        } 
      />
      
      {/* Individual industry page */}
      <Route 
        path=":industryId" 
        element={
          <PageTransition>
            <IndustryPage />
            <CaseStudies />
            <Contact />
          </PageTransition>
        } 
      />
      
      {/* Solution page */}
      <Route 
        path=":industryId/:solutionId" 
        element={
          <PageTransition>
            <SolutionPage />
            <CaseStudies />
            <Contact />
          </PageTransition>
        } 
      />
    </Routes>
  );
};

export default IndustryRoutes;
