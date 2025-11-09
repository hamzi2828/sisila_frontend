'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import blogsService, { FeaturedBlog } from '../services/blogsService';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  read: string;
  image: string;
  slug: string;
};

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
    image: blog.image || blog.thumbnail || 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80',
    slug: blog.slug || '',
  };
};

export default function BlogsSection({
  className = '',
  title = 'Stories',
  subtitle = 'Culture, craft, and the making of Silsila — behind the prints, palettes, and fits.',
}: {
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const blogs = await blogsService.getLatestBlogs(4);
        console.log('Fetched blogs:', blogs); // Debug log
        const transformedPosts = blogs.map(transformBlogToPost);
        console.log('Transformed posts:', transformedPosts); // Debug log
        setPosts(transformedPosts);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="stories" className={`px-6 md:px-10 lg:px-20 py-12 ${className}`}>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Brand Journal
            </p>
            <h2
              className="mt-1 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {title}
            </h2>
            <p className="mt-2 text-stone-600">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              View all stories ↗
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-6 flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto"></div>
              <p className="mt-4 text-stone-600">Loading blogs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-6 text-center py-20">
            <p className="text-red-600">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-6 text-center py-20">
            <p className="text-stone-600">No blogs available at the moment.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post, i) => (
              <StoryCard key={post.id} post={post} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/blogdetail?slug=${post.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
    >
      <div className="relative w-full pt-[66%] bg-stone-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
            {post.tag}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.read}</span>
        </div>
        <h3 className="mt-1 text-stone-900 text-base font-semibold">{post.title}</h3>
        <p className="mt-1 text-sm text-stone-600 line-clamp-2">{post.excerpt}</p>

        <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white hover:bg-stone-800">
          Read ↗
        </span>
      </div>
    </Link>
  );
}