"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiX, FiEye, FiStar } from "react-icons/fi";

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
  platform?: "gymwear" | "gymfolio";
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
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}

export default function AllBlogs({
  blogs,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
  loading = false,
  error = null,
  pagination,
  onPageChange
}: AllBlogsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | "gymwear" | "gymfolio">("all");

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(blogs.map(b => b.category))).sort();
    return categories;
  }, [blogs]);

  // For now, we'll do client-side filtering but display all blogs from current page
  // In a production app, you'd want to send these filters to the API
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;
      const matchesPlatform = platformFilter === "all" || blog.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPlatform;
    });
  }, [blogs, searchQuery, statusFilter, categoryFilter, platformFilter]);

  // Use pagination data from API if available
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || blogs.length;

  // Loading state
  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-gray-500">Loading blogs...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading blogs</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Blog Management</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {filteredBlogs.length} of {totalItems} blogs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiEye className="h-4 w-4" />
                <span>{totalItems} Total</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{blogs.filter(b => b.status === 'published').length} Published</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>{blogs.filter(b => b.status === 'draft').length} Draft</span>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search blogs
              </label>
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  aria-label="Search blogs"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search by title, author, category..."
                  value={searchQuery}
                  onChange={(e) => {
                    onPageChange?.(1);
                    setSearchQuery(e.target.value);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      onPageChange?.(1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "all" | "published" | "draft");
                  onPageChange?.(1);
                }}
                className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                id="platform-filter"
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value as "all" | "gymwear" | "gymfolio");
                  onPageChange?.(1);
                }}
                className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Platforms</option>
                <option value="gymwear">Gymwear</option>
                <option value="gymfolio">Gymfolio</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  onPageChange?.(1);
                }}
                className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>

                    <th scope="col" className="relative px-3 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              {blog.thumbnail ? (
                                <Image
                                  src={blog.thumbnail.startsWith("http") ? blog.thumbnail : `${process.env.NEXT_PUBLIC_BACKEND_URL}${blog.thumbnail}`}
                                  alt={blog.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">No img</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                              <div className="text-sm text-gray-500">{blog.slug}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {blog.author?.name || 'Unknown Author'} • {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown Date'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{blog.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.platform === 'gymfolio'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {blog.platform === 'gymfolio' ? 'Gymfolio' : 'Gymwear'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {onToggleStatus ? (
                            <button
                              onClick={() => onToggleStatus(blog.id, blog.status === 'published' ? 'draft' : 'published')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                blog.status === 'published' ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              title={`Click to ${blog.status === 'published' ? 'unpublish (draft)' : 'publish'}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  blog.status === 'published' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {blog.status}
                            </span>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {blog.status === 'published' ? 'Published' : 'Draft'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blog.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {onToggleFeatured && (
                            <button
                              onClick={() => onToggleFeatured(blog.id, !blog.featured)}
                              className={`mr-4 transition-colors ${
                                blog.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600'
                              }`}
                              title={blog.featured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              <FiStar className={`h-5 w-5 ${blog.featured ? 'fill-current' : ''}`} />
                            </button>
                          )}
                          <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => onEdit?.(blog.id)}>
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" onClick={() => onDelete?.(blog.id)}>
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No blogs found. Try adjusting your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {filteredBlogs.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
              disabled={!pagination?.hasPreviousPage}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
              disabled={!pagination?.hasNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{blogs.length === 0 ? 0 : ((currentPage - 1) * (pagination?.limit || 10)) + 1}</span> to {" "}
                <span className="font-medium">{Math.min(currentPage * (pagination?.limit || 10), totalItems)}</span> of {" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
                  disabled={!pagination?.hasPreviousPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {/* Show page numbers with ellipsis for large page counts */}
                {(() => {
                  const pageNumbers = [];
                  const showEllipsisStart = currentPage > 3;
                  const showEllipsisEnd = currentPage < totalPages - 2;

                  // Always show first page
                  pageNumbers.push(
                    <button
                      key={1}
                      onClick={() => onPageChange?.(1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === 1
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      1
                    </button>
                  );

                  // Show ellipsis if needed
                  if (showEllipsisStart) {
                    pageNumbers.push(
                      <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }

                  // Show current page and neighbors
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (i === 1 || i === totalPages) continue;
                    pageNumbers.push(
                      <button
                        key={i}
                        onClick={() => onPageChange?.(i)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Show ellipsis if needed
                  if (showEllipsisEnd) {
                    pageNumbers.push(
                      <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }

                  // Always show last page if more than 1 page
                  if (totalPages > 1) {
                    pageNumbers.push(
                      <button
                        key={totalPages}
                        onClick={() => onPageChange?.(totalPages)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === totalPages
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pageNumbers;
                })()}

                <button
                  onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
                  disabled={!pagination?.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
