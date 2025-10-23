"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { popularCategoriesService, PopularCategory } from "../services/popularCategoriesService";

const ExploreCategories: React.FC = () => {
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await popularCategoriesService.getPopularCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    updateArrows();
    if (!el) return;
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateArrows]);

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 237) + 24; // card width + 24px gap
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onKeyArrows = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && canPrev) scrollByStep(-1);
    if (e.key === "ArrowRight" && canNext) scrollByStep(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full px-6 md:px-10 lg:px-20 py-20">
        <div className="mx-auto space-y-12">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Style Collections
            </p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              explore categories
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-300 border-t-stone-800"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full px-6 md:px-10 lg:px-20 py-20">
        <div className="mx-auto space-y-12">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Style Collections
            </p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              explore categories
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <p className="text-stone-600 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 md:px-10 lg:px-20 py-20" onKeyDown={onKeyArrows}>
      <div className="mx-auto space-y-12">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-stone-500">
              Style Collections
            </p>
            <h2
              className="mt-2 text-2xl md:text-3xl font-semibold uppercase"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              explore categories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => scrollByStep(-1)}
              className="rounded p-2 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => scrollByStep(1)}
              className="rounded p-2 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95"
            >
              <i className="fa-solid fa-chevron-right text-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Cards scroller */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x"
          role="region"
          aria-label="Category scroller"
        >
          {categories.map((category) => {
            const categoryImage = popularCategoriesService.getCategoryImage(category);
            const categoryHref = `/categories/${category.slug}`;

            return (
              <Link
                href={categoryHref}
                key={category._id}
                data-card
                className="group relative h-[200px] w-[237px] shrink-0 snap-start overflow-hidden rounded-[20px]"
              >
                <img
                  src={categoryImage}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center p-4">
                  <span
                    className="text-white text-base font-semibold text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ExploreCategories;