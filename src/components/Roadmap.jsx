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
import { Link } from "react-router-dom"; // Import Link from react-router-dom



const Roadmap = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      console.log("Fetched Posts:", fetchedPosts);
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <p>Loading content...</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <Section className="overflow-hidden" id="cms-content">
      <div className="container md:pb-10">
        <Heading tag="Latest Content" title="From Our Blog" />

        <Slider {...settings}>
        {posts.map((post, index) => {
  const node = post.node;
  return (
    <Link to={`/blog/post/${node.slug}`} key={index}>
      <div className="md:flex p-4 rounded-[2.5rem] bg-n-6 shadow-lg transition-transform transform hover:scale-105 duration-300">
        <div className="relative p-8 bg-gradient-to-b from-n-8 to-n-9 rounded-[2.4375rem] overflow-hidden xl:p-15">
          <div className="relative z-1">
            <div className="flex items-center justify-between mb-6">
              <Tagline className="text-sm text-gray-400">
                {node.createdAt
                  ? moment(node.createdAt).format("MMM DD, YYYY")
                  : "No date available"}
              </Tagline>
              <div className="flex items-center px-4 py-1 bg-green-600 rounded text-white">
                <img
                  className="mr-2.5"
                  src={check2}
                  width={16}
                  height={16}
                  alt={node.status || "Status unknown"}
                />
                <div className="tagline">
                  {node.status === "done" ? "Completed" : "In Progress"}
                </div>
              </div>
            </div>
            <div className="mb-6">
              {node.featuredImage?.url ? (
                <img
                  className="w-full h-auto rounded-lg shadow-lg"
                  src={node.featuredImage.url}
                  alt={node.title}
                />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>
            <h4 className="text-2xl font-semibold mb-4 text-white">
              {node.title || "Untitled Post"}
            </h4>
            <p className="text-gray-300 mb-6">
              {node.excerpt || "No description available."}
            </p>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                {node.author?.photo?.url && (
                  <img
                    alt={node.author?.name || "Author"}
                    height="30px"
                    width="30px"
                    className="rounded-full mr-2"
                    src={node.author.photo.url}
                  />
                )}
                <p className="text-gray-400">
                  {node.author?.name || "Unknown Author"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
})}
        </Slider>

        <Gradient />
      </div>

      <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
        <Button href="/blog">View All Posts</Button>
      </div>
    </Section>
  );
};

export default Roadmap;
