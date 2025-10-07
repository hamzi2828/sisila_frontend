"use client";

import { useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { MainImageSection } from './components/MainImageSection';
import { MissionVisionSection } from './components/MissionVisionSection';
import { QuoteSection } from './components/QuoteSection';
import { JourneyCarousel } from './components/JourneyCarousel';
import { ValuesSection } from './components/ValuesSection';
import JourneyTimeline from './components/JourneyTimeline';

const AboutUsComponent: React.FC = () => {
  useEffect(() => {
    // Any global initialization can be added here if needed
  }, []);

  return (
    <main className="pt-20">
      <section style={{ backgroundColor: '#ffffff' }} className="overflow-hidden">
        {/* Hero with Modern Design */}
        <HeroSection
          subtitle="Our Story"
          title="We All Started"
          highlight="Somewhere"
          description="From passionate fitness enthusiasts to premium gymwear innovators"
        />

        {/* Stats Section */}
        <StatsSection />

        {/* Main Image with Enhanced Design */}
        <MainImageSection />

        {/* Mission & Vision Section */}
        <MissionVisionSection />

        {/* Secondary Image with Quote Overlay */}
        <QuoteSection />
      </section>

      <JourneyCarousel />

      <ValuesSection />

      <JourneyTimeline />
    </main>
  );
};

export default AboutUsComponent;