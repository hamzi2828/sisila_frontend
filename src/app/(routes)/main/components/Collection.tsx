"use client";
import React, { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const Collection: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const currentScroll = carouselRef.current.scrollLeft;

      if (direction === "left") {
        carouselRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: "smooth",
        });
      } else {
        carouselRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const cards = [
    { id: 1, title: "Power Yoga", image: "/images/gym-2.svg" },
    { id: 2, title: "Battle Box", image: "/images/gym-3.svg" },
    { id: 3, title: "Boxing", image: "/images/gym-4.svg" },
    { id: 4, title: "Cardio", image: "/images/gym-5.svg" },
    { id: 5, title: "Strength", image: "/images/gym-6.svg" },
    { id: 6, title: "HIIT", image: "/images/gym-7.svg" },
  ];

  return (
    <div className="section5-classes bg-black py-16 md:py-20 px-4 md:px-8 lg:px-20 relative overflow-hidden">
      <div className="mx-auto">
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-transparent">
            <div className="section5-badge-icon w-2 h-2 rounded-full"></div>
            <span className="section5-badge-text text-sm font-semibold">Collection</span>
          </div>

          {/* Main Title */}
          <h1 className="section5-main-title text-2xl md:text-3xl lg:text-4xl font-bold mb-6 max-w-4xl mx-auto">
            Premium Gymwear Collection
          </h1>

          {/* Description */}
          <p className="section5-description text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Discover our high-performance athletic wear designed for every
            workout. From moisture-wicking fabrics to ergonomic designs, our
            gymwear collection empowers you to push your limits in style and
            comfort.
          </p>
        </header>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className="section5-nav-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-black transition-colors duration-300"
            onClick={() => scrollCarousel("left")}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>

          <button
            className="section5-nav-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-black transition-colors duration-300"
            onClick={() => scrollCarousel("right")}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>

          {/* Cards Container */}
          <div 
            ref={carouselRef} 
            className="section5-carousel-container flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {cards.map((card) => (
              <article 
                key={card.id} 
                className="section5-card flex-shrink-0 w-72 h-96 md:h-[420px] rounded-lg overflow-hidden"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="h-full flex flex-col">
                  <div className="flex-1 relative">
                    <Link href="/product-detail" className="block h-full w-full">
                      <Image
                        src={card.image}
                        alt={`${card.title} Collection`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={card.id <= 3}
                      />
                    </Link>
                  </div>
                  <div className="section5-card-context p-3 flex items-center justify-between bg-gray-50">
                    <Link 
                      href="/product-detail" 
                      className="section5-class-name text-lg font-bold hover:text-gray-700 transition-colors"
                    >
                      {card.title}
                    </Link>
                    <Link 
                      href="/product-detail" 
                      className="section5-plus-btn text-xl hover:text-gray-700 transition-colors" 
                      aria-label={`View ${card.title}`}
                    >
                      <i className="fas fa-plus"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;