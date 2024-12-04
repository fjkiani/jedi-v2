import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { industriesList } from '@/constants/industry';
import IndustryHero from '../components/IndustryHero';
import IndustrySolutions from '../components/IndustrySolutions';

const IndustryPage = () => {
  const { industryId } = useParams();
  const industry = industriesList.find(ind => ind.id === industryId);

  if (!industry) {
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center mb-6">Industry Not Found</h1>
        <div className="text-center">
          <Link to="/industries" className="button button-primary">
            Back to Industries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <IndustryHero industry={industry} />
      <IndustrySolutions industry={industry} />
    </div>
  );
};

export default IndustryPage;