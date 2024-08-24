"use client";  // Add this line at the top

import React, { useEffect, useState } from 'react';


const Author = ({ author }) => {
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true); // Ensure client-side rendering
  }, []);

  if (!author) {
    return null; // Handle the case when author is undefined
  }

  return (
    clientSide && (
      <div className="text-center mt-20 mb-8 p-12 relative rounded-lg bg-black bg-opacity-20">
        <div className="absolute left-0 right-0 -top-14">
          <img
            unoptimized
            alt={author.name}
            height={100} // Adjusted height
            width={100}  // Adjusted width
            className="align-middle rounded-full"
            src={author.photo.url}
          />
        </div>
        <h3 className="text-white mt-4 mb-4 text-xl font-bold">{author.name}</h3>
        <p className="text-white text-ls">{author.bio}</p>
      </div>
    )
  );
};

export default Author;
