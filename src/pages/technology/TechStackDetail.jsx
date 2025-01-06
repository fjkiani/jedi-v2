import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Add immediate debugging
console.log('TechStackDetail file loaded');

const TechStackDetail = () => {
  console.log('TechStackDetail component rendering');
  
  const { slug } = useParams();
  console.log('Current slug:', slug);

  // ... rest of your component code

  // Add debug render
  if (!technology && !loading) {
    console.log('Rendering null state');
    return (
      <div className="container">
        <h1>Debug Info</h1>
        <pre>
          {JSON.stringify({
            slug,
            storedData: localStorage.getItem('selectedTechnology'),
            loading,
            technology
          }, null, 2)}
        </pre>
      </div>
    );
  }

  // ... rest of your render code
};

// Add explicit export
export default TechStackDetail;
