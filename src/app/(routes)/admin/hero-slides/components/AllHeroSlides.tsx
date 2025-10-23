"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiX, FiEye } from "react-icons/fi";
import { HeroSlide } from "../services/heroAdminService";

interface AllHeroSlidesProps {
  slides: HeroSlide[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function AllHeroSlides({ slides, onEdit, onDelete, onToggleStatus, loading = false, error = null }: AllHeroSlidesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | "gymwear" | "gymfolio">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingStatus, setTogglingStatus] = useState<Set<string>>(new Set());
  const slidesPerPage = 6;

  const filteredSlides = useMemo(() => {
    return slides.filter((slide) => {
      const matchesSearch = slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           slide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           slide.buttonText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           slide.secondButtonText?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" ||
                           (statusFilter === "active" && slide.isActive) ||
                           (statusFilter === "inactive" && !slide.isActive);

      const matchesPlatform = platformFilter === "all" || slide.platform === platformFilter;

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [slides, searchQuery, statusFilter, platformFilter]);

  const sortedSlides = useMemo(() => {
    return [...filteredSlides].sort((a, b) => {
      // First sort by platform
      if (a.platform < b.platform) return -1;
      if (a.platform > b.platform) return 1;
      // Then sort by order
      return a.order - b.order;
    });
  }, [filteredSlides]);

  const indexOfLast = currentPage * slidesPerPage;
  const indexOfFirst = indexOfLast - slidesPerPage;
  const currentSlides = sortedSlides.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedSlides.length / slidesPerPage) || 1;

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

  // Loading state
  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-gray-500">Loading hero slides...</span>
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
                <h3 className="text-sm font-medium text-red-800">Error loading hero slides</h3>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">Hero Slides Management</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {sortedSlides.length} of {slides.length} slides
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiEye className="h-4 w-4" />
                <span>{slides.length} Total</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{slides.filter(s => s.isActive).length} Active</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>{slides.filter(s => !s.isActive).length} Inactive</span>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search slides
              </label>
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  aria-label="Search hero slides"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search by title, description, or button text..."
                  value={searchQuery}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchQuery(e.target.value);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                  setCurrentPage(1);
                }}
                className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Platforms</option>
                <option value="gymwear">Gymwear</option>
                <option value="gymfolio">Gymfolio</option>
              </select>
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
                  setStatusFilter(e.target.value as "all" | "active" | "inactive");
                  setCurrentPage(1);
                }}
                className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentSlides.length > 0 ? (
          currentSlides.map((slide) => (
            <div key={slide._id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={slide.imageUrl.startsWith("http") ? slide.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.imageUrl}`}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900 bg-opacity-75 text-white">
                    Order: {slide.order}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    slide.platform === 'gymwear' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {slide.platform === 'gymwear' ? 'Gymwear' : 'Gymfolio'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate flex-1 mr-2">
                    {slide.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {slide.description}
                </p>
                
                {/* Buttons info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {slide.buttonText && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {slide.buttonText}
                    </span>
                  )}
                  {slide.secondButtonText && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                      {slide.secondButtonText}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {onToggleStatus && (
                      <button
                        onClick={() => handleToggleStatus(slide._id, slide.isActive)}
                        disabled={togglingStatus.has(slide._id)}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                          ${slide.isActive ? 'bg-green-600' : 'bg-gray-200'}
                          ${togglingStatus.has(slide._id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        title={`Click to ${slide.isActive ? 'deactivate' : 'activate'}`}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
                            ${slide.isActive ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                        {togglingStatus.has(slide._id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50" 
                      onClick={() => onEdit?.(slide._id)}
                      title="Edit slide"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" 
                      onClick={() => onDelete?.(slide._id)}
                      title="Delete slide"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <FiEye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hero slides found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== "all" || platformFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by creating your first hero slide."}
              </p>
              {(searchQuery || statusFilter !== "all" || platformFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPlatformFilter("all");
                    setCurrentPage(1);
                  }}
                  className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sortedSlides.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{sortedSlides.length === 0 ? 0 : indexOfFirst + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLast, sortedSlides.length)}</span> of{" "}
                <span className="font-medium">{sortedSlides.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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