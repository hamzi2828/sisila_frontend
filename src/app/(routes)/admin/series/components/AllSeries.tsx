'use client';

import { BookOpen } from 'lucide-react';
import { CollectionGrid } from '@/app/(routes)/admin/themes/components/collection/CollectionGrid';
import { type Series } from '../services/seriesAdminService';

interface AllSeriesProps {
  series: Series[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: boolean) => Promise<void>;
  onCreate: () => void;
  onRetry: () => void;
  loading: boolean;
  error: string | null;
}

export default function AllSeries({ series, onEdit, onDelete, onToggleStatus, onCreate, onRetry, loading, error }: AllSeriesProps) {
  return (
    <CollectionGrid
      items={series}
      loading={loading}
      error={error}
      onRetry={onRetry}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
      noun="series"
      nounPlural="series"
      emptyIcon={BookOpen}
      emptyDescription="Create your first series to publish a cultural or literary design capsule."
      renderExtra={(item) =>
        item.subitems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {item.subitems.slice(0, 3).map((subitem, idx) => (
              <span
                key={idx}
                className="inline-flex max-w-[10rem] items-center truncate rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
              >
                {subitem.title}
              </span>
            ))}
            {item.subitems.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-stone-50 px-2 py-0.5 text-xs text-stone-500 ring-1 ring-inset ring-stone-200">
                +{item.subitems.length - 3} more
              </span>
            )}
          </div>
        ) : null
      }
    />
  );
}
