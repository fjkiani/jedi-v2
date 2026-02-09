import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FiCpu, FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { hygraphClient } from '@/lib/hygraph';
import { GET_APPLICATIONS } from '@/graphql/queries/applications';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MAX_APPLICATIONS = 12;

const CompactAppCard = ({ app, index, isDarkMode }) => {
  const hasExternalUrl = !!app.applicationUrl?.trim();
  const hasCaseStudy = !!app.caseStudy?.slug;
  const href = hasExternalUrl
    ? app.applicationUrl
    : hasCaseStudy
      ? `/case-studies/${app.caseStudy.slug}`
      : '/jedi';
  const isExternal = !!hasExternalUrl;
  const thumbnailUrl = app.featuredImage?.url;

  const content = (
    <div
      className={`
        group relative rounded-xl border p-5 sm:p-6 flex flex-col w-full h-full min-h-[200px] sm:min-h-[220px]
        transition-all duration-300 hover:border-primary-1 hover:shadow-lg
        ${isDarkMode
          ? 'bg-n-8/90 border-n-6 hover:bg-n-8'
          : 'bg-white border-n-3 shadow-sm hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0" />
        ) : (
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-n-7 text-primary-1' : 'bg-n-2 text-primary-1'}`}>
            <FiCpu size={28} />
          </div>
        )}
        <span className={`text-xs font-mono ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className={`font-mono text-base sm:text-lg font-semibold uppercase tracking-tight mb-2 line-clamp-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {app.title}
      </h3>
      {app.categories?.[0]?.name && (
        <p className={`text-xs font-mono uppercase tracking-wider mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
          {app.categories[0].name}
        </p>
      )}
      <div className="mt-auto flex items-center gap-2 text-primary-1">
        <span className="text-xs font-mono uppercase tracking-wider">
          {href === '/jedi' ? 'View' : isExternal ? 'Visit' : 'Case Study'}
        </span>
        {isExternal ? <FiExternalLink size={14} /> : <FiArrowRight size={14} />}
      </div>
    </div>
  );

  if (href && href !== '/jedi') {
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    ) : (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    );
  }
  return (
    <Link to="/jedi" className="block h-full">
      {content}
    </Link>
  );
};

const WhyChooseUs = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_APPLICATIONS, { stage: 'PUBLISHED' });
        const list = data?.projects12 || data?.projects || [];
        setApplications(list.slice(0, MAX_APPLICATIONS));
      } catch (e) {
        console.error('WhyChooseUs: Failed to load applications', e);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const navColor = isDarkMode ? '#fff' : '#000';
  const paginationColor = isDarkMode ? '#8E55EA' : '#6C2BD9';

  return (
    <section className={`py-16 lg:py-20 relative ${className} ${isDarkMode ? '' : 'bg-n-1/50'}`} id="architecture">
      <style>{`
        .whyChooseUs-swiper .swiper-wrapper { align-items: stretch; }
        .whyChooseUs-swiper .swiper-slide { height: auto; display: flex; }
        .whyChooseUs-swiper .swiper-button-prev,
        .whyChooseUs-swiper .swiper-button-next {
          color: ${navColor};
          width: 36px;
          height: 36px;
          background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 50%;
          transition: background 0.2s;
        }
        .whyChooseUs-swiper .swiper-button-prev::after,
        .whyChooseUs-swiper .swiper-button-next::after {
          font-size: 14px;
          font-weight: bold;
        }
        .whyChooseUs-swiper .swiper-button-prev:hover,
        .whyChooseUs-swiper .swiper-button-next:hover {
          background: ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'};
        }
        .whyChooseUs-swiper .swiper-pagination-bullet { background: ${isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}; opacity: 1; }
        .whyChooseUs-swiper .swiper-pagination-bullet-active { background: ${paginationColor}; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full ${isDarkMode ? 'bg-gradient-to-b from-n-8 via-primary-1/20 to-n-8' : 'bg-gradient-to-b from-transparent via-n-3 to-transparent'}`}></div>
      </div>

      <div className="container relative z-10 overflow-visible">
        {loading ? (
          <div className="rounded-xl border overflow-hidden max-w-4xl mx-auto">
            <div className={`flex gap-6 p-6 ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex-shrink-0 w-[280px] rounded-xl border p-6 min-h-[220px] animate-pulse ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-2 border-n-3'}`} />
              ))}
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className={`max-w-5xl mx-auto rounded-xl border py-12 text-center ${isDarkMode ? 'border-n-6 bg-n-8' : 'border-n-3 bg-n-1'}`}>
            <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>No applications to show.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto overflow-visible px-4 sm:px-6 w-full">
            <Swiper
              key={`apps-${applications.length}`}
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              watchOverflow={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 28 },
              }}
              className="whyChooseUs-swiper !pb-12 w-full"
              style={{ minHeight: 260 }}
            >
              {applications.map((app, index) => (
                <SwiperSlide key={app.id} className="!h-auto">
                  <CompactAppCard app={app} index={index} isDarkMode={isDarkMode} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/jedi"
            className={`inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-n-1 hover:text-primary-1' : 'text-n-8 hover:text-primary-1'}`}
          >
            View all applications
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;