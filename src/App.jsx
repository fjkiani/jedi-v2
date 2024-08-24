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
                {loading ? (
                  <p>Loading posts...</p>
                ) : (
                  posts.length > 0 &&
                  posts.map((post, index) => (
                    <PostCard key={index} post={post.node} />
                  ))
                )}
              </>
            }
          />
          <Route path="/blog" element={<Blog posts={posts} />} /> Add the Blog route
          <Route path="blog/post/:slug" element={<BlogPage />} /> {/* Dynamic route for post details */}
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
