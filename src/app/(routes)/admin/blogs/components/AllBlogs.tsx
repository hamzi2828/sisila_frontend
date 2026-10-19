"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Eye, EyeOff, FileText, Plus, Star, Trash2 } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  LoadingState,
  Pagination,
  SearchInput,
  Select,
  StatusBadge,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/productMedia";

export interface Blog {
  id: string;
  title: string;
  content?: string;
  category: string;
  categoryId: string;
  status: "published" | "draft";
  featured?: boolean;
  image: string;
  thumbnail?: string;
  slug: string;
  views?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  author: {
    _id: string;
    name?: string;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AllBlogsProps {
  blogs: Blog[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  onToggleStatus?: (id: string, status: 'published' | 'draft') => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCreate?: () => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : "Unknown date";

export default function AllBlogs({
  blogs,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  loading = false,
  error = null,
  onRetry,
  onCreate,
  pagination,
  onPageChange
}: AllBlogsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // Rows whose publish / feature toggle is in flight
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    return Array.from(new Set(blogs.map(b => b.category).filter(Boolean))).sort();
  }, [blogs]);

  // Client-side filtering of the current page
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return blogs.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(q) ||
                           blog.category.toLowerCase().includes(q) ||
                           blog.author?.name?.toLowerCase().includes(q) ||
                           blog.tags?.some(tag => tag.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchQuery, statusFilter, categoryFilter]);

  // Use pagination data from API if available
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || blogs.length;
  const hasFilters = Boolean(searchQuery) || statusFilter !== "all" || categoryFilter !== "all";

  const runToggle = async (key: string, action: () => unknown) => {
    setBusy((prev) => ({ ...prev, [key]: true }));
    try {
      await action();
    } finally {
      setBusy((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    onPageChange?.(1);
  };

  if (loading) {
    return <LoadingState card label="Loading blogs..." />;
  }

  if (error) {
    return (
      <Alert tone="error" title="Error loading blogs" onRetry={onRetry}>
        {error}
      </Alert>
    );
  }

  if (blogs.length === 0) {
    return (
      <EmptyState
        card
        icon={FileText}
        title="No blogs yet"
        description="Write your first post to start the journal."
        action={
          onCreate && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onCreate}>
              Create Blog
            </Button>
          )
        }
      />
    );
  }

  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount = blogs.filter(b => b.status === 'draft').length;

  return (
    <Card padding="none">
      <div className="space-y-4 p-3 sm:space-y-6 sm:p-6">
        {/* Stats & Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-1.5">
              <FileText className="h-4 w-4 text-stone-500" aria-hidden />
              <span className="text-xs font-medium text-stone-700 sm:text-sm">{totalItems} Total</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-xs font-medium text-emerald-700 sm:text-sm">{publishedCount} Published</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
              <span className="text-xs font-medium text-amber-700 sm:text-sm">{draftCount} Draft</span>
            </div>
            {filteredBlogs.length !== blogs.length && (
              <span className="text-xs text-stone-500 sm:text-sm">
                Showing {filteredBlogs.length} of {blogs.length} on this page
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-3">
            <SearchInput
              value={searchQuery}
              onChange={(value) => {
                onPageChange?.(1);
                setSearchQuery(value);
              }}
              placeholder="Search by title, author, category, tag..."
              aria-label="Search blogs"
              wrapperClassName="sm:max-w-none"
            />
            <Select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "published" | "draft");
                onPageChange?.(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
            <Select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                onPageChange?.(1);
              }}
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Blog list */}
        {filteredBlogs.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {filteredBlogs.map((blog) => {
              const cover = blog.thumbnail || blog.image;
              const published = blog.status === "published";
              return (
                <div
                  key={blog.id}
                  className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 sm:h-20 sm:w-20">
                      {cover ? (
                        <Image src={assetUrl(cover)} alt={blog.title} fill sizes="80px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText className="h-7 w-7 text-stone-300" aria-hidden />
                        </div>
                      )}
                      {blog.featured && (
                        <span className="absolute right-1 top-1 rounded-full bg-stone-900/90 p-1" title="Featured">
                          <Star className="h-3 w-3 fill-current text-white" aria-hidden />
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-stone-900 sm:text-base">{blog.title}</h3>
                          <p className="mt-0.5 truncate text-xs text-stone-500 sm:text-sm">
                            {blog.author?.name || 'Unknown Author'} • {formatDate(blog.createdAt)}
                          </p>
                        </div>
                        <StatusBadge status={blog.status} className="shrink-0" />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-3">
                        {blog.category && (
                          <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600">{blog.category}</span>
                        )}
                        {blog.featured && (
                          <Badge size="sm" tone="neutral">
                            <Star className="h-3 w-3 fill-current" aria-hidden />
                            Featured
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-xs text-stone-500">
                          <Eye className="h-3 w-3" aria-hidden />
                          {blog.views || 0} views
                        </span>
                        <span className="hidden truncate text-xs text-stone-400 md:inline">/blog/{blog.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5 border-t border-stone-100 pt-2 sm:border-0 sm:pt-0">
                    {onToggleStatus && (
                      <IconButton
                        label={published ? 'Unpublish (move to drafts)' : 'Publish'}
                        icon={published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        loading={busy[`status-${blog.id}`]}
                        onClick={() =>
                          runToggle(`status-${blog.id}`, () => onToggleStatus(blog.id, published ? 'draft' : 'published'))
                        }
                        className={cn(
                          published
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                        )}
                      />
                    )}
                    {onToggleFeatured && (
                      <IconButton
                        label={blog.featured ? 'Remove from featured' : 'Mark as featured'}
                        icon={<Star className={cn('h-4 w-4', blog.featured && 'fill-current')} />}
                        loading={busy[`featured-${blog.id}`]}
                        onClick={() => runToggle(`featured-${blog.id}`, () => onToggleFeatured(blog.id, !blog.featured))}
                        className={cn(
                          blog.featured
                            ? 'bg-stone-900 text-white hover:bg-stone-800 hover:text-white'
                            : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-700'
                        )}
                      />
                    )}
                    <IconButton
                      label="Edit"
                      icon={<Edit2 className="h-4 w-4" />}
                      onClick={() => onEdit?.(blog.id)}
                      className="bg-stone-100 text-stone-600 hover:bg-stone-200"
                    />
                    <IconButton
                      label="Delete"
                      tone="danger"
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => onDelete?.(blog.id)}
                      className="bg-stone-100 text-red-500 hover:bg-red-50 hover:text-red-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No blogs found"
            description={hasFilters ? "Try adjusting your search or filters." : "There are no blogs on this page."}
            action={
              hasFilters && (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        )}

        {/* Pagination */}
        {filteredBlogs.length > 0 && (
          <div className="border-t border-stone-200 pt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => onPageChange?.(page)}
              totalItems={totalItems}
              pageSize={pagination?.limit || 10}
              itemLabel="blogs"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
