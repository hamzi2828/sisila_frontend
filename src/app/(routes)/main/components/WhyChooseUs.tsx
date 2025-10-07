"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.css";

const WhyChooseUs: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const products = [
    { id: 1, name: "Battle Box T-Shirt", image: "images/gym-5.svg", brand: "Battle Box", price: "12,00$" },
    { id: 2, name: "Battle Box Jacket", image: "images/gym-3.svg", brand: "Battle Box", price: "12,00$" },
    { id: 3, name: "Battle Box Shorts", image: "images/gym-5.svg", brand: "Battle Box", price: "12,00$" },
    { id: 4, name: "Battle Box Tank Top", image: "images/gym-4.svg", brand: "Battle Box", price: "12,00$" },
    { id: 5, name: "Battle Box Hoodie", image: "images/gym-3.svg", brand: "Battle Box", price: "12,00$" },
    { id: 6, name: "Battle Box Leggings", image: "images/gym-2.svg", brand: "Battle Box", price: "12,00$" },
  ];

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const handleAddToCart = useCallback((productId: number) => {
    console.log(`Added product ${productId} to cart`);
    // Add your cart logic here
  }, []);

  const handleProductClick = useCallback((productId: number) => {
    // Optional: analytics before navigating
    console.log(`Clicked on product ${productId}`);
  }, []);

  return (
    <>
      <section className="section3-container border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="section3-header flex flex-col gap-4 mb-20 items-center text-center">
          <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
            <div className="section3-badge-icon"></div>
            <span className="section3-badge-text">Why Choose Us</span>
          </div>
          <h2 className="section3-main-title">
            Premium Quality Gymwear for Every Athlete
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="section3-content-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Sticky Image */}
          <div className="section3-image-container">
            <div className="section3-sticky-image">
              <div className="relative w-full h-96 lg:h-[500px] rounded-xl shadow-lg">
                <Image
                  src="/images/gym-large.svg"
                  alt="Fitness Equipment"
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Side - Product Cards */}
          <div className="section3-cards-container">
            <div className="section3-cards-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href="/product-detail"
                  className="section3-card overflow-hidden"
                  onClick={() => handleProductClick(product.id)}
                  aria-label={`${product.name} - view details`}
                >
                  <div className="relative">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={`/${product.image}`}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <button
                      className="absolute top-3 right-3 p-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent Link navigation
                        toggleFavorite(product.id);
                      }}
                      aria-label={favorites.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <i
                        className={`${
                          favorites.includes(product.id) ? "fas" : "far"
                        } fa-heart section3-heart-icon text-lg`}
                      ></i>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="section3-brand">{product.brand}</p>
                        <p className="section3-price">{product.price}</p>
                      </div>
                      <button
                        className="section3-plus-icon w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent Link navigation
                          handleAddToCart(product.id);
                        }}
                        aria-label="Add to cart"
                      >
                        <i className="fas fa-plus text-sm"></i>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;