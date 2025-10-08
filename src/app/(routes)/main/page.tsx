// app/(routes)/main/page.tsx
import HeroCarousel from "./components/HeroCarousel";
import BlogsSection from "./components/BlogsSection";
import ExploreCategories from "./components/ExploreCategories";
import ThemesSection from "./components/ThemesSection";
import SeriesSection from "./components/SeriesSection";

import InstagramFeedSection from "./components/InstagramFeedSection";

import NewArrivalsSection from "./components/NewArrivalsSection"; 
export default function MainPage() {
  return (
    <main >
      <HeroCarousel />
      <ExploreCategories />
      <ThemesSection/>
        <SeriesSection />
      <NewArrivalsSection />
      
    
      
     
      <BlogsSection />
      <InstagramFeedSection />
    </main>
  );
}
