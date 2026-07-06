import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Categories, PostWidget } from '../components/hyGraph';
import { getPostDetails } from '../services';
import { AdjacentPosts } from '../sections';
import PostDetail from '../components/hyGraph/PostDetail';
import SEO from '@/components/SEO';

/**
 * Derive a human-readable title from a URL slug when the Hygraph fetch has
 * not yet resolved (or fails at prerender time). This guarantees the page
 * emits <title>, <meta description>, canonical, and og:* tags before the
 * data payload arrives — critical for SSR / prerender to capture SEO.
 */
const titleFromSlug = (slug: string | undefined) => {
  if (!slug) return 'Research Article';
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
};

/**
 * Build the final <title> for a blog post so it always fits under the 70-char
 * SEO audit ceiling.
 *
 * Budget:
 *  - hard ceiling: 70 chars (audit-title-length FAIL_MAX)
 *  - target window: <= 60 chars (WARN_MAX)
 *  - brand suffix " | Jedi Labs Research" = 21 chars
 *
 * Strategy:
 *   - if `${title} | Jedi Labs Research` <= 60 -> use it (best case)
 *   - else if raw title <= 65 -> use raw title alone (Google crops titles at
 *     around 60-65 chars anyway, and the CMS post title already carries the
 *     brand voice + topic)
 *   - else truncate raw title at a word boundary to <= 65 with ellipsis
 *
 * This is deterministic (no CMS edits required) and idempotent.
 */
const clampTitle = (raw: string): string => {
  const suffix = ' | Jedi Labs Research';
  const withSuffix = `${raw}${suffix}`;
  if (withSuffix.length <= 60) return withSuffix;
  if (raw.length <= 65) return raw;
  // Truncate raw at last space before position 62, append ellipsis
  const cutAt = raw.slice(0, 62).lastIndexOf(' ');
  const cut = cutAt > 30 ? raw.slice(0, cutAt) : raw.slice(0, 62);
  return `${cut}…`;
};

const PostDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getPostDetails(slug);
      if (!fetchedPost) {
        navigate('/404'); // Redirect to a 404 page if the post is not found
      } else {
        setPost(fetchedPost);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  // Compute SEO fields — falls back to slug-derived values when data hasn't
  // loaded yet. This is the key change: <SEO/> is now rendered on every
  // branch (loading, not-found, loaded), so prerender always captures a
  // valid title / description / canonical.
  const slugTitle = titleFromSlug(slug);
  const seoPath = `/blog/post/${slug}`;
  // clampTitle enforces the <= 70 char audit ceiling. Slug-derived fallback is
  // always short so the suffix-included form is fine; CMS titles may be long
  // and get clamped/truncated deterministically.
  const seoTitle = post
    ? clampTitle((post as any).title)
    : `${slugTitle} | Jedi Labs Research`;
  const rawExcerpt = post
    ? ((post as any).excerpt || (post as any).description || '')
    : '';
  const cleanExcerpt = String(rawExcerpt).replace(/<[^>]+>/g, '').trim().slice(0, 160);
  const seoDesc = cleanExcerpt
    || `Read "${post ? (post as any).title : slugTitle}" on Jedi Labs — production AI evaluation deep-dives, agent design patterns, and applied research notes.`;
  const seoImage = (post as any)?.featuredImage?.url || 'https://jedilabs.org/og/og-blog.png';

  const seo = (
    <SEO
      title={seoTitle}
      description={seoDesc}
      path={seoPath}
      ogImage={seoImage}
    />
  );

  if (loading) {
    return (
      <>
        {seo}
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 mb-8">
          <h1 className="sr-only">{slugTitle}</h1>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="animate-pulse">
                <div className="h-48 sm:h-64 md:h-80 bg-n-3 rounded-t-xl mb-6" />
                <div className="h-4 bg-n-3 rounded w-1/3 mb-4" />
                <div className="h-8 bg-n-3 rounded w-full max-w-2xl mb-6" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-n-3 rounded" style={{ width: i === 4 ? '80%' : '100%' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        {seo}
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">{slugTitle}</h1>
          <p className="mt-4 text-n-4">Post not found.</p>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-10 mb-8">
      {seo}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <PostDetail post={post} />
          <h2 className="text-xl font-semibold mb-6 mt-12 text-n-8 dark:text-n-2">Related reads</h2>
          <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
          {/* <CommentsForm slug={post.slug} />
          <Comments slug={post.slug} /> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
