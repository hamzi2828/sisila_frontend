"use client";
import React, { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const TopPick: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const initSection6Carousel = useCallback(() => {
    const carousel = carouselRef.current;
    const dots = document.querySelectorAll(".section6-dot");

    if (!carousel || !dots.length) return;

    const updateDots = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.children[0] ? (carousel.children[0] as HTMLElement).offsetWidth + 16 : 0;
      const newCurrentSlide = Math.round(scrollLeft / cardWidth);
      
      // Update active dot based on current slide
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === newCurrentSlide);
      });
    };

    document.querySelectorAll(".section6-heart-icon").forEach((heart) => {
      heart.addEventListener("click", function (this: HTMLElement) {
        const icon = this.querySelector("i");
        if (icon) {
          icon.classList.toggle("far");
          icon.classList.toggle("fas");
          icon.classList.toggle("text-red-500");
        }
      });
    });

    carousel.addEventListener("scroll", updateDots);

    return () => {
      carousel.removeEventListener("scroll", updateDots);
    };
  }, []);

  useEffect(() => {
    initSection6Carousel();
  }, [initSection6Carousel]);

  return (
    <>
      <section className="section6-main py-16 md:py-20 px-4 md:px-8 lg:px-20 relative overflow-hidden">
        <header className="section3-header flex flex-col gap-4 mb-20 md:mb-24 items-center text-center">
          <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
            <div className="section3-badge-icon"></div>
            <span className="section3-badge-text">Top Picks</span>
          </div>
          <h2 className="section3-main-title">Featured Collections</h2>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <article className="flex-1 w-full">
            <div className="relative">
              <div
                ref={carouselRef}
                className="section6-carousel flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
              >
                {/* Slide 1 */}
                <div className="section6-card min-w-full md:min-w-[calc(50%-8px)] lg:min-w-[calc(50%-8px)] snap-start flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <Link href="/main" aria-label="Open Shop Now collection" className="block">
                      <div className="relative w-full h-64">
                        <Image
                          src="/images/gym-2.svg"
                          alt="Shop Now Collection"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                    <button className="section6-heart-icon absolute top-3 right-3 bg-white/90 hover:bg-white rounded-lg p-2 transition-all duration-300">
                      <i className="far fa-heart text-black"></i>
                    </button>
                  </div>
                  <div className="section6-context p-4 space-y-4">
                    <h3 className="text-lg font-bold text-black">Shop Now</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/mens-wear"
                        className="section6-button flex-1 px-4 py-2 rounded-lg text-black font-semibold flex items-center justify-center gap-2 text-xs"
                        aria-label="Shop Men"
                      >
                        <span>Shop Men</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                      <Link
                        href="/women-wear"
                        className="section6-button flex-1 px-4 py-2 rounded-lg text-black font-semibold flex items-center justify-center gap-2 text-xs"
                        aria-label="Shop Women"
                      >
                        <span>Shop Women</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="section6-card min-w-full md:min-w-[calc(50%-8px)] lg:min-w-[calc(50%-8px)] snap-start flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <Link
                      href={{ pathname: "/main", query: { category: "accessories" } }}
                      aria-label="Open Accessories collection"
                      className="block"
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src="/images/gym-3.svg"
                          alt="Accessories Collection"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                    <button className="section6-heart-icon absolute top-3 right-3 bg-white/90 hover:bg-white rounded-lg p-2 transition-all duration-300">
                      <i className="far fa-heart text-black"></i>
                    </button>
                  </div>
                  <div className="section6-context p-4 space-y-4">
                    <h3 className="text-lg font-bold text-black">Accessories On The Go</h3>
                    <div className="flex justify-center">
                      <Link
                        href={{ pathname: "/main", query: { category: "accessories" } }}
                        className="section6-button px-4 py-2 rounded-lg text-black font-semibold flex items-center gap-2 text-xs"
                        aria-label="Shop Accessories"
                      >
                        <span>Shop</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="section6-card min-w-full md:min-w-[calc(50%-8px)] lg:min-w-[calc(50%-8px)] snap-start flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <Link
                      href={{ pathname: "/main", query: { category: "premium" } }}
                      aria-label="Open Premium collection"
                      className="block"
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src="/images/gym-4.svg"
                          alt="Premium Collection"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </Link>
                    <button className="section6-heart-icon absolute top-3 right-3 bg-white/90 hover:bg-white rounded-lg p-2 transition-all duration-300">
                      <i className="far fa-heart text-black"></i>
                    </button>
                  </div>
                  <div className="section6-context p-4 space-y-4">
                    <h3 className="text-lg font-bold text-black">Premium Collection</h3>
                    <div className="flex justify-center">
                      <Link
                        href={{ pathname: "/main", query: { category: "premium" } }}
                        className="section6-button px-4 py-2 rounded-lg text-black font-semibold flex items-center gap-2 text-xs"
                        aria-label="Explore Premium collection"
                      >
                        <span>Explore</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    const cardWidth = carouselRef.current?.children[0] ? (carouselRef.current.children[0] as HTMLElement).offsetWidth + 16 : 0;
                    carouselRef.current?.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                  }}
                  className="bg-white/90 hover:bg-white rounded-lg p-2 text-gray-600 hover:text-black transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const cardWidth = carouselRef.current?.children[0] ? (carouselRef.current.children[0] as HTMLElement).offsetWidth + 16 : 0;
                      carouselRef.current?.scrollTo({ left: 0 * cardWidth, behavior: 'smooth' });
                    }}
                    className="section6-dot w-3 h-3 rounded-full bg-gray-300 active"
                    data-slide="0"
                    aria-label="Go to slide 1"
                  ></button>
                  <button
                    onClick={() => {
                      const cardWidth = carouselRef.current?.children[0] ? (carouselRef.current.children[0] as HTMLElement).offsetWidth + 16 : 0;
                      carouselRef.current?.scrollTo({ left: 1 * cardWidth, behavior: 'smooth' });
                    }}
                    className="section6-dot w-3 h-3 rounded-full bg-gray-300"
                    data-slide="1"
                    aria-label="Go to slide 2"
                  ></button>
                  <button
                    onClick={() => {
                      const cardWidth = carouselRef.current?.children[0] ? (carouselRef.current.children[0] as HTMLElement).offsetWidth + 16 : 0;
                      carouselRef.current?.scrollTo({ left: 2 * cardWidth, behavior: 'smooth' });
                    }}
                    className="section6-dot w-3 h-3 rounded-full bg-gray-300"
                    data-slide="2"
                    aria-label="Go to slide 3"
                  ></button>
                </div>

                <button
                  onClick={() => {
                    const cardWidth = carouselRef.current?.children[0] ? (carouselRef.current.children[0] as HTMLElement).offsetWidth + 16 : 0;
                    carouselRef.current?.scrollBy({ left: cardWidth, behavior: 'smooth' });
                  }}
                  className="bg-white/90 hover:bg-white rounded-lg p-2 text-gray-600 hover:text-black transition-all duration-300"
                  aria-label="Next slide"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </nav>
            </div>
          </article>

          <aside className="w-full lg:w-[550px] h-80 md:h-96 lg:h-[550px] flex-shrink-0">
            <Link href="/product-detail" aria-label="Open featured product">
              <div className="relative w-full h-full">
                <Image
                  src="/images/gym-large.svg"
                  alt="Featured Product"
                  fill
                  className="object-cover rounded-xl shadow-lg"
                  sizes="(max-width: 1024px) 100vw, 550px"
                />
              </div>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
};

export default TopPick;