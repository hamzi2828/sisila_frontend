'use client';

import DetailHeader from './components/DetailHeader';
import DetailCover from './components/DetailCover';
import DetailBody from './components/DetailBody';
import DetailRelated from './components/DetailRelated';

export default function BlogDetailPage() {
  const COVER =
    'https://images.unsplash.com/photo-1493236296276-d17357e28875?auto=format&fit=crop&w=1600&q=80';

  const RELATED = [
    {
      title: 'Designing Echoes of the Winds: Palette + Texture',
      tag: 'Theme — Echoes',
      date: 'May 4, 2025',
      read: '4 min read',
      image:
        'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1600&q=80',
      href: '/blogdetail',
    },
    {
      title: 'Typography as Identity: Type-Led Graphics',
      tag: 'Category — Typography',
      date: 'Apr 20, 2025',
      read: '7 min read',
      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
      href: '/blogdetail',
    },
    {
      title: 'Color Stories for Artistic Passion',
      tag: 'Theme — Artistic Passion',
      date: 'Apr 12, 2025',
      read: '5 min read',
      image:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
      href: '/blogdetail',
    },
  ];

  return (
    <>
      <DetailHeader
        backHref="/blogs"
        tag="Poets Series"
        date="May 12, 2025"
        read="6 min read"
        title="The Poets Behind the Prints: Ghalib to Elia"
      />
      <DetailCover src={COVER} alt="Cover" />
      <DetailBody
        moreHref="/blogs"
        paragraphs={[
          'Silsila’s creative practice begins with respectful research — collecting references, sketching, and writing. From verses and frames to letterforms and drape, ideas pass through a process that balances culture with modern daily‑wear.',
          'We translate motifs into composition with careful typography, color palettes, and textures. The aim is wearable design with visual rhythm — pieces that feel both new and familiar.',
          // process notes
          'Sketch first, refine later — give space for visual language to surface.',
          'Balance typography with texture — clarity and character in equal parts.',
          'Prototype trims and prints — test for comfort, longevity, and colorfastness.',
        ]}
        figures={[
          { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80', alt: 'Studio' },
          { src: 'https://images.unsplash.com/photo-1494319827402-c4b9b83f5741?auto=format&fit=crop&w=1400&q=80', alt: 'Canvas' },
        ]}
        quote={{ text: 'Design should carry meaning gently — enough to be felt, not forced.', source: 'Silsila Notes' }}
      />
      <DetailRelated items={RELATED} />
    </>
  );
}