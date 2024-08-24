"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Updated import

import { getCategories } from '/src/services';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((newCategories) => {
      setCategories(newCategories);
    });
  }, []);

  return (
    <div className="shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
      {categories.map((category, index) => (
        <Link key={index} to={`/blog/category/${category.slug}`}>
          <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
