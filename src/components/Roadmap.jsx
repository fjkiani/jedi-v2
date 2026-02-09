import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import moment from "moment";
import { getPosts } from "../services";
import { check2 } from "../assets";
import { Gradient } from "./design/Roadmap";
import { Link } from "react-router-dom";
import { useTheme } from '@/context/ThemeContext';
import { FiFileText, FiUser, FiCalendar, FiActivity } from 'react-icons/fi';

const Roadmap = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (e) {
        console.error("Failed to fetch posts", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        },
      },
    ],
  };

  if (loading) {
    return (
      <Section className="overflow-hidden" id="cms-content">
        <div className="container md:pb-10 flex justify-center">
          <div className="font-mono animate-pulse">ESTABLISHING UPLINK...</div>
        </div>
      </Section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Section className="overflow-hidden" id="cms-content">
        <div className="container md:pb-10 flex justify-center">
          <div className="font-mono text-red-500">NO INTEL FOUND.</div>
        </div>
      </Section>
    );
  }

  return ( // Reduced top padding
    <Section className="overflow-hidden !pt-0 !mt-0" id="cms-content">
      <div className="container md:pb-10">
        <Heading tag="Development Progress" title="Product Roadmap & Updates" />

        <Slider {...settings}>
          {posts.map((post, index) => {
            const node = post.node;
            const authorData = node.author?.[0];
            return (
              <div key={index} className="px-4 py-4 h-full"> {/* Added padding wrapper for slider spacing */}
                <Link to={`/blog/post/${node.slug}`} className="block h-full group">
                  <div className={`
                        h-full relative overflow-hidden border-2 transition-all duration-300
                        ${isDarkMode
                      ? 'bg-n-8 border-n-6 group-hover:border-primary-1'
                      : 'bg-white border-n-3 group-hover:border-n-8 shadow-lg group-hover:shadow-xl'}
                    `}>
                    {/* Technical Corners */}
                    <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${isDarkMode ? 'border-n-5' : 'border-n-4'}`}></div>
                    <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${isDarkMode ? 'border-n-5' : 'border-n-4'}`}></div>

                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden border-b border-n-6/20">
                      {node.featuredImage?.url ? (
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={node.featuredImage.url}
                          alt={node.title}
                        />
                      ) : (
                        <div className="w-full h-full bg-n-7 flex items-center justify-center font-mono text-n-4">NO VISUALS</div>
                      )}

                      {/* Status Badge Overlay */}
                      <div className="absolute top-4 right-4">
                        <div className={`flex items-center px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-wider
                                    ${isDarkMode ? 'bg-n-8/90 text-green-500 border border-green-500' : 'bg-white/90 text-n-8 border border-n-8'}
                                `}>
                          <FiActivity className="mr-2" />
                          <span>{node.status === "done" ? "COMPLETED" : "IN PROGRESS"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4 border-b border-dashed border-n-6/30 pb-4">
                        <div className={`flex items-center text-xs font-mono uppercase tracking-wider ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                          <FiCalendar className="mr-2" />
                          {node.createdAt
                            ? moment(node.createdAt).format("MMM DD, YYYY")
                            : "TBD"}
                        </div>
                      </div>

                      <h4 className={`h5 mb-4 font-bold leading-tight ${isDarkMode ? 'text-n-1 group-hover:text-primary-1' : 'text-n-8 group-hover:text-primary-1'} transition-colors`}>
                        {node.title || "Untitled Post"}
                      </h4>

                      <p className={`body-2 mb-6 line-clamp-3 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                        {node.excerpt || "No description available."}
                      </p>

                      <div className="flex items-center mt-auto pt-4 border-t border-n-6/20">
                        {authorData?.photo?.url && (
                          <img
                            alt={authorData.name || "Author"}
                            className="w-8 h-8 rounded-full mr-3 border border-n-6"
                            src={authorData.photo.url}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>AUTHOR</span>
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                            {authorData?.name || "Team JEDI"}
                          </span>
                        </div>

                        <div className={`ml-auto text-xs font-mono uppercase tracking-widest border-b border-transparent group-hover:border-primary-1 ${isDarkMode ? 'text-primary-1' : 'text-n-8'}`}>
                          READ UPDATE &gt;&gt;
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>

        {/* <Gradient /> */}
      </div>

      <div className="flex justify-center mt-6">
        <a href="/blog" className={`inline-flex items-center px-6 py-3 border font-mono uppercase text-sm font-bold tracking-widest transition-colors ${isDarkMode
          ? 'border-n-6 text-n-1 hover:border-primary-1 hover:text-primary-1'
          : 'border-n-3 text-n-8 hover:bg-n-8 hover:text-n-1'
          }`}>
          VIEW ALL UPDATES
        </a>
      </div>
    </Section>
  );
};

export default Roadmap;