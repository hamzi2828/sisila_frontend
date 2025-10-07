"use client";
import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const TheBest: React.FC = () => {
  const [wishlistStates, setWishlistStates] = useState<{ [key: number]: boolean }>({});
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const products = [
    { id: 1, image: "images/gym-6.svg", alt: "Black Tank Top" },
    { id: 2, image: "images/gym-2.svg", alt: "Black Hoodie" },
    { id: 3, image: "images/gym-3.svg", alt: "Black Sweatshirt" },
    { id: 4, image: "images/gym-4.svg", alt: "Black Shorts" },
    { id: 5, image: "images/gym-5.svg", alt: "Black Tank Top" },
    { id: 6, image: "images/gym-3.svg", alt: "Black Hoodie" },
  ];

  const handleWishlistClick = useCallback((productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlistStates((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    const isWishlisted = !wishlistStates[productId];
    console.log(isWishlisted ? "Added to wishlist" : "Removed from wishlist");
  }, [wishlistStates]);

  const handleAddToCart = useCallback((productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`Added to cart: ${productName}`);

    const target = e.currentTarget as HTMLElement;
    target.style.transform = "scale(1.2)";
    setTimeout(() => (target.style.transform = ""), 200);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    if (cardsContainerRef.current) {
      const scrollAmount = 320; // Card width + gap
      const currentScroll = cardsContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      cardsContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section
      id="section4-in-the-best"
      className="border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto">
        {/* Header with Navigation */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4 mb-12 sm:mb-16">
          <div className="flex-1">
            <h2 className="section4-font-montserrat text-2xl sm:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tight opacity-92 leading-tight">
              In The Best
            </h2>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-5" aria-label="Product carousel navigation">
            <button
              onClick={() => scroll("left")}
              className="section4-nav-btn w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Previous products"
            >
              <i className="fas fa-chevron-left text-gray-700 text-sm sm:text-base"></i>
            </button>
            <button
              onClick={() => scroll("right")}
              className="section4-nav-btn w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Next products"
            >
              <i className="fas fa-chevron-right text-gray-700 text-sm sm:text-base"></i>
            </button>
          </nav>
        </header>

        {/* Cards Container */}
        <div className="relative overflow-hidden">
          <div
            ref={cardsContainerRef}
            className="section4-cards-container flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="section4-product-card flex-shrink-0 w-72 sm:w-80 lg:w-[290px] rounded-xl overflow-hidden group relative"
                style={{ scrollSnapAlign: "start" }}
              >
                <article className="h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-80 sm:h-96 bg-gray-100">
                    <Link
                      href="/product-detail"
                      aria-label={`${product.alt} - view details`}
                      className="block h-full"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={`/${product.image}`}
                          alt={product.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={product.id <= 3} // Load first 3 images with priority
                        />
                      </div>
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistClick(product.id, e)}
                      className="section4-wishlist-btn absolute top-4 right-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400"
                      aria-label="Add to wishlist"
                    >
                      <i
                        className={`${wishlistStates[product.id] ? "fas" : "far"} fa-heart text-lg`}
                        style={{
                          color: wishlistStates[product.id] ? "#ef4444" : "#6b7280",
                        }}
                      ></i>
                    </button>
                  </div>

                  {/* Brand Tag with Add Button */}
                  <div className="relative">
                    <div className="section4-brand-container px-4 py-3 flex items-center justify-between">
                      <Link
                        href="/product-detail"
                        className="section4-brand-tag text-black text-sm font-bold uppercase tracking-wide"
                        aria-label={`${product.alt} - open product`}
                      >
                        Battle Box
                      </Link>
                      <button
                        onClick={(e) => handleAddToCart(product.alt, e)}
                        className="section4-add-btn w-8 h-8 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black group-hover:scale-110"
                        aria-label="Add to cart"
                      >
                        <i className="fas fa-plus text-white text-sm"></i>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheBest;