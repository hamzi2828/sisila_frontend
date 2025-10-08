'use client';

import NewArrivalsHero from './components/NewArrivalsHero';
import NewArrivalsValue from './components/NewArrivalsValue';
import NewArrivalsFeature from './components/NewArrivalsFeature';
import NewArrivalsRail from './components/NewArrivalsRail';

const ITEMS = [
  { id: 'verses-tee', title: 'Verses Tee', price: 38, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80' },
  { id: 'palette-crew', title: 'Palette Crew', price: 66, image: 'https://images.unsplash.com/photo-1520975659191-5bb8826e8f76?auto=format&fit=crop&w=1400&q=80' },
  { id: 'neon-alley-hoodie', title: 'Neon Alley Hoodie', price: 78, image: 'https://images.unsplash.com/photo-1518544801976-3e188ea222e7?auto=format&fit=crop&w=1400&q=80' },
  { id: 'forest-tee', title: 'Forest Tee', price: 40, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80' },
  { id: 'canvas-tee', title: 'Canvas Tee', price: 42, image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1400&q=80' },
  { id: 'city-ls', title: 'City LS', price: 58, image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf704d9?auto=format&fit=crop&w=1400&q=80' },
];

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <section className="px-6 md:px-10 lg:px-20 pt-16 pb-8">
        <div className="mx-auto ">
          <NewArrivalsHero />
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-20 pb-6">
        <div className="mx-auto ">
          <NewArrivalsValue />
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-20">
        <div className="mx-auto ">
          <NewArrivalsFeature items={ITEMS} />
        </div>
      </section>

      <section className="px-6 md:px-10 lg:px-20 pb-16">
        <div className="mx-auto ">
          <NewArrivalsRail items={ITEMS} />
        </div>
      </section>
    </main>
  );
}