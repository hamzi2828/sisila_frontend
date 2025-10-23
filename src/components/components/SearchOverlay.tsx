'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { trendingSearches } from './headerData';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
};

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (val?: string) => {
    const q = (val ?? query).trim();
    if (!q) return;
    onSubmit(q);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-start bg-black/40 p-4 backdrop-blur-sm sm:place-items-center">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <SearchIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            type="text"
            placeholder="Search products, stories, collections..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            className="rounded p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 active:scale-95 group"
            aria-label="Close search"
            onClick={onClose}
          >
            <X className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Trending</p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((t) => (
              <button
                key={t}
                onClick={() => handleSubmit(t)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-100"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
