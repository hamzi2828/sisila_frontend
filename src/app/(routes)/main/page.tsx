// app/(routes)/main/page.tsx
import HeroCarousel from "./components/HeroCarousel";
import PopularCatgories from "./components/PopularCatgories";
import WhyChooseUs from "./components/WhyChooseUs";
import TheBest from "./components/TheBest";
import Collection from "./components/Collection";
import TopPick from "./components/TopPick";
import BlogsSection from "./components/BlogsSection";

export default function MainPage() {
  return (
    <main className="pt-20">
      <HeroCarousel />
      <PopularCatgories />
      <WhyChooseUs />
      <TheBest />
      <Collection />
      <TopPick />
      <BlogsSection />
    </main>
  );
}
