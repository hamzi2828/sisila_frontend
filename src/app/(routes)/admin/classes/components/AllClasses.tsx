'use client';

import { FiEdit, FiTrash2, FiStar, FiToggleLeft, FiToggleRight, FiClock, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import type { GymClass } from '../services/classService';

interface AllClassesProps {
  classes: GymClass[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}

const AllClasses: React.FC<AllClassesProps> = ({
  classes,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  loading,
  error,
  pagination,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white shadow sm:rounded-lg px-4 py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No classes</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new class.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((gymClass) => (
          <div
            key={gymClass._id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              {gymClass.thumbnail ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${gymClass.thumbnail}`}
                  alt={gymClass.name}
                  width={400}
                  height={192}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-100 to-purple-100">
                  <svg className="h-16 w-16 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
                {gymClass.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <FiStar className="h-3 w-3 mr-1" />
                    Featured
                  </span>
                )}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  gymClass.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {gymClass.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {gymClass.category}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{gymClass.name}</h3>
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide">{gymClass.difficulty}</p>

              {gymClass.shortDescription && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gymClass.shortDescription}</p>
              )}

              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                {gymClass.duration && (
                  <div className="flex items-center gap-1">
                    <FiClock className="h-4 w-4" />
                    <span>{gymClass.duration} min</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FiUsers className="h-4 w-4" />
                  <span>{gymClass.capacity}</span>
                </div>
              </div>

              {gymClass.schedule && gymClass.schedule.length > 0 && (
                <div className="mb-3 text-xs text-gray-500">
                  <p className="font-medium">Schedule:</p>
                  <p className="line-clamp-2">
                    {gymClass.schedule.map(s => s.day).join(', ')}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleStatus(gymClass._id, !gymClass.isActive)}
                    className="text-gray-600 hover:text-gray-900"
                    title={gymClass.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {gymClass.isActive ? <FiToggleRight className="h-5 w-5" /> : <FiToggleLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => onToggleFeatured(gymClass._id, !gymClass.isFeatured)}
                    className={`${gymClass.isFeatured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-600`}
                    title={gymClass.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <FiStar className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(gymClass._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(gymClass._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (same as trainers) */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === pagination.page
                        ? 'z-10 bg-indigo-600 text-white'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllClasses;
