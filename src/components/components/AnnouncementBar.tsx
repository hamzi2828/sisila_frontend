'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, X } from 'lucide-react';

type AnnouncementBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-100 via-rose-100 to-teal-100 text-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
        <span className="inline-flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Mid-season sale up to 40% off
        </span>
        <Link href="/shop" className="rounded-full bg-black px-3 py-1 text-white hover:bg-gray-900">
          Shop now
        </Link>
      </div>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-gray-600 hover:bg-white/60 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
        aria-label="Dismiss announcement"
        onClick={onClose}
      >
        <X className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
