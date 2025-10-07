"use client";
import React, { useState } from "react";
import Link from "next/link";

const slides = [
  {
    heading: "Discover Premium Fashion",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    bgImage: "/images/hero.svg",
    ariaLabel: "Premium fashion background",
  },
  {
    heading: "Latest Summer Collection",
    description:
      "Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
    bgImage: "/images/hero.svg",
    ariaLabel: "Summer collection background",
  },
  {
    heading: "Exclusive Designer Wear",
    description:
      "Cras dapibus vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.",
    bgImage: "/images/hero.svg",
    ariaLabel: "Designer wear background",
  },
];

const AUTO_INTERVAL = 4000;
const HeroCarousel: React.FC = () => {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [autoPlay, active]);

  const pauseAndMove = (moveFn: () => void) => {
    setAutoPlay(false);
    moveFn();
    setTimeout(() => setAutoPlay(true), AUTO_INTERVAL);
  };

  const handlePrev = () =>
    pauseAndMove(() =>
      setActive((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    );
  const handleNext = () =>
    pauseAndMove(() =>
      setActive((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    );
  const goTo = (idx: number) => pauseAndMove(() => setActive(idx));

  return (
    <section
      id="hero"
      className="hero-section relative overflow-hidden"
      role="banner"
      aria-label="Fashion showcase carousel"
    >
      <div className="hero-carousel relative" id="hero-carousel">
        {slides.map((slide, idx) => (
          <article
            key={idx}
            className={`hero-slide${active === idx ? " active" : ""}`}
            role="tabpanel"
            aria-label={`Slide ${idx + 1} of ${slides.length}`}
            id={`slide-${idx + 1}`}
            style={{ display: active === idx ? "block" : "none" }}
          >
            <div
              className="hero-background-image"
              style={{ backgroundImage: `url('${slide.bgImage}')` }}
              role="img"
              aria-label={slide.ariaLabel}
            >
              <div className="hero-overlay" aria-hidden="true"></div>
              <div className="hero-content">
                <div className="hero-text-content">
                  <header className="hero-header-lines">
                    <h1 className="hero-heading">{slide.heading}</h1>
                    <p className="hero-description">{slide.description}</p>
                  </header>
                  <nav className="hero-buttons" aria-label="Shop categories">
                    <Link
                      href="/mens-wear"
                      className="hero-cta-button"
                      role="button"
                      aria-label="Shop men's collection"
                    >
                      <span className="hero-cta-text">Shop Men</span>
                      <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                    <Link
                      href="/women-wear"
                      className="hero-cta-button"
                      role="button"
                      aria-label="Shop women's collection"
                    >
                      <span className="hero-cta-text">Shop Women</span>
                      <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <nav
        className="hero-navigation"
        role="tablist"
        aria-label="Carousel navigation"
      >
        <button
          className="hero-nav-btn hero-prev-btn"
          aria-label="Previous slide"
          aria-controls="hero-carousel"
          type="button"
          onClick={handlePrev}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14.9998 19.92L8.47984 13.4C7.70984 12.63 7.70984 11.37 8.47984 10.6L14.9998 4.08002"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="hero-indicators" role="tablist" aria-label="Slide indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-indicator${active === idx ? " active" : ""}`}
              data-slide={idx}
              role="tab"
              aria-selected={active === idx}
              aria-controls={`slide-${idx + 1}`}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
              onClick={() => goTo(idx)}
            ></button>
          ))}
        </div>
        <button
          className="hero-nav-btn hero-next-btn"
          aria-label="Next slide"
          aria-controls="hero-carousel"
          type="button"
          onClick={handleNext}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8.91156 20.67C8.72156 20.67 8.53156 20.6 8.38156 20.45C8.09156 20.16 8.09156 19.68 8.38156 19.39L14.9016 12.87C15.3816 12.39 15.3816 11.61 14.9016 11.13L8.38156 4.61002C8.09156 4.32002 8.09156 3.84002 8.38156 3.55002C8.67156 3.26002 9.15156 3.26002 9.44156 3.55002L15.9616 10.07C16.4716 10.58 16.7616 11.27 16.7616 12C16.7616 12.73 16.4816 13.42 15.9616 13.93L9.44156 20.45C9.29156 20.59 9.10156 20.67 8.91156 20.67Z"
              fill="white"
            />
          </svg>
        </button>
      </nav>
    </section>
  );
};

export default HeroCarousel;