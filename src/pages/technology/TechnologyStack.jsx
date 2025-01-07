import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/Section';
import { technologyService } from '../../services/technologyService';

const TechnologyCard = ({ tech }) => {
  // Early return if tech is not provided
  if (!tech) return null;

  // Safely access the icon URL and ensure arrays
  const iconUrl = tech?.icon || '';
  const name = tech?.name || 'Unknown Technology';
  const description = tech?.description || '';
  const features = Array.isArray(tech?.features) ? tech.features : [];
  const businessMetrics = Array.isArray(tech?.businessMetrics) ? tech.businessMetrics : [];
  const useCases = Array.isArray(tech?.useCases) ? tech.useCases : [];
  const slug = tech?.slug || '';

  // Default fallback icon (you can replace this with your own default icon URL)
  const defaultIcon = '/images/icons/default-tech.svg';

  // If this is a category (like 'automation'), don't make it clickable
  const isCategory = !tech.icon && !tech.features?.length && !tech.businessMetrics?.length;
  
  const cardContent = (
    <>
      <div className="flex items-center gap-4 mb-4">
        {iconUrl && (
          <div className="w-12 h-12 rounded-lg bg-n-6 flex items-center justify-center p-2">
            <img 
              src={iconUrl}
              alt={name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultIcon;
              }}
            />
          </div>
        )}
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <p className="text-n-3 text-sm line-clamp-2 mb-4">{description}</p>

      {features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Key Features</h4>
          <ul className="text-n-3 text-sm space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={`feature-${index}`} className="line-clamp-1">• {String(feature)}</li>
            ))}
          </ul>
        </div>
      )}

      {businessMetrics.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Business Impact</h4>
          <ul className="text-n-3 text-sm space-y-1">
            {businessMetrics.slice(0, 2).map((metric, index) => (
              <li key={`metric-${index}`} className="line-clamp-1">• {String(metric)}</li>
            ))}
          </ul>
        </div>
      )}

      {useCases.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Use Cases</h4>
          <ul className="text-n-3 text-sm space-y-1">
            {useCases.slice(0, 2).map((useCase, index) => (
              <li key={useCase?.id || `usecase-${index}`} className="line-clamp-1">
                • {useCase?.title || 'Unnamed Use Case'}
                {useCase?.industry?.name && (
                  <span className="text-primary-1"> ({useCase.industry.name})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isCategory && (
        <div className="mt-4 pt-3 border-t border-n-6">
          <span className="text-primary-1 text-sm hover:text-primary-2 transition-colors">
            View Implementation Details →
          </span>
        </div>
      )}
    </>
  );

  if (isCategory) {
    return (
      <div className="block bg-n-7/50 backdrop-blur rounded-xl p-6 border border-n-6">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={`/technology/${slug}`}
      className="block bg-n-7/50 backdrop-blur rounded-xl p-6 hover:bg-n-6 transition-all duration-300 border border-n-6 hover:border-primary-1 hover:shadow-lg hover:-translate-y-1"
    >
      {cardContent}
    </Link>
  );
};

const SubcategorySection = ({ subcategory }) => {
  if (!subcategory?.technology?.length) return null;

  // Log the technologies to check for duplicates
  console.log('Subcategory:', subcategory.name, 'Technologies:', subcategory.technology.map(t => ({ slug: t.slug, name: t.name })));

  // Create a Map to track unique technologies by slug
  const uniqueTechMap = new Map();
  subcategory.technology.forEach(tech => {
    if (!uniqueTechMap.has(tech.slug)) {
      uniqueTechMap.set(tech.slug, tech);
    } else {
      console.warn('Duplicate technology found in subcategory:', subcategory.name, 'Tech:', tech.name);
    }
  });

  const sortedTech = [...uniqueTechMap.values()].sort(
    (a, b) => (a.priority || 999) - (b.priority || 999)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-3 text-primary-1">{subcategory.name}</h3>
        {subcategory.description && (
          <p className="text-n-3 text-base">{subcategory.description}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTech.map((tech, index) => (
          <TechnologyCard key={tech.slug || `tech-${subcategory.slug}-${index}`} tech={tech} />
        ))}
      </div>
    </div>
  );
};

const CategorySection = ({ category, selectedSubcategory }) => {
  if (!category) return null;

  // Create a Map to track all technologies in this category by slug
  const techTracker = new Map();
  
  // First, add direct technologies to the tracker
  const directTechnologies = (category.technologies || []).filter(tech => {
    if (!tech.slug || techTracker.has(tech.slug)) {
      console.warn('Duplicate or invalid technology found in direct technologies:', tech.name);
      return false;
    }
    techTracker.set(tech.slug, true);
    return true;
  });

  // Then, process subcategories and filter out duplicates
  const sortedSubcategories = category.technologySubcategory
    ?.filter(sub => sub && sub.technology && sub.technology.length > 0)
    ?.map(sub => ({
      ...sub,
      // Filter out technologies that are already in the tracker
      technology: sub.technology.filter(tech => {
        if (!tech.slug) {
          console.warn('Technology without slug found in subcategory:', sub.name, tech.name);
          return false;
        }
        if (techTracker.has(tech.slug)) {
          console.warn('Duplicate technology found:', tech.name, 'in subcategory:', sub.name);
          return false;
        }
        techTracker.set(tech.slug, true);
        return true;
      })
    }))
    ?.filter(sub => sub.technology.length > 0) // Remove empty subcategories
    ?.sort((a, b) => (a.priority || 999) - (b.priority || 999)) || [];

  // If a subcategory is selected, only show technologies from that subcategory
  if (selectedSubcategory) {
    const selectedSubcategoryData = sortedSubcategories.find(sub => sub.slug === selectedSubcategory);
    if (selectedSubcategoryData) {
      return (
        <div className="bg-gradient-to-b from-n-8 to-n-7 rounded-xl p-8 border border-n-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSubcategoryData.technology.map((tech, index) => (
              <TechnologyCard 
                key={tech.slug || `tech-${selectedSubcategoryData.slug}-${index}`} 
                tech={tech} 
              />
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  // If no subcategory is selected, show all technologies
  return (
    <div className="space-y-12">
      {/* Direct Technologies (if any) */}
      {directTechnologies.length > 0 && (
        <div className="bg-gradient-to-b from-n-8 to-n-7 rounded-xl p-8 border border-n-6">
          <h3 className="text-2xl font-semibold mb-6 text-primary-1">Core Technologies</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directTechnologies.map((tech, index) => (
              <TechnologyCard key={tech.slug || `direct-tech-${category.slug}-${index}`} tech={tech} />
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Grid */}
      {sortedSubcategories.length > 0 && (
        <div className="grid grid-cols-1 gap-12">
          {sortedSubcategories.map((subcategory, index) => (
            <div key={subcategory.slug || `subcategory-${category.slug}-${index}`} className="bg-n-8 rounded-xl p-8 border border-n-6">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-primary-1 mb-3">{subcategory.name}</h3>
                {subcategory.description && (
                  <p className="text-n-3 text-base">{subcategory.description}</p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategory.technology.map((tech, techIndex) => (
                  <TechnologyCard 
                    key={tech.slug || `tech-${subcategory.slug}-${techIndex}`} 
                    tech={tech} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TechnologyStack = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getAllCategories();
        setCategories(data || []);
        
        // Get the category from the hash if it exists
        const hash = window.location.hash.slice(1);
        if (hash && data) {
          const category = data.find(cat => cat.slug === hash);
          if (category) {
            setSelectedCategory(category.slug);
            // Scroll to the category after a short delay to ensure rendering
            setTimeout(() => {
              const element = document.getElementById(category.slug);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }
        } else if (data && data.length > 0) {
          setSelectedCategory(data[0].slug);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error loading technology stack');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory(null); // Reset subcategory selection when changing category
  };

  const handleSubcategorySelect = (subcategorySlug) => {
    setSelectedSubcategory(subcategorySlug === selectedSubcategory ? null : subcategorySlug);
  };

  if (loading) return <Section className="text-center"><div className="animate-pulse">Loading technology stack...</div></Section>;
  if (error) return <Section className="text-center"><div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><p className="text-red-500">{error}</p></div></Section>;

  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);

  return (
    <Section className="py-12">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <Link to="/" className="text-n-3 hover:text-color-1 text-sm">Home</Link>
            <span className="text-n-3 mx-2">/</span>
            <span className="text-n-1 text-sm">Technologies</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">Technology Stack</h1>
          <p className="text-n-3 text-lg max-w-3xl">
            Explore our comprehensive technology stack, featuring cutting-edge tools and frameworks that power our solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-n-8/90 backdrop-blur border border-n-6 rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                {categories.map((category) => (
                  <div key={category.slug} className="space-y-1">
                    <button
                      onClick={() => handleCategorySelect(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-n-7 text-primary-1' 
                          : 'hover:bg-n-7'
                      }`}
                    >
                      {category.name}
                    </button>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* Category Content */}
          <div className="lg:col-span-3">
            {selectedCategoryData && (
              <div className="space-y-8">
                {/* Category Header with Subcategory Filters */}
                <div id={selectedCategoryData.slug} className="bg-n-8 rounded-xl p-8 border border-n-6">
                  <h2 className="text-3xl font-bold mb-6">{selectedCategoryData.name}</h2>
                  
                  {/* Subcategory Filter Buttons */}
                  {selectedCategoryData.technologySubcategory?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {selectedCategoryData.technologySubcategory.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategorySelect(sub.slug)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedSubcategory === sub.slug
                              ? 'bg-primary-1 text-n-1'
                              : 'bg-n-7 text-n-3 hover:bg-n-6 hover:text-n-1'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedCategoryData.description && (
                    <p className="text-n-3 text-lg mt-4">{selectedCategoryData.description}</p>
                  )}
                </div>

                {/* Render CategorySection with selected subcategory */}
                <CategorySection 
                  category={selectedCategoryData} 
                  selectedSubcategory={selectedSubcategory}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default TechnologyStack;
