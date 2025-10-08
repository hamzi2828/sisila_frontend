'use client';

import Link from 'next/link';
import Image from 'next/image';

export type BlogCardPost = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  read: string;
  image: string;
};

export default function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <Link
      href="/blogdetail"
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80 hover:shadow-md transition"
    >
      <div className="relative w-full pt-[66%] bg-stone-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width:1024px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-900">
          {post.tag}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-stone-500">
          {post.date} • {post.read}
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-medium">{post.title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-sm font-medium text-white">
          Read ↗
        </span>
      </div>
    </Link>
  );
}