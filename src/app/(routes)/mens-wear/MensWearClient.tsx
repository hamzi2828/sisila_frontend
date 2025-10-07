"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.css";

interface CategoryContentProps {
  title: string;
  badgeText: string;
  comingSoonText: string;
  iconClass: string;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  title,
  badgeText,
  comingSoonText,
  iconClass,
}) => (
  <section className="section3-container border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
    <div className="section3-header flex flex-col gap-4 mb-20 items-center text-center">
      <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
        <div className="section3-badge-icon"></div>
        <span className="section3-badge-text">{badgeText}</span>
      </div>
      <h2 className="section3-main-title">{title}</h2>
    </div>
    <div className="section3-cards-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <i className={`${iconClass} text-4xl text-gray-400 mb-4`} aria-hidden="true"></i>
        <p className="text-gray-600">{comingSoonText}</p>
      </div>
    </div>
  </section>
);

interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  brand: string;
  price: string;
  href?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  imageAlt,
  brand,
  price,
  href = "/product-detail",
}) => (
  <Link href={href} className="section3-card overflow-hidden">
    <div className="relative aspect-square">
      <Image
        src={`/${imageSrc}`} // ensure files are in /public/images/...
        alt={imageAlt}
        fill
        className="object-cover w-full h-full"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
      <button
        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        aria-label="Add to wishlist"
        type="button"
      >
        <i className="far fa-heart section3-heart-icon text-lg" aria-hidden="true"></i>
      </button>
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="section3-brand">{brand}</p>
          <p className="section3-price">{price}</p>
        </div>
        <button
          className="section3-plus-icon w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors"
          aria-label="Quick add"
          type="button"
        >
          <i className="fas fa-plus text-sm" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </Link>
);

const MensWear: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
  }, [searchParams]);

  const categories = [
    { id: "all", label: "All" },
    { id: "t-shirts", label: "T-Shirts" },
    { id: "leggings", label: "Leggings" },
    { id: "shorts", label: "Shorts" },
    { id: "joggers-and-pants", label: "Joggers and Pants" },
    { id: "tops", label: "Tops" },
    { id: "hoodies-and-jackets", label: "Hoodies and Jackets" },
    { id: "tights", label: "Tights" },
    { id: "accessories", label: "Accessories" },
  ];

  const productCards = [
    { imageSrc: "images/gym-5.svg", imageAlt: "Battle Box T-Shirt", brand: "Battle Box", price: "12,00$" },
    { imageSrc: "images/gym-3.svg", imageAlt: "Battle Box Jacket", brand: "Battle Box", price: "12,00$" },
    { imageSrc: "images/gym-5.svg", imageAlt: "Battle Box Shorts", brand: "Battle Box", price: "12,00$" },
    { imageSrc: "images/gym-4.svg", imageAlt: "Battle Box Tank Top", brand: "Battle Box", price: "12,00$" },
    { imageSrc: "images/gym-7.svg", imageAlt: "Battle Box Tank Top", brand: "Battle Box", price: "12,00$" },
    { imageSrc: "images/gym-6.svg", imageAlt: "Battle Box Tank Top", brand: "Battle Box", price: "12,00$" },
  ];

  const categoryHref = (id: string): string => {
    if (id === "all") return "/mens-wear";
    const params = new URLSearchParams();
    params.set("category", id);
    return `/mens-wear?${params.toString()}`;
  };

  return (
    <main className="pt-24">
      {/* Tab Header */}
      <div className="tab-header px-4 sm:px-6 lg:px-20 py-8 bg-white">
        {/* Main Tab Section */}
        <div className="tab-main-section">
          <div className="tab-men-frame">
            <div className="tab-men-text">Men&apos;s Wear</div>
          </div>
        </div>

        {/* Category Menu */}
        <div className="tab-menu">
          {categories.map((category) => (
            <Link key={category.id} href={categoryHref(category.id)} className="tab-menu-item">
              <div
                className={`tab-menu-text ${
                  activeCategory === category.id ? "tab-active-menu" : "tab-inactive-menu"
                }`}
              >
                {category.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Categories Content */}
      {activeCategory === "all" && (
        <div id="content-all" className="category-content">
          {/* Featured */}
          <section className="section3-container border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
            <div className="section3-header flex flex-col gap-4 mb-20 items-center text-center">
              <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
                <div className="section3-badge-icon"></div>
                <span className="section3-badge-text">Featured Collection</span>
              </div>
              <h2 className="section3-main-title">Latest Men&apos;s Athletic Wear Collection</h2>
            </div>

            <div className="section3-content-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Sticky */}
              <div className="section3-image-container">
                <div className="section3-sticky-image">
                  <ProductCard imageSrc="images/gym-2.svg" imageAlt="Battle Box" brand="Battle Box" price="12,00$" />
                </div>
              </div>

              {/* Grid */}
              <div className="section3-cards-container">
                <div className="section3-cards-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {productCards.map((p, i) => (
                    <ProductCard key={i} imageSrc={p.imageSrc} imageAlt={p.imageAlt} brand={p.brand} price={p.price} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Best Sellers */}
          <section className="section3-container border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
            <div className="section3-header flex flex-col gap-4 mb-20 items-center text-center">
              <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
                <div className="section3-badge-icon"></div>
                <span className="section3-badge-text">Best Sellers</span>
              </div>
              <h2 className="section3-main-title">Top Rated Men&apos;s Fitness Essentials</h2>
            </div>

            <div className="section3-cards-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {productCards.slice(0, 4).map((p, i) => (
                <ProductCard key={i} imageSrc={p.imageSrc} imageAlt={p.imageAlt} brand={p.brand} price={p.price} />
              ))}
            </div>
          </section>

          {/* New Arrivals */}
          <section className="section3-container border-b border-gray-200 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
            <div className="section3-header flex flex-col gap-4 mb-20 items-center text-center">
              <div className="section3-badge inline-flex items-center gap-2 w-fit text-center justify-center">
                <div className="section3-badge-icon"></div>
                <span className="section3-badge-text">New Arrivals</span>
              </div>
            </div>

            <div className="section3-content-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="section3-cards-container">
                <div className="section3-cards-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {productCards.map((p, i) => (
                    <ProductCard key={i} imageSrc={p.imageSrc} imageAlt={p.imageAlt} brand={p.brand} price={p.price} />
                  ))}
                  <ProductCard
                    imageSrc="images/gym-8.svg"
                    imageAlt="Battle Box Tank Top"
                    brand="Battle Box"
                    price="12,00$"
                  />
                </div>
              </div>

              <div className="section3-image-container">
                <div className="section3-sticky-image">
                  <ProductCard imageSrc="images/gym-2.svg" imageAlt="Battle Box" brand="Battle Box" price="12,00$" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* T-Shirts Content */}
      {activeCategory === "t-shirts" && (
        <div id="content-t-shirts" className="category-content">
          <CategoryContent
            title="Premium Men&apos;s T-Shirts"
            badgeText="T-Shirts Collection"
            comingSoonText="T-Shirts coming soon"
            iconClass="fas fa-tshirt"
          />
        </div>
      )}

      {/* Leggings Content */}
      {activeCategory === "leggings" && (
        <div id="content-leggings" className="category-content">
          <CategoryContent
            title="Comfortable Men&apos;s Leggings"
            badgeText="Leggings Collection"
            comingSoonText="Leggings coming soon"
            iconClass="fas fa-running"
          />
        </div>
      )}

      {/* Shorts Content */}
      {activeCategory === "shorts" && (
        <div id="content-shorts" className="category-content">
          <CategoryContent
            title="Athletic Men&apos;s Shorts"
            badgeText="Shorts Collection"
            comingSoonText="Shorts coming soon"
            iconClass="fas fa-male"
          />
        </div>
      )}

      {/* Joggers and Pants Content */}
      {activeCategory === "joggers-and-pants" && (
        <div id="content-joggers-and-pants" className="category-content">
          <CategoryContent
            title="Comfortable Joggers and Pants"
            badgeText="Joggers &amp; Pants"
            comingSoonText="Joggers and Pants coming soon"
            iconClass="fas fa-walking"
          />
        </div>
      )}

      {/* Tops Content */}
      {activeCategory === "tops" && (
        <div id="content-tops" className="category-content">
          <CategoryContent
            title="Stylish Athletic Tops"
            badgeText="Tops Collection"
            comingSoonText="Tops coming soon"
            iconClass="fas fa-vest"
          />
        </div>
      )}

      {/* Hoodies and Jackets Content */}
      {activeCategory === "hoodies-and-jackets" && (
        <div id="content-hoodies-and-jackets" className="category-content">
          <CategoryContent
            title="Warm Hoodies and Jackets"
            badgeText="Hoodies &amp; Jackets"
            comingSoonText="Hoodies and Jackets coming soon"
            iconClass="fas fa-snowflake" // FontAwesome 5 doesn't have "fa-jacket"
          />
        </div>
      )}

      {/* Tights Content */}
      {activeCategory === "tights" && (
        <div id="content-tights" className="category-content">
          <CategoryContent
            title="Performance Tights"
            badgeText="Tights Collection"
            comingSoonText="Tights coming soon"
            iconClass="fas fa-user-ninja"
          />
        </div>
      )}

      {/* Accessories Content */}
      {activeCategory === "accessories" && (
        <div id="content-accessories" className="category-content">
          <CategoryContent
            title="Essential Fitness Accessories"
            badgeText="Accessories"
            comingSoonText="Accessories coming soon"
            iconClass="fas fa-dumbbell"
          />
        </div>
      )}

      {/* Mid CTA Section */}
      <section className="mid-cta-section bg-white py-20 px-4 sm:px-6 lg:px-20">
        <div className="mx-auto">
          <div className="cta-content-wrapper flex flex-col lg:flex-row gap-16 lg:gap-16 items-start">
            <div className="cta-header flex-1">
              <h2 className="cta-main-title text-black font-bold text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight uppercase opacity-90">
                Gym Wear For Men - Men&apos;s Workout Clothes
              </h2>
            </div>
            <div className="cta-content flex-1">
              <div className="cta-text-content space-y-4">
                <p className="cta-highlight text-gray-700 font-medium text-base leading-6">
                  Premium Gym Wear For Men
                </p>
                <p className="cta-description text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MensWear;
