import React, { useRef } from 'react';
import Image from 'next/image';

type JourneyCardProps = {
  year: string;
  description: string;
  imageSrc: string;
  alt: string;
};

const JourneyCard: React.FC<JourneyCardProps> = ({ year, description, imageSrc, alt }) => (
  <article className="about-us-carousel-card flex-shrink-0 rounded-lg overflow-hidden">
    <a href="#" className="block h-full">
      <div className="h-2/3 relative">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="about-us-carousel-card-content h-1/3 p-4 flex flex-col justify-center">
        <div className="space-y-2">
          <h3 className="about-us-carousel-card-year font-bold text-lg">
            {year}
          </h3>
          <p className="about-us-carousel-card-text text-sm leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>
    </a>
  </article>
);

export const JourneyCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const scrollAmount = carouselRef.current.offsetWidth * 0.8; // Scroll 80% of container width
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const journeyData = [
    {
      year: '2020',
      description: 'Founded our premium gymwear brand with a vision to revolutionize athletic apparel through innovative design and superior quality materials.',
      imageSrc: '/images/gym-2.svg',
      alt: 'Gymwear brand founding in 2020',
    },
    {
      year: '2021',
      description: 'Launched our first collection featuring moisture-wicking fabrics and ergonomic designs, gaining recognition from fitness enthusiasts worldwide.',
      imageSrc: '/images/gym-3.svg',
      alt: 'Gymwear product launch in 2021',
    },
    {
      year: '2022',
      description: 'Expanded internationally and introduced sustainable materials, partnering with eco-friendly suppliers to reduce our environmental impact.',
      imageSrc: '/images/gym-4.svg',
      alt: 'Gymwear expansion in 2022',
    },
    {
      year: '2023',
      description: 'Reached 50,000+ satisfied customers globally and launched our premium performance line with advanced compression technology.',
      imageSrc: '/images/gym-5.svg',
      alt: 'Gymwear innovation in 2023',
    },
    {
      year: '2024',
      description: 'Continuing innovation with smart fabric technology and expanding our community of athletes who trust our brand for peak performance.',
      imageSrc: '/images/gym-6.svg',
      alt: 'Gymwear future in 2024',
    },
  ];

  return (
    <div className="about-us-carousel-section px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto">
        {/* Header */}
        <header className="text-center mb-24">
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent">
              <div className="about-us-carousel-badge-icon"></div>
              <span className="about-us-carousel-badge-text text-sm font-semibold lowercase tracking-wide">
                JOURNEY
              </span>
            </div>

            {/* Title */}
            <h1 className="about-us-carousel-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-center">
              The Journey So Far
            </h1>
          </div>
        </header>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Navigation Arrow (Desktop Only) */}
          <button
            onClick={() => scrollCarousel('left')}
            className="about-us-carousel-nav-button hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full items-center justify-center z-10"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left text-white text-lg"></i>
          </button>

          {/* Right Navigation Arrow (Desktop Only) */}
          <button
            onClick={() => scrollCarousel('right')}
            className="about-us-carousel-nav-button hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full items-center justify-center z-10"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right text-white text-lg"></i>
          </button>

          {/* Cards Container */}
          <div
            ref={carouselRef}
            className="about-us-carousel-container flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          >
            {journeyData.map((item, index) => (
              <JourneyCard
                key={index}
                year={item.year}
                description={item.description}
                imageSrc={item.imageSrc}
                alt={item.alt}
              />
            ))}
          </div>

          {/* Navigation Buttons (Mobile Only) */}
          <div className="flex justify-center items-center gap-8 mt-8 lg:hidden">
            <button
              onClick={() => scrollCarousel('left')}
              className="about-us-carousel-nav-button w-12 h-12 rounded-full flex items-center justify-center"
              aria-label="Previous slide"
            >
              <i className="fas fa-chevron-left text-white text-lg"></i>
            </button>

            <button
              onClick={() => scrollCarousel('right')}
              className="about-us-carousel-nav-button w-12 h-12 rounded-full flex items-center justify-center"
              aria-label="Next slide"
            >
              <i className="fas fa-chevron-right text-white text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyCarousel;
