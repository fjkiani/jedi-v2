import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { jobService } from '@/services/jobService';
import JobApplicationForm from '@/components/careers/JobApplicationForm';
import { RichText } from '@graphcms/rich-text-react-renderer';

const JobDetailPage = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobBySlug(slug, 'PUBLISHED');
        setJob(data);
      } catch (err) {
        console.error('Error loading job:', err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container">
          <p className={isDarkMode ? 'text-n-4' : 'text-n-5'}>Loading...</p>
        </div>
      </Section>
    );
  }

  if (!job) {
    return (
      <Section className="pt-[8rem] -mt-[5.25rem]">
        <div className="container text-center">
          <h1 className={`h2 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Job not found</h1>
          <Link
            to="/careers"
            className={`inline-flex items-center gap-2 text-primary-1 hover:underline`}
          >
            <FiArrowLeft /> Back to Careers
          </Link>
        </div>
      </Section>
    );
  }

  const descriptionRaw = job.description?.raw;
  const descriptionHtml = job.description?.html;
  const descriptionText = job.description?.text;

  return (
    <>
      <SEO
        title={`${job.title} | Careers | JEDI Labs`}
        description={job.excerpt || `Apply for ${job.title} at JEDI Labs.`}
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container max-w-3xl">
          <Link
            to="/careers"
            className={`inline-flex items-center gap-2 mb-8 ${isDarkMode ? 'text-n-4 hover:text-n-1' : 'text-n-5 hover:text-n-8'}`}
          >
            <FiArrowLeft /> Back to Careers
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                isDarkMode ? 'bg-primary-1/20 text-primary-2' : 'bg-primary-1/10 text-primary-1'
              }`}
            >
              {job.department || 'General'}
            </span>
            <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm mb-8">
              {job.location && (
                <span className={`flex items-center gap-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  <FiMapPin className="text-primary-1" /> {job.location}
                </span>
              )}
              {job.type && (
                <span className={`flex items-center gap-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  <FiBriefcase className="text-primary-1" /> {job.type}
                </span>
              )}
            </div>
            {job.excerpt && (
              <p className={`body-1 mb-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>{job.excerpt}</p>
            )}

            {descriptionRaw?.children?.length > 0 ? (
              <div
                className={`prose prose-lg max-w-none mb-8 ${
                  isDarkMode ? 'prose-invert' : ''
                } [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4`}
              >
                <RichText content={descriptionRaw} />
              </div>
            ) : descriptionHtml ? (
              <div
                className={`prose prose-lg max-w-none mb-8 ${
                  isDarkMode ? 'prose-invert' : ''
                } [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6`}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              descriptionText && (
                <p className={`body-1 whitespace-pre-wrap mb-8 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  {descriptionText}
                </p>
              )
            )}

            {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                  Requirements
                </h3>
                <ul className={`space-y-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-1 mt-1">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {typeof job.requirements === 'string' && (
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                  Requirements
                </h3>
                <p className={`body-1 whitespace-pre-wrap ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                  {job.requirements}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowApply(true)}
              className="btn px-6 py-3 rounded-lg bg-primary-1 text-n-8 font-semibold hover:opacity-90 transition-opacity"
            >
              Apply for this role
            </button>
          </motion.article>
        </div>
      </Section>

      {showApply && (
        <JobApplicationForm
          job={job}
          onClose={() => setShowApply(false)}
          onSuccess={() => setShowApply(false)}
        />
      )}
    </>
  );
};

export default JobDetailPage;
