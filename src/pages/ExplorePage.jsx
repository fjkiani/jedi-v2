import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiZap, FiArrowRight, FiX } from 'react-icons/fi';
import { hygraphClient } from '@/lib/hygraph';
import { GET_ALL_CATEGORIES_WITH_TECHS } from '@/graphql/queries/solutions';
import { GET_USE_CASES } from '@/graphql/queries/useCases';
import { RootSEO } from '@/components/SEO';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TechIcon = ({ icon, name }) => {
  if (icon?.startsWith('http') || icon?.startsWith('/')) {
    return <img src={icon} alt={name} className="w-8 h-8 object-contain rounded" />;
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white">
      {icon || name?.[0] || '?'}
    </div>
  );
};

const CategoryPill = ({ cat, active, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
      active
        ? 'bg-yellow-400 text-black'
        : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
    }`}
  >
    {cat.name}
  </button>
);

// ─── Tech card ────────────────────────────────────────────────────────────────
const TechCard = ({ tech, useCaseCount }) => (
  <Link
    to={`/technology/${tech.slug}`}
    className="group flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-400/30 hover:bg-white/8 transition-all"
  >
    <TechIcon icon={tech.icon} name={tech.name} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
          {tech.name}
        </span>
        <FiArrowRight className="shrink-0 text-white/20 group-hover:text-yellow-400 transition-colors" />
      </div>
      {tech.category?.[0] && (
        <span className="text-xs text-white/40">{tech.category[0].name}</span>
      )}
      {useCaseCount > 0 && (
        <div className="mt-2">
          <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
            {useCaseCount} use case{useCaseCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  </Link>
);

// ─── Use case card ────────────────────────────────────────────────────────────
const UseCaseCard = ({ uc }) => {
  const techs = uc.technologies || [];
  return (
    <Link
      to={`/use-cases/${uc.slug}`}
      className="group block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-yellow-400/30 hover:bg-white/8 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors leading-snug">
          {uc.title}
        </h4>
        <FiArrowRight className="shrink-0 mt-0.5 text-white/20 group-hover:text-yellow-400 transition-colors" />
      </div>

      {uc.resultsHeadline && (
        <p className="text-xs text-green-400 font-medium mb-2">{uc.resultsHeadline}</p>
      )}

      {uc.description && (
        <p className="text-xs text-white/50 line-clamp-2 mb-3">{uc.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        {uc.category && (
          <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
            {uc.category.name}
          </span>
        )}
        {techs.length > 0 && (
          <div className="flex items-center gap-1">
            {techs.slice(0, 4).map(t => (
              <TechIcon key={t.id} icon={t.icon} name={t.name} />
            ))}
            {techs.length > 4 && (
              <span className="text-xs text-white/30">+{techs.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ExplorePage = () => {
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('both'); // 'both' | 'tech' | 'usecases'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      hygraphClient.request(GET_ALL_CATEGORIES_WITH_TECHS),
      hygraphClient.request(GET_USE_CASES),
    ]).then(([catData, ucData]) => {
      setCategories(catData?.categories || []);
      setTechnologies(catData?.technologyS || []);
      setUseCases(ucData?.useCaseS || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Build a map: techSlug → number of use cases that use it
  const techUseCaseCount = useMemo(() => {
    const map = {};
    useCases.forEach(uc => {
      (uc.technologies || []).forEach(t => {
        map[t.slug] = (map[t.slug] || 0) + 1;
      });
    });
    return map;
  }, [useCases]);

  // Filter technologies
  const filteredTechs = useMemo(() => {
    let list = technologies;
    if (activeCategory !== 'all') {
      list = list.filter(t =>
        Array.isArray(t.category)
          ? t.category.some(c => c.slug === activeCategory)
          : t.category?.slug === activeCategory
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q));
    }
    return list;
  }, [technologies, activeCategory, search]);

  // Filter use cases
  const filteredUseCases = useMemo(() => {
    let list = useCases;
    if (activeCategory !== 'all') {
      list = list.filter(uc => uc.category?.slug === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(uc =>
        uc.title.toLowerCase().includes(q) ||
        (uc.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [useCases, activeCategory, search]);

  const showTech = view === 'both' || view === 'tech';
  const showUC = view === 'both' || view === 'usecases';

  return (
    <>
      <RootSEO
        title="Explore the Stack | JEDI Labs"
        description="Browse JEDI Labs technologies and use cases by capability. Filter by category to find the right AI stack for your problem."
      />

      <div className="min-h-screen bg-n-8 text-white">
        {/* ── HEADER ── */}
        <div className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="max-w-7xl mx-auto px-6 py-14 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Explore the Stack
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-white/50 text-lg max-w-xl mx-auto mb-8"
            >
              Browse technologies and use cases by capability. Every card links to a live deployment or technical deep-dive.
            </motion.p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search technologies or use cases…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="border-b border-white/10 bg-n-8/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              <CategoryPill
                cat={{ name: 'All', slug: 'all' }}
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
              />
              {categories.map(cat => (
                <CategoryPill
                  key={cat.slug}
                  cat={cat}
                  active={activeCategory === cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                />
              ))}
            </div>

            {/* View toggle */}
            <div className="shrink-0 flex items-center gap-1 bg-white/10 rounded-lg p-1">
              {[
                { id: 'both', label: 'Both', icon: FiGrid },
                { id: 'tech', label: 'Tech', icon: FiGrid },
                { id: 'usecases', label: 'Use Cases', icon: FiZap },
              ].map(v => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      view === v.id ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    <Icon className="text-xs" />
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-white/30 animate-pulse">Loading stack…</div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className={`grid gap-10 ${view === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

              {/* Technologies column */}
              {showTech && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiGrid className="text-yellow-400" />
                      Technologies
                      <span className="text-sm font-normal text-white/40">({filteredTechs.length})</span>
                    </h2>
                    <Link to="/technology" className="text-xs text-white/40 hover:text-white transition-colors">
                      Full stack →
                    </Link>
                  </div>

                  {filteredTechs.length === 0 ? (
                    <div className="text-center py-16 text-white/30">
                      No technologies match{activeCategory !== 'all' ? ' this category' : ''}{search ? ` "${search}"` : ''}.
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredTechs.map((tech, i) => (
                          <motion.div
                            key={tech.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.02 }}
                          >
                            <TechCard tech={tech} useCaseCount={techUseCaseCount[tech.slug] || 0} />
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                </div>
              )}

              {/* Use Cases column */}
              {showUC && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiZap className="text-yellow-400" />
                      Use Cases
                      <span className="text-sm font-normal text-white/40">({filteredUseCases.length})</span>
                    </h2>
                    <Link to="/use-cases" className="text-xs text-white/40 hover:text-white transition-colors">
                      All use cases →
                    </Link>
                  </div>

                  {filteredUseCases.length === 0 ? (
                    <div className="text-center py-16 text-white/30">
                      No use cases match{activeCategory !== 'all' ? ' this category' : ''}{search ? ` "${search}"` : ''}.
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      <div className="grid grid-cols-1 gap-4">
                        {filteredUseCases.map((uc, i) => (
                          <motion.div
                            key={uc.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <UseCaseCard uc={uc} />
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExplorePage;
