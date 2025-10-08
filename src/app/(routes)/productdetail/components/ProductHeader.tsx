'use client';

import Link from 'next/link';

export default function ProductHeader({ product }: { product: any }) {
  const pretty = (id: string) => id.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
  return (
    <nav className="text-sm text-stone-500">
      <Link href="/" className="hover:text-stone-800">Home</Link>
      <span className="mx-2">/</span>
      <Link href={`/categories#${product.categoryId}`} className="hover:text-stone-800 capitalize">
        {pretty(product.categoryId)}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-stone-800">{product.title}</span>
    </nav>
  );
}