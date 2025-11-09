'use client';

import { useMemo, useState, useEffect } from 'react';
import BlogIndexHeader from './components/BlogIndexHeader';
import BlogFeatured, { BlogPost } from './components/BlogFeatured';
import BlogGrid from './components/BlogGrid';
import BlogPicksRail from './components/BlogPicksRail';
import blogsService, { FeaturedBlog } from '../main/services/blogsService';

// Helper function to transform backend blog to BlogPost format
const transformBlogToPost = (blog: FeaturedBlog): BlogPost => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateReadTime = (content?: string) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return {
    id: blog._id,
    title: blog.title,
    excerpt: blog.excerpt || blog.content?.substring(0, 150) + '...' || '',
    tag: blog.category || 'Uncategorized',
    date: formatDate(blog.createdAt),
    read: calculateReadTime(blog.content),
    image: blog.image || blog.thumbnail || '',
    slug: blog.slug || '',
  };
};

export default function BlogsPage() {
  const [tag, setTag] = useState<string>('All');
  const [q, setQ] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { blogs } = await blogsService.getAllBlogs(1, 100);
        const transformedPosts = blogs.map(transformBlogToPost);
        setPosts(transformedPosts);

        // Extract unique tags
        const uniqueTags = Array.from(new Set(transformedPosts.map(p => p.tag))).filter(Boolean);
        setTags(['All', ...uniqueTags]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const rows = useMemo(() => {
    let r = [...posts];
    if (tag !== 'All') r = r.filter((p) => p.tag === tag);
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter(
        (p) =>
          p.title.toLowerCase().includes(t) ||
          p.excerpt.toLowerCase().includes(t) ||
          p.tag.toLowerCase().includes(t)
      );
    }
    return r;
  }, [posts, tag, q]);

  const featured = rows[0];
  const rest = rows.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <BlogIndexHeader q={q} setQ={setQ} tag={tag} setTag={setTag} tags={tags} />
      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
                <p className="mt-4 text-stone-600">Loading blogs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-600 text-lg">No blogs available at the moment.</p>
            </div>
          ) : (
            <>
              {featured ? <BlogFeatured post={featured} /> : null}
              <BlogGrid posts={rest} />
            </>
          )}
        </div>
      </section>
      {!isLoading && !error && posts.length > 0 && (
        <BlogPicksRail posts={posts.slice(0, 6).map(({ id, title, read, image }) => ({ id, title, read, image }))} />
      )}
    

     
    </main>
  );
}