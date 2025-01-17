import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { technologyService } from '@/services/technologyService';
import { useTheme } from '@/context/ThemeContext';

const TechnologyCard = ({ tech }) => {
  const { isDarkMode } = useTheme();
  if (!tech) return null;

  // Default icon paths
  const defaultIcon = '/images/icons/default-tech.svg';
  const fallbackIcon = '/images/icons/cube.svg';  // Adding a second fallback
  
  const iconUrl = tech?.icon || defaultIcon;
  const name = tech?.name || 'Unknown Technology';
  const description = tech?.description || '';
  const features = Array.isArray(tech?.features) ? tech.features : [];
  const businessMetrics = Array.isArray(tech?.businessMetrics)
    ? tech.businessMetrics
    : [];
  const useCases = Array.isArray(tech?.useCases) ? tech.useCases : [];
  const slug = tech?.slug || '';

  const isCategory = !tech.icon && !tech.features?.length && !tech.businessMetrics?.length;

  const cardContent = (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${
            isDarkMode ? 'bg-n-6' : 'bg-n-2'
          } flex items-center justify-center p-2`}
        >
          <img
            src={iconUrl}
            alt={name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              if (e.target.src !== fallbackIcon) {
                e.target.src = fallbackIcon;
              }
            }}
          />
        </div>
        <h3
          className={`font-semibold text-lg ${
            isDarkMode ? 'text-n-1' : 'text-n-8'
          }`}
        >
          {name}
        </h3>
      </div>

      <p
        className={`${
          isDarkMode ? 'text-n-3' : 'text-n-5'
        } text-sm line-clamp-2 mb-4`}
      >
        {description}
      </p>

      {features.length > 0 && (
        <div className="mb-4">
          <h4
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-n-1' : 'text-n-8'
            }`}
          >
            Key Features
          </h4>
          <ul
            className={`${
              isDarkMode ? 'text-n-3' : 'text-n-5'
            } text-sm space-y-1`}
          >
            {features.slice(0, 3).map((feature, index) => (
              <li key={`feature-${index}`} className="line-clamp-1">
                • {String(feature)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {businessMetrics.length > 0 && (
        <div className="mb-4">
          <h4
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-n-1' : 'text-n-8'
            }`}
          >
            Business Impact
          </h4>
          <ul
            className={`${
              isDarkMode ? 'text-n-3' : 'text-n-5'
            } text-sm space-y-1`}
          >
            {businessMetrics.slice(0, 2).map((metric, index) => (
              <li key={`metric-${index}`} className="line-clamp-1">
                • {String(metric)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {useCases.length > 0 && (
        <div className="mb-4">
          <h4
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-n-1' : 'text-n-8'
            }`}
          >
            Use Cases
          </h4>
          <ul
            className={`${
              isDarkMode ? 'text-n-3' : 'text-n-5'
            } text-sm space-y-1`}
          >
            {useCases.slice(0, 2).map((useCase, index) => (
              <li key={useCase?.id || `usecase-${index}`} className="line-clamp-1">
                • {useCase?.title || 'Unnamed Use Case'}
                {useCase?.industry?.name && (
                  <span className="text-primary-1">
                    {' '}
                    ({useCase.industry.name})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isCategory && (
        <div
          className={`mt-4 pt-3 border ${
            isDarkMode ? 'border-n-6' : 'border-n-3'
          }`}
        >
          <span className="text-primary-1 text-sm hover:text-primary-2 transition-colors">
            View Implementation Details →
          </span>
        </div>
      )}
    </>
  );

  if (isCategory) {
    return (
      <div
        className={`block ${
          isDarkMode ? 'bg-n-7/50' : 'bg-white/50'
        } backdrop-blur rounded-xl p-6 border ${
          isDarkMode ? 'border-n-6' : 'border-n-3'
        }`}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={`/technology/${slug}`}
      className={`block ${
        isDarkMode ? 'bg-n-7/50' : 'bg-white/50'
      } backdrop-blur rounded-xl p-6 
      ${isDarkMode ? 'hover:bg-n-6' : 'hover:bg-n-2'} transition-all duration-300 
      border ${
        isDarkMode ? 'border-n-6' : 'border-n-3'
      } hover:border-primary-1 hover:shadow-lg hover:-translate-y-1`}
    >
      {cardContent}
    </Link>
  );
};

const CategorySection = ({ category, selectedSubcategory }) => {
  const { isDarkMode } = useTheme();
  if (!category) return null;

  // Track duplicates to avoid showing same technology multiple times.
  const techTracker = new Map();

  // 1. Direct technologies (not assigned to subcategories).
  const directTechnologies = (category.technologies || []).filter((tech) => {
    if (!tech.slug || techTracker.has(tech.slug)) return false;
    techTracker.set(tech.slug, true);
    return true;
  });

  // 2. Filter subcategories and remove duplicates
  const sortedSubcategories =
    category.technologySubcategory
      ?.filter((sub) => sub && sub.technology && sub.technology.length > 0)
      ?.map((sub) => ({
        ...sub,
        technology: sub.technology.filter((tech) => {
          if (!tech.slug || techTracker.has(tech.slug)) return false;
          techTracker.set(tech.slug, true);
          return true;
        }),
      }))
      ?.filter((sub) => sub.technology.length > 0)
      ?.sort((a, b) => (a.priority || 999) - (b.priority || 999)) || [];

  // If a subcategory is specifically selected, display only that subcategory.
  if (selectedSubcategory) {
    const selectedSubcategoryData = sortedSubcategories.find(
      (sub) => sub.slug === selectedSubcategory
    );
    if (selectedSubcategoryData) {
      return (
        <div
          className={`${
            isDarkMode ? 'bg-gradient-to-b from-n-8 to-n-7' : 'bg-gradient-to-b from-white to-n-1'
          } 
          rounded-xl p-8 border ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
        >
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

  // Otherwise show the category's core technologies plus all subcategories.
  return (
    <div className="space-y-12">
      {directTechnologies.length > 0 && (
        <div
          className={`${
            isDarkMode ? 'bg-gradient-to-b from-n-8 to-n-7' : 'bg-gradient-to-b from-white to-n-1'
          } rounded-xl p-8 border ${
            isDarkMode ? 'border-n-6' : 'border-n-3'
          }`}
        >
          <h3 className="text-2xl font-semibold mb-6 text-primary-1">
            Core Technologies
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directTechnologies.map((tech, index) => (
              <TechnologyCard
                key={tech.slug || `direct-tech-${category.slug}-${index}`}
                tech={tech}
              />
            ))}
          </div>
        </div>
      )}

      {sortedSubcategories.length > 0 && (
        <div className="grid grid-cols-1 gap-12">
          {sortedSubcategories.map((subcategory, index) => (
            <div
              key={subcategory.slug || `subcategory-${category.slug}-${index}`}
              className={`${
                isDarkMode ? 'bg-n-8' : 'bg-white'
              } rounded-xl p-8 border ${
                isDarkMode ? 'border-n-6' : 'border-n-3'
              }`}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-primary-1 mb-3">
                  {subcategory.name}
                </h3>
                {subcategory.description && (
                  <p
                    className={`${
                      isDarkMode ? 'text-n-3' : 'text-n-5'
                    } text-base`}
                  >
                    {subcategory.description}
                  </p>
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
  const { isDarkMode } = useTheme();
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

        const hash = window.location.hash.slice(1);
        if (hash && data) {
          const category = data.find((cat) => cat.slug === hash);
          if (category) {
            setSelectedCategory(category.slug);
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
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error loading technology stack');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategorySlug) => {
    if (!subcategorySlug) {
      console.warn('Invalid subcategory slug');
      return;
    }
    
    console.log('Subcategory clicked:', subcategorySlug);
    // If clicking the same subcategory, deselect it
    if (selectedSubcategory === subcategorySlug) {
      setSelectedSubcategory(null);
    } else {
      // Otherwise, select the new subcategory
      setSelectedSubcategory(subcategorySlug);
    }
  };

  if (loading) {
    return (
      <Section className="text-center">
        <div className={`animate-pulse ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
          Loading technology stack...
        </div>
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

  const selectedCategoryData = categories.find(
    (cat) => cat.slug === selectedCategory
  );

  return (
    <Section className="py-12">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <Link
              to="/"
              className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} hover:text-primary-1 text-sm`}
            >
              Home
            </Link>
            <span className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mx-2`}>
              /
            </span>
            <span className={`${isDarkMode ? 'text-n-1' : 'text-n-8'} text-sm`}>
              Technologies
            </span>
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Technology Stack
          </h1>
          <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} text-lg max-w-3xl`}>
            Explore our comprehensive technology stack, featuring cutting-edge tools and frameworks that power our solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className={`${isDarkMode ? 'bg-n-8/90' : 'bg-white/90'} backdrop-blur border ${isDarkMode ? 'border-n-6' : 'border-n-3'} rounded-2xl overflow-hidden`}>
              <div className="p-6 space-y-4">
                {categories.map((category) => (
                  <div key={category.slug} className="space-y-1">
                    <button
                      onClick={() => handleCategorySelect(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? `${isDarkMode ? 'bg-n-7' : 'bg-n-2'} text-primary-1`
                          : `hover:${isDarkMode ? 'bg-n-7' : 'bg-n-2'} ${isDarkMode ? 'text-n-1' : 'text-n-8'}`
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
                <div
                  id={selectedCategoryData.slug}
                  className={`${isDarkMode ? 'bg-n-8' : 'bg-white'} rounded-xl p-8 border ${
                    isDarkMode ? 'border-n-6' : 'border-n-3'
                  }`}
                >
                  <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {selectedCategoryData.name}
                  </h2>

                  {selectedCategoryData.technologySubcategory?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {selectedCategoryData.technologySubcategory.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategorySelect(sub.slug)}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                            transition-all duration-200
                            ${
                              selectedSubcategory === sub.slug
                                ? 'bg-primary-1 text-white shadow-lg shadow-primary-1/25'
                                : `${
                                    isDarkMode
                                      ? 'bg-n-7 text-n-3 hover:bg-n-6 hover:text-n-1 border border-n-6'
                                      : 'bg-white text-n-5 hover:bg-n-2 hover:text-n-8 border border-n-3'
                                  }`
                            }
                          `}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedCategoryData.description && (
                    <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} text-lg mt-4`}>
                      {selectedCategoryData.description}
                    </p>
                  )}
                </div>

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
