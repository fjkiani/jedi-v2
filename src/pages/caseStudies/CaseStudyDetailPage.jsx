import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { hygraphClient } from '@/lib/hygraph';
import { GET_CASE_STUDY_BY_SLUG } from '@/graphql/queries/caseStudies';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import {
  FiArrowLeft,
  FiFileText,
  FiPlay,
  FiImage,
  FiCpu,
  FiBook,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiBarChart2 },
  { id: 'results', label: 'Results', icon: FiTrendingUp },
  { id: 'pdf', label: 'PDF Deck', icon: FiFileText },
  { id: 'video', label: 'Video', icon: FiPlay },
  { id: 'gallery', label: 'Gallery', icon: FiImage },
  { id: 'technologies', label: 'Technologies', icon: FiCpu },
  { id: 'story', label: 'Full Story', icon: FiBook },
];

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const trimmed = url.trim();
    // YouTube: youtu.be/ID or youtube.com/watch?v=ID
    const ytShort = trimmed.match(/youtu\.be\/([^?&]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
    const ytLong = trimmed.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (ytLong) return `https://www.youtube.com/embed/${ytLong[1]}`;
    // Vimeo
    const vimeo = trimmed.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    // Assume it's already an embed URL
    if (trimmed.includes('/embed/')) return trimmed;
    return null;
  } catch {
    return null;
  }
};

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GET_CASE_STUDY_BY_SLUG, {
          slug,
          stage: 'PUBLISHED',
        });
        const list = data?.caseStudies || data?.caseStudyS || [];
        setCaseStudy(list[0] || null);
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError('Failed to load case study.');
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [slug]);

  if (loading) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container">
          <div className={`text-center py-24 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            Loading case study...
          </div>
        </div>
      </Section>
    );
  }

  if (error || !caseStudy) {
    return (
      <Section className="pt-[8rem] min-h-screen">
        <div className="container text-center">
          <p className={`mb-6 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
            {error || 'Case study not found.'}
          </p>
          <Link
            to="/case-studies"
            className={`inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider ${isDarkMode ? 'text-primary-1 hover:text-primary-2' : 'text-primary-1 hover:text-primary-2'}`}
          >
            <FiArrowLeft /> Back to Case Studies
          </Link>
        </div>
      </Section>
    );
  }

  const hasPdf = caseStudy.pdfDeck?.url;
  const hasVideo = caseStudy.videoUrl && getVideoEmbedUrl(caseStudy.videoUrl);
  const hasGallery = caseStudy.galleryImages?.length > 0;
  const hasTechnologies = caseStudy.technologies?.length > 0;

  const visibleTabs = TABS.filter((t) => {
    if (t.id === 'pdf' && !hasPdf) return false;
    if (t.id === 'video' && !hasVideo) return false;
    if (t.id === 'gallery' && !hasGallery) return false;
    if (t.id === 'technologies' && !hasTechnologies) return false;
    return true;
  });

  return (
    <>
      <SEO
        title={`${caseStudy.title} | Case Studies | JEDI Labs`}
        description={caseStudy.excerpt || caseStudy.title}
      />
      <div className={`min-h-screen pt-[6rem] ${isDarkMode ? 'bg-n-8' : 'bg-n-1'}`}>
        <Section className="relative" crosses>
          <div className="container relative z-10">
            <Link
              to="/case-studies"
              className={`inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider mb-8 transition-colors ${isDarkMode ? 'text-n-4 hover:text-primary-1' : 'text-n-5 hover:text-primary-1'}`}
            >
              <FiArrowLeft /> Back to Case Studies
            </Link>

            <header className="mb-10">
              {caseStudy.clientName && (
                <span className={`text-xs font-mono uppercase tracking-wider ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  {caseStudy.clientName}
                </span>
              )}
              <h1 className={`h1 mt-2 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                {caseStudy.title}
              </h1>
              {caseStudy.excerpt && (
                <p className={`text-lg ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                  {caseStudy.excerpt}
                </p>
              )}
            </header>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Side Tabs */}
              <aside
                className={`lg:w-56 flex-shrink-0 ${
                  isDarkMode ? 'lg:border-r border-n-6' : 'lg:border-r border-n-3'
                }`}
              >
                <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-left whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? isDarkMode
                              ? 'bg-primary-1/20 text-primary-1 border border-primary-1/40'
                              : 'bg-primary-1/10 text-primary-1 border border-primary-1/30'
                            : isDarkMode
                              ? 'text-n-3 hover:bg-n-7 hover:text-n-1'
                              : 'text-n-5 hover:bg-n-2 hover:text-n-8'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Tab Content */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {caseStudy.coverImageUrl && (
                        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-n-6">
                          <img
                            src={caseStudy.coverImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className={`body-1 ${isDarkMode ? 'text-n-2' : 'text-n-6'}`}>
                        {caseStudy.excerpt || 'No overview available.'}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'results' && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`p-6 rounded-xl border ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-2 border-n-3'}`}
                      >
                        <h2 className={`h4 mb-4 font-mono uppercase ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                          Results & Metrics
                        </h2>
                        <p className={`whitespace-pre-line body-1 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                          {caseStudy.results || 'No results data available.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'pdf' && hasPdf && (
                    <motion.div
                      key="pdf"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-white border-n-3'}`}
                      >
                        <iframe
                          src={`${caseStudy.pdfDeck.url}#toolbar=1&navpanes=1&scrollbar=1`}
                          title="Case Study PDF"
                          className="w-full min-h-[70vh] aspect-[3/4]"
                        />
                        <div
                          className={`p-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}
                        >
                          <a
                            href={caseStudy.pdfDeck.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-mono ${isDarkMode ? 'text-primary-1 hover:text-primary-2' : 'text-primary-1 hover:text-primary-2'}`}
                          >
                            Open PDF in new tab →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'video' && hasVideo && (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`rounded-xl border overflow-hidden aspect-video ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-black border-n-3'}`}
                      >
                        <iframe
                          src={getVideoEmbedUrl(caseStudy.videoUrl)}
                          title="Case Study Video"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'gallery' && hasGallery && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {caseStudy.galleryImages.map((img) => (
                          <a
                            key={img.id}
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl overflow-hidden border hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={img.url}
                              alt={img.fileName || 'Gallery image'}
                              className="w-full aspect-square object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'technologies' && hasTechnologies && (
                    <motion.div
                      key="technologies"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-wrap gap-3">
                        {caseStudy.technologies.map((tech) => (
                          <Link
                            key={tech.id}
                            to={`/technology/${tech.slug}`}
                            className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-all hover:border-primary-1/50 ${
                              isDarkMode
                                ? 'bg-n-7 border-n-6 text-n-2 hover:bg-n-6'
                                : 'bg-n-1 border-n-3 text-n-7 hover:bg-n-2'
                            }`}
                          >
                            {(tech.icon?.url || tech.icon) && (
                              <img
                                src={tech.icon?.url || tech.icon}
                                alt=""
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            <span className="font-medium">{tech.name}</span>
                          </Link>
                        ))}
                      </div>
                      <p className={`mt-6 body-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                        Technologies powering this implementation. Click to learn more.
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'story' && (
                    <motion.div
                      key="story"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {caseStudy.description?.raw ? (
                        <div className={`prose-case-study max-w-none ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                          <RichText content={caseStudy.description.raw} />
                        </div>
                      ) : (
                        <p className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                          No full story content available.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-n-6">
              <Link
                to="/case-studies"
                className={`inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider ${isDarkMode ? 'text-primary-1 hover:text-primary-2' : 'text-primary-1 hover:text-primary-2'}`}
              >
                <FiArrowLeft /> All Case Studies
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default CaseStudyDetailPage;
