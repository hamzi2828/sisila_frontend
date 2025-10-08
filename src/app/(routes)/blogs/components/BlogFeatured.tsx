'use client';

import Link from 'next/link';
import Image from 'next/image';

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  read: string;
  image: string;
};

export default function BlogFeatured({ post }: { post: BlogPost }) {
  if (!post) return null;
  return (
    <Link
      href="/blogdetail"
      className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200"
    >
      <div className="relative w-full pt-[45%]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width:1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-stone-900">
            {post.tag}
          </span>
          <h2 className="mt-2 text-xl md:text-2xl font-semibold text-white">{post.title}</h2>
          <p className="mt-1 hidden max-w-2xl text-white/85 md:block">{post.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}