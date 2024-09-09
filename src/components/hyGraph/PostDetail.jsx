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

  const renderContentFragment = (item, key) => {
    switch (item.type) {
      case 'paragraph':
        return (
          <p key={key} className="mb-8">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </p>
        );
      case 'bulleted-list':
        return (
          <ul key={key} className="list-disc list-inside mb-8 ml-5">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </ul>
        );
      case 'list-item':
        return (
          <li key={key} className="mb-4">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </li>
        );
      case 'numbered-list':
        return (
          <ol key={key} className="list-decimal list-inside mb-8 ml-5">
            {item.children.map((child, i) => renderContentFragment(child, i))}
          </ol>
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
