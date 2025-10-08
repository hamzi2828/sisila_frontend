'use client';

import BlogCard, { BlogCardPost } from './BlogCard';

export default function BlogGrid({ posts }: { posts: BlogCardPost[] }) {
  if (!posts?.length) return null;
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  );
}