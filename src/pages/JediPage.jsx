/**
 * APPLICATIONS REGISTRY (formerly Intelligence Unit Registry)
 *
 * Hygraph-driven page for JEDI Labs applications.
 * Each application can link to an external URL or a case study.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Section from '../components/Section';
import { hygraphClient } from '@/lib/hygraph';
import { GET_APPLICATIONS } from '@/graphql/queries/applications';
import {
  FiCpu, FiActivity, FiServer, FiShield, FiArrowRight, FiLock, FiCrosshair, FiExternalLink
} from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';

const StatusBadge = ({ status = "ONLINE" }) => {
  const colors = {
    ONLINE: "bg-green-500/20 text-green-400 border-green-500/50",
    TRAINING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    DEPLOYED: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    OFFLINE: "bg-red-500/20 text-red-400 border-red-500/50"
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-mono border rounded ${colors[status] || colors.ONLINE} flex items-center gap-1.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {status}
    </span>
  );
};

const ApplicationCard = ({ app, index }) => {
  const hasExternalUrl = !!app.applicationUrl?.trim();
  const hasCaseStudy = !!app.caseStudy?.slug;

  const href = hasExternalUrl
    ? app.applicationUrl
    : hasCaseStudy
      ? `/case-studies/${app.caseStudy.slug}`
      : null;

  const isExternal = !!hasExternalUrl;
  const thumbnailUrl = app.featuredImage?.url || app.thumbnail?.url || app.thumbnail;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#0a0a0a] border border-n-6 hover:border-primary-1 transition-all duration-300 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      {/* HUD Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-n-4 group-hover:border-primary-1 transition-colors z-10"></div>

      {/* Thumbnail or placeholder */}
      <div className="aspect-video bg-n-8 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-mono text-n-5">JEDI</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="px-2 py-1 bg-n-8 rounded border border-n-7 text-[10px] text-n-4 font-mono">
            UNIT-{String(index + 1).padStart(3, '0')}
          </div>
          <StatusBadge status="ONLINE" />
        </div>

        <h3 className="text-xl font-bold text-n-1 mb-1 font-mono group-hover:text-primary-1 transition-colors">
          {app.title}
        </h3>
        {app.categories?.[0]?.name && (
          <p className="text-xs text-primary-2 mb-4 font-mono uppercase tracking-wider">
            {app.categories[0].name}
          </p>
        )}

        <p className="text-sm text-n-3 mb-6 line-clamp-2 h-10">
          {app.description || ''}
        </p>

        <div className="flex items-center justify-between mt-auto">
          {href ? (
            <span className="flex items-center gap-2 text-xs font-bold text-n-1 group-hover:text-primary-1 transition-colors uppercase tracking-wide">
              {isExternal ? (
                <>
                  Visit Application <FiExternalLink className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Case Study <FiArrowRight />
                </>
              )}
            </span>
          ) : (
            <span className="text-xs text-n-4 font-mono uppercase">No link configured</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return isExternal ? (
      <a
        key={app.id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        aria-label={`Open ${app.title}`}
      >
        {cardContent}
      </a>
    ) : (
      <Link key={app.id} to={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return <div key={app.id}>{cardContent}</div>;
};

const SystemLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const sequence = [
      "Initializing JEDI Core...",
      "Connecting to Neural Uplink...",
      "Fetching Applications...",
      "Verifying Security Clearance...",
      "Access Granted: COMMANDER LEVEL",
      "Loading Registry...",
      "System Ready."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} > ${sequence[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs text-green-500/80 bg-black/90 p-4 border border-green-500/20 rounded-lg h-32 overflow-hidden relative font-code">
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
      </div>
      {logs.map((log, i) => (
        <div key={i} className="mb-1">{log}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};

const JediPage = () => {
  const { isDarkMode } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hygraphClient.request(GET_APPLICATIONS, { stage: 'PUBLISHED' });
        const list = data?.projects12 || data?.projects || [];
        setApplications(list);
      } catch (e) {
        console.error('Failed to load applications', e);
        setError('Failed to load applications.');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <>
      <Helmet>
        <title>Applications Registry | JEDI Labs — Production AI Co-Pilots</title>
        <meta name="description" content="Explore JEDI Labs applications. Production agentic AI co-pilots for Healthcare, Finance, Education. Voice agents, search optimization, interactive co-pilots." />
        <meta property="og:url" content="https://jedilabs.org/jedi" />
        <link rel="canonical" href="https://jedilabs.org/jedi" />
      </Helmet>

      <div className="min-h-screen bg-n-8 text-n-1 pt-[8rem] pb-20 relative overflow-hidden">

        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <Section className="relative z-10" crosses>
          <div className="container">

            {/* Header / HUD Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-n-6 pb-6 gap-6">
              <div>
                <div className="flex items-center gap-2 text-primary-1 font-mono text-sm mb-2">
                  <FiShield className="animate-pulse" />
                  <span>SECURE CONNECTION ESTABLISHED</span>
                </div>
                <h1 className="h1 font-bold text-white uppercase tracking-tighter">
                  Applications<br />Registry
                </h1>
              </div>

              <div className="hidden md:block w-96">
                <SystemLog />
                <div className="mt-4 flex justify-end">
                  <Link to="/" className="text-xs font-mono text-n-4 hover:text-primary-1 flex items-center gap-2 transition-colors">
                    <FiArrowRight className="rotate-180" /> RETURN TO COMMAND
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {[
                { label: "ACTIVE APPS", value: applications.length || "0", icon: FiCpu },
                { label: "SYSTEM LOAD", value: "12%", icon: FiActivity },
                { label: "GLOBAL UPTIME", value: "99.99%", icon: FiServer },
                { label: "SECURITY LEVEL", value: "ALPHA", icon: FiLock },
              ].map((stat, i) => (
                <div key={i} className="bg-n-7/50 border border-n-6 p-4 rounded-lg flex items-center gap-4">
                  <div className="p-2 bg-n-6 rounded text-primary-1">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-n-4 font-mono tracking-wider">{stat.label}</div>
                    <div className="text-xl font-bold font-mono">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
                <FiCpu /> DEPLOYED APPLICATIONS
              </h2>
            </div>

            {error && (
              <div className="py-12 text-center text-n-4 font-mono">
                {error}
              </div>
            )}

            {loading ? (
              <div className="h-96 flex items-center justify-center font-mono text-primary-1 animate-pulse">
                LOADING REGISTRY DATA...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, index) => (
                  <ApplicationCard key={app.id} app={app} index={index} />
                ))}

                {/* Placeholder for "New Application" */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="border border-dashed border-n-6 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-n-5 transition-colors group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-n-7 flex items-center justify-center text-n-4 mb-4 group-hover:bg-n-6 group-hover:text-primary-1 transition-colors">
                    <FiCrosshair size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-n-3 mb-2">Commission New Application</h3>
                  <p className="text-sm text-n-4 mb-6 max-w-xs">
                    Initiate a new agent build tailored to your specific enterprise requirements.
                  </p>
                  <Button href="/contact" white small>INITIALIZE BUILD</Button>
                </motion.div>
              </div>
            )}

          </div>
        </Section>
      </div>
    </>
  );
};

export default JediPage;
