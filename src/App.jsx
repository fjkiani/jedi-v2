import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";
import PostCard from "@/components/hyGraph/PostCard";
import PostDetail from "@/components/hyGraph/PostDetail";
import { getPosts } from "./services"; // Adjust the import if necessary
import { StarsCanvas} from "./components/canvas";
import Contact from '@/components/Contact';
import ScrollToTop from "./components/ScrollToTop"; // Import the ScrollToTop component


//pages
import Blog from '@/blog/Blog'; // Adjust the import to match the new path
import BlogPage from '@/blog/BlogPage'; // Updated import for the detailed blog post page





const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <ScrollToTop /> Add ScrollToTop to reset scroll position on navigation

      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Benefits />
                <Collaboration />
                <Services />
                <Pricing />
                <Roadmap />
              </>
            }
          />
          {/* //routes for pages */}
          <Route path="/blog" element={<Blog posts={posts} />} /> Add the Blog route
          <Route path="blog/post/:slug" element={<BlogPage />} /> {/* Dynamic route for post details */}
        </Routes>
        <Contact/>
        <StarsCanvas/>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
