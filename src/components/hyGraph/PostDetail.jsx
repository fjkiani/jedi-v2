import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostDetails } from '../../services';
import moment from 'moment';
import TwitterCard from '../TwitterCard';
import { useTheme } from '@/context/ThemeContext';

// Approximate reading time (words per minute)
const WORDS_PER_MIN = 200;
function countWordsFromRaw(contentRaw) {
  if (!contentRaw?.children) return 0;
  let count = 0;
  function walk(nodes) {
    (nodes || []).forEach((node) => {
      if (node.text) count += (node.text || '').trim().split(/\s+/).filter(Boolean).length;
      if (node.children) walk(node.children);
    });
  }
  walk(contentRaw.children);
  return count;
}

const PostDetail = ({ post: postProp }) => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  const [post, setPost] = useState(postProp ?? null);
  const [loading, setLoading] = useState(!postProp);

  useEffect(() => {
    if (postProp) {
      setPost(postProp);
      setLoading(false);
      return;
    }
    const fetchPostDetails = async () => {
      const fetchedPost = await getPostDetails(slug);
      setPost(fetchedPost);
      setLoading(false);
    };
    fetchPostDetails();
  }, [slug, postProp]);

  if (loading) {
    return <p className={isDarkMode ? 'text-n-2' : 'text-n-6'}>Loading post details...</p>;
  }

  if (!post) {
    return <p className={isDarkMode ? 'text-n-2' : 'text-n-6'}>Post not found</p>;
  }

  const wordCount = countWordsFromRaw(post.content?.raw);
  const readingTimeMins = Math.max(1, Math.ceil(wordCount / WORDS_PER_MIN));
  const author = post?.author?.[0];

  // Renders content fragments (headings, paragraphs, lists, images, etc.)
  const renderContentFragment = (item, key) => {
    if (item.text) {
      let textElement = item.text;
      if (item.bold) textElement = <b key={key}>{textElement}</b>;
      if (item.italic) textElement = <i key={key}>{textElement}</i>;
      if (item.underline) textElement = <u key={key}>{textElement}</u>;
      if (item.code) textElement = <code key={key} className={`p-1 rounded ${isDarkMode ? 'bg-n-6 text-primary-2' : 'bg-n-2 text-red-600'}`}>{textElement}</code>;
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
          <h2 key={key} className={`text-2xl md:text-3xl font-bold mb-4 mt-10 pt-8 border-t ${isDarkMode ? 'border-n-6 text-n-1' : 'border-n-3 text-n-8'}`}>
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
                {listItem.children?.map((child, childIndex) =>
                  renderContentFragment(child, `${key}-${i}-${childIndex}`)
                )}
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
        return null;
    }
  };

  const cardBg = isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3';
  const textMuted = isDarkMode ? 'text-n-3' : 'text-n-5';
  const proseClass = isDarkMode ? 'prose prose-invert' : 'prose';

  return (
    <>
      <TwitterCard post={post} />
      <article className={`shadow-lg rounded-xl border ${cardBg} lg:p-8 pb-12 mb-8 overflow-hidden`}>
        {/* Hero: featured image with optional overlay */}
        <header className="mb-8">
          {post.featuredImage?.url && (
            <div className="relative overflow-hidden rounded-t-xl lg:rounded-lg mb-6 -mx-0 lg:-mx-8 -mt-0 lg:-mt-8">
              <img
                src={post.featuredImage.url}
                alt={post.title}
                className="object-center w-full h-48 sm:h-64 md:h-80 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-n-8/90 to-transparent' : 'from-black/40 to-transparent'}`} />
            </div>
          )}
          <div className="px-4 lg:px-0">
            {/* Category pills + reading time */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.categories?.length > 0 && post.categories.map((cat) => (
                <span
                  key={cat.slug}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-7'}`}
                >
                  {cat.name}
                </span>
              ))}
              <span className={textMuted + ' text-sm'}>
                {readingTimeMins} min read
              </span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {author?.photo?.url ? (
                <img alt={author.name || 'Author'} width={36} height={36} className="rounded-full" src={author.photo.url} />
              ) : (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-5'}`}>
                  <span className="text-sm font-medium">{(author?.name || 'A').charAt(0)}</span>
                </div>
              )}
              <span className={`font-medium ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>{author?.name || 'Anonymous'}</span>
              <span className={textMuted}>
                <time dateTime={post.createdAt}>{moment(post.createdAt).format('MMM DD, YYYY')}</time>
              </span>
            </div>
          </div>
        </header>

        {/* Body: constrained width for readability */}
        <div className="px-4 lg:px-0">
          <div className={`${proseClass} max-w-prose mx-auto text-base`}>
            {post.content?.raw?.children?.length > 0 ? (
              post.content.raw.children.map((typeObj, index) => renderContentFragment(typeObj, index))
            ) : (
              <p className={textMuted}>No content available</p>
            )}
          </div>

          {/* CTA block */}
          <div className={`max-w-prose mx-auto mt-12 pt-8 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}>
            <p className={`mb-4 ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
              Ready to see how JEDI can help your business?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/solutions"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-primary-1 text-white hover:opacity-90' : 'bg-primary-1 text-white hover:opacity-90'}`}
              >
                Explore solutions
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg font-medium border transition-colors ${isDarkMode ? 'border-n-5 text-n-2 hover:bg-n-6' : 'border-n-3 text-n-7 hover:bg-n-2'}`}
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostDetail;
