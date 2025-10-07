import React from 'react';

interface HeroSectionProps {
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  subtitle,
  title,
  highlight,
  description,
}) => {
  return (
    <section className="overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="relative about-us-section1-gradient-bg py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-20">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(174, 175, 178, 0.3) 100%)',
          }}
        ></div>
        <div className="relative z-10 mx-auto">
          <div className="text-center space-y-8 about-us-section1-fade-in">
            <div
              className="inline-block px-6 py-2 backdrop-blur-sm rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(174, 175, 178, 0.5)',
              }}
            >
              <span className="about-us-section1-hero-subtitle text-sm sm:text-base">
                {subtitle}
              </span>
            </div>
            <h1 className="about-us-section1-hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-tight about-us-section1-floating">
              {title}<br />
              <span className="about-us-section1-highlight">{highlight}</span>
            </h1>
            <p
              className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#6a6b70' }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
