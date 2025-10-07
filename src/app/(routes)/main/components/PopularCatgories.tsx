"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const PopularCategories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sample data - replace with your actual data
  const categories = [
    { id: 1, name: "Track Suits", image: "images/gym-5.svg" },
    { id: 2, name: "Athletic Wear", image: "images/gym-2.svg" },
    { id: 3, name: "Workout Gear", image: "images/gym-3.svg" },
    { id: 4, name: "Sports Equipment", image: "images/gym-4.svg" },
    { id: 5, name: "Fitness Apparel", image: "images/gym-5.svg" },
    { id: 6, name: "Training Clothes", image: "images/gym-3.svg" },
    { id: 7, name: "Running Gear", image: "images/gym-2.svg" },
  ];

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const updateScrollButtons = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (containerRef.current) {
      const cardWidth = 290 + 24; // card width + gap
      containerRef.current.scrollBy({
        left: -cardWidth * 2, // scroll 2 cards at a time
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (containerRef.current) {
      const cardWidth = 290 + 24; // card width + gap
      containerRef.current.scrollBy({
        left: cardWidth * 2, // scroll 2 cards at a time
        behavior: "smooth",
      });
    }
  }, []);

  const handleCategoryClick = useCallback((category: typeof categories[0]) => {
    console.log(`Category clicked: ${category.name}`);
    // Add your analytics or state logic here
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      // Initial check after images are loaded
      const handleLoad = () => updateScrollButtons();
      window.addEventListener('load', handleLoad);
      
      // Initial check
      updateScrollButtons();

      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [updateScrollButtons]);

  return (
    <>
      <section
        id="section2-popular-categories"
        className="border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto">
          {/* Header with Navigation */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 mb-12 sm:mb-16">
            <div className="flex-1">
              <h2 className="section2-font-montserrat text-2xl sm:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tight opacity-92 leading-tight">
                Popular Categories
              </h2>
            </div>

            {/* Navigation Controls */}
            <nav
              className="flex items-center gap-5"
              aria-label="Category carousel navigation"
            >
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`section2-nav-btn w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all ${
                  canScrollLeft
                    ? "hover:border-gray-400 cursor-pointer hover:bg-gray-50"
                    : "opacity-50 cursor-not-allowed"
                }`}
                aria-label="Previous categories"
              >
                <i className="fas fa-chevron-left text-gray-700 text-sm sm:text-base"></i>
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`section2-nav-btn w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all ${
                  canScrollRight
                    ? "hover:border-gray-400 cursor-pointer hover:bg-gray-50"
                    : "opacity-50 cursor-not-allowed"
                }`}
                aria-label="Next categories"
              >
                <i className="fas fa-chevron-right text-gray-700 text-sm sm:text-base"></i>
              </button>
            </nav>
          </header>

          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <div
              ref={containerRef}
              id="section2-cardsContainer"
              className="section2-cards-container flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {categories.map((category) => {
                const href = {
                  pathname: "/main",
                  query: { category: slugify(category.name) },
                };
                return (
                  <Link
                    key={category.id}
                    href={href}
                    onClick={() => handleCategoryClick(category)}
                    aria-label={`Browse ${category.name}`}
                    className="section2-card-link flex-shrink-0 w-72 sm:w-80 lg:w-[290px] h-[380px] sm:h-[420px] lg:h-[426px] bg-green-50 rounded-lg overflow-hidden group focus:outline-none focus:ring-4 focus:ring-green-200 hover:shadow-lg transition-shadow"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <article className="h-full flex flex-col">
                      <div className="flex-1 overflow-hidden">
                        <div className="relative w-full h-full">
                          <Image
                            src={`/${category.image}`}
                            alt={`${category.name} Collection`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority={category.id <= 3} // Load first 3 images with priority
                          />
                        </div>
                      </div>
                      <footer className="bg-gray-100 px-4 py-3 sm:py-4">
                        <h3 className="section2-font-montserrat font-bold text-black text-center text-sm sm:text-base">
                          {category.name}
                        </h3>
                      </footer>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularCategories;