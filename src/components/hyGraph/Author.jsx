"use client";  // Add this line at the top

import React, { useEffect, useState } from 'react';


const Author = ({ author }) => {
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
    console.log('Author Data:', author); // Debug log
  }, [author]);

  if (!author) {
    console.log('No author data received');
    return null;
  }

  // Safely access photo URL
  const photoUrl = author?.photo?.url;
  const authorName = author?.name || 'Author';
  const authorBio = author?.bio;

  console.log('Photo URL:', photoUrl); // Debug log
  console.log('Author Name:', authorName); // Debug log
  console.log('Author Bio:', authorBio); // Debug log

  return (
    clientSide && (
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
        {authorBio && <p className="text-white text-ls">{authorBio}</p>}
      </div>
    )
  );
};

export default Author;
