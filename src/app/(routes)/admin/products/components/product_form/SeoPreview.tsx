import { Globe } from 'lucide-react';

interface SeoPreviewProps {
  title: string;
  path: string;
  description: string;
}

/** How the product could look as a search result (monochrome mock of a results page). */
export function SeoPreview({ title, path, description }: SeoPreviewProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 sm:p-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-stone-500">Search result preview</p>
      <div className="min-w-0 rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-stone-500">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100">
            <Globe className="h-3.5 w-3.5 text-stone-500" aria-hidden />
          </span>
          <span className="truncate">{path}</span>
        </div>
        <p className="mt-1.5 truncate text-base font-medium leading-snug text-stone-900">
          {title || 'Your product title will appear here'}
        </p>
        <p className="mt-1 line-clamp-2 break-words text-sm leading-relaxed text-stone-600">
          {description || 'Add a meta description to control the text shown under the title in search results.'}
        </p>
      </div>
    </div>
  );
}
