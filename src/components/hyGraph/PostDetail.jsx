import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the slug from the URL
import { getPostDetails } from '../../services'; // Adjust the import path to match your structure
import moment from 'moment';

const PostDetail = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      const fetchedPost = await getPostDetails(slug); // Fetch post details based on the slug
      setPost(fetchedPost);
      setLoading(false);
    };

    fetchPostDetails();
  }, [slug]); // Re-run the effect when the slug changes

  if (loading) {
    return <p>Loading post details...</p>;
  }

  if (!post) {
    return <p>Post not found</p>; // Handle the case where post is not found
  }

  //this component renders the components from HyGraph
  const renderContentFragment = (item, key) => {
    // Handle text nodes with formatting
    if (item.text) {
      let textElement = item.text;
  
      // Apply bold formatting
      if (item.bold) {
        textElement = <b key={key}>{textElement}</b>;
      }
  
      // Apply italic formatting
      if (item.italic) {
        textElement = <i key={key}>{textElement}</i>;
      }
  
      // Apply underline formatting
      if (item.underline) {
        textElement = <u key={key}>{textElement}</u>;
      }
  
      // Apply inline code formatting
      if (item.code) {
        textElement = (
          <code key={key} className="bg-gray-200 text-red-600 p-1 rounded">
            {textElement}
          </code>
        );
      }
  
      return <span key={key}>{textElement}</span>;
    }
  
    // Handle other element types
    switch (item.type) {
      case 'paragraph':
        return (
          <p key={key} className="mb-8">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </p>
        );
      case 'heading-one':
        return (
          <h1 key={key} className="text-4xl font-bold mb-6">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 key={key} className="text-3xl font-bold mb-5">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h2>
        );
      case 'heading-three':
        return (
          <h3 key={key} className="text-2xl font-bold mb-4">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h3>
        );
      case 'heading-four': // Support for heading 4
        return (
          <h4 key={key} className="text-xl font-bold mb-3">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h4>
        );
      case 'heading-five': // Support for heading 5
        return (
          <h5 key={key} className="text-lg font-bold mb-2">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h5>
        );
      case 'heading-six': // Support for heading 6
        return (
          <h6 key={key} className="text-base font-bold mb-1">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </h6>
        );
      case 'blockquote':
        return (
          <blockquote
            key={key}
            className="border-l-4 border-gray-400 pl-4 mb-8 italic text-gray-600"
          >
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </blockquote>
        );
      case 'code-block':
        return (
          <pre
            key={key}
            className="bg-gray-800 text-yellow-200 p-4 rounded mb-8 overflow-auto"
          >
            <code>
              {item.children.map((child, i) => renderContentFragment(child, i))}
            </code>
          </pre>
        );
      case 'link':
        return (
          <a
            key={key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </a>
        );
      case 'image':
        return (
          <img
            key={key}
            src={item.src}
            alt={item.title || 'Image'}
            className="mb-8 w-full h-auto rounded-lg"
          />
        );
      case 'video': // Handle video rendering
        return (
          <video
            key={key}
            controls
            src={item.src}
            className="mb-8 w-full h-auto rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        );
      default:
        return <span key={key}>{item.text}</span>;
    }
  };
  
  
  

  return (
    <div className="shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
      <div className="relative overflow-hidden shadow-md mb-6">
        {post.featuredImage?.url && (
          <img
            src={post.featuredImage.url}
            alt={post.title}
            className="object-top h-full w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg"
          />
        )}
      </div>
      <div className="px-4 lg:px-0">
        <div className="flex items-center mb-8 w-full">
          <div className="hidden md:flex items-center justify-center lg:mb-0 lg:w-auto mr-8">
            {post.author.photo?.url && (
              <img
                alt={post.author.name}
                height="30px"
                width="30px"
                className="align-middle rounded-full"
                src={post.author.photo.url}
              />
            )}
            <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg">
              {post.author.name}
            </p>
          </div>
          <div className="font-medium text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline mr-2 text-pink-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="align-middle">
              {moment(post.createdAt).format('MMM DD, YYYY')}
            </span>
          </div>
        </div>
        <h1 className="mb-8 text-3xl font-semibold">{post.title}</h1>
        {/* Render the content */}
        {post.content?.raw?.children?.length > 0 ? (
          post.content.raw.children.map((typeObj, index) =>
            renderContentFragment(typeObj, index)
          )
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
