import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { fadeIn } from '@/utils/motion';
import { jobService } from '@/services/jobService';
import { FiMapPin, FiBriefcase, FiClock, FiArrowRight } from 'react-icons/fi';
import JobApplicationForm from '@/components/careers/JobApplicationForm';

const JobCard = ({ job, isDarkMode, onApply }) => (
  <motion.div
    variants={fadeIn('up')}
    className={`rounded-xl border p-6 transition-all hover:shadow-lg ${
      isDarkMode
        ? 'bg-n-7 border-n-6 hover:border-primary-1/50'
        : 'bg-n-1 border-n-3 hover:border-primary-1/50'
    }`}
  >
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            isDarkMode ? 'bg-primary-1/20 text-primary-2' : 'bg-primary-1/10 text-primary-1'
          }`}
        >
          {job.department || 'General'}
        </span>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {job.title}
      </h3>
      <p className={`text-sm mb-4 flex-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        {job.excerpt}
      </p>
      <div className="flex flex-wrap gap-4 text-xs mb-4">
        {job.location && (
          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            <FiMapPin className="text-primary-1" />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className={`flex items-center gap-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
            <FiBriefcase className="text-primary-1" />
            {job.type}
          </span>
        )}
      </div>
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => onApply(job)}
          className="btn px-4 py-2 rounded-lg bg-primary-1 text-n-8 font-medium hover:opacity-90 transition-opacity"
        >
          Apply Now
        </button>
        <Link
          to={`/careers/${job.slug}`}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
            isDarkMode
              ? 'border-n-6 text-n-2 hover:border-primary-1/50'
              : 'border-n-3 text-n-7 hover:border-primary-1/50'
          }`}
        >
          View details
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobs('PUBLISHED');
        setJobs(data);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <SEO
        title="Careers | JEDI Labs"
        description="Join JEDI Labs. Build agentic AI co-pilots for Healthcare, Finance, and Education. Remote roles, voice agents, MCP, and LLMs."
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="text-center mb-12 md:mb-16"
          >
            <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              Careers at JEDI Labs
            </h1>
            <p className={`body-1 max-w-2xl mx-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Build agentic AI co-pilots that transform industries. Voice agents, identity layers,
              and industry-specific solutions for Healthcare, Finance, and Education.
            </p>
          </motion.div>

          {loading && (
            <div className={`text-center py-16 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Loading opportunities...
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} isDarkMode={isDarkMode} onApply={setApplyJob} />
              ))}
            </motion.div>
          )}

          {!loading && jobs.length === 0 && (
            <p className={`text-center py-16 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              No open positions at the moment. Check back soon or contact us at{' '}
              <a href="mailto:careers@jedilabs.org" className="text-primary-1 hover:underline">
                careers@jedilabs.org
              </a>
              .
            </p>
          )}
        </div>
      </Section>

      {applyJob && (
        <JobApplicationForm
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onSuccess={() => setApplyJob(null)}
        />
      )}
    </>
  );
};

export default CareersPage;
