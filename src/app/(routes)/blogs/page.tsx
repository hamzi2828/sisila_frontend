'use client';

import { useMemo, useState } from 'react';
import BlogIndexHeader from './components/BlogIndexHeader';
import BlogFeatured, { BlogPost } from './components/BlogFeatured';
import BlogGrid from './components/BlogGrid';
import BlogPicksRail from './components/BlogPicksRail';

const POSTS: BlogPost[] = [
  {
    id: 'poets-behind-prints',
    title: 'The Poets Behind the Prints: Ghalib to Elia',
    excerpt:
      'Tracing verses into visuals — how couplets evolve into composition, texture, and type for the Poets Series.',
    tag: 'Poets Series',
    date: 'May 12, 2025',
    read: '6 min read',
    image: 'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'designing-echoes',
    title: 'Designing Echoes of the Winds: Palette + Texture',
    excerpt:
      'From dunes and ocean breath to fabric drape — crafting the airy motion behind Echoes of the Winds.',
    tag: 'Theme — Echoes',
    date: 'May 4, 2025',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'street-to-studio',
    title: 'From Street to Studio: Building the Core Collection',
    excerpt:
      'Loose fits, graphic hits — the editorial process behind our attitude-forward street pieces.',
    tag: 'Category — Street',
    date: 'Apr 28, 2025',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'type-as-identity',
    title: 'Typography as Identity: Type-Led Graphics',
    excerpt:
      'Why letters carry culture — composing hierarchy, rhythm, and contrast in type-first designs.',
    tag: 'Category — Typography',
    date: 'Apr 20, 2025',
    read: '7 min read',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'color-stories',
    title: 'Color Stories for Artistic Passion',
    excerpt:
      'Gradients, pigments, and painterly motion — building an expressive color language.',
    tag: 'Theme — Artistic Passion',
    date: 'Apr 12, 2025',
    read: '5 min read',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'fabric-notes',
    title: 'Fabric Notes: Choices that Shape Fit + Feel',
    excerpt:
      'From combed cotton to brushed fleece — our approach to materials, durability, and drape.',
    tag: 'Craft',
    date: 'Apr 2, 2025',
    read: '4 min read',
    image: 'https://images.unsplash.com/photo-1534791547709-75aabed69e0e?auto=format&fit=crop&w=1600&q=80',
  },
];

const TAGS = [
  'All',
  'Poets Series',
  'Theme — Echoes',
  'Theme — Artistic Passion',
  'Category — Street',
  'Category — Typography',
  'Craft',
] as const;
type Tag = (typeof TAGS)[number];

export default function BlogsPage() {
  const [tag, setTag] = useState<string>('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    let r = [...POSTS];
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
  }, [tag, q]);

  const featured = rows[0];
  const rest = rows.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <BlogIndexHeader q={q} setQ={setQ} tag={tag} setTag={setTag} tags={TAGS} />
      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto">
          {featured ? <BlogFeatured post={featured} /> : null}
          <BlogGrid posts={rest} />
        </div>
      </section>
      <BlogPicksRail posts={POSTS.slice(0, 6).map(({ id, title, read, image }) => ({ id, title, read, image }))} />
    

     
    </main>
  );
}