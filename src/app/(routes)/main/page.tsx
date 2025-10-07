// app/(routes)/main/page.tsx
import HeroCarousel from "./components/HeroCarousel";
import WhyChooseUs from "./components/WhyChooseUs";
import BlogsSection from "./components/BlogsSection";
import GymAboutSection from "./components/GymAboutSection";
import GymFolioClasses from "./components/GymFolioClasses";
import GymfolioGallery from "./components/GymfolioGallery";
import GymTrainersSection from "./components/GymTrainersSection";
import ContactSection from "./components/ContactSection";
import ExploreCategories from "./components/ExploreCategories";
import ThemesSection from "./components/ThemesSection";
import SeriesSection from "./components/SeriesSection";
import TrendingRailSection from "./components/TrendingRailSection";
import InstagramFeedSection from "./components/InstagramFeedSection";
import EditorialGallerySection from "./components/EditorialGallerySection";
import NewArrivalsSection from "./components/NewArrivalsSection"; 
export default function MainPage() {
  return (
    <main >
      <HeroCarousel />
      <ExploreCategories />
      <ThemesSection/>
        <SeriesSection />
      <NewArrivalsSection />
      {/* <EditorialGallerySection /> */}
    
      
      {/* <TrendingRailSection /> */}
      
      {/* <GymAboutSection />
      <WhyChooseUs /> */}
      {/* <GymFolioClasses />
      <GymfolioGallery />
      <GymTrainersSection />
      <ContactSection /> */}
      <BlogsSection />
      <InstagramFeedSection />
    </main>
  );
}
