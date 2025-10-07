"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const ExploreCategories: React.FC = () => {
  // All data here
  const categories = [
    { title: "Songs of the Desert", image: '/images/image.png', href: "categories" },
    { title: "Color of the sky", image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1000&q=80', href: "categories" },
    { title: "Songs of the Desert", image: "https://placehold.co/237x200",  href: "categories" },
    { title: "Softboy season", image: '/images/image.png',  href: "categories" },
    { title: "New Arrivals", image: "https://placehold.co/237x200",  href: "categories" },
    { title: "New Arrivals", image: '/images/image.png',  href: "categories" },
    { title: "New Arrivals", image: "https://placehold.co/237x200", href: "categories" },
    { title: "New Arrivals", image: '/images/image.png',  href: "categories" },
  ];

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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

  return (
    <section className="w-full px-6 md:px-10 lg:px-20 py-20" onKeyDown={onKeyArrows}>
      <div className="mx-auto  space-y-12">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2
            className="text-black/90 text-[32px] leading-[48px] font-semibold uppercase"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            explore categories
          </h2>

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
          {categories.map((c, idx) => (
            <Link
              href={c.href || "categories"}
              key={`${c.title}-${idx}`}
              data-card
              className="group relative h-[200px] w-[237px] shrink-0 snap-start overflow-hidden rounded-[20px]"
            >
              <img
                src={c.image}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center p-4">
                <span
                  className="text-white text-[20px] leading-[30px] font-bold text-center"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {c.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ExploreCategories;