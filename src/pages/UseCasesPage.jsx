import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import Heading from '@/components/Heading';
import UseCaseCard from '@/components/UseCaseCard';
import { hygraphClient } from '@/lib/hygraph';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import { useTheme } from '@/context/ThemeContext';

const UseCasesPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_USE_CASES);
        const list = data?.useCaseS || data?.useCases || [];
        setUseCases(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('[UseCasesPage] Error fetching use cases:', err);
        setUseCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUseCases();
  }, []);

  // Extract unique categories from use cases
  const categories = React.useMemo(() => {
    const seen = new Set();
    const cats = [];
    useCases.forEach(uc => {
      if (uc.category?.slug && !seen.has(uc.category.slug)) {
        seen.add(uc.category.slug);
        cats.push({ slug: uc.category.slug, name: uc.category.name });
      }
    });
    return cats;
  }, [useCases]);

  // Filter use cases by active category
  const filteredUseCases = activeCategory === 'all'
    ? useCases
    : useCases.filter(uc => uc.category?.slug === activeCategory);

  const handleUseCaseClick = (useCase) => {
    if (useCase?.slug) navigate(`/use-cases/${useCase.slug}`);
  };

  const handleQueryClick = (useCase) => {
    if (useCase?.slug) navigate(`/use-cases/${useCase.slug}?tab=architecture`);
  };

  return (
    <>
      <SEO
        title="Use Cases | Jedi Labs — Production AI Implementations"
        description="Real production use cases across medical imaging, geospatial segmentation, audio classification, and video understanding. Every case backed by real metrics."
        path="/use-cases"
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">

          {/* Page Header */}
          <Heading
            title="Use Cases"
            text="Production AI deployments across industries — each a live system, not a demo."
            className="mb-10 text-center"
          />

          {/* Category Filter Pills */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-mono uppercase tracking-wider transition-all border ${
                  activeCategory === 'all'
                    ? 'bg-primary-1 text-white border-primary-1'
                    : isDarkMode
                      ? 'border-n-6 text-n-4 hover:border-primary-1 hover:text-n-1'
                      : 'border-n-3 text-n-5 hover:border-primary-1 hover:text-n-8'
                }`}
              >
                All ({useCases.length})
              </button>
              {categories.map(cat => {
                const count = useCases.filter(uc => uc.category?.slug === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-4 py-1.5 rounded-full text-sm font-mono uppercase tracking-wider transition-all border ${
                      activeCategory === cat.slug
                        ? 'bg-primary-1 text-white border-primary-1'
                        : isDarkMode
                          ? 'border-n-6 text-n-4 hover:border-primary-1 hover:text-n-1'
                          : 'border-n-3 text-n-5 hover:border-primary-1 hover:text-n-8'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`rounded-xl p-6 border animate-pulse h-64 ${
                    isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Use Cases Grid */}
          {!loading && filteredUseCases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUseCases.map(useCase => (
                <UseCaseCard
                  key={useCase.id}
                  useCase={useCase}
                  onQueryClick={() => handleQueryClick(useCase)}
                  onClick={() => handleUseCaseClick(useCase)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredUseCases.length === 0 && (
            <div className={`text-center py-20 rounded-2xl border ${
              isDarkMode ? 'border-n-6 text-n-4' : 'border-n-3 text-n-5'
            }`}>
              <p className="body-2 mb-4">
                {activeCategory === 'all'
                  ? 'No use cases published yet.'
                  : `No use cases in this category yet.`}
              </p>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-primary-1 hover:underline text-sm font-mono"
                >
                  View all use cases →
                </button>
              )}
            </div>
          )}

        </div>
      </Section>
    </>
  );
};

export default UseCasesPage;
