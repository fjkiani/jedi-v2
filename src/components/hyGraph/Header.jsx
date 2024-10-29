"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Updated import for internal links
import { getCategories } from '/src/services';

const Header = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((newCategories) => {
      setCategories(newCategories);
    });
  }, []);

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block border-blue-400 py-8">
        <div className="md:float-left block">
          <Link to="/">
            <span className="cursor-pointer font-bold text-4xl text-white">Graph CMS</span>
          </Link>
        </div>
        <div className="hidden md:float-left md:contents">
          {categories.map((category, index) => (
            <Link key={index} to={`/blog/category/${category.slug}`}>
              <span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">
                {category.name}
              </span>
            </Link>
          ))}
          {/* Add the Learning Hub link */}
          <a
            href="https://edulga-ai-course-generator.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer"
          >
            Learning Hub
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
