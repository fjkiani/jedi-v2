import React from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ButtonGradient from "./assets/svg/ButtonGradient";
import NextGenAIStack from "./components/NextGenAIStack";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Pricing from "./components/Pricing";
import WhyChooseUs from "./components/WhyChooseUs";
import CaseStudies from "./components/CaseStudies";
import TransformationMethodology from "./components/TransformationMethodology";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
import AboutUs from './pages/AboutUs';
import TeamMemberDetail from './pages/team/TeamMemberDetail';
import TeamPage from './pages/team';

// Pages
import Blog from './pages/blog/Blog';
import BlogPage from '@/blog/BlogPage.tsx';
import SolutionsPage from './pages/solutions/SolutionsOverview.jsx';
import SolutionPage from './pages/solutions/SolutionPage.jsx';
import IndustryRoutes from './features/industries/routes';
import EnhancedTechnologyDetail from './pages/technology/EnhancedTechnologyDetail';
import TechnologyStack from './pages/technology/TechnologyStack';
import ContactUs from "./pages/ContactUs";
import SEO, { RootSEO } from "@/components/SEO";
import { TestSEO } from '@/components/SEO/TestSEO';
import UseCasesPage from './pages/UseCasesPage';
import UseCaseDetailPage from './pages/UseCaseDetailPage';
import JediApplicationsPreview from "./components/JediApplicationsPreview";
import CallToAction from "./components/CallToAction";
import LeadCaptureCTA from "./components/LeadCaptureCTA";
import SidebarConsultant from "./components/SidebarConsultant";
import Hero from "./components/Hero";
import JediPage from "./pages/JediPage";
import MethodologyDetail from './pages/methodology/MethodologyDetail';
import MethodologyPage from './pages/methodology/MethodologyPage';
import ExplorePage from './pages/ExplorePage';
import InfrastructurePage from './pages/InfrastructurePage';
import { CaseStudiesPage, CaseStudyDetailPage } from './pages/caseStudies';
import { CareersPage, JobDetailPage } from './pages/careers';
import NotFound from './pages/NotFound';
import AiTraining from './pages/AiTraining';
import AiTrainingDomain from './pages/AiTrainingDomain';

const BlogLegacyRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/post/${slug}`} replace />;
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AppContent location={location} />
    </ThemeProvider>
  );
};

const AppContent = ({ location }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 mobile-safe
      ${isDarkMode ? 'bg-n-8 text-n-1' : 'bg-white text-gray-900'}`}>
      <HelmetProvider>
        <TestSEO />
        <SEO />
        <RootSEO />
        <Header />
        <ScrollToTop />

        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mobile-safe">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              {/* ── Home ─────────────────────────────────────────────────── */}
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <TransformationMethodology />
                    <NextGenAIStack />
                    <WhyChooseUs />
                    <JediApplicationsPreview />
                    <Pricing />
                    <Collaboration />
                    <SidebarConsultant />
                    <LeadCaptureCTA />
                  </>
                }
              />

              {/* ── Solutions ────────────────────────────────────────────── */}
              <Route path="/solutions" element={<PageTransition><SolutionsPage /><WhyChooseUs /><CaseStudies /></PageTransition>} />
              <Route path="/solutions/:slug" element={<PageTransition><SolutionPage /></PageTransition>} />

              {/* ── Infrastructure ───────────────────────────────────────── */}
              <Route path="/infrastructure" element={<PageTransition><InfrastructurePage /></PageTransition>} />

              {/* ── Use Cases ────────────────────────────────────────────── */}
              <Route path="/deployments" element={<Navigate to="/use-cases" replace />} />
              <Route path="/usecases" element={<Navigate to="/use-cases" replace />} />
              <Route path="/use-cases" element={<PageTransition><UseCasesPage /></PageTransition>} />
              <Route path="/use-cases/:slug" element={<PageTransition><UseCaseDetailPage /></PageTransition>} />

              {/* ── Blog ─────────────────────────────────────────────────── */}
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/blog/post/:slug" element={<PageTransition><BlogPage /></PageTransition>} />
              {/* Legacy: /blog/ai-agents → /blog/post/ai-agents */}
              <Route path="/blog/:slug" element={<BlogLegacyRedirect />} />

              {/* ── Industries ───────────────────────────────────────────── */}
              <Route path="/industries/*" element={<PageTransition><IndustryRoutes /></PageTransition>} />

              {/* ── Technology ───────────────────────────────────────────── */}
              <Route path="/technology" element={<PageTransition><TechnologyStack /></PageTransition>} />
              {/* Must come after specific /technology/* routes */}
              <Route path="/technology/:slug" element={<PageTransition><EnhancedTechnologyDetail /></PageTransition>} />

              {/* ── About / Team ─────────────────────────────────────────── */}
              <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
              <Route path="/team" element={<PageTransition><TeamPage /></PageTransition>} />
              <Route path="/team/:slug" element={<PageTransition><TeamMemberDetail /></PageTransition>} />

              {/* ── Contact / Pricing ────────────────────────────────────── */}
              <Route path="/pricing" element={<Navigate to="/contact?inquiry=pricing" replace />} />
              <Route path="/contact" element={<PageTransition><ContactUs /></PageTransition>} />

              {/* ── JEDI ─────────────────────────────────────────────────── */}
              <Route path="/jedi" element={<PageTransition><JediPage /></PageTransition>} />

              {/* ── Case Studies ─────────────────────────────────────────── */}
              <Route path="/case-studies" element={<PageTransition><CaseStudiesPage /></PageTransition>} />
              <Route path="/case-studies/:slug" element={<PageTransition><CaseStudyDetailPage /></PageTransition>} />

              {/* ── Careers ──────────────────────────────────────────────── */}
              <Route path="/careers" element={<PageTransition><CareersPage /></PageTransition>} />
              <Route path="/careers/:slug" element={<PageTransition><JobDetailPage /></PageTransition>} />

              {/* ── Methodology ──────────────────────────────────────────── */}
              <Route path="/methodology" element={<PageTransition><MethodologyPage /></PageTransition>} />
              <Route path="/explore" element={<PageTransition><ExplorePage /></PageTransition>} />
              <Route path="/methodology/:slug" element={<PageTransition><MethodologyDetail /></PageTransition>} />

              {/* ── AI Training ──────────────────────────────────────────── */}
              <Route path="/ai-training" element={<PageTransition><AiTraining /></PageTransition>} />
              <Route path="/ai-training/:domainId" element={<PageTransition><AiTrainingDomain /></PageTransition>} />

              {/* ── 404 ──────────────────────────────────────────────────── */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

            </Routes>
          </AnimatePresence>

          <Footer />
        </div>
        <ButtonGradient />
      </HelmetProvider>
    </div>
  );
};

export default App;
