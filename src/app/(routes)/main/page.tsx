// app/(routes)/main/page.tsx
'use client';

import { useState, useEffect } from 'react';
import HeroCarousel from "./components/HeroCarousel";
import BlogsSection from "./components/BlogsSection";
import ExploreCategories from "./components/ExploreCategories";
import ThemesSection from "./components/ThemesSection";
import SeriesSection from "./components/SeriesSection";
import InstagramFeedSection from "./components/InstagramFeedSection";
import NewArrivalsSection, { type Product } from "./components/NewArrivalsSection";
import { publicProductService, type PublicProduct } from './services/publicProductService';

export default function MainPage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await publicProductService.getLatestProducts(6);

        // Map PublicProduct to Product type
        const mappedProducts: Product[] = response.data.map((p: PublicProduct) => {
          // Handle image for variant products
          let imageUrl = p.thumbnailUrl || (p.bannerUrls && p.bannerUrls[0]) || '/images/placeholder.png';

          if (p.productType === 'variant' && p.variants && p.variants.length > 0) {
            const firstVariantColor = p.variants[0].color;
            if (firstVariantColor && p.colorMedia?.[firstVariantColor]?.thumbnailUrl) {
              imageUrl = p.colorMedia[firstVariantColor].thumbnailUrl;
            }
          }

          // Add backend URL prefix if not already present
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/images/')) {
            imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
          }

          return {
            id: p._id,
            title: p.name,
            price: p.discountedPrice || p.price,
            image: imageUrl,
            href: `/productdetail/${p._id}`,
            badge: p.featured ? 'New' as const : undefined,
          };
        });

        setNewArrivals(mappedProducts);
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <main >
      <HeroCarousel />
      <ExploreCategories />
      <ThemesSection/>
      <SeriesSection />
      <NewArrivalsSection products={newArrivals} />
      <BlogsSection />
      <InstagramFeedSection />
    </main>
  );
}
