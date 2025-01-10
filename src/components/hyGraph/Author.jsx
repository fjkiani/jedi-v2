"use client";  // Add this line at the top

import React, { useEffect, useState } from 'react';

const Author = ({ author }) => {
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
    console.log('Author Component - Full Author Data:', author);
  }, [author]);

  if (!author) {
    console.log('Author Component - No author data received');
    return null;
  }

  // Access the first item in the array if author is an array
  const authorData = Array.isArray(author) ? author[0] : author;
  
  // Safely access author properties from the correct structure
  const photoUrl = authorData?.photo?.url || authorData?.image?.url;
  const authorName = authorData?.name;
  const authorBio = typeof authorData?.bio === 'string' 
    ? authorData.bio 
    : authorData?.bio?.html || '';
  const authorTitle = authorData?.title;

  console.log('Author Component - Processed Data:', {
    photoUrl,
    authorName,
    authorBio,
    authorTitle
  });

  if (!authorName) {
    console.log('Author Component - No author name found');
    return null;
  }

  return (
    <div className="text-center mt-20 mb-8 p-12 relative rounded-lg bg-black bg-opacity-20">
      <div className="absolute left-0 right-0 -top-14">
        <img
          alt={authorName}
          height="100"
          width="100"
          className="align-middle rounded-full mx-auto"
          src={photoUrl || 'https://via.placeholder.com/100x100'}
        />
      </div>
      <h3 className="text-white mt-4 mb-4 text-xl font-bold">{authorName}</h3>
      {authorTitle && (
        <p className="text-white text-sm mb-4">{authorTitle}</p>
      )}
      {authorBio && (
        <div 
          className="text-white text-ls"
          dangerouslySetInnerHTML={{ __html: authorBio }}
        />
      )}
    </div>
  );
};

export default Author;
