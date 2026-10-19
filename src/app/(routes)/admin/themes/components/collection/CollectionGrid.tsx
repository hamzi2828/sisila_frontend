'use client';

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { Images, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  IconButton,
  LoadingState,
  Pagination,
  SearchInput,
  Select,
  StatusBadge,
  Switch,
} from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { ImageThumb } from './ImageThumb';
import type { GalleryItem } from './GalleryEditor';

/** Shape shared by Theme and Series documents. */
export interface CollectionItem {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  accent?: string;
  gallery: GalleryItem[];
  isActive: boolean;
  order: number;
}

type StatusFilter = 'all' | 'active' | 'inactive';

interface CollectionGridProps<T extends CollectionItem> {
  items: T[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: boolean) => Promise<void>;
  /** "theme" / "series" */
  noun: string;
  /** "themes" / "series" */
  nounPlural: string;
  emptyIcon?: ComponentType<{ className?: string }>;
  emptyDescription?: string;
  /** Extra block rendered in the card body (e.g. series subitems). */
  renderExtra?: (item: T) => ReactNode;
  pageSize?: number;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Card grid for editorial collections: search + status filter, image cards, pagination. */
export function CollectionGrid<T extends CollectionItem>({
  items,
  loading,
  error,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
  noun,
  nounPlural,
  emptyIcon,
  emptyDescription,
  renderExtra,
  pageSize = 12,
}: CollectionGridProps<T>) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...items]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .filter((item) => {
        if (status === 'active' && !item.isActive) return false;
        if (status === 'inactive' && item.isActive) return false;
        if (!q) return true;
        return [item.title, item.tagline, item.id, item.description].some((v) => v?.toLowerCase().includes(q));
      });
  }, [items, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const handleToggle = async (item: T) => {
    setToggling((prev) => new Set(prev).add(item._id));
    try {
      await onToggleStatus(item._id, !item.isActive);
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }
  };

  if (loading) {
    return <LoadingState card label={`Loading ${nounPlural}...`} />;
  }

  if (error) {
    return (
      <Alert tone="error" title={`Couldn't load ${nounPlural}`} onRetry={onRetry}>
        {error}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        card
        icon={emptyIcon}
        title={`No ${nounPlural} yet`}
        description={emptyDescription ?? `Create your first ${noun} to get started.`}
        action={
          <Button onClick={onCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Create {capitalize(noun)}
          </Button>
        }
      />
    );
  }

  const hasFilters = search.trim() !== '' || status !== 'all';

  return (
    <Card padding="none">
      <div className="flex flex-col gap-2 border-b border-stone-200 p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search ${nounPlural} by title, tagline or ID...`}
          wrapperClassName="sm:max-w-md"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Filter by status"
          className="py-2 sm:w-44 sm:py-2.5"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <p className="text-xs text-stone-500 sm:ml-auto">
          {filtered.length} of {items.length} {items.length === 1 ? noun : nounPlural}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No ${nounPlural} match your filters`}
          description="Try a different search term or status."
          action={
            hasFilters ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                }}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:grid-cols-3">
          {visible.map((item) => {
            const isToggling = toggling.has(item._id);
            const thumbs = item.gallery.slice(0, 5);
            const extraThumbs = item.gallery.length - thumbs.length;
            return (
              <article
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-200 hover:border-stone-300 hover:shadow-md"
              >
                <div className="relative aspect-[16/9] bg-stone-100">
                  <ImageThumb src={item.cover} alt={item.title} className="h-full w-full" showLabel />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-2 top-2 flex items-center gap-1.5">
                    <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
                      #{item.order}
                    </span>
                  </div>
                  <div className="absolute right-2 top-2">
                    <StatusBadge status={item.isActive ? 'active' : 'inactive'} size="sm" className="shadow-sm" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <h3 className="truncate text-base font-semibold text-white sm:text-lg">{item.title}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/85 sm:text-sm">{item.tagline}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
                  <p className="line-clamp-2 text-sm text-stone-600">{item.description}</p>

                  {renderExtra?.(item)}

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex -space-x-2">
                      {thumbs.map((img, i) => (
                        <ImageThumb
                          key={img._id || i}
                          src={img.image}
                          alt={img.title}
                          className="h-8 w-8 rounded-md border-2 border-white bg-stone-100 shadow-sm"
                        />
                      ))}
                      {extraThumbs > 0 && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-white bg-stone-100 text-[11px] font-semibold text-stone-600 shadow-sm">
                          +{extraThumbs}
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 items-center gap-3 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Images className="h-3.5 w-3.5" aria-hidden />
                        {item.gallery.length}
                      </span>
                      <span className="truncate rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[11px] text-stone-600" title={`ID: ${item.id}`}>
                        {item.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-stone-200 bg-stone-50/60 px-3 py-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isActive}
                      onChange={() => handleToggle(item)}
                      disabled={isToggling}
                      className={cn(isToggling && 'opacity-60')}
                    />
                    <span className="text-xs font-medium text-stone-600">
                      {isToggling ? 'Updating...' : item.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton label={`Edit ${noun}`} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(item._id)} />
                    <IconButton label={`Delete ${noun}`} tone="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(item._id)} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="border-t border-stone-200 px-3 py-3 sm:px-4">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={pageSize}
            itemLabel={nounPlural}
          />
        </div>
      )}
    </Card>
  );
}
