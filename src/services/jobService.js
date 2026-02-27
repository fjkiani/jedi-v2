import { hygraphClient } from '@/lib/hygraph';
import { GET_JOBS, GET_JOB_BY_SLUG } from '@/graphql/queries/jobs';
import { FALLBACK_JOBS } from '@/constants/jobs';

export const jobService = {
  async getJobs(stage = 'PUBLISHED') {
    try {
      const data = await hygraphClient.request(GET_JOBS, { stage });
      const jobs = data?.jobs || [];
      return jobs.length > 0 ? jobs : FALLBACK_JOBS;
    } catch (err) {
      console.warn('[JobService] Hygraph fetch failed, using fallback:', err.message);
      return FALLBACK_JOBS;
    }
  },

  async getJobBySlug(slug, stage = 'PUBLISHED') {
    try {
      const data = await hygraphClient.request(GET_JOB_BY_SLUG, { slug, stage });
      const jobs = data?.jobs || [];
      return jobs[0] || FALLBACK_JOBS.find((j) => j.slug === slug) || null;
    } catch (err) {
      console.warn('[JobService] Hygraph fetch failed:', err.message);
      return FALLBACK_JOBS.find((j) => j.slug === slug) || null;
    }
  },
};
