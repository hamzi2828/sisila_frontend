'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailHeader from './components/DetailHeader';
import DetailCover from './components/DetailCover';
import DetailRelated from './components/DetailRelated';
import blogsService, { FeaturedBlog } from '../main/services/blogsService';

// Type for related blog items
interface RelatedBlogItem {
  title: string;
  tag: string;
  date: string;
  read: string;
  image: string;
  href: string;
}

export default function BlogDetailPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [blog, setBlog] = useState<FeaturedBlog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) {
        setError('Blog not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the blog by slug
        const blogData = await blogsService.getBlogBySlug(slug);
        setBlog(blogData);

        // Fetch related blogs (latest 3)
        const related = await blogsService.getLatestBlogs(4);
        const transformedRelated = related
          .filter(b => b._id !== blogData._id) // Exclude current blog
          .slice(0, 3) // Take first 3
          .map(b => ({
            title: b.title,
            tag: b.category || 'Uncategorized',
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            read: calculateReadTime(b.content),
            image: b.image || b.thumbnail || '',
            href: `/blogdetail?slug=${b.slug}`,
          }));
        setRelatedBlogs(transformedRelated);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  const calculateReadTime = (content?: string) => {
    if (!content) return '5 min read';
    // Remove HTML tags for word count
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Blog not found'}</p>
          <a href="/blogs" className="mt-4 inline-block text-stone-600 hover:text-stone-900">
            ← Back to Blogs
          </a>
        </div>
      </div>
    );
  }

  const coverImage = blog.image || blog.thumbnail || '';

  return (
    <>
      <DetailHeader
        backHref="/blogs"
        tag={blog.category || 'Uncategorized'}
        date={new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        read={calculateReadTime(blog.content)}
        title={blog.title}
      />
      <DetailCover src={coverImage} alt={blog.title} />

      {/* Blog Content Section */}
      <section className="px-6 md:px-10 lg:px-20 py-10">
        <article className="mx-auto max-w-5xl prose prose-stone prose-lg prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-ul:list-disc prose-li:ml-4">
          <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
        </article>

        {/* Footer Actions */}
        <div className="mx-auto max-w-5xl mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            className="inline-flex items-center rounded-full border border-stone-300/80 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
          >
            <i className="fa-solid fa-link mr-2" aria-hidden="true" />
            Copy link
          </button>
          <a
            href="/blogs"
            className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            More stories
          </a>
        </div>
      </section>

      {relatedBlogs.length > 0 && <DetailRelated items={relatedBlogs} />}
    </>
  );
}