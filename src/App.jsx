import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ButtonGradient from "./assets/svg/ButtonGradient";
import NextGenAIStack from "./components/NextGenAIStack";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import CaseStudies from "./components/CaseStudies";
import PostCard from "@/components/hyGraph/PostCard";
import PostDetail from "@/components/hyGraph/PostDetail";
import { getPosts } from "./services";
import { StarsCanvas} from "./components/canvas";
import Contact from '@/components/Contact';
import ScrollToTop from "./components/ScrollToTop";
import WhatWeDo from './components/WhatWeDo';
import SolutionsNavigator from "./components/SolutionsNavigator";
import { HelmetProvider } from 'react-helmet-async';
import AboutUs from './pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
// import TeamMemberDetail from './pages/team/TeamMemberDetail';

//pages
import Blog from '@/blog/Blog';
import BlogPage from '@/blog/BlogPage';
import SolutionsPage from './pages/solutions/index.jsx';
import SolutionPage from './pages/solutions/SolutionPage.jsx';
import IndustryRoutes from './features/industries/routes';
import IndustryOverview from "@/features/industries/components/IndustryOverview";
import TechStackTest from './components/TechStack/TechStackTest';
import TechDetails from './components/TechDetails';
import TechStackGrid from './components/TechStack/TechStackGrid';
import TechDetail from './components/TechStack/TechDetail';
import TechnologyDetail from './pages/technology/TechnologyDetail';
import TechnologyOverview from './pages/technology/TechnologyOverview';
import TechnologiesPage from './pages/technology/TechnologiesPage';
import TechnologyStack from './pages/technology/TechnologyStack';
import LocalTechnologyOverview from '@/pages/technology/LocalTechnologyOverview';
import EnhancedTechnologyDetail from './pages/technology/EnhancedTechnologyDetail';
import TechStackDetail from './pages/technology/TechStackDetail';

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

const Loading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-n-8">
    <div className="relative flex items-center gap-3">
      <motion.div
        className="w-3 h-3 rounded-full bg-primary-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      <motion.div
        className="w-3 h-3 rounded-full bg-primary-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
      />
      <motion.div
        className="w-3 h-3 rounded-full bg-primary-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
      />
    </div>
  </div>
);

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const helmetContext = {};

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <ThemeProvider>
      <AppContent 
        posts={posts} 
        location={location} 
        helmetContext={helmetContext} 
      />
    </ThemeProvider>
  );
};

// Separate component to use the theme context
const AppContent = ({ posts, location, helmetContext }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-light-2 dark:bg-n-8 transition-colors duration-200">
        <HelmetProvider context={helmetContext}>
          <Header />
          <ScrollToTop />

          <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        {/* <SolutionsNavigator /> */}
                      </motion.div>
                      <WhatWeDo />
                      <Collaboration />
                      <NextGenAIStack />
                      <IndustryOverview />
                      <WhyChooseUs />
                      {/* <CaseStudies /> */}
                      {/* <Pricing /> */}
                      <Services />
                      <Roadmap />
                      <Contact />
                      <StarsCanvas />
                    </>
                  }
                />
                
                <Route 
                  path="/solutions" 
                  element={
                    <PageTransition>
                      <SolutionsPage />
                      <WhyChooseUs />
                      <CaseStudies />
                      <Contact />
                    </PageTransition>
                  } 
                />

                <Route 
                  path="/solutions/:slug" 
                  element={
                    <PageTransition>
                      <SolutionPage />
                      <CaseStudies />
                      <Contact />
                    </PageTransition>
                  } 
                />

                <Route 
                  path="/blog" 
                  element={
                    <PageTransition>
                      <Blog posts={posts} />
                    </PageTransition>
                  } 
                />

                <Route 
                  path="blog/post/:slug" 
                  element={
                    <PageTransition>
                      <BlogPage />
                    </PageTransition>
                  } 
                />

                <Route 
                  path="/industries/*" 
                  element={
                    <PageTransition>
                      <IndustryRoutes />
                    </PageTransition>
                  } 
                />

                <Route path="/tech-test" element={<TechStackTest />} />
                <Route path="/tech/:techId" element={<TechDetails />} />
                <Route path="/tech-stack" element={<TechStackGrid />} />
                <Route path="/technology" element={<TechnologyStack />} />
                <Route path="/technology/:slug" element={<EnhancedTechnologyDetail />} />
                <Route path="/technology/:slug/use-case/:useCaseSlug" element={<TechnologyDetail />} />
                <Route path="/tech/:slug" element={<TechStackDetail />} />

                <Route 
                  path="/about" 
                  element={
                    <PageTransition>
                      <AboutUs />
                    </PageTransition>
                  } 
                />

                <Route 
                  path="/team/:slug" 
                  element={
                    <PageTransition>
                      {/* <TeamMemberDetail /> */}
                    </PageTransition>
                  } 
                />

                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </AnimatePresence>
            
            <Footer />
          </div>
          <ButtonGradient />
        </HelmetProvider>
      </div>
    </div>
  );
};

export default App;
