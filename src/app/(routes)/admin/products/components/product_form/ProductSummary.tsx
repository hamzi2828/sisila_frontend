import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { StatusBadge } from '@/components/admin/ui';

interface ProductSummaryProps {
  name: string;
  category?: string;
  status: string;
  thumbnail?: string;
  price: ReactNode;
  stock: number;
  /** Only for variant products. */
  variantCount?: number;
  imageCount: number;
  collection?: string;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-stone-900">{children}</dd>
    </div>
  );
}

/** Live at-a-glance card in the side column. */
export function ProductSummary({ name, category, status, thumbnail, price, stock, variantCount, imageCount, collection }: ProductSummaryProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill unoptimized sizes="64px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-stone-400">
              <ImageIcon className="h-5 w-5" aria-hidden />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">{name.trim() || 'Untitled product'}</p>
          <p className="truncate text-xs text-stone-500">{category || 'No category yet'}</p>
          <StatusBadge status={status} size="sm" className="mt-1.5" />
        </div>
      </div>

      <dl className="mt-4 divide-y divide-stone-100 border-t border-stone-100 text-sm">
        <Row label="Price">{price}</Row>
        <Row label="Stock">
          <span className={stock > 0 ? undefined : 'text-red-600'}>{stock > 0 ? `${stock} units` : 'None'}</span>
        </Row>
        {typeof variantCount === 'number' && <Row label="Variants">{variantCount}</Row>}
        <Row label="Images">{imageCount}</Row>
        {collection && <Row label="Collection">{collection}</Row>}
      </dl>
    </div>
  );
}
