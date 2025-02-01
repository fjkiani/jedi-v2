import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetails } from '../../services';
import moment from 'moment';
import TwitterCard from '../TwitterCard';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citations, setCitations] = useState([]); // State to track citations

  useEffect(() => {
    const fetchPostDetails = async () => {
      const fetchedPost = await getPostDetails(slug);
      console.log('Fetched post details:', fetchedPost); // Debug log
      setPost(fetchedPost);
      setLoading(false);
    };
    fetchPostDetails();
  }, [slug]);

  if (loading) {
    return <p>Loading post details...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  // Debug log before passing to TwitterCard
  console.log('Post data being passed to TwitterCard:', {
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    author: post.author,
    createdAt: post.createdAt,
    slug: post.slug
  });

  // Function to add citation to the list and return its number
  const addCitation = (href) => {
    const index = citations.findIndex(citation => citation.href === href);
    if (index !== -1) {
      return index + 1; // Return existing citation number
    }
    setCitations(prev => [...prev, { href, number: prev.length + 1 }]);
    return citations.length + 1;
  };

  // Render citation with hover tooltip
  const Citation = ({ href }) => {
    const number = addCitation(href);
    return (
      <span className="relative group">
        <sup className="text-blue-500 cursor-pointer">{number}</sup>
        <span className="absolute bottom-full mb-1 hidden group-hover:block bg-white text-black text-xs p-1 border border-gray-300 rounded shadow-lg">
          <a href={href} target="_blank" rel="noopener noreferrer">{href}</a>
        </span>
      </span>
    );
  };

  // Function to render content fragments and handle citations
  const renderContentFragment = (item, key) => {
    if (item.text) {
      let textElement = item.text;
      if (item.bold) textElement = <b key={key}>{textElement}</b>;
      if (item.italic) textElement = <i key={key}>{textElement}</i>;
      if (item.underline) textElement = <u key={key}>{textElement}</u>;
      if (item.code) textElement = <code key={key} className="bg-gray-200 text-red-600 p-1 rounded">{textElement}</code>;
      return <span key={key}>{textElement}</span>;
    }

    switch (item.type) {
      case 'heading-six':
        return (
          <h6 key={key} className="text-lg font-semibold mb-3">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </h6>
        );

      case 'image':
        return (
          <img
            key={key}
            src={item.src}
            alt={item.title || 'blog image'}
            width={item.width}
            height={item.height}
            className="my-4 rounded-lg"
          />
        );

      case 'list-item':
        return (
          <li key={key} className="mb-2">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </li>
        );

      case 'heading-one':
        return (
          <h1 key={key} className="text-4xl font-bold mb-6">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </h1>
        );

      case 'heading-two':
        return (
          <h2 key={key} className="text-3xl font-bold mb-4">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </h2>
        );

      case 'heading-three':
        return (
          <h3 key={key} className="text-2xl font-bold mb-4">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </h3>
        );

      case 'heading-four':
        return (
          <h4 key={key} className="text-xl font-bold mb-3">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </h4>
        );

      case 'paragraph':
        return (
          <p key={key} className="mb-8">
            {item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}
          </p>
        );

      case 'bulleted-list':
        return (
          <ul key={key} className="list-disc pl-6 mb-8">
            {item.children.map((listItem, i) => (
              <li key={i} className="mb-2">
                {listItem.children.map((child, childIndex) => 
                  renderContentFragment(child, `${key}-${i}-${childIndex}`)
                )}
              </li>
            ))}
          </ul>
        );

      case 'numbered-list':
        return (
          <ol key={key} className="list-decimal pl-6 mb-8">
            {item.children?.map((listItem, i) => (
              <li key={i} className="mb-2">
                {listItem.children?.map((child, childIndex) => {
                  console.log('Numbered list child:', child);
                  return renderContentFragment(child, `${key}-${i}-${childIndex}`);
                })}
              </li>
            ))}
          </ol>
        );

      case 'list-item-child':
        return (
          <>{item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`))}</>
        );

      default:
        if (item.children) {
          return item.children.map((child, i) => renderContentFragment(child, `${key}-${i}`));
        }
        console.log('Unhandled type:', item.type, item);
        return null;
    }
  };

  return (
    <>
      <TwitterCard post={post} />
      <div className="shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
        <div className="relative overflow-hidden shadow-md mb-6">
          {post.featuredImage?.url && (
            <img src={post.featuredImage.url} alt={post.title} className="object-top h-full w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg" />
          )}
        </div>
        <div className="px-4 lg:px-0">
          <div className="flex items-center mb-8 w-full">
            <div className="flex items-center justify-center lg:mb-0 lg:w-auto mr-8">
              {post?.author?.[0]?.photo?.url ? (
                <img 
                  alt={post.author[0].name || 'Author'} 
                  height="30px" 
                  width="30px" 
                  className="align-middle rounded-full" 
                  src={post.author[0].photo.url} 
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">A</span>
                </div>
              )}
              <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg">
                {post?.author?.[0]?.name || 'Anonymous'}
              </p>
            </div>
            <div className="font-medium text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
            </div>
          </div>
          <h1 className="mb-8 text-3xl font-semibold">{post.title}</h1>
          <div className="prose prose-invert max-w-none">
            {post.content?.raw?.children?.length > 0 ? (
              post.content.raw.children.map((typeObj, index) => renderContentFragment(typeObj, index))
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
