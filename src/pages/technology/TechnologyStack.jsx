import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/Section';
import { technologyService } from '../../services/technologyService';

const TechnologyCard = ({ tech }) => (
  <Link
    to={`/technology/${tech.slug}`}
    className="block bg-n-7 rounded-xl p-4 hover:bg-n-6 transition-colors border border-n-6 hover:border-primary-1"
  >
    <div className="flex items-center gap-3 mb-2">
      {tech.icon && (
        <img 
          src={tech.icon}
          alt={tech.name}
          className="w-8 h-8 object-contain"
        />
      )}
      <h3 className="font-semibold text-base">{tech.name}</h3>
    </div>
    <p className="text-n-3 text-sm line-clamp-2 mb-2">{tech.description}</p>
    <div className="mt-3">
      <span className="text-primary-1 text-sm">View Implementation Details →</span>
    </div>
  </Link>
);

const SubcategorySection = ({ subcategory }) => {
  if (!subcategory?.technology?.length) return null;

  const sortedTech = [...subcategory.technology].sort(
    (a, b) => (a.priority || 999) - (b.priority || 999)
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-n-1">{subcategory.name}</h3>
      {subcategory.description && (
        <p className="text-n-3 text-sm">{subcategory.description}</p>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedTech.map((tech) => (
          <TechnologyCard key={tech.slug} tech={tech} />
        ))}
      </div>
    </div>
  );
};

const CategorySection = ({ category }) => {
  if (!category) return null;

  const directTechnologies = category.technologies || [];
  const sortedSubcategories = category.technologySubcategory
    ?.filter(sub => sub && sub.technology && sub.technology.length > 0)
    ?.sort((a, b) => (a.priority || 999) - (b.priority || 999)) || [];

  // If no content at all, don't render the category
  if (directTechnologies.length === 0 && sortedSubcategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        {category.description && (
          <p className="text-n-3">{category.description}</p>
        )}
      </div>

      {/* Direct Technologies (if any) */}
      {directTechnologies.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-n-1">Core Technologies</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {directTechnologies.map((tech) => (
              <TechnologyCard key={tech.slug} tech={tech} />
            ))}
          </div>
        </div>
      )}

      {/* Subcategorized Technologies */}
      {sortedSubcategories.length > 0 && (
        <div className="space-y-12">
          {sortedSubcategories.map((subcategory) => (
            <SubcategorySection key={subcategory.slug} subcategory={subcategory} />
          ))}
        </div>
      )}
    </div>
  );
};

const TechnologyStack = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getAllCategories();
        console.log('Fetched categories data:', data);
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error loading technology stack');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse">Loading technology stack...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-2">
          <Link to="/" className="text-n-3 hover:text-color-1 text-sm">Home</Link>
          <span className="text-n-3 mx-2">/</span>
          <span className="text-n-1 text-sm">Technologies</span>
        </div>

        <h1 className="h2 mb-3">Technology Stack</h1>
        <p className="text-n-3 text-base mb-8">
          Explore our comprehensive technology stack, featuring cutting-edge tools and frameworks that power our solutions.
        </p>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category) => (
            <CategorySection key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TechnologyStack;
