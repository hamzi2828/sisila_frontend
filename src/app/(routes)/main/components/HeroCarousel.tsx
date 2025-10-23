"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { heroService, HeroSlide } from "../services/heroService";

export type CTA = { label: string; href: string };

export type Slide = {
  eyebrow?: string;
  title?: string;
  description?: string;
  menCta?: CTA;
  womenCta?: CTA;
  backgroundImage?: string;
  darkOverlay?: boolean;
};

export type HeroCarouselProps = {
  slides?: Slide[];
  intervalMs?: number;
  autoPlay?: boolean;
  pauseOnHover?: boolean;
  showArrows?: boolean; // shows on lg when hovering hero
  showDots?: boolean;
  className?: string;
};

// Helper function to convert HeroSlide from API to Slide format
const mapHeroSlideToSlide = (heroSlide: HeroSlide): Slide => {
  // Handle image URL - prepend backend URL if it's a relative path
  const imageUrl = heroSlide.imageUrl.startsWith('http')
    ? heroSlide.imageUrl
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${heroSlide.imageUrl}`;

  return {
    eyebrow: "Silsila",
    title: heroSlide.title,
    description: heroSlide.description,
    menCta: heroSlide.buttonText && heroSlide.buttonLink
      ? { label: heroSlide.buttonText, href: heroSlide.buttonLink }
      : undefined,
    womenCta: heroSlide.secondButtonText && heroSlide.secondButtonLink
      ? { label: heroSlide.secondButtonText, href: heroSlide.secondButtonLink }
      : undefined,
    backgroundImage: imageUrl,
    darkOverlay: true,
  };
};

const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  intervalMs = 6000,
  autoPlay = true,
  pauseOnHover = true,
  showArrows = true,
  showDots = true,
  className = "",
}) => {
  const [dynamicSlides, setDynamicSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch slides from API on mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const heroSlides = await heroService.getActiveSlides();

        if (heroSlides && heroSlides.length > 0) {
          const mappedSlides = heroSlides.map(mapHeroSlideToSlide);
          setDynamicSlides(mappedSlides);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        setError('Failed to load hero slides');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Use provided slides or fetched dynamic slides
  const slidesToUse = slides && slides.length > 0 ? slides : dynamicSlides;
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const total = slidesToUse.length;

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    if ((pauseOnHover && isHover) || isTouching) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, total, isHover, pauseOnHover, isTouching]);

  // Show loading state while fetching
  if (isLoading) {
    return (
      <section className={`relative w-full isolate ${className}`}>
        <div className="flex min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] w-full items-center justify-center bg-gradient-to-b from-stone-900 to-black">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="text-white/70 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Loading slides...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if fetching failed
  if (error) {
    return (
      <section className={`relative w-full isolate ${className}`}>
        <div className="flex min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] w-full items-center justify-center bg-gradient-to-b from-stone-900 to-black">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-white/90 text-base font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>{error}</p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no slides available
  if (total === 0) {
    return (
      <section className={`relative w-full isolate ${className}`}>
        <div className="flex min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] w-full items-center justify-center bg-gradient-to-b from-stone-900 to-black">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/70 text-base" style={{ fontFamily: "Poppins, sans-serif" }}>No hero slides available</p>
          </div>
        </div>
      </section>
    );
  }

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const goTo = (i: number) => setIndex(i);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };
  const onTouchEnd = () => {
    const threshold = 60;
    if (Math.abs(touchDeltaX) > threshold) {
      if (touchDeltaX < 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
    setIsTouching(false);
  };

  const bg = (src?: string, overlay = true): React.CSSProperties =>
    !src
      ? { background: "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)" }
      : overlay
      ? {
          backgroundImage: `
            linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.52) 58%, rgba(0,0,0,0.75) 100%),
            url('${src}')
          `,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }
      : {
          backgroundImage: `url('${src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };

  return (
    <section
      className={`relative w-full isolate select-none group ${className}`}
      aria-roledescription="carousel"
      aria-label="Hero carousel"
      onMouseEnter={() => pauseOnHover && setIsHover(true)}
      onMouseLeave={() => pauseOnHover && setIsHover(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] w-full overflow-hidden">
        {slidesToUse.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={i}
              className={[
                "row-start-1 col-start-1 w-full transition-opacity duration-[700ms] ease-out",
                active ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
              style={bg(s.backgroundImage, s.darkOverlay !== false)}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={!active}
            >
              <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
                <div
                  className="flex w-full max-w-3xl flex-col items-center text-center gap-5 sm:gap-6 lg:gap-8 transition-transform duration-300"
                  style={{ transform: active ? `translateX(${touchDeltaX * 0.08}px)` : undefined }}
                >
                  <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/90">
                    Silsila
                  </span>

                  {s.eyebrow ? (
                    <p className="text-white/85 text-sm sm:text-base tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {s.eyebrow}
                    </p>
                  ) : null}

                  {s.title ? (
                    <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.15]" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {s.title}
                    </h1>
                  ) : null}

                  {s.description ? (
                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-prose" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {s.description}
                    </p>
                  ) : null}

                  {(s.menCta || s.womenCta) && (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                      {s.menCta ? (
                        <Link href={s.menCta.href} className="inline-flex justify-center rounded-full px-6 py-3 bg-white text-stone-900 text-sm font-semibold hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {s.menCta.label}
                        </Link>
                      ) : null}
                      {s.womenCta ? (
                        <Link href={s.womenCta.href} className="inline-flex justify-center rounded-full px-6 py-3 bg-white/10 ring-1 ring-white/80 ring-inset backdrop-blur-md text-white text-sm font-semibold hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {s.womenCta.label}
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showDots && total > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {slidesToUse.map((_, i) => (
              <button
                key={`dot-${i}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={["h-2.5 rounded-full transition", i === index ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"].join(" ")}
              />
            ))}
          </div>
        </div>
      )}

      {showArrows && total > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className={[
              "hidden lg:flex items-center justify-center",
              "lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200",
              "lg:pointer-events-none lg:group-hover:pointer-events-auto",
              "absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2",
            ].join(" ")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className={[
              "hidden lg:flex items-center justify-center",
              "lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200",
              "lg:pointer-events-none lg:group-hover:pointer-events-auto",
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/70 backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2",
            ].join(" ")}
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