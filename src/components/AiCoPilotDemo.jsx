import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import ChatInterface from './copilot/ChatInterface';
import { analyzeQuery, findMatchingUseCases, generateConversationalResponse } from '../services/copilotOrchestrator';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiTerminal, FiMap, FiCpu, FiShield, FiActivity, FiMenu } from 'react-icons/fi';

// GraphQL stats (unchanged)
const GET_INDUSTRIES_AND_USECASES = gql`
  query GetIndustriesAndUseCases {
    industries {
      id
      name
      slug
      description
      industryApplication {
        id
        applicationTitle
        tagline
        industryChallenge { raw }
        jediApproach { raw }
        keyCapabilities
        expectedResults
        jediComponent {
          id
          name
          tagline
          description { raw }
        }
        technology {
          id
          name
          slug
        }
      }
    }
    useCaseS(first: 20, stage: PUBLISHED) {
      id
      title
      slug
      description
      industry {
        id
        name
        slug
      }
      queries
      capabilities
      metrics
      implementation
      architecture {
        id
        description
        components {
          id
          name
          description
          details
          explanation
        }
        flow {
          id
          step
          description
          details
        }
      }
      technologies {
        id
        name
        slug
        description
      }
    }
  }
`;

const TerminalSidebarItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded font-mono text-xs uppercase tracking-wider transition-all duration-300 ${isActive
        ? 'bg-primary-1 text-n-8 font-bold shadow-[0_0_15px_rgba(var(--color-primary-1),0.5)]'
        : 'text-n-4 hover:text-primary-1 hover:bg-n-8'
      }`}
  >
    <Icon size={16} />
    <span className="hidden md:inline">{label}</span>
  </button>
);

const AiCoPilotDemo = () => {
  const [industries, setIndustries] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Navigation Logic
  const handleNavigation = (id) => {
    if (id === 'contact') {
      window.location.href = '/contact';
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch industries and use cases (unchanged logic)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hygraphClient.request(GET_INDUSTRIES_AND_USECASES);
        setIndustries(data.industries || []);
        setUseCases(data.useCaseS || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load AI solutions data.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleQuerySubmit = async (query, industryContext) => {
    // ... logic assumed to be same as before, re-implemented briefly
    try {
      const analysis = analyzeQuery(query, industryContext);
      const matches = findMatchingUseCases(query, useCases, analysis);
      const response = generateConversationalResponse(query, matches, analysis, industries);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return response;
    } catch (e) {
      throw e;
    }
  };

  const handleIndustryChange = (slug) => setSelectedIndustry(slug);

  if (loadingData) return <div className="min-h-[50vh] flex items-center justify-center font-mono animate-pulse">BOOTING_CORE_SYSTEMS...</div>;

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden" id="ai-copilot">
      {/* Terminal Container */}
      <div className="container relative z-10 max-w-7xl mx-auto">

        {/* Header/Title */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border mb-4 font-mono text-xs tracking-widest uppercase ${isDarkMode ? 'bg-n-8 border-primary-1 text-primary-1' : 'bg-n-1 border-n-4 text-n-8'
            }`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            JEDI.COMMAND.CENTER // v4.0.2
          </div>
          <h2 className={`h2 font-mono uppercase ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Active Intelligence Interface
          </h2>
        </div>

        {/* The Main Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row overflow-hidden rounded-xl border-2 shadow-2xl relative ${isDarkMode
              ? 'border-n-6 bg-n-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]'
              : 'border-n-3 bg-white shadow-xl'
            }`}
          style={{ height: '800px' }}
        >
          {/* Visual "Scanlines" Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

          {/* Left Sidebar (Command Menu) */}
          <div className={`w-full md:w-64 p-4 flex flex-col gap-2 border-b md:border-b-0 md:border-r z-20 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-2 border-n-3'}`}>
            <div className="mb-6 px-3 py-2 border-b border-n-6/50">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-n-4">System Modules</h3>
            </div>

            <TerminalSidebarItem icon={FiTerminal} label="Command_Link" isActive={true} onClick={() => { }} />
            <TerminalSidebarItem icon={FiActivity} label="Diagnostics" onClick={() => handleNavigation('methodology')} />
            <TerminalSidebarItem icon={FiMap} label="Sector_Map" onClick={() => handleNavigation('targeting-grid')} />
            <TerminalSidebarItem icon={FiShield} label="Architecture" onClick={() => handleNavigation('architecture')} />
            <TerminalSidebarItem icon={FiCpu} label="Agent_Registry" onClick={() => handleNavigation('jedi-showcase')} />

            <div className="mt-auto pt-6 border-t border-n-6/50">
              <button
                onClick={() => handleNavigation('contact')}
                className="w-full py-3 bg-primary-1 text-n-8 font-mono font-bold uppercase tracking-wider text-xs hover:bg-primary-2 transition-colors flex items-center justify-center gap-2"
              >
                <span>Initiate_Contact</span>
                <span className="animate-pulse">_</span>
              </button>
            </div>
          </div>

          {/* Main Content Area (Chat) */}
          <div className="flex-1 relative flex flex-col bg-transparent">
            {/* "Top Bar" of the terminal window */}
            <div className={`h-8 flex items-center justify-between px-4 border-b ${isDarkMode ? 'bg-n-8 border-n-6' : 'bg-n-1 border-n-3'}`}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-[10px] uppercase text-n-4">user@jedi-labs:~/secure-link</div>
              <div className="w-4"></div>
            </div>

            {/* The Chat Interface Wrapper */}
            <div className="flex-1 overflow-hidden relative">
              {error ? (
                <div className="p-8 font-mono text-red-500">{error}</div>
              ) : (
                <ChatInterface
                  industries={industries}
                  useCases={useCases}
                  selectedIndustry={selectedIndustry}
                  onQuerySubmit={handleQuerySubmit}
                  onIndustryChange={handleIndustryChange}
                />
              )}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default AiCoPilotDemo;