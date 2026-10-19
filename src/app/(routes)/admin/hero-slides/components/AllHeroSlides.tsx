"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
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
  Switch,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/productMedia";
import { HeroSlide } from "../services/heroAdminService";

interface AllHeroSlidesProps {
  slides: HeroSlide[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: boolean) => Promise<void>;
  onCreate?: () => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

const SLIDES_PER_PAGE = 12;

export default function AllHeroSlides({ slides, onEdit, onDelete, onToggleStatus, onCreate, onRetry, loading = false, error = null }: AllHeroSlidesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingStatus, setTogglingStatus] = useState<Set<string>>(new Set());

  const filteredSlides = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return slides.filter((slide) => {
      const matchesSearch = slide.title.toLowerCase().includes(q) ||
                           slide.description.toLowerCase().includes(q) ||
                           slide.buttonText?.toLowerCase().includes(q) ||
                           slide.secondButtonText?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" ||
                           (statusFilter === "active" && slide.isActive) ||
                           (statusFilter === "inactive" && !slide.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [slides, searchQuery, statusFilter]);

  // Carousel order: lowest "order" first
  const sortedSlides = useMemo(() => {
    return [...filteredSlides].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return (a.createdAt || "").localeCompare(b.createdAt || "");
    });
  }, [filteredSlides]);

  const totalPages = Math.ceil(sortedSlides.length / SLIDES_PER_PAGE) || 1;
  const page = Math.min(currentPage, totalPages);
  const indexOfLast = page * SLIDES_PER_PAGE;
  const indexOfFirst = indexOfLast - SLIDES_PER_PAGE;
  const currentSlides = sortedSlides.slice(indexOfFirst, indexOfLast);
  const hasFilters = Boolean(searchQuery) || statusFilter !== "all";

  const handleToggleStatus = async (slideId: string, currentStatus: boolean) => {
    if (!onToggleStatus) return;

    const newStatus = !currentStatus;
    setTogglingStatus(prev => new Set([...prev, slideId]));

    try {
      await onToggleStatus(slideId, newStatus);
    } catch (error) {
      console.error('Failed to toggle slide status:', error);
    } finally {
      setTogglingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideId);
        return newSet;
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingState card label="Loading hero slides..." />;
  }

  if (error) {
    return (
      <Alert tone="error" title="Error loading hero slides" onRetry={onRetry}>
        {error}
      </Alert>
    );
  }

  if (slides.length === 0) {
    return (
      <EmptyState
        card
        icon={ImageIcon}
        title="No hero slides yet"
        description="Get started by creating your first hero slide."
        action={
          onCreate && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onCreate}>
              Create Hero Slide
            </Button>
          )
        }
      />
    );
  }

  return (
    <Card padding="none">
      <div className="space-y-4 p-3 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setCurrentPage(1);
              setSearchQuery(value);
            }}
            placeholder="Search by title, description, or button text..."
            aria-label="Search hero slides"
            wrapperClassName="sm:max-w-none sm:flex-1"
          />
          <Select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "active" | "inactive");
              setCurrentPage(1);
            }}
            className="sm:w-44"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        {/* Cards Grid */}
        {currentSlides.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {currentSlides.map((slide) => {
              const toggling = togglingStatus.has(slide._id);
              return (
                <div
                  key={slide._id}
                  className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50 transition-all duration-200 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] bg-stone-200">
                    {slide.imageUrl ? (
                      <Image
                        src={assetUrl(slide.imageUrl)}
                        alt={slide.ariaLabel || slide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-stone-400" aria-hidden />
                      </div>
                    )}
                    <span
                      className="absolute left-2 top-2 inline-flex items-center rounded-md bg-stone-900/85 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
                      title="Carousel order"
                    >
                      #{slide.order}
                    </span>
                    <span
                      className={cn(
                        "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset backdrop-blur-sm",
                        slide.isActive
                          ? "bg-emerald-50/95 text-emerald-700 ring-emerald-600/20"
                          : "bg-white/90 text-stone-600 ring-stone-500/20"
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", slide.isActive ? "bg-emerald-500" : "bg-stone-400")} aria-hidden />
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="truncate text-sm font-semibold text-stone-900" title={slide.title}>
                      {slide.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-500">{slide.description}</p>

                    {/* Buttons info */}
                    {(slide.buttonText || slide.secondButtonText) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {slide.buttonText && (
                          <span className="inline-flex max-w-full items-center truncate rounded-md bg-stone-900 px-2 py-0.5 text-[11px] font-medium text-white" title={slide.buttonLink}>
                            {slide.buttonText}
                          </span>
                        )}
                        {slide.secondButtonText && (
                          <span className="inline-flex max-w-full items-center truncate rounded-md border border-stone-300 bg-white px-2 py-0.5 text-[11px] font-medium text-stone-700" title={slide.secondButtonLink}>
                            {slide.secondButtonText}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex-1" aria-hidden />

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-2.5">
                      <div className="flex items-center gap-2">
                        {onToggleStatus && (
                          <>
                            <Switch
                              id={`slide-active-${slide._id}`}
                              checked={slide.isActive}
                              disabled={toggling}
                              onChange={() => handleToggleStatus(slide._id, slide.isActive)}
                            />
                            <label htmlFor={`slide-active-${slide._id}`} className="cursor-pointer text-xs text-stone-500">
                              <span className="sr-only">Show on homepage: </span>
                              {slide.isActive ? "Shown" : "Hidden"}
                            </label>
                            {toggling && <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-400" aria-label="Updating" />}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <IconButton
                          size="sm"
                          label="Edit slide"
                          icon={<Edit2 className="h-4 w-4" />}
                          onClick={() => onEdit?.(slide._id)}
                        />
                        <IconButton
                          size="sm"
                          tone="danger"
                          label="Delete slide"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => onDelete?.(slide._id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={ImageIcon}
            title="No hero slides found"
            description={hasFilters ? "Try adjusting your search criteria or filters." : "Get started by creating your first hero slide."}
            action={
              hasFilters && (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )
            }
          />
        )}

        {/* Pagination */}
        {sortedSlides.length > 0 && (
          <div className="border-t border-stone-200 pt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedSlides.length}
              pageSize={SLIDES_PER_PAGE}
              itemLabel="slides"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
