"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export type CTA = { label: string; href: string };

export type Slide = {
  eyebrow?: string;
  title?: string;
  description?: string;
  menCta?: CTA;
  womenCta?: CTA;
  backgroundImage?: string; // e.g., "/images/image.png" in public/images
  darkOverlay?: boolean;    // true => add gradient overlay for contrast
};

export type HeroCarouselProps = {
  slides?: Slide[];         // optional; uses defaults if omitted
  intervalMs?: number;      // autoplay interval
  autoPlay?: boolean;       // enable/disable autoplay
  pauseOnHover?: boolean;   // pause when mouse hovers
  showArrows?: boolean;     // optional arrows
  className?: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    eyebrow: "September Capsule",
    title: "Songs of the Desert",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor...",
    menCta: { label: "Shop Men", href: "/category?g=men" },
    womenCta: { label: "Shop Women", href: "/category?g=women" },
    backgroundImage: "/images/image.png",
    darkOverlay: true,
  },
  {
    eyebrow: "Core Drop",
    title: "Timeless Essentials",
    description: "Built to last. Elevated basics for everyday wear.",
    menCta: { label: "Explore Core", href: "/series?name=core" },
    backgroundImage: "/images/image.png",
    darkOverlay: true,
  },
  {
    eyebrow: "Seasonal Edit",
    title: "Resortwear 2025",
    description: "Light, breathable, and ready for sun-drenched days.",
    womenCta: { label: "Shop Resort", href: "/category?c=resortwear" },
    backgroundImage: "/images/image.png",
    darkOverlay: true,
  },
];

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  intervalMs = 6000,
  autoPlay = true,
  pauseOnHover = true,
  showArrows = false,
  className = "",
}) => {
  const slidesToUse = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const total = slidesToUse.length;

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    if (pauseOnHover && isHover) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, total, isHover, pauseOnHover]);

  if (total === 0) return null;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  // Layered overlay for better readability
  const buildBg = (bg?: string, enableOverlay = true): React.CSSProperties => {
    if (!bg) {
      return {
        background:
          "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)",
      };
    }

    if (!enableOverlay) {
      return {
        backgroundImage: `url('${bg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    return {
      backgroundImage: `
        linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.70) 100%),
        radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 60%),
        url('${bg}')
      `,
      backgroundSize: "cover, cover, cover",
      backgroundPosition: "center, center, center",
      backgroundRepeat: "no-repeat, no-repeat, no-repeat",
    };
  };

  return (
    <section
      className={`relative w-full isolate ${className}`}
      aria-roledescription="carousel"
      aria-label="Hero carousel"
      onMouseEnter={() => pauseOnHover && setIsHover(true)}
      onMouseLeave={() => pauseOnHover && setIsHover(false)}
    >
      {/* Slides stacked in a single grid cell for fade transitions */}
      <div className="grid min-h-[80vh] sm:min-h-[85vh] lg:min-h-screen w-full overflow-hidden">
        {slidesToUse.map((s, i) => {
          const isActive = i === index;

          return (
            <div
              key={i}
              className={[
                "row-start-1 col-start-1 w-full",
                "transition-opacity duration-800 ease-out",
                isActive ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
              style={buildBg(s.backgroundImage, s.darkOverlay !== false)}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={!isActive}
            >
              {/* Center content on all devices */}
              <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
                <div className="flex w-full max-w-3xl flex-col items-center text-center gap-5 sm:gap-6 lg:gap-8">
                  {s.eyebrow && (
                    <p
                      className="text-white/85 text-sm sm:text-base tracking-wide"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: "22px" }}
                    >
                      {s.eyebrow}
                    </p>
                  )}

                  {s.title && (
                    <h1
                      className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.15]"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {s.title}
                    </h1>
                  )}

                  {s.description && (
                    <p
                      className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-prose"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {s.description}
                    </p>
                  )}

                  {(s.menCta || s.womenCta) && (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                      {s.menCta && (
                        <Link
                          href={s.menCta.href}
                          className="inline-flex justify-center rounded-lg px-6 py-3 bg-white/10 ring-1 ring-white/80 ring-inset backdrop-blur-md text-white text-sm font-semibold leading-5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {s.menCta.label}
                        </Link>
                      )}
                      {s.womenCta && (
                        <Link
                          href={s.womenCta.href}
                          className="inline-flex justify-center rounded-lg px-6 py-3 bg-white/10 ring-1 ring-white/80 ring-inset backdrop-blur-md text-white text-sm font-semibold leading-5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {s.womenCta.label}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional arrows (off by default) */}
      {showArrows && total > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/15 focus:outline-none focus-visible:ring-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/15 focus:outline-none focus-visible:ring-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;