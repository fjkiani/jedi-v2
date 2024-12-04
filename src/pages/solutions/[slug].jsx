import React from 'react';
import { useParams } from 'react-router-dom';
import { benefits } from '../../constants';

const SolutionPage = () => {
  const { slug } = useParams();
  const solution = benefits.find(benefit => benefit.slug === slug);

  if (!solution) {
    return <div>Solution not found</div>;
  }

  return (
    <div className="container py-20">
      <h1 className="h1 mb-10">{solution.title}</h1>
      <div className="prose prose-invert max-w-none">
        {/* Add detailed content for each solution */}
        <p>{solution.text}</p>
        {solution.subcategories?.map((sub, index) => (
          <div key={index}>
            <h3>{sub.title}</h3>
            <p>{sub.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionPage; 