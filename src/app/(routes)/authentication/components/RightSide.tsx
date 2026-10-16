import React from "react";
import Image from "next/image";

const PERKS = [
  "Early access to new drops",
  "Member-only offers",
  "Order tracking in one place",
  "Save your wishlist across devices",
];

const STATS = [
  { v: "4", k: "Themes" },
  { v: "5", k: "Categories" },
  { v: "4", k: "Series" },
];

export const RightSide: React.FC = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-900 to-stone-800"></div>

      {/* Subtle dot texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] text-white"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      ></div>

      {/* Soft shapes */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-stone-500/10 blur-2xl"></div>
        <div className="absolute bottom-24 right-16 w-56 h-56 rounded-full bg-stone-300/10 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-white p-12">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Image
                src="/images/silsila-logo.png"
                alt="Silsila"
                width={64}
                height={64}
                className="h-14 w-14 object-contain brightness-0 invert"
              />
            </div>
          </div>

          <p className="uppercase tracking-[0.22em] text-xs text-white/60">Silsila</p>
          <h2
            className="mt-2 text-4xl xl:text-5xl font-semibold uppercase mb-6 text-white leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Join the
            <span className="block text-stone-300">Silsila circle</span>
          </h2>

          <p className="text-lg text-stone-300 mb-10 leading-relaxed">
            A casual clothing line woven with cultural roots, values, and emotions — creativity that uplifts your vibe, aura, and style.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4">
                <div className="text-3xl font-semibold text-white mb-1">{s.v}</div>
                <div className="text-xs font-medium text-stone-400 uppercase tracking-[0.18em]">{s.k}</div>
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="mt-10 space-y-3">
            {PERKS.map((f) => (
              <div key={f} className="flex items-center justify-center space-x-3 text-stone-300">
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15"></div>
    </div>
  );
};

export default RightSide;
