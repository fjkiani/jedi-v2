import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { technologyService } from '@/services/technologyService';

const TechStackDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!loading && error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Technology not found</h1>
        <p className="mb-4">The technology or category you're looking for could not be found.</p>
        <Link 
          to="/technology" 
          className="text-blue-500 hover:underline"
        >
          ← Back to Technologies
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <Link 
        to="/technology" 
        className="text-blue-500 hover:underline"
      >
        ← Back to Technologies
      </Link>
    </div>
  );
};

export default TechStackDetail;
