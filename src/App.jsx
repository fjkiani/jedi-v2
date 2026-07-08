import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ButtonGradient from "./assets/svg/ButtonGradient";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
import SEO, { RootSEO } from "@/components/SEO";

// ---- Above-the-fold on / stays eager for LCP ----
import Hero from "./components/Hero";
import TransformationMethodology from "./components/TransformationMethodology";
import NextGenAIStack from "./components/NextGenAIStack";
import WhyChooseUs from "./components/WhyChooseUs";
import JediApplicationsPreview from "./components/JediApplicationsPreview";
import Collaboration from "./components/Collaboration";
import SidebarConsultant from "./components/SidebarConsultant";
import LeadCaptureCTA from "./components/LeadCaptureCTA";
import CaseStudies from "./components/CaseStudies";

// ---- Route pages are all lazy (30+ pages, saved from initial bundle) ----
const AboutUs                  = lazy(() => import('./pages/AboutUs'));
const TeamMemberDetail         = lazy(() => import('./pages/team/TeamMemberDetail'));
const TeamPage                 = lazy(() => import('./pages/team'));
const Blog                     = lazy(() => import('./pages/blog/Blog'));
const BlogPage                 = lazy(() => import('@/blog/BlogPage.tsx'));
const SolutionsPage            = lazy(() => import('./pages/solutions/SolutionsOverview.jsx'));
const SolutionPage             = lazy(() => import('./pages/solutions/SolutionPage.jsx'));
const IndustryRoutes           = lazy(() => import('./features/industries/routes'));
const EnhancedTechnologyDetail = lazy(() => import('./pages/technology/EnhancedTechnologyDetail'));
const TechnologyStack          = lazy(() => import('./pages/technology/TechnologyStack'));
const ContactUs                = lazy(() => import('./pages/ContactUs'));
const UseCasesPage             = lazy(() => import('./pages/UseCasesPage'));
const UseCaseDetailPage        = lazy(() => import('./pages/UseCaseDetailPage'));
const PricingPage              = lazy(() => import('./pages/PricingPage'));
const JediPage                 = lazy(() => import('./pages/JediPage'));
const MethodologyDetail        = lazy(() => import('./pages/methodology/MethodologyDetail'));
const MethodologyPage          = lazy(() => import('./pages/methodology/MethodologyPage'));
const ExplorePage              = lazy(() => import('./pages/ExplorePage'));
const InfrastructurePage       = lazy(() => import('./pages/InfrastructurePage'));
const CaseStudiesPage          = lazy(() => import('./pages/caseStudies').then(m => ({ default: m.CaseStudiesPage })));
const CaseStudyDetailPage      = lazy(() => import('./pages/caseStudies').then(m => ({ default: m.CaseStudyDetailPage })));
const CareersPage              = lazy(() => import('./pages/careers').then(m => ({ default: m.CareersPage })));
const JobDetailPage            = lazy(() => import('./pages/careers').then(m => ({ default: m.JobDetailPage })));
const NotFound                 = lazy(() => import('./pages/NotFound'));
const AiTraining               = lazy(() => import('./pages/AiTraining'));
const AiTrainingDomain         = lazy(() => import('./pages/AiTrainingDomain'));
const BenchmarksPage           = lazy(() => import('./pages/benchmarks/BenchmarksPage'));
const GlossaryPage             = lazy(() => import('./pages/glossary/GlossaryPage'));

// ── SEO Command Center — internal ops app, Clerk-gated ──
const SeoCommandCenter         = lazy(() => import('./pages/SeoCommandCenter'));

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

// Lightweight Suspense fallback — no layout shift
const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-2 border-n-6 border-t-transparent rounded-full animate-spin" />
  </div>
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
        <RootSEO />
        <Header />
        <ScrollToTop />

        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mobile-safe">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageFallback />}>
              <Routes location={location} key={location.pathname}>

                {/* ── Home ─────────────────────────────────────────────────── */}
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <SEO
                        title="Jedi Labs — AI Systems That Solve What AI Fails"
                        description="Production-grade AI development, evaluation, and deployment for frontier-model teams and enterprises. Shipped model demos across medical imaging, geospatial segmentation, audio, and video — real metrics, real inference."
                        path="/"
                        ogImage="https://jedilabs.org/og/og-home.png"
                      />
                      <Hero />
                      <TransformationMethodology />
                      <NextGenAIStack />
                      <WhyChooseUs />
                      <JediApplicationsPreview />
                      <Collaboration />
                      <SidebarConsultant />
                      <LeadCaptureCTA />
                    </PageTransition>
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
                <Route path="/blog/:slug" element={<BlogLegacyRedirect />} />

                {/* ── Industries ───────────────────────────────────────────── */}
                <Route path="/industries/*" element={<PageTransition><IndustryRoutes /></PageTransition>} />

                {/* ── Technology ───────────────────────────────────────────── */}
                <Route path="/technology" element={<PageTransition><TechnologyStack /></PageTransition>} />
                <Route path="/technology/:slug" element={<PageTransition><EnhancedTechnologyDetail /></PageTransition>} />

                {/* ── About / Team ─────────────────────────────────────────── */}
                <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
                <Route path="/team" element={<PageTransition><TeamPage /></PageTransition>} />
                <Route path="/team/:slug" element={<PageTransition><TeamMemberDetail /></PageTransition>} />

                {/* ── Contact / Pricing ────────────────────────────────────── */}
                <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
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

                {/* ── Benchmarks / Glossary ────────────────────────────────── */}
                <Route path="/benchmarks" element={<PageTransition><BenchmarksPage /></PageTransition>} />
                <Route path="/glossary" element={<PageTransition><GlossaryPage /></PageTransition>} />

                {/* ── SEO Command Center — internal ops app (Clerk gate lives inside the page) ── */}
                <Route path="/seo-command-center" element={<SeoCommandCenter />} />
                <Route path="/seo-command-center/*" element={<SeoCommandCenter />} />

                {/* ── 404 ──────────────────────────────────────────────────── */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />

              </Routes>
            </Suspense>
          </AnimatePresence>

          <Footer />
        </div>
        <ButtonGradient />
      </HelmetProvider>
    </div>
  );
};

export default App;
