import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import { hygraphClient } from '@/lib/hygraph';
import { GET_ALL_SOLUTIONS } from '@/graphql/queries/solutions';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const SolutionsOverview = () => {
  const { isDarkMode } = useTheme();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_ALL_SOLUTIONS);
        setSolutions(data.categories || []);
      } catch (err) {
        console.error('[SolutionsOverview] Error fetching solutions:', err);
        setError('Unable to load solutions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSolutions();
  }, []);

  return (
    <Section className="pt-[8rem] -mt-[5.25rem]">
      <div className="container">
        <Heading
          title="AI Solutions"
          text="Enterprise-grade capabilities built for scale."
          className="mb-16 text-center"
        />

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl p-6 border h-48 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className={`body-1 mb-6 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{error}</p>
            <Button onClick={() => window.location.reload()} white>Retry</Button>
          </div>
        )}

        {!loading && !error && solutions.length === 0 && (
          <div className="text-center py-16">
            <p className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Solutions are being configured. Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && solutions.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, i) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/solutions/${solution.slug}`}
                  className={`group flex flex-col h-full rounded-2xl p-6 border transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-n-7 border-n-6 hover:border-primary-1'
                      : 'bg-white border-n-3 shadow-sm hover:border-primary-1 hover:shadow-md'
                  }`}
                >
                  {/* Hero image or placeholder */}
                  {solution.heroImage?.url ? (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                      <img
                        src={solution.heroImage.url}
                        alt={solution.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20' : 'bg-primary-1/10'}`}>
                      <span className="text-primary-1 font-bold text-lg">
                        {solution.name?.charAt(0) ?? 'S'}
                      </span>
                    </div>
                  )}

                  <h2 className={`h4 mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {solution.name}
                  </h2>

                  {solution.tagline && (
                    <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>
                      {solution.tagline}
                    </p>
                  )}

                  {solution.description && (
                    <p className={`body-2 flex-1 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                      {solution.description}
                    </p>
                  )}

                  <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
                    <span className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                      {solution.featured ? 'Featured' : 'Available'}
                    </span>
                    <span className="text-primary-1 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                      Explore →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default SolutionsOverview;
